"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateOrganizerApplication } from "../hooks/organizerHook";
import type { ApplyOrganizerInput } from "../validations/organizerApplication.schema";

const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/;

const INSTITUTION_CATEGORIES = [
  { value: "Spielgruppe", labelKey: "categories.playgroup" },
  { value: "Kita / Familienzentrum", labelKey: "categories.kita" },
  { value: "Museum / Kultur", labelKey: "categories.museum" },
  { value: "Outdoor / Natur", labelKey: "categories.outdoor" },
  { value: "Sport / Bewegung", labelKey: "categories.sport" },
  { value: "Workshop / Kurs", labelKey: "categories.workshop" },
  { value: "Sonstiges", labelKey: "categories.other" },
] as const;

type Translate = (key: string) => string;

const createFormSchema = (t: Translate) =>
  z.object({
    name: z.string().trim().min(2, t("validation.nameRequired")).max(120, t("validation.nameMax")),
    category: z.string().trim().max(60, t("validation.categoryMax")),
    description: z.string().trim().max(1000, t("validation.descriptionMax")),
    address: z.string().trim().max(200, t("validation.addressMax")),
    phone: z
      .string()
      .trim()
      .refine((value) => value === "" || PHONE_REGEX.test(value), t("validation.phoneInvalid")),
    website: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || z.string().url().safeParse(value).success,
        t("validation.urlInvalid"),
      ),
    message: z.string().trim().max(500, t("validation.messageMax")),
  });

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

function emptyToNull(value: string) {
  return value.trim() === "" ? null : value;
}

function toApplyPayload(data: FormValues): ApplyOrganizerInput {
  const { message, name, ...optionalInstitution } = data;

  return {
    institutionData: {
      name,
      category: emptyToNull(optionalInstitution.category),
      description: emptyToNull(optionalInstitution.description),
      address: emptyToNull(optionalInstitution.address),
      phone: emptyToNull(optionalInstitution.phone),
      website: emptyToNull(optionalInstitution.website),
    },
    message: emptyToNull(message),
  };
}

interface OrganizerApplicationFormProps {
  onCancel: () => void;
}

export default function OrganizerApplicationForm({ onCancel }: OrganizerApplicationFormProps) {
  const t = useTranslations("OrganizerApplication");
  const common = useTranslations("Common");
  const { mutate: submitApplication, isPending } = useCreateOrganizerApplication();
  const categoryItems = Object.fromEntries(
    INSTITUTION_CATEGORIES.map((category) => [category.value, t(category.labelKey)]),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      message: "",
    },
  });

  function onSubmit(data: FormValues) {
    submitApplication(toApplyPayload(data), {
      onSuccess: () => {
        form.reset();
        onCancel();
      },
    });
  }

  return (
    <Card className="w-full">
      <CardContent>
        <form id="organizer-application-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="organizer-application-name">
                    {t("name")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="organizer-application-name"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("namePlaceholder")}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="organizer-application-category">{t("categoryOptional")}</FieldLabel>
                  <Select
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? "")}
                    items={categoryItems}
                  >
                    <SelectTrigger
                      id="organizer-application-category"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTITUTION_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {t(category.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="organizer-application-description">
                    {t("descriptionOptional")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="organizer-application-description"
                      placeholder=""
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {t("characterCount", { count: field.value.length, max: 1000 })}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="organizer-application-address">{t("addressOptional")}</FieldLabel>
                  <Input
                    {...field}
                    id="organizer-application-address"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("addressPlaceholder")}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div className="grid grid-cols-1 gap-7 tablet:grid-cols-2">
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="organizer-application-phone">{t("phoneOptional")}</FieldLabel>
                    <Input
                      {...field}
                      id="organizer-application-phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="+49 30 1234567"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="website"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="organizer-application-website">{t("websiteOptional")}</FieldLabel>
                    <Input
                      {...field}
                      id="organizer-application-website"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://www.spielhaus-berlin.de"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="organizer-application-message">
                    {t("messageOptional")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="organizer-application-message"
                      placeholder=""
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {t("characterCount", { count: field.value.length, max: 500 })}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              form.reset();
              onCancel();
            }}
          >
            {common("cancel")}
          </Button>
          <Button type="submit" form="organizer-application-form" disabled={isPending}>
            {isPending ? t("sending") : t("send")}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
