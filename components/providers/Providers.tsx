import React from "react";

import { Profile } from "@/lib/generated/prisma/client";
import ReactQueryProvider from "./ReactQueryProvider";
import UserProvider from "./UserProvider";

interface ProvidersProps {
  profile: Profile;
  children: React.ReactNode;
}

export default function Providers({ profile, children }: ProvidersProps) {
  return (
    <UserProvider profile={profile}>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </UserProvider>
  );
}
