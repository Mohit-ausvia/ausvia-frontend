"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const SLIDE_WIDTH_PCT = 78; // main image ~78% width, next image peeks (ref: "more than half")

type ProductImageGalleryProps = {
  images: { src: string; alt: string }[];
  productName: string;
};

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const mainImage = images[selectedIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);
  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current == null || !hasMultiple) return;
      const endX = e.changedTouches[0].clientX;
      const delta = touchStartX.current - endX;
      touchStartX.current = null;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) goNext();
      else goPrev();
    },
    [hasMultiple, goPrev, goNext]
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasMultiple || images.length === 0) return;
    const slideWidth = el.offsetWidth * (SLIDE_WIDTH_PCT / 100);
    const gap = 8;
    const index = Math.round(el.scrollLeft / (slideWidth + gap));
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    setSelectedIndex(clamped);
  }, [hasMultiple, images.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !hasMultiple) return;
    const slideWidth = el.offsetWidth * (SLIDE_WIDTH_PCT / 100);
    const gap = 8;
    el.scrollTo({ left: selectedIndex * (slideWidth + gap), behavior: "smooth" });
  }, [selectedIndex, hasMultiple]);

  if (!images.length) {
    return (
      <div className="aspect-square w-full overflow-hidden bg-[#f5f5f5] relative flex items-center justify-center text-[#6e6e73] font-sans text-sm">
        No image
      </div>
    );
  }

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <div className="w-full">
            <div
              ref={scrollRef}
              role="button"
              tabIndex={0}
              className={`w-full aspect-square overflow-y-hidden flex gap-2 bg-[#f5f5f5] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#0E7C86] focus:ring-offset-2 ${
                hasMultiple
                  ? "overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  : "overflow-x-hidden flex justify-center"
              }`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              aria-label="View full size"
              onScroll={handleScroll}
              onKeyDown={(e) => {
                if (!hasMultiple) return;
                if (e.key === "ArrowLeft") setSelectedIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
                if (e.key === "ArrowRight") setSelectedIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
              }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 aspect-square snap-start snap-always"
                  style={{
                    width: hasMultiple ? `${SLIDE_WIDTH_PCT}%` : "100%",
                    minWidth: hasMultiple ? `${SLIDE_WIDTH_PCT}%` : "100%",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || productName}
                    fill
                    className="object-cover select-none pointer-events-none"
                    sizes="(min-width: 768px) 45vw, 78vw"
                    unoptimized={img.src.includes("localhost") || img.src.startsWith("http://")}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
            {hasMultiple && (
              <div className="w-full h-0.5 mt-2 rounded-full bg-[#e0e0e0] overflow-hidden" role="tablist" aria-label="Image position">
                <div
                  className="h-full rounded-full bg-black transition-[margin-left] duration-200 ease-out"
                  style={{
                    width: `${100 / images.length}%`,
                    marginLeft: `${selectedIndex * (100 / images.length)}%`,
                  }}
                  aria-hidden
                />
              </div>
            )}
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={(e) => {
              if (!hasMultiple) return;
              if (e.key === "ArrowLeft") goPrev();
              if (e.key === "ArrowRight") goNext();
            }}
          >
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute inset-0 cursor-zoom-out"
                aria-label="Close"
              />
            </Dialog.Close>
            <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto relative">
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt || productName}
                  width={800}
                  height={800}
                  className="object-contain max-w-full max-h-[90vh] w-auto h-auto rounded-lg"
                  unoptimized={mainImage.src.includes("localhost") || mainImage.src.startsWith("http://")}
                />
              </div>
            </div>
            {hasMultiple && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-[60] pointer-events-none">
                <div className="h-1 rounded-full bg-[#e0e0e0] overflow-hidden w-24">
                  <div
                    className="h-full rounded-full bg-white transition-[margin-left] duration-200"
                    style={{
                      width: `${100 / images.length}%`,
                      marginLeft: `${selectedIndex * (100 / images.length)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
