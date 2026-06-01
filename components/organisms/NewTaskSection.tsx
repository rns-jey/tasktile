"use client";

import React from "react";

import { Plus } from "lucide-react";
import { Button } from "../atoms/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../molecules/Card";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel, FieldError } from "../molecules/Field";
import { Input } from "../atoms/Input";
import { Textarea } from "../atoms/TextArea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../molecules/Select";
import { Popover, PopoverTrigger, PopoverContent } from "../molecules/Popover";
import { Calendar } from "./Calendar";
import { CalendarIcon } from "lucide-react";
import { Separator } from "../atoms/Separator";

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  categoryId: z.string().nullish(),
  dueDate: z.union([
    z.date(),
    z.null(),
    z.undefined(), // Allow null values
  ]),
});

export default function NewTaskSection() {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "2",
      dueDate: null,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
    } catch (error) {}
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="text-muted-foreground flex w-full items-center justify-start gap-2 border-dashed"
        onClick={() => setIsOpen(true)}
      >
        <Plus />
        Add new task
      </Button>
    );
  }

  return (
    <Card className="ring-primary">
      <CardHeader className="text-base font-bold">New Task</CardHeader>
      <CardContent>
        <form id="form-add-task" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-task-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-add-task-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Add a new task ..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-task-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-add-task-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Add a description ..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-2">
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="form-add-task-categoryId">
                      Category
                    </FieldLabel>
                    <Select
                      {...field}
                      value={field.value}
                      onValueChange={field.onChange}
                      onOpenChange={() => field.onBlur()}
                    >
                      <SelectTrigger
                        id="form-add-task-categoryId"
                        className="w-full max-w-48"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          <SelectItem value="0">Work</SelectItem>
                          <SelectItem value="1">Personal</SelectItem>
                          <SelectItem value="2">Shopping</SelectItem>
                          <SelectItem value="3">Health</SelectItem>
                          <SelectItem value="4">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                name="dueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="form-add-task-dueDate">
                      Due Date
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-start gap-2"
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          {...field}
                          id="form-add-task-dueDate"
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
                                new Date(
                                  new Date().setDate(new Date().getDate() + 1),
                                ),
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
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="submit" form="form-add-task">
          Create
        </Button>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
