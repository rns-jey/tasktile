import React from "react";
import {
  Control,
  Controller,
  FieldPath,
  UseFormSetValue,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/Field";
import { Input } from "../ui/Input";
import { cn } from "@/lib/utils";
import { TaskFormValues } from "@/types";

const colors = [
  { name: "red-500", bg: "bg-red-500" },
  { name: "orange-500", bg: "bg-orange-500" },
  { name: "yellow-500", bg: "bg-yellow-500" },
  { name: "green-500", bg: "bg-green-500" },
  { name: "blue-500", bg: "bg-blue-500" },
  { name: "indigo-500", bg: "bg-indigo-500" },
  { name: "purple-500", bg: "bg-purple-500" },
  { name: "pink-500", bg: "bg-pink-500" },
];

interface InputCategoryProps {
  id: string;
  name: FieldPath<{ categoryName: string }>;
  control: Control<TaskFormValues>;
  label: string;
  placeholder: string;
  setValue: UseFormSetValue<TaskFormValues>;
}

export default function InputCategory({
  id,
  name,
  control,
  label,
  placeholder,
  setValue,
}: InputCategoryProps) {
  const [selectedColor, setColor] = React.useState("red-500");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="flex flex-col gap-1">
            <Input
              {...field}
              id={id}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

            <div className="grid grid-cols-6 gap-1">
              {colors.map((color, id) => (
                <div
                  key={`color_${id}`}
                  className={cn(
                    selectedColor !== color.name && "border-transparent",
                    "rounded-full border-2 p-1",
                  )}
                  onClick={() => {
                    setValue("categoryColor", color.name);
                    setColor(color.name);
                  }}
                >
                  <div
                    className={`${color.bg} h-5 w-5 cursor-pointer rounded-full`}
                  />
                </div>
              ))}
            </div>
          </div>
        </Field>
      )}
    />
  );
}
