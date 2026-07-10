import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RESUME_URL } from "../constants/site";
import ArrowIcon from "./ArrowIcon";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isWorkActive = pathname === "/" || pathname.startsWith("/projects/");
  const isAboutActive = pathname === "/about" || pathname === "/about/";
  const isResumeActive = pathname === "/resume" || pathname === "/resume/";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <aside className="sidebar" aria-label="Site navigation">
      <div className="mobile-nav-bar">
        <button
          type="button"
          className={`mobile-menu-toggle${isMenuOpen ? " is-open" : ""}`}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-links"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav
        id="mobile-nav-links"
        className={`nav-links${isMenuOpen ? " is-open" : ""}`}
      >
        <NavLink to="/" end className={isWorkActive ? "is-active" : undefined}>
          Work
        </NavLink>
        <NavLink to="/about/" className={isAboutActive ? "is-active" : undefined}>
          About
        </NavLink>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noreferrer"
          className={isResumeActive ? "nav-link-external is-active" : "nav-link-external"}
        >
          <span className="nav-label">Resume</span>
          <ArrowIcon />
        </a>
      </nav>

      <div className="contact">
        <h2>Let&apos;s Connect!</h2>
        <p>
          <a
            href="https://www.linkedin.com/in/lyuchristal"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
            <ArrowIcon />
          </a>
          <a href="mailto:y44lyu@uwaterloo.ca">
            Email
            <ArrowIcon />
          </a>
        </p>
        <small>&copy;Christal Lyu, 2026</small>
      </div>
    </aside>
  );
}
