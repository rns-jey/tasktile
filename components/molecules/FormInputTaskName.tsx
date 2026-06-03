import { Control, Controller, FieldPath } from "react-hook-form";

import { Field, FieldError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

import type { TaskFormValues } from "@/types";

interface FormInputTaskNameProps {
  id: string;
  name: FieldPath<{ name: string }>;
  control: Control<TaskFormValues>;
  label?: string;
  placeholder: string;
  disabled?: boolean;
}

export default function FormInputTaskName({
  id,
  name,
  control,
  label,
  placeholder,
  disabled,
}: FormInputTaskNameProps) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
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
