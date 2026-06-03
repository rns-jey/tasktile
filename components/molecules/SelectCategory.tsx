import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components//ui/Select";
import { Field, FieldLabel } from "@/components/ui/Field";
import { useCategories } from "@/hooks/useCategories";
import { TaskFormValues } from "@/types";
import { Control, Controller, FieldPath } from "react-hook-form";

interface SelectCategoryProps {
  id: string;
  name: FieldPath<{ categoryId?: string | null | undefined }>;
  control: Control<TaskFormValues>;
  label: string;
  placeholder: string;
}

export default function SelectCategory({
  id,
  name,
  control,
  label,
  placeholder,
}: SelectCategoryProps) {
  const { data: categories } = useCategories();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Select
            {...field}
            value={field.value || undefined}
            onValueChange={field.onChange}
            onOpenChange={() => field.onBlur()}
          >
            <SelectTrigger id={id}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories &&
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div>yes</div>
                      {category.name}
                    </SelectItem>
                  ))}
                <SelectItem key="other" value="other">
                  other
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
