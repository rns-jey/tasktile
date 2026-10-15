import BackToSignIn from "@/components/atoms/BackToSignIn";
import { notFound } from "next/navigation";

export default async function CheckEmail({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  if (!email) notFound();

  return (
    <div className="w-full p-6 text-center">
      <h1 className="text-2xl font-bold">Check your email</h1>
      <p className="text-muted-foreground mt-2">
        We sent a password reset link to <strong>{email}</strong>. Click the
        link in that email to continue.
      </p>

      <BackToSignIn />
    </div>
  );
}
