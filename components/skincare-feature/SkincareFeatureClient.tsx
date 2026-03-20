"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GeorgiaDrawer from "@/components/category/GeorgiaDrawer";

export default function SkincareFeatureClient() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const revokePreviewUrl = (url: string) => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) revokePreviewUrl(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verticalLabel = useMemo(() => "Skincare", []);

  const onScanFace = () => {
    fileInputRef.current?.click();
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Replace this stub with the "perfect crop" flow later.
    // Replace any previous preview
    setPreviewUrl((prev) => {
      if (prev) revokePreviewUrl(prev);
      return null;
    });

    setCapturedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Allow selecting the same file again later.
    e.target.value = "";
  };

  return (
    <>
      <div className="px-4 md:px-10 pt-7 pb-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Ask Georgia */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center justify-center rounded-[980px] bg-white text-black px-6 py-3 font-black uppercase tracking-wide text-sm border border-black hover:bg-[#F5F5F5] transition-colors"
            aria-label="Ask Georgia"
          >
            <span className="inline-flex items-center gap-2">
              <span>ASK GEORGIA</span>
              <span className="inline-block text-xl font-black" aria-hidden>
                ✦
              </span>
            </span>
          </button>

          {/* Scan Face */}
          <button
            type="button"
            onClick={onScanFace}
            className="inline-flex items-center justify-center rounded-[980px] bg-black text-white px-6 py-3 font-black uppercase tracking-wide text-sm hover:bg-[#111] transition-colors"
            aria-label="Scan face"
          >
            <span>Scan Face</span>
          </button>
        </div>

        {/* Hidden file input simulating "scan face" for now */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={onFileChange}
          aria-label="Upload face image"
        />

        {/* Preview / placeholder section */}
        <div id="scan-face" className="mt-6">
          {previewUrl ? (
            <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div className="px-4 py-3 border-b border-[#E0E0E0]">
                <p className="font-sans text-[#1A1A18] text-sm font-black uppercase tracking-wide">
                  Face captured
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Face scan preview" className="w-full h-auto block" />
              <div className="px-4 py-4">
                <p className="font-sans text-[#6e6e73] text-sm leading-[1.4]">
                  Next step: we will open the perfect-crop flow and then generate your tailored routine (stub).
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <p className="font-sans text-[#6e6e73] text-sm leading-[1.4]">
                Tap <span className="font-black text-[#1A1A18]">Scan Face</span> to upload a photo. This is a temporary demo UI.
              </p>
            </div>
          )}
        </div>
      </div>

      <GeorgiaDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} verticalLabel={verticalLabel} />
    </>
  );
}

