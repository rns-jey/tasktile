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

      <header className="flex flex-col justify-between gap-2 pb-4">
        <h1 className="font-heading pt-1.5 tracking-[-.01em]">Categories</h1>
        <p className="text-body">
          Each category has its own colour. Tap one to rename it or change its
          colour.
        </p>
      </header>

      {children}
    </Fragment>
  );
}
