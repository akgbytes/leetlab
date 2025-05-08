import { db } from "../db";
import { problems } from "../db/schema";
import asyncHandler from "../utils/asyncHandler";
import { handleZodError } from "../utils/handleZodError";
import { validateProblemData } from "../validations/problems.validations";

export const createProblem = asyncHandler(async (req, res, next) => {});

export const getAllProblems = asyncHandler(async (req, res, next) => {});
export const getProblemById = asyncHandler(async (req, res, next) => {});
export const updateProblem = asyncHandler(async (req, res, next) => {});
export const deleteProblem = asyncHandler(async (req, res, next) => {});
