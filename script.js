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
    if (isCasePage && section.classList.contains("case-nav")) return 120;
    return Math.min(index * 96, 288);
  };

  const getDuration = (section) => {
    const cssDuration =
      Number.parseFloat(getComputedStyle(section).getPropertyValue("--reveal-duration")) || 940;

    if (prefersReducedMotion) return cssDuration;
    if (isCasePage && section.classList.contains("case-nav")) return 920;
    return 940;
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

  if (!root) {
    markRouteProfile("revealEnd");
    finishRouteProfile();
    return;
  }

  root.classList.remove("route-transition-reveal");
  void root.offsetWidth;
  root.classList.add("route-transition-reveal");

  const handleAnimationEnd = () => {
    root.classList.remove("route-transition-reveal");
    markRouteProfile("revealEnd");
    finishRouteProfile();
  };

  root.addEventListener("animationend", handleAnimationEnd, { once: true });
};

const playRouteContentExit = (root = getAppRoot()) =>
  new Promise((resolve) => {
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resolve();
      return;
    }

    root.classList.remove("route-transition-reveal");
    root.classList.remove("route-transition-exit");
    void root.offsetWidth;
    root.classList.add("route-transition-exit");

    const finish = () => {
      root.classList.remove("route-transition-exit");
      resolve();
    };

    root.addEventListener("animationend", finish, { once: true });
  });

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

const logRouter = (...args) => {
  console.log("[router]", ...args);
};

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
    absoluteUrl(`assets/blogs/03-cover-${variant}.png`)
  ].filter(Boolean);
};

const warmAboutPriorityImages = () =>
  Promise.all(getAboutPriorityImageSources().map(preloadImage)).catch(() => {});

const getAboutVisibleImages = (root) => {
  const selector = prefersDarkMode()
    ? ".about-photo, .blog-image-cover.blog-image-dark"
    : ".about-photo, .blog-image-cover.blog-image-light";
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

const updateSidebarActiveState = (routeKey = currentRouterPath) => {
  const section = routeKey === "about" ? "about" : "design";

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
  await preparePageMedia(root);
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

const assertSidebarPersistence = (before, after) => {
  console.assert(before === after, "Sidebar was replaced. This is wrong.");
  logRouter("sidebar identity before/after", before === after);
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

  logRouter("router intercepted route click");
  logRouter("route name", routeInfo.routeKey);
  event.preventDefault();
  event.stopPropagation();
  logRouter("preventDefault called", true);

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
  const currentMain = document.querySelector("#app");
  if (reveal) {
    await playRouteContentExit(currentMain);
  }
  const { nextDocument, nextMain } = await warmPage(routeKey);
  const sidebarBefore = persistentSidebar || document.querySelector(".sidebar");

  if (!nextMain || !currentMain) throw new Error("Missing main content");

  document.title = enableAppShellRouter ? getRouteTitle(routeKey) : nextDocument.title || getRouteTitle(routeKey);
  currentMain.className = nextMain.className;
  currentMain.innerHTML = nextMain.innerHTML;
  markRouteProfile("contentSwapComplete");

  const historyUrl = buildShellUrl(routeKey, hash);

  if (historyMode === "push") {
    window.history.pushState({ path: historyUrl.href, routeKey, hash }, "", historyUrl.href);
  } else if (historyMode === "replace") {
    window.history.replaceState({ path: historyUrl.href, routeKey, hash }, "", historyUrl.href);
  }
  currentRouterPath = routeKey;

  await initPage({ reveal: false, root: currentMain, allowPrewarm: false });
  markRouteProfile("interactionInitializationComplete");

  const sidebarAfter = document.querySelector(".sidebar");
  assertSidebarPersistence(sidebarBefore, sidebarAfter);

  if (reveal) {
    playRouteContentReveal(currentMain);
  } else {
    markRouteProfile("revealStart");
    markRouteProfile("revealEnd");
    finishRouteProfile();
  }

  if (hash) {
    requestAnimationFrame(() => scrollToHash(hash));
  } else if (Number.isFinite(restoreScrollY)) {
    instantScrollTo(restoreScrollY);
  } else if (resetScroll) {
    window.scrollTo(0, 0);
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

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      const domReadyCount = Number(window.sessionStorage?.getItem("domcontentloaded-count") || "0") + 1;
      window.sessionStorage?.setItem("domcontentloaded-count", String(domReadyCount));
      logRouter("DOMContentLoaded fired", domReadyCount);
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
    },
    { once: true }
  );
} else {
  const domReadyCount = Number(window.sessionStorage?.getItem("domcontentloaded-count") || "0") + 1;
  window.sessionStorage?.setItem("domcontentloaded-count", String(domReadyCount));
  logRouter("DOMContentLoaded fired", domReadyCount);
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
}
