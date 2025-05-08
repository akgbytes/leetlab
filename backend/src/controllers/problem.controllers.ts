import { eq } from "drizzle-orm";
import { db } from "../db";
import { problems } from "../db/schema";
import asyncHandler from "../utils/asyncHandler";
import { handleZodError } from "../utils/handleZodError";
import { validateProblemData } from "../validations/problems.validations";
import { CustomError } from "../utils/CustomError";
import { ResponseStatus } from "../utils/constants";
import { logger } from "../configs/logger";
import { ApiResponse } from "../utils/ApiResponse";

export const createProblem = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    difficulty,
    tags,
    hints,
    constraints,
    examples,
    codeSnippets,
    editorial,
    referenceSolutions,
    testCases,
  } = handleZodError(validateProblemData(req.body));

  const { id } = req.user;

  const [existing] = await db.select().from(problems).where(eq(problems.title, title));

  if (existing) {
    throw new CustomError(ResponseStatus.Conflict, "Problem already exists with same title");
  }

  const [problem] = await db
    .insert(problems)
    .values({
      createdBy: id,
      title,
      description,
      difficulty,
      tags,
      hints,
      constraints,
      examples,
      codeSnippets,
      editorial,
      referenceSolutions,
      testCases,
    })
    .returning();

  logger.info(`Problem with title '${problem.title}' created successfully by ${id}`);

  res
    .status(ResponseStatus.Created)
    .json(new ApiResponse(ResponseStatus.Created, "Problem created successfully", problem));
});

export const getAllProblems = asyncHandler(async (req, res, next) => {});
export const getProblemById = asyncHandler(async (req, res, next) => {});
export const updateProblem = asyncHandler(async (req, res, next) => {});
export const deleteProblem = asyncHandler(async (req, res, next) => {});
