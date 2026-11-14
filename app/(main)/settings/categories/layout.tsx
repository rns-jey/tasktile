import PageTitle from "@/components/atoms/PageTitle";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Link
        href={"/settings"}
        className="inline-flex items-center gap-1 font-medium"
      >
        <ChevronLeft /> Settings
      </Link>

      <header className="flex flex-col justify-between gap-2 pt-1.5 pb-4">
        <PageTitle title="Categories" />

        <p className="text-body">
          Each category has its own colour. Tap one to rename it or change its
          colour.
        </p>
      </header>

      {children}
    </Fragment>
  );
}
