import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatToman } from "../data/catalog";
import { getOrders, type ApiOrder } from "../lib/api";

const STATUS_FA: Record<string, string> = {
  new: "جدید",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  cancelled: "لغو",
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void getOrders().then((list) => {
      if (!cancelled) {
        setOrders(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container--xl o-container">
        <Link to="/account" className="text-sm font-bold text-brand-indigo underline">
          حساب من
        </Link>
        <h1 className="mt-4 text-h-4xl text-brand-indigo">پنل سفارش‌ها</h1>
        <p className="mt-2 text-sm text-neutral-600">فهرست سفارش‌ها از API — در صورت قطع بودن سرور، حالت خالی نمایش داده می‌شود.</p>

        {loading ? (
          <p className="mt-10 text-sm text-neutral-500">در حال بارگذاری…</p>
        ) : null}

        {!loading && (!orders || orders.length === 0) ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <p className="text-sm font-semibold text-neutral-600">هنوز سفارشی از API دریافت نشد.</p>
            <p className="mt-2 text-xs text-neutral-500">
              پس از راه‌اندازی backend روی {import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"} سفارش‌ها اینجا ظاهر
              می‌شوند.
            </p>
            <Link to="/shop" className="mt-6 inline-flex a-button">
              رفتن به فروشگاه
            </Link>
          </div>
        ) : null}

        {!loading && orders && orders.length > 0 ? (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-start text-xs font-bold text-brand-indigo">
                  <th className="p-4">شناسه</th>
                  <th className="p-4">مشتری</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">مبلغ</th>
                  <th className="p-4">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-50">
                    <td className="p-4 font-mono text-xs" dir="ltr">
                      {order.id}
                    </td>
                    <td className="p-4">{order.customer_name}</td>
                    <td className="p-4">{STATUS_FA[order.status] ?? order.status}</td>
                    <td className="p-4 font-bold">{formatToman(order.total_toman)}</td>
                    <td className="p-4 text-xs text-neutral-500" dir="ltr">
                      {order.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
