import Header from "../organisms/header";

import currentProfile from "@/lib/current-profile";
import TaskSection from "../organisms/task-section";

export default async function HomePage() {
  const currentUser = await currentProfile();

  return (
    <div className="flex flex-col gap-4 items-center">
      <Header />

      <main className="w-full p-4">
        <TaskSection />
      </main>
    </div>
  );
}
