const revealSelector =
  ".intro:not(.case-hero), .case-intro-group, .project-grid, .about-story, .blog-section, .case-nav, .case-section";

const routeTable = {
  design: {
    partial: "routes/design.html",
    title: "Christal Lyu"
  },
  about: {
    partial: "routes/about.html",
    title: "Christal Lyu"
  },
  accenture: {
    partial: "routes/accenture.html",
    title: "Wildlight AI | Christal Lyu"
  },
  "blue-guardian": {
    partial: "routes/blue-guardian.html",
    title: "Blue Guardian | Christal Lyu"
  },
  "nus-iss": {
    partial: "routes/nus-iss.html",
    title: "NUS-ISS | Christal Lyu"
  }
};

const routeAliases = {
  "": "design",
  index: "design",
  "index.html": "design",
  design: "design",
  "design.html": "design",
  about: "about",
  "about.html": "about",
  accenture: "accenture",
  "accenture.html": "accenture",
  wildlight: "accenture",
  "wildlight.html": "accenture",
  "blue-guardian": "blue-guardian",
  "blue-guardian.html": "blue-guardian",
  "nus-iss": "nus-iss",
  "nus-iss.html": "nus-iss",
  nus: "nus-iss",
  "nus.html": "nus-iss"
};

const getAppRoot = () => document.querySelector("#app") || document;
const getRouteBasename = (value) => value.split("/").pop() || "index.html";
const normalizeRouteKey = (value) =>
  routeAliases[String(value || "").trim().toLowerCase()] || null;
const getRouteEntry = (value) => routeTable[normalizeRouteKey(value) || "design"] || routeTable.design;
const getRouteKeyFromUrl = (url) => {
  const explicitRoute = normalizeRouteKey(url.searchParams.get("route"));
  if (explicitRoute) return explicitRoute;
  return normalizeRouteKey(getRouteBasename(url.pathname)) || "design";
};
const getRouteTitle = (routeKey) => getRouteEntry(routeKey).title;
const getRoutePartialUrl = (routeKey) => new URL(getRouteEntry(routeKey).partial, window.location.href);
const buildShellUrl = (routeKey, hash = "") => {
  const shellUrl = new URL(window.location.href);
  shellUrl.pathname = shellUrl.pathname.replace(/[^/]*$/, "index.html");
  shellUrl.search = "";
  if (routeKey && routeKey !== "design") shellUrl.searchParams.set("route", routeKey);
  shellUrl.hash = hash || "";
  return shellUrl;
};

const getRevealSections = (root = getAppRoot()) => Array.from(root.querySelectorAll(revealSelector));

const showRevealSections = (root = getAppRoot()) => {
  getRevealSections(root).forEach((section) => section.classList.add("is-visible"));
};

const initPageReveal = ({ root = getAppRoot() } = {}) => {
  markRouteProfile("revealStart");
  const sections = getRevealSections(root);

  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCasePage = root.classList.contains("case-page");

  const getDelay = (section, index) => {
    if (prefersReducedMotion) return 0;

    if (section.classList.contains("intro") || section.classList.contains("case-intro-group")) return 0;
    // 200ms base matches the Framer reference's 0.3s delay (slightly tighter for SPA feel).
    // Small per-index stagger (40ms, capped at 80ms) keeps sections from feeling robotic
    // when multiple enter together, without becoming a sequence animation.
    const base = 200;
    if (section.classList.contains("case-nav")) return base + 60;
    return base + Math.min(index * 40, 80);
  };

  const getDuration = (section) => {
    if (prefersReducedMotion) {
      return Number.parseFloat(getComputedStyle(section).getPropertyValue("--reveal-duration")) || 650;
    }
    if (isCasePage && section.classList.contains("case-nav")) return 700;
    return 750;
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

  // Whole-page entrance: all sections fire at once on page enter (not scroll-triggered).
  // The CSS --reveal-delay carries a 200ms base so the entrance feels deliberate,
  // matching the Framer reference's 0.3s delay setting.
  const revealKickDelay = 18;
  requestAnimationFrame(() => showRevealSections(root));
  window.setTimeout(() => showRevealSections(root), revealKickDelay);
  window.setTimeout(() => {
    markRouteProfile("revealEnd");
    finishRouteProfile();
  }, Math.max(maxRevealTime, revealKickDelay));
};

const playRouteContentReveal = (root = getAppRoot()) => {
  markRouteProfile("revealStart");
  markRouteProfile("revealEnd");
  finishRouteProfile();
};

let caseNavObserver = null;
let staticRouterInitialized = false;
let revealObserver = null;
let currentRouterPath = getRouteKeyFromUrl(new URL(window.location.href));
const pageCache = new Map();
const routeDocumentCache = new Map();
let persistentSidebar = null;
let activeRouteProfile = null;
let prewarmHasRun = false;
const enableAppShellRouter = true;
const routeTemplateIds = {
  design: "route-design",
  about: "route-about",
  accenture: "route-accenture",
  "blue-guardian": "route-blue-guardian",
  "nus-iss": "route-nus-iss"
};

const now = () => performance.now();
const prefersDarkMode = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const preloadImage = (src) => {
  if (!src) return Promise.resolve();
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
    if (image.complete) resolve();
  });
};

