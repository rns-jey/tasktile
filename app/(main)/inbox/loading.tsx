import PageTitle from "@/components/atoms/PageTitle";
import { Skeleton } from "@/components/ui/Skeleton";

export default function InboxLoading() {
  return (
    <div>
      <header className="flex items-center justify-between gap-4 pb-4">
        <PageTitle title="Inbox" />
      </header>

      <div className="flex flex-col">
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
      </div>
    </div>
  );
}
