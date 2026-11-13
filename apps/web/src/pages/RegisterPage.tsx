import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-md">
        <h1 className="text-h-4xl text-brand-indigo">ثبت‌نام</h1>
        <p className="mt-2 text-sm text-neutral-600">ساخت حساب کاربری در فاز بعدی فعال می‌شود.</p>

        <form className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">نام</span>
            <input className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot" />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">موبایل</span>
            <input
              dir="ltr"
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          <button
            type="submit"
            disabled
            className="h-11 w-full rounded-2xl bg-brand-indigo/40 text-sm font-extrabold text-white"
          >
            ایجاد حساب (به‌زودی)
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-600">
          <Link to="/login" className="font-bold text-brand-orange-hot underline">
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </div>
  );
}
