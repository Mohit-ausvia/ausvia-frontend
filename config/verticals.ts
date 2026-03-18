// config/verticals.ts

export type VerticalKey = "skincare" | "supplements" | "makeup" | "baby-care";

export interface VerticalConfig {
  label: string;
  slug: VerticalKey;
  georgiaIntro: string;
  georgiaHeading: string;
  georgiaSub: string;
  georgiaDescription: string;
  subcategories: string[];
  filters: FilterGroup[];
  wooCategory: string;
  brainVertical: string;
}

export interface FilterGroup {
  label: string;
  field: string;
  options: string[];
}

export const VERTICAL_CONFIG: Record<VerticalKey, VerticalConfig> = {
  skincare: {
    label: "Skincare",
    slug: "skincare",
    georgiaIntro: "For personalised skincare guidance.",
    georgiaHeading: "AI Skincare Specialist",
    georgiaSub: "Built on dermatology science.",
    georgiaDescription:
      "Georgia screens products for safety, skin\u00A0type\u00A0compatibility, and ingredient\u00A0science.",
    subcategories: [
      "All",
      "Cleansers",
      "Serums",
      "Moisturisers",
      "Sunscreens",
      "Exfoliants",
      "Eye Care",
      "Oils",
      "Masks",
    ],
    filters: [
      {
        label: "Skin Type",
        field: "skin_types",
        options: ["Oily", "Dry", "Combination", "Sensitive", "Normal", "Acne Prone"],
      },
      {
        label: "Concern",
        field: "skin_concerns",
        options: ["Acne", "Hyperpigmentation", "Ageing", "Dryness", "Redness", "Pores"],
      },
      {
        label: "Sensitivity",
        field: "system_sensitivity_level",
        options: ["Low", "Moderate", "High"],
      },
      {
        label: "Price",
        field: "price",
        options: ["Under $20", "$20–$50", "$50–$100", "Over $100"],
      },
    ],
    wooCategory: "skincare",
    brainVertical: "skincare",
  },

  supplements: {
    label: "Supplements",
    slug: "supplements",
    georgiaIntro: "Your AI supplement advisor is here.",
    georgiaHeading: "AI Supplement Specialist",
    georgiaSub: "Built on nutrition science.",
    georgiaDescription:
      "Georgia matches supplements to your health goals, life stage, and dietary needs — with safety checks built in.",
    subcategories: [
      "All",
      "Vitamins",
      "Minerals",
      "Protein",
      "Probiotics",
      "Omega",
      "Collagen",
      "Sleep",
      "Energy",
    ],
    filters: [
      {
        label: "Health Goal",
        field: "goal_tags",
        options: ["Energy", "Immunity", "Gut Health", "Sleep", "Mood", "Skin", "Joint"],
      },
      {
        label: "Life Stage",
        field: "life_stage",
        options: ["Adult", "Pregnancy", "Postpartum", "Breastfeeding", "Menopause", "Senior"],
      },
      {
        label: "Dietary",
        field: "dietary_preferences",
        options: ["Vegan", "Vegetarian", "Gluten Free", "Dairy Free", "Halal"],
      },
      {
        label: "Price",
        field: "price",
        options: ["Under $20", "$20–$50", "$50–$100", "Over $100"],
      },
    ],
    wooCategory: "supplements",
    brainVertical: "supplements",
  },

  makeup: {
    label: "Makeup",
    slug: "makeup",
    georgiaIntro: "Your AI beauty advisor is here.",
    georgiaHeading: "AI Beauty Specialist",
    georgiaSub: "Built on skin-safe formulation science.",
    georgiaDescription:
      "Georgia finds makeup that works with your skin type and is safe for your sensitivities — beauty without compromise.",
    subcategories: [
      "All",
      "Foundation",
      "Concealer",
      "Lip",
      "Eye",
      "Blush",
      "Setting",
      "Primer",
      "Tools",
    ],
    filters: [
      {
        label: "Skin Type",
        field: "skin_types",
        options: ["Oily", "Dry", "Combination", "Sensitive"],
      },
      {
        label: "Coverage",
        field: "coverage",
        options: ["Light", "Medium", "Full"],
      },
      {
        label: "Finish",
        field: "finish",
        options: ["Matte", "Dewy", "Satin", "Natural"],
      },
      {
        label: "Price",
        field: "price",
        options: ["Under $20", "$20–$50", "$50–$100", "Over $100"],
      },
    ],
    wooCategory: "makeup",
    brainVertical: "makeup",
  },

  "baby-care": {
    label: "Baby Care",
    slug: "baby-care",
    georgiaIntro: "Your AI baby care advisor is here.",
    georgiaHeading: "AI Baby Care Specialist",
    georgiaSub: "Built on infant safety science.",
    georgiaDescription:
      "Georgia filters every product for age-appropriate safety, fragrance-free formulas, and TGA-aligned ingredients — because your baby deserves certainty.",
    subcategories: [
      "All",
      "Body Wash",
      "Moisturiser",
      "Nappy Care",
      "Sun Protection",
      "Hair",
      "Wipes",
      "Supplements",
    ],
    filters: [
      {
        label: "Age",
        field: "life_stage",
        options: ["Newborn (0-3m)", "Infant (3-12m)", "Toddler (1-3y)", "Child (3y+)"],
      },
      {
        label: "Concern",
        field: "skin_concerns",
        options: ["Sensitive Skin", "Eczema", "Dry Skin", "Nappy Rash"],
      },
      {
        label: "Certified",
        field: "certifications",
        options: ["Fragrance Free", "Hypoallergenic", "Paediatrician Tested", "TGA Listed"],
      },
      {
        label: "Price",
        field: "price",
        options: ["Under $15", "$15–$30", "$30–$60", "Over $60"],
      },
    ],
    wooCategory: "baby-care",
    brainVertical: "baby_care",
  },
};
