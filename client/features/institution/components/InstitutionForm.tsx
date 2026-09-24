"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";

import { useUpdateMyInstitution } from "../hooks/useInstitution";
import type { Institution } from "../types/institution.types";
import {
  institutionSchema,
  type InstitutionFormValues,
} from "../validations/institution.schema";

function toNullable(value?: string) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function toWebsite(value?: string) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

type InstitutionFormProps = {
  institution: Institution;
  onCancel: () => void;
};

export const InstitutionForm = ({
  institution,
  onCancel,
}: InstitutionFormProps) => {
  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      name: institution.name ?? "",
      description: institution.description ?? "",
      phone: institution.phone ?? "",
      website: institution.website ?? "",
      address: institution.address ?? "",
    },
  });

  const { mutate: updateInstitution, isPending } =
    useUpdateMyInstitution();

  const description = useWatch({
    control: form.control,
    name: "description",
  });

  function onSubmit(data: InstitutionFormValues) {
    updateInstitution(
      {
        name: data.name.trim(),
        description: toNullable(data.description),
        phone: toNullable(data.phone),
        website: toWebsite(data.website),
        address: toNullable(data.address),
      },
      {
        onSuccess: () => {
          onCancel();
        },
      },
    );
  }

  function handleCancel() {
    form.reset();
    onCancel();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="institution-name">Name der Institution (erforderlich)</FieldLabel>
              <Input
                {...field}
                id="institution-name"
                aria-invalid={fieldState.invalid}
                autoComplete="organization"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="institution-description">Beschreibung (optional)</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="institution-description"
                  rows={4}
                  maxLength={1000}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {description?.length ?? 0}/1000
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-7 tablet:grid-cols-3">
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="institution-phone">Telefon (optional)</FieldLabel>
                <Input
                  {...field}
                  id="institution-phone"
                  type="tel"
                  aria-invalid={fieldState.invalid}
                  autoComplete="tel"
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
                <FieldLabel htmlFor="institution-website">Website (optional)</FieldLabel>
                <Input
                  {...field}
                  id="institution-website"
                  type="url"
                  placeholder="https://..."
                  aria-invalid={fieldState.invalid}
                  autoComplete="url"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="institution-address">Adresse (optional)</FieldLabel>
                <Input {...field} id="institution-address" aria-invalid={fieldState.invalid} autoComplete="street-address" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
        >
          Abbrechen
        </Button>

        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Wird gespeichert..." : "Speichern"}
        </Button>
      </div>
    </form>
  );
};