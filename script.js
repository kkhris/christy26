const revealSelector =
  ".intro:not(.case-hero), .case-intro-group, .project-grid, .about-story, .blog-section, .case-nav, .case-section";

const getAppRoot = () => document.querySelector("#app") || document;

const getRevealSections = (root = getAppRoot()) => Array.from(root.querySelectorAll(revealSelector));

const showRevealSections = (root = getAppRoot()) => {
  getRevealSections(root).forEach((section) => section.classList.add("is-visible"));
};

const initPageReveal = ({
  root = getAppRoot(),
  isRouteTransition = Boolean(activeRouteProfile)
} = {}) => {
  markRouteProfile("revealStart");
  const sections = getRevealSections(root);

  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCasePage = root.classList.contains("case-page");

  const getDelay = (section, index) => {
    if (prefersReducedMotion) return 0;

    if (isCasePage) {
      if (section.classList.contains("case-intro-group")) return 0;
      if (isRouteTransition) {
        if (section.id === "overview") return 72;
        if (section.classList.contains("case-nav")) return 132;
        return Math.min(index * 42, 168);
      }
      if (section.id === "overview") return 190;
      if (section.classList.contains("case-nav")) return 250;
      return Math.min(index * 72, 320);
    }

    if (isRouteTransition) {
      if (section.classList.contains("intro")) return 0;
      return Math.min(index * 56, 156);
    }

    if (section.classList.contains("intro")) return 0;
    return Math.min(index * 155, 360);
  };

  const getDuration = (section) => {
    const cssDuration =
      Number.parseFloat(getComputedStyle(section).getPropertyValue("--reveal-duration")) || 820;

    if (!isRouteTransition || prefersReducedMotion) return cssDuration;
    if (isCasePage && section.classList.contains("case-nav")) return 460;
    return 480;
  };

  sections.forEach((section, index) => {
    section.style.setProperty("--reveal-delay", `${getDelay(section, index)}ms`);
    section.style.setProperty("--reveal-duration", `${getDuration(section)}ms`);
  });

  const maxRevealTime = sections.reduce((max, section, index) => {
    const delay = getDelay(section, index);
    const duration = getDuration(section);
    return Math.max(max, delay + duration);
  }, 0);

  if (prefersReducedMotion) {
    showRevealSections(root);
    markRouteProfile("revealEnd");
    finishRouteProfile();
    return;
  }

  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }

  const revealKickDelay = isRouteTransition ? 24 : 140;
  requestAnimationFrame(() => showRevealSections(root));
  window.setTimeout(() => showRevealSections(root), revealKickDelay);
  window.setTimeout(() => {
    markRouteProfile("revealEnd");
    finishRouteProfile();
  }, Math.max(maxRevealTime, revealKickDelay));
};

let caseNavObserver = null;
let staticRouterInitialized = false;
let revealObserver = null;
let currentRouterPath = window.location.pathname;
const pageCache = new Map();
const routeDocumentCache = new Map();
let persistentSidebar = null;
let activeRouteProfile = null;
let prewarmHasRun = false;

const now = () => performance.now();

const startRouteProfile = (url) => {
  activeRouteProfile = {
    url: url.href,
    clickReceived: now()
  };
  window.__lastRouteProfile = activeRouteProfile;
};

const markRouteProfile = (key) => {
  if (!activeRouteProfile) return;
  activeRouteProfile[key] = now();
};

const finishRouteProfile = () => {
  if (!activeRouteProfile) return;
  const profile = activeRouteProfile;
  const click = profile.clickReceived;
  const result = {
    url: profile.url,
    clickReceived: 0,
    routeStart: (profile.routeStart ?? click) - click,
    fetchStart: (profile.fetchStart ?? click) - click,
    fetchComplete: (profile.fetchComplete ?? click) - click,
    htmlParseComplete: (profile.htmlParseComplete ?? click) - click,
    contentSwapComplete: (profile.contentSwapComplete ?? click) - click,
    interactionInitializationComplete: (profile.interactionInitializationComplete ?? click) - click,
    revealStart: (profile.revealStart ?? click) - click,
    revealEnd: (profile.revealEnd ?? click) - click
  };
  window.__lastRouteProfileResult = result;
  console.table(result);
  activeRouteProfile = null;
};

const absoluteUrl = (value, base = window.location.href) => {
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
};

