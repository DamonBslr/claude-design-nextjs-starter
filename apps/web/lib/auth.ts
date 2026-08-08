import "server-only"

import { db } from "@workspace/db/client"
import * as schema from "@workspace/db/schema"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError } from "better-auth/api"
import { betterAuth } from "better-auth/minimal"
import { nextCookies } from "better-auth/next-js"
import { organization } from "better-auth/plugins"

import { APP_NAME } from "@/lib/app-config"
import {
  AUTH_COOKIE_PREFIX,
  DISABLED_ORGANIZATION_AUTH_PATHS,
  ORGANIZATION_ADDITIONAL_FIELDS,
} from "@/lib/auth-config"
import { sendOrganizationInvitationEmail } from "@/lib/organization-email"
import {
  createOrganizationSlug,
  validateOrganizationDetails,
  validateOrganizationPatch,
} from "@/lib/organization-validation"

function organizationValidationError(fieldErrors: Record<string, string>) {
  return new APIError("BAD_REQUEST", {
    message:
      Object.values(fieldErrors)[0] ?? "The organization details are invalid.",
  })
}

export const auth = betterAuth({
  advanced: {
    cookiePrefix: AUTH_COOKIE_PREFIX,
  },
  appName: APP_NAME,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  disabledPaths: [...DISABLED_ORGANIZATION_AUTH_PATHS],
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      disableOrganizationDeletion: true,
      invitationExpiresIn: 60 * 60 * 48,
      invitationLimit: 100,
      membershipLimit: 100,
      organizationHooks: {
        beforeCreateOrganization: async ({ organization: input }) => {
          const validation = validateOrganizationDetails({
            description:
              typeof input.description === "string" ? input.description : "",
            name: typeof input.name === "string" ? input.name : "",
          })
          if (!validation.success) {
            throw organizationValidationError(validation.fieldErrors)
          }

          return {
            data: {
              ...input,
              description: validation.data.description,
              name: validation.data.name,
              slug: createOrganizationSlug(
                validation.data.name,
                crypto.randomUUID()
              ),
            },
          }
        },
        beforeUpdateOrganization: async ({ organization: input }) => {
          if (input.slug !== undefined) {
            throw new APIError("BAD_REQUEST", {
              message: "Organization slugs cannot be changed.",
            })
          }

          const validation = validateOrganizationPatch({
            description:
              typeof input.description === "string" ||
              input.description === null
                ? input.description
                : undefined,
            name: typeof input.name === "string" ? input.name : undefined,
          })
          if (!validation.success) {
            throw organizationValidationError(validation.fieldErrors)
          }

          return { data: { ...input, ...validation.data } }
        },
      },
      schema: {
        organization: {
          additionalFields: ORGANIZATION_ADDITIONAL_FIELDS,
        },
      },
      sendInvitationEmail: sendOrganizationInvitationEmail,
      teams: { enabled: false },
    }),
    nextCookies(),
  ],
})

export type AuthSession = typeof auth.$Infer.Session
export type AuthUser = AuthSession["user"]
