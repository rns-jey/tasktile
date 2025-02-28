import Link from "next/link";
import { ArrowRight, CheckCircle, Diamond, Grid3X3, Layers, Sparkles } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import HomePage from "@/components/pages/home-page";
import LandingPage from "@/components/pages/landing-page";

export default function Home() {
  return (
    <>
      <SignedIn>
        <HomePage />
      </SignedIn>

      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
}
