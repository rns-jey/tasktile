"use client";

import { Profile } from "@prisma/client";
import React, { createContext, ReactNode, useContext } from "react";

interface UserProfileProviderProps {
  profile: Profile;
  children: ReactNode;
}

const UserProfileContext = createContext<Profile | null>(null);

export default function UserProvider({
  profile,
  children,
}: UserProfileProviderProps) {
  return (
    <UserProfileContext.Provider value={profile}>
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = (): Profile => {
  const context = useContext(UserProfileContext);
  if (!context)
    throw new Error("useUserProfile must be used within UserProfileProvider");
  return context;
};
