import { DayStat } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useStats() {
  return useQuery<DayStat[]>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await axios.get("/api/stats");
      return response.data;
    },
    staleTime: 60 * 1000 * 5,
  });
}
