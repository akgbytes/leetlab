import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../configs/env';

const db = drizzle({ connection: env.DATABASE_URL, casing: 'snake_case' });
