import { ErrorCode, HttpStatus } from "../constants/http.js";
import { ChoiceCount, DistractorPoolSize, OverrideWindowMinutes, QuestionTypeFilter } from "../constants/quiz.js";
import type { QuestionType } from "../generated/prisma/client.js";
import { quizRepository } from "../repositories/quiz.repository.js";
import { wordRepository } from "../repositories/word.repository.js";
import type { AnswerRequest, AnswerResponse, NextQuestionQuery, QuestionResponse, StatResponse } from "../types/quiz.js";
import { HttpError } from "../utils/http-error.js";
import { buildChoices, canAsk, correctAnswerText, isCorrect } from "./quiz.logic.js";

const notEnoughWords = (): HttpError =>
  new HttpError(
    HttpStatus.Conflict,
    ErrorCode.NotEnoughWords,
    `At least ${ChoiceCount} words are needed for the selected levels`,
  );

const requestedTypes = ({ mode, type }: NextQuestionQuery): QuestionType[] => {
  if (mode === "typing") return ["mean"];
  if (type === QuestionTypeFilter.Mix) return ["read", "mean"];
  return [type === QuestionTypeFilter.Read ? "read" : "mean"];
};

export const quizService = {
  async next(userId: string, query: NextQuestionQuery): Promise<QuestionResponse> {
    const pools = await quizRepository.countPools(query.levels, query.lang);
    const minPool = query.mode === "choice" ? ChoiceCount : 1;
    const qtypes = requestedTypes(query).filter((t) => (t === "read" ? pools.read : pools.mean) >= minPool);
    if (qtypes.length === 0) throw notEnoughWords();

    const pick = { userId, levels: query.levels, qtypes, lang: query.lang, focus: query.focus };
    const candidate =
      (await quizRepository.pickCandidate({ ...pick, exclude: query.exclude })) ??
      (await quizRepository.pickCandidate({ ...pick, exclude: [] }));
    if (!candidate) throw notEnoughWords();

    const question: QuestionResponse = {
      wordId: candidate.id,
      kanji: candidate.kanji,
      level: candidate.level,
      qtype: candidate.qtype,
      mode: query.mode,
      lang: query.lang,
      wrongCount: candidate.wrongCount,
    };
    if (query.mode !== "choice") return question;

    const word = await wordRepository.getById(candidate.id);
    if (!word) throw notEnoughWords();

    const loadDistractors = (levels: typeof query.levels) =>
      candidate.qtype === "read"
        ? quizRepository.readingDistractors(word.id, word.reading, levels, DistractorPoolSize)
        : quizRepository.meaningDistractors(word.id, query.lang, levels, DistractorPoolSize);

    let choices = buildChoices(word, candidate.qtype, query.lang, await loadDistractors(query.levels), ChoiceCount);
    if (choices.length < ChoiceCount && query.levels.length) {
      choices = buildChoices(word, candidate.qtype, query.lang, await loadDistractors([]), ChoiceCount);
    }

    return { ...question, choices };
  },

  async answer(userId: string, input: AnswerRequest): Promise<AnswerResponse> {
    if (input.mode === "typing" && input.qtype !== "mean") {
      throw new HttpError(HttpStatus.BadRequest, ErrorCode.QuizTypeInvalid, "Typing mode only supports meaning questions");
    }

    const word = await wordRepository.getById(input.wordId);
    if (!word) {
      throw new HttpError(HttpStatus.NotFound, ErrorCode.WordNotFound, "Word not found");
    }
    
    if (!canAsk(word, input.qtype, input.lang)) {
      throw new HttpError(HttpStatus.BadRequest, ErrorCode.NoMeaningInLang, "This word has no meaning in this language");
    }

    const correct = isCorrect(word, input.qtype, input.answer, input.lang);
    const stat = await quizRepository.recordAnswer({ ...input, userId, correct });

    return {
      correct,
      correctAnswer: correctAnswerText(word, input.qtype, input.lang),
      word,
      stat,
      canOverride: !correct && input.mode === "typing",
    };
  },

  async override(userId: string, wordId: number, qtype: QuestionType): Promise<StatResponse> {
    const stat = await quizRepository.overrideLastAnswer(userId, wordId, qtype, OverrideWindowMinutes);
    if (!stat) {
      throw new HttpError(
        HttpStatus.Conflict,
        ErrorCode.OverrideDenied,
        "Only your latest wrong typed answer from the last few minutes can be marked correct",
      );
    }

    return stat;
  },
};
