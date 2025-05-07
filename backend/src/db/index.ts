import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../configs/env';

const db = drizzle(env.DATABASE_URL!);
