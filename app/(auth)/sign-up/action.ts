"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;

  const user = await db.profile.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return { error: "User already exist. Sign in instead." };
  }

  const { data, error } = await auth.signUp.email({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message || "Failed to create account" };
  }

  redirect("/");
}
