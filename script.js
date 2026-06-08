const revealSelector =
  ".intro:not(.case-hero), .case-intro-group, .project-grid, .about-story, .blog-section, .case-nav, .case-section";

const getRevealSections = (root = document) => Array.from(root.querySelectorAll(revealSelector));

const showRevealSections = (root = document) => {
  getRevealSections(root).forEach((section) => section.classList.add("is-visible"));
};

const initPageReveal = () => {
  const sections = getRevealSections();

  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCasePage = document.body.querySelector(".case-page");

  const getDelay = (section, index) => {
    if (prefersReducedMotion) return 0;

    if (isCasePage) {
      if (section.classList.contains("case-intro-group")) return 0;
      if (section.id === "overview") return 190;
      if (section.classList.contains("case-nav")) return 250;
      return Math.min(index * 72, 320);
    }

    if (section.classList.contains("intro")) return 0;
    return Math.min(index * 155, 360);
  };

  sections.forEach((section, index) => {
    section.style.setProperty("--reveal-delay", `${getDelay(section, index)}ms`);
  });

  if (prefersReducedMotion) {
    showRevealSections();
    return;
  }

  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }

  requestAnimationFrame(() => requestAnimationFrame(() => showRevealSections()));
  window.setTimeout(showRevealSections, 140);
};

let caseNavObserver = null;
let staticRouterInitialized = false;
let revealObserver = null;
let currentRouterPath = window.location.pathname;

const initCaseNav = () => {
  if (caseNavObserver) {
    caseNavObserver.disconnect();
    caseNavObserver = null;
  }

  const nav = document.querySelector(".case-nav");
  if (!nav || !("IntersectionObserver" in window)) return;

  const links = Array.from(nav.querySelectorAll("a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const setActiveLink = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  setActiveLink(sections[0].id);

  caseNavObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    },
    { rootMargin: "-28% 0px -58% 0px" }
  );

  sections.forEach((section) => caseNavObserver.observe(section));
};

const initCaseComparisons = () => {
  const comparisons = Array.from(document.querySelectorAll("[data-case-comparison]"));
  if (!comparisons.length) return;

  comparisons.forEach((comparison) => {
    const frame = comparison.querySelector(".case-comparison-frame");
    const buttons = Array.from(comparison.querySelectorAll("[data-comparison-state]"));
    if (!frame || !buttons.length) return;

    const setState = (state) => {
      frame.dataset.current = state;
      buttons.forEach((button) => {
        const isActive = button.dataset.comparisonState === state;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    };

    setState("after");

    buttons.forEach((button) => {
      button.addEventListener("click", () => setState(button.dataset.comparisonState));
    });
  });
};

const updateSidebarActiveState = () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const section = currentPage === "about.html" ? "about" : "design";

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isAbout = section === "about" && href.endsWith("about.html");
    const isDesign =
      section === "design" &&
      (href.endsWith("index.html") ||
        href.endsWith("accenture.html") ||
        href.endsWith("blue-guardian.html") ||
        href.endsWith("nus-iss.html") ||
        href.endsWith("project-02.html"));

    link.classList.toggle("is-active", isAbout || isDesign);
  });
};

const initPage = ({ reveal = true } = {}) => {
  updateSidebarActiveState();
  if (reveal) {
    initPageReveal();
  } else {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    showRevealSections();
  }
  initCaseNav();
  initCaseComparisons();
};

const getInternalHtmlUrl = (link) => {
  if (!link || link.target || link.hasAttribute("download")) return null;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (!url.pathname.endsWith(".html")) return null;

  return url;
};

const getSamePageHashUrl = (link) => {
  if (!link || link.target || link.hasAttribute("download")) return null;

  const href = link.getAttribute("href");
  if (!href || href === "#") return null;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.pathname !== window.location.pathname) return null;
  if (!url.hash) return null;

  return url;
};

