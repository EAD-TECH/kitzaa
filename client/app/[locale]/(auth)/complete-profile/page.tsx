import { CompleteProfileForm } from "@/features/auth/components/completeProfileForm";

export default function CompleteProfilePage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md">
        <CompleteProfileForm />
      </div>
    </div>
  );
}
