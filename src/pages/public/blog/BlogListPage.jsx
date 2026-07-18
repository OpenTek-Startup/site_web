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
      <div className="blog-public__header">
        <h1>{t("blogPage.title")}</h1>
        <p>{t("blogPage.subtitle")}</p>
      </div>

      {loading && <p>{t("blogPage.loading")}</p>}

      {!loading && posts.length === 0 && (
        <p className="blog-public__empty">{t("blogPage.empty")}</p>
      )}

      <div className="blog-public__grid">
        {posts.map((post) => (
          <Link
            to={langPath(`/blog/${post.slug || post.$id}`)}
            className="blog-public__card"
            key={post.$id}
          >
            {post.coverImage && (
              <div className="blog-public__image-wrapper">
                <img src={resolveImageUrl(post.coverImage)} alt={pickLocalized(post, 'title', i18n.language)} />
              </div>
            )}
            <div className="blog-public__content">
              {post.category && (
                <span className="blog-public__category">{post.category}</span>
              )}
              <h3>{pickLocalized(post, 'title', i18n.language)}</h3>
              <p>{pickLocalized(post, 'excerpt', i18n.language)}</p>
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
