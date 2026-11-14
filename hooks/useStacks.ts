import { StackWithTaskCount } from "@/lib/models/stacks/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useStacks() {
  return useQuery<StackWithTaskCount[]>({
    queryKey: ["stacks", "list"],
    queryFn: async () => {
      const response = await axios.get("/api/stacks");
      return response.data;
    },
    // select: (stacks) => stacks.filter((t) => !isPendingDelete(t.id)),
    staleTime: 60 * 1000,
  });
}
