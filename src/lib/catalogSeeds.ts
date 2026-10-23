export interface SeedProductInput {
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  categorySlug: string;
  subCategory: string;
  fabricCare: string;
  countryOfOrigin: string;
  imageUrl: string;
  galleryImages: string[];
  variants: {
    sku: string;
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "FREE_SIZE";
    colorName: string;
    colorHex: string;
    stockCount: number;
    priceOverride?: number;
  }[];
}

export const LUXURY_CATALOG_SEEDS: SeedProductInput[] = [
  // 1. Royal Kanjivaram Silk Saree
  {
    title: "Varanasi Bridal Pure Kanjivaram Silk Saree",
    slug: "varanasi-bridal-pure-kanjivaram-silk-saree",
    description: "Handwoven in pure mulberry silk with opulent 24k gold zari motifs across the pallu. Comes with an unstitched contrast blouse piece.",
    basePrice: 8999,
    categorySlug: "sarees",
    subCategory: "Silk Sarees",
    fabricCare: "Strictly Dry Clean Only. Store wrapped in pure muslin cloth.",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-KANJI-RED-FS", size: "FREE_SIZE", colorName: "Crimson Red & Gold", colorHex: "#9B111E", stockCount: 8 },
      { sku: "DEETA-KANJI-PRP-FS", size: "FREE_SIZE", colorName: "Royal Magenta & Zari", colorHex: "#681836", stockCount: 5 },
    ],
  },

  // 2. Pastel Georgette Chikankari Lehenga
  {
    title: "Awadhi Chikankari Hand-Embroidered Lehenga Set",
    slug: "awadhi-chikankari-hand-embroidered-lehenga-set",
    description: "Delicate Lucknowi floral threadwork interwoven with subtle mukaish sequins on flowing pastel georgette. Includes flared skirt, blouse, and sheer dupatta.",
    basePrice: 14500,
    categorySlug: "festive-wear",
    subCategory: "Lehengas",
    fabricCare: "Dry Clean Only",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-LEH-PST-S", size: "S", colorName: "Powder Peach", colorHex: "#FADBD8", stockCount: 4 },
      { sku: "DEETA-LEH-PST-M", size: "M", colorName: "Powder Peach", colorHex: "#FADBD8", stockCount: 6 },
      { sku: "DEETA-LEH-PST-L", size: "L", colorName: "Powder Peach", colorHex: "#FADBD8", stockCount: 3 },
    ],
  },

  // 3. Chanderi Silk Anarkali Suit
  {
    title: "Gulab Baag Chanderi Silk Anarkali Suit Set",
    slug: "gulab-baag-chanderi-silk-anarkali-suit-set",
    description: "Floor-sweeping regal silhouette crafted from featherlight Chanderi silk with handblock floral motifs and gota patti borders.",
    basePrice: 4299,
    categorySlug: "kurtis",
    subCategory: "Designer Suits",
    fabricCare: "Dry clean or delicate gentle handwash cold",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-ANR-GRN-S", size: "S", colorName: "Emerald Olive", colorHex: "#2E5B44", stockCount: 6 },
      { sku: "DEETA-ANR-GRN-M", size: "M", colorName: "Emerald Olive", colorHex: "#2E5B44", stockCount: 9 },
      { sku: "DEETA-ANR-GRN-XL", size: "XL", colorName: "Emerald Olive", colorHex: "#2E5B44", stockCount: 4 },
    ],
  },

  // 4. Banarasi Organza Floral Saree
  {
    title: "Noor Organza Banarasi Tissue Silk Saree",
    slug: "noor-organza-banarasi-tissue-silk-saree",
    description: "Airy metallic sheer drape crafted with kadwa weave gold booties and a delicate scallop scalloped border.",
    basePrice: 6250,
    categorySlug: "sarees",
    subCategory: "Silk Sarees",
    fabricCare: "Dry Clean Only",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-ORG-GOLD-FS", size: "FREE_SIZE", colorName: "Champagne Gold", colorHex: "#E5C158", stockCount: 7 },
      { sku: "DEETA-ORG-ROSE-FS", size: "FREE_SIZE", colorName: "Blush Rose", colorHex: "#EAA2A2", stockCount: 5 },
    ],
  },

  // 5. Men's Raw Silk Sherwani Kurta
  {
    title: "Rajputana Raw Silk Embroidered Men's Kurta",
    slug: "rajputana-raw-silk-embroidered-mens-kurta",
    description: "Structured raw tussar silk kurta tailored with mandarin collar and subtle resham embroidery, paired with churidar.",
    basePrice: 3899,
    categorySlug: "festive-wear",
    subCategory: "Kurtas",
    fabricCare: "Dry Clean Only",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-MKUR-M", size: "M", colorName: "Ivory White", colorHex: "#F7F5F0", stockCount: 5 },
      { sku: "DEETA-MKUR-L", size: "L", colorName: "Ivory White", colorHex: "#F7F5F0", stockCount: 8 },
      { sku: "DEETA-MKUR-XL", size: "XL", colorName: "Ivory White", colorHex: "#F7F5F0", stockCount: 6 },
    ],
  },

  // 6. Mulmul Cotton Handblock Co-ord Set
  {
    title: "Jaipur Bagru Handblock Mulmul Co-ord Set",
    slug: "jaipur-bagru-handblock-mulmul-co-ord-set",
    description: "Ultra-breathable 100% fine mulmul cotton set with artisanal indigo handblock printing and relaxed palazzo trousers.",
    basePrice: 2499,
    categorySlug: "kurtis",
    subCategory: "Co-ords",
    fabricCare: "Cold machine wash with mild detergent",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-COORD-IND-S", size: "S", colorName: "Indigo Blue", colorHex: "#1B3F6E", stockCount: 10 },
      { sku: "DEETA-COORD-IND-M", size: "M", colorName: "Indigo Blue", colorHex: "#1B3F6E", stockCount: 12 },
      { sku: "DEETA-COORD-IND-L", size: "L", colorName: "Indigo Blue", colorHex: "#1B3F6E", stockCount: 8 },
    ],
  },

  // 7. Festive Georgette Sharara Suit
  {
    title: "Zehra Mirror-Work Georgette Sharara Set",
    slug: "zehra-mirror-work-georgette-sharara-set",
    description: "Real glass mirror-work embellishment on flared georgette tiered sharara with a short peplum kurti.",
    basePrice: 5499,
    categorySlug: "festive-wear",
    subCategory: "Designer Suits",
    fabricCare: "Dry Clean Only",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-SHAR-RST-M", size: "M", colorName: "Rust Terracotta", colorHex: "#B7410E", stockCount: 5 },
      { sku: "DEETA-SHAR-RST-L", size: "L", colorName: "Rust Terracotta", colorHex: "#B7410E", stockCount: 4 },
    ],
  },

  // 8. Tussar Linen Contemporary Shirt Dress
  {
    title: "Artisanal Pure Linen Tiered Western Dress",
    slug: "artisanal-pure-linen-tiered-western-dress",
    description: "Modern minimalist silhouette in 100% natural European flax linen with hand-cast wooden buttons and pockets.",
    basePrice: 3200,
    categorySlug: "kurtis",
    subCategory: "Dresses",
    fabricCare: "Gentle machine wash cold. Warm iron while damp.",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-DRS-OAT-S", size: "S", colorName: "Oatmeal Beige", colorHex: "#D8C7B5", stockCount: 6 },
      { sku: "DEETA-DRS-OAT-M", size: "M", colorName: "Oatmeal Beige", colorHex: "#D8C7B5", stockCount: 7 },
      { sku: "DEETA-DRS-OAT-L", size: "L", colorName: "Oatmeal Beige", colorHex: "#D8C7B5", stockCount: 5 },
    ],
  },

  // 9. Handwoven Paithani Silk Saree
  {
    title: "Maharashtrian Heritage Pure Paithani Silk Saree",
    slug: "maharashtrian-heritage-pure-paithani-silk-saree",
    description: "Traditional peacock and lotus tapestry pallu woven painstakingly by master weavers with genuine metallic zari borders.",
    basePrice: 11200,
    categorySlug: "sarees",
    subCategory: "Silk Sarees",
    fabricCare: "Strictly Dry Clean Only",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-PAITH-TEAL-FS", size: "FREE_SIZE", colorName: "Peacock Teal & Gold", colorHex: "#004B49", stockCount: 4 },
    ],
  },

  // 10. Men's Handspun Khadi Cotton Kurta
  {
    title: "Handspun Bengal Khadi Classic Men's Kurta",
    slug: "handspun-bengal-khadi-classic-mens-kurta",
    description: "Breathable all-weather handwoven khadi cotton with coconut shell buttons, side slits, and deep internal pockets.",
    basePrice: 1899,
    categorySlug: "festive-wear",
    subCategory: "Kurtas",
    fabricCare: "Hand wash cold with gentle detergent",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-MKHD-WHT-M", size: "M", colorName: "Natural Khadi White", colorHex: "#F2EFEB", stockCount: 11 },
      { sku: "DEETA-MKHD-WHT-L", size: "L", colorName: "Natural Khadi White", colorHex: "#F2EFEB", stockCount: 14 },
      { sku: "DEETA-MKHD-WHT-XXL", size: "XXL", colorName: "Natural Khadi White", colorHex: "#F2EFEB", stockCount: 5 },
    ],
  },

  // 11. Velvet Embroidered Winter Saree
  {
    title: "Mughal Velvet Hand-Embroidered Evening Saree",
    slug: "mughal-velvet-hand-embroidered-evening-saree",
    description: "Rich micro-velvet pallu seamlessly transitioning into fluid georgette with zardozi cutwork borders.",
    basePrice: 7800,
    categorySlug: "sarees",
    subCategory: "Silk Sarees",
    fabricCare: "Professional Dry Clean Only",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-VLV-MAROON-FS", size: "FREE_SIZE", colorName: "Deep Wine Velvet", colorHex: "#4A0E17", stockCount: 6 },
    ],
  },

  // 12. Kalamkari Pen-Painted Tussar Silk Saree
  {
    title: "Srikalahasti Hand-Painted Pen Kalamkari Tussar Saree",
    slug: "srikalahasti-hand-painted-pen-kalamkari-tussar-saree",
    description: "Certified genuine tree-of-life Kalamkari painted using natural vegetable dyes on raw textured Tussar silk.",
    basePrice: 6999,
    categorySlug: "sarees",
    subCategory: "Silk Sarees",
    fabricCare: "Strictly Dry Clean Only. Avoid direct sunlight.",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-KALAM-OCH-FS", size: "FREE_SIZE", colorName: "Earthy Ochre & Black", colorHex: "#CC7722", stockCount: 4 },
    ],
  },

  // 13. Heavy Zardozi Bridal Lehenga
  {
    title: "Noor-E-Zeenat Crimson Heavy Zardozi Bridal Lehenga",
    slug: "noor-e-zeenat-crimson-heavy-zardozi-bridal-lehenga",
    description: "Heirloom bridal ensemble featuring 16 hand-stitched kalis with antique dabka, nakshi, and pearl embellishment.",
    basePrice: 28500,
    categorySlug: "festive-wear",
    subCategory: "Lehengas",
    fabricCare: "Preserve in acid-free archival storage box. Dry Clean Only.",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-BRD-CRIM-M", size: "M", colorName: "Sindoor Crimson", colorHex: "#B80F0A", stockCount: 3 },
      { sku: "DEETA-BRD-CRIM-L", size: "L", colorName: "Sindoor Crimson", colorHex: "#B80F0A", stockCount: 2 },
    ],
  },

  // 14. Modern Linen Bandhgala Formal Jacket
  {
    title: "Imperial Linen Bandhgala Jodhpuri Jacket",
    slug: "imperial-linen-bandhgala-jodhpuri-jacket",
    description: "Sartorial tailored Nehru jacket in heavyweight structured Irish linen with hand-enameled brass buttons.",
    basePrice: 4800,
    categorySlug: "festive-wear",
    subCategory: "Shirts",
    fabricCare: "Dry Clean Only",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-JODH-NVY-38", size: "M", colorName: "Midnight Navy", colorHex: "#152238", stockCount: 6 },
      { sku: "DEETA-JODH-NVY-40", size: "L", colorName: "Midnight Navy", colorHex: "#152238", stockCount: 5 },
      { sku: "DEETA-JODH-NVY-42", size: "XL", colorName: "Midnight Navy", colorHex: "#152238", stockCount: 3 },
    ],
  },

  // 15. Daily Wear Pure Mulmul Printed Anarkali
  {
    title: "Sanganeri Printed Cotton Daily Anarkali Tunic",
    slug: "sanganeri-printed-cotton-daily-anarkali-tunic",
    description: "Featherweight 80-count pure mulmul cotton tunic with subtle flare, breathable quarter sleeves, and round neckline.",
    basePrice: 1599,
    categorySlug: "kurtis",
    subCategory: "Kurtas",
    fabricCare: "Machine wash cold gentle",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-SANG-XS", size: "XS", colorName: "Sage Mint", colorHex: "#98FF98", stockCount: 7 },
      { sku: "DEETA-SANG-S", size: "S", colorName: "Sage Mint", colorHex: "#98FF98", stockCount: 12 },
      { sku: "DEETA-SANG-M", size: "M", colorName: "Sage Mint", colorHex: "#98FF98", stockCount: 15 },
      { sku: "DEETA-SANG-L", size: "L", colorName: "Sage Mint", colorHex: "#98FF98", stockCount: 10 },
    ],
  },

  // 16. Festive Brocade Silk Kurta Set
  {
    title: "Varanasi Gold Brocade Silk Kurta Set with Dupatta",
    slug: "varanasi-gold-brocade-silk-kurta-set-with-dupatta",
    description: "Shimmering real Banarasi brocade straight-cut kurta paired with silk pants and a tissue organza dupatta.",
    basePrice: 5199,
    categorySlug: "festive-wear",
    subCategory: "Designer Suits",
    fabricCare: "Dry Clean Only",
    countryOfOrigin: "India",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { sku: "DEETA-BROC-GLD-M", size: "M", colorName: "Royal Mustard & Gold", colorHex: "#FFDB58", stockCount: 7 },
      { sku: "DEETA-BROC-GLD-L", size: "L", colorName: "Royal Mustard & Gold", colorHex: "#FFDB58", stockCount: 8 },
    ],
  },
];
