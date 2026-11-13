import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CONTACT, telHref } from "../data/contact";
import Logo from "./Logo";
import { asset } from "../lib/asset";

const COLUMNS: {
  title: string;
  links: string[];
  hrefs: string[];
  route?: boolean;
}[] = [
  {
    title: "درباره‌ی پت‌فیت",
    links: ["داستان ما", "مواد اولیه", "منوی ۱۲ گانه", "تماس با ما"],
    hrefs: ["/about", "/#ingredients", "/shop", "/contact"],
    route: true,
  },
  {
    title: "محصولات",
    links: ["مرغ", "گوساله", "اشتراک‌ها", "فروشگاه"],
    hrefs: ["/product-category/chicken", "/product-category/beef", "/subscriptions", "/shop"],
    route: true,
  },
  {
    title: "راهنما",
    links: ["پرسش‌های متداول", "مجله", "راهنمای تغذیه", "خبرنامه"],
    hrefs: ["/faq", "/magazine", "/#how-its-made", "#newsletter"],
    route: true,
  },
  {
    title: "ارتباط",
    links: [CONTACT.instagram, CONTACT.phoneMobile, "ایمیل", "وب‌سایت"],
    hrefs: [
      CONTACT.instagramUrl,
      telHref(CONTACT.phoneMobile),
      `mailto:${CONTACT.email}`,
      CONTACT.website,
    ],
  },
];

const SOCIALS = [
  {
    label: "اینستاگرام",
    href: CONTACT.instagramUrl,
    path: "M4 4h12v12H4z M10 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z M14.6 5.5h.01",
  },
  {
    label: "یوتیوب",
    href: CONTACT.youtubeUrl,
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
        <div className="pt-10">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <img
              src={asset("brand/petfit-catdog-friends.jpg")}
              alt=""
              className="h-[140px] w-full object-cover object-center sm:h-[180px] md:h-[220px]"
              draggable={false}
            />
          </div>
        </div>

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
                  {column.links.map((link, index) => {
                    const href = column.hrefs[index];
                    const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
                    const isHash = href.startsWith("#");
                    const isRoute = column.route && !external && !isHash;
                    const className =
                      "text-xs leading-6 font-medium text-white/75 transition-colors hover:text-white hover:underline hover:underline-offset-2";
                    return (
                      <li key={link} className="break-words">
                        {isRoute ? (
                          <Link to={href} className={className}>
                            {link}
                          </Link>
                        ) : (
                          <a
                            href={href}
                            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                            className={className}
                          >
                            {link}
                          </a>
                        )}
                      </li>
                    );
                  })}
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
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
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
              ["فروشگاه", "/shop"],
              ["اشتراک‌ها", "/subscriptions"],
              ["مجله", "/magazine"],
              ["تماس", "/contact"],
              ["مواد اولیه", "/#ingredients"],
            ].map(([label, href]) =>
              href.startsWith("/#") ? (
                <a
                  key={label}
                  href={href}
                  className="text-xs font-semibold text-white/75 transition-colors hover:text-white"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={href}
                  className="text-xs font-semibold text-white/75 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 py-6 text-[11px] text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© ۱۴۰۵ پت‌فیت. تمامی حقوق محفوظ است.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {[
              ["حریم خصوصی", "/privacy"],
              ["شرایط استفاده", "/terms"],
              ["دسترس‌پذیری", "#top"],
              ["نقشه‌ی سایت", "/subscriptions"],
            ].map(([link, href]) =>
              href.startsWith("/") ? (
                <Link key={link} to={href} className="font-medium transition-colors hover:text-white">
                  {link}
                </Link>
              ) : (
                <a key={link} href={href} className="font-medium transition-colors hover:text-white">
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
