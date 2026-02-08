import { useEffect, useState } from "react";
import "../styles/Newsletter.css";

const API_URL = "http://localhost:4000/newsletters";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setStatus("loading");
        setMessage("");

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("API not ok");

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        if (!alive) return;

        setItems(arr);
        setStatus("ready");
      } catch {
        if (!alive) return;
        setStatus("error");
        setMessage(
          "Vi kunne ikke hente nyhedsbrev-tilmeldinger lige nu. Tjek at API’et kører på localhost:4000.",
        );
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("");

    const trimmed = email.trim();

    if (!trimmed) {
      setStatus("error");
      setMessage("Indtast venligst din e-mail.");
      return;
    }

    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setMessage(
        "Indtast venligst en gyldig e-mail, så vi kan tilmelde dig nyhedsbrevet.",
      );
      return;
    }

    const already = items.some(
      (x) => x.email?.toLowerCase() === trimmed.toLowerCase(),
    );

    if (already) {
      setStatus("error");
      setMessage("Den e-mail er allerede tilmeldt.");
      return;
    }

    try {
      setStatus("saving");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (!res.ok) throw new Error("POST failed");

      const created = await res.json();

      setItems((prev) => [created, ...prev]);
      setEmail("");
      setStatus("saved");
      setMessage("Tak! Du er nu tilmeldt nyhedsbrevet 🎉");

      window.setTimeout(() => setStatus("ready"), 1200);
    } catch {
      setStatus("error");
      setMessage(
        "Vi kunne desværre ikke tilmelde dig lige nu. Prøv igen om lidt.",
      );
    }
  }

  return (
    <section className="newsletterSection">
      <div className="newsletterInner">
        <h3 className="newsletterTitle">WANT THE LATEST NIGHT CLUB NEWS</h3>

        <p className="newsletterSubtitle">
          Subscribe to our newsletter and never miss an <span>Event</span>
        </p>

        <form className="newsletterForm" onSubmit={onSubmit} noValidate>
          <label className="newsletterField">
            <span className="newsletterLabel">Enter Your Email</span>

            <input
              className="newsletterInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "saving"}
              required
              aria-invalid={status === "error" && Boolean(message)}
            />
          </label>

          <button
            className="newsletterBtn"
            type="submit"
            disabled={status === "saving"}
          >
            {status === "saving" ? "SAVING..." : "SUBSCRIBE"}
          </button>
        </form>

        {(message || status === "loading") && (
          <div className="newsletterStatus">
            {status === "loading" ? "Loading..." : message}
          </div>
        )}
      </div>
    </section>
  );
}
