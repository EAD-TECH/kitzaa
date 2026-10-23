"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { useGermanZipLookup } from "../germanPostalLookup";
import { useCompleteProfile } from "../hooks/useCompleteProfile";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthStore } from "../store/authStore";
import {
  createCompleteProfileSchema,
  type CompleteProfileValues,
} from "../validations/completeProfile.schema";

function profileErrorMessage(error: unknown, t: (key: string) => string): string {
  if (!(error instanceof ApiError)) return t("submitFailed");
  if (error.status === 409) return t("usernameTaken");
  if (error.status === 503) return t("lookupUnavailable");
  if (error.status === 400) return t("addressMismatch");
  return t("submitFailed");
}

export function CompleteProfileForm() {
  const t = useTranslations("CompleteProfile");
  const router = useRouter();
  const isReady = useAuthStore((state) => state.isReady);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: user } = useCurrentUser();
  const { mutate: saveProfile, isPending, error } = useCompleteProfile();
  const [isLookingUpZip, setIsLookingUpZip] = useState(false);
  const schema = createCompleteProfileSchema(t);

  const form = useForm<CompleteProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      postalCode: "",
      city: "",
      state: "",
    },
  });

  const postalCode = form.watch("postalCode");

  useGermanZipLookup(postalCode, {
    onIncomplete: () => form.clearErrors("postalCode"),
    onStart: () => {
      setIsLookingUpZip(true);
      form.clearErrors("postalCode");
    },
    onPlace: (place) => {
      form.setValue("city", place.city, { shouldValidate: true });
      form.setValue("state", place.state, { shouldValidate: true });
    },
    onInvalid: () => {
      form.setError("postalCode", { type: "manual", message: t("invalidZip") });
    },
    onDone: () => setIsLookingUpZip(false),
  });

  useEffect(() => {
    if (!isReady) return;
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (user?.profileCompleted) {
      router.replace("/");
    }
  }, [isReady, accessToken, user, router]);

  if (!isReady || !accessToken || user?.profileCompleted) return null;

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        autoComplete="off"
        onSubmit={form.handleSubmit((values) => saveProfile(values))}
      >
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("username")}</FormLabel>
              <FormControl>
                <Input type="text" placeholder={t("usernamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("zipCode")}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="12345" {...field} />
              </FormControl>
              {isLookingUpZip ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  {t("zipLookup")}
                </p>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("city")}</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Berlin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("state")}</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Berlin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {error ? <p className="text-sm text-destructive">{profileErrorMessage(error, t)}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
      </form>
    </Form>
  );
}
