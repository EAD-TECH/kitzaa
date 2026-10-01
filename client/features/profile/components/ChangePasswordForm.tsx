"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { createChangePasswordSchema } from "../validations/changePassword.schema";
import { useChangePassword } from "../hooks/useChangePassword";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const formSchema = createChangePasswordSchema();

export function ChangePasswordForm() {
  const { data: currentUser } = useCurrentUser();

  const userId = currentUser?._id;

  const { mutate: changePassword, isPending } = useChangePassword(userId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (!userId) return;

    changePassword(data, {
      onSuccess: () => {
        form.reset();
        setShowPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      },
    });
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form
      id="change-password-form"
      className="flex w-full min-w-0 flex-1 flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="current-password">Aktuelles Passwort</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  id="current-password"
                  className="pr-9"
                  aria-invalid={fieldState.invalid}
                  placeholder="Aktuelles Passwort eingeben"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="new-password">Neues Passwort</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  className="pr-9"
                  aria-invalid={fieldState.invalid}
                  placeholder="Neues Passwort eingeben"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <FieldDescription className="text-xs text-muted-foreground">
                Mindestens 8 Zeichen, mit Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password">Neues Passwort bestätigen</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className="pr-9"
                  aria-invalid={fieldState.invalid}
                  placeholder="Neues Passwort bestätigen"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Field orientation="horizontal" className="flex-wrap justify-end">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Wird gespeichert..." : "Passwort ändern"}
        </Button>
      </Field>
    </form>
  );
}
