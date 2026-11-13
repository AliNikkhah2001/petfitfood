import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";

export default function AccountPage() {
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-lg">
        <h1 className="text-h-4xl text-brand-indigo">حساب من</h1>
        <p className="mt-2 text-sm text-neutral-600">ناحیهٔ کاربری — نسخهٔ نمایشی بدون احراز هویت واقعی.</p>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-extrabold text-brand-indigo">خلاصه</h2>
            <p className="mt-2 text-sm text-neutral-600">{itemCount} قلم در سبد فعلی</p>
            <Link to="/cart" className="mt-3 inline-block text-sm font-bold text-brand-orange-hot underline">
              مشاهده سبد
            </Link>
          </div>

          <nav className="rounded-2xl border border-neutral-200 bg-white p-5" aria-label="منوی حساب">
            <ul className="space-y-3 text-sm font-semibold text-neutral-700">
              <li>
                <Link to="/login" className="hover:text-brand-indigo">
                  ورود
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-indigo">
                  ثبت‌نام
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-indigo">
                  پنل فروشنده (نمایشی)
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-brand-indigo">
                  اشتراک‌های من
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
