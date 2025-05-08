import { difficultyEnum } from "./../db/schema";
import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

const problemsSchema = z.object({
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

export type Problem = z.infer<typeof problemsSchema>;

export const validateProblemData = (data: Problem) => problemsSchema.safeParse(data);
