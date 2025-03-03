"use client";

import { boolean, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Task } from "@prisma/client";

import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../atoms/form";
import { Checkbox } from "../atoms/checkbox";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CheckBoxFormProps {
  task: Task;
}

const FormSchema = z.object({
  complete: z.boolean(),
});

export default function CheckBoxForm({ task }: CheckBoxFormProps) {
  const [isLoading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      complete: task.complete,
    },
  });

  const router = useRouter();

  async function onSubmit(checked: boolean) {
    try {
      setLoading(true);
      await axios.patch(`/api/task/${task.id}`, { complete: checked });

      setLoading(false);
    } catch (error) {
      console.error("Failed to update task", error);
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="complete"
          render={({ field }) => (
            <FormItem className="flex">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    field.onChange(checked);
                    onSubmit(checked);
                  }}
                  disabled={isLoading}
                />
              </FormControl>

              <FormLabel>{task.name}</FormLabel>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
