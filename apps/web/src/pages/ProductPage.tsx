import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatToman, type Product } from "../data/catalog";
import { getProduct } from "../lib/api";
import { useCart } from "../lib/cart";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const defaultGrams = product?.prices[0]?.grams ?? 400;
  const [grams, setGrams] = useState(defaultGrams);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    void getProduct(slug).then((p) => {
      if (cancelled) return;
      setProduct(p);
      if (p?.prices[0]) setGrams(p.prices[0].grams);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="o-container py-20 text-center text-sm text-neutral-500">در حال بارگذاری…</div>
    );
  }

  if (!product) {
    return (
      <div className="o-container py-20 text-center">
        <h1 className="text-xl font-extrabold text-brand-indigo">محصول یافت نشد</h1>
        <Link to="/shop" className="mt-4 inline-flex a-button">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const price = product.prices.find((p) => p.grams === grams);

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container--xl o-container">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-bold text-brand-indigo underline"
        >
          بازگشت
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="aspect-square bg-secondary-light-beige">
              <img src={product.image} alt={product.nameFa} className="h-full w-full object-cover" />
            </div>
            <div className="flex gap-2 overflow-x-auto p-4">
              <img src={product.image} alt="" className="h-16 w-16 shrink-0 rounded-xl border-2 border-brand-indigo object-cover" />
            </div>
          </div>

          <div>
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-brand-indigo">
              {product.badge}
            </span>
            <h1 className="mt-3 text-h-4xl text-brand-indigo">{product.nameFa}</h1>
            <p className="mt-3 text-sm leading-7 text-neutral-600">{product.description}</p>

            <div className="mt-6">
              <p className="text-xs font-bold text-brand-indigo">انتخاب وزن بسته</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.prices.map((p) => (
                  <button
                    key={p.grams}
                    type="button"
                    onClick={() => setGrams(p.grams)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      grams === p.grams
                        ? "bg-brand-indigo text-white"
                        : "bg-white text-brand-indigo ring-1 ring-neutral-200"
                    }`}
                  >
                    {p.grams}g · {formatToman(p.priceToman)}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-2xl font-extrabold text-brand-orange-hot">
              {price ? formatToman(price.priceToman) : "—"}
            </p>

            <button
              type="button"
              disabled={!price}
              onClick={() => addItem(product, grams)}
              className="mt-4 h-12 w-full rounded-2xl bg-brand-orange-hot text-sm font-extrabold text-white hover:bg-primary-600 disabled:opacity-40 sm:w-auto sm:px-10"
            >
              افزودن به سبد
            </button>

            <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="text-sm font-extrabold text-brand-indigo">مواد اولیه</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="rounded-full bg-secondary-off-white px-3 py-1 text-xs font-semibold text-neutral-700"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
