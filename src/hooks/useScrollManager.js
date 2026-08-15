import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { resetScrollPosition } from "../utils/scroll";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const SCROLL_STORAGE_PREFIX = "app-scroll:";
const HOME_RETURN_SCROLL_KEY = `${SCROLL_STORAGE_PREFIX}return:/`;

export default function useScrollManager(scrollRef) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const activePathnameRef = useRef(location.pathname);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined" || !window.history) {
      return undefined;
    }

    const previousMode = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousMode;
    };
  }, []);

  useEffect(() => {
    const scrollRoot = scrollRef.current;

    if (!scrollRoot || typeof window === "undefined") {
      return undefined;
    }

    const savePosition = () => {
      window.sessionStorage.setItem(
        `${SCROLL_STORAGE_PREFIX}${activePathnameRef.current}`,
        String(scrollRoot.scrollTop),
      );
    };

    savePosition();
    scrollRoot.addEventListener("scroll", savePosition, { passive: true });

    return () => {
      savePosition();
      scrollRoot.removeEventListener("scroll", savePosition);
    };
  }, [scrollRef]);

  useIsomorphicLayoutEffect(() => {
    const scrollRoot = scrollRef.current;
    let frame = 0;
    let retryFrame = 0;
    let resizeObserver;

    if (!scrollRoot) {
      return undefined;
    }

    const previousPathname = activePathnameRef.current;
    const isHistoryRestore =
      previousPathname !== location.pathname && navigationType === "POP";

    if (typeof window !== "undefined" && previousPathname !== location.pathname) {
      window.sessionStorage.setItem(
        `${SCROLL_STORAGE_PREFIX}${previousPathname}`,
        String(scrollRoot.scrollTop),
      );
    }

    activePathnameRef.current = location.pathname;

    const restoreTop = () => {
      resetScrollPosition(scrollRoot);
    };

    const restoreSaved = (storageKey = `${SCROLL_STORAGE_PREFIX}${location.pathname}`) => {
      if (typeof window === "undefined") {
        restoreTop();
        return;
      }

      const savedTop = window.sessionStorage.getItem(storageKey);
      const parsedTop = savedTop === null ? NaN : Number(savedTop);

      if (Number.isFinite(parsedTop)) {
        const applySavedPosition = () => {
          scrollRoot.scrollTop = parsedTop;
          scrollRoot.scrollLeft = 0;
        };

        const maxScrollableTop = () =>
          Math.max(scrollRoot.scrollHeight - scrollRoot.clientHeight, 0);

        const restoreWhenReady = (attempt = 0) => {
          applySavedPosition();

          if (scrollRoot.scrollTop >= parsedTop - 1) {
            return;
          }

          if (attempt >= 24) {
            return;
          }

          retryFrame = window.requestAnimationFrame(() => {
            restoreWhenReady(attempt + 1);
          });
        };

        restoreWhenReady();

        if (
          typeof window.ResizeObserver !== "undefined" &&
          maxScrollableTop() < parsedTop
        ) {
          resizeObserver = new window.ResizeObserver(() => {
            if (maxScrollableTop() >= parsedTop) {
              applySavedPosition();
              resizeObserver?.disconnect();
              resizeObserver = undefined;
            }
          });
          resizeObserver.observe(scrollRoot);
        }

        return;
      }

      restoreTop();
    };

    const shouldRestoreHomeReturnScroll =
      isHistoryRestore &&
      location.pathname === "/" &&
      previousPathname.startsWith("/projects/");

    if (shouldRestoreHomeReturnScroll) {
      restoreSaved(HOME_RETURN_SCROLL_KEY);
    } else if (isHistoryRestore) {
      restoreSaved();
    } else {
      restoreTop();
    }

    if (typeof window === "undefined") {
      return;
    }

    frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (isHistoryRestore) {
          if (shouldRestoreHomeReturnScroll) {
            restoreSaved(HOME_RETURN_SCROLL_KEY);
          } else {
            restoreSaved();
          }
        } else {
          restoreTop();
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(retryFrame);
      resizeObserver?.disconnect();
    };
  }, [location.pathname, navigationType, scrollRef]);
}
