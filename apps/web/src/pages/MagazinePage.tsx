import { Link } from "react-router-dom";
import { MAGAZINE_ARTICLES } from "../data/magazine";

export default function MagazinePage() {
  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container--xl o-container">
        <p className="eyebrow">مجله</p>
        <h1 className="mt-2 text-h-4xl text-brand-indigo md:text-h-5xl">نکته‌های تغذیه و پشت صحنه</h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-600">مقالات کوتاه برای انتخاب بهتر وعده و نگهداری درست.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {MAGAZINE_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              to={`/magazine/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-brand-indigo/30"
            >
              <div className="aspect-[16/10] overflow-hidden bg-secondary-light-beige">
                <img
                  src={article.cover}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <time className="text-[11px] font-bold text-neutral-500">{article.publishedAt}</time>
                <h2 className="mt-2 text-base font-extrabold text-brand-indigo group-hover:text-brand-orange-hot">
                  {article.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-7 text-neutral-600">{article.excerpt}</p>
                <span className="mt-4 text-xs font-bold text-brand-indigo">ادامه مطلب ←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
