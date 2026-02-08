import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/RecentBlog.css";

const BLOG_URL = "http://localhost:4000/blogposts";

function normalizeImg(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `http://localhost:4000${path}`;
  return `http://localhost:4000/${path}`;
}

function getExcerpt(post) {
  const raw = post?.content || post?.text || "";
  return String(raw).trim();
}

export default function RecentBlog() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");

        const res = await fetch(BLOG_URL, { signal: controller.signal });
        if (!res.ok) throw new Error("Bad response");

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        const sorted = [...arr].sort((a, b) => Number(b.id) - Number(a.id));
        setItems(sorted.slice(0, 3));
        setStatus("ready");
      } catch (err) {
        if (err.name === "AbortError") return;
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <section className="recentBlogSection">
      <div className="recentBlogInner">
        <h2 className="recentBlogHeadline">RECENT BLOG</h2>

        <img
          src="/assets/bottom_line2.png"
          alt=""
          className="recentBlogBottomLine"
        />

        {status === "loading" && (
          <div className="recentBlogFallback">Loading blog posts…</div>
        )}

        {status === "error" && (
          <div className="recentBlogFallback recentBlogFallbackError">
            Could not load blog posts. Is the API running on localhost:4000?
          </div>
        )}

        {status === "ready" && (
          <div className="recentBlogGrid" aria-label="Recent blog posts">
            {items.map((post) => {
              const img = normalizeImg(
                post?.asset?.url || post?.img || post?.image,
              );
              const title = post?.title || "Blog post";
              const excerpt = getExcerpt(post);
              const author = post?.author || "Admin";

              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="recentBlogCard"
                >
                  <div className="recentBlogImgWrap">
                    {img ? <img src={img} alt={title} /> : null}
                  </div>

                  <h3 className="recentBlogTitle">{title}</h3>

                  <p className="recentBlogMeta">
                    <span className="recentBlogMetaPink">BY:</span> {author}
                    <span className="recentBlogMetaSep"> / </span>
                    <span className="recentBlogMetaPink">Posted</span>
                  </p>

                  <p className="recentBlogExcerpt">{excerpt}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
