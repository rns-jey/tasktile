"use client";

import { Plus, TagIcon } from "lucide-react";
import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/Command";

const availableTags = ["Personal", "Work", "Health"];

type TagsCommandProps = {
  searchRef: React.RefObject<HTMLInputElement | null>;
  selected: string[];
  onSelect: (tags: string[]) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TagsCommand({
  searchRef,
  selected,
  onSelect,
  setOpen,
}: TagsCommandProps) {
  const [filter, setFilter] = useState("");
  const query = filter.trim();
  const canCreate =
    query !== "" &&
    !availableTags.some((tag) => tag.toLowerCase() === query.toLowerCase());

  return (
    <Command>
      <CommandInput
        ref={searchRef}
        placeholder="Type a command or search..."
        onValueChange={(v) => setFilter(v)}
      />
      <CommandList>
        {canCreate && (
          <CommandItem value={`create:${query}`}>
            <Plus /> Create tag “{query}”
          </CommandItem>
        )}

        {availableTags.map((tag, i) => (
          <CommandItem
            key={`tag_${i}`}
            onSelect={() => {
              if (!selected.includes(tag)) {
                onSelect([...selected, tag]);
              } else {
                onSelect(selected.filter((t) => t !== tag));
              }

              setOpen(false);
            }}

            data-checked={selected.includes(tag)}
          >
            <TagIcon /> {tag}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
