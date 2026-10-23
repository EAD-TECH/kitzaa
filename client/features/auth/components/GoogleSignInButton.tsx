"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FieldError } from "@/components/ui/field";
import { ApiError } from "@/lib/api/client";
import {
  cancelGoogleButtonMount,
  googleAuthErrorKey,
  mountGoogleButton,
  type GoogleAuthErrorKey,
} from "../googleSignIn";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";

type GoogleSignInButtonProps = {
  context: "signin" | "signup";
  align?: "center";
};

export function GoogleSignInButton({ context, align }: GoogleSignInButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Login");
  const google = useGoogleSignIn();
  const [attempt, setAttempt] = useState(0);
  const [errorKey, setErrorKey] = useState<GoogleAuthErrorKey | null>(null);
  const handlers = useRef({ google, setErrorKey, setAttempt });
  handlers.current = { google, setErrorKey, setAttempt };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    void mountGoogleButton(host, {
      locale: locale === "en" ? "en" : "de",
      context,
      onCredential: (credential) => {
        handlers.current.setErrorKey(null);
        handlers.current.google.mutate(credential, {
          onError: (error) => {
            const key = error instanceof ApiError ? googleAuthErrorKey(error.message) : null;
            handlers.current.setErrorKey(key ?? "exchange");
            handlers.current.setAttempt((value) => value + 1);
          },
        });
      },
      onError: (key) => handlers.current.setErrorKey(key),
    });

    return () => {
      cancelGoogleButtonMount();
      host.replaceChildren();
    };
  }, [locale, context, attempt]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        ref={hostRef}
        className={
          align === "center"
            ? "mx-auto h-10 w-full max-w-[400px]"
            : "h-10 w-full max-w-full"
        }
      />
      {errorKey ? <FieldError>{t(`oauthErrors.${errorKey}`)}</FieldError> : null}
    </div>
  );
}
