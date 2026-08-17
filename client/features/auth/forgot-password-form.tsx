"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordValues,
  forgotPasswordSchema,
} from "./validations/forgotpassword.schema";
import { mapForgotPasswordError, useForgotPassword } from "./hooks/useForgotPassword";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {

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
          <h1 className="text-3xl font-heading font-semibold">E-Mail prüfen</h1>
          <p className="font-body text-sm text-muted-foreground">
            Falls die E-Mail-Adresse existiert, haben wir dir einen Link zum Zurücksetzen
            des Passworts gesendet.
          </p>
          <Link href="/login" className="text-sm underline underline-offset-4">
            Zurück zur Anmeldung
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
            <h1 className="text-3xl font-heading font-semibold">Passwort vergessen?</h1>
            <p className="font-body text-sm text-muted-foreground">
              Kein Problem. Gib deine E-Mail-Adresse ein. Wenn ein Konto existiert, senden wir dir
              einen Link zum Zurücksetzen.
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">E-Mail-Adresse</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="hallo@beispiel.de"
              {...form.register("email")}
            />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>
          {error ? <FieldError>{mapForgotPasswordError(error)}</FieldError> : null}
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Wird gesendet..." : "Link senden"}
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
