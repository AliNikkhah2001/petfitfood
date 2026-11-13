import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { asset } from "../lib/asset";
import { PLANET_PHOTO } from "../lib/assets";
import {
  BEEF_PRODUCTS,
  CHICKEN_PRODUCTS,
  INGREDIENT_SHOWCASE,
  formatToman,
  type Product,
} from "../data/catalog";
import { CONTACT, telHref } from "../data/contact";
import BenefitIcon, { type BenefitIconName } from "./BenefitIcon";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-inview={inView}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5 text-[#f0b400]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="m8 1 2.06 4.44L15 6.06l-3.5 3.52.83 4.92L8 12.16 3.67 14.5l.83-4.92L1 6.06l4.94-.62L8 1Z" />
        </svg>
      ))}
    </div>
  );
}

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={direction === "left" ? "rotate-180" : ""}
      aria-hidden="true"
    >
      <path
        d="M2.5 8h11m0 0-4.25-4.25M13.5 8l-4.25 4.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarouselButton({
  direction,
  onClick,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition-all hover:border-primary-700 hover:bg-primary-700 hover:text-white"
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

/* Official Instagram product menu — curated cards, not a dump */

const MARQUEE = [
  "منوی رسمی پت‌فیت",
  "مرغ · گوساله",
  "Pro · Normal · سوپ",
  "بدون نگهدارنده",
  "@petfit.food",
];

