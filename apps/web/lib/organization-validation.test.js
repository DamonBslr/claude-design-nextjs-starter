import { describe, expect, test } from "bun:test"

import {
  mapInvitationAcceptanceState,
  mapOrganizationError,
} from "./features/organizations/error"
import {
  canManageOrganization,
  createOrganizationSlug,
  isInvitableOrganizationRole,
  normalizeOrganizationRole,
  selectActiveOrganization,
  validateOrganizationDetails,
  validateOrganizationPatch,
} from "./organization-validation"
import { safeCallbackURL } from "./safe-callback-url"

describe("organization validation", () => {
  test("creates stable URL-safe slugs with an opaque suffix", () => {
    expect(createOrganizationSlug("  Café & Co.  ", "A1B2-C3D4-E5F6")).toBe(
      "cafe-co-a1b2c3d4"
    )
    expect(createOrganizationSlug("東京", "ABCDEF12")).toBe(
      "organization-abcdef12"
    )
  })

  test("validates organization name and description limits", () => {
    expect(
      validateOrganizationDetails({ description: "", name: "" })
    ).toMatchObject({
      success: false,
      fieldErrors: { name: expect.any(String) },
    })
    expect(
      validateOrganizationDetails({
        description: "d".repeat(1001),
        name: "Acme",
      })
    ).toMatchObject({
      success: false,
      fieldErrors: { description: expect.any(String) },
    })
    expect(
      validateOrganizationDetails({ description: " About us ", name: " Acme " })
    ).toEqual({
      data: { description: "About us", name: "Acme" },
      fieldErrors: {},
      success: true,
    })
  })

  test("validates direct plugin update patches without requiring omitted fields", () => {
    expect(validateOrganizationPatch({ name: " Renamed " })).toEqual({
      data: { name: "Renamed" },
      fieldErrors: {},
      success: true,
    })
    expect(validateOrganizationPatch({ name: " " })).toMatchObject({
      fieldErrors: { name: expect.any(String) },
      success: false,
    })
    expect(validateOrganizationPatch({ description: " " }).data).toEqual({
      description: null,
    })
  })

  test("presents management permissions and invitation roles safely", () => {
    expect(normalizeOrganizationRole("member,admin")).toBe("admin")
    expect(canManageOrganization("owner")).toBe(true)
    expect(canManageOrganization("member")).toBe(false)
    expect(isInvitableOrganizationRole("admin")).toBe(true)
    expect(isInvitableOrganizationRole("owner")).toBe(false)
  })

  test("uses only a valid active membership and otherwise falls back", () => {
    const organizations = [{ id: "first" }, { id: "second" }]
    expect(selectActiveOrganization(organizations, "second")?.id).toBe("second")
    expect(selectActiveOrganization(organizations, "foreign")?.id).toBe("first")
    expect(selectActiveOrganization([], "foreign")).toBeNull()
  })
})

describe("safe callback preservation", () => {
  test("keeps local paths and rejects redirect escape attempts", () => {
    expect(safeCallbackURL("/organization?tab=members")).toBe(
      "/organization?tab=members"
    )
    expect(safeCallbackURL("https://evil.example")).toBe("/")
    expect(safeCallbackURL("//evil.example")).toBe("/")
    expect(safeCallbackURL("/\\evil.example")).toBe("/")
  })
})

describe("organization error recovery states", () => {
  test("maps provider, invite lifecycle, authorization, and conflict errors", () => {
    expect(
      mapOrganizationError(
        new Error(
          "The invitation was created, but the email could not be delivered"
        )
      ).status
    ).toBe("provider")
    expect(mapOrganizationError({ code: "INVITATION_EXPIRED" }).status).toBe(
      "not_found"
    )
    expect(mapOrganizationError({ code: "INVITATION_CANCELED" }).status).toBe(
      "not_found"
    )
    expect(
      mapOrganizationError({ code: "INVITATION_EMAIL_MISMATCH" }).status
    ).toBe("forbidden")
    expect(mapOrganizationError({ code: "MEMBER_LIMIT_REACHED" }).status).toBe(
      "conflict"
    )
  })

  test("maps invitation acceptance lifecycle states deterministically", () => {
    const valid = {
      alreadyMember: false,
      email: "invited@example.com",
      expiresAt: new Date("2030-01-03T00:00:00Z"),
      memberCount: 1,
      now: new Date("2030-01-01T00:00:00Z"),
      status: "pending",
      userEmail: "invited@example.com",
    }

    expect(mapInvitationAcceptanceState(valid)).toBeNull()
    expect(
      mapInvitationAcceptanceState({ ...valid, status: "accepted" })?.message
    ).toContain("already been used")
    expect(
      mapInvitationAcceptanceState({ ...valid, status: "canceled" })?.message
    ).toContain("canceled")
    expect(
      mapInvitationAcceptanceState({
        ...valid,
        expiresAt: new Date("2029-12-31T00:00:00Z"),
      })?.message
    ).toContain("expired")
    expect(
      mapInvitationAcceptanceState({
        ...valid,
        userEmail: "wrong@example.com",
      })?.status
    ).toBe("forbidden")
    expect(
      mapInvitationAcceptanceState({ ...valid, memberCount: 100 })?.message
    ).toContain("100-member limit")
    expect(
      mapInvitationAcceptanceState({ ...valid, alreadyMember: true })?.message
    ).toContain("already a member")
  })
})
