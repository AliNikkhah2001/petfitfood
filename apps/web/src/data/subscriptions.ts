export type SubscriptionPathway = {
  id: string;
  slug: "intro" | "7-day" | "14-day" | "custom";
  titleFa: string;
  subtitle: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaTo: string;
};

export const SUBSCRIPTION_PATHWAYS: SubscriptionPathway[] = [
  {
    id: "intro",
    slug: "intro",
    titleFa: "پک آشنایی",
    subtitle: "اولین قدم",
    description: "چند وعده برای آشنایی پت با طعم و بافت غذای تازه — بدون تعهد بلندمدت.",
    bullets: ["۲ تا ۴ وعده نمونه", "انتخاب پروتئین مرغ یا گوساله", "راهنمای گرم‌کردن و نگهداری"],
    ctaLabel: "مشاهده در فروشگاه",
    ctaTo: "/shop",
  },
  {
    id: "7-day",
    slug: "7-day",
    titleFa: "۷ روزه",
    subtitle: "هفتهٔ اول",
    description: "برنامهٔ یک هفته‌ای با تحویل منظم — مناسب شروع اشتراک و تنظیم وعده.",
    bullets: ["۷ روز وعدهٔ تازه", "قیمت‌گذاری شفاف بر اساس وزن", "پشتیبانی تغذیه در شروع"],
    ctaLabel: "انتخاب پک ۷ روزه",
    ctaTo: "/product-category/7-day",
  },
  {
    id: "14-day",
    slug: "14-day",
    titleFa: "۱۴ روزه",
    subtitle: "دو هفته کامل",
    description: "تداوم تغذیه تازه برای دو هفته؛ اقتصادی‌تر از خرید تک‌وعده.",
    bullets: ["۱۴ روز برنامه", "انعطاف در پروتئین", "ارسال هماهنگ‌شده"],
    ctaLabel: "انتخاب پک ۱۴ روزه",
    ctaTo: "/product-category/14-day",
  },
  {
    id: "custom",
    slug: "custom",
    titleFa: "اختصاصی",
    subtitle: "شخصی‌سازی",
    description: "ترکیب وعده‌ها، وزن و پروتئین مطابق نیاز پت و توصیهٔ دامپزشکی.",
    bullets: ["فرمول اختصاصی", "هماهنگی با تیم پت‌فیت", "مناسب حساسیت غذایی"],
    ctaLabel: "شروع پیکربندی",
    ctaTo: "/contact",
  },
];
