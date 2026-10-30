import { Button } from "@/components/ui/Button";
import currentProfile from "@/lib/profile";
import { getCategoryWithCounts } from "@/lib/queries/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function CategoriesPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const categories = await getCategoryWithCounts(currentUser.userID);

  console.log(categories);

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

      <div className="mt-5.5 rounded-lg border bg-white px-4">
        {categories.sort().map((category) => (
          <button
            key={category.id}
            className="border-line flex h-15 w-full cursor-pointer items-center justify-between border-b text-left last:border-0"
          >
            <div className="flex items-center gap-3.5">
              <span
                className="size-7 shrink-0 rounded-[7px]"
                style={{ backgroundColor: category.color }}
              />

              <div className="flex flex-col">
                <span className="text-task flex-1 font-medium">
                  {category.name}
                </span>

                {category.openCount !== 0 && (
                  <span className="text-muted-2 text-xs">
                    {category.openCount} open
                  </span>
                )}
              </div>
            </div>

            <ChevronRight className="text-subtle w-5 text-xl" />
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant={"outline"}
        className="mt-2.5 flex h-14 w-full cursor-pointer items-center justify-start gap-3.5 px-4"
      >
        <span className="ring-stroke text-muted grid size-7 place-items-center rounded-[7px] text-xl ring-[1.5px] ring-inset">
          +
        </span>
        <span className="text-task font-medium">New category</span>
      </Button>

      <p className="text-meta text-muted-2 px-5 pt-4 leading-[1.45]">
        Swipe left on a category to delete it…
      </p>
    </Fragment>
  );
}
