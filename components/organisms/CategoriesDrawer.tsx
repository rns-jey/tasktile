import { useCategories, useRecentCategories } from "@/hooks/useCategories";
import { Check, Search } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { Button } from "../atoms/Button";
import NewCategory from "../molecules/NewCategory";
import { DrawerHeader, DrawerTitle } from "../ui/Drawer";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/InputGroup";
import { Label } from "../ui/Label";

type CategoriesDrawerProps = {
  setSelectingCategory: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (id: string | null) => void;
  selectedCategoryId?: string | null;
};

export default function CategoriesDrawer({
  setSelectingCategory,
  onSelect,
  selectedCategoryId,
}: CategoriesDrawerProps) {
  const { data: categories = [] } = useCategories();
  const { data: recentCategories = [] } = useRecentCategories();

  const [query, setQuery] = useState("");

  const allCategories = categories.filter(
    (category) => !recentCategories.some((recent) => recent.id === category.id),
  );

  const q = query.trim().toLowerCase();
  const exactMatch = categories.find((category) => category.nameKey === q);

  const filtered = useMemo(() => {
    return q
      ? categories.filter((category) => category.nameKey.includes(q))
      : categories;
  }, [categories, query]);

  return (
    <Fragment>
      <DrawerHeader className="grid grid-cols-3 items-center gap-4">
        <div />
        <DrawerTitle>Category</DrawerTitle>
        <Button
          variant={"ghost"}
          type="button"
          className="ml-auto px-4"
          onClick={() => {
            onSelect(null);
            setSelectingCategory(false);
          }}
        >
          None
        </Button>
      </DrawerHeader>

      <div className="flex flex-col gap-4 px-4">
        <InputGroup>
          <InputGroupInput
            placeholder="Search or create"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        {query.trim().length === 0 ? (
          <>
            <div className="space-y-2">
              <Label>Recent</Label>
              <ul>
                {recentCategories.map((category) => (
                  <li key={category.id} className="border-b py-1.5">
                    <Button
                      type="button"
                      variant={"ghost"}
                      className="flex w-full items-center justify-between px-4"
                      onClick={() => {
                        onSelect(category.id);
                        setSelectingCategory(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-xs"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="ml-2">{category.name}</span>
                      </div>
                      {selectedCategoryId === category.id && (
                        <Check className="text-ink ml-auto size-4" />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <Label>All</Label>
              <ul className="max-h-60 overflow-y-auto">
                {allCategories.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center gap-2 border-b py-1.5"
                  >
                    <Button
                      type="button"
                      variant={"ghost"}
                      className="flex w-full items-center justify-between px-4"
                      onClick={() => {
                        onSelect(category.id);
                        setSelectingCategory(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-xs"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="ml-2">{category.name}</span>
                      </div>
                      {selectedCategoryId === category.id && (
                        <Check className="text-ink ml-auto size-4" />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {!exactMatch && (
              <NewCategory
                query={q}
                onSelect={(id) => {
                  onSelect(id);
                  setSelectingCategory(false);
                  setQuery("");
                }}
              />
            )}

            <div className="space-y-2">
              <Label>
                {filtered.length === 0
                  ? "No category called that yet."
                  : filtered.length === 1
                    ? "1 match"
                    : `${filtered.length} matches`}
              </Label>
              <ul className="max-h-60 overflow-y-auto">
                {filtered.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center gap-2 border-b py-1.5"
                  >
                    <Button
                      type="button"
                      variant={"ghost"}
                      className="flex w-full items-center justify-between px-4"
                      onClick={() => {
                        onSelect(category.id);
                        setSelectingCategory(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-xs"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="ml-2">{category.name}</span>
                      </div>
                      {selectedCategoryId === category.id && (
                        <Check className="text-ink ml-auto size-4" />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
