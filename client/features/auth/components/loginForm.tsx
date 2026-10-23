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
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, createLoginSchema } from "../validations/login.schema";
import { mapLoginError, useLogin } from "../hooks/useLogin";
import { useTranslations } from "next-intl";
import { GoogleSignInButton } from "./GoogleSignInButton";


export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: submitLogin, isPending, error } = useLogin();

  const t = useTranslations("Login");
  const loginSchema = createLoginSchema(t);

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
          <h1 className="text-3xl font-heading font-semibold">{t("title")}</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="login">{t("loginLabel")}</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login"
              type="text"
              className="pl-9"
              placeholder={t("loginPlaceholder")}
              {...form.register("login")}
            />
          </div>
          <FieldError>{form.formState.errors.login?.message}</FieldError>
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <Link href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
              {t("forgotPassword")}
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
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <FieldError>{form.formState.errors.password?.message}</FieldError>
        </Field>
        {error ? <FieldError>{mapLoginError(error)}</FieldError> : null}
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("submitting") : t("submit")}
          </Button>
        </Field>
        <FieldSeparator>{t("continueWith")}</FieldSeparator>
        <Field>
          <GoogleSignInButton context="signin" />
          <FieldDescription className="text-center">
            {t("newHere")}{" "}
            <Link href="/register" className="underline underline-offset-4">
              {t("register")}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
