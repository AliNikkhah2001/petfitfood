/** Contact details ingested from contents/ChatExport (Telegram dump). */
export const CONTACT = {
  brand: "پت‌فیت",
  brandEn: "PetFit",
  tagline: "غذای اورگانیک و بالانس‌شده",
  phoneMobile: "09045957011",
  phoneLandline: "021-22878060",
  email: "a01039531615@gmail.com",
  instagram: "@petfit.food",
  instagramUrl: "https://www.instagram.com/petfit.food/",
  website: "https://www.petfitfood.ir",
  youtubeUrl: "https://www.youtube.com/watch?v=ovo-cuEvx2Y",
  address:
    "محله حشمتیه، آیت‌الله قدوسی، معلم شرقی، خیابان گوهری شمالی، خیابان جلالی، خیابان هدایتی، بن‌بست یکم غربی، پلاک ۱۰، زنگ ۴",
  postalCode: "1637673565",
} as const;

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\D/g, "")}`;
}
