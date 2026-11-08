import type { Request } from "express";
import type { JlptLevel } from "../generated/prisma/client.js";
import type { Paginated, PaginationQuery } from "./pagination.js";

export type WordResponse = {
  id: number;
  kanji: string;
  reading: string;
  meaningsTh: string[];
  meaningsEn: string[];
  level: JlptLevel;
};

export type WordInput = Omit<WordResponse, "id">;

export type WordListQuery = PaginationQuery & {
  search: string;
  level?: JlptLevel;
};

export type LevelCounts = Record<JlptLevel, number>;

export type WordListResponse = Paginated<WordResponse> & {
  levelCounts: LevelCounts;
};

export type WordParams = { id: string };

export type WordRequest<TBody = unknown> = Request<WordParams, unknown, TBody>;
