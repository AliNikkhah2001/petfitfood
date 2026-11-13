import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { formatToman } from "../data/catalog";
import { getOrders, updateMe, type ApiOrder } from "../lib/api";
import { useAuth } from "../lib/auth";

const STATUS_FA: Record<string, string> = {
  new: "جدید",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  cancelled: "لغو",
};

export default function AccountPage() {
  const { customer, loading, logout, isAdmin, refreshMe, token } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!customer) return;
    setName(customer.name ?? "");
    setCity(customer.city ?? "");
    setAddress(customer.address ?? "");
    setPostalCode(customer.postal_code ?? "");
  }, [customer]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setOrdersLoading(true);
    void getOrders()
      .then((list) => {
        if (!cancelled) setOrders(list);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setProfileError("");
    setProfileSaved(false);
    setSaving(true);
    try {
      await updateMe({
        name: name.trim() || undefined,
        city: city.trim() || undefined,
        address: address.trim() || undefined,
        postal_code: postalCode.trim() || undefined,
      });
      await refreshMe();
      setProfileSaved(true);
    } catch {
      setProfileError("ذخیرهٔ پروفایل ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
        <div className="o-container mx-auto max-w-lg">
          <p className="text-sm text-neutral-500">در حال بارگذاری…</p>
        </div>
      </div>
    );
  }

  if (!customer || !token) {
    return (
      <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
        <div className="o-container mx-auto max-w-lg text-center">
          <h1 className="text-h-4xl text-brand-indigo">حساب من</h1>
          <p className="mt-3 text-sm text-neutral-600">برای مشاهده سفارش‌ها و ویرایش آدرس وارد شوید.</p>
          <Link to="/login?next=/account" className="mt-6 inline-flex a-button">
            ورود با کد یک‌بارمصرف
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-lg space-y-6">
        <p>
          {isAdmin ? (
            <Link
              to="/dashboard"
              className="inline-flex rounded-2xl bg-brand-orange-hot px-4 py-2 text-sm font-extrabold text-white hover:bg-primary-600"
            >
              پنل مدیریت فروشگاه
            </Link>
          ) : null}
        </p>

        <h1 className="text-h-4xl text-brand-indigo">حساب من</h1>
        <p className="text-sm text-neutral-600">
          <span dir="ltr">{customer.phone}</span>
          {customer.name ? ` · ${customer.name}` : null}
        </p>

        <form
          onSubmit={(e) => void saveProfile(e)}
          className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"
        >
          <h2 className="text-sm font-extrabold text-brand-indigo">پروفایل و آدرس</h2>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">نام</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
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
            <span className="text-xs font-bold text-brand-indigo">آدرس</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border-2 border-brand-indigo/15 px-3 py-2 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">کد پستی</span>
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
              dir="ltr"
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          {profileError ? <p className="text-sm font-bold text-red-600">{profileError}</p> : null}
          {profileSaved ? <p className="text-sm font-bold text-green-700">ذخیره شد.</p> : null}
          <button
            type="submit"
            disabled={saving}
            className="h-11 w-full rounded-2xl bg-brand-indigo text-sm font-extrabold text-white disabled:opacity-60"
          >
            {saving ? "در حال ذخیره…" : "ذخیره پروفایل"}
          </button>
        </form>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-extrabold text-brand-indigo">سفارش‌های من</h2>
          {ordersLoading ? <p className="mt-3 text-sm text-neutral-500">در حال بارگذاری…</p> : null}
          {!ordersLoading && (!orders || orders.length === 0) ? (
            <p className="mt-3 text-sm text-neutral-500">هنوز سفارشی ثبت نشده.</p>
          ) : null}
          {orders && orders.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-100 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs" dir="ltr">
                    {order.id.slice(0, 8)}…
                  </span>
                  <span>{STATUS_FA[order.status] ?? order.status}</span>
                  <span className="font-bold">{formatToman(order.total_toman)}</span>
                  <span className="text-xs text-neutral-500" dir="ltr">
                    {order.created_at}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <button
          type="button"
          onClick={logout}
          className="text-sm font-bold text-red-600 underline"
        >
          خروج از حساب
        </button>
      </div>
    </div>
  );
}
