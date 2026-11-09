import { ErrorCode, HttpStatus } from "../constants/http.js";
import type { Paginated, PaginationQuery } from "../types/pagination.js";
import { HttpError } from "./http-error.js";

export const DefaultPage = 1;
export const DefaultPageSize = 20;
export const MaxPageSize = 100;

const parsePositiveInt = (value: unknown, fallback: number, name: string): number => {
  if (value === undefined || value === "") return fallback;

  const number = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(number) || number < 1) {
    throw new HttpError(
      HttpStatus.BadRequest,
      ErrorCode.PaginationInvalid,
      `${name} must be a positive integer`,
    );
  }

  return number;
};

export const parsePaginationQuery = (query: Record<string, unknown>): PaginationQuery => {
  const page = parsePositiveInt(query.page, DefaultPage, "page");
  const pageSize = parsePositiveInt(query.pageSize, DefaultPageSize, "pageSize");

  if (pageSize > MaxPageSize) {
    throw new HttpError(
      HttpStatus.BadRequest,
      ErrorCode.PaginationInvalid,
      `pageSize must not exceed ${MaxPageSize}`,
    );
  }

  return { page, pageSize };
};

export const toPaginated = <T>(items: T[], total: number, { page, pageSize }: PaginationQuery): Paginated<T> => ({
  items,
  page,
  pageSize,
  total,
  totalPages: Math.ceil(total / pageSize),
});
