import { TaskWithCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../atoms/Button";
import CalendarLabel from "../molecules/CalendarLabel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/Drawer";
import { Label } from "../ui/Label";
import { ScrollArea } from "../ui/ScrollArea";
import FullCalendar from "./FullCalendar";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

type CalendarDrawerProps = {
  value: Date | null;
  onChange?: (value: Date | null) => void;
  disabled?: boolean;
  task?: TaskWithCategory;
};

export default function CalendarDrawer({
  value,
  onChange,
  task,
}: CalendarDrawerProps) {
  const [date, setDate] = useState<Date | null>(value);

  const queryClient = useQueryClient();

  const changeDueOn = useMutation({
    mutationFn: async (dueOn: Date | null) => {
      const response = await axios.patch(`/api/tasks/${task?.id}`, {
        dueOn: dueOn,
      });
      return response.data;
    },
    onError: () => {},
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button
            type="button"
            variant="secondary"
            className="h-10 justify-start"
          />
        }
      >
        <CalendarIcon /> {value ? format(value, "dd MMM") : "Date"}
      </DrawerTrigger>
      <DrawerContent className="h-dvh">
        <DrawerHeader className="grid grid-cols-3 items-center">
          <DrawerClose onClick={() => setDate(value)}>
            <X />
          </DrawerClose>
          <DrawerTitle>Due on ... </DrawerTitle>
          <DrawerClose
            render={
              <Button
                onClick={() => {
                  if (onChange) onChange(date ?? null);
                }}
              />
            }
          >
            Set date
          </DrawerClose>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col py-4">
          <Label className="mx-4 border p-2">
            <CalendarLabel date={date ?? null} />
          </Label>

          <div className="mx-auto grid w-full max-w-80 grid-cols-7 border-b py-2">
            {weekDays.map((wd, wdi) => (
              <div key={wdi} className="text-center">
                {wd}
              </div>
            ))}
          </div>

          <ScrollArea className="min-h-0 flex-1 p-4">
            <FullCalendar selected={date} onSelect={setDate} />
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
