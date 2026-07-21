import { AuthForm } from "@/components/auth-form"
import { safeCallbackURL } from "@/lib/safe-callback-url"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL?: string | string[] }>
}) {
  const { callbackURL } = await searchParams
  return <AuthForm mode="sign-in" callbackURL={safeCallbackURL(callbackURL)} />
}
