export enum LogLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Http = "http",
  Verbose = "verbose",
  Debug = "debug",
  Silly = "silly",
}

export enum LogFormat {
  Json = "json",
  Pretty = "pretty",
}

export enum LogFile {
  Combined = "combined.log",
  Error = "error.log",
}

export const LogDir = "logs";
export const LogMaxFileSize = 10 * 1024 * 1024;
export const LogMaxFiles = 5;
export const LogDbQueries = true;

export enum LogEvent {
  AuthRegister = "auth.register",
  AuthRegisterFailed = "auth.register_failed",
  AuthLogin = "auth.login",
  AuthLoginFailed = "auth.login_failed",
  AuthProfileFailed = "auth.profile_failed",
  AuthUnauthorized = "auth.unauthorized",
  AuthForbidden = "auth.forbidden",
  UserList = "user.list",
  UserListFailed = "user.list_failed",
  WordCreate = "word.create",
  WordCreateFailed = "word.create_failed",
  WordUpdate = "word.update",
  WordUpdateFailed = "word.update_failed",
  WordDelete = "word.delete",
  WordDeleteFailed = "word.delete_failed",
  WordListFailed = "word.list_failed",
}
