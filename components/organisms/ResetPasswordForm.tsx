"use client";

import { authClient } from "@/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOffIcon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Field, FieldError, FieldGroup } from "../ui/Field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/InputGroup";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const handlePasswordReset = async (data: z.infer<typeof formSchema>) => {
    try {
      const { error } = await authClient.resetPassword({
        token: token,
        newPassword: data.password,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset successful! You can now log in.");

      router.push("/sign-in");
    } catch (error) {
      console.error("Error resetting password:", error);

      toast.error("Failed to reset password");
    }
  };

  const isPending = form.formState.isSubmitting;

  return (
    <form
      id="form-forgot-password"
      onSubmit={form.handleSubmit(handlePasswordReset)}
      className="w-full p-6"
    >
      <div className="my-8 text-center">
        <h1 className="text-2xl font-bold">Change Password</h1>
        <p className="text-muted-foreground">
          Enter your new password below to change your account password.
        </p>
      </div>

      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputGroup className="bg-accent/50 h-11 px-2">
                <InputGroupInput
                  {...field}
                  type="password"
                  placeholder="Password"
                  id="form-signup-password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end" className="cursor-pointer">
                  <EyeOffIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputGroup className="bg-accent/50 h-11 px-2">
                <InputGroupInput
                  {...field}
                  type="password"
                  placeholder="Confirm Password"
                  id="form-signup-confirm-password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end" className="cursor-pointer">
                  <EyeOffIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            form="form-forgot-password"
            disabled={isPending}
            className="h-11 w-full text-base"
          >
            {isPending ? "Signing in..." : "Sign In"}
            Change Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
