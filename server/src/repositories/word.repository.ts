import { prisma } from "../config/prisma.js";
import { Prisma, type JlptLevel } from "../generated/prisma/client.js";
import type { LevelCounts, WordInput, WordListQuery, WordResponse } from "../types/word.js";

const wordSelect = {
  id: true,
  kanji: true,
  reading: true,
  meaningsTh: true,
  meaningsEn: true,
  level: true,
} as const;

const LevelOrder: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

const searchCondition = (search: string): Prisma.Sql => {
  if (!search) return Prisma.sql`TRUE`;

  const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;

  return Prisma.sql`(
    "kanji" ILIKE ${pattern}
    OR "reading" ILIKE ${pattern}
    OR array_to_string("meanings_th", ' ') ILIKE ${pattern}
    OR array_to_string("meanings_en", ' ') ILIKE ${pattern}
  )`;
};

const levelOrderBy = Prisma.sql`array_position(ARRAY[${Prisma.join(LevelOrder)}]::"jlpt_level"[], "level")`;

const levelCondition = (level?: JlptLevel): Prisma.Sql =>
  level ? Prisma.sql`"level" = ${level}::"jlpt_level"` : Prisma.sql`TRUE`;

export const wordRepository = {
  getAll: async ({ page, pageSize, search, level }: WordListQuery): Promise<[WordResponse[], number]> => {
    const where = Prisma.sql`WHERE ${searchCondition(search)} AND ${levelCondition(level)}`;

    const [items, [{ total }]] = await Promise.all([
      prisma.$queryRaw<WordResponse[]>`
        SELECT "id", "kanji", "reading", "meanings_th" AS "meaningsTh", "meanings_en" AS "meaningsEn", "level"
        FROM "words" ${where}
        ORDER BY ${levelOrderBy}, "id"
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
      prisma.$queryRaw<{ total: bigint }[]>`SELECT COUNT(*) AS "total" FROM "words" ${where}`,
    ]);

    return [items, Number(total)];
  },

  getLevelCounts: async (search: string): Promise<LevelCounts> => {
    const rows = await prisma.$queryRaw<{ level: JlptLevel; count: bigint }[]>`
      SELECT "level", COUNT(*) AS "count" FROM "words" WHERE ${searchCondition(search)} GROUP BY "level"`;
    const counts = new Map(rows.map((r) => [r.level, Number(r.count)]));

    return Object.fromEntries(LevelOrder.map((l) => [l, counts.get(l) ?? 0])) as LevelCounts;
  },

  getByKanjiReading: (kanji: string, reading: string): Promise<WordResponse | null> =>
    prisma.word.findUnique({ where: { kanji_reading: { kanji, reading } }, select: wordSelect }),

  existsWithKanjiReading: async (kanji: string, reading: string, excludeId: number): Promise<boolean> =>
    (await prisma.word.count({ where: { kanji, reading, NOT: { id: excludeId } } })) > 0,

  createIfAbsent: async (data: WordInput, actor: string): Promise<boolean> => {
    const result = await prisma.word.createMany({
      data: [{ ...data, createdBy: actor, updatedBy: actor }],
      skipDuplicates: true,
    });

    return result.count > 0;
  },

  update: async (id: number, data: WordInput, actor: string): Promise<WordResponse | null> => {
    const result = await prisma.word.updateMany({ where: { id }, data: { ...data, updatedBy: actor } });
    if (result.count === 0) return null;

    return prisma.word.findUnique({ where: { id }, select: wordSelect });
  },

  remove: async (id: number): Promise<boolean> => {
    const result = await prisma.word.deleteMany({ where: { id } });

    return result.count > 0;
  },
};
