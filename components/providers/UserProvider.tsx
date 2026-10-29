"use client";

import { Profile } from "@/lib/generated/prisma/client";
import { createContext, useContext } from "react";

const UserContext = createContext<Profile | null>(null);

export function useUser() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUser must be used inside UserProvider");
  return user; // Profile, never null
}

export function UserProvider({
  user,
  children,
}: {
  user: Profile;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
