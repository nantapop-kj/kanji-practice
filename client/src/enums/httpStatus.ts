export const HttpStatus = {
    NoContent: 204,
    Forbidden: 403,
} as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
