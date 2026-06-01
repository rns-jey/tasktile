import currentProfile from "@/lib/current-profile";

import AppHeader from "../organisms/AppHeader";

export default async function HomePage() {
  const currentUser = await currentProfile();

  return (
    <div className="flex flex-col items-center gap-4">
      <AppHeader />
      {/* <Main /> */}
    </div>
  );
}
