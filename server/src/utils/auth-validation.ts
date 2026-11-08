import { ErrorCode, HttpStatus } from "../constants/http.js";
import { HttpError } from "./http-error.js";
import type { AuthRequest, RegisterRequest } from "../types/auth.js";

const EmailRegex = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$/;
const EmailMaxLength = 254;
const NameMaxLength = 255;
export const PasswordMinLength = 8;
export const PasswordMaxLength = 72;

const PasswordRegex = new RegExp(
  `^(?=.*[A-Za-z])(?=.*\\d)[\\x20-\\x7E]{${PasswordMinLength},${PasswordMaxLength}}$`,
);

const invalid = (code: ErrorCode, message: string): HttpError =>
  new HttpError(HttpStatus.BadRequest, code, message);

const toText = (value: unknown): string => (typeof value === "string" ? value : "");

const parseEmail = (value: unknown): string => {
  const email = toText(value).trim().toLowerCase();

  if (!email) {
    throw invalid(ErrorCode.EmailRequired, "Email is required");
  }

  if (email.length > EmailMaxLength || !EmailRegex.test(email)) {
    throw invalid(ErrorCode.EmailInvalid, "Email is invalid");
  }

  return email;
};

export const parseRegisterRequest = (body: unknown): RegisterRequest => {
  const data = (body ?? {}) as Record<string, unknown>;
  const email = parseEmail(data.email);
  const password = toText(data.password);
  const name = toText(data.name).trim();

  if (!password) {
    throw invalid(ErrorCode.PasswordRequired, "Password is required");
  }

  if (!PasswordRegex.test(password)) {
    throw invalid(
      ErrorCode.PasswordInvalid,
      `Password must be ${PasswordMinLength}-${PasswordMaxLength} characters, use only English letters, numbers and symbols, and include both letters and numbers`,
    );
  }

  if (!name) {
    throw invalid(ErrorCode.NameRequired, "Name is required");
  }
  
  if (name.length > NameMaxLength) {
    throw invalid(ErrorCode.NameInvalid, "Name is too long");
  }

  return { email, password, name };
};

export const parseAuthRequest = (body: unknown): AuthRequest => {
  const data = (body ?? {}) as Record<string, unknown>;
  const email = parseEmail(data.email);
  const password = toText(data.password);

  if (!password) {
    throw invalid(ErrorCode.PasswordRequired, "Password is required");
  }

  return { email, password };
};
