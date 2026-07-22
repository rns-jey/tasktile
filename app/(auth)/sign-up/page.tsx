"use client";

import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldGroup } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOffIcon, LockIcon, MailIcon, User } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { signUpWithEmail } from "./action";

const formSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
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

export default function SignUpPage() {
  const [state, dispatch, isPending] = useActionState(signUpWithEmail, null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onValid(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(() => dispatch(formData));
  }

  return (
    <form id="form-signup" onSubmit={form.handleSubmit(onValid)}>
      <div className="w-full p-4">
        <div className="my-8 text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Sign up in seconds and start being productive.
          </p>
        </div>

        <div className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="bg-accent/50 h-11 px-2">
                    <InputGroupInput
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                      id="form-signup-name"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    <InputGroupAddon>
                      <User />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
                      id="form-signup-email"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
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
                      id="form-signup-password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
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
              form="form-signup"
              disabled={isPending}
              className="h-11 w-full text-base"
            >
              Sign Up
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
            <p>Already have an account?</p>
            <Link href={"/sign-in"} className="text-primary font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
