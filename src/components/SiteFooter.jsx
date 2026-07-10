import ArrowIcon from "./ArrowIcon";

export default function SiteFooter({ className = "site-footer", style, ariaLabel = "Contact" }) {
  return (
    <footer className={className} style={style} aria-label={ariaLabel}>
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
    </footer>
  );
}
