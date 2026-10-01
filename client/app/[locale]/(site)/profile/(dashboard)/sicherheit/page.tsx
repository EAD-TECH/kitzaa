import { ShieldCheck } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";

const SicherheitPage = () => {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 tablet:flex-row tablet:items-center tablet:gap-8 tablet:p-8">
      <div className="flex w-full flex-col items-center gap-4 text-center tablet:max-w-xs tablet:shrink-0">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ShieldCheck className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-lg font-semibold text-foreground">Passwort ändern</h2>
          <p className="text-sm text-muted-foreground">
            Hier kannst du dein Passwort ändern, um dein Konto besser zu schützen.
          </p>
        </div>
      </div>

      <Separator className="tablet:hidden" />
      <Separator orientation="vertical" className="hidden tablet:block" />

      <ChangePasswordForm />
    </div>
  );
};

export default SicherheitPage;
