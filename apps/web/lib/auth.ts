import "server-only"

import { db } from "@workspace/db/client"
import * as schema from "@workspace/db/schema"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { betterAuth } from "better-auth/minimal"
import { nextCookies } from "better-auth/next-js"

import { AUTH_COOKIE_PREFIX } from "@/lib/auth-config"

export const auth = betterAuth({
  advanced: {
    cookiePrefix: AUTH_COOKIE_PREFIX,
  },
  appName: "Next.js Starter",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
})

export type AuthSession = typeof auth.$Infer.Session
export type AuthUser = AuthSession["user"]
