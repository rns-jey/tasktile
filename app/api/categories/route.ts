import currentProfile from "@/lib/profile";
import { getCategories, getCategoryWithCounts } from "@/lib/queries/categories";

// app/api/categories/route.ts
export async function GET(req: Request) {
  const currentUser = await currentProfile();
  if (!currentUser) return new Response("Unauthorized", { status: 401 });

  const withCounts = new URL(req.url).searchParams.get("counts") === "true";

  const categories = withCounts
    ? await getCategoryWithCounts(currentUser.userID)
    : await getCategories(currentUser.userID);

  return Response.json(categories);
}
