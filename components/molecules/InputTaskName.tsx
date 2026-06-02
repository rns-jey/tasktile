import React from "react";
import { Control, Controller, FieldPath } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { TaskFormValues } from "@/types";

interface InputTaskNameProps {
  id: string;
  name: FieldPath<{ name: string }>;
  control: Control<TaskFormValues>;
  label: string;
  placeholder: string;
}

export default function InputTaskName({
  id,
  name,
  control,
  label,
  placeholder,
}: InputTaskNameProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
