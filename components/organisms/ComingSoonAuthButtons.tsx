"use client";

import { Button } from "@/components/atoms/Button";

const providers = ["GitHub", "Google"] as const;

export default function ComingSoonAuthButtons() {
  return (
    <div className="grid w-full grid-cols-2 gap-2">
      {providers.map((provider) => {
        const statusId = "auth-" + provider.toLowerCase() + "-coming-soon";

        return (
          <div key={provider} className="flex min-w-0 flex-col gap-1">
            <Button
              type="button"
              variant="secondary"
              disabled
              aria-describedby={statusId}
              className="w-full"
            >
              {provider}
            </Button>
            <span
              id={statusId}
              className="text-muted-foreground text-center text-xs"
            >
              Coming soon
            </span>
          </div>
        );
      })}
    </div>
  );
}
