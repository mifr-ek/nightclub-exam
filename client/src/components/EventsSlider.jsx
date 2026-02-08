import { useEffect, useMemo, useState } from "react";
import "../styles/EventsSection.css";

const EVENTS_URL = "http://localhost:4000/events";

function normalizeApiImg(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `http://localhost:4000${path}`;
  return `http://localhost:4000/${path}`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function EventsSlider() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading");
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const update = () => setIsMobile(mq.matches);

    update();
    mq.addEventListener?.("change", update);

    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setStatus("loading");
        const res = await fetch(EVENTS_URL);
        if (!res.ok) throw new Error("Bad response");

        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.events || [];

        if (!alive) return;

        setEvents(arr);
        setStatus("ready");
      } catch {
        if (!alive) return;
        setStatus("error");
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const slides = useMemo(
    () => chunk(events, isMobile ? 1 : 2),
    [events, isMobile],
  );

  useEffect(() => {
    if (paused) return;
    if (slides.length <= 1) return;

    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 2500);

    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  useEffect(() => {
    if (slideIndex >= slides.length) setSlideIndex(0);
    setOpenId(null);
  }, [slides.length, slideIndex]);

  return (
    <section className="eventsBgFull">
      <div className="eventsBgOverlay" />

      <div className="eventsContent">
        <h2 className="eventsHeadline">EVENTS OF THE MONTH</h2>

        <img
          src="/assets/bottom_line2.png"
          alt=""
          className="eventsBottomLine"
        />

        {status === "loading" && (
          <div className="eventsFallback">Loading events...</div>
        )}

        {status === "error" && (
          <div className="eventsFallback">
            Could not load events. Please try again later.
          </div>
        )}

        {status === "ready" && slides.length > 0 && (
          <>
            <div
              className="eventsGrid"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onTouchStart={() => setPaused(true)}
            >
              {slides[slideIndex].map((ev) => (
                <article
                  key={ev.id}
                  className={
                    openId === ev.id
                      ? "eventCard eventHover eventCard--open"
                      : "eventCard eventHover"
                  }
                  onClick={() => {
                    if (!isMobile) return;
                    setOpenId((curr) => (curr === ev.id ? null : ev.id));
                  }}
                >
                  <img
                    src={normalizeApiImg(ev?.asset?.url)}
                    alt={ev?.title || "Event"}
                    loading="lazy"
                  />

                  <div className="eventBar">
                    <span>{formatDate(ev.date)}</span>
                    <span>{formatTime(ev.date)}</span>
                    <span>{ev.location}</span>
                  </div>

                  <div className="eventOverlay">
                    <h3 className="eventTitle">{ev.title}</h3>
                    <p className="eventDesc">{ev.description}</p>

                    <button
                      type="button"
                      className="eventBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaused(true);
                      }}
                    >
                      BOOK NOW
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="eventDots" aria-label="Events slider dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={
                    i === slideIndex
                      ? "dotSquare dotSquare--active"
                      : "dotSquare"
                  }
                  onClick={() => {
                    setSlideIndex(i);
                    setPaused(true);
                    setOpenId(null);
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
