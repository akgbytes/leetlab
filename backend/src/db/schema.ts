import { integer, pgEnum, pgTable, timestamp, varchar, text, json } from "drizzle-orm/pg-core";
import { InferSelectModel, relations, sql } from "drizzle-orm";

export const rolesEnum = pgEnum("roles", ["user", "admin"]);
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

const kk = difficultyEnum.enumValues;

const timestamps = {
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  created_at: timestamp().defaultNow().notNull(),
};

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
  fullname: varchar({ length: 255 }).notNull(),
  role: rolesEnum().notNull().default("user"),
  refreshToken: varchar({ length: 255 }).unique(),
  ...timestamps,
});

export const problems = pgTable("problems", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().unique(),
  description: varchar(),
  difficulty: difficultyEnum().notNull().default("easy"),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  createdBy: integer("creator_id"),
  examples: json(),
  constraints: text("contraints")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  hints: text("hints")
    .array()
    .default(sql`ARRAY[]::text[]`),
  editorial: json(),
  testCases: json(),
  codeSnippets: json(),
  referenceSolutions: json(),
  ...timestamps,
});

export const problemsRelations = relations(problems, ({ one }) => ({
  creator: one(users, {
    fields: [problems.createdBy],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  problems: many(problems),
}));

export type UserType = InferSelectModel<typeof users>;
