import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { redisClient } from "../utils/redisClient";

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const publicPaths = ["/login", "/auth/login-by-password", "/auth/register"]; // 不需要鉴权的路径
console.log(req.path, 'rrrr')
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

  const payload = verifyJwt(token);

  
  if (!payload || typeof payload !== "object" || !("id" in payload)) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  const userId = payload.id;

  try {
    // Redis get 返回的是 string | null
    const cachedUserStr = await redisClient.get(`user:${userId}`);

    if (cachedUserStr) {
      // 反序列化
      req.user = JSON.parse(cachedUserStr);
      return next();
    }

    // 缓存没有，查数据库
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // 写入缓存，EX 单位秒，这里 300秒 = 5分钟
    await redisClient.set(`user:${userId}`, JSON.stringify(user), {
      EX: 300,
    });

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
