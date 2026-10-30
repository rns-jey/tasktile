import { CategoryWithCounts } from "@/types";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export default function CategoryCard({
  category,
}: {
  category: CategoryWithCounts;
}) {
  return (
    <Fragment>
      <div className="flex items-center gap-3.5">
        <span
          className="size-7 shrink-0 rounded-[7px]"
          style={{ backgroundColor: category.color }}
        />

        <div className="flex flex-col">
          <span className="text-task flex-1 font-medium">{category.name}</span>

          {category.openCount !== 0 && (
            <span className="text-muted-2 text-xs">
              {category.openCount} open
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="text-subtle w-5 text-xl" />
    </Fragment>
  );
}
