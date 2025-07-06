import { Request } from "express";
import { verifyJwt } from "./jwt";

export async function expressAuthentication(
  request: Request,
): Promise<any> {
  const authHeader = request.headers.authorization;
  if (!authHeader) throw new Error("No authorization header");

  const tokenMatch = authHeader.match(/^Bearer (.+)$/);
  if (!tokenMatch) throw new Error("Invalid authorization format");

  const token = tokenMatch[1];
  const payload = verifyJwt(token);
  if (!payload) throw new Error("Invalid or expired token");

  // 返回 user info，赋值给 req.user
  return payload
}
