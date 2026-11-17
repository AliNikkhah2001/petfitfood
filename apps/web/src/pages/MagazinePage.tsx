import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MAGAZINE_ARTICLES, type MagazineArticle } from "../data/magazine";
import { getPosts } from "../lib/api";
import { mediaUrl } from "../lib/media";

function toArticle(post: {
  slug: string;
  title: string;
  excerpt?: string;
  published_at?: string;
  cover?: string;
  body?: string;
}): MagazineArticle {
  const plain = (post.body || "")
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    publishedAt: post.published_at || "",
    cover: mediaUrl(post.cover) || post.cover || "",
    body: plain.length ? plain : [post.excerpt || ""],
  };
}

export default function MagazinePage() {
  const [articles, setArticles] = useState<MagazineArticle[]>(MAGAZINE_ARTICLES);

  useEffect(() => {
    void getPosts().then((posts) => {
      if (posts.length) setArticles(posts.map(toArticle));
    });
  }, []);

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container--xl o-container">
        <p className="eyebrow">مجله</p>
        <h1 className="mt-2 text-h-4xl text-brand-indigo md:text-h-5xl">نکته‌های تغذیه و پشت صحنه</h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-600">مقالات از پنل Wagtail (Pages → مجله).</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
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
