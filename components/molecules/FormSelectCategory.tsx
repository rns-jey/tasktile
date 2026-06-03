import { Control, Controller, FieldPath } from "react-hook-form";

import { Field } from "@/components/ui/Field";

import SelectCategory from "@/components/molecules/SelectCategory";

import type { TaskFormValues } from "@/types";

interface FormSelectCategoryProps {
  id: string;
  name: FieldPath<{ categoryId: string | null }>;
  control: Control<TaskFormValues>;
  disabled?: boolean;
}

export default function FormSelectCategory({
  id,
  name,
  control,
  disabled,
}: FormSelectCategoryProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <SelectCategory
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
