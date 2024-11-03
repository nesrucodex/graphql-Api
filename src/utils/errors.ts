import { StatusCodes } from "http-status-codes";
export class BadRequest extends Error {
  constructor(
    message: string,
    public statusCode = StatusCodes.BAD_REQUEST,
    public result: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.result = result;
    this.name = "BadRequest";
  }
}

export class Unauthorized extends Error {
  constructor(
    message: string,
    public statusCode = StatusCodes.UNAUTHORIZED,
    public result: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.result = result;
    this.name = "Unauthorized";
  }
}

export class Forbidden extends Error {
  constructor(
    message: string,
    public statusCode = StatusCodes.FORBIDDEN,
    public result: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.result = result;
    this.name = "Forbidden";
  }
}

export class NotFound extends Error {
  constructor(
    message: string,
    public statusCode = StatusCodes.NOT_FOUND,
    public result: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.result = result;
    this.name = "NotFound";
  }
}

export class InternalServerError extends Error {
  constructor(
    message: string,
    public statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    public result: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.result = result;
    this.name = "InternalServerError";
  }
}
