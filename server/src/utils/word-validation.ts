import { ErrorCode, HttpStatus } from "../constants/http.js";
import { JlptLevel } from "../generated/prisma/enums.js";
import type { WordInput, WordListQuery } from "../types/word.js";
import { HttpError } from "./http-error.js";
import { parsePaginationQuery } from "./pagination.js";

const KanjiMaxLength = 50;
const SearchMaxLength = 100;
const ReadingMaxLength = 100;
const MeaningMaxLength = 255;
const MeaningMaxItems = 20;

const JapaneseRegex = /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー・〜]+$/u;
const KanaRegex = /^[\p{Script=Hiragana}\p{Script=Katakana}ー・\s]+$/u;
const ThaiRegex = /^[\p{Script=Thai}0-9\s().,'"!?~\-]+$/u;
const HasThai = /\p{Script=Thai}/u;
const EnglishRegex = /^[A-Za-z0-9\s().,'"!?~;:&\-]+$/;
const HasEnglish = /[A-Za-z]/;
const MeaningSeparator = /[/|]/;
const Levels = Object.values(JlptLevel);

const invalid = (code: ErrorCode, message: string): HttpError =>
  new HttpError(HttpStatus.BadRequest, code, message);

const toText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

type MeaningRule = { pattern: RegExp; required: RegExp; code: ErrorCode; message: string };

const ThaiRule: MeaningRule = {
  pattern: ThaiRegex,
  required: HasThai,
  code: ErrorCode.MeaningThInvalid,
  message: "Thai meaning must be written in Thai",
};

const EnglishRule: MeaningRule = {
  pattern: EnglishRegex,
  required: HasEnglish,
  code: ErrorCode.MeaningEnInvalid,
  message: "English meaning must be written in English",
};

const parseMeanings = (value: unknown, rule: MeaningRule): string[] => {
  const parts = Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : toText(value).split(MeaningSeparator);
  const meanings = [...new Set(parts.map((s) => s.trim()).filter(Boolean))];

  if (meanings.length > MeaningMaxItems || meanings.some((m) => m.length > MeaningMaxLength)) {
    throw invalid(
      ErrorCode.MeaningInvalid,
      `Use at most ${MeaningMaxItems} meanings, each up to ${MeaningMaxLength} characters`,
    );
  }

  if (meanings.some((m) => !rule.pattern.test(m) || !rule.required.test(m))) {
    throw invalid(rule.code, rule.message);
  }

  return meanings;
};

const parseLevel = (value: unknown): JlptLevel => {
  const level = toText(value).toUpperCase();
  if (!level) return JlptLevel.N5;

  if (!Levels.includes(level as JlptLevel)) {
    throw invalid(ErrorCode.LevelInvalid, `Level must be one of ${Levels.join(", ")}`);
  }

  return level as JlptLevel;
};

export const parseWordInput = (body: unknown): WordInput => {
  const data = (body ?? {}) as Record<string, unknown>;
  const kanji = toText(data.kanji);
  const reading = toText(data.reading);

  if (!kanji) throw invalid(ErrorCode.KanjiRequired, "Kanji is required");
  if (kanji.length > KanjiMaxLength || !JapaneseRegex.test(kanji)) {
    throw invalid(
      ErrorCode.KanjiInvalid,
      `Kanji must be written in Japanese (kanji or kana), at most ${KanjiMaxLength} characters`,
    );
  }

  if (!reading) throw invalid(ErrorCode.ReadingRequired, "Reading is required");
  if (reading.length > ReadingMaxLength || !KanaRegex.test(reading)) {
    throw invalid(ErrorCode.ReadingInvalid, "Reading must be written in hiragana or katakana");
  }

  const meaningsTh = parseMeanings(data.meaningsTh, ThaiRule);
  const meaningsEn = parseMeanings(data.meaningsEn, EnglishRule);
  if (meaningsTh.length === 0 && meaningsEn.length === 0) {
    throw invalid(ErrorCode.MeaningRequired, "Enter a meaning in at least one language");
  }

  return { kanji, reading, meaningsTh, meaningsEn, level: parseLevel(data.level) };
};

export const parseWordId = (value: unknown): number => {
  const id = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;

  if (!Number.isSafeInteger(id) || id < 1) {
    throw invalid(ErrorCode.WordIdInvalid, "Word id must be a positive integer");
  }

  return id;
};

export const parseWordListQuery = (query: Record<string, unknown>): WordListQuery => {
  const search = toText(query.search).slice(0, SearchMaxLength);
  const level = toText(query.level) ? parseLevel(query.level) : undefined;

  return { ...parsePaginationQuery(query), search, level };
};
