import { useState, type FormEvent } from "react";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "درباره‌ی پت‌فیت",
    links: ["داستان ما", "مواد اولیه", "تغذیه‌ی مسئولانه", "ارتباط با ما"],
    hrefs: ["#planet", "#ingredients", "#planet", "#find-store"],
  },
  {
    title: "برای همراهان",
    links: ["محصولات", "پیدا کردن فروشگاه", "راهنمای تغذیه", "پرسش‌های پرتکرار"],
    hrefs: ["#our-brands", "#find-store", "#how-its-made", "#reviews"],
  },
  {
    title: "برای دوست‌های پشمالو",
    links: ["غذای سگ", "غذای گربه", "مواد اولیه", "نظر همراهان"],
    hrefs: ["#our-brands", "#our-brands", "#ingredients", "#reviews"],
  },
  {
    title: "همراهی با ما",
    links: ["شبکه‌های اجتماعی", "پیشنهادها", "پشتیبانی", "فروشگاه‌یاب"],
    hrefs: ["#social", "#newsletter", "#find-store", "#find-store"],
  },
];

const SOCIALS = [
  {
    label: "اینستاگرام",
    path: "M4 4h12v12H4z M10 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z M14.6 5.5h.01",
  },
  {
    label: "فیسبوک",
    path: "M11.5 17v-5h1.8l.3-2h-2.1V8.6c0-.6.2-1 .9-1H14V5.9c-.2 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 2.8V10H7.5v2h2V17",
  },
  {
    label: "تیک‌تاک",
    path: "M12 4v8.2a2.3 2.3 0 1 1-2.3-2.3M12 4c.3 2 1.8 3.4 3.7 3.5",
  },
  {
    label: "یوتیوب",
    path: "M3.5 7.5c0-1 .8-1.8 1.8-1.9 3-.1 6.4-.1 9.4 0 1 .1 1.8.9 1.8 1.9v5c0 1-.8 1.8-1.8 1.9-3 .1-6.4.1-9.4 0a1.9 1.9 0 0 1-1.8-1.9v-5Z M8.5 7.7l3.8 2.3-3.8 2.3V7.7Z",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <footer className="bg-primary-700 text-white">
      <div className="o-container--xl o-container">
        <div className="grid gap-10 border-b border-white/15 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="max-w-[540px]">
            <a href="#top" aria-label="صفحه‌ی نخست پت‌فیت" className="inline-flex">
              <Logo className="text-[38px]" color="#ffffff" />
            </a>
            <h2 className="mt-5 text-h-3xl leading-[1.45] text-white md:text-h-4xl">
              هر روز، یک کاسه‌ی تازه‌تر.
            </h2>
            <p className="mt-3 text-sm leading-7 font-medium text-white/75">
              برای دریافت نکته‌های نگهداری، آشنایی با مواد اولیه و تازه‌ترین
              خبرهای پت‌فیت، به جمع همراهان ما بپیوندید.
            </p>
            <form
              id="newsletter"
              onSubmit={subscribe}
              noValidate
              className="mt-5 max-w-[440px]"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  نشانی ایمیل
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setStatus("idle");
                  }}
                  placeholder="name@example.com"
                  className="h-[46px] w-full rounded-full border border-white/25 bg-white/10 px-5 text-left text-sm font-medium text-white outline-none placeholder:text-white/55 focus:border-white/70"
                />
                <button
                  type="submit"
                  className="h-[46px] shrink-0 rounded-full bg-white px-6 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100"
                >
                  عضویت
                </button>
              </div>
              <p
                className={`mt-2 min-h-4 text-xs font-semibold ${
                  status === "error" ? "text-[#ffd9c2]" : "text-secondary-light-leaf"
                }`}
                role="status"
              >
                {status === "error" && "لطفاً یک نشانی ایمیل معتبر وارد کنید."}
                {status === "success" &&
                  "عضویت شما ثبت شد؛ به جمع همراهان پت‌فیت خوش آمدید."}
              </p>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:pt-2">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-bold text-primary-200">
                  {column.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link, index) => (
                    <li key={link} className="break-words">
                      <a
                        href={column.hrefs[index]}
                        className="text-xs leading-6 font-medium text-white/75 transition-colors hover:text-white hover:underline hover:underline-offset-2"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          id="social"
          className="flex flex-col gap-6 border-b border-white/15 py-8 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-xs font-bold text-primary-200">ما را دنبال کنید</p>
            <div className="mt-3 flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#top"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/85 transition-colors hover:border-white hover:bg-white hover:text-primary-700"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d={social.path}
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["فروشگاه‌یاب", "#find-store"],
              ["مواد اولیه", "#ingredients"],
              ["نظر همراهان", "#reviews"],
              ["محصولات", "#our-brands"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-xs font-semibold text-white/75 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 py-6 text-[11px] text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© ۱۴۰۵ پت‌فیت. تمامی حقوق محفوظ است.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {["حریم خصوصی", "شرایط استفاده", "دسترس‌پذیری", "نقشه‌ی سایت"].map(
              (link) => (
                <a
                  key={link}
                  href="#top"
                  className="font-medium transition-colors hover:text-white"
                >
                  {link}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
