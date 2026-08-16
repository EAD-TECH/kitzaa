"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "./validations/login.schema";
import { mapLoginError, useLogin } from "./hooks/useLogin";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: submitLogin, isPending, error } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    submitLogin(data);
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-3xl font-heading font-semibold">Willkommen zurück</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="login">Email oder Benutzername</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login"
              type="text"
              className="pl-9"
              placeholder="hallo@beispiel.com"
              {...form.register("login")}
            />
          </div>
          <FieldError>{form.formState.errors.login?.message}</FieldError>
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Passwort</FieldLabel>
            <Link href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
              Passwort vergessen?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="pr-9 pl-9"
              {...form.register("password")}
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

          <FieldError>{form.formState.errors.password?.message}</FieldError>
        </Field>
        {error ? <FieldError>{mapLoginError(error)}</FieldError> : null}
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Wird angemeldet..." : "Anmelden"}
          </Button>
        </Field>
        <FieldSeparator>Oder weiter mit</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Anmelden mit Google
          </Button>
          <FieldDescription className="text-center">
            Neu bei Kitzaa?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Registrieren
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
