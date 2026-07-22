"use client";

import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldGroup } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { signInWithEmail } from "./action";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function SignInPage() {
  const [state, dispatch, isPending] = useActionState(signInWithEmail, null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onValid(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(() => dispatch(formData));
  }

  return (
    <form
      id="form-signin"
      onSubmit={form.handleSubmit(onValid)}
      className="w-full p-6"
    >
      <div className="my-8 text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to continue where you left off.
        </p>
      </div>

      {state?.error && (
        <p className="mb-4 text-center text-sm text-red-500">{state.error}</p>
      )}

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
                    id="form-signin-password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                  />
                  <InputGroupAddon>
                    <LockIcon />
                  </InputGroupAddon>
                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                  >
                    <EyeOffIcon />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex flex-col items-center space-y-2">
          <Button
            type="submit"
            form="form-signin"
            disabled={isPending}
            className="h-11 w-full text-base"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>

          <div className="flex w-full items-center gap-2">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-neutral-300 dark:via-neutral-700" />
            or
            <div className="h-[1px] w-full bg-gradient-to-r from-neutral-300 to-transparent dark:via-neutral-700" />
          </div>

          {/* For future implementation */}
          <div className="flex w-full gap-2">
            <Button type="button" className="h-11 flex-1 text-base">
              Github
            </Button>
            <Button type="button" className="h-11 flex-1 text-base">
              Google
            </Button>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-1">
          <p>Don't have an account yet?</p>
          <Link href={"/sign-up"} className="text-primary font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
