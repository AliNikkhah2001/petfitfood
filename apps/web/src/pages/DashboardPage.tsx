import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { formatToman } from "../data/catalog";
import {
  getAdminStats,
  getOrders,
  updateOrderStatus,
  type AdminStats,
  type ApiOrder,
  type OrderStatus,
} from "../lib/api";
import { useAuth } from "../lib/auth";

const STATUS_FA: Record<string, string> = {
  new: "جدید",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  cancelled: "لغو",
};

const STATUSES: OrderStatus[] = ["new", "confirmed", "shipped", "cancelled"];

export default function DashboardPage() {
  const { loading: authLoading, isAdmin, token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusBusy, setStatusBusy] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const [s, list] = await Promise.all([getAdminStats(), getOrders()]);
    setStats(s);
    setOrders(list);
  }, []);

  useEffect(() => {
    if (authLoading || !isAdmin) return;
    let cancelled = false;
    void reload()
      .catch(() => {
        /* keep empty */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAdmin, reload]);

  const onStatusChange = async (orderId: string, status: OrderStatus) => {
    setStatusBusy(orderId);
    try {
      await updateOrderStatus(orderId, status);
      await reload();
    } catch {
      /* ignore */
    } finally {
      setStatusBusy(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
        <p className="o-container text-sm text-neutral-500">در حال بارگذاری…</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login?next=/dashboard" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container--xl o-container">
        <Link to="/account" className="text-sm font-bold text-brand-indigo underline">
          حساب من
        </Link>
        <h1 className="mt-4 text-h-4xl text-brand-indigo">پنل مدیریت</h1>
        <p className="mt-2 text-sm text-neutral-600">آمار فروش، سفارش‌ها و برنامه‌ریزی خرید مواد اولیه.</p>

        {loading ? <p className="mt-10 text-sm text-neutral-500">در حال بارگذاری…</p> : null}

        {stats ? (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="سفارش‌ها" value={String(stats.orders_count)} />
              <StatCard label="فروش" value={formatToman(stats.revenue_toman)} />
              <StatCard label="هزینه مواد" value={formatToman(stats.spent_toman)} />
              <StatCard label="سود خالص" value={formatToman(stats.net_profit_toman)} highlight />
              <StatCard
                label="هزینه برنامه‌ریزی خرید مواد"
                value={formatToman(stats.ingredient_plan_spend_toman)}
              />
              <StatCard label="سفارش‌های باز" value={String(stats.open_orders_count)} />
            </div>

            <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="text-sm font-extrabold text-brand-indigo">خلاصه سود و هزینه</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <dt className="text-neutral-500">درآمد</dt>
                <dd className="font-bold sm:col-span-2">{formatToman(stats.revenue_toman)}</dd>
                <dt className="text-neutral-500">هزینه‌ها</dt>
                <dd className="font-bold sm:col-span-2">
                  {formatToman(stats.spent_toman + stats.ingredient_plan_spend_toman)}
                </dd>
                <dt className="text-neutral-500">سود خالص</dt>
                <dd className="font-extrabold text-brand-orange-hot sm:col-span-2">
                  {formatToman(stats.net_profit_toman)}
                </dd>
              </dl>
            </section>

            {stats.ingredient_plan.length > 0 ? (
              <section className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                <h2 className="border-b border-neutral-100 p-4 text-sm font-extrabold text-brand-indigo">
                  برنامه‌ریزی مواد اولیه
                </h2>
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-start text-xs font-bold text-brand-indigo">
                      <th className="p-3">ماده</th>
                      <th className="p-3">نیاز (kg)</th>
                      <th className="p-3">موجودی</th>
                      <th className="p-3">کسری</th>
                      <th className="p-3">هزینه خرید برنامه‌ریزی‌شده</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.ingredient_plan.map((row) => (
                      <tr key={row.slug} className="border-b border-neutral-50">
                        <td className="p-3 font-semibold">{row.name_fa}</td>
                        <td className="p-3" dir="ltr">
                          {row.need_kg.toFixed(2)}
                        </td>
                        <td className="p-3" dir="ltr">
                          {row.stock_kg.toFixed(2)}
                        </td>
                        <td className="p-3 font-bold text-brand-orange-hot" dir="ltr">
                          {row.shortfall_kg.toFixed(2)}
                        </td>
                        <td className="p-3 font-bold">{formatToman(row.planned_spend_toman)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : null}
          </>
        ) : null}

        {!loading && orders && orders.length > 0 ? (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <h2 className="border-b border-neutral-100 p-4 text-sm font-extrabold text-brand-indigo">
              همه سفارش‌ها
            </h2>
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-start text-xs font-bold text-brand-indigo">
                  <th className="p-4">شناسه</th>
                  <th className="p-4">مشتری</th>
                  <th className="p-4">شهر</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">مبلغ</th>
                  <th className="p-4">سود</th>
                  <th className="p-4">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-50">
                    <td className="p-4 font-mono text-xs" dir="ltr">
                      {order.id.slice(0, 8)}…
                    </td>
                    <td className="p-4">{order.customer_name}</td>
                    <td className="p-4">{order.city ?? "—"}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        disabled={statusBusy === order.id}
                        onChange={(e) => void onStatusChange(order.id, e.target.value as OrderStatus)}
                        className="rounded-lg border border-brand-indigo/20 px-2 py-1 text-xs font-semibold outline-none focus:border-brand-orange-hot"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_FA[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 font-bold">{formatToman(order.total_toman)}</td>
                    <td className="p-4 text-xs">
                      {order.profit_toman != null ? formatToman(order.profit_toman) : "—"}
                    </td>
                    <td className="p-4 text-xs text-neutral-500" dir="ltr">
                      {order.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loading && orders && orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <p className="text-sm font-semibold text-neutral-600">هنوز سفارشی ثبت نشده.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white p-5 ${
        highlight ? "ring-2 ring-brand-orange-hot/30" : ""
      }`}
    >
      <p className="text-xs font-bold text-neutral-500">{label}</p>
      <p className={`mt-2 text-lg font-extrabold ${highlight ? "text-brand-orange-hot" : "text-brand-indigo"}`}>
        {value}
      </p>
    </div>
  );
}
