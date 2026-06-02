import React from "react";
import { Control, Controller, FieldPath } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/Field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { Separator } from "@/components/ui/Separator";
import { TaskFormValues } from "@/types";

interface CalendarDueDateProps {
  id: string;
  name: FieldPath<{ dueDate?: Date | undefined }>;
  control: Control<TaskFormValues>;
  label: string;
}

export default function CalendarDueDate({
  id,
  name,
  control,
  label,
}: CalendarDueDateProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex w-full items-center justify-start gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                {field.value
                  ? field.value.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                {...field}
                id={id}
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                className="w-full"
              />
              <Separator />
              <div className="flex justify-between gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange(null)}
                >
                  No due date
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    field.onChange(
                      new Date(new Date().setDate(new Date().getDate() + 1)),
                    )
                  }
                >
                  Tomorrow
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </Field>
      )}
    />
  );
}
