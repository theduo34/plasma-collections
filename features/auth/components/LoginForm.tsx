'use client'

// No RegisterForm — self-registration doesn't exist in this project.
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthActions } from "@convex-dev/auth/react"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { api } from "@/convex/_generated/api"
import { adminSessionCache } from "@/features/auth/utils/adminSessionCache"

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn } = useAuthActions()
  const issueSessionToken = useMutation(api.sessionTokens.issue)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginValues) {
    setIsSubmitting(true)
    try {
      // flow is always "signIn" — there is no sign-up path in this app.
      await signIn("password", { ...values, flow: "signIn" })
      // A fresh admin URL every login — see convex/sessionTokens.ts.
      const token = await issueSessionToken({})
      await adminSessionCache.save(token)
      router.push(`/admin/${token}/dashboard`)
    } catch {
      toast.error("Invalid email or password.")
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-6 rounded-md border border-border bg-card p-8"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-sans text-lg font-semibold tracking-wide text-foreground uppercase">
          Plasma Collections
        </h1>
        <p className="text-xs text-muted-foreground">Sign in to manage the catalogue.</p>
      </div>

      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  )
}
