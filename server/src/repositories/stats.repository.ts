import { prisma } from "../config/prisma.js";
import type { JlptLevel } from "../generated/prisma/client.js";
import type { StatRow } from "../types/stats.js";

export const statsRepository = {
  getRowsForUser: (userId: string): Promise<StatRow[]> =>
    prisma.userWordStat.findMany({
      where: { userId },
      select: {
        qtype: true,
        correctCount: true,
        wrongCount: true,
        lastCorrect: true,
        lastAnsweredAt: true,
        word: { select: { id: true, kanji: true, reading: true, meaningsTh: true, meaningsEn: true, level: true } },
      },
    }),

  countWordsByLevel: async (): Promise<Map<JlptLevel, number>> => {
    const rows = await prisma.word.groupBy({ by: ["level"], _count: { _all: true } });

    return new Map(rows.map((r) => [r.level, r._count._all]));
  },

  resetForUser: async (userId: string): Promise<void> => {
    await prisma.$transaction([
      prisma.userWordStat.deleteMany({ where: { userId } }),
      prisma.answerLog.deleteMany({ where: { userId } }),
    ]);
  },
};
