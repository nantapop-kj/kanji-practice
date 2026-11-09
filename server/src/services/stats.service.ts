import { StatsWordLimit } from "../constants/stats.js";
import { statsRepository } from "../repositories/stats.repository.js";
import type { StatsResponse } from "../types/stats.js";
import { aggregateByWord, levelBreakdown } from "./stats.logic.js";

export const statsService = {
  async getForUser(userId: string): Promise<StatsResponse> {
    const [rows, totals] = await Promise.all([
      statsRepository.getRowsForUser(userId),
      statsRepository.countWordsByLevel(),
    ]);
    const words = aggregateByWord(rows);
    const correct = rows.reduce((n, r) => n + r.correctCount, 0);
    const wrong = rows.reduce((n, r) => n + r.wrongCount, 0);
    const answered = correct + wrong;

    return {
      summary: {
        answered,
        correct,
        wrong,
        accuracy: answered ? correct / answered : null,
        practicedWords: words.length,
        totalWords: [...totals.values()].reduce((a, b) => a + b, 0),
        weakWords: words.filter((w) => w.weak).length,
      },
      levels: levelBreakdown(words, totals),
      words: words.slice(0, StatsWordLimit),
    };
  },

  resetForUser: (userId: string): Promise<void> => statsRepository.resetForUser(userId),
};
