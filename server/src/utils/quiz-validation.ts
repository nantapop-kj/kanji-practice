import { ErrorCode, HttpStatus } from "../constants/http.js";
import { AnswerMaxLength, ExcludeMaxItems, QuestionTypeFilter } from "../constants/quiz.js";
import { AnswerMode, JlptLevel, Lang, QuestionType } from "../generated/prisma/enums.js";
import type { AnswerRequest, NextQuestionQuery, OverrideRequest } from "../types/quiz.js";
import { HttpError } from "./http-error.js";
import { parseWordId } from "./word-validation.js";

const Levels = Object.values(JlptLevel);

const invalid = (code: ErrorCode, message: string): HttpError =>
  new HttpError(HttpStatus.BadRequest, code, message);

const toText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T | undefined, error: HttpError): T => {
  const text = toText(value).toLowerCase();
  if (!text && fallback !== undefined) return fallback;
  if (!allowed.includes(text as T)) throw error;
  return text as T;
};

const parseMode = (value: unknown, fallback?: AnswerMode): AnswerMode =>
  oneOf(value, Object.values(AnswerMode), fallback, invalid(ErrorCode.QuizModeInvalid, "Mode must be choice or typing"));

const parseLang = (value: unknown): Lang =>
  oneOf(value, Object.values(Lang), Lang.th, invalid(ErrorCode.QuizLangInvalid, "Language must be th or en"));

const parseQuestionType = (value: unknown): QuestionType =>
  oneOf(value, Object.values(QuestionType), undefined, invalid(ErrorCode.QuizTypeInvalid, "Question type must be read or mean"));

const parseLevels = (value: unknown): JlptLevel[] => {
  const wanted = toText(value)
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const unknown = wanted.find((l) => !Levels.includes(l as JlptLevel));
  if (unknown) throw invalid(ErrorCode.LevelInvalid, `Level must be one of ${Levels.join(", ")}`);

  return Levels.filter((l) => wanted.includes(l));
};

const parseExclude = (value: unknown): number[] =>
  toText(value)
    .split(",")
    .map(Number)
    .filter((n) => Number.isSafeInteger(n) && n > 0)
    .slice(-ExcludeMaxItems);

export const parseNextQuestionQuery = (query: Record<string, unknown>): NextQuestionQuery => {
  const type = oneOf(
    query.type,
    Object.values(QuestionTypeFilter),
    QuestionTypeFilter.Mix,
    invalid(ErrorCode.QuizTypeInvalid, "Question type must be mix, read or mean"),
  );
  const focus = toText(query.focus);

  return {
    mode: parseMode(query.mode, AnswerMode.choice),
    type,
    lang: parseLang(query.lang),
    focus: focus === "" || focus === "1" || focus === "true",
    levels: parseLevels(query.levels),
    exclude: parseExclude(query.exclude),
  };
};

const parseBodyWordId = (value: unknown): number => parseWordId(typeof value === "number" ? String(value) : value);

export const parseAnswerRequest = (body: unknown): AnswerRequest => {
  const data = (body ?? {}) as Record<string, unknown>;
  const answer = typeof data.answer === "string" ? data.answer : "";

  if (answer.length > AnswerMaxLength) {
    throw invalid(ErrorCode.QuizAnswerInvalid, `Answer must be at most ${AnswerMaxLength} characters`);
  }

  return {
    wordId: parseBodyWordId(data.wordId),
    qtype: parseQuestionType(data.qtype),
    mode: parseMode(data.mode),
    lang: parseLang(data.lang),
    answer,
  };
};

export const parseOverrideRequest = (body: unknown): OverrideRequest => {
  const data = (body ?? {}) as Record<string, unknown>;

  return { wordId: parseBodyWordId(data.wordId), qtype: parseQuestionType(data.qtype) };
};
