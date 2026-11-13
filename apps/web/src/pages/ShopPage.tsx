import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
      <div className="relative aspect-[5/4] bg-secondary-light-beige">
        <img src={product.image} alt={product.nameFa} className="h-full w-full object-cover" />
        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold text-brand-indigo">
          {product.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-base font-extrabold text-neutral-800">{product.nameFa}</h2>
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

function CartPanel() {
  const { lines, totalToman, setQty, removeLine, clear } = useCart();

  if (lines.length === 0) {
    return (
      <aside className="rounded-2xl border border-dashed border-neutral-300 bg-white p-5 text-sm text-neutral-500">
        سبد خرید خالی است. یک وزن را انتخاب کنید و به سبد اضافه کنید.
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-extrabold text-brand-indigo">سبد خرید</h2>
        <button type="button" onClick={clear} className="text-xs font-bold text-neutral-500 underline">
          پاک کردن
        </button>
      </div>
      <ul className="mt-4 space-y-3">
        {lines.map((line) => (
          <li key={`${line.productId}-${line.grams}`} className="flex gap-3 border-b border-neutral-100 pb-3">
            <img src={line.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-neutral-800">{line.nameFa}</p>
              <p className="text-xs text-neutral-500">
                {line.grams}g · {formatToman(line.unitPrice)}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  className="grid h-7 w-7 place-items-center rounded-full border border-neutral-200 text-sm font-bold"
                  onClick={() => setQty(line.productId, line.grams, line.qty - 1)}
                >
                  −
                </button>
                <span className="text-sm font-bold">{line.qty}</span>
                <button
                  type="button"
                  className="grid h-7 w-7 place-items-center rounded-full border border-neutral-200 text-sm font-bold"
                  onClick={() => setQty(line.productId, line.grams, line.qty + 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="ms-auto text-[11px] font-bold text-red-600"
                  onClick={() => removeLine(line.productId, line.grams)}
                >
                  حذف
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center justify-between text-base font-extrabold text-brand-indigo">
        <span>جمع</span>
        <span>{formatToman(totalToman)}</span>
      </p>
      <Link
        to="/checkout"
        className="mt-4 flex h-12 items-center justify-center rounded-2xl bg-brand-indigo text-sm font-extrabold text-white"
      >
        ادامه سفارش
      </Link>
    </aside>
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
