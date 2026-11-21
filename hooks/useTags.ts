import { Tag } from "@/lib/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ["tags", "all"],
    queryFn: async () => {
      const response = await axios.get("/api/tags");
      return response.data;
    },
    staleTime: Infinity, // never refetch unless you manually invalidate
  });
}