const decodeImage = (image) =>
  new Promise((resolve) => {
    if (!image) {
      resolve();
      return;
    }

    const finish = () => {
      if (typeof image.decode === "function") {
        image.decode().catch(() => {}).finally(resolve);
      } else {
        resolve();
      }
    };

    if (image.complete && image.naturalWidth > 0) {
      finish();
      return;
    }

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });

const getAboutPriorityImageSources = () => {
  const variant = prefersDarkMode() ? "dark" : "light";
  return [
    absoluteUrl("assets/about-flowers.jpg"),
    absoluteUrl(`assets/blogs/01-cover-${variant}.png`),
    absoluteUrl(`assets/blogs/02-cover-${variant}.png`),
    absoluteUrl(`assets/blogs/03-cover-${variant}.png`),
    absoluteUrl(`assets/blogs/01-hover-${variant}.png`),
    absoluteUrl(`assets/blogs/02-hover-${variant}.png`),
    absoluteUrl(`assets/blogs/03-hover-${variant}.png`)
  ].filter(Boolean);
};

const warmAboutPriorityImages = () =>
  Promise.all(getAboutPriorityImageSources().map(preloadImage)).catch(() => {});

const getAboutVisibleImages = (root) => {
  const selector = prefersDarkMode()
    ? ".blog-image-cover.blog-image-dark, .blog-image-hover.blog-image-dark"
    : ".blog-image-cover.blog-image-light, .blog-image-hover.blog-image-light";
  return Array.from(root.querySelectorAll(selector));
};

const getRouteTemplateMain = (routeKey) => {
  const templateId = routeTemplateIds[routeKey] || routeTemplateIds.design;
  const template = document.getElementById(templateId);
  if (!template) return null;

  const contentRoot = template.content?.firstElementChild;
  if (!contentRoot || contentRoot.tagName !== "MAIN") return null;
  return contentRoot;
};

const preparePageMedia = async (root) => {
  if (!root?.classList?.contains("about-page")) {
    if (root) root.dataset.mediaReady = "true";
    return;
  }

  root.dataset.mediaReady = "false";
  await Promise.all(getAboutVisibleImages(root).map(decodeImage));
  root.dataset.mediaReady = "true";
};

const startRouteProfile = (url) => {
  activeRouteProfile = { url: url.href, clickReceived: now() };
};

const markRouteProfile = (key) => {
  if (!activeRouteProfile) return;
  activeRouteProfile[key] = now();
};

const finishRouteProfile = () => {
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

const updateSidebarActiveState = (routeKey = currentRouterPath) => {
  const section = routeKey === "about" ? "about" : "design";
  document.documentElement.dataset.route = section;

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const routeInfo = getInternalRouteInfo(link);
    const linkRoute = routeInfo?.routeKey || null;
    const isAbout = section === "about" && linkRoute === "about";
    const isDesign = section === "design" && linkRoute === "design";

    link.classList.toggle("is-active", isAbout || isDesign);
  });
};

const initPage = async ({ reveal = true, root = getAppRoot(), allowPrewarm = false } = {}) => {
  updateSidebarActiveState();
  bindInternalRouteLinks(root);
  void preparePageMedia(root);
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
    if (!root.classList.contains("about-page")) {
      warmAboutPriorityImages();
    }
  }
};

const getInternalRouteInfo = (link) => {
  if (!link || link.target || link.hasAttribute("download")) return null;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  const routeKey = getRouteKeyFromUrl(url);
  const basename = getRouteBasename(url.pathname).toLowerCase();
  const canRoute =
    url.searchParams.has("route") ||
    basename === "index.html" ||
    Boolean(normalizeRouteKey(basename));

  if (!canRoute) return null;

  return {
    url,
    routeKey,
    hash: url.hash || ""
  };
};

const getSamePageHashUrl = (link) => {
  if (!link || link.target || link.hasAttribute("download")) return null;

  const href = link.getAttribute("href");
  if (!href || href === "#") return null;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (!url.hash) return null;
  if (getRouteKeyFromUrl(url) !== currentRouterPath) return null;

  return {
    url,
    hash: url.hash
  };
};

const getRouterLink = (event) => {
  const path = typeof event.composedPath === "function" ? event.composedPath() : [];
  const pathLink = path.find((node) => node instanceof HTMLAnchorElement);
  if (pathLink) return pathLink;

  if (!(event.target instanceof Element)) return null;
  return event.target.closest("a");
};

