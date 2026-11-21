"use client";

import { useTags } from "@/hooks/useTags";
import { TagFormValues } from "@/lib/models/tags/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, TagIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/Command";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/Empty";

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
  const { data: tags = [] } = useTags();

  const [filter, setFilter] = useState("");
  const query = filter.trim();
  const canCreate =
    query !== "" && !tags.some((tag) => tag.nameKey === query.toLowerCase());

  const queryClient = useQueryClient();

  const addTag = useMutation<string, Error, TagFormValues>({
    mutationFn: async (newTag) => {
      const response = await axios.post("/api/tags/new", newTag);
      return response.data;
    },
    onError: (error) => {
      toast.error("Couldn't create tag");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
      setFilter("");
    },
  });

  return (
    <Command>
      <CommandInput
        ref={searchRef}
        placeholder="Search or create ..."
        value={filter}
        onValueChange={(v) => setFilter(v)}
      />
      <CommandList>
        {canCreate && (
          <CommandItem
            value={`create:${query}`}
            className="my-2"
            onSelect={() => addTag.mutate({ name: query })}
          >
            <Plus /> Create tag “{query}”
          </CommandItem>
        )}

        {tags.length === 0 && !canCreate ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TagIcon />
              </EmptyMedia>
              <EmptyTitle>No tags yet</EmptyTitle>
              <EmptyDescription>
                Type a tag name to create your first tag.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          tags.map((tag) => {
            const isSelected = selected.some((tId) => tId === tag.id);

            return (
              <CommandItem
                key={tag.id}
                onSelect={() => {
                  if (!isSelected) {
                    onSelect([...selected, tag.id]);
                  } else {
                    onSelect(selected.filter((tId) => tId !== tag.id));
                  }

                  setOpen(false);
                }}

                data-checked={isSelected}
              >
                <TagIcon /> {tag.name}
              </CommandItem>
            );
          })
        )}
      </CommandList>
    </Command>
  );
}
