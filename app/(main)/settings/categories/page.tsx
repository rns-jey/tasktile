import CategoryButtons from "@/components/organisms/CategoryButtons";
import NewCategoryDrawer from "@/components/organisms/NewCategoryDrawer";
import currentProfile from "@/lib/profile";
import { getCategoryWithCounts } from "@/lib/queries/categories";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function CategoriesPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const categories = await getCategoryWithCounts(currentUser.userID);

  return (
    <Fragment>
      <CategoryButtons initialCategories={categories} />

      <NewCategoryDrawer />

      <p className="text-meta text-muted-2 px-5 pt-4 leading-[1.45]">
        Swipe left on a category to delete it…
      </p>
    </Fragment>
  );
}
