import { Button } from "@/components/atoms/Button";
import { DrawerClose, DrawerHeader, DrawerTitle } from "@/components/ui/Drawer";
import { Field, FieldError, FieldGroup } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import { Stack } from "@/lib/generated/prisma/client";
import { StackFormValues } from "@/lib/models/stacks/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface StackFormProps {
  form: UseFormReturn<StackFormValues>;
  formId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: () => void;
}

export default function StackForm({
  form,
  formId,
  setOpen,
  onDelete,
}: StackFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const addStack = useMutation<Stack, Error, StackFormValues>({
    mutationFn: async (newStack) => {
      const response = await axios.post("/api/stacks/new", newStack);
      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        form.setError("name", {
          message: "You already have a stack with that name",
        });
      } else {
        toast.error("Couldn't create stack");
      }
    },

    onSuccess: (stack) => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
      form.reset();
      router.push(`/stacks/${stack.id}`);
    },
  });

  function onSubmit(values: StackFormValues) {
    addStack.mutate(values);
  }

  const formPending = addStack.isPending;

  return (
    <Fragment>
      <DrawerHeader className="flex flex-row items-center justify-between py-4">
        <DrawerClose
          // disabled={formPending}
          className="text-muted-foreground h-11 px-2 font-medium"
        >
          Cancel
        </DrawerClose>
        <DrawerTitle>{"New Stack"}</DrawerTitle>
        <Button
          className="px-4"
          type="submit"
          form={formId}
          // disabled={formPending}
        >
          Create
        </Button>
      </DrawerHeader>

      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-4"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            disabled={formPending}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="pb-2">
                <InputGroup>
                  <InputGroupAddon>
                    <Layers />
                  </InputGroupAddon>

                  <InputGroupInput
                    {...field}
                    id={`${formId}-name`}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="e.g. Work, Groceries, Side project"
                  />
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </Fragment>
  );
}
