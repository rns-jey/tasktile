"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";

import { useIsMobile } from "@/hooks/use-mobile";
import { localDay } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Button } from "../atoms/Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import { SidebarMenuButton } from "../ui/Sidebar";
import NewTaskForm from "./forms/NewTaskForm";

export default function NewTaskDrawer() {
  const [open, setOpen] = useState(false);

  const isMobile = useIsMobile();

  const { stackId: urlStackId } = useParams<{ stackId?: string }>();

  const pathname = usePathname();

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      stackId: urlStackId ?? null,
      categoryId: null,
      dueOn: (pathname === "/" && localDay()) || null,
    },
  });

  const scrollToOpenEnd = () =>
    requestAnimationFrame(() =>
      document
        .getElementById("open-end")
        ?.scrollIntoView({ behavior: "smooth", block: "end" }),
    );

  console.log(!isMobile);

  if (!isMobile) {
    return (
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) taskForm.setValue("stackId", urlStackId ?? null);
        }}
      >
        <DialogTrigger
          render={
            <SidebarMenuButton>
              <Plus />
              <span>Create new task</span>
            </SidebarMenuButton>
          }
        />
        <DialogContent>
          <NewTaskForm form={taskForm} urlStackId={urlStackId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) taskForm.setValue("stackId", urlStackId ?? null);
      }}
    >
      <DrawerTrigger
        render={
          <Button
            type="button"
            className={cn(
              "border-foreground absolute right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 m-4 size-14 rounded-xl border shadow-[3px_3px_0_var(--ink)] md:bottom-4",
              open && "hidden",
            )}
            onClick={scrollToOpenEnd}
          >
            <Plus className="size-7" />
          </Button>
        }
      />
      <DrawerContent>
        <NewTaskForm form={taskForm} urlStackId={urlStackId} />
      </DrawerContent>
    </Drawer>
  );
}
