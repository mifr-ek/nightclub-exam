import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

import logoMain from "../assets/icon/Logo_main.svg";

export default function Navbar({ variant = "normal", stuck = false }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 980) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const headerClass =
    variant === "hero"
      ? `nav nav--hero ${stuck ? "nav--sticky" : ""}`
      : "nav nav--top";

  const linkClass = ({ isActive }) => `navItem ${isActive ? "isActive" : ""}`;

  return (
    <>
      <header className={headerClass}>
        <div className="nav__inner">
          <NavLink
            to="/"
            className="nav__logoLink"
            aria-label="Go to home"
            onClick={() => setOpen(false)}
          >
            <img src={logoMain} alt="Night Club" className="nav__logoImg" />
          </NavLink>

          <nav className="nav__links" aria-label="Primary navigation">
            <NavLink to="/" end className={linkClass}>
              HOME
            </NavLink>
            <NavLink to="/blog" className={linkClass}>
              BLOG
            </NavLink>
            <NavLink to="/book-table" className={linkClass}>
              BOOK TABLE
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              CONTACT US
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              LOG IN
            </NavLink>
          </nav>

          <button
            type="button"
            className={open ? "navBurger isOpen" : "navBurger"}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={open ? "navOverlay isOpen" : "navOverlay"}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <button
          type="button"
          className="navOverlay__backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />

        <button
          type="button"
          className="navClose"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <span />
          <span />
        </button>

        <nav className="navOverlay__links" aria-label="Mobile navigation">
          <NavLink
            to="/"
            end
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            HOME
          </NavLink>
          <NavLink
            to="/blog"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            BLOG
          </NavLink>
          <NavLink
            to="/book-table"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            BOOK TABLE
          </NavLink>
          <NavLink
            to="/contact"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            CONTACT US
          </NavLink>
          <NavLink
            to="/login"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            LOG IN
          </NavLink>
        </nav>
      </div>
    </>
  );
}
