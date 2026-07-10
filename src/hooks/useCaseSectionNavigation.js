import { useCallback, useEffect, useState } from "react";
import { smoothScrollWithinContainer } from "../utils/scroll";

export default function useCaseSectionNavigation({ pageRef, scrollRootRef, sectionLinks }) {
  const [activeSection, setActiveSection] = useState(sectionLinks[0]?.id ?? "");

  useEffect(() => {
    const page = pageRef.current;
    if (!page) {
      return undefined;
    }

    const scrollRoot = page.closest(".app-main");
    const sections = sectionLinks
      .map(({ id }) => page.querySelector(`#${id}`))
      .filter(Boolean);

    if (!scrollRoot || sections.length === 0) {
      return undefined;
    }

    const visibleSections = new Map();

    const updateActiveSection = () => {
      const [nextActive] = [...visibleSections.entries()].sort((left, right) => {
        if (left[1].top === right[1].top) {
          return right[1].ratio - left[1].ratio;
        }

        return left[1].top - right[1].top;
      });

      if (nextActive) {
        setActiveSection((current) => (current === nextActive[0] ? current : nextActive[0]));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { id } = entry.target;

          if (entry.isIntersecting) {
            visibleSections.set(id, {
              top: entry.boundingClientRect.top,
              ratio: entry.intersectionRatio,
            });
          } else {
            visibleSections.delete(id);
          }
        });

        updateActiveSection();
      },
      {
        root: scrollRoot,
        rootMargin: "-12% 0px -58% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      visibleSections.clear();
    };
  }, [pageRef, sectionLinks]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) {
      return;
    }

    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, "", `${pathname}${search}`);
  }, []);

  const handleSectionNavigation = useCallback(
    (event, sectionId) => {
      event.preventDefault();

      const page = pageRef.current;
      const scrollRoot = scrollRootRef?.current;
      const targetSection = page?.querySelector(`#${sectionId}`);

      if (!page || !scrollRoot || !targetSection) {
        return;
      }

      const scrollRootTop = scrollRoot.getBoundingClientRect().top;
      const targetTop =
        scrollRoot.scrollTop + targetSection.getBoundingClientRect().top - scrollRootTop - 32;

      setActiveSection(sectionId);
      smoothScrollWithinContainer(scrollRoot, Math.max(targetTop, 0));
    },
    [pageRef, scrollRootRef],
  );

  return { activeSection, handleSectionNavigation };
}
