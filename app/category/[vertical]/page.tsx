import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VERTICAL_CONFIG, type VerticalKey } from "@/config/verticals";
import { getMockProductsByVertical } from "@/lib/mock-category-data";
import CategoryPageClient from "./CategoryPageClient";

type Props = { params: Promise<{ vertical: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical } = await params;
  const config = VERTICAL_CONFIG[vertical as VerticalKey];
  if (!config) return { title: "AUSVIA" };
  return {
    title: `${config.label} | AUSVIA`,
    description: config.georgiaDescription,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { vertical } = await params;
  const config = VERTICAL_CONFIG[vertical as VerticalKey];
  if (!config) notFound();

  const products = getMockProductsByVertical(vertical);
  return (
    <CategoryPageClient
      verticalKey={vertical as VerticalKey}
      config={config}
      products={products}
    />
  );
}