function ProductCard({ product }: { product: Product }) {
  return (
    <article
      id={product.slug}
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_32px_-24px_rgba(48,36,108,0.35)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-secondary-light-beige">
        <img
          src={product.image}
          alt={product.nameFa}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold text-brand-indigo shadow-sm">
          {product.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
        <h3 className="text-base font-extrabold text-neutral-800 md:text-lg">{product.nameFa}</h3>
        <p className="text-sm leading-7 text-neutral-600">{product.description}</p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {product.ingredients.slice(0, 5).map((ing) => (
            <li
              key={ing}
              className="rounded-full bg-secondary-off-white px-2.5 py-1 text-[10px] font-bold text-brand-indigo"
            >
              {ing}
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-1 border-t border-neutral-100 pt-3">
          {product.prices.map((p) => (
            <div key={p.grams} className="flex items-center justify-between text-sm">
              <span className="font-bold text-neutral-500">{p.grams} گرم</span>
              <span className="font-extrabold text-brand-orange-hot">{formatToman(p.priceToman)}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Brands() {
  return (
    <section id="our-brands" className="bg-white py-16 md:py-20">
      <div className="o-container--xl o-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">منوی محصولات</p>
            <h2 className="mt-3 text-h-4xl leading-[1.3] text-neutral-700 md:text-h-5xl">
              قیمت و مشخصات رسمی پت‌فیت
            </h2>
            <p className="mt-3 text-sm leading-8 font-medium text-neutral-600 md:text-base">
              برگرفته از منوی اینستاگرام {CONTACT.instagram} — هر کارت یک محصول با وزن، قیمت و
              مواد اولیه واقعی.
            </p>
          </div>
        </Reveal>

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-extrabold text-brand-indigo">خانواده مرغ</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHICKEN_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="mb-4 text-lg font-extrabold text-brand-indigo">خانواده گوساله</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BEEF_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden border-y border-neutral-200 py-5">
          <div className="marquee-track items-center gap-14">
            {[...MARQUEE, ...MARQUEE].map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="whitespace-nowrap text-lg font-bold text-neutral-300 md:text-xl"
              >
                {label}
                <span
                  className="mx-7 inline-block h-2 w-2 rounded-full bg-primary-300"
                  aria-hidden="true"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Fresh difference */

const BENEFITS: { icon: BenefitIconName; label: string }[] = [
  { icon: "bowl", label: "خوش‌خوراک و اشتهابرانگیز" },
  { icon: "coat", label: "کمک به سلامت پوست و مو" },
  { icon: "weight", label: "حفظ وزن متعادل" },
  { icon: "energy", label: "انرژی برای بازی و کشف" },
  { icon: "digestion", label: "توجه به گوارش سالم" },
];

export function Difference() {
  return (
    <section
      id="difference"
      className="overflow-hidden bg-primary-100 py-16 md:py-20"
    >
      <div className="o-container--xl o-container">
        <Reveal className="mx-auto max-w-[900px] text-center">
          <p className="eyebrow">تفاوت در جزئیات است</p>
          <h2 className="mt-3 text-h-4xl leading-[1.3] text-neutral-700 md:text-h-5xl">
            حالِ خوب از یک کاسه شروع می‌شود
          </h2>
          <p className="mx-auto mt-5 max-w-[760px] text-sm leading-8 font-medium text-neutral-700 md:text-base">
            با ترکیبات متعادل و توجه به نیازهای روزانه‌ی سگ‌ها و گربه‌ها، هر
            وعده‌ی پت‌فیت برای همراهی با یک زندگی پرتحرک آماده شده است.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {BENEFITS.map((benefit, index) => (
            <Reveal key={benefit.label} delay={index * 70}>
              <div className="flex h-full flex-col items-center gap-4 rounded-2xl bg-white/70 px-4 py-6 text-center transition-colors duration-300 hover:bg-white md:px-5 md:py-8">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-primary-600 shadow-[0_10px_24px_-18px_rgba(122,82,0,0.3)] md:h-24 md:w-24">
                  <BenefitIcon name={benefit.icon} />
                </div>
                <h3 className="text-sm leading-7 font-bold text-primary-700 md:text-base">
                  {benefit.label}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-9 flex justify-center">
          <a href="#find-store" className="a-button">
            پیدا کردن فروشگاه
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* Planet / mission */

const PLANET_POINTS = [
  "توجه به انتخاب و کیفیت مواد اولیه",
  "بسته‌بندی با درنظرگرفتن کاهش دورریز",
  "حرکت پیوسته به‌سوی تولید مسئولانه‌تر",
];

export function Planet() {
  return (
    <section id="planet" className="bg-white py-16 md:py-24">
      <div className="o-container--xl o-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] bg-secondary-light-beige">
              <img
                src={PLANET_PHOTO}
                alt="سگی خوشحال در طبیعت سرسبز"
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
              <div className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold text-primary-700 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M13.5 2.5C7 2 3.2 4.6 2.8 9.1c3.8.9 8.9-.3 10.7-6.6Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 13.5c1.5-3.4 3.7-5.7 6.5-7.2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                دوستدار طبیعت
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <p className="eyebrow">حالا و آینده‌ی سبزتر</p>
            <h2 className="mt-3 text-h-4xl leading-[1.3] text-neutral-800 md:text-h-5xl">
              حالِ خوبِ حیوانات،
              <br />
              هوای خوبِ زمین.
            </h2>
            <p className="mt-5 text-sm leading-8 font-medium text-neutral-600 md:text-base">
              مراقبت از حیوانات خانگی و توجه به محیط‌زیست از هم جدا نیستند. در
              پت‌فیت، انتخاب دقیق مواد اولیه و بسته‌بندی مسئولانه بخشی از مسیری
              است که برای ساختن فردایی بهتر دنبال می‌کنیم.
            </p>
            <ul className="mt-6 space-y-3">
              {PLANET_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-200 text-primary-700">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="m2 6.2 2.5 2.5L10 3.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm leading-7 font-semibold text-neutral-700 md:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#ingredients" className="a-button">
                دیدن مواد اولیه
              </a>
              <Link to="/shop" className="a-button-outline">
                خرید از فروشگاه
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Reviews */

type Review = {
  title: string;
  quote: string;
  author: string;
  tags: string[];
};

const REVIEWS: Review[] = [
  {
    title: "پوفی عاشق وعده‌های تازه شده",
    quote:
      "از وقتی غذای تازه را به برنامه‌ی پوفی اضافه کردیم، وقت غذا خوردنش از همه‌ی روز هیجان‌انگیزتر شده. کاسه‌اش را تا آخر می‌خورد و ما هم با خیال راحت‌تری انتخاب می‌کنیم.",
    author: "سارا، همراهِ پوفی",
    tags: ["سلامتی", "بدغذایی"],
  },
  {
    title: "انتخابی که میلو دوست دارد",
    quote:
      "میلو همیشه برای امتحان کردن غذاهای تازه سخت‌گیر بود. عطر و بافت این ترکیب را که دید، خودش جلو آمد. حالا با دیدن کاسه‌اش دمش از خوشحالی تکان می‌خورد.",
    author: "مینا، همراهِ میلو",
    tags: ["سلامتی", "بدغذایی"],
  },
  {
    title: "یک وعده‌ی خوش‌طعم برای گربه‌ی حساس من",
    quote:
      "پیدا کردن غذایی که هم خوش‌طعم باشد و هم با سلیقه‌ی گربه‌ام جور دربیاید همیشه سخت بود. مواد اولیه‌ی ساده و مشخص پت‌فیت انتخاب را برایم راحت‌تر کرد.",
    author: "الهام، همراهِ لونا",
    tags: ["حساسیت", "گربه‌ها"],
  },
  {
    title: "اشتها برای غذا خوردن برگشته",
    quote:
      "رِکس خیلی زود از غذای تکراری خسته می‌شد. با تنوع ترکیبات تازه، حالا وقت غذا خودش کنار کاسه منتظر می‌ماند. از دیدن این همه ذوق خوشحالیم.",
    author: "آرمان، همراهِ رکس",
    tags: ["بدغذایی", "سگ‌های بزرگ"],
  },
  {
    title: "ترکیبات ساده، انتخاب مطمئن‌تر",
    quote:
      "برای ما مهم است بدانیم در هر وعده چه موادی وجود دارد. توضیح روشن ترکیبات کمک می‌کند با توجه به نیازهای روزانه‌ی پشمک انتخاب بهتری داشته باشیم.",
    author: "نازنین، همراهِ پشمک",
    tags: ["سلامتی", "وزن"],
  },
  {
    title: "یک میان‌وعده‌ی دوست‌داشتنی",
    quote:
      "بامبی برای تشویقی‌ها هم سلیقه‌ی خودش را دارد. این میان‌وعده‌ی کوچک را با اشتیاق می‌گیرد و ما برای تمرین‌های روزانه یک انتخاب تازه داریم.",
    author: "کیانا، همراهِ بامبی",
    tags: ["تشویقی", "سگ‌های بزرگ"],
  },
];

const FILTERS = [
  "همه",
  "سلامتی",
  "حساسیت",
  "وزن",
  "بدغذایی",
  "گربه‌ها",
  "تشویقی",
];

export function Reviews() {
  const [filter, setFilter] = useState("همه");
  const [expanded, setExpanded] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const visible =
    filter === "همه" ? REVIEWS : REVIEWS.filter((review) => review.tags.includes(filter));

  const scroll = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * 400, behavior: "smooth" });
  };

  return (
    <section
      id="reviews"
      className="overflow-hidden bg-secondary-light-beige py-16 md:py-20"
    >
      <div className="o-container--xl o-container">
        <Reveal className="mx-auto max-w-[820px] text-center">
          <p className="text-xs font-bold text-neutral-600">
            از زبان همراهان پت‌فیت
          </p>
          <h2 className="mt-3 text-h-4xl leading-[1.3] text-neutral-700 md:text-h-5xl">
            لحظه‌های خوش، از ظرف غذا شروع می‌شوند
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2.5">
            <Stars />
            <span className="text-sm font-semibold text-neutral-700">
              تجربه‌های واقعی از روزهای هر خانه
            </span>
          </div>
        </Reveal>

        <div className="no-scrollbar mt-7 flex snap-x justify-start gap-2 overflow-x-auto pb-1 md:justify-center">
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setFilter(item);
                  setExpanded(null);
                }}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-5 py-[11px] text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary-700 bg-primary-700 text-white"
                    : "border-neutral-300 bg-transparent text-neutral-700 hover:border-primary-700"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-500" aria-live="polite">
            {visible.length.toLocaleString("fa-IR")} تجربه‌ی همراهان پت‌فیت
          </p>
          <div className="flex gap-2">
            <CarouselButton
              direction="left"
              label="نظر قبلی"
              onClick={() => scroll(-1)}
            />
            <CarouselButton
              direction="right"
              label="نظر بعدی"
              onClick={() => scroll(1)}
            />
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        >
          {visible.map((review) => {
            const isOpen = expanded === review.title;
            return (
              <article
                key={review.title}
                className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl bg-white p-6 shadow-[0_16px_40px_-34px_rgba(122,82,0,0.35)] md:w-[378px]"
              >
                <Stars />
                <h3 className="mt-3 text-lg leading-8 font-bold text-neutral-800">
                  {review.title}
                </h3>
                <p
                  className={`mt-3 grow text-sm leading-7 font-medium text-neutral-600 ${
                    isOpen ? "" : "line-clamp-6"
                  }`}
                >
                  «{review.quote}»
                </p>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : review.title)}
                  className="mt-3 self-start text-xs font-bold text-primary-700 underline underline-offset-2 hover:text-primary-600"
                >
                  {isOpen ? "کمتر بخوانید" : "بیشتر بخوانید"}
                </button>
                <p className="mt-5 border-t border-neutral-200 pt-4 text-xs font-bold text-neutral-500">
                  {review.author}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Store locator */

const toLatinDigits = (value: string) =>
  value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persian = "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
    if (persian >= 0) return String(persian);
    const arabic = "٠١٢٣٤٥٦٧٨٩".indexOf(digit);
    return arabic >= 0 ? String(arabic) : digit;
  });

export function StoreCta() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [searchedCity, setSearchedCity] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = city.trim();
    if (query.length < 2) {
      setError("نام شهر یا کد پستی را وارد کنید.");
      setSearchedCity("");
      return;
    }
    setError("");
    setSearchedCity(query);
  };

  const normalizedCity = toLatinDigits(searchedCity);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `فروشگاه غذای حیوانات خانگی ${normalizedCity} ایران`,
  )}`;

  return (
    <section id="find-store" className="bg-white py-16 md:py-20">
      <div className="o-container--xl o-container">
        <div className="overflow-hidden rounded-[28px] bg-secondary-light-leaf">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 md:p-12">
              <p className="eyebrow">تماس و سفارش</p>
              <h2 className="mt-3 max-w-[500px] text-h-4xl leading-[1.35] text-neutral-800 md:text-h-5xl">
                مستقیم با پت‌فیت در ارتباط باشید.
              </h2>
              <Link
                to="/shop"
                className="mt-4 inline-flex rounded-full bg-brand-orange-hot px-5 py-2.5 text-sm font-extrabold text-white"
              >
                خرید آنلاین از فروشگاه
              </Link>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-neutral-800 md:text-base">
                <li>
                  موبایل:{" "}
                  <a className="text-primary-700 underline" href={telHref(CONTACT.phoneMobile)} dir="ltr">
                    {CONTACT.phoneMobile}
                  </a>
                </li>
                <li>
                  تلفن:{" "}
                  <a className="text-primary-700 underline" href={telHref(CONTACT.phoneLandline)} dir="ltr">
                    {CONTACT.phoneLandline}
                  </a>
                </li>
                <li>
                  اینستاگرام:{" "}
                  <a
                    className="text-primary-700 underline"
                    href={CONTACT.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                  >
                    {CONTACT.instagram}
                  </a>
                </li>
                <li className="leading-7 font-medium text-neutral-700">
                  آدرس: {CONTACT.address}
                  <span className="mt-1 block" dir="ltr">
                    کد پستی {CONTACT.postalCode}
                  </span>
                </li>
              </ul>
              <p className="mt-4 max-w-[500px] text-sm leading-8 font-medium text-neutral-700 md:text-base">
                یا نام شهر را وارد کنید تا فروشگاه‌های نزدیک را روی نقشه ببینید.
              </p>

              <form onSubmit={submit} noValidate className="mt-6 max-w-[460px]">
                <label
                  htmlFor="zip"
                  className="text-xs font-bold text-primary-700"
                >
                  شهر یا کد پستی
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="zip"
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value);
                      setError("");
                    }}
                    autoComplete="postal-code"
                    placeholder="مثلاً تهران یا ۱۴۳۵۸"
                    className="h-[46px] w-full rounded-full border border-primary-700/25 bg-white px-5 text-sm font-medium text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-primary-700"
                  />
                  <button type="submit" className="a-button shrink-0">
                    جست‌وجو
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-xs font-semibold text-[#a33222]" role="alert">
                    {error}
                  </p>
                )}
              </form>

              {searchedCity && (
                <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white/90 p-4" aria-live="polite">
                  <p className="text-sm leading-7 font-bold text-neutral-700">
                    نتیجه‌ی جست‌وجو برای «{searchedCity}» آماده است.
                  </p>
                  <p className="text-xs leading-6 font-medium text-neutral-500">
                    نقشه را باز کنید تا نزدیک‌ترین فروشگاه‌های حیوانات خانگی را ببینید.
                  </p>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 self-start text-sm font-bold text-primary-700 underline underline-offset-4"
                  >
                    دیدن فروشگاه‌های نزدیک در نقشه
                    <ArrowIcon />
                  </a>
                </div>
              )}

              <p className="mt-5 text-xs leading-6 font-semibold text-primary-700">
                دنبال ترکیب مناسب هستید؟{" "}
                <a href="#ingredients" className="underline underline-offset-2">
                  مواد اولیه‌ی پت‌فیت را ببینید.
                </a>
              </p>
            </div>

            <div className="relative min-h-[300px] overflow-hidden bg-primary-300 lg:min-h-full">
              <img
                src={asset("content/products/PetFit_01.jpg")}
                alt="محصولات واقعی پت‌فیت"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-700/55 via-transparent to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div>
                  <p className="petfit-card-mark text-[15px]">PetFit</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-800">
                    غذای اورگانیک و بالانس‌شده
                  </p>
                </div>
                <Link to="/shop" className="a-button px-4 py-2.5 text-xs">
                  خرید آنلاین
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Ingredient gallery — real PetFit base formula */

export function Ingredients() {
  return (
    <section id="ingredients" className="bg-secondary-off-white py-16 md:py-20">
      <div className="o-container--xl o-container">
        <Reveal className="mx-auto max-w-[790px] text-center">
          <p className="eyebrow">فرمولاسیون پت‌فیت</p>
          <h2 className="mt-3 text-h-4xl leading-[1.35] text-neutral-700 md:text-h-5xl">
            گوشت پایه + احشاء + سبزیجات مشترک
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-sm leading-8 font-medium text-neutral-500 md:text-base">
            در منوی ۱۲ گانه، سبزیجات (هویج، کدو حلوایی، کدو سبز، سیب‌زمینی) و دل و
            جگر مرغ در همهٔ محصولات مشترک‌اند؛ تفاوت در گوشت پایه و بافت
            (Pro / Normal / سوپ) است.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:mt-12 md:grid-cols-4 lg:grid-cols-8 lg:gap-3">
          {INGREDIENT_SHOWCASE.map((ingredient, index) => (
            <Reveal key={ingredient.name} delay={index * 40}>
              <div className="group flex h-full flex-col items-center text-center">
                <div className="relative aspect-square w-full max-w-[132px] overflow-hidden rounded-full border-[6px] border-white bg-primary-200 shadow-[0_18px_36px_-26px_rgba(122,82,0,0.35)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-800 md:text-base">
                  {ingredient.name}
                </h3>
                <p className="mt-1.5 text-[11px] leading-6 font-medium text-neutral-500 md:text-xs">
                  {ingredient.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center gap-3">
          <a href="#instagram-gallery" className="a-button">
            گالری ویدیوهای اینستاگرام
          </a>
          <a href="#how-its-made" className="a-button-outline">
            شیوه‌ی آماده‌سازی
          </a>
        </Reveal>
      </div>
    </section>
  );
}
