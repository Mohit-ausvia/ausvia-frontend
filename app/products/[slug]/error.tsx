"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[ProductPage error]", error.message, error.digest);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-rule bg-base p-8 text-center">
        <h1 className="text-xl font-semibold text-textPrimary">Something went wrong</h1>
        <p className="mt-2 text-sm text-textSubdued">
          The product could not be loaded. Georgia recommendations are not shown.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
