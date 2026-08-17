"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordValues, resetPasswordSchema } from "./validations/resetpassword.schema";
import { mapResetPasswordError, useResetPassword } from "./hooks/useResetPassword";
import { ApiError } from "@/lib/api/client";

export function ResetPasswordForm({
  token,
  className,
  ...props
}: React.ComponentProps<"div"> & { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: submitResetPassword, isPending, error } = useResetPassword(token);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    submitResetPassword(data);
  };

  const isExpiredLink = error instanceof ApiError && error.status === 400;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="inline-flex items-center">
              <img src="/images/logo.png" alt="Kitzaa" className="h-50 w-auto object-contain" />
            </Link>
            <h1 className="text-3xl font-heading font-semibold">Neues Passwort</h1>
            <p className="font-body text-sm text-muted-foreground">
              Gib dein neues Passwort ein und bestätige es.
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="newPassword">Neues Passwort</FieldLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="pr-9 pl-9"
                {...form.register("newPassword")}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <FieldError>{form.formState.errors.newPassword?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Passwort bestätigen</FieldLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="pr-9 pl-9"
                {...form.register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <FieldError>{form.formState.errors.confirmPassword?.message}</FieldError>
          </Field>
          {error ? <FieldError>{mapResetPasswordError(error)}</FieldError> : null}
          {isExpiredLink ? (
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/forgot-password" className="underline underline-offset-4">
                Neuen Link anfordern
              </Link>
            </p>
          ) : null}
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Wird gespeichert..." : "Passwort speichern"}
            </Button>
          </Field>
          <Field>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="underline underline-offset-4">
                Zurück zur Anmeldung
              </Link>
            </p>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
