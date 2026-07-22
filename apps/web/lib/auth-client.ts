"use client"

import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

import { ORGANIZATION_ADDITIONAL_FIELDS } from "@/lib/auth-config"

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      schema: {
        organization: {
          additionalFields: ORGANIZATION_ADDITIONAL_FIELDS,
        },
      },
    }),
  ],
})
