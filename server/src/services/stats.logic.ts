import { WeakAccuracyThreshold } from "../constants/stats.js";
import type { JlptLevel } from "../generated/prisma/client.js";
import type { LevelStat, StatRow, StatsWord } from "../types/stats.js";

const LevelOrder: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

const totalOf = (w: StatsWord): number => w.readCorrect + w.readWrong + w.meanCorrect + w.meanWrong;
const wrongOf = (w: StatsWord): number => w.readWrong + w.meanWrong;
const accuracyOf = (w: StatsWord): number => (totalOf(w) ? (totalOf(w) - wrongOf(w)) / totalOf(w) : 1);

export const isWeak = (w: Omit<StatsWord, "weak">): boolean => {
  const wrong = w.readWrong + w.meanWrong;
  const total = w.readCorrect + w.meanCorrect + wrong;

  return wrong > 0 && ((total - wrong) / total < WeakAccuracyThreshold || w.lastWrong);
};

export const aggregateByWord = (rows: StatRow[]): StatsWord[] => {
  const byWord = new Map<number, StatsWord>();

  for (const row of rows) {
    const word = byWord.get(row.word.id) ?? {
      wordId: row.word.id,
      kanji: row.word.kanji,
      reading: row.word.reading,
      meaningsTh: row.word.meaningsTh,
      meaningsEn: row.word.meaningsEn,
      level: row.word.level,
      readCorrect: 0,
      readWrong: 0,
      meanCorrect: 0,
      meanWrong: 0,
      lastWrong: false,
      weak: false,
      lastAnsweredAt: null,
    };

    if (row.qtype === "read") {
      word.readCorrect += row.correctCount;
      word.readWrong += row.wrongCount;
    } else {
      word.meanCorrect += row.correctCount;
      word.meanWrong += row.wrongCount;
    }
    if (row.lastCorrect === false) word.lastWrong = true;

    const answeredAt = row.lastAnsweredAt?.toISOString() ?? null;
    if (answeredAt && (!word.lastAnsweredAt || answeredAt > word.lastAnsweredAt)) word.lastAnsweredAt = answeredAt;

    byWord.set(word.wordId, word);
  }

  return [...byWord.values()]
    .filter((w) => totalOf(w) > 0)
    .map((w) => ({ ...w, weak: isWeak(w) }))
    .sort(
      (a, b) =>
        Number(b.weak) - Number(a.weak) ||
        wrongOf(b) - wrongOf(a) ||
        accuracyOf(a) - accuracyOf(b) ||
        a.wordId - b.wordId,
    );
};

export const levelBreakdown = (words: StatsWord[], totals: Map<JlptLevel, number>): LevelStat[] =>
  LevelOrder.map((level) => {
    const inLevel = words.filter((w) => w.level === level);
    const answered = inLevel.reduce((n, w) => n + totalOf(w), 0);
    const correct = inLevel.reduce((n, w) => n + totalOf(w) - wrongOf(w), 0);

    return { level, answered, correct, practicedWords: inLevel.length, totalWords: totals.get(level) ?? 0 };
  });
