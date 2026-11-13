import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/auth";

type Step = "phone" | "code";

export default function LoginPage() {
  const { requestOtpCode, loginViaOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requireName = searchParams.get("mode") === "register";
  const nextPath = searchParams.get("next") ?? "/account";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [showNameField, setShowNameField] = useState(requireName);
  const [code, setCode] = useState("");
  const [debugCode, setDebugCode] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const normalizedPhone = phone.replace(/\D/g, "").slice(0, 11);

  const sendOtp = async (event: FormEvent) => {
    event.preventDefault();
    if (normalizedPhone.length < 10) {
      setError("شماره موبایل معتبر وارد کنید.");
      return;
    }
    if (requireName && name.trim().length < 2) {
      setError("نام را وارد کنید.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const hint = await requestOtpCode(normalizedPhone);
      setDebugCode(hint.debug_code);
      setStep("code");
    } catch {
      setError("ارسال کد ناموفق بود. دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (code.replace(/\D/g, "").length < 4) {
      setError("کد تأیید را وارد کنید.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await loginViaOtp(
        normalizedPhone,
        code.trim(),
        requireName || name.trim() ? name.trim() : undefined,
      );
      navigate(nextPath, { replace: true });
    } catch {
      setError("کد نامعتبر است یا منقضی شده.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-md">
        <h1 className="text-h-4xl text-brand-indigo">{requireName ? "ثبت‌نام" : "ورود"}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {step === "phone"
            ? "شماره موبایل خود را وارد کنید؛ کد یک‌بارمصرف برایتان ارسال می‌شود."
            : "کد ارسال‌شده را وارد کنید."}
        </p>

        {step === "phone" ? (
          <form
            className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"
            onSubmit={(e) => void sendOtp(e)}
          >
            {showNameField ? (
              <label className="block">
                <span className="text-xs font-bold text-brand-indigo">نام{requireName ? " (الزامی)" : ""}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
                />
              </label>
            ) : (
              <button
                type="button"
                className="text-xs font-bold text-brand-orange-hot underline"
                onClick={() => setShowNameField(true)}
              >
                افزودن نام (اختیاری)
              </button>
            )}
            <label className="block">
              <span className="text-xs font-bold text-brand-indigo">موبایل</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-sm font-semibold outline-none focus:border-brand-orange-hot"
                placeholder="09xxxxxxxxx"
                dir="ltr"
                inputMode="tel"
              />
            </label>
            {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-2xl bg-brand-indigo text-sm font-extrabold text-white hover:bg-brand-indigo/90 disabled:opacity-60"
            >
              {submitting ? "در حال ارسال…" : "دریافت کد"}
            </button>
          </form>
        ) : (
          <form
            className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5"
            onSubmit={(e) => void verify(e)}
          >
            <p className="text-xs text-neutral-500">
              کد برای <span dir="ltr">{normalizedPhone}</span> ارسال شد.
              {debugCode ? (
                <span className="mt-1 block font-mono text-brand-orange-hot" dir="ltr">
                  کد آزمایشی: {debugCode}
                </span>
              ) : null}
            </p>
            <label className="block">
              <span className="text-xs font-bold text-brand-indigo">کد تأیید</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1 h-11 w-full rounded-xl border-2 border-brand-indigo/15 px-3 text-center text-lg font-bold tracking-widest outline-none focus:border-brand-orange-hot"
                dir="ltr"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </label>
            {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-2xl bg-brand-orange-hot text-sm font-extrabold text-white hover:bg-primary-600 disabled:opacity-60"
            >
              {submitting ? "در حال تأیید…" : "ورود"}
            </button>
            <button
              type="button"
              className="w-full text-center text-xs font-bold text-brand-indigo underline"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError("");
              }}
            >
              تغییر شماره
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-neutral-600">
          {requireName ? (
            <>
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <Link to="/login" className="font-bold text-brand-orange-hot underline">
                ورود
              </Link>
            </>
          ) : (
            <>
              حساب ندارید؟{" "}
              <Link to="/login?mode=register" className="font-bold text-brand-orange-hot underline">
                ثبت‌نام
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
