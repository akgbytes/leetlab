import dotenv from "dotenv";
import { z } from "zod";
import { logger } from "./logger";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number({ message: "PORT must be a valid number" }),
  DATABASE_URL: z.string().nonempty(),

  ACCESS_TOKEN_SECRET: z.string().nonempty(),
  ACCESS_TOKEN_EXPIRY: z.string().default("1d"),
  REFRESH_TOKEN_SECRET: z.string().nonempty(),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

  SERVER_URL: z.string().url(),
  CLIENT_URL: z.string().url(),

  NODE_ENV: z.enum(["development", "production"]),
});

const createEnv = (env: NodeJS.ProcessEnv) => {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errorMessages = result.error.errors
      .map((err) => `- ${err.path.join(".")}: ${err.message}`)
      .join("\n");

    logger.error(`Environment variable validation failed:\n${errorMessages}`);
    process.exit(1);
  }

  return result.data;
};

export const env = createEnv(process.env);
