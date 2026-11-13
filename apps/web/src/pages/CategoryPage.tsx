import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BEEF_PRODUCTS, CHICKEN_PRODUCTS, PRODUCTS, formatToman, type Product } from "../data/catalog";

type CategoryMeta = { title: string; description: string };

const SLUG_META: Record<string, CategoryMeta> = {
  chicken: {
    title: "مرغ",
    description: "همهٔ وعده‌های پروتئین مرغ — Pro، Normal و سوپ.",
  },
  beef: {
    title: "گوساله",
    description: "منوی گوشت گوساله با گزینه‌های وزن مختلف.",
  },
  morgh: {
    title: "مرغ",
    description: "دستهٔ مرغ.",
  },
  gusaleh: {
    title: "گوساله",
    description: "دستهٔ گوساله.",
  },
  "7-day": {
    title: "پک ۷ روزه",
    description: "انتخاب وعده برای یک هفته — ترکیب دلخواه از منو.",
  },
  "14-day": {
    title: "پک ۱۴ روزه",
    description: "برنامهٔ دو هفته‌ای با تنوع پروتئین.",
  },
  intro: {
    title: "پک آشنایی",
    description: "وعده‌های سبک‌تر برای شروع — پیشنهاد از خط Normal و سوپ.",
  },
};

function filterProducts(slug: string): Product[] {
  if (slug === "chicken" || slug === "morgh") return CHICKEN_PRODUCTS;
  if (slug === "beef" || slug === "gusaleh") return BEEF_PRODUCTS;
  if (slug === "intro") {
    return PRODUCTS.filter((p) => p.badge.includes("Normal") || p.badge.includes("سوپ"));
  }
  if (slug === "7-day" || slug === "14-day") {
    return PRODUCTS.filter((p) => p.badge.includes("Pro") || p.group === "chicken");
  }
  return PRODUCTS;
}

export default function CategoryPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const meta = SLUG_META[slug] ?? { title: "دسته محصول", description: "فهرست محصولات این دسته." };
  const items = useMemo(() => filterProducts(slug), [slug]);

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container--xl o-container">
        <Link to="/shop" className="text-sm font-bold text-brand-indigo underline">
          همه محصولات
        </Link>
        <h1 className="mt-4 text-h-4xl text-brand-indigo">{meta.title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-600">{meta.description}</p>

        {items.length === 0 ? (
          <p className="mt-10 text-sm text-neutral-500">محصولی در این دسته نیست.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-brand-indigo/25"
              >
                <div className="aspect-[5/4] bg-secondary-light-beige">
                  <img src={p.image} alt={p.nameFa} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <h2 className="text-base font-extrabold text-neutral-800">{p.nameFa}</h2>
                  <p className="mt-1 text-sm text-brand-orange-hot">
                    از {formatToman(Math.min(...p.prices.map((x) => x.priceToman)))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
