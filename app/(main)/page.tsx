import { SignedIn, SignedOut } from "@clerk/nextjs";
import HomePage from "@/components/pages/HomePage";
import LandingPage from "@/components/pages/LandingPage";

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
