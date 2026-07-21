import { AuthForm } from "@/components/auth-form"
import { safeCallbackURL } from "@/lib/safe-callback-url"

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL?: string | string[] }>
}) {
  const { callbackURL } = await searchParams
  return <AuthForm mode="sign-up" callbackURL={safeCallbackURL(callbackURL)} />
}
