"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ForgotPasswordValues,
  createForgotPasswordSchema,
} from "./validations/forgotpassword.schema";
import { mapForgotPasswordError, useForgotPassword } from "./hooks/useForgotPassword";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const t = useTranslations("ForgotPassword");
  const forgotPasswordSchema = createForgotPasswordSchema(t);

  const { mutate: submitForgotPassword, isPending, isSuccess, error } =
    useForgotPassword();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    submitForgotPassword(data);
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="inline-flex items-center">
            <img src="/images/logo.png" alt="Kitzaa" className="h-50 w-auto object-contain" />
          </Link>
          <h1 className="text-3xl font-heading font-semibold">{t("successTitle")}</h1>
          <p className="font-body text-sm text-muted-foreground">{t("successBody")}</p>
          <Link href="/login" className="text-sm underline underline-offset-4">
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="inline-flex items-center">
              <img src="/images/logo.png" alt="Kitzaa" className="h-50 w-auto object-contain" />
            </Link>
            <h1 className="text-3xl font-heading font-semibold">{t("title")}</h1>
            <p className="font-body text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              {...form.register("email")}
            />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>
          {error ? <FieldError>{mapForgotPasswordError(error, t)}</FieldError> : null}
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </Field>
          <Field>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="underline underline-offset-4">
                {t("backToLogin")}
              </Link>
            </p>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
