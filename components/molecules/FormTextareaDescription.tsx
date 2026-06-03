import { Control, Controller, FieldPath } from "react-hook-form";

import { Field, FieldError } from "@/components/ui/Field";
import { InputGroup, InputGroupTextarea } from "@/components/ui/InputGroup";

import type { TaskFormValues } from "@/types";

interface FormTextareaDescriptionProps {
  id: string;
  name: FieldPath<{ description: string }>;
  control: Control<TaskFormValues>;
  label?: string;
  placeholder: string;
  disabled?: boolean;
}

export default function FormTextareaDescription({
  id,
  name,
  control,
  label,
  placeholder,
  disabled,
}: FormTextareaDescriptionProps) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <InputGroup>
            <InputGroupTextarea
              {...field}
              id={id}
              placeholder={placeholder}
              rows={6}
              className="min-h-24 resize-none"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </InputGroup>
        </Field>
      )}
    />
  );
}
