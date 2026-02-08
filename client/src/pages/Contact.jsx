import { useId, useState } from "react";
import "../styles/Contact.css";
import PageHero from "../components/PageHero";
import footerbg from "../assets/bg/footerbg.jpg";

const API_URL = "http://localhost:4000/contact_messages";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Contact() {
  const nameId = useId();
  const emailId = useId();
  const contentId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedContent = content.trim();

    if (!trimmedName) next.name = "Enter your name.";
    if (!trimmedEmail) next.email = "Enter your email.";
    else if (!isValidEmail(trimmedEmail)) {
      next.email = "Please enter a valid email (fx name@mail.com).";
    }

    if (!trimmedContent)
      next.content = "Please write a message before sending.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!validate()) {
      setStatus("error");
      setMessage("Please check the fields above.");
      return;
    }

    try {
      setStatus("sending");

      const payload = {
        name: name.trim(),
        email: email.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("POST failed");

      setStatus("success");
      setMessage("Your message has been sent ✅");

      setName("");
      setEmail("");
      setContent("");
      setErrors({});
    } catch {
      setStatus("error");
      setMessage(
        "Oops - we couldn't send your message right now. Please try again later.",
      );
    }
  }

  const isSending = status === "sending";

  return (
    <main className="contactPage">
      <PageHero title="CONTACT US" bgImage={footerbg} />

      <section className="contactSection">
        <form className="contactForm" onSubmit={onSubmit} noValidate>
          <div className="contactField">
            <label className="srOnly" htmlFor={nameId}>
              Your Name
            </label>

            <input
              id={nameId}
              className={`contactInput ${errors.name ? "hasError" : ""}`}
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSending}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              autoComplete="name"
            />

            {errors.name && (
              <div className="fieldError" id={`${nameId}-error`}>
                {errors.name}
              </div>
            )}
          </div>

          <div className="contactField">
            <label className="srOnly" htmlFor={emailId}>
              Your Email
            </label>

            <input
              id={emailId}
              className={`contactInput ${errors.email ? "hasError" : ""}`}
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSending}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
              autoComplete="email"
            />

            {errors.email && (
              <div className="fieldError" id={`${emailId}-error`}>
                {errors.email}
              </div>
            )}
          </div>

          <div className="contactField">
            <label className="srOnly" htmlFor={contentId}>
              Your Comment
            </label>

            <textarea
              id={contentId}
              className={`contactTextarea ${errors.content ? "hasError" : ""}`}
              placeholder="Your Comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSending}
              aria-invalid={Boolean(errors.content)}
              aria-describedby={
                errors.content ? `${contentId}-error` : undefined
              }
            />

            {errors.content && (
              <div className="fieldError" id={`${contentId}-error`}>
                {errors.content}
              </div>
            )}
          </div>

          <div className="contactActions">
            <button className="contactSend" type="submit" disabled={isSending}>
              {isSending ? "SENDING..." : "SEND"}
            </button>
          </div>

          {message && (
            <div
              className={`formMessage ${
                status === "success"
                  ? "isSuccess"
                  : status === "error"
                    ? "isError"
                    : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
