import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RESUME_URL } from "../constants/site";
import ArrowIcon from "./ArrowIcon";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const isWorkActive = pathname === "/" || pathname.startsWith("/projects/");
  const isAboutActive = pathname === "/about" || pathname === "/about/";
  const isResumeActive = pathname === "/resume" || pathname === "/resume/";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let previousY = window.scrollY;

    const syncVisibility = () => {
      if (window.innerWidth > 699) {
        setIsMobileNavVisible(true);
        previousY = window.scrollY;
        return;
      }

      if (isMenuOpen) {
        setIsMobileNavVisible(true);
        previousY = window.scrollY;
        return;
      }

      const currentY = window.scrollY;
      const delta = currentY - previousY;

      if (currentY <= 12) {
        setIsMobileNavVisible(true);
      } else if (delta > 24) {
        setIsMobileNavVisible(false);
      } else if (delta < -16) {
        setIsMobileNavVisible(true);
      }

      previousY = currentY;
    };

    syncVisibility();
    window.addEventListener("scroll", syncVisibility, { passive: true });
    window.addEventListener("resize", syncVisibility);

    return () => {
      window.removeEventListener("scroll", syncVisibility);
      window.removeEventListener("resize", syncVisibility);
    };
  }, [isMenuOpen]);

  return (
    <aside
      className={`sidebar${isMenuOpen ? " is-menu-open" : ""}${isMobileNavVisible ? "" : " is-mobile-hidden"}`}
      aria-label="Site navigation"
    >
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
