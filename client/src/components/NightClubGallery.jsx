import { useEffect, useMemo, useState } from "react";
import "../styles/NightClubGallery.css";

const GALLERY_URL = "http://localhost:4000/gallery";

export default function NightClubGallery() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [animate, setAnimate] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const pics = useMemo(() => items.slice(0, 7), [items]);

  useEffect(() => {
    let alive = true;

    async function loadGallery() {
      try {
        setStatus("loading");

        const res = await fetch(GALLERY_URL);
        if (!res.ok) throw new Error("Bad response");

        const data = await res.json();
        const arr = Array.isArray(data)
          ? data
          : data.gallery || data.galleries || data.images || data.photos || [];

        if (!alive) return;

        setItems(arr);
        setStatus("ready");
      } catch {
        if (!alive) return;
        setStatus("error");
      }
    }

    loadGallery();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById("gallerySection");
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (activeIndex === null) return;

      if (e.key === "Escape") setActiveIndex(null);

      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i - 1 + pics.length) % pics.length);
      }

      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i + 1) % pics.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, pics.length]);

  function getImg(p) {
    const raw =
      p?.asset?.url || p?.image || p?.img || p?.url || p?.src || p?.path || "";
    return normalizeImg(raw);
  }

  function prev() {
    setActiveIndex((i) => (i - 1 + pics.length) % pics.length);
  }

  function next() {
    setActiveIndex((i) => (i + 1) % pics.length);
  }

  return (
    <section className="gallerySection" id="gallerySection">
      <h2 className="galleryHeadline">NIGHT CLUB GALLERY</h2>

      <img
        src="/assets/bottom_line2.png"
        alt=""
        className="nightclubgalleryBottomLine"
      />

      {status === "loading" && (
        <div className="galleryFallback">Loading gallery...</div>
      )}

      {status === "error" && (
        <div className="galleryFallback">
          Could not load gallery. Is the API running on localhost:4000?
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="galleryMosaic">
            {pics.map((p, i) => {
              const base = `galleryTile ${tileClass(i)} s${i + 1}`;
              const cls = animate ? `${base} slideIn` : base;

              return (
                <button
                  key={p.id ?? i}
                  type="button"
                  className={cls}
                  onClick={() => setActiveIndex(i)}
                  aria-label="Open image"
                >
                  <img src={getImg(p)} alt={p.title || "Gallery"} />
                  <div className="galleryTileOverlay">+</div>
                </button>
              );
            })}
          </div>

          {activeIndex !== null && pics.length > 0 && (
            <div
              className="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Gallery image viewer"
            >
              <button
                type="button"
                className="lightboxBackdrop"
                onClick={() => setActiveIndex(null)}
                aria-label="Close"
              />

              <div className="lightboxContent">
                <button
                  type="button"
                  className="lightboxClose"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close"
                >
                  ✕
                </button>

                <button
                  type="button"
                  className="lightboxNav lightboxPrev"
                  onClick={prev}
                  aria-label="Previous"
                >
                  ‹
                </button>

                <img
                  className="lightboxImg"
                  src={getImg(pics[activeIndex])}
                  alt="Large"
                />

                <button
                  type="button"
                  className="lightboxNav lightboxNext"
                  onClick={next}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function tileClass(i) {
  const map = ["tileA", "tileB", "tileC", "tileD", "tileE", "tileF", "tileG"];
  return map[i] || "tileA";
}

function normalizeImg(path) {
  if (!path) return "http://localhost:4000/file-bucket/gallery1_big.jpg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `http://localhost:4000${path}`;
  return `http://localhost:4000/${path}`;
}
