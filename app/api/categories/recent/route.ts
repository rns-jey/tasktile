import currentProfile from "@/lib/profile";
import { getRecentCategories } from "@/lib/queries/categories";

export async function GET(req: Request) {
  const currentUser = await currentProfile();
  if (!currentUser) return new Response("Unauthorized", { status: 401 });

  const recentCategories = await getRecentCategories(currentUser.userID);

  return Response.json(recentCategories);
}
