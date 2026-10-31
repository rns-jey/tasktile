import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Fragment } from "react";

export default function Loading() {
  return (
    <Fragment>
      <Tabs defaultValue="open">
        <TabsList className="w-full">
          <TabsTrigger value="open" disabled>
            <span>Open</span>
          </TabsTrigger>
          <TabsTrigger value="closed" disabled>
            <span>Closed</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          {[1, 2, 3, 4, 5].map((t) => (
            <div
              key={t}
              className="border-line flex h-16 items-center gap-3.5 border-b px-2 hover:bg-white"
            >
              <Skeleton className="size-4" />

              <Skeleton className="size-6" />

              <Skeleton className="h-6 w-28" />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Fragment>
  );
}
