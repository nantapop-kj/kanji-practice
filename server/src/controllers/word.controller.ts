import type { Request, Response } from "express";
import { ErrorCode, HttpStatus } from "../constants/http.js";
import { LogEvent } from "../constants/log.js";
import { wordService } from "../services/word.service.js";
import type { WordInput, WordListResponse, WordRequest, WordResponse } from "../types/word.js";
import { HttpError } from "../utils/http-error.js";
import { logFailure } from "../utils/log.js";
import { parseWordId, parseWordInput, parseWordListQuery } from "../utils/word-validation.js";

const actorOf = (req: Request): string => {
  if (!req.user) throw new HttpError(HttpStatus.Unauthorized, ErrorCode.Unauthorized, "Authentication required");

  return req.user.id;
};

export const wordController = {
  async getAll(req: Request, res: Response<WordListResponse>): Promise<void> {
    try {
      res.json(await wordService.getAll(parseWordListQuery(req.query)));
    } catch (err) {
      throw logFailure(req, LogEvent.WordListFailed, "List words failed", err);
    }
  },

  async create(req: WordRequest<WordInput>, res: Response<{ word: WordResponse }>): Promise<void> {
    try {
      const word = await wordService.create(parseWordInput(req.body), actorOf(req));
      req.log.info("Word created", { event: LogEvent.WordCreate, userId: req.user?.id, wordId: word.id });

      res.status(HttpStatus.Created).json({ word });
    } catch (err) {
      throw logFailure(req, LogEvent.WordCreateFailed, "Create word failed", err);
    }
  },

  async update(req: WordRequest<WordInput>, res: Response<{ word: WordResponse }>): Promise<void> {
    try {
      const id = parseWordId(req.params.id);
      const word = await wordService.update(id, parseWordInput(req.body), actorOf(req));
      req.log.info("Word updated", { event: LogEvent.WordUpdate, userId: req.user?.id, wordId: word.id });

      res.json({ word });
    } catch (err) {
      throw logFailure(req, LogEvent.WordUpdateFailed, "Update word failed", err);
    }
  },

  async remove(req: WordRequest, res: Response): Promise<void> {
    try {
      const id = parseWordId(req.params.id);
      await wordService.remove(id);
      req.log.info("Word deleted", { event: LogEvent.WordDelete, userId: req.user?.id, wordId: id });

      res.status(HttpStatus.NoContent).end();
    } catch (err) {
      throw logFailure(req, LogEvent.WordDeleteFailed, "Delete word failed", err);
    }
  },
};
