"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUpdatePersonalInfo } from "../hooks/useUpdatePersonalInfo";
import {
  updatePersonalInfoSchema,
  type UpdatePersonalInfoValues,
} from "../validations/updatePersonalInfo.schema";

type UpdatePersonalInfoFormProps = {
  onCancel: () => void;
};

const UpdatePersonalInfoForm = ({ onCancel }: UpdatePersonalInfoFormProps) => {
  const t = useTranslations("Profile");
  const common = useTranslations("Common");
  const schema = updatePersonalInfoSchema(t);
  type PersonalInfoFormInput = z.input<typeof schema>;
  const languageItems = {
    de: t("german"),
    en: t("english"),
  };
  const { data: user } = useCurrentUser();
  const userId = user?._id;
  const { mutate: savePersonalInfo, isPending } = useUpdatePersonalInfo(userId);

  const form = useForm<PersonalInfoFormInput, unknown, UpdatePersonalInfoValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      language: user?.language === "en" ? "en" : "de",
      location: {
        state: user?.location?.state ?? "",
        city: user?.location?.city ?? "",
        district: user?.location?.district ?? "",
        zipCode: user?.location?.zipCode ?? "",
        country: user?.location?.country ?? "",
      },
    },
  });

  function onSubmit(data: UpdatePersonalInfoValues) {
    savePersonalInfo(data, {
      onSuccess: () => {
        onCancel();
      },
    });
  }

  function handleCancel() {
    form.reset();
    onCancel();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-7 tablet:grid-cols-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-first-name">{t("firstName")}</FieldLabel>
                <Input
                  {...field}
                  id="profile-first-name"
                  aria-invalid={fieldState.invalid}
                  autoComplete="given-name"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-last-name">{t("lastName")}</FieldLabel>
                <Input
                  {...field}
                  id="profile-last-name"
                  aria-invalid={fieldState.invalid}
                  autoComplete="family-name"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-username">{t("username")}</FieldLabel>
                <Input
                  {...field}
                  id="profile-username"
                  aria-invalid={fieldState.invalid}
                  autoComplete="username"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-email">{t("emailRequired")}</FieldLabel>
                <Input
                  {...field}
                  id="profile-email"
                  type="email"
                  readOnly
                  className="bg-muted text-muted-foreground"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="language"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-language">{t("languageOptional")}</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value === "de" || value === "en") field.onChange(value);
                  }}
                  items={languageItems}
                >
                  <SelectTrigger id="profile-language" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">{t("german")}</SelectItem>
                    <SelectItem value="en">{t("english")}</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="location.city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-city">{t("cityRequired")}</FieldLabel>
                <Input
                  {...field}
                  id="profile-city"
                  aria-invalid={fieldState.invalid}
                  autoComplete="address-level2"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="location.country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-country">{t("countryRequired")}</FieldLabel>
                <Input
                  {...field}
                  id="profile-country"
                  aria-invalid={fieldState.invalid}
                  autoComplete="country-name"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="location.zipCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-zip">{t("zipRequired")}</FieldLabel>
                <Input
                  {...field}
                  id="profile-zip"
                  inputMode="numeric"
                  aria-invalid={fieldState.invalid}
                  autoComplete="postal-code"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="location.district"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-district">{t("districtOptional")}</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="profile-district"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="location.state"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-state">{t("stateOptional")}</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="profile-state"
                  aria-invalid={fieldState.invalid}
                  autoComplete="address-level1"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
          {common("cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? common("saving") : common("save")}
        </Button>
      </div>
    </form>
  );
};

export default UpdatePersonalInfoForm;
