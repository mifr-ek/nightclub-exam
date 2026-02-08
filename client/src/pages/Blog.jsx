import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/Blog.css";
import footerbg from "../assets/bg/footerbg.jpg";

const API_URL = "http://localhost:4000/blogposts";
const PER_PAGE = 3;

function normalizeImg(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `http://localhost:4000${path}`;
  return `http://localhost:4000/${path}`;
}

function getTitle(post) {
  return (
    post?.title ||
    post?.headline ||
    post?.name ||
    post?.heading ||
    post?.header ||
    "Untitled post"
  );
}

function getExcerpt(post) {
  const text =
    post?.content || post?.text || post?.body || post?.description || "";
  return String(text).trim();
}

function formatMeta(post) {
  const date = post?.date
    ? new Date(post.date).toLocaleDateString("da-DK")
    : "";
  return date || "Posted";
}

function BlogTextCell({ post }) {
  const title = getTitle(post);
  const meta = formatMeta(post);
  const excerpt = getExcerpt(post);

  return (
    <div className="blogCell blogCellText">
      <div className="blogTextPanel">
        <h3 className="blogTitle">{title}</h3>
        <p className="blogMeta">{meta}</p>

        <p className="blogExcerpt">{excerpt}</p>

        <div className="blogBtnRow">
          <Link className="blogBtn" to={`/blog/${post.id}`}>
            READ MORE
          </Link>
        </div>
      </div>
    </div>
  );
}

function BlogImageCell({ post }) {
  const title = getTitle(post);
  const img = normalizeImg(post?.asset?.url || post?.img || post?.image);

  return (
    <div className="blogCell blogCellImg">
      <Link className="blogImgLink" to={`/blog/${post.id}`}>
        {img ? <img className="blogImg" src={img} alt={title} /> : null}
      </Link>
    </div>
  );
}

export default function Blog() {
  const { page } = useParams();

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  const pageNum = Number(page || 1);
  const safePage = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error("bad response");

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        const sorted = [...arr].sort((a, b) => Number(b.id) - Number(a.id));
        setItems(sorted);
        setStatus("ready");
      } catch (err) {
        if (err.name === "AbortError") return;
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE;
    return items.slice(start, start + PER_PAGE);
  }, [items, safePage]);

  return (
    <main className="blogPage">
      <header
        className="blogHero"
        style={{ backgroundImage: `url(${footerbg})` }}
      >
        <div className="blogHeroOverlay" />
        <div className="blogHeroInner">
          <h1 className="blogHeroTitle">BLOG</h1>
          <img
            src="/assets/bottom_line2.png"
            alt=""
            className="blogHeroBottomLine"
          />
        </div>
      </header>

      <div className="blogInner">
        {status === "loading" && (
          <div className="formMessage">Loader blogindlæg…</div>
        )}

        {status === "error" && (
          <div className="formMessage isError">
            Vi kunne ikke hente blogindlæg lige nu. Tjek at API’et kører på
            localhost:4000.
          </div>
        )}

        {status === "ready" && (
          <>
            <section className="blogGrid" aria-label="Blog posts">
              {pageItems.map((post, index) => {
                const imageFirst = index % 2 === 0;

                return (
                  <article className="blogRow" key={post.id}>
                    {imageFirst ? (
                      <>
                        <BlogImageCell post={post} />
                        <BlogTextCell post={post} />
                      </>
                    ) : (
                      <>
                        <BlogTextCell post={post} />
                        <BlogImageCell post={post} />
                      </>
                    )}
                  </article>
                );
              })}
            </section>

            <div className="blogPagination">
              <div className="blogPager">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const to = p === 1 ? "/blog" : `/blog/page/${p}`;

                  return (
                    <Link
                      key={p}
                      to={to}
                      className={
                        p === safePage
                          ? "blogPageLink isActive"
                          : "blogPageLink"
                      }
                      aria-label={`Gå til side ${p}`}
                    >
                      {p}
                    </Link>
                  );
                })}

                {safePage < totalPages && (
                  <Link
                    to={`/blog/page/${safePage + 1}`}
                    className="blogNextLink"
                  >
                    næste &gt;
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
