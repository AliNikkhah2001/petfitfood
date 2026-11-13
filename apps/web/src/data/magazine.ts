import { asset } from "../lib/asset";

export type MagazineArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  cover: string;
  body: string[];
};

export const MAGAZINE_ARTICLES: MagazineArticle[] = [
  {
    slug: "taze-yani-chetori",
    title: "تازه یعنی چطوری؟ از آشپزخانه تا کاسه",
    excerpt: "مسیر آماده‌سازی، بسته‌بندی و نگهداری غذای تر در خانه.",
    publishedAt: "۱۴۰۴/۰۸/۱۲",
    cover: asset("/content/gallery/reel-15.jpg"),
    body: [
      "در پت‌فیت، «تازه» فقط یک برچسب نیست؛ زنجیرهٔ تولید تا تحویل طوری طراحی شده که بافت و ارزش غذایی حفظ شود.",
      "مواد اولیه پس از کنترل کیفیت آماده می‌شوند، پخت کنترل‌شده انجام می‌گیرد و بلافاصله در بستهٔ مخصوص بسته‌بندی می‌شود.",
      "در خانه، یخچال بهترین دوست وعدهٔ شماست؛ قبل از سرو کمی گرم‌کردن ملایم طعم را کامل می‌کند.",
    ],
  },
  {
    slug: "entekhab-protein",
    title: "مرغ یا گوساله؟ راهنمای انتخاب پروتئین",
    excerpt: "تفاوت وعده‌های مرغ و گوساله برای سگ و گربه فعال.",
    publishedAt: "۱۴۰۴/۰۷/۲۸",
    cover: asset("/brand/bowls/chicken.jpg"),
    body: [
      "مرغ معمولاً هضم آسان‌تری دارد و برای شروع یا پت‌های حساس گزینهٔ محبوبی است.",
      "گوساله انرژی و پروتئین بالاتری دارد و برای پت‌های بزرگ‌تر یا بسیار فعال مناسب است.",
      "در فروشگاه می‌توانید وزن بسته و خط Pro یا Normal را مقایسه کنید.",
    ],
  },
  {
    slug: "sagh-gorbeh-mizan",
    title: "مقدار وعده: سگ، گربه و وزن بدن",
    excerpt: "نکته‌های ساده برای تنظیم حجم روزانه بدون حدس زدن.",
    publishedAt: "۱۴۰۴/۰۷/۰۵",
    cover: asset("/brand/petfit-catdog-friends.jpg"),
    body: [
      "وزن بدن، سن و میزان فعالیت سه متغیر اصلی هستند. روی هر بسته راهنمای تقریبی وزن وجود دارد.",
      "بهتر است تغییرات را آهسته انجام دهید و واکنش پوست، مدفوع و اشتها را چند روز زیر نظر بگیرید.",
      "در صورت بیماری یا رژیم خاص، با دامپزشک و تیم پت‌فیت هماهنگ کنید.",
    ],
  },
];

export function getArticleBySlug(slug: string): MagazineArticle | undefined {
  return MAGAZINE_ARTICLES.find((a) => a.slug === slug);
}