const handleInternalRouteClick = (event, link) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const routeInfo = getInternalRouteInfo(link);
  if (!routeInfo) return;

  event.preventDefault();
  event.stopPropagation();

  startRouteProfile(routeInfo.url);
  updateCurrentHistoryState();
  swapMainContent(routeInfo.routeKey, {
    historyMode: "push",
    reveal: true,
    hash: routeInfo.hash
  }).catch((error) => {
    console.warn(`Unable to load ${routeInfo.url.href} inside the app shell.`, error?.message || error);
    void fallbackToDesignContent();
  });
};

const bindInternalRouteLinks = (root = document) => {
  root.querySelectorAll("a[href]").forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    if (link.dataset.routerBound === "true") return;
    if (!getInternalRouteInfo(link)) return;

    link.dataset.routerBound = "true";
    link.addEventListener("click", (event) => handleInternalRouteClick(event, link), true);
  });
};

const fallbackToDesignContent = async () => {
  const currentMain = document.querySelector("#app");
  const designMain = getRouteTemplateMain("design");
  if (!currentMain || !designMain) return;

  currentMain.className = designMain.className;
  currentMain.innerHTML = designMain.innerHTML;
  currentRouterPath = "design";
  document.title = getRouteTitle("design");
  window.history.replaceState(
    { path: buildShellUrl("design").href, routeKey: "design", hash: "" },
    "",
    buildShellUrl("design").href
  );
  await initPage({ reveal: false, root: currentMain, allowPrewarm: false });
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

const loadRouteDocument = async (routeKey) => {
  const partialUrl = getRoutePartialUrl(routeKey);
  const cached = routeDocumentCache.get(partialUrl.href);
  if (cached) return cached;

  const requestPromise = (async () => {
    try {
      markRouteProfile("fetchStart");
      const html = await loadHtml(partialUrl);
      markRouteProfile("fetchComplete");
      const doc = new DOMParser().parseFromString(html, "text/html");
      markRouteProfile("htmlParseComplete");
      return doc;
    } catch (error) {
      if (!(window.location.protocol === "file:" || partialUrl.protocol === "file:")) {
        throw error;
      }

      markRouteProfile("fetchStart");
      const doc = await loadDocumentFromIframe(partialUrl);
      markRouteProfile("fetchComplete");
      markRouteProfile("htmlParseComplete");
      return doc;
    }
  })();

  requestPromise.catch(() => {
    if (routeDocumentCache.get(partialUrl.href) === requestPromise) {
      routeDocumentCache.delete(partialUrl.href);
    }
  });

  routeDocumentCache.set(partialUrl.href, requestPromise);
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

// At desktop (>809px) .page-shell is the scroll container; at mobile the document scrolls.
const getScrollContainer = () =>
  window.innerWidth > 809 ? document.getElementById("app") : null;

const instantScrollTo = (top) => {
  const container = getScrollContainer();
  if (container) {
    container.scrollTop = top;
  } else {
    window.scrollTo(0, top);
  }
};

const getScrollTop = () => {
  const container = getScrollContainer();
  return container ? container.scrollTop : window.scrollY;
};

const updateCurrentHistoryState = () => {
  if (!window.history.replaceState) return;
  const currentState = window.history.state || {};
  window.history.replaceState(
    { ...currentState, path: window.location.href, scrollY: getScrollTop() },
    "",
    window.location.href
  );
};

const warmPage = async (routeKey) => {
  if (enableAppShellRouter) {
    const templateMain = getRouteTemplateMain(routeKey) || getRouteTemplateMain("design");
    if (!activeRouteProfile?.htmlParseComplete) {
      markRouteProfile("htmlParseComplete");
    }
    return {
      nextDocument: document,
      nextMain: templateMain
    };
  }

  const nextDocument = await loadRouteDocument(routeKey);
  if (!activeRouteProfile?.htmlParseComplete) {
    markRouteProfile("htmlParseComplete");
  }
  const nextMain = nextDocument.querySelector("main");
  return { nextDocument, nextMain };
};

const prewarmInternalPages = () => {
  if (enableAppShellRouter || window.location.protocol === "file:") return;

  Object.keys(routeTable).forEach((routeKey, index) => {
    if (routeKey === currentRouterPath) return;
    const run = () => loadRouteDocument(routeKey).catch(() => {});

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 1200 + index * 120 });
    } else {
      window.setTimeout(run, 220 + index * 120);
    }
  });
};

