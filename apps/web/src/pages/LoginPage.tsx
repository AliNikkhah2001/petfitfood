import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-md">
        <h1 className="text-h-4xl text-brand-indigo">ورود</h1>
        <p className="mt-2 text-sm text-neutral-600">ورود به حساب به‌زودی فعال می‌شود (فاز بعدی).</p>

        <form className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">موبایل یا ایمیل</span>
            <input
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
              placeholder="09xxxxxxxxx"
              dir="ltr"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-brand-indigo">رمز عبور</span>
            <input
              type="password"
              className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
            />
          </label>
          <button
            type="submit"
            disabled
            className="h-11 w-full rounded-2xl bg-brand-indigo/40 text-sm font-extrabold text-white"
          >
            ورود (به‌زودی)
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-600">
          حساب ندارید؟{" "}
          <Link to="/register" className="font-bold text-brand-orange-hot underline">
            ثبت‌نام
          </Link>
        </p>
      </div>
    </div>
  );
}
