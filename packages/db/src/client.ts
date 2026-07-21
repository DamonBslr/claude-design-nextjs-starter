import { neon } from "@neondatabase/serverless"
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http"

import * as schema from "./schema/index"

type DbSchema = typeof schema

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to apps/web/.env.local (see packages/db/README.md)."
  )
}

const sql = neon(databaseUrl)

export const db: NeonHttpDatabase<DbSchema> = drizzle({ client: sql, schema })
