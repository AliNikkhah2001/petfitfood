import { useEffect, useState, type ReactNode } from "react";
import { getPages, type ApiPage } from "../lib/api";

type Props = {
  slug: string;
  fallback: ReactNode;
};

/** Renders a Wagtail ContentPage body when the API is available. */
export default function CmsPageView({ slug, fallback }: Props) {
  const [page, setPage] = useState<ApiPage | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void getPages()
      .then((pages) => {
        if (cancelled) return;
        setPage(pages.find((p) => p.slug === slug || p.page_kind === slug) ?? null);
      })
      .catch(() => {
        if (!cancelled) setPage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (page === undefined) {
    return (
      <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
        <div className="o-container mx-auto max-w-2xl">
          <p className="text-sm text-neutral-500">در حال بارگذاری…</p>
        </div>
      </div>
    );
  }

  if (!page?.body) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-2xl">
        <h1 className="text-h-4xl text-brand-indigo">{page.title}</h1>
        <div
          className="prose-petfit mt-6 space-y-4 text-sm leading-8 text-neutral-700 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-extrabold [&_h3]:text-brand-indigo [&_p]:leading-8"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </div>
    </div>
  );
}
