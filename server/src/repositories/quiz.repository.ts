import { prisma } from "../config/prisma.js";
import { Prisma, type JlptLevel, type Lang, type QuestionType } from "../generated/prisma/client.js";
import type { AnswerRequest, QuizCandidate, StatResponse } from "../types/quiz.js";

type Tx = Prisma.TransactionClient;

const statSelect = { correctCount: true, wrongCount: true, lastCorrect: true } as const;

const meaningsColumn = (lang: Lang): Prisma.Sql =>
  lang === "en" ? Prisma.sql`w."meanings_en"` : Prisma.sql`w."meanings_th"`;

const levelFilter = (levels: JlptLevel[]): Prisma.Sql =>
  levels.length ? Prisma.sql`w."level" = ANY(ARRAY[${Prisma.join(levels)}]::"jlpt_level"[])` : Prisma.sql`TRUE`;

const weightExpression = (focus: boolean): Prisma.Sql =>
  focus
    ? Prisma.sql`CASE
        WHEN s."user_id" IS NULL OR s."correct_count" + s."wrong_count" = 0 THEN 1.6
        ELSE LEAST(25, GREATEST(0.25,
          1 + s."wrong_count" * 2.5 - s."correct_count" * 0.6
          + CASE WHEN s."last_correct" = FALSE THEN 3 ELSE 0 END))
      END`
    : Prisma.sql`1`;

export const quizRepository = {
  countPools: async (levels: JlptLevel[], lang: Lang): Promise<{ read: number; mean: number }> => {
    const [row] = await prisma.$queryRaw<{ read: bigint; mean: bigint }[]>`
      SELECT COUNT(*) AS "read", COUNT(*) FILTER (WHERE cardinality(${meaningsColumn(lang)}) > 0) AS "mean"
      FROM "words" w WHERE ${levelFilter(levels)}`;

    return { read: Number(row.read), mean: Number(row.mean) };
  },

  pickCandidate: async (input: {
    userId: string;
    levels: JlptLevel[];
    qtypes: QuestionType[];
    lang: Lang;
    focus: boolean;
    exclude: number[];
  }): Promise<QuizCandidate | null> => {
    const excludeFilter = input.exclude.length
      ? Prisma.sql`AND NOT (w."id" = ANY(ARRAY[${Prisma.join(input.exclude)}]::int[]))`
      : Prisma.empty;

    const [row] = await prisma.$queryRaw<(Omit<QuizCandidate, "wrongCount"> & { wrongCount: number | null })[]>`
      SELECT w."id", w."kanji", w."reading", w."level", q."qtype", s."wrong_count" AS "wrongCount"
      FROM "words" w
      CROSS JOIN unnest(ARRAY[${Prisma.join(input.qtypes)}]::"question_type"[]) AS q("qtype")
      LEFT JOIN "user_word_stats" s
        ON s."user_id" = ${input.userId}::uuid AND s."word_id" = w."id" AND s."qtype" = q."qtype"
      WHERE ${levelFilter(input.levels)}
        AND (q."qtype" = 'read' OR cardinality(${meaningsColumn(input.lang)}) > 0)
        ${excludeFilter}
      ORDER BY -ln(1 - random()) / (${weightExpression(input.focus)})
      LIMIT 1`;

    return row ? { ...row, wrongCount: row.wrongCount ?? 0 } : null;
  },

  readingDistractors: async (wordId: number, reading: string, levels: JlptLevel[], limit: number): Promise<string[]> => {
    const rows = await prisma.$queryRaw<{ option: string }[]>`
      SELECT w."reading" AS "option" FROM "words" w
      WHERE ${levelFilter(levels)} AND w."id" <> ${wordId} AND w."reading" <> ${reading}
      ORDER BY abs(char_length(w."reading") - ${reading.length}) + random() * 1.5
      LIMIT ${limit}`;

    return rows.map((r) => r.option);
  },

  meaningDistractors: async (wordId: number, lang: Lang, levels: JlptLevel[], limit: number): Promise<string[]> => {
    const rows = await prisma.$queryRaw<{ option: string }[]>`
      SELECT (${meaningsColumn(lang)})[1] AS "option" FROM "words" w
      WHERE ${levelFilter(levels)} AND w."id" <> ${wordId} AND cardinality(${meaningsColumn(lang)}) > 0
      ORDER BY random()
      LIMIT ${limit}`;

    return rows.map((r) => r.option);
  },

  recordAnswer: (input: AnswerRequest & { userId: string; correct: boolean }): Promise<StatResponse> =>
    prisma.$transaction(async (tx: Tx) => {
      const { userId, wordId, qtype, mode, lang, answer, correct } = input;
      const now = new Date();

      await tx.answerLog.create({
        data: { userId, wordId, qtype, mode, lang, given: answer, isCorrect: correct },
      });

      return tx.userWordStat.upsert({
        where: { userId_wordId_qtype: { userId, wordId, qtype } },
        create: {
          userId,
          wordId,
          qtype,
          correctCount: correct ? 1 : 0,
          wrongCount: correct ? 0 : 1,
          lastCorrect: correct,
          lastAnsweredAt: now,
        },
        update: {
          correctCount: { increment: correct ? 1 : 0 },
          wrongCount: { increment: correct ? 0 : 1 },
          lastCorrect: correct,
          lastAnsweredAt: now,
        },
        select: statSelect,
      });
    }),

  overrideLastAnswer: (userId: string, wordId: number, qtype: QuestionType, windowMinutes: number) =>
    prisma.$transaction(async (tx: Tx): Promise<StatResponse | null> => {
      const last = await tx.answerLog.findFirst({
        where: { userId, wordId, qtype, createdAt: { gt: new Date(Date.now() - windowMinutes * 60_000) } },
        orderBy: { createdAt: "desc" },
        select: { id: true, isCorrect: true, overridden: true, mode: true },
      });
      if (!last || last.isCorrect || last.overridden || last.mode !== "typing") return null;

      const marked = await tx.answerLog.updateMany({
        where: { id: last.id, isCorrect: false, overridden: false },
        data: { isCorrect: true, overridden: true },
      });
      if (marked.count !== 1) return null;

      const flipped = await tx.userWordStat.updateMany({
        where: { userId, wordId, qtype, wrongCount: { gt: 0 } },
        data: { wrongCount: { decrement: 1 }, correctCount: { increment: 1 }, lastCorrect: true },
      });
      if (flipped.count !== 1) return null;

      return tx.userWordStat.findUnique({
        where: { userId_wordId_qtype: { userId, wordId, qtype } },
        select: statSelect,
      });
    }),
};
