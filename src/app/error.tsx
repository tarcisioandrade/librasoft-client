"use client";

import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import { AlertCircle } from "lucide-react";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error);
  // }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex min-h-[260px] w-[460px] flex-col justify-between rounded border p-6">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <p className="text-2xl font-bold">Algo deu errado! ☹️</p>
          </div>
          <p className="text-sm text-muted-foreground">{Constants.DEFAULT_ERROR_MESSAGE}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {error.message ||
              "We apologize for the inconvenience. Our team has been notified and is working to resolve the issue."}
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-muted-foreground">Error ID: {error.digest}</p>
          )}
        </div>
        <div>
          <Button onClick={reset} className="w-full">
            Tente Novamente
          </Button>
        </div>
      </div>
    </div>
  );
}
