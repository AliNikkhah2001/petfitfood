/**
 * Product menu from Instagram price sheets (contents photos 112 / 113)
 * + packaging assets. Prices in تومان as published.
 */

export type PricePoint = { grams: number; priceToman: number };

export type Product = {
  id: string;
  slug: string;
  group: "chicken" | "beef";
  nameFa: string;
  description: string;
  ingredients: string[];
  prices: PricePoint[];
  image: string;
  badge: string;
};

export const CONTACT_IG = "@petfit.food";

export function formatToman(amount: number): string {
  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
}

const PKG = "/content/packaging";
const BOWL = "/brand/bowls";

/** Official chicken menu (Instagram photo_112) */
export const CHICKEN_PRODUCTS: Product[] = [
  {
    id: "chicken-pro",
    slug: "morgh-pro",
    group: "chicken",
    nameFa: "غذای تر مرغ (Pro)",
    description: "تهیه‌شده از مرغ تازه و مواد اولیه باکیفیت؛ مناسب پت‌های فعال و حساس.",
    ingredients: ["فیله مرغ", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
    prices: [
      { grams: 1000, priceToman: 830_000 },
      { grams: 400, priceToman: 464_000 },
    ],
    image: `${PKG}/chicken-fresh.png`,
    badge: "Pro",
  },
  {
    id: "chicken-pro-cat",
    slug: "morgh-pro-gorbeh",
    group: "chicken",
    nameFa: "غذای تر مرغ (Pro) برای گربه",
    description: "مرغ تازه و جگر؛ منبع غنی پروتئین و آهن برای انرژی بیشتر.",
    ingredients: ["مرغ تازه", "جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
    prices: [
      { grams: 1000, priceToman: 830_000 },
      { grams: 400, priceToman: 464_000 },
    ],
    image: `${BOWL}/chicken.jpg`,
    badge: "Pro · گربه",
  },
  {
    id: "chicken-normal-dog",
    slug: "morgh-normal-sag",
    group: "chicken",
    nameFa: "غذای تر مرغ (Normal) برای سگ",
    description: "مرغ تازه و مواد طبیعی؛ مناسب تغذیهٔ روزانه.",
    ingredients: ["مرغ", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
    prices: [
      { grams: 1000, priceToman: 750_000 },
      { grams: 400, priceToman: 420_000 },
    ],
    image: `${BOWL}/intro.jpg`,
    badge: "Normal · سگ",
  },
  {
    id: "chicken-soup",
    slug: "sup-morgh",
    group: "chicken",
    nameFa: "سوپ مرغ",
    description: "سوپ سبک و مغذی برای آبرسانی، تقویت ایمنی و اشتهای بهتر.",
    ingredients: ["مرغ", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی", "عصاره مرغ"],
    prices: [
      { grams: 1000, priceToman: 690_000 },
      { grams: 400, priceToman: 360_000 },
    ],
    image: `${PKG}/chicken-soup.png`,
    badge: "سوپ",
  },
];

/** Official beef menu (Instagram photo_113) */
export const BEEF_PRODUCTS: Product[] = [
  {
    id: "beef-pro",
    slug: "gusaleh-pro",
    group: "beef",
    nameFa: "غذای تر گوشت گوساله (Pro)",
    description: "مواد اولیه تازه و باکیفیت؛ مناسب پت‌های فعال و حساس.",
    ingredients: ["گوشت گوساله", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
    prices: [
      { grams: 1000, priceToman: 1_760_000 },
      { grams: 400, priceToman: 880_000 },
      { grams: 250, priceToman: 520_000 },
    ],
    image: `${PKG}/beef-fresh.png`,
    badge: "Pro",
  },
  {
    id: "beef-normal",
    slug: "gusaleh-normal",
    group: "beef",
    nameFa: "غذای تر گوشت گوساله (Normal)",
    description: "مواد طبیعی و متعادل؛ مناسب تغذیهٔ روزانه.",
    ingredients: ["گوشت گوساله", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
    prices: [
      { grams: 1000, priceToman: 1_380_000 },
      { grams: 400, priceToman: 650_000 },
      { grams: 250, priceToman: 440_000 },
    ],
    image: `${BOWL}/beef.jpg`,
    badge: "Normal",
  },
  {
    id: "beef-soup",
    slug: "sup-gusaleh",
    group: "beef",
    nameFa: "سوپ گوشت گوساله",
    description: "سوپ مغذی و خوش‌طعم برای افزایش اشتها و آبرسانی.",
    ingredients: ["گوشت گوساله", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی", "عصاره قلم"],
    prices: [
      { grams: 1000, priceToman: 1_120_000 },
      { grams: 400, priceToman: 580_000 },
      { grams: 250, priceToman: 410_000 },
    ],
    image: `${BOWL}/beef.jpg`,
    badge: "سوپ",
  },
];

export const PRODUCTS: Product[] = [...CHICKEN_PRODUCTS, ...BEEF_PRODUCTS];

export const INGREDIENT_SHOWCASE = [
  { name: "مرغ تازه", copy: "فیله و سینه در وعده‌های مرغ.", image: "/brand/ingredients/chicken.jpg" },
  { name: "گوشت گوساله", copy: "پایهٔ خانوادهٔ Beef.", image: "/brand/bowls/beef.jpg" },
  { name: "بوقلمون", copy: "وعدهٔ کم‌چرب با هضم آسان.", image: "/brand/ingredients/turkey.jpg" },
  { name: "دل و جگر مرغ", copy: "احشاء مغذی مشترک همهٔ فرمولاسیون‌ها.", image: "/brand/ingredients/organs.jpg" },
  { name: "هویج", copy: "سبزیجات پایهٔ منوی پت‌فیت.", image: "/brand/ingredients/carrots.jpg" },
  { name: "کدو حلوایی", copy: "فیبر و طعم ملایم.", image: "/brand/ingredients/pumpkin.jpg" },
  { name: "کدو سبز", copy: "بخشی از ترکیب مشترک سبزیجات.", image: "/brand/ingredients/zucchini.jpg" },
  { name: "سیب‌زمینی", copy: "کربوهیدرات طبیعی در هر وعده.", image: "/brand/ingredients/potato.jpg" },
] as const;

export const INSTAGRAM_REELS = [
  { id: "10", title: "آماده‌سازی در آشپزخانه", poster: "/content/gallery/reel-10.jpg", src: "/content/gallery/reel-10.mp4" },
  { id: "12_1", title: "پشت صحنهٔ تولید", poster: "/content/gallery/reel-12_1.jpg", src: "/content/gallery/reel-12_1.mp4" },
  { id: "13", title: "مواد اولیه تازه", poster: "/content/gallery/reel-13.jpg", src: "/content/gallery/reel-13.mp4" },
  { id: "15", title: "بسته‌بندی Fresh Pack", poster: "/content/gallery/reel-15.jpg", src: "/content/gallery/reel-15.mp4" },
  { id: "18", title: "وعدهٔ روزانه", poster: "/content/gallery/reel-18.jpg", src: "/content/gallery/reel-18.mp4" },
  { id: "21f", title: "نکتهٔ تغذیه", poster: "/content/gallery/reel-21f.jpg", src: "/content/gallery/reel-21f.mp4" },
  { id: "22", title: "ریلز پت‌فیت", poster: "/content/gallery/reel-22.jpg", src: "/content/gallery/reel-22.mp4" },
  { id: "24", title: "۶ مدل غذا برای پت‌ها", poster: "/content/gallery/reel-24.jpg", src: "/content/gallery/reel-24.mp4" },
  { id: "27", title: "با @petfit.food", poster: "/content/gallery/reel-27.jpg", src: "/content/gallery/reel-27.mp4" },
] as const;

export const PACKSHOT = "/content/gallery/packshot-products.jpg";
