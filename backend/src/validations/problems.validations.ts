import { difficultyEnum } from "./../db/schema";
import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

const problemSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  difficulty: z.enum(difficultyEnum.enumValues),
  tags: z.array(z.string()),
  examples: jsonSchema,
  constraints: z.array(z.string()),
  hints: z.array(z.string()),
  editorial: jsonSchema,
  testCases: jsonSchema,
  codeSnippets: jsonSchema,
  referenceSolutions: jsonSchema,
});

const updateProblemSchema = problemSchema.partial();

export type Problem = z.infer<typeof problemSchema>;

export const validateProblemData = (data: Problem) => problemSchema.safeParse(data);
export const validateUpdateProblemData = (data: Partial<Problem>) =>
  updateProblemSchema.safeParse(data);
