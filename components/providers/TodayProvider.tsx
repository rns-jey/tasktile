"use client";

import { createContext, useContext } from "react";

const TodayContext = createContext("");
export const useTodayKey = () => useContext(TodayContext);
export function TodayProvider({
  todayKey,
  children,
}: {
  todayKey: string;
  children: React.ReactNode;
}) {
  return (
    <TodayContext.Provider value={todayKey}>{children}</TodayContext.Provider>
  );
}
