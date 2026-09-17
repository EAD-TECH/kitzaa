import { ArrowLeftIcon } from "lucide-react";

import { SetupAccountForm } from "@/features/auth/components/setup-account-form";

export default async function RegisterPage() {
 

  return (
    <div className="grid h-svh lg:grid-cols-2">
      <div className="scrollbar-subtle flex flex-col gap-4 overflow-y-auto p-6 md:px-10">
       
        <div className="flex flex-1 items-center justify-center mb-20">
          <div className="w-full max-w-md">
            <SetupAccountForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/register-image.png"
          alt="setup_account"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
