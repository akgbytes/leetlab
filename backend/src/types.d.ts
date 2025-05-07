import { UserType } from "./db/schema";

export type decodedUser = Pick<UserType, "id" | "username" | "role">;

declare global {
  namespace Express {
    interface Request {
      user: decodedUser;
    }
  }
}
export {};
