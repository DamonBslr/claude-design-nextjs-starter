export function safeCallbackURL(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value

  if (
    !candidate?.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return "/"
  }

  return candidate
}