const swapMainContent = async (
  routeKey,
  { historyMode = "push", resetScroll = true, reveal = true, restoreScrollY = null, hash = "" } = {}
) => {
  markRouteProfile("routeStart");
  const { nextDocument, nextMain } = await warmPage(routeKey);
  const currentMain = document.querySelector("#app");

  if (!nextMain || !currentMain) throw new Error("Missing main content");

  document.title = enableAppShellRouter ? getRouteTitle(routeKey) : nextDocument.title || getRouteTitle(routeKey);
  currentMain.className = nextMain.className;
  currentMain.innerHTML = nextMain.innerHTML;
  markRouteProfile("contentSwapComplete");

  // Scroll reset is synchronous with the content swap — both land in the same paint frame.
  // Moving it before `await warmPage` caused the old content to visibly snap to top
  // before the swap, which felt like a broken transition from scrolled-down positions.
  if (!hash && !Number.isFinite(restoreScrollY) && resetScroll) {
    instantScrollTo(0);
  }

  const historyUrl = buildShellUrl(routeKey, hash);

  if (historyMode === "push") {
    window.history.pushState({ path: historyUrl.href, routeKey, hash }, "", historyUrl.href);
  } else if (historyMode === "replace") {
    window.history.replaceState({ path: historyUrl.href, routeKey, hash }, "", historyUrl.href);
  }
  currentRouterPath = routeKey;

  // Update sidebar state synchronously before the reveal animation starts.
  // Without this, the nav active-state change (font-weight transition) fires mid-animation,
  // making the sidebar appear to blink as content fades in alongside a nav reflow.
  updateSidebarActiveState();

  await initPage({ reveal, root: currentMain, allowPrewarm: false });
  markRouteProfile("interactionInitializationComplete");

  if (!reveal) {
    markRouteProfile("revealStart");
    markRouteProfile("revealEnd");
    finishRouteProfile();
  }

  if (hash) {
    requestAnimationFrame(() => scrollToHash(hash));
  } else if (Number.isFinite(restoreScrollY)) {
    instantScrollTo(restoreScrollY);
  }
};

const initStaticRouter = () => {
  if (!enableAppShellRouter) {
    updateSidebarActiveState();
    return;
  }
  if (staticRouterInitialized) return;
  staticRouterInitialized = true;

  if (!window.history.pushState) {
    updateSidebarActiveState();
    return;
  }

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const initialShellUrl = buildShellUrl(currentRouterPath, window.location.hash);
  window.history.replaceState(
    { path: initialShellUrl.href, routeKey: currentRouterPath, hash: window.location.hash || "" },
    "",
    initialShellUrl.href
  );

  bindInternalRouteLinks(document);

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = getRouterLink(event);
    const hashUrl = getSamePageHashUrl(link);
    if (hashUrl) {
      event.preventDefault();
      if (window.location.hash) {
        const cleanUrl = buildShellUrl(currentRouterPath);
        window.history.replaceState(
          { path: cleanUrl.href, routeKey: currentRouterPath, hash: "" },
          "",
          cleanUrl.href
        );
      }
      scrollToHash(hashUrl.hash);
      setCaseNavActiveByHash(hashUrl.hash);
      return;
    }

    const routeInfo = getInternalRouteInfo(link);
    if (!routeInfo) return;
    handleInternalRouteClick(event, link);
  }, true);

  const warmLink = (event) => {
    if (enableAppShellRouter) return;
    const link = getRouterLink(event);
    const routeInfo = getInternalRouteInfo(link);
    if (!routeInfo || routeInfo.routeKey === currentRouterPath) return;
    loadRouteDocument(routeInfo.routeKey).catch(() => {});
  };

  document.addEventListener("pointerenter", warmLink, true);
  document.addEventListener("focusin", warmLink, true);

  window.addEventListener("popstate", (event) => {
    const url = new URL(window.location.href);
    const routeKey = getRouteKeyFromUrl(url);
    if (routeKey === currentRouterPath) {
      if (url.hash) scrollToHash(url.hash);
      return;
    }

    const restoreScrollY = Number.isFinite(event.state?.scrollY) ? event.state.scrollY : 0;
    swapMainContent(routeKey, {
      historyMode: "replace",
      resetScroll: false,
      reveal: false,
      restoreScrollY,
      hash: url.hash || ""
    }).catch((error) => {
      console.warn(`Unable to restore ${url.href} inside the app shell.`, error?.message || error);
      void fallbackToDesignContent();
    });
  });
};

const boot = () => {
  persistentSidebar = document.querySelector(".sidebar");
  initStaticRouter();
  void (async () => {
    if (!enableAppShellRouter) {
      await initPage({ root: getAppRoot(), allowPrewarm: false });
    } else if (currentRouterPath !== "design") {
      await swapMainContent(currentRouterPath, {
        historyMode: "replace",
        reveal: true,
        resetScroll: true,
        hash: window.location.hash || ""
      });
    } else {
      await initPage({ root: getAppRoot(), allowPrewarm: true });
    }
  })();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
