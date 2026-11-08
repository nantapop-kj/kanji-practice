import { ErrorCode, HttpStatus } from "../constants/http.js";

export class HttpError extends Error {
  readonly status: HttpStatus;
  readonly code: ErrorCode;

  constructor(status: HttpStatus, code: ErrorCode, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}