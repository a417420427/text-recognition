import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";

const SECRET: string = process.env.JWT_SECRET || "default_secret_key";


interface JwtPayload {
  id: string;
  phone: string;
  iat: number;
  exp: number;
}
export function signJwt(payload: object, expiresIn: StringValue): string {
  return jwt.sign(payload, SECRET, { expiresIn: ms(expiresIn) });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
