import { Request, Response, NextFunction } from "express";
import { ValidateError } from "tsoa";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ValidateError) {
    console.warn("⚠️ Validation Failed:", err.fields);
    res.status(422).json({
      message: "Validation Failed",
      details: err.fields,
    });
    return;
  }

  console.error("❌ Internal Server Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
}
