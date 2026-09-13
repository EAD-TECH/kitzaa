import { ArrowLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RegisterForm } from "@/features/auth/components/registerForm";

export default async function RegisterPage() {
  const t = await getTranslations("Register");

  return (
    <div className="grid h-svh lg:grid-cols-2">
      <div className="scrollbar-subtle flex flex-col gap-4 overflow-y-auto p-6 md:px-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            {t("backToHome")}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center mb-20">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/register-image.png"
          alt={t("imageAlt")}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
