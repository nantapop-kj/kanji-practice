import type { AnswerMode, JlptLevel, Lang, QuestionType } from "../generated/prisma/client.js";
import type { QuestionTypeFilter } from "../constants/quiz.js";
import type { WordResponse } from "./word.js";

export type NextQuestionQuery = {
  mode: AnswerMode;
  type: QuestionTypeFilter;
  lang: Lang;
  focus: boolean;
  levels: JlptLevel[];
  exclude: number[];
};

export type QuestionResponse = {
  wordId: number;
  kanji: string;
  level: JlptLevel;
  qtype: QuestionType;
  mode: AnswerMode;
  lang: Lang;
  choices?: string[];
  wrongCount: number;
};

export type AnswerRequest = {
  wordId: number;
  qtype: QuestionType;
  mode: AnswerMode;
  lang: Lang;
  answer: string;
};

export type OverrideRequest = {
  wordId: number;
  qtype: QuestionType;
};

export type StatResponse = {
  correctCount: number;
  wrongCount: number;
  lastCorrect: boolean | null;
};

export type AnswerResponse = {
  correct: boolean;
  correctAnswer: string;
  word: WordResponse;
  stat: StatResponse;
  canOverride: boolean;
};

export type QuizCandidate = {
  id: number;
  kanji: string;
  reading: string;
  level: JlptLevel;
  qtype: QuestionType;
  wrongCount: number;
};
