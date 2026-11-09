import type { Lang, QuestionType } from "../generated/prisma/client.js";
import type { WordResponse } from "../types/word.js";
import { normalize } from "../utils/text.js";

type Meanings = Pick<WordResponse, "meaningsTh" | "meaningsEn">;

export const meaningsFor = (word: Meanings, lang: Lang): string[] =>
  lang === "en" ? word.meaningsEn : word.meaningsTh;

export const canAsk = (word: Meanings, qtype: QuestionType, lang: Lang): boolean =>
  qtype === "read" || meaningsFor(word, lang).length > 0;

export const correctAnswerText = (word: WordResponse, qtype: QuestionType, lang: Lang): string =>
  qtype === "read" ? word.reading : (meaningsFor(word, lang)[0] ?? "");

export const isCorrect = (word: WordResponse, qtype: QuestionType, given: string, lang: Lang): boolean => {
  if (qtype === "read") {
    const answer = normalize(given);
    return answer !== "" && normalize(word.reading) === answer;
  }

  const answer = normalize(given, lang);
  return answer !== "" && meaningsFor(word, lang).some((m) => normalize(m, lang) === answer);
};

export const shuffle = <T>(items: T[], random: () => number = Math.random): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const buildChoices = (
  word: WordResponse,
  qtype: QuestionType,
  lang: Lang,
  distractors: string[],
  count: number,
): string[] => {
  const correct = correctAnswerText(word, qtype, lang);
  const key = (text: string): string => normalize(text, qtype === "mean" ? lang : undefined);
  const used = new Set([key(correct)]);
  if (qtype === "mean") meaningsFor(word, lang).forEach((m) => used.add(key(m)));

  const choices = [correct];
  for (const option of distractors) {
    if (choices.length === count) break;
    const k = key(option);
    if (!k || used.has(k)) continue;
    used.add(k);
    choices.push(option);
  }

  return shuffle(choices);
};
