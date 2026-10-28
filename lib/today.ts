import { cookies } from "next/headers";
import { dayInTz } from "./date";

export async function getToday() {
  const tz = (await cookies()).get("tz")?.value ?? "UTC";

  return new Date(`${dayInTz(tz)}T00:00:00Z`);
}
