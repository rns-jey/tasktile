import { Control, Controller, FieldPath } from "react-hook-form";

import CalendarDueDate from "@/components/molecules/CalendarDueDate";

import { Field } from "@/components/ui/Field";

import type { TaskFormValues } from "@/types";

interface FormSelecDueDateProps {
  id: string;
  name: FieldPath<{ dueDate: Date | null }>;
  control: Control<TaskFormValues>;
  disabled?: boolean;
}

export default function FormSelecDueDate({
  id,
  name,
  control,
  disabled,
}: FormSelecDueDateProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <CalendarDueDate
            {...field}
            id={id}
            selected={field.value}
            onSelect={field.onChange}
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
}
