"use client";

import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldGroup } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import { authClient } from "@/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z.email("Enter a valid email").min(1, "Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handlePasswordReset = async (data: z.infer<typeof formSchema>) => {
    try {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      router.push(
        `/forgot-password/check-email?email=${encodeURIComponent(data.email)}`,
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send password reset email");
    }
  };

  const isPending = form.formState.isSubmitting;

  return (
    <form
      id="form-forgot-password"
      onSubmit={form.handleSubmit(handlePasswordReset)}
      className="w-full p-6"
    >
      <Button
        type="button"
        variant="outline"
        className="absolute top-4 left-4 h-9 w-9 rounded-full p-0"
        onClick={() => router.push("/sign-in")}
      >
        <ArrowLeft />
      </Button>

      <div className="my-8 text-center">
        <h1 className="text-2xl font-bold">Forgot Password?</h1>
        <p className="text-muted-foreground">
          Don't worry! Enter your email and we'll send you a link to reset your
          password.
        </p>
      </div>

      <div className="space-y-4">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup className="bg-accent/50 h-11 px-2">
                  <InputGroupInput
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    id="form-signin-email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                    className="truncate"
                    disabled={isPending}
                  />
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
              {isPending ? "Sending..." : "Send"}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </form>
  );
}
