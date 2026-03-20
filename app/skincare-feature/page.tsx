import type { Metadata } from "next";
import Link from "next/link";
import SkincareFeatureClient from "@/components/skincare-feature/SkincareFeatureClient";

export const metadata: Metadata = {
  title: "Face Scanner | AUSVIA",
  description: "Analyse your skin to unlock tailored advice and a personalised skincare routine.",
};

export default function SkincareFeaturePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-4 md:pt-8 pb-14">
        {/* Breadcrumb */}
        <nav className="my-2 py-0" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 font-sans text-sm md:text-base text-[#6b6b6b]">
            <li>
              <Link href="/" className="hover:underline hover:text-[#444]">
                Home
              </Link>
            </li>
            <li className="text-[#9a9a9a]" aria-hidden="true">
              {" "}
              &gt;{" "}
            </li>
            <li className="text-black font-medium" aria-current="page">
              Face Scanner
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-white">
          <div className="px-4 md:px-10 pt-8 md:pt-12 pb-0">
            <h1 className="font-sans font-black tracking-tight text-[#1A1A18] uppercase text-[28px] md:text-[34px] mb-4">
              FACE SCANNER
            </h1>
            <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] max-w-[720px]">
              Analyse your skin to unlock tailored advice and a personalised skincare routine in under 60 seconds.
            </p>
          </div>

          <div className="mt-6 md:mt-8">
            <img
              src="/card-icons/Face%20scanner1.jpeg"
              alt="Face scanner preview"
              className="block w-full h-auto"
            />
          </div>

          {/* Buttons */}
          <SkincareFeatureClient />
        </section>
      </div>
    </div>
  );
}

