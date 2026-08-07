"use client";

import { Button } from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  return (
    <div className="w-full p-6 text-center">
      <h1 className="text-2xl font-bold">Check your email</h1>
      <p className="text-muted-foreground mt-2">
        {email ? (
          <>
            We sent a password reset link to <strong>{email}</strong>.
          </>
        ) : (
          "We sent you a password reset link."
        )}{" "}
        Click the link in that email to continue.
      </p>
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => router.push("/sign-in")}
      >
        Back to sign in
      </Button>
    </div>
  );
}
