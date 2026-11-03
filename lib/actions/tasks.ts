"use server";

import currentProfile from "../profile";
import { getTasksForDay } from "../queries/task";

export async function getTasksForDayAction(dayKey: string) {
  const user = await currentProfile();

  if (!user) throw new Error("Unauthorized");

  return getTasksForDay(user.userID, dayKey);
}
