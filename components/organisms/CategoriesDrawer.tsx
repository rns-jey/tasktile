import { useCategories, useRecentCategories } from "@/hooks/useCategories";
import { Check, Search } from "lucide-react";
import { Fragment } from "react";
import { Button } from "../ui/Button";
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
  const { data: categories } = useCategories();
  const { data: recentCategories } = useRecentCategories();

  const allCategories = categories?.filter(
    (category) =>
      !recentCategories?.some((recent) => recent.id === category.id),
  );

  return (
    <Fragment>
      <DrawerHeader className="grid grid-cols-3 items-center gap-4">
        <div />
        <DrawerTitle>Category</DrawerTitle>
        <Button
          variant={"ghost"}
          type="button"
          className="text-muted ml-auto h-11 w-fit px-2 text-right font-medium"
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
          <InputGroupInput />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="space-y-2">
          <Label>Recent</Label>
          <ul>
            {recentCategories?.map((category) => (
              <li key={category.id} className="border-b py-1.5">
                <Button
                  type="button"
                  variant={"ghost"}
                  className="flex w-full items-center justify-between px-2"
                  onClick={() => {
                    onSelect(category.id);
                    setSelectingCategory(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-xs"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="ml-2">{category.name}</span>
                  </div>
                  {selectedCategoryId === category.id && (
                    <Check className="text-ink ml-auto h-4 w-4" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <Label>All</Label>
          <ul className="max-h-60 overflow-y-auto">
            {allCategories?.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-2 border-b py-1.5"
                onClick={() => {
                  onSelect(category.id);
                  setSelectingCategory(false);
                }}
              >
                <Button
                  type="button"
                  variant={"ghost"}
                  className="flex w-full items-center justify-between px-2"
                  onClick={() => {
                    onSelect(category.id);
                    setSelectingCategory(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-xs"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="ml-2">{category.name}</span>
                  </div>
                  {selectedCategoryId === category.id && (
                    <Check className="text-ink ml-auto h-4 w-4" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}
