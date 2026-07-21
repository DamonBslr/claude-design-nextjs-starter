import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema/index.js";

type DbSchema = typeof schema;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL is not set. Add it to .env.example (see README.md).",
	);
}

const sql = neon(databaseUrl);

export const db: NeonHttpDatabase<DbSchema> = drizzle({ client: sql, schema });
