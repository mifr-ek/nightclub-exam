import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faSnapchatGhost,
} from "@fortawesome/free-brands-svg-icons";

import footerbg from "../assets/bg/footerbg.jpg";
import t1 from "../assets/content-img/testimonial_1.jpg";
import t2 from "../assets/content-img/testimonial_2.jpg";
import t3 from "../assets/content-img/testimonial_3.jpg";

import "../styles/Testimonials.css";

const API_URL = "http://localhost:4000/testimonials";

const localImgs = {
  1: t1,
  2: t2,
  3: t3,
};

const FADE_MS = 220;
const LOOP_MS = 4000;
const RESUME_AFTER_CLICK_MS = 6000;

export default function Testimonials() {
  const [status, setStatus] = useState("loading");
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);

  const [isFading, setIsFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const resumeTimeoutRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");

        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error("API not ok");

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        setItems(arr);
        setActive(0);
        setStatus("ready");
      } catch (err) {
        if (err.name === "AbortError") return;
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const current = items[active];
  const imgSrc = current?.asset?.url || localImgs[current?.id] || localImgs[1];

  function goTo(i) {
    if (status !== "ready") return;
    if (!items.length) return;
    if (i === active) return;

    setIsFading(true);

    window.setTimeout(() => {
      setActive(i);
      window.setTimeout(() => setIsFading(false), 0);
    }, FADE_MS);
  }

  function next() {
    if (!items.length) return;
    goTo((active + 1) % items.length);
  }

  useEffect(() => {
    if (status !== "ready") return;
    if (items.length <= 1) return;

    const id = window.setInterval(() => {
      if (!paused) next();
    }, LOOP_MS);

    return () => window.clearInterval(id);
  }, [status, items.length, active, paused]);

  function userSelect(i) {
    setPaused(true);

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setPaused(false);
      resumeTimeoutRef.current = null;
    }, RESUME_AFTER_CLICK_MS);

    goTo(i);
  }

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      className="testimonialsSection"
      style={{ backgroundImage: `url(${footerbg})` }}
    >
      <div className="testimonialsOverlay" />

      <div className="testimonialsInner">
        {status === "loading" && (
          <div className="testimonialsFallback">Loading testimonials...</div>
        )}

        {status === "error" && (
          <div className="testimonialsFallback">
            Could not load testimonials. Is the API running on localhost:4000?
          </div>
        )}

        {status === "ready" && current && (
          <div className={`testiCard ${isFading ? "isFading" : ""}`}>
            <img className="testiAvatar" src={imgSrc} alt={current.name} />

            <h3 className="testiName">{current.name}</h3>
            <p className="testiContent">{current.content}</p>

            <div className="testiSocial">
              <a
                className="testiIcon"
                href={current.facebook || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>

              <a
                className="testiIcon"
                href={current.twitter || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                title="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>

              <a
                className="testiIcon"
                href={current.snapchat || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Snapchat"
                title="Snapchat"
              >
                <FontAwesomeIcon icon={faSnapchatGhost} />
              </a>
            </div>

            <div className="testiDots" aria-label="Testimonials">
              {items.map((t, idx) => (
                <button
                  key={t.id}
                  className={`testiDot ${idx === active ? "active" : ""}`}
                  onClick={() => userSelect(idx)}
                  aria-label={`Show testimonial ${idx + 1}`}
                  type="button"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
