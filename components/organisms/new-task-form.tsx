import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../atoms/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskWithCategory } from "@/types";
import axios from "axios";
import { Input } from "../atoms/input";
import LoadingCircleSpinner from "../atoms/loading-circle-spinner";
import { Button } from "../atoms/button";
import { Plus, Text } from "lucide-react";
import { Textarea } from "../atoms/textarea";

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  categoryId: z.string().nullish(),
  dueDate: z.union([
    z.date(),
    z.null(),
    z.undefined(), // Allow null values
  ]),
});

export default function NewTaskForm() {
  const [describing, setDescribing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: null,
      dueDate: null,
    },
  });

  const queryClient = useQueryClient();

  const addTask = useMutation<
    TaskWithCategory,
    Error,
    {
      name: string;
      description: string;
      categoryId?: string | null;
      dueDate?: Date | null;
    }
  >({
    mutationFn: async (newTask) => {
      const response = await axios.post("api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      form.reset();
      setDescribing(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTask.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Add a new task..."
                    autoComplete="off"
                    className="flex-1"
                    disabled={addTask.isPending}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {addTask.isPending ? (
            <LoadingCircleSpinner />
          ) : (
            <Button type="submit" size="icon" disabled={addTask.isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={"outline"}
            size={"xs"}
            onClick={() => setDescribing(!describing)}
            disabled={addTask.isPending}
          >
            <Text />
            <span className="text-xs">{describing ? "Hide description" : "Add description"}</span>
          </Button>
        </div>

        {describing && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Provide a brief description of the task..."
                    className="resize-none"
                    disabled={addTask.isPending}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}

// "use client";

// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Form, FormControl, FormField, FormItem, FormMessage } from "../atoms/form";
// import { Input } from "../atoms/input";
// import { CalendarIcon, Plus, Tag, Text } from "lucide-react";
// import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
// import { Calendar } from "../atoms/calendar";
// import { Button } from "../atoms/button";

// import { toast } from "sonner";

// import { format } from "date-fns";

// import axios from "axios";

// import { Category, Task } from "@prisma/client";

// import { Separator } from "../atoms/separator";

// import { useEffect, useState } from "react";
// import { TaskWithCategory } from "@/types";

// import CategoryPopOver from "./category-pop-over";
// import { Textarea } from "../atoms/textarea";

// const formSchema = z.object({
//   name: z.string().min(3),
//   description: z.string(),
//   categoryId: z.string().nullish(),
//   dueDate: z.union([
//     z.date(),
//     z.null(),
//     z.undefined(), // Allow null values
//   ]),
// });

// interface NewTaskFormProps {
//   tasks: TaskWithCategory[];
//   setTasks: React.Dispatch<React.SetStateAction<TaskWithCategory[]>>;
//   categories: Category[];
//   setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
// }

// export default function NewTaskForm({ tasks, setTasks, categories, setCategories }: NewTaskFormProps) {
//
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       categoryId: null,
//       dueDate: null,
//     },
//   });

//   useEffect(() => {
//     form.setValue("categoryId", selectedCategory?.id);
//   }, [selectedCategory]);

//   const isLoading = form.formState.isSubmitting;

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       const response = await axios.post("api/task/new", values);
//       const newTask = response.data;

//       setTasks([newTask, ...tasks]);
//       toast("Task created.");
//       form.reset();
//       setSelectedCategory(null);
//       setDescribing(false);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 mb-6">
//         <div className="flex gap-2">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <Input
//                     type="text"
//                     placeholder="Add a new task..."
//                     autoComplete="off"
//                     className="flex-1"
//                     disabled={isLoading}
//                     {...field}
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />

//           <Button type="submit" size="icon" disabled={isLoading}>
//             <Plus className="h-4 w-4" />
//           </Button>
//         </div>

//

//           <CategoryPopOver
//             isLoading={isLoading}
//             categories={categories}
//             setCategories={setCategories}
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//           />

//           <FormField
//             control={form.control}
//             name="dueDate"
//             render={({ field }) => (
//               <FormItem className="flex flex-col">
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button variant={"outline"} size={"xs"} disabled={isLoading} className="flex items-center">
//                         <CalendarIcon />
//                         <span className="text-xs">{field.value ? format(field.value, "LLL dd") : "Pick a date"}</span>
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={field.value ?? undefined}
//                       onSelect={field.onChange}
//                       disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
//                       footer={
//                         <>
//                           <Separator className="my-2" />

//                           <div className="flex justify-between">
//                             <Button
//                               type="button"
//                               variant={"outline"}
//                               size={"xs"}
//                               className="p-1"
//                               onClick={() => form.setValue("dueDate", null)}
//                             >
//                               <span className="text-xs">No due date</span>
//                             </Button>

//                             <Button
//                               type="button"
//                               variant={"outline"}
//                               size={"xs"}
//                               className="p-1"
//                               onClick={() => form.setValue("dueDate", new Date())}
//                             >
//                               <span className="text-xs">Today</span>
//                             </Button>

//                             <Button
//                               type="button"
//                               variant={"outline"}
//                               size={"xs"}
//                               className="p-1"
//                               onClick={() =>
//                                 form.setValue("dueDate", new Date(new Date().setDate(new Date().getDate() + 1)))
//                               }
//                             >
//                               <span className="text-xs">Tomorrow</span>
//                             </Button>
//                           </div>
//                         </>
//                       }
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//
//       </form>
//     </Form>
//   );
// }
