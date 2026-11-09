import type { JlptLevel, QuestionType } from "../generated/prisma/client.js";

export type StatRow = {
  qtype: QuestionType;
  correctCount: number;
  wrongCount: number;
  lastCorrect: boolean | null;
  lastAnsweredAt: Date | null;
  word: {
    id: number;
    kanji: string;
    reading: string;
    meaningsTh: string[];
    meaningsEn: string[];
    level: JlptLevel;
  };
};

export type StatsWord = {
  wordId: number;
  kanji: string;
  reading: string;
  meaningsTh: string[];
  meaningsEn: string[];
  level: JlptLevel;
  readCorrect: number;
  readWrong: number;
  meanCorrect: number;
  meanWrong: number;
  lastWrong: boolean;
  weak: boolean;
  lastAnsweredAt: string | null;
};

export type LevelStat = {
  level: JlptLevel;
  answered: number;
  correct: number;
  practicedWords: number;
  totalWords: number;
};

export type StatsSummary = {
  answered: number;
  correct: number;
  wrong: number;
  accuracy: number | null;
  practicedWords: number;
  totalWords: number;
  weakWords: number;
};

export type StatsResponse = {
  summary: StatsSummary;
  levels: LevelStat[];
  words: StatsWord[];
};
