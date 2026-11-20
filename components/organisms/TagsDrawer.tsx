import React from "react";
import { Drawer, DrawerContent } from "../ui/Drawer";
import TagsCommand from "./TagsCommand";

type TagsDrawerProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TagsDrawer({
  open,
  onChange,
  setOpen,
  value,
}: TagsDrawerProps) {
  const searchRef = React.useRef<HTMLInputElement>(null);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="p-2" initialFocus={searchRef}>
        <TagsCommand
          searchRef={searchRef}
          selected={value}
          onSelect={onChange}
          setOpen={setOpen}
        />
      </DrawerContent>
    </Drawer>
  );
}
