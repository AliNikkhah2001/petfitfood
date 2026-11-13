import { Link } from "react-router-dom";
import { SUBSCRIPTION_PATHWAYS } from "../data/subscriptions";

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container--xl o-container">
        <p className="eyebrow">اشتراک و پک‌ها</p>
        <h1 className="mt-2 text-h-4xl text-brand-indigo md:text-h-5xl">مسیر مناسب پت شما</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
          از پک آشنایی شروع کنید یا مستقیم برنامهٔ ۷ یا ۱۴ روزه را انتخاب کنید. برای نیاز خاص، مسیر اختصاصی را
          بزنید.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SUBSCRIPTION_PATHWAYS.map((path) => (
            <article
              key={path.id}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-brand-indigo/30"
            >
              <p className="text-xs font-bold text-brand-orange-hot">{path.subtitle}</p>
              <h2 className="mt-1 text-xl font-extrabold text-brand-indigo">{path.titleFa}</h2>
              <p className="mt-2 text-sm leading-7 text-neutral-600">{path.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-neutral-700">
                {path.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-brand-orange-hot">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={path.ctaTo}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-brand-orange-hot text-sm font-extrabold text-white hover:bg-primary-600"
              >
                {path.ctaLabel}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-indigo px-6 py-8 text-white">
          <h2 className="text-lg font-extrabold">هنوز مطمئن نیستید؟</h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-white/85">
            منوی کامل ۱۲ گونه را در فروشگاه ببینید یا با تیم ما برای انتخاب پروتئین و وزن صحبت کنید.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/shop" className="rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-brand-indigo">
              همه محصولات
            </Link>
            <Link to="/faq" className="rounded-2xl border border-white/40 px-5 py-2.5 text-sm font-bold text-white">
              پرسش‌های متداول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
