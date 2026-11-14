"use client";

import { useState } from "react";

import { stackFormSchema, StackFormValues } from "@/lib/models/stacks/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../atoms/Button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import StackForm from "./Stack/StackForm";

export default function NewStackDrawer() {
  const [open, setOpen] = useState(false);

  const stackForm = useForm<StackFormValues>({
    resolver: zodResolver(stackFormSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
      }}
    >
      <DrawerTrigger
        render={
          <Button type="button" variant="ghost" className="ml-auto size-11" />
        }
      >
        <Plus />
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <StackForm form={stackForm} formId="new-stack-form" setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
}
