import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const publicPaths = ["/login", "/auth/login-by-password", "/register"]; // 不需要鉴权的路径

  if (publicPaths.includes(req.path)) {
    return next(); // 放行
  }


  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    const payload = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = { id: payload.userId };
    next(); // 一定要调用 next()
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
