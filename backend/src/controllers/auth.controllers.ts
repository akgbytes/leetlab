import { logger } from "../configs/logger";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { cookieOptions, ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { handleZodError } from "../utils/handleZodError";
import { validateLogin, validateRegister } from "../validations/auth.validation";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  passwordMatch,
} from "../utils/helper";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullname } = handleZodError(validateRegister(req.body));

  logger.info(`Registration attempt for ${email}`);

  const [existingUsername, existingEmail] = await Promise.all([
    await db.select().from(users).where(eq(users.username, username)),
    await db.select().from(users).where(eq(users.email, email)),
  ]);

  if (existingEmail.length) {
    throw new CustomError(ResponseStatus.Conflict, "Email is already registered");
  }

  if (existingUsername.length) {
    throw new CustomError(ResponseStatus.Conflict, "Username is already taken");
  }

  const hashedPassword = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
      fullname,
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      fullname: users.fullname,
      role: users.role,
    });

  logger.info("User registered successfully");

  res
    .status(ResponseStatus.Created)
    .json(new ApiResponse(ResponseStatus.Created, "User registered successfully", user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = handleZodError(validateLogin(req.body));

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new CustomError(ResponseStatus.Unauthorized, "Invalid credentials");
  }

  const isPasswordCorrect = await passwordMatch(user.password, password);

  if (!isPasswordCorrect) {
    throw new CustomError(ResponseStatus.Unauthorized, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const [updated] = await db
    .update(users)
    .set({ refreshToken })
    .where(eq(users.email, email))
    .returning();

  logger.info(`${updated.username} logged in`);

  res
    .status(ResponseStatus.Success)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(ResponseStatus.Success, "Login successful", null));
});

export const logout = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const updated = await db.update(users).set({ refreshToken: null });

  if (!updated.rowCount) {
    throw new CustomError(ResponseStatus.NotFound, "User not found");
  }

  logger.info("User logged out");

  res
    .status(ResponseStatus.Success)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(ResponseStatus.Success, "Logged out successfully", null));
});