const initCaseNav = (root = getAppRoot()) => {
  if (caseNavObserver) {
    caseNavObserver.disconnect();
    caseNavObserver = null;
  }

  const nav = root.querySelector(".case-nav");
  if (!nav || !("IntersectionObserver" in window)) return;

  const links = Array.from(nav.querySelectorAll("a"));
  const sections = links
    .map((link) => root.querySelector(link.getAttribute("href")))
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

const initCaseComparisons = (root = getAppRoot()) => {
  const comparisons = Array.from(root.querySelectorAll("[data-case-comparison]"));
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

const initPage = ({ reveal = true, root = getAppRoot(), allowPrewarm = false } = {}) => {
  updateSidebarActiveState();
  if (reveal) {
    initPageReveal({ root });
  } else {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    showRevealSections(root);
  }
  initCaseNav(root);
  initCaseComparisons(root);
  if (allowPrewarm && !prewarmHasRun) {
    prewarmHasRun = true;
    prewarmInternalPages(root);
  }
};

const assertSidebarPersistence = (before, after) => {
  console.assert(before === after, "Sidebar was replaced. This is wrong.");
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
  const cached = pageCache.get(url.href);
  if (cached) return cached;

  const requestPromise = (async () => {
    markRouteProfile("fetchStart");
    const response = await fetch(url.href, { credentials: "same-origin" });
    if (!response.ok) throw new Error(`Unable to load ${url.href}`);
    const html = await response.text();
    markRouteProfile("fetchComplete");
    return html;
  })();

  requestPromise.catch(() => {
    if (pageCache.get(url.href) === requestPromise) {
      pageCache.delete(url.href);
    }
  });

  pageCache.set(url.href, requestPromise);
  return requestPromise;
};

const loadDocumentFromIframe = (url) =>
  new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.src = url.href;
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.border = "0";
    iframe.style.inset = "-9999px auto auto -9999px";

    const cleanup = () => {
      iframe.onload = null;
      iframe.onerror = null;
      iframe.remove();
    };

    let settled = false;
    let timeoutId = null;
    let readinessPoll = null;

    const settleResolve = (doc) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      window.clearInterval(readinessPoll);
      const html = doc.documentElement.outerHTML;
      cleanup();
      resolve(new DOMParser().parseFromString(html, "text/html"));
    };

    const settleReject = (error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      window.clearInterval(readinessPoll);
      cleanup();
      reject(error);
    };

    const tryResolveEarly = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) throw new Error(`Unable to access ${url.href}`);
        if (doc.readyState !== "loading" && doc.querySelector("main")) {
          settleResolve(doc);
        }
      } catch (error) {
        settleReject(error);
      }
    };

    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) throw new Error(`Unable to access ${url.href}`);
        settleResolve(doc);
      } catch (error) {
        settleReject(error);
      }
    };

    iframe.onerror = () => {
      settleReject(new Error(`Unable to load ${url.href}`));
    };

    document.body.appendChild(iframe);

    readinessPoll = window.setInterval(tryResolveEarly, 16);
    timeoutId = window.setTimeout(() => {
      tryResolveEarly();
      if (!settled) {
        settleReject(new Error(`Timed out loading ${url.href}`));
      }
    }, 10000);
  });

const loadRouteDocument = async (url) => {
  const cached = routeDocumentCache.get(url.href);
  if (cached) return cached;

  const requestPromise = (async () => {
    if (window.location.protocol === "file:" || url.protocol === "file:") {
      markRouteProfile("fetchStart");
      const doc = await loadDocumentFromIframe(url);
      markRouteProfile("fetchComplete");
      markRouteProfile("htmlParseComplete");
      return doc;
    }

    const html = await loadHtml(url);
    const doc = new DOMParser().parseFromString(html, "text/html");
    markRouteProfile("htmlParseComplete");
    return doc;
  })();

  requestPromise.catch(() => {
    if (routeDocumentCache.get(url.href) === requestPromise) {
      routeDocumentCache.delete(url.href);
    }
  });

  routeDocumentCache.set(url.href, requestPromise);
  return requestPromise;
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

const warmPage = async (url) => {
  const nextDocument = await loadRouteDocument(url);
  if (!activeRouteProfile?.htmlParseComplete) {
    markRouteProfile("htmlParseComplete");
  }
  const nextMain = nextDocument.querySelector("main");
  return { nextDocument, nextMain };
};

const prewarmInternalPages = (root = getAppRoot()) => {
  if (window.location.protocol === "file:") return;

  const urls = Array.from(root.querySelectorAll("a"))
    .map((link) => getInternalHtmlUrl(link))
    .filter(Boolean);

  const seen = new Set();

  urls.forEach((url, index) => {
    if (seen.has(url.href) || url.pathname === window.location.pathname) return;
    seen.add(url.href);

    const run = () => loadRouteDocument(url).catch(() => {});

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 1200 + index * 120 });
    } else {
      window.setTimeout(run, 220 + index * 120);
    }
  });
};

const swapMainContent = async (url, { push = true, resetScroll = true, reveal = true, restoreScrollY = null } = {}) => {
  markRouteProfile("routeStart");
  const { nextDocument, nextMain } = await warmPage(url);
  const currentMain = document.querySelector("#app");
  const sidebarBefore = persistentSidebar || document.querySelector(".sidebar");

  if (!nextMain || !currentMain) throw new Error("Missing main content");

  document.title = nextDocument.title;
  currentMain.className = nextMain.className;
  currentMain.innerHTML = nextMain.innerHTML;
  markRouteProfile("contentSwapComplete");

  if (!reveal) showRevealSections(currentMain);

  if (push) window.history.pushState({ path: url.href }, "", url.href);
  currentRouterPath = url.pathname;

  initPage({ reveal, root: currentMain, allowPrewarm: false });
  markRouteProfile("interactionInitializationComplete");

  const sidebarAfter = document.querySelector(".sidebar");
  assertSidebarPersistence(sidebarBefore, sidebarAfter);

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
    startRouteProfile(url);
    updateCurrentHistoryState();
    swapMainContent(url, { reveal: true }).catch(() => {
      console.warn(`Unable to load ${url.href} without a full page navigation.`);
      window.location.href = url.href;
    });
  }, true);

  const warmLink = (event) => {
    const link = getRouterLink(event);
    const url = getInternalHtmlUrl(link);
    if (!url) return;
    loadRouteDocument(url).catch(() => {});
  };

  document.addEventListener("pointerenter", warmLink, true);
  document.addEventListener("focusin", warmLink, true);

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
      persistentSidebar = document.querySelector(".sidebar");
      initStaticRouter();
      initPage({ root: getAppRoot(), allowPrewarm: true });
    },
    { once: true }
  );
} else {
  persistentSidebar = document.querySelector(".sidebar");
  initStaticRouter();
  initPage({ root: getAppRoot(), allowPrewarm: true });
}
