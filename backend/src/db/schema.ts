import { integer, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('roles', ['user', 'admin']);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
};

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar(),
  role: rolesEnum().default('user'),
  ...timestamps,
});
