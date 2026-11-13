import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CartPanel from "../components/CartPanel";
import {
  BEEF_PRODUCTS,
  CHICKEN_PRODUCTS,
  PRODUCTS,
  formatToman,
  type Product,
} from "../data/catalog";
import { useCart } from "../lib/cart";

type GroupFilter = "all" | "chicken" | "beef";

function ShopCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const defaultGrams = product.prices[0]?.grams ?? 400;
  const [grams, setGrams] = useState(defaultGrams);
  const price = product.prices.find((p) => p.grams === grams);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <Link to={`/product/${product.slug}`} className="relative aspect-[5/4] bg-secondary-light-beige">
        <img src={product.image} alt={product.nameFa} className="h-full w-full object-cover" />
        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold text-brand-indigo">
          {product.badge}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/product/${product.slug}`} className="text-base font-extrabold text-neutral-800 hover:text-brand-indigo">
          {product.nameFa}
        </Link>
        <p className="text-sm leading-7 text-neutral-600">{product.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {product.prices.map((p) => (
            <button
              key={p.grams}
              type="button"
              onClick={() => setGrams(p.grams)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                grams === p.grams
                  ? "bg-brand-indigo text-white"
                  : "bg-secondary-off-white text-brand-indigo"
              }`}
            >
              {p.grams}g
            </button>
          ))}
        </div>
        <p className="mt-1 text-lg font-extrabold text-brand-orange-hot">
          {price ? formatToman(price.priceToman) : "—"}
        </p>
        <button
          type="button"
          disabled={!price}
          onClick={() => addItem(product, grams)}
          className="mt-auto h-11 rounded-2xl bg-brand-orange-hot text-sm font-extrabold text-white transition hover:bg-primary-600 disabled:opacity-40"
        >
          افزودن به سبد
        </button>
      </div>
    </article>
  );
}

export default function ShopPage() {
  const [group, setGroup] = useState<GroupFilter>("all");
  const { itemCount } = useCart();
  const items = useMemo(() => {
    if (group === "chicken") return CHICKEN_PRODUCTS;
    if (group === "beef") return BEEF_PRODUCTS;
    return PRODUCTS;
  }, [group]);

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container--xl o-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">فروشگاه پت‌فیت</p>
            <h1 className="mt-2 text-h-4xl text-brand-indigo md:text-h-5xl">منوی خرید</h1>
            <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-600">
              قیمت‌ها از منوی رسمی اینستاگرام — وزن را انتخاب کنید و به سبد اضافه کنید.
            </p>
          </div>
          <p className="rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-indigo shadow-sm">
            {itemCount} قلم در سبد
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["all", "همه"],
              ["chicken", "مرغ"],
              ["beef", "گوساله"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setGroup(id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                group === id
                  ? "bg-brand-indigo text-white"
                  : "bg-white text-brand-indigo hover:bg-primary-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <ShopCard key={p.id} product={p} />
            ))}
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <CartPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
