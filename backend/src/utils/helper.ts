import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../configs/env";
import { StringValue } from "ms";
import { decodedUser } from "../types";

export const hashPassword = async (password: string) => await argon2.hash(password);

export const passwordMatch = async (enteredPassword: string, storedPassword: string) =>
  argon2.verify(storedPassword, enteredPassword);

export const generateAccessToken = (user: decodedUser) =>
  jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY as StringValue },
  );

export const generateRefreshToken = (user: decodedUser) =>
  jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as StringValue },
  );
