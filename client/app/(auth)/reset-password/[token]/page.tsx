type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <main>
      <h1>Reset Password</h1>
      <p>Reset password placeholder — token: {token}</p>
    </main>
  );
}
