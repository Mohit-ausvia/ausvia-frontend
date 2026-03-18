"use client";

import Image from "next/image";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

type ProductImageColumnProps = {
  images: { src: string; alt: string }[];
  productName: string;
};

export default function ProductImageColumn({
  images,
  productName,
}: ProductImageColumnProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  return (
    <div className="w-full md:w-[45%] md:sticky md:top-24 md:self-start">
      <div className="bg-[#111111] rounded-lg overflow-hidden aspect-[4/5] relative">
        {mainImage ? (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="w-full h-full block relative cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-base rounded-lg"
                aria-label="View full size"
              >
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt || productName}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 45vw"
                  unoptimized={mainImage.src.includes("localhost") || mainImage.src.startsWith("http://")}
                />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Close asChild>
                <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50 cursor-zoom-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              </Dialog.Close>
              <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto relative max-w-4xl max-h-[90vh] flex items-center justify-center">
                  <Image
                    src={mainImage.src}
                    alt={mainImage.alt || productName}
                    width={800}
                    height={1000}
                    className="object-contain max-w-full max-h-[90vh] w-auto h-auto rounded"
                    unoptimized={mainImage.src.includes("localhost") || mainImage.src.startsWith("http://")}
                  />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-textSubdued text-sm">
            No image
          </div>
        )}
      </div>
      {hasMultiple && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal ${
                selectedIndex === i ? "border-teal" : "border-rule hover:border-textSubdued"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.src}
                alt=""
                width={56}
                height={56}
                className="object-cover w-full h-full"
                unoptimized={img.src.includes("localhost") || img.src.startsWith("http://")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
