import type { Request, Response } from "express";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { LogEvent } from "../constants/log.js";
import { quizService } from "../services/quiz.service.js";
import type { AnswerRequest, AnswerResponse, OverrideRequest, QuestionResponse, StatResponse } from "../types/quiz.js";
import type { BodyRequest } from "../types/auth.js";
import { HttpError } from "../utils/http-error.js";
import { logFailure } from "../utils/log.js";
import { parseAnswerRequest, parseNextQuestionQuery, parseOverrideRequest } from "../utils/quiz-validation.js";

const userIdOf = (req: Request): string => {
  if (!req.user) throw new HttpError(HttpStatus.Unauthorized, ErrorCode.Unauthorized, "Authentication required");

  return req.user.id;
};

export const quizController = {
  async next(req: Request, res: Response<QuestionResponse>): Promise<void> {
    try {
      res.json(await quizService.next(userIdOf(req), parseNextQuestionQuery(req.query)));
    } catch (err) {
      throw logFailure(req, LogEvent.QuizNextFailed, "Get next question failed", err);
    }
  },

  async answer(req: BodyRequest<AnswerRequest>, res: Response<AnswerResponse>): Promise<void> {
    try {
      const input = parseAnswerRequest(req.body);
      const result = await quizService.answer(userIdOf(req), input);
      
      req.log.debug("Quiz answered", {
        event: LogEvent.QuizAnswer,
        userId: req.user?.id,
        wordId: input.wordId,
        qtype: input.qtype,
        correct: result.correct,
      });

      res.json(result);
    } catch (err) {
      throw logFailure(req, LogEvent.QuizAnswerFailed, "Submit answer failed", err);
    }
  },

  async override(req: BodyRequest<OverrideRequest>, res: Response<{ stat: StatResponse }>): Promise<void> {
    try {
      const { wordId, qtype } = parseOverrideRequest(req.body);
      const stat = await quizService.override(userIdOf(req), wordId, qtype);
      req.log.info("Answer marked correct", { event: LogEvent.QuizOverride, userId: req.user?.id, wordId, qtype });

      res.json({ stat });
    } catch (err) {
      throw logFailure(req, LogEvent.QuizOverrideFailed, "Override answer failed", err);
    }
  },
};
