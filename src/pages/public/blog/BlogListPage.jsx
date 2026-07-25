import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDocuments, resolveImageUrl } from "../../../services/crudServices";
import { DATABASE_ID, BLOG_COLLECTION_ID } from "../../../config/appwrite";
import { Seo } from "../../../components/seo/Seo";
import { pickLocalized } from "../../../i18n/pickLocalized";
import { useLangPath } from "../../../i18n/useLangPath";
import "./blogPublic.css";

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const langPath = useLangPath();

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, BLOG_COLLECTION_ID);
        setPosts(docs.filter((post) => post.published));
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="blog-public container">
      <Seo
        title={t("blogPage.title")}
        description="Actualites, conseils et coulisses d'OpenTek : retrouvez tous nos articles."
        path="/blog"
      />

      <div className="ot-section-header">
        <span className="ot-eyebrow">{t("blogPage.eyebrow")}</span>
        <h1 className="ot-section-title">{t("blogPage.title")}</h1>
        <p className="ot-section-subtitle">{t("blogPage.subtitle")}</p>
      </div>

      {loading && <p className="blog-public__status">{t("blogPage.loading")}</p>}

      {!loading && posts.length === 0 && (
        <p className="blog-public__status">{t("blogPage.empty")}</p>
      )}

      <div className="ot-grid">
        {posts.map((post) => (
          <Link
            to={langPath(`/blog/${post.slug || post.$id}`)}
            className="ot-card ot-card--hoverable blog-public__card"
            key={post.$id}
          >
            <div className="ot-image-frame ot-image-frame--16-10">
              {post.coverImage ? (
                <img
                  src={resolveImageUrl(post.coverImage)}
                  alt={pickLocalized(post, 'title', i18n.language)}
                  loading="lazy"
                />
              ) : (
                <div className="ot-image-frame--placeholder">OpenTek</div>
              )}
            </div>
            <div className="ot-card__body">
              {post.category && <span className="ot-badge">{post.category}</span>}
              <h3 className="blog-public__card-title">{pickLocalized(post, 'title', i18n.language)}</h3>
              <p className="ot-clamp-3 blog-public__card-excerpt">{pickLocalized(post, 'excerpt', i18n.language)}</p>
              {post.author && (
                <span className="blog-public__author">{t("blogPage.by")} {post.author}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
