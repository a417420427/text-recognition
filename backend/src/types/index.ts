import { Request } from "tsoa";

import { User } from "../entities/User";


export interface AuthenticatedRequest extends Request {
  user?: User & { userId?: string };
}