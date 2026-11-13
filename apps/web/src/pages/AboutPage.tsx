import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-3xl">
        <p className="eyebrow">داستان ما</p>
        <h1 className="mt-2 text-h-4xl text-brand-indigo md:text-h-5xl">پت‌فیت از آشپزخانه شروع شد</h1>
        <p className="mt-4 text-sm leading-8 text-neutral-700">
          ما باور داریم غذای خانگی‌مانند باید استاندارد، تازه و قابل اعتماد باشد — نه فقط برای انسان‌ها، بلکه برای
          عضوان خانوادهٔ پُرمو که هر روز کنار ما هستند.
        </p>
        <p className="mt-4 text-sm leading-8 text-neutral-700">
          تیم پت‌فیت مواد اولیه را با دقت انتخاب می‌کند، وعده‌ها را در مقیاس کنترل‌شده آماده می‌کند و با بسته‌بندی
          مناسب به دست شما می‌رساند. هدف ما ساده است: یک کاسهٔ تازه‌تر، هر روز.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200">
          <img
            src="/brand/petfit-catdog-friends.jpg"
            alt="همراهان پت‌فیت"
            className="max-h-72 w-full object-cover"
          />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["۱۲+", "فرمول وعده"],
            ["Fresh Pack", "بسته‌بندی"],
            ["تهران", "ارسال هماهنگ"],
          ].map(([stat, label]) => (
            <div key={label} className="rounded-2xl bg-white p-5 text-center ring-1 ring-neutral-200">
              <p className="text-2xl font-extrabold text-brand-orange-hot">{stat}</p>
              <p className="mt-1 text-xs font-bold text-brand-indigo">{label}</p>
            </div>
          ))}
        </div>

        <Link to="/shop" className="mt-10 inline-flex a-button">
          دیدن منوی خرید
        </Link>
      </div>
    </div>
  );
}
