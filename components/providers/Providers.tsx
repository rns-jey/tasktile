import { Profile } from "@prisma/client";
import React from "react";
import UserProvider from "./UserProvider";
import ReactQueryProvider from "./ReactQueryProvider";

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
