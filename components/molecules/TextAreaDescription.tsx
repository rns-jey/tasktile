import React from "react";
import { Control, Controller, FieldPath } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/Field";
import { TaskFormValues } from "@/types";
import { Textarea } from "@/components/ui/TextArea";

interface TextAreaDescriptionProps {
  id: string;
  name: FieldPath<{ description: string }>;
  control: Control<TaskFormValues>;
  label: string;
  placeholder: string;
}

export default function TextAreaDescription({
  id,
  name,
  control,
  label,
  placeholder,
}: TextAreaDescriptionProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>Description</FieldLabel>
          <Textarea
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
