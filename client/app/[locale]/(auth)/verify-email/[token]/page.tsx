import { VerifyEmailView } from "@/features/auth/verify-email-view";

type VerifyEmailTokenPageProps = {
  params: Promise<{ token: string }>;
};

export default async function VerifyEmailTokenPage({
  params,
}: VerifyEmailTokenPageProps) {
  const { token } = await params;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyEmailView token={token} />
      </div>
    </div>
  );
}
