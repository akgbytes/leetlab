import { integer, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const rolesEnum = pgEnum("roles", ["user", "admin"]);

const timestamps = {
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  created_at: timestamp().defaultNow().notNull(),
};

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
  fullname: varchar({ length: 255 }).notNull(),
  role: rolesEnum().notNull().default("user"),
  refreshToken: varchar({ length: 255 }).unique(),
  ...timestamps,
});

export type UserType = InferSelectModel<typeof usersTable>;
