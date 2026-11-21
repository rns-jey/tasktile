"use client";

import { useStacks } from "@/hooks/useStacks";
import { Stack } from "@/lib/generated/prisma/client";
import { TaskWithTags } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check, ChevronsUpDownIcon, X } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../atoms/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/Drawer";

type MoveTaskProps = {
  selectingStack: boolean;
  setSelectingStack: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskWithTags;
  onMoved: () => void;
};

export default function MoveTask({
  selectingStack,
  setSelectingStack,
  task,
  onMoved,
}: MoveTaskProps) {
  const { data: stacks = [] } = useStacks();
  const stackLabel = task.stack ? task.stack.name : "Inbox";
  const { stackId: urlStackId } = useParams<{ stackId?: string }>();

  const queryClient = useQueryClient();

  const moveTask = useMutation<TaskWithTags, Error, Stack>({
    mutationFn: async (stack) => {
      const response = await axios.patch(`/api/tasks/${task.id}/move`, {
        stackId: stack.id,
      });

      return response.data;
    },
    onError: () => toast.error("Couldn't move task"),
    onSuccess: async (_data, stack) => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });

      const leavesPage = urlStackId !== undefined && stack.id !== urlStackId;

      if (leavesPage) {
        onMoved();
      }

      setSelectingStack(false);

      toast.success(`Task moved to ${stack.name}`, {
        position: "top-center",
      });
    },
  });

  function changeStack(stack: Stack) {
    if (stack.id === task.stackId) {
      setSelectingStack(false);
      return;
    }
    moveTask.mutate(stack);
  }

  return (
    <Drawer open={selectingStack} onOpenChange={setSelectingStack}>
      <DrawerTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="text-lg font-semibold"
          />
        }
      >
        {stackLabel}
        <ChevronsUpDownIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="grid grid-cols-3">
          <DrawerClose>
            <X />
          </DrawerClose>
          <DrawerTitle>Move to ... </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col p-4">
          {stacks.map((stack) => (
            <Button
              type="button"
              variant="ghost"
              key={stack.id}
              onClick={() => {
                changeStack(stack);
              }}
              className="border-b-ink justify-between rounded-none last:border-0"
            >
              <span>{stack.name}</span>
              {stackLabel === stack.name && <Check />}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
