import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { resetScrollPosition } from "../utils/scroll";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const SCROLL_STORAGE_PREFIX = "app-scroll:";

export default function useScrollManager(scrollRef) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPathnameRef = useRef(location.pathname);

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
    const storageKey = `${SCROLL_STORAGE_PREFIX}${location.pathname}`;

    if (!scrollRoot || typeof window === "undefined") {
      return undefined;
    }

    const savePosition = () => {
      window.sessionStorage.setItem(storageKey, String(scrollRoot.scrollTop));
    };

    savePosition();
    scrollRoot.addEventListener("scroll", savePosition, { passive: true });

    return () => {
      savePosition();
      scrollRoot.removeEventListener("scroll", savePosition);
    };
  }, [location.pathname, scrollRef]);

  useIsomorphicLayoutEffect(() => {
    const scrollRoot = scrollRef.current;

    if (!scrollRoot) {
      return;
    }

    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = location.pathname;
    const isHistoryRestore =
      previousPathname !== location.pathname && navigationType === "POP";

    const restoreTop = () => {
      resetScrollPosition(scrollRoot);
    };

    const restoreSaved = () => {
      if (typeof window === "undefined") {
        restoreTop();
        return;
      }

      const savedTop = window.sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}${location.pathname}`);
      const parsedTop = savedTop === null ? NaN : Number(savedTop);

      if (Number.isFinite(parsedTop)) {
        scrollRoot.scrollTo({
          top: parsedTop,
          left: 0,
          behavior: "auto",
        });
        return;
      }

      restoreTop();
    };

    if (isHistoryRestore) {
      restoreSaved();
    } else {
      restoreTop();
    }

    if (typeof window === "undefined") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (isHistoryRestore) {
          restoreSaved();
        } else {
          restoreTop();
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [location.pathname, navigationType, scrollRef]);
}
