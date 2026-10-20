import AppHeader from "../organisms/AppHeader";
import MainSection from "../organisms/MainSection";
import MobileNav from "../organisms/MobileNav";

export default async function HomePage() {
  // const currentUser = await currentProfile();

  return (
    // <div className="flex flex-col items-center gap-4">
    //
    //   <Main />
    // </div>
    <div className="h-full px-6">
      <AppHeader />
      <MainSection />

      <MobileNav />
    </div>
  );
}
