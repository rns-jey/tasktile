import Link from "next/link";
import { ArrowRight, CheckCircle, Diamond, Grid3X3, Layers, Sparkles } from "lucide-react";

import { Button } from "@/components/atoms/button";

export default function Home() {
  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95">
        <div className="container flex h-16 items-center justify-between space-x-4 px-4">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Diamond className="h-6 w-6" />
            <span>TaskTile</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="ml-4">
              Log in
            </Button>
            <Button size="sm">Sign up</Button>
          </div>
        </div>
      </header>
    </div>
  );
}
