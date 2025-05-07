import { logger } from "../configs/logger";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { handleZodError } from "../utils/handleZodError";
import { validateRegister } from "../validations/auth.validation";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../utils/helper";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullname } = handleZodError(validateRegister(req.body));

  logger.info(`Registration attempt for ${email}`);

  const [existingUsername, existingEmail] = await Promise.all([
    await db.select().from(usersTable).where(eq(usersTable.username, username)),
    await db.select().from(usersTable).where(eq(usersTable.email, email)),
  ]);

  if (existingEmail) {
    throw new CustomError(ResponseStatus.Conflict, "Email is already registered");
  }

  if (existingUsername) {
    throw new CustomError(ResponseStatus.Conflict, "Username is already taken");
  }

  const hashedPassword = await hashPassword(password);

  const [user] = await db
    .insert(usersTable)
    .values({
      username,
      email,
      password: hashedPassword,
      fullname,
    })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      fullname: usersTable.fullname,
      role: usersTable.role,
    });

  logger.info("User registered successfully");

  res
    .status(ResponseStatus.Success)
    .json(new ApiResponse(ResponseStatus.Success, "User registered successfully", user));
});

export const login = asyncHandler(async (req, res) => {});

export const logout = asyncHandler(async (req, res) => {});
