"use client";

import * as Dialog from "@radix-ui/react-dialog";

type AskGeorgiaDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
};

export default function AskGeorgiaDrawer({
  open,
  onOpenChange,
  productName,
}: AskGeorgiaDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full md:rounded-lg bg-base border border-rule shadow-lg max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-rule">
            <Dialog.Title className="text-lg font-semibold text-textPrimary">
              Ask Georgia — {productName}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-textSubdued hover:text-textPrimary p-1 rounded"
                aria-label="Close"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </Dialog.Close>
          </div>
          <div className="p-4 overflow-auto flex-1">
            <p className="text-sm text-textSubdued">
              Ask Georgia flow will be implemented in a later step. This is a stub.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
