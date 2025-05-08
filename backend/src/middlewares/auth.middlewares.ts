import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";
import { ResponseStatus } from "../utils/constants";
import jwt from "jsonwebtoken";
import { env } from "../configs/env";
import { decodedUser } from "../types";
import asyncHandler from "../utils/asyncHandler";

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;

  if (!accessToken) throw new CustomError(ResponseStatus.Unauthorized, "Access token missing");

  try {
    const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    req.user = decoded as decodedUser;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new CustomError(ResponseStatus.Unauthorized, "Access token expired");
    }
    throw new CustomError(ResponseStatus.Unauthorized, "Invalid access token");
  }
};

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;

  if (role !== "admin") {
    throw new CustomError(ResponseStatus.Forbidden, "Access denied");
  }

  next();
});
