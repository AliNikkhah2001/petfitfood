import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatToman } from "../data/catalog";
import { CONTACT } from "../data/contact";
import { createOrder } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useCart } from "../lib/cart";

/** Phase A checkout shell — collects order details, no payment gateway. */
export default function CheckoutPage() {
  const { lines, totalToman, clear } = useCart();
  const { customer, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (authLoading || prefilled || !customer) return;
    setName(customer.name ?? "");
    setPhone(customer.phone ?? "");
    setCity(customer.city ?? "");
    setAddress(customer.address ?? "");
    setPostalCode(customer.postal_code ?? "");
    setPrefilled(true);
  }, [authLoading, customer, prefilled]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (lines.length === 0) {
      setError("سبد خرید خالی است.");
      return;
    }
    if (
      name.trim().length < 2 ||
      phone.replace(/\D/g, "").length < 10 ||
      address.trim().length < 8 ||
      city.trim().length < 2
    ) {
      setError("نام، موبایل، شهر و آدرس را کامل وارد کنید.");
      return;
    }
    setError("");
    setSubmitting(true);

    const payload = {
      customer_name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postal_code: postalCode.trim() || undefined,
      note: note.trim() || undefined,
      lines: lines.map((l) => ({
        product_id: l.productId,
        grams: l.grams,
        qty: l.qty,
        unit_price: l.unitPrice,
      })),
      total_toman: totalToman,
    };

    void createOrder(payload)
      .then(() => {
        setDone(true);
        clear();
      })
      .catch(() => {
        setError("ثبت سفارش ناموفق بود. دوباره تلاش کنید.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-brand-indigo">سفارش شما ثبت شد</h1>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          به‌زودی برای هماهنگی ارسال با شما تماس می‌گیریم. پشتیبانی:{" "}
          <span dir="ltr">{CONTACT.phoneMobile}</span>
        </p>
        <Link to="/shop" className="mt-6 inline-flex a-button">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-bold text-brand-indigo underline"
        >
          بازگشت
        </button>
        <h1 className="mt-4 text-h-4xl text-brand-indigo">تکمیل سفارش</h1>
        <p className="mt-2 text-sm text-neutral-600">
          مرحلهٔ اول — بدون درگاه پرداخت؛ جزئیات سفارش برای پیگیری ذخیره می‌شود.
        </p>

        {!token && !authLoading ? (
          <p className="mt-3 text-sm text-neutral-600">
            با{" "}
            <Link to="/login?next=/checkout" className="font-bold text-brand-orange-hot underline">
              ورود
            </Link>{" "}
            می‌توانید آدرس را برای دفعات بعد ذخیره کنید.
          </p>
        ) : null}

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-extrabold text-brand-indigo">خلاصه سبد</h2>
          {lines.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">
              سبد خالی است.{" "}
              <Link to="/shop" className="font-bold text-brand-orange-hot underline">
                رفتن به فروشگاه
              </Link>
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.grams}`} className="flex justify-between gap-3">
                  <span>
                    {l.nameFa} · {l.grams}g × {l.qty}
                  </span>
                  <span className="font-bold">{formatToman(l.unitPrice * l.qty)}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-neutral-100 pt-2 font-extrabold text-brand-indigo">
                <span>جمع</span>
                <span>{formatToman(totalToman)}</span>
              </li>
            </ul>
          )}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">نام و نام خانوادگی</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">موبایل</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              dir="ltr"
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
              placeholder="09xxxxxxxxx"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">شهر</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">آدرس تحویل</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border-2 border-brand-indigo/15 px-3 py-2 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">کد پستی (اختیاری)</span>
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
              dir="ltr"
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">توضیحات (اختیاری)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border-2 border-brand-indigo/15 px-3 py-2 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-2xl bg-brand-orange-hot text-sm font-extrabold text-white hover:bg-primary-600 disabled:opacity-60"
          >
            {submitting ? "در حال ثبت…" : "ثبت سفارش"}
          </button>
        </form>
      </div>
    </div>
  );
}
