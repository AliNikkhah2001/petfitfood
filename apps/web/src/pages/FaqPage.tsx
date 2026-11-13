import { useState } from "react";
import { Link } from "react-router-dom";
import { FAQ_ITEMS } from "../data/faq";

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-2xl">
        <p className="eyebrow">راهنما</p>
        <h1 className="mt-2 text-h-4xl text-brand-indigo">پرسش‌های متداول</h1>
        <p className="mt-2 text-sm text-neutral-600">پاسخ کوتاه به رایج‌ترین سوالات درباره سفارش و نگهداری.</p>

        <ul className="mt-8 space-y-3">
          {FAQ_ITEMS.map((item) => {
            const open = openId === item.id;
            return (
              <li key={item.id} className="rounded-2xl border border-neutral-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start"
                >
                  <span className="text-sm font-extrabold text-brand-indigo">{item.question}</span>
                  <span className="text-lg text-neutral-400">{open ? "−" : "+"}</span>
                </button>
                {open ? (
                  <p className="border-t border-neutral-100 px-5 py-4 text-sm leading-7 text-neutral-600">
                    {item.answer}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-neutral-600">
          سوال دیگری دارید؟{" "}
          <Link to="/contact" className="font-bold text-brand-orange-hot underline">
            با ما تماس بگیرید
          </Link>
        </p>
      </div>
    </div>
  );
}
