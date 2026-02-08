import { useEffect, useRef, useState } from "react";
import "../styles/BookTable.css";
import PageHero from "../components/PageHero";
import footerbg from "../assets/bg/footerbg.jpg";
import table1 from "../assets/table/table_1.png";
import table2 from "../assets/table/table_2.png";
import table3 from "../assets/table/table_3.png";

const API_URL = "http://localhost:4000/reservations";

const tables = [
  { number: 1, img: table1, label: "Table 1" },
  { number: 2, img: table1, label: "Table 2" },
  { number: 3, img: table2, label: "Table 3" },
  { number: 4, img: table1, label: "Table 4" },
  { number: 5, img: table3, label: "Table 5" },

  { number: 6, img: table1, label: "Table 6" },
  { number: 7, img: table1, label: "Table 7" },
  { number: 8, img: table2, label: "Table 8" },
  { number: 9, img: table1, label: "Table 9" },
  { number: 10, img: table3, label: "Table 10" },

  { number: 11, img: table1, label: "Table 11" },
  { number: 12, img: table1, label: "Table 12" },
  { number: 13, img: table2, label: "Table 13" },
  { number: 14, img: table1, label: "Table 14" },
  { number: 15, img: table3, label: "Table 15" },
];

function ymdFromIso(iso) {
  return iso ? String(iso).slice(0, 10) : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const cleaned = String(phone || "")
    .replace(/\s+/g, "")
    .trim();
  return /^[+0-9-]{6,20}$/.test(cleaned);
}

function toLocalEveningIso(ymd, hh = 20, mm = 0) {
  if (!ymd) return "";
  const local = new Date(
    `${ymd}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`,
  );
  return local.toISOString();
}

export default function BookTable() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [table, setTable] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const formRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setStatus("loading");
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error("API not ok");
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
        setStatus("ready");
      } catch (err) {
        if (err?.name === "AbortError") return;
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, []);

  function chooseTable(num) {
    setTable(String(num));
    setMessage("");
    setErrors((prev) => ({ ...prev, table: undefined }));

    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function validate() {
    const next = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) next.name = true;
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) next.email = true;
    if (!table) next.table = true;

    const g = Number(guests);
    if (!Number.isFinite(g) || g < 1 || g > 20) next.guests = true;

    if (!date) next.date = true;
    if (!trimmedPhone || !isValidPhone(trimmedPhone)) next.phone = true;

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function isBooked(tableNumber, ymd) {
    return reservations.some((r) => {
      const sameTable = String(r.table) === String(tableNumber);
      const sameDate = ymdFromIso(r.date) === ymd;
      return sameTable && sameDate;
    });
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setGuests("");
    setDate("");
    setComment("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (status !== "ready") {
      setMessage("Unable to book right now — please try again later.");
      return;
    }

    if (!validate()) {
      setSubmitStatus("fail");
      setMessage("Please fill in all fields correctly.");
      return;
    }

    const ymd = date;

    setSubmitStatus("checking");
    if (isBooked(table, ymd)) {
      setSubmitStatus("fail");
      setMessage(
        "This table is already reserved on that date. Please try another table or another date.",
      );
      return;
    }

    try {
      setSubmitStatus("saving");

      const isoEvening = toLocalEveningIso(ymd, 20, 0);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        table: String(table),
        guests: String(guests),
        date: isoEvening,
        comment: comment.trim(),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("POST failed");

      const created = await res.json();
      setReservations((prev) => [created, ...prev]);

      setSubmitStatus("done");
      setMessage("Your reservation has been confirmed.");
      resetForm();
    } catch {
      setSubmitStatus("fail");
      setMessage("Unable to book reservation. Please try again later.");
    } finally {
      window.setTimeout(() => setSubmitStatus("idle"), 1200);
    }
  }

  const buttonText =
    submitStatus === "checking"
      ? "CHECKING…"
      : submitStatus === "saving"
        ? "RESERVING…"
        : "RESERVE";

  return (
    <main className="bookTablePage">
      <PageHero title="BOOK TABLE" bgImage={footerbg} />

      <section className="bookTableSection">
        <div className="bookTableInner">
          {status === "error" && (
            <div className="formMessage isError">
              Could not load reservations. Please try again later.
            </div>
          )}

          <div className="tablesGrid" aria-label="Choose a table">
            {tables.map((t) => {
              const selected = String(t.number) === String(table);

              return (
                <button
                  key={t.number}
                  type="button"
                  className={`tableBtn ${selected ? "isSelected" : ""}`}
                  onClick={() => chooseTable(t.number)}
                  aria-label={`Choose table ${t.number}`}
                >
                  <img src={t.img} alt={t.label} />
                  <span className="tableNumber" aria-hidden="true">
                    {t.number}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bookFormBlock" ref={formRef}>
            <h3 className="bookFormTitle">BOOK A TABLE</h3>

            <form onSubmit={onSubmit} noValidate>
              <div className="bookFormGrid">
                <input
                  className={`bookInput ${errors.name ? "hasError" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />

                <input
                  className={`bookInput ${errors.email ? "hasError" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  type="email"
                />

                <input
                  className={`bookInput ${errors.table ? "hasError" : ""}`}
                  value={table}
                  readOnly
                  placeholder="Table Number"
                />

                <input
                  className={`bookInput ${errors.guests ? "hasError" : ""}`}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="Number of Guests"
                  inputMode="numeric"
                />

                <input
                  className={`bookDate ${errors.date ? "hasError" : ""}`}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <input
                  className={`bookInput ${errors.phone ? "hasError" : ""}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your Contact Number"
                />

                <textarea
                  className="bookTextarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Your Comment"
                />
              </div>

              <div className="bookFormActions">
                <button
                  className="reserveBtn"
                  type="submit"
                  disabled={
                    submitStatus === "saving" || submitStatus === "checking"
                  }
                >
                  {buttonText}
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
          </div>
        </div>
      </section>
    </main>
  );
}
