import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDocuments, resolveImageUrl } from "../../../services/crudServices";
import { DATABASE_ID, BLOG_COLLECTION_ID } from "../../../config/appwrite";
import { Seo } from "../../../components/seo/Seo";
import { pickLocalized } from "../../../i18n/pickLocalized";
import { useLangPath } from "../../../i18n/useLangPath";
import "./blogPublic.css";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { t, i18n } = useTranslation();
  const langPath = useLangPath();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    const load = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, BLOG_COLLECTION_ID);
        const found = docs.find(
          (doc) => doc.published && (doc.slug === slug || doc.$id === slug)
        );
        if (found) {
          setPost(found);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return <div className="blog-public container"><p>{t("common.loading")}</p></div>;
  }

  if (notFound || !post) {
    return (
      <div className="blog-public container">
        <Seo title={t("blogPage.notFoundTitle")} path={`/blog/${slug}`} noindex />
        <div className="blog-public__not-found">
          <h1>{t("blogPage.notFoundTitle")}</h1>
          <p>{t("blogPage.notFoundText")}</p>
          <Link to={langPath("/blog")}>{t("common.backToBlog")}</Link>
        </div>
      </div>
    );
  }

  const title = pickLocalized(post, "title", i18n.language);
  const excerpt = pickLocalized(post, "excerpt", i18n.language);
  const content = pickLocalized(post, "content", i18n.language);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    image: post.coverImage ? resolveImageUrl(post.coverImage) : undefined,
  };

  return (
    <div className="blog-public container">
      <Seo
        title={title}
        description={excerpt}
        path={`/blog/${post.slug || post.$id}`}
        image={post.coverImage ? resolveImageUrl(post.coverImage) : undefined}
        type="article"
        jsonLd={articleJsonLd}
      />

      <article className="blog-post">
        <Link to={langPath("/blog")} className="blog-post__back">
          &larr; {t("common.backToBlog")}
        </Link>

        {post.coverImage && (
          <div className="blog-post__cover">
            <img src={resolveImageUrl(post.coverImage)} alt={title} />
          </div>
        )}

        {post.category && <span className="blog-public__category">{post.category}</span>}
        <h1>{title}</h1>
        {post.author && <p className="blog-post__meta">{t("blogPage.by")} {post.author}</p>}

        <div className="blog-post__content">
          {content.split("\n").map((paragraph, index) =>
            paragraph.trim() ? <p key={index}>{paragraph}</p> : null
          )}
        </div>
      </article>
    </div>
  );
}
