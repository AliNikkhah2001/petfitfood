import { Link } from "react-router-dom";
import { formatToman } from "../data/catalog";
import { useCart } from "../lib/cart";

export default function CartPanel() {
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
