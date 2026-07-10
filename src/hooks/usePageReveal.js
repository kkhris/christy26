import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function usePageReveal(containerRef, targets, options = {}) {
  const { play = true, revealKey = "default" } = options;

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const container = containerRef.current;

    if (!container || !Array.isArray(targets) || targets.length === 0) {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = targets
      .map(({ selector, delay = 0 }) => {
        const element = container.querySelector(selector);
        if (!element) {
          return null;
        }

        element.style.setProperty("--page-reveal-delay", `${delay}ms`);
        return element;
      })
      .filter(Boolean);

    if (elements.length === 0) {
      return undefined;
    }

    if (reducedMotion || !play) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => {
        elements.forEach((element) => {
          element.classList.remove("is-visible");
          element.style.removeProperty("--page-reveal-delay");
        });
      };
    }

    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        elements.forEach((element) => element.classList.add("is-visible"));
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      elements.forEach((element) => {
        element.classList.remove("is-visible");
        element.style.removeProperty("--page-reveal-delay");
      });
    };
  }, [containerRef, play, revealKey, targets]);
}
