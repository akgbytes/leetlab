import { problems } from "./../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db";
import asyncHandler from "../utils/asyncHandler";
import { handleZodError } from "../utils/handleZodError";
import {
  validateProblemData,
  validateUpdateProblemData,
} from "../validations/problems.validations";
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

export const updateProblem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomError(ResponseStatus.BadRequest, "Problem id is required");
  }

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
  } = handleZodError(validateUpdateProblemData(req.body));

  const updatePayload: Partial<{
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    hints: string[];
    constraints: string[];
    examples: any;
    codeSnippets: any;
    editorial: any;
    referenceSolutions: any;
    testCases: any;
  }> = {};

  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (difficulty !== undefined) updatePayload.difficulty = difficulty;
  if (tags !== undefined) updatePayload.tags = tags;
  if (hints !== undefined) updatePayload.hints = hints;
  if (constraints !== undefined) updatePayload.constraints = constraints;
  if (examples !== undefined) updatePayload.examples = examples;
  if (codeSnippets !== undefined) updatePayload.codeSnippets = codeSnippets;
  if (editorial !== undefined) updatePayload.editorial = editorial;
  if (referenceSolutions !== undefined) updatePayload.referenceSolutions = referenceSolutions;
  if (testCases !== undefined) updatePayload.testCases = testCases;

  if (Object.keys(updatePayload).length === 0) {
    throw new CustomError(ResponseStatus.BadRequest, "At least one field is required to update");
  }

  const [updatedProblem] = await db.update(problems).set(updatePayload).returning();

  if (!updatedProblem) {
    throw new CustomError(ResponseStatus.BadRequest, "Invalid problem id");
  }

  res
    .status(ResponseStatus.Success)
    .json(new ApiResponse(ResponseStatus.Success, "Problem updated successfully", updatedProblem));
});

export const deleteProblem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomError(ResponseStatus.BadRequest, "Problem id is required");
  }

  const [deletedProblem] = await db
    .delete(problems)
    .where(eq(problems.id, id as unknown as number))
    .returning();

  if (!deletedProblem) {
    throw new CustomError(ResponseStatus.BadRequest, "Invalid problem id");
  }

  res
    .status(ResponseStatus.Success)
    .json(new ApiResponse(ResponseStatus.Success, "Problem deleted successfully", deletedProblem));
});

export const getAllProblems = asyncHandler(async (req, res, next) => {
  const allProblems = await db.select().from(problems);

  res
    .status(ResponseStatus.Success)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        allProblems.length ? "Problems fetched successfully" : "No problems available",
        allProblems,
      ),
    );
});

export const getProblemById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomError(ResponseStatus.BadRequest, "Problem id is required");
  }

  const [problem] = await db.select().from(problems).where(eq(problems.title, " "));

  if (!problem) {
    throw new CustomError(ResponseStatus.BadRequest, "Invalid problem id");
  }

  res
    .status(ResponseStatus.Success)
    .json(new ApiResponse(ResponseStatus.Success, "Problem fetched successfully", problem));
});
