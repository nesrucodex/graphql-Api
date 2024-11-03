import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiResponse } from "../types";

const routeErrorHandlingMiddleware: ErrorRequestHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  if (err?.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      result: err.data,
    } satisfies ApiResponse<typeof err.data>) as unknown as void;
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
    result: err || null,
  } satisfies ApiResponse<typeof err.data>) as unknown as void;
};

export default routeErrorHandlingMiddleware;
