export const AUTH_COOKIE_PREFIX = "next-starter"
export const AUTH_CALLBACK_HEADER = "x-auth-callback-url"

export const ORGANIZATION_ADDITIONAL_FIELDS = {
  description: {
    type: "string",
    required: false,
    input: true,
  },
} as const

export const DISABLED_ORGANIZATION_AUTH_PATHS = [
  "/organization/get-full-organization",
  "/organization/list-invitations",
] as const
