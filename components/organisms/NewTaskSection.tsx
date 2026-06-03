"use client";

import React from "react";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";

import NewTaskForm from "@/components/organisms/NewTaskForm";

export default function NewTaskSection() {
  const [isOpen, setIsOpen] = React.useState(false);

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
      <NewTaskForm setIsOpen={setIsOpen} />
    </Card>
  );
}
