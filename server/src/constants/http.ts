export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  InternalServerError = 500,
}

export enum ErrorCode {
  BadRequest = "BAD_REQUEST",
  PayloadTooLarge = "PAYLOAD_TOO_LARGE",
  InternalError = "INTERNAL_ERROR",
  Unauthorized = "UNAUTHORIZED",
  Forbidden = "FORBIDDEN",
  InvalidCredentials = "INVALID_CREDENTIALS",
  EmailTaken = "EMAIL_TAKEN",
  EmailRequired = "EMAIL_REQUIRED",
  EmailInvalid = "EMAIL_INVALID",
  PasswordRequired = "PASSWORD_REQUIRED",
  PasswordInvalid = "PASSWORD_INVALID",
  NameRequired = "NAME_REQUIRED",
  NameInvalid = "NAME_INVALID",
  PaginationInvalid = "PAGINATION_INVALID",
}
