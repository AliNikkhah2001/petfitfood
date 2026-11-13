import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-secondary-off-white px-4 py-20 text-center">
      <p className="text-6xl font-extrabold text-brand-indigo/30">۴۰۴</p>
      <h1 className="mt-4 text-2xl font-extrabold text-brand-indigo">صفحه پیدا نشد</h1>
      <p className="mt-2 max-w-md text-sm leading-7 text-neutral-600">
        آدرس را بررسی کنید یا از منوی بالا به بخش مورد نظر بروید.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="a-button">
          صفحهٔ اصلی
        </Link>
        <Link to="/shop" className="rounded-2xl border border-brand-indigo px-5 py-2.5 text-sm font-bold text-brand-indigo">
          فروشگاه
        </Link>
      </div>
    </div>
  );
}
