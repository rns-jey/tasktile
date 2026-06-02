import React from "react";

import { Control, Controller, FieldPath } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/Field";
import { TaskFormValues } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components//ui/Select";
import { Category } from "@prisma/client";

interface SelectCategoryProps {
  id: string;
  name: FieldPath<{ categoryId?: string | null | undefined }>;
  control: Control<TaskFormValues>;
  label: string;
  placeholder: string;
  categories: Category[] | undefined;
}

export default function SelectCategory({
  id,
  name,
  control,
  label,
  placeholder,
  categories,
}: SelectCategoryProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Select
            {...field}
            value={field.value || undefined}
            onValueChange={field.onChange}
            onOpenChange={() => field.onBlur()}
          >
            <SelectTrigger id={id}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories &&
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div>yes</div>
                      {category.name}
                    </SelectItem>
                  ))}
                <SelectItem key="other" value="other">
                  other
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
