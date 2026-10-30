import CategoryButtons from "@/components/organisms/CategoryButtons";
import NewCategoryDrawer from "@/components/organisms/NewCategoryDrawer";
import currentProfile from "@/lib/profile";
import { getCategoryWithCounts } from "@/lib/queries/categories";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function CategoriesPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const categories = await getCategoryWithCounts(currentUser.userID);

  return (
    <Fragment>
      <a className="text-muted inline-flex h-11 items-center gap-1 text-base font-medium">
        <ChevronLeft /> Settings
      </a>

      <header className="flex flex-col justify-between gap-2 pb-4">
        <h1 className="font-display text-display-lg pt-1.5 tracking-[-.01em]">
          Categories
        </h1>
        <p className="text-body text-muted">
          Each category has its own colour. Tap one to rename it or change its
          colour.
        </p>
      </header>

      <CategoryButtons initialCategories={categories} />

      <NewCategoryDrawer />

      <p className="text-meta text-muted-2 px-5 pt-4 leading-[1.45]">
        Swipe left on a category to delete it…
      </p>
    </Fragment>
  );
}