const getRouterLink = (event) => {
  const path = typeof event.composedPath === "function" ? event.composedPath() : [];
  const pathLink = path.find((node) => node instanceof HTMLAnchorElement);
  if (pathLink) return pathLink;

  if (!(event.target instanceof Element)) return null;
  return event.target.closest("a");
};

const loadHtml = async (url) => {
  try {
    const response = await fetch(url.href, { credentials: "same-origin" });
    if (!response.ok) throw new Error(`Unable to load ${url.href}`);
    return response.text();
  } catch (error) {
    if (url.protocol !== "file:") throw error;

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("GET", url.href);
      request.onload = () => {
        if (request.status === 0 || (request.status >= 200 && request.status < 300)) {
          resolve(request.responseText);
        } else {
          reject(new Error(`Unable to load ${url.href}`));
        }
      };
      request.onerror = () => reject(error);
      request.send();
    });
  }
};

const scrollToHash = (hash) => {
  if (!hash) return false;

  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return false;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
};

const setCaseNavActiveByHash = (hash) => {
  const nav = document.querySelector(".case-nav");
  if (!nav || !hash) return;

  nav.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === hash);
  });
};

const instantScrollTo = (top) => {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  root.style.scrollBehavior = previousBehavior;
};

const updateCurrentHistoryState = () => {
  if (!window.history.replaceState) return;
  const currentState = window.history.state || {};
  window.history.replaceState(
    { ...currentState, path: window.location.href, scrollY: window.scrollY },
    "",
    window.location.href
  );
};

const swapMainContent = async (url, { push = true, resetScroll = true, reveal = true, restoreScrollY = null } = {}) => {
  const html = await loadHtml(url);
  const nextDocument = new DOMParser().parseFromString(html, "text/html");
  const nextMain = nextDocument.querySelector("main");
  const currentMain = document.querySelector("main");

  if (!nextMain || !currentMain) throw new Error("Missing main content");

  if (!reveal) showRevealSections(nextMain);

  document.title = nextDocument.title;
  currentMain.replaceWith(nextMain);

  if (push) window.history.pushState({ path: url.href }, "", url.href);
  currentRouterPath = url.pathname;

  initPage({ reveal });

  if (url.hash) {
    requestAnimationFrame(() => scrollToHash(url.hash));
  } else if (Number.isFinite(restoreScrollY)) {
    instantScrollTo(restoreScrollY);
  } else if (resetScroll) {
    window.scrollTo(0, 0);
  }
};

const initStaticRouter = () => {
  if (staticRouterInitialized) return;
  staticRouterInitialized = true;

  if (!window.history.pushState) {
    updateSidebarActiveState();
    return;
  }

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.history.replaceState({ path: window.location.href }, "", window.location.href);

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = getRouterLink(event);
    const hashUrl = getSamePageHashUrl(link);
    if (hashUrl) {
      event.preventDefault();
      if (window.location.hash) {
        const cleanUrl = `${window.location.pathname}${window.location.search}`;
        window.history.replaceState({ path: window.location.href }, "", cleanUrl);
      }
      scrollToHash(hashUrl.hash);
      setCaseNavActiveByHash(hashUrl.hash);
      return;
    }

    const url = getInternalHtmlUrl(link);
    if (!url) return;

    event.preventDefault();
    updateCurrentHistoryState();
    swapMainContent(url).catch(() => {
      console.warn(`Unable to load ${url.href} without a full page navigation.`);
    });
  }, true);

  window.addEventListener("popstate", (event) => {
    const url = new URL(window.location.href);
    if (url.pathname === currentRouterPath) {
      if (url.hash) scrollToHash(url.hash);
      return;
    }

    const restoreScrollY = Number.isFinite(event.state?.scrollY) ? event.state.scrollY : 0;
    swapMainContent(url, { push: false, resetScroll: false, reveal: false, restoreScrollY }).catch(() => {
      console.warn(`Unable to restore ${url.href} without a full page navigation.`);
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      initStaticRouter();
      initPage();
    },
    { once: true }
  );
} else {
  initStaticRouter();
  initPage();
}
