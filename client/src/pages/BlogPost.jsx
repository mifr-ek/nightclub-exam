import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/BlogPost.css";
import footerbg from "../assets/bg/footerbg.jpg";

const BLOG_URL = "http://localhost:4000/blogposts";
const COMMENTS_URL = "http://localhost:4000/comments";

function normalizeImg(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `http://localhost:4000${path}`;
  return `http://localhost:4000/${path}`;
}

function splitParagraphs(text) {
  const cleaned = String(text || "").trim();
  if (!cleaned) return [];
  const parts = cleaned.includes("\n\n") ? cleaned.split("\n\n") : [cleaned];
  return parts.map((p) => p.trim()).filter(Boolean);
}

export default function BlogPost() {
  const { slug } = useParams();
  const postId = Number(slug);

  const [post, setPost] = useState(null);
  const [postStatus, setPostStatus] = useState("loading");

  const [comments, setComments] = useState([]);
  const [commentsStatus, setCommentsStatus] = useState("loading");

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!Number.isFinite(postId)) {
      setPostStatus("error");
      return;
    }

    const controller = new AbortController();

    async function loadPost() {
      try {
        setPostStatus("loading");
        const res = await fetch(`${BLOG_URL}/${postId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("bad response");

        const data = await res.json();
        setPost(data);
        setPostStatus("ready");
      } catch (err) {
        if (err.name === "AbortError") return;
        setPostStatus("error");
      }
    }

    loadPost();
    return () => controller.abort();
  }, [postId]);

  useEffect(() => {
    if (!Number.isFinite(postId)) {
      setCommentsStatus("error");
      return;
    }

    const controller = new AbortController();

    async function loadComments() {
      try {
        setCommentsStatus("loading");
        const res = await fetch(`${COMMENTS_URL}?blogpostId=${postId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("bad response");

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        const sorted = [...arr].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setComments(sorted);
        setCommentsStatus("ready");
      } catch (err) {
        if (err.name === "AbortError") return;
        setCommentsStatus("error");
      }
    }

    loadComments();
    return () => controller.abort();
  }, [postId]);

  const title = post?.title || "Blog post";
  const meta = post?.date
    ? new Date(post.date).toLocaleDateString("da-DK")
    : "Posted";
  const img = normalizeImg(post?.asset?.url);

  const paragraphs = useMemo(
    () => splitParagraphs(post?.content),
    [post?.content],
  );

  function validate() {
    const next = {};

    if (!name.trim()) next.name = "Enter your name.";
    if (!content.trim())
      next.content = "Write a comment (this field must not be empty).";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!validate()) {
      setSubmitStatus("fail");
      setMessage("Please check all fields are filled in correctly.");
      return;
    }

    try {
      setSubmitStatus("saving");

      const payload = {
        blogpostId: postId,
        name: name.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
      };

      const res = await fetch(COMMENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("POST failed");

      const created = await res.json();
      setComments((prev) => [created, ...prev]);

      setName("");
      setContent("");

      setSubmitStatus("done");
      setMessage("Your comment has been send ✅");
    } catch {
      setSubmitStatus("fail");
      setMessage(
        "Unable to send the comment right now. Please try again later.",
      );
    } finally {
      window.setTimeout(() => setSubmitStatus("idle"), 1200);
    }
  }

  return (
    <main className="blogPostPage">
      <header
        className="blogPostHero"
        style={{ backgroundImage: `url(${footerbg})` }}
      >
        <div className="blogPostHeroOverlay" />

        <div className="blogPostHeroInner">
          <h1 className="blogPostHeroTitle">BLOG</h1>
          <img
            src="/assets/bottom_line2.png"
            alt=""
            className="blogPostHeroBottomLine"
          />
        </div>
      </header>

      <div className="blogPostInner">
        {postStatus === "loading" && (
          <div className="formMessage">Loading blog post...</div>
        )}

        {postStatus === "error" && (
          <div className="formMessage isError">
            This blog post could not be retrieved right now. Please try again
            later.
          </div>
        )}

        {postStatus === "ready" && post && (
          <>
            {img && (
              <div className="blogPostImgWrap">
                <img src={img} alt={title} />
              </div>
            )}

            <h1 className="blogPostTitle">{title}</h1>
            <p className="blogPostMeta">{meta}</p>

            <div className="blogPostBody">
              {paragraphs.length ? (
                paragraphs.map((p, i) => (
                  <p key={i} className="blogPostText">
                    {p}
                  </p>
                ))
              ) : (
                <p className="blogPostText" style={{ opacity: 0.85 }}>
                  (There is no content on this post yet.)
                </p>
              )}
            </div>

            <h2 className="blogPostSectionTitle">
              {commentsStatus === "ready"
                ? `${comments.length} COMMENTS`
                : "COMMENTS"}
            </h2>

            {commentsStatus === "loading" && (
              <div className="formMessage">Loading comments...</div>
            )}

            {commentsStatus === "error" && (
              <div className="formMessage isError">
                Comments could not be retrieved right now. Please try again
                later.
              </div>
            )}

            {commentsStatus === "ready" && (
              <div className="blogPostComments">
                {comments.length === 0 ? (
                  <div className="formMessage" style={{ opacity: 0.85 }}>
                    No comments yet - be the first!
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="blogPostComment">
                      <div className="blogPostCommentTop">
                        <span className="blogPostCommentName">{c.name}</span>
                        <span className="blogPostCommentDot">•</span>
                        <span className="blogPostCommentDate">
                          {c.date
                            ? new Date(c.date).toLocaleDateString("da-DK")
                            : "Posted"}
                        </span>
                      </div>

                      <p className="blogPostCommentText">{c.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            <h2 className="blogPostSectionTitle">LEAVE A COMMENT</h2>

            <form className="blogPostForm" onSubmit={onSubmit} noValidate>
              <div className="blogPostFormRow">
                <input
                  className={`blogPostInput ${errors.name ? "hasError" : ""}`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  aria-label="Your name"
                  aria-invalid={Boolean(errors.name)}
                  disabled={submitStatus === "saving"}
                />
              </div>

              <textarea
                className={`blogPostTextarea ${errors.content ? "hasError" : ""}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your comment"
                aria-label="Your comment"
                aria-invalid={Boolean(errors.content)}
                disabled={submitStatus === "saving"}
              />

              <div className="blogPostFormActions">
                <button
                  className="blogPostSubmit"
                  type="submit"
                  disabled={submitStatus === "saving"}
                >
                  {submitStatus === "saving" ? "SENDING…" : "SUBMIT"}
                </button>
              </div>

              {message && (
                <div
                  className={`formMessage ${
                    submitStatus === "done"
                      ? "isSuccess"
                      : submitStatus === "fail"
                        ? "isError"
                        : ""
                  }`}
                >
                  {message}
                </div>
              )}
            </form>

            <Link className="blogPostBack" to="/blog">
              ← Return to blog
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
