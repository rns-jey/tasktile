"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

export default function BackToSignIn() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="mt-6"
      onClick={() => router.push("/sign-in")}
    >
      Back to sign in
    </Button>
  );
}
