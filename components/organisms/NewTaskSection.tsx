"use client";

import React from "react";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel, FieldError } from "../ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../ui/Select";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/Popover";
import { Calendar } from "@/components/ui/Calendar";
import { CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskWithCategory } from "@/types";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import NewTaskForm from "./NewTaskForm";

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
