import { Request } from "tsoa";

import { User } from "../entities/User";


export interface AuthenticatedRequest extends Request {
  user?: User & { userId?: string };
}


export type ApiResponse<T = any> = {
  success: boolean;      // 请求是否成功
  message?: string;      // 提示信息（错误时必填）
  data?: T;             // 成功时的数据
  error?: {             // 开发调试用的错误详情（可选）
    code?: string | number;
    stack?: string;
  };
};