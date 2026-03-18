// lib/mock-category-data.ts — Mock products for category UI. Delete when wiring real data.

export interface MockProduct {
  id: number;
  sku: string;
  brand: string;
  name: string;
  price: string;
  badge: string;
  georgiaRecommends: boolean;
  georgiaLine: string;
  subcategory: string;
  sensitivityLevel: string;
  imageUrl: string;
}

export const MOCK_SKINCARE: MockProduct[] = [
  {
    id: 1,
    sku: "AUS000009",
    brand: "LA ROCHE-POSAY",
    name: "Toleriane Hydrating Gentle Cleanser",
    price: "$28.99",
    badge: "Bestseller",
    georgiaRecommends: true,
    georgiaLine: "Gentle barrier-safe daily cleanser",
    subcategory: "Cleansers",
    sensitivityLevel: "low",
    imageUrl: "",
  },
  {
    id: 2,
    sku: "AUS000002",
    brand: "CERAVE",
    name: "Hydrating Facial Cleanser Normal to Dry Skin",
    price: "$22.50",
    badge: "",
    georgiaRecommends: true,
    georgiaLine: "Ceramide-rich, fragrance-free formula",
    subcategory: "Cleansers",
    sensitivityLevel: "low",
    imageUrl: "",
  },
  {
    id: 3,
    sku: "AUS000003",
    brand: "PAULA'S CHOICE",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    price: "$54.00",
    badge: "Clinical Grade",
    georgiaRecommends: false,
    georgiaLine: "",
    subcategory: "Exfoliants",
    sensitivityLevel: "high",
    imageUrl: "",
  },
  {
    id: 4,
    sku: "AUS000011",
    brand: "THE ORDINARY",
    name: "Niacinamide 10% + Zinc 1% Serum",
    price: "$12.90",
    badge: "",
    georgiaRecommends: true,
    georgiaLine: "Pore-refining, oil control serum",
    subcategory: "Serums",
    sensitivityLevel: "moderate",
    imageUrl: "",
  },
  {
    id: 5,
    sku: "AUS000017",
    brand: "DRUNK ELEPHANT",
    name: "Protini Polypeptide Moisturiser",
    price: "$98.00",
    badge: "Premium",
    georgiaRecommends: true,
    georgiaLine: "Peptide-rich firming moisturiser",
    subcategory: "Moisturisers",
    sensitivityLevel: "low",
    imageUrl: "",
  },
  {
    id: 6,
    sku: "AUS000018",
    brand: "NEUTROGENA",
    name: "Hydro Boost Water Gel Moisturiser",
    price: "$31.99",
    badge: "",
    georgiaRecommends: false,
    georgiaLine: "",
    subcategory: "Moisturisers",
    sensitivityLevel: "low",
    imageUrl: "",
  },
  {
    id: 7,
    sku: "AUS000019",
    brand: "SUKIN",
    name: "Rosehip Oil Cold Pressed Australian",
    price: "$19.95",
    badge: "Australian",
    georgiaRecommends: true,
    georgiaLine: "Brightening, scar-fading rosehip",
    subcategory: "Oils",
    sensitivityLevel: "moderate",
    imageUrl: "",
  },
  {
    id: 8,
    sku: "AUS000020",
    brand: "QV",
    name: "Intensive Moisturising Cream 500g",
    price: "$16.99",
    badge: "",
    georgiaRecommends: true,
    georgiaLine: "Safe for eczema-prone and dry skin",
    subcategory: "Moisturisers",
    sensitivityLevel: "low",
    imageUrl: "",
  },
  {
    id: 9,
    sku: "AUS000021",
    brand: "BIODERMA",
    name: "Sensibio H2O Micellar Water 500ml",
    price: "$34.00",
    badge: "",
    georgiaRecommends: true,
    georgiaLine: "Fragrance-free micellar for sensitive skin",
    subcategory: "Cleansers",
    sensitivityLevel: "low",
    imageUrl: "",
  },
  {
    id: 10,
    sku: "AUS000022",
    brand: "ALPHA-H",
    name: "Liquid Gold Resurfacing Treatment",
    price: "$69.00",
    badge: "Clinical Grade",
    georgiaRecommends: false,
    georgiaLine: "",
    subcategory: "Exfoliants",
    sensitivityLevel: "high",
    imageUrl: "",
  },
];

/** Returns mock products for a vertical. Only skincare has mock data for now. */
export function getMockProductsByVertical(vertical: string): MockProduct[] {
  if (vertical === "skincare") return MOCK_SKINCARE;
  return [];
}
