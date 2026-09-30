"use client";

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
  "Spielgruppe",
  "Kita / Familienzentrum",
  "Museum / Kultur",
  "Outdoor / Natur",
  "Sport / Bewegung",
  "Workshop / Kurs",
  "Sonstiges",
] as const;

const CATEGORY_ITEMS = Object.fromEntries(
  INSTITUTION_CATEGORIES.map((category) => [category, category]),
);

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Institution name is required")
    .max(120, "Institution name cannot exceed 120 characters"),
  category: z.string().trim().max(60, "Category is too long"),
  description: z.string().trim().max(1000, "Description is too long"),
  address: z.string().trim().max(200, "Address is too long"),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || PHONE_REGEX.test(value), "Please enter a valid phone number"),
  website: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.string().url().safeParse(value).success,
      "Please enter a valid URL",
    ),
  message: z.string().trim().max(500, "Message is too long"),
});

type FormValues = z.infer<typeof formSchema>;

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
  const { mutate: submitApplication, isPending } = useCreateOrganizerApplication();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
                    Name der Einrichtung (erforderlich)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="organizer-application-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="z. B. Spielhaus Berlin"
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
                  <FieldLabel htmlFor="organizer-application-category">Kategorie (optional)</FieldLabel>
                  <Select
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? "")}
                    items={CATEGORY_ITEMS}
                  >
                    <SelectTrigger
                      id="organizer-application-category"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTITUTION_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                    Beschreibung (optional)
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
                        {field.value.length}/1000 characters
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
                  <FieldLabel htmlFor="organizer-application-address">Adresse (optional)</FieldLabel>
                  <Input
                    {...field}
                    id="organizer-application-address"
                    aria-invalid={fieldState.invalid}
                    placeholder="Straße, PLZ, Stadt"
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
                    <FieldLabel htmlFor="organizer-application-phone">Telefon (optional)</FieldLabel>
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
                    <FieldLabel htmlFor="organizer-application-website">Website (optional)</FieldLabel>
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
                    Nachricht an das Team (optional)
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
                        {field.value.length}/500 characters
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
            Abbrechen
          </Button>
          <Button type="submit" form="organizer-application-form" disabled={isPending}>
            {isPending ? "Wird gesendet…" : "Antrag senden"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
