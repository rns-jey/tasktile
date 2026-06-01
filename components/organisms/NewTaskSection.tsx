"use client";

import React from "react";

import { Plus } from "lucide-react";
import { Button } from "../atoms/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../molecules/Card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values);
}

export default function NewTaskSection() {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: null,
      dueDate: null,
    },
  });

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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Form fields would go here */}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button onClick={() => setIsOpen(false)}>Create</Button>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
