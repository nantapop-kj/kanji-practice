import { ErrorCode, HttpStatus } from "../constants/http.js";
import { wordRepository } from "../repositories/word.repository.js";
import type { LevelCounts, WordInput, WordListQuery, WordListResponse, WordResponse } from "../types/word.js";
import { HttpError } from "../utils/http-error.js";
import { toPaginated } from "../utils/pagination.js";

const isUniqueViolation = (err: unknown): boolean =>
  typeof err === "object" && err !== null && "code" in err && err.code === "P2002";

const wordExists = (): HttpError =>
  new HttpError(HttpStatus.Conflict, ErrorCode.WordExists, "This kanji and reading already exist");

const wordNotFound = (): HttpError => new HttpError(HttpStatus.NotFound, ErrorCode.WordNotFound, "Word not found");

export const wordService = {
  levelCounts: (): Promise<LevelCounts> => wordRepository.getLevelCounts(""),

  async getAll(query: WordListQuery): Promise<WordListResponse> {
    const [[items, total], levelCounts] = await Promise.all([
      wordRepository.getAll(query),
      wordRepository.getLevelCounts(query.search),
    ]);

    return { ...toPaginated(items, total, query), levelCounts };
  },

  async create(input: WordInput, actor: string): Promise<WordResponse> {
    if (!(await wordRepository.createIfAbsent(input, actor))) throw wordExists();

    const word = await wordRepository.getByKanjiReading(input.kanji, input.reading);
    if (!word) throw wordNotFound();

    return word;
  },

  async update(id: number, input: WordInput, actor: string): Promise<WordResponse> {
    if (await wordRepository.existsWithKanjiReading(input.kanji, input.reading, id)) throw wordExists();

    try {
      const word = await wordRepository.update(id, input, actor);
      if (!word) throw wordNotFound();

      return word;
    } catch (err) {
      if (isUniqueViolation(err)) throw wordExists();
      throw err;
    }
  },

  async remove(id: number): Promise<void> {
    if (!(await wordRepository.remove(id))) throw wordNotFound();
  },
};
