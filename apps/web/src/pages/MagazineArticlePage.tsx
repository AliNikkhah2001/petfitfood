import { Link, useParams } from "react-router-dom";
import { getArticleBySlug } from "../data/magazine";

export default function MagazineArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <div className="o-container py-20 text-center">
        <h1 className="text-xl font-extrabold text-brand-indigo">مقاله یافت نشد</h1>
        <Link to="/magazine" className="mt-4 inline-flex a-button">
          بازگشت به مجله
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-2xl">
        <Link to="/magazine" className="text-sm font-bold text-brand-indigo underline">
          همه مقالات
        </Link>
        <time className="mt-4 block text-xs font-bold text-neutral-500">{article.publishedAt}</time>
        <h1 className="mt-2 text-h-4xl text-brand-indigo">{article.title}</h1>
        <p className="mt-3 text-sm leading-7 text-neutral-600">{article.excerpt}</p>

        <div className="mt-8 overflow-hidden rounded-2xl">
          <img src={article.cover} alt="" className="w-full object-cover" />
        </div>

        <div className="prose-petfit mt-8 space-y-4 text-sm leading-8 text-neutral-700">
          {article.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        <Link to="/subscriptions" className="mt-10 inline-flex a-button">
          شروع اشتراک
        </Link>
      </div>
    </article>
  );
}
