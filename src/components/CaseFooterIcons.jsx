export function FooterArrow({ direction = "right" }) {
  const path = direction === "left" ? "M20 12H6M12 6l-6 6 6 6" : "M4 12h14m-6-6 6 6-6 6";

  return (
    <svg
      className={`arrow-icon case-footer-arrow${direction === "left" ? " case-footer-arrow-left" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export function SpotifyIcon() {
  return (
    <svg className="case-footer-spotify" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1DB954" />
      <path
        d="M17.41 9.78a.95.95 0 0 1-1.31.31 9.14 9.14 0 0 0-8.23-.87.95.95 0 0 1-.65-1.79 11.03 11.03 0 0 1 9.95 1.05.95.95 0 0 1 .24 1.3Z"
        fill="#fff"
      />
      <path
        d="M16.2 12.55a.79.79 0 0 1-1.09.27 7.67 7.67 0 0 0-6.6-.65.79.79 0 0 1-.51-1.49 9.24 9.24 0 0 1 8 .78.79.79 0 0 1 .2 1.09Z"
        fill="#fff"
      />
      <path
        d="M15.14 15.05a.63.63 0 0 1-.87.22 6.06 6.06 0 0 0-4.9-.43.63.63 0 0 1-.38-1.21 7.32 7.32 0 0 1 5.94.53.63.63 0 0 1 .21.89Z"
        fill="#fff"
      />
    </svg>
  );
}
