"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api/client";
import { mapVerifyEmailError, useVerifyEmail } from "./hooks/useVerifyEmail";

export function VerifyEmailView({
  token,
  className,
  ...props
}: React.ComponentProps<"div"> & { token?: string }) {
  const t = useTranslations("VerifyEmail");
  const { mutate, isSuccess, error } = useVerifyEmail();

  useEffect(() => {
    if (!token) return;
    mutate(token);
  }, [token, mutate]);

  const isExpired = error instanceof ApiError && error.status === 400;

  if (token && isSuccess) {
    return (
      <VerifyEmailShell className={className} {...props}>
        <h1 className="text-3xl font-heading font-semibold">{t("successTitle")}</h1>
        <p className="font-body text-sm text-muted-foreground">{t("successBody")}</p>
        <Link href="/login" className="text-sm underline underline-offset-4">
          {t("backToLogin")}
        </Link>
      </VerifyEmailShell>
    );
  }

  if (token && error) {
    return (
      <VerifyEmailShell className={className} {...props}>
        <h1 className="text-3xl font-heading font-semibold">
          {isExpired ? t("expiredTitle") : t("errorTitle")}
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          {mapVerifyEmailError(error, t)}
        </p>
        <Link href="/login" className="text-sm underline underline-offset-4">
          {t("backToLogin")}
        </Link>
      </VerifyEmailShell>
    );
  }

  if (token) {
    return (
      <VerifyEmailShell className={className} {...props}>
        <h1 className="text-3xl font-heading font-semibold">{t("loadingTitle")}</h1>
        <p className="font-body text-sm text-muted-foreground">{t("loadingBody")}</p>
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </VerifyEmailShell>
    );
  }

  return (
    <VerifyEmailShell className={className} {...props}>
      <h1 className="text-3xl font-heading font-semibold">{t("pendingTitle")}</h1>
      <p className="font-body text-sm text-muted-foreground">{t("pendingBody")}</p>
      <Link href="/login" className="text-sm underline underline-offset-4">
        {t("backToLogin")}
      </Link>
    </VerifyEmailShell>
  );
}

function VerifyEmailShell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-3 text-center">
        <Link href="/" className="inline-flex items-center">
          <img src="/images/logo.png" alt="Kitzaa" className="h-50 w-auto object-contain" />
        </Link>
        {children}
      </div>
    </div>
  );
}
