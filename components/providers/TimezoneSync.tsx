"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TimezoneSync() {
  const router = useRouter();

  useEffect(() => {
    const sync = () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const current = document.cookie.match(/(?:^|; )tz=([^;]*)/)?.[1];

      if (current !== tz) {
        document.cookie = `tz=${tz}; path=/; max-age=31536000; samesite=lax`;
        router.refresh();
      }
    };

    sync();
    document.addEventListener("visibilitychange", sync);

    return () => document.removeEventListener("visibilitychange", sync);
  }, [router]);
  return null;
}
