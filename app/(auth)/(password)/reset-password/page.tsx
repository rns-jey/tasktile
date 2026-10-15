import ResetPasswordForm from "@/components/organisms/ResetPasswordForm";

import { redirect } from "next/navigation";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) redirect("/forgot-password");

  return <ResetPasswordForm token={token} />;
}
