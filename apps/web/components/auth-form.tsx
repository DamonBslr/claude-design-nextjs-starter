"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { authClient } from "@/lib/auth-client"

export function AuthForm({
  callbackURL,
  mode,
}: {
  callbackURL: string
  mode: "sign-in" | "sign-up"
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const isSignUp = mode === "sign-up"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            email,
            name: String(formData.get("name") ?? ""),
            password,
          })
        : await authClient.signIn.email({ email, password })

      if (result.error) {
        setError(result.error.message ?? "Authentication failed. Try again.")
        return
      }

      router.push(callbackURL)
      router.refresh()
    } catch {
      setError("Could not complete authentication. Try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-6 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Create a local account for this app."
              : "Sign in to continue to the app."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {isSignUp ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" autoComplete="name" required />
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending
                ? isSignUp
                  ? "Creating account…"
                  : "Signing in…"
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <Button variant="link" className="h-auto px-1" asChild>
            <Link
              href={`${isSignUp ? "/sign-in" : "/sign-up"}?callbackURL=${encodeURIComponent(callbackURL)}`}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
