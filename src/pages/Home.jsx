import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import usePageReveal from "../hooks/usePageReveal";
import { loadBlueGuardian, loadNusIss, loadWildlight } from "../routeLoaders";
import { assetPath } from "../utils/paths";

const HOME_ENHANCED_MEDIA_DELAY_MS = 1500;

export default function Home() {
  const pageRef = useRef(null);
  const { transition } = useOutletContext();
  const [enhancedMediaReady, setEnhancedMediaReady] = useState(false);
  const shouldAnimateHome = !transition.isInitialLoad && transition.navigationType !== "POP";
  const homeHeroClassName = shouldAnimateHome
    ? "intro page-reveal-target page-reveal-grid page-reveal-home-hero"
    : "intro page-reveal-home-hero";
  const homeSectionClassName = shouldAnimateHome
    ? "project-grid page-reveal-target page-reveal-grid page-reveal-home-grid"
    : "project-grid page-reveal-home-grid";
  const homeRevealStyle = shouldAnimateHome
    ? { "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }
    : undefined;
  const revealTargets = useMemo(
    () => [
      { selector: ".page-reveal-home-hero", delay: 0 },
      { selector: ".page-reveal-home-grid", delay: 200 },
    ],
    [],
  );

  usePageReveal(pageRef, revealTargets, {
    play: shouldAnimateHome,
    revealKey: transition.routeKey,
  });

  const primeEnhancedMedia = useCallback(() => {
    setEnhancedMediaReady((current) => current || true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      primeEnhancedMedia();
      return undefined;
    }

    let timeoutId = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
          primeEnhancedMedia();
        }, { timeout: 1200 });
        return;
      }

      primeEnhancedMedia();
    }, HOME_ENHANCED_MEDIA_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [primeEnhancedMedia]);

  return (
    <div ref={pageRef}>
      <div className="home-page">
        <header
          className={homeHeroClassName}
          style={homeRevealStyle}
        >
          <h1>Christal Lyu</h1>
          <p>Product Manager @IBM Data, AI &amp; Automation</p>
        </header>

        <section
          className={homeSectionClassName}
          style={homeRevealStyle}
          aria-label="Selected work"
        >
          <article className="project-card">
            <a
              className="project-media concept-media concept-ibm"
              href="https://www.ibm.com/products/decision-intelligence"
              target="_blank"
              rel="noreferrer"
              aria-label="Open IBM Decision Intelligence in a new tab"
              onPointerEnter={primeEnhancedMedia}
              onFocus={primeEnhancedMedia}
            >
              <div className="concept-layer concept-layer-cover ibm-cover">
                <picture>
                  <source media="(prefers-color-scheme: dark)" srcSet={assetPath("/assets/ibm-logo-white-rgb-crop.png")} />
                  <img
                    className="brand-logo ibm-logo ibm-logo-theme"
                    src={assetPath("/assets/ibm-logo-blue-rgb.png")}
                    alt="IBM"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                    data-home-critical-image
                  />
                </picture>
              </div>
              {enhancedMediaReady ? (
                <div className="concept-layer concept-layer-hover ibm-hover" aria-hidden="true">
                  <div className="ibm-watson-pill">watsonx.ai</div>
                  <div className="ibm-artifact ibm-artifact-orbit">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                </div>
              ) : null}
            </a>
            <h2>IBM, Decision Intelligence </h2>
            <p>Turn business policies into AI-authored decisions. </p>
          </article>

          <article className="project-card">
            <Link
              className="project-media concept-media concept-accenture-artifact"
              to="/projects/wildlight/"
              aria-label="Open Wildlight AI at Accenture"
              onPointerEnter={() => {
                primeEnhancedMedia();
                void loadWildlight();
              }}
              onFocus={() => {
                primeEnhancedMedia();
                void loadWildlight();
              }}
            >
              <div className="concept-layer concept-layer-cover accenture-reveal-base"></div>
              <div className="accenture-brand-lockup" aria-hidden="true">
                <img
                  className="brand-logo accenture-reveal-logo"
                  src={assetPath("/assets/accenture-logo-raster.png")}
                  alt="Accenture"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  data-home-critical-image
                />
                <picture>
                  <source media="(prefers-color-scheme: dark)" srcSet={assetPath("/assets/wildlight-logo-light-crop.png")} />
                  <img
                    className="brand-logo wildlight-support-logo wildlight-support-logo-theme"
                    src={assetPath("/assets/wildlight-logo-raster.png")}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                    data-home-critical-image
                  />
                </picture>
              </div>
              {enhancedMediaReady ? (
                <div className="concept-layer concept-layer-hover accenture-reveal-details" aria-hidden="true">
                  <img
                    className="wildlight-component wildlight-component-heading"
                    src={assetPath("/assets/wildlight-ai-heading.svg")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                  />
                  <img
                    className="wildlight-component wildlight-component-impact wildlight-component-impact-light"
                    src={assetPath("/assets/wildlight-impact-cards.svg")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                  />
                  <img
                    className="wildlight-component wildlight-component-impact wildlight-component-impact-dark"
                    src={assetPath("/assets/wildlight-impact-cards-dark.svg")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                  />
                  <img
                    className="wildlight-component wildlight-component-prep"
                    src={assetPath("/assets/wildlight-prep-complete-large.svg")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                  />
                  <img
                    className="wildlight-component wildlight-component-chip wildlight-component-chip-grow"
                    src={assetPath("/assets/wildlight-grow-food.svg")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                  />
                  <img
                    className="wildlight-component wildlight-component-chip wildlight-component-chip-sun"
                    src={assetPath("/assets/wildlight-hover-state.svg")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                  />
                  <img
                    className="wildlight-component wildlight-component-chip wildlight-component-chip-sandy"
                    src={assetPath("/assets/wildlight-sandy.svg")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                  />
                </div>
              ) : null}
            </Link>
            <h2>Accenture, Wildlight AI</h2>
            <p>Make ecological restoration accessible to homeowners.</p>
          </article>

          <article className="project-card">
            <Link
              className="project-media neutral-product-media neutral-product-b2b"
              to="/projects/blue-guardian/"
              aria-label="Open Blue Guardian"
              onPointerEnter={() => {
                primeEnhancedMedia();
                void loadBlueGuardian();
              }}
              onFocus={() => {
                primeEnhancedMedia();
                void loadBlueGuardian();
              }}
            >
              <picture>
                <source media="(prefers-color-scheme: dark)" srcSet={assetPath("/assets/blue-guardian-cover-dark-home.png")} />
                <img
                  className="project-image project-image-cover project-image-theme"
                  src={assetPath("/assets/blue-guardian-cover-light-home.png")}
                  alt="Blue Guardian product interface on desktop"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  data-home-critical-image
                />
              </picture>
              {enhancedMediaReady ? (
                <picture>
                  <source media="(prefers-color-scheme: dark)" srcSet={assetPath("/assets/blue-guardian-hover-dark-home.png")} />
                  <img
                    className="project-image project-image-hover project-image-hover-theme"
                    src={assetPath("/assets/blue-guardian-hover-light-home.png")}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                  />
                </picture>
              ) : null}
            </Link>
            <h2>Blue Guardian, Conversational AI</h2>
            <p>Build trust in the first 30 seconds of AI support.</p>
          </article>

          <article className="project-card">
            <Link
              className="project-media concept-media concept-nus"
              to="/projects/nus-iss/"
              aria-label="Open Design and Research at NUS-ISS"
              onPointerEnter={() => {
                primeEnhancedMedia();
                void loadNusIss();
              }}
              onFocus={() => {
                primeEnhancedMedia();
                void loadNusIss();
              }}
            >
              <div className="concept-layer concept-layer-cover">
                <picture>
                  <source media="(prefers-color-scheme: dark)" srcSet={assetPath("/assets/nus-logo-light.svg")} />
                  <img
                    className="brand-logo brand-logo-nus brand-logo-nus-single brand-logo-nus-theme"
                    src={assetPath("/assets/nus-logo.svg")}
                    alt="NUS"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                    data-home-critical-image
                  />
                </picture>
              </div>
              {enhancedMediaReady ? (
                <div className="concept-layer concept-layer-hover" aria-hidden="true">
                  <div className="nus-research-card nus-research-card-chart">
                    <svg viewBox="0 0 160 92" aria-hidden="true">
                      <path className="nus-chart-grid" d="M10 20H150M10 42H150M10 64H150" />
                      <path
                        className="nus-chart-line-a"
                        d="M14 68C32 54 44 58 60 43S93 31 109 39 132 50 148 28"
                      />
                      <path
                        className="nus-chart-line-b"
                        d="M14 54C31 47 43 36 61 39S90 56 107 48 130 31 148 36"
                      />
                    </svg>
                  </div>
                  <div className="nus-research-card nus-research-card-notes">
                    <strong></strong>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="nus-research-card nus-research-card-cluster">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                </div>
              ) : null}
            </Link>
            <h2>NUS, Blended Learning Programmes</h2>
            <p>Optimize professional training for global learners.</p>
          </article>
        </section>
      </div>
    </div>
  );
}
