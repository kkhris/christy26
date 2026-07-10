import { useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import ArrowIcon from "../../components/ArrowIcon";
import { FooterArrow, SpotifyIcon } from "../../components/CaseFooterIcons";
import useCaseSectionNavigation from "../../hooks/useCaseSectionNavigation";
import usePageReveal from "../../hooks/usePageReveal";
import { assetPath } from "../../utils/paths";

export default function Wildlight() {
  const pageRef = useRef(null);
  const { scrollRootRef, transition } = useOutletContext();
  const [comparisonState, setComparisonState] = useState("after");

  const sectionLinks = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "problems", label: "Problem" },
      { id: "decision-01", label: "Scope Reset", index: "01" },
      { id: "decision-02", label: "AI Pivot", index: "02" },
      { id: "decision-03", label: "Action Gap", index: "03" },
      { id: "outcome", label: "Outcome" },
      { id: "reflections", label: "Reflections" },
    ],
    [],
  );

  const revealTargets = useMemo(
    () => [
      { selector: ".page-reveal-case-intro", delay: 0 },
      { selector: ".page-reveal-case-nav", delay: 200 },
      { selector: ".page-reveal-case-study", delay: 200 },
    ],
    [],
  );

  const { activeSection, handleSectionNavigation } = useCaseSectionNavigation({
    pageRef,
    scrollRootRef,
    sectionLinks,
  });

  usePageReveal(pageRef, revealTargets, { revealKey: transition.routeKey });

  return (
    <main ref={pageRef} className="case-page wildlight-page">
      <nav
        className="case-nav page-reveal-target page-reveal-case-nav"
        style={{ "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }}
        aria-label="Case study sections"
      >
        {sectionLinks.map(({ id, label, index }) => (
          <a
            key={id}
            className={`${index ? "case-nav-child " : ""}${activeSection === id ? "is-active" : ""}`.trim()}
            href={`#${id}`}
            aria-current={activeSection === id ? "location" : undefined}
            onClick={(event) => handleSectionNavigation(event, id)}
          >
            {index ? <span className="case-nav-index">{index}</span> : null}
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="wildlight-case-content">
        <div
          className="case-intro-group page-reveal-target page-reveal-case-intro"
          style={{ "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }}
        >
          <header className="intro case-hero">
            <h1>Accenture, Wildlight AI</h1>
            <p>Making ecological restoration accessible to homeowners.</p>
          </header>

          <dl className="case-meta" aria-label="Project metadata">
            <div>
              <dt>Role</dt>
              <dd>Product Manager</dd>
            </div>
            <div>
              <dt>Team</dt>
              <dd>3 Designers, 3 Developers, 1 Product Manager</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>Jan - April 2026</dd>
            </div>
          </dl>
        </div>

        <article
          className="case-study page-reveal-target page-reveal-case-study"
          style={{ "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }}
        >
          <section id="overview" className="case-section">
            <p>
              In early 2026, our team inherited a half-built prototype and a brief that had more ambition than
              direction. Four months later, we shipped Wildlight — a RAG-powered AI web app that turns private
              yards into connected pollinator habitats.
            </p>
            <p>
              Wildlight soft-launched in April 2026, and it was showcased at Web Summit Vancouver in May 2026.
              It&apos;s now live{" "}
              <a
                className="case-inline-link"
                href="https://wildlight-fe.onrender.com/"
                target="_blank"
                rel="noreferrer"
              >
                here
                <ArrowIcon />
              </a>
              .
            </p>

            <figure className="case-video">
              <iframe
                src="https://www.youtube.com/embed/Mx1fnk3RXLs?autoplay=1&mute=1&loop=1&playlist=Mx1fnk3RXLs&controls=1&playsinline=1&rel=0&modestbranding=1"
                title="Wildlight AI demo video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </figure>
            <a
              className="case-video-link"
              href="https://www.youtube.com/watch?v=Mx1fnk3RXLs"
              target="_blank"
              rel="noreferrer"
            >
              <span className="case-video-link-flower" aria-hidden="true">
                ✿
              </span>
              Watch full video
              <ArrowIcon />
            </a>
          </section>

          <section id="problems" className="case-section">
            <h2>Problem</h2>
            <p>
              Many gardeners are actively trying to support local biodiversity by converting lawns, seeking out
              native plants, and making space for pollinators. The interest is growing. What isn&apos;t keeping up is
              accessible, tailored guidance.
            </p>
            <p>
              Native pollinator gardening requires site-specific expertise: which species suit your soil, your
              sun, your region. Generic resources fail to answer these questions, and localized ecological
              expertise is hard to access. As a result, most people give up before a single plant goes in the
              ground.
            </p>
            <p>
              Accenture had already recognized this gap and started building toward it. When we picked it up, we
              discovered more.
            </p>
          </section>

        <section id="decision-01" className="case-section">
          <p className="case-kicker">Decision 01</p>
          <h2>Cutting Scope to Ship</h2>
          <p>
            The inherited prototype had features spread across too many directions with no clear north star.
            Before deciding what to build, we needed to understand what was worth building:
          </p>
          <div className="case-process">
            <div>
              <span>01</span>
              <h3>User Research</h3>
              <p>Interviewed gardeners across experience levels and synthesized recurring blockers.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Technical Feasibility</h3>
              <p>Evaluated AI recommendation approaches and RAG as a grounding mechanism.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Scope Prioritization</h3>
              <p>Prioritized the product requirements to define a MVP baseline for launch.</p>
            </div>
          </div>
          <p>
            The original brief contained more ideas than the timeline could realistically support. 
            Rather than carrying that risk into development, we defined a launch scope of 6 core features, 
            moved 5 into a structured backlog, and reserved 2 as stretch goals.
          </p>
          <div className="case-image-grid" aria-label="Usability testing cycle images">
            <figure className="case-image-slot">
              <img
                src={assetPath("/assets/wildlight-scope-reset-01.jpg")}
                alt="Wildlight demo setup at Web Summit Vancouver"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figure className="case-image-slot">
              <img
                src={assetPath("/assets/wildlight-scope-reset-02.jpg")}
                alt="Wildlight usability testing conversation"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
          <p>
            To reduce delivery risk and keep the roadmap honest, we built two usability testing cycles into the development plan as decision gates. With executive alignment secured on this structure, we moved forward with a shared
            definition of done.
          </p>
        </section>

        <section id="decision-02" className="case-section">
          <p className="case-kicker">Decision 02</p>
          <h2>Leading With AI</h2>
          <p>
            The original product direction placed AI after the intake. Users completed a static questionnaire about their yard before receiving any guidance. The flow assumed they could accurately describe their yard conditions. 
            It looked like a form, so users treated it like one.
          </p>
          <div className="case-stats">
            <div>
              <strong>13/20</strong>
              <span>couldn&apos;t answer a required question about their own garden</span>
            </div>
            <div>
              <strong>8/20</strong>
              <span>entered inaccurate answers just to keep moving forward</span>
            </div>
          </div>
          <p className="case-source">Usability testing, Feb 9, 2026 · n = 20</p>
          <p>
            We restructured the experience around a different assumption, moving the AI to the very first interaction.
            Instead of a rigid questionnaire, the AI now acts as a conversational guide, helping users assess
            their yard conditions accurately before generating any recommendations.
          </p>
          <div className="case-flow" aria-label="Product direction flow">
            <div className="case-flow-step case-flow-start">
              <span className="case-flow-badge">AI starts here</span>
              <strong>1</strong>
              <p>
                Site
                <br />
                Assessment
              </p>
            </div>
            <i></i>
            <div className="case-flow-step case-flow-new">
              <strong>2</strong>
              <p>
                AI
                <br />
                Exploration
              </p>
              <em>new</em>
            </div>
            <i className="case-flow-dashed"></i>
            <div className="case-flow-step case-flow-original">
              <span className="case-flow-badge case-flow-badge-muted">AI used to start here</span>
              <strong>3</strong>
              <p>
                Plan
                <br />
                Suggestions
              </p>
            </div>
            <i></i>
            <div className="case-flow-step case-flow-muted">
              <strong>4</strong>
              <p>
                Export
                <br />
                Plan
              </p>
            </div>
          </div>
          <p className="case-flow-note">
            The new flow eliminated blind guessing and provided the RAG engine with the exact site data needed
            to succeed. Users who engaged with it rated the interaction 4.5 out of 5 on naturalness.
          </p>
        </section>

        <section id="decision-03" className="case-section">
          <p className="case-kicker">Decision 03</p>
          <h2>From Plan to Action</h2>
          <p>
            Generating a plan does not mean the questions stop. Users reached the final page facing questions about unfamiliar plant species, maintenance requirements, and next steps.
          </p>
          <div className="case-insight">
            <p>
              In usability testing, users who engaged with the AI chat rated it <span>most valuable,</span> but
              it ranked <span>last in discoverability</span> of any feature on the plan page.
            </p>
          </div>
          <p className="case-source">Usability testing, March 10, 2026 · n = 20</p>
          <p>
           We had spent weeks building an AI assistant users valued, only to discover most of them never found it. The product treated plan generation as the end of the journey, 
           even though users needed the most support after receiving their plan.
          </p>
          <figure className="case-comparison">
            <div className="case-comparison-toolbar" aria-label="Plan page comparison controls">
              <span></span>
              <div className="case-comparison-toggle" role="group" aria-label="Toggle plan page screenshot">
                <button
                  type="button"
                  className={comparisonState === "after" ? "is-active" : undefined}
                  aria-pressed={comparisonState === "after"}
                  onClick={() => setComparisonState("after")}
                >
                  After
                </button>
                <button
                  type="button"
                  className={comparisonState === "before" ? "is-active" : undefined}
                  aria-pressed={comparisonState === "before"}
                  onClick={() => setComparisonState("before")}
                >
                  Before
                </button>
              </div>
            </div>
            <div className="case-comparison-frame" data-current={comparisonState}>
              <img
                className="case-comparison-image case-comparison-before"
                src={assetPath("/assets/wildlight-plan-before.png")}
                alt="Original Wildlight plan page before the embedded chat panel"
                loading="lazy"
                decoding="async"
              />
              <img
                className="case-comparison-image case-comparison-after"
                src={assetPath("/assets/wildlight-plan-after.png")}
                alt="Wildlight plan page with the embedded AI chat panel"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>
          <p>
            After aligning the team on what that gap was costing us, we embedded the AI chat directly into the plan experience. Users no longer had to leave their plan to get help, 
            creating a continuous path from site assessment to implementation.
          </p>
        </section>

        <section id="outcome" className="case-section case-outcome">
          <h2>The Outcome</h2>
          <p>
            Our team delivered 6 core features and 2 stretch features within a 4-month development
            cycle. Following its initial rollout in April 2026, Wildlight was showcased at Web Summit Vancouver
            in May 2026. You can interact with the live product{" "}
            <a
              className="case-inline-link"
              href="https://wildlight-fe.onrender.com/"
              target="_blank"
              rel="noreferrer"
            >
              here
              <ArrowIcon />
            </a>
            .
          </p>

          <div className="case-outcome-images" aria-label="Web Summit Vancouver 2026 image placeholders">
            <figure className="case-outcome-card">
              <img
                src={assetPath("/assets/websumit01.jpg")}
                alt="Wildlight booth at Web Summit Vancouver 2026"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figure className="case-outcome-card">
              <img
                src={assetPath("/assets/websumit02.jpg")}
                alt="Wildlight team at Web Summit Vancouver 2026"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>

          <div className="case-outcome-stats" aria-label="Wildlight outcome metrics">
            <div>
              <strong>50%</strong>
              <span>faster task completion with conversational AI</span>
            </div>
            <div>
              <strong>2+</strong>
              <span>validation cycles completed before launch</span>
            </div>
            <div>
              <strong>0 - 1</strong>
              <span>product built and shipped in a 4-month development cycle</span>
            </div>
          </div>
        </section>

        <section id="reflections" className="case-section case-reflections">
          <h2>Reflections</h2>

          <div className="case-reflection">
            <div>
              <h3>In AI products, intake is the product.</h3>
              <p>
                A frictionless UI means nothing if it collects bad data. If users guess their way through
                questions they don&apos;t understand, the AI has nothing reliable to work with. The intake
                experience determines the quality of everything that comes after.
              </p>
            </div>
          </div>

          <div className="case-reflection">
            <div>
              <h3>A deadline is also a scope decision.</h3>
              <p>
                Saying yes to a timeline means saying no to scope early and explicitly. Without a shared
                definition of done, design optimizes for polish while engineering optimizes for completion. Hard
                boundaries are what keep a team building the same product.
              </p>
            </div>
          </div>

          <div className="case-reflection">
            <div>
              <h3>Users won&apos;t stop to learn. They&apos;ll guess.</h3>
              <p>
                If a product requires knowledge users don&apos;t have, they won&apos;t pause to acquire it.
                They&apos;ll choose the most plausible answer and move on. Products should start where user knowledge ends, not where domain expertise begins.
              </p>
            </div>
          </div>
        </section>

        <div className="case-footer" aria-label="Case study footer">
          <a
            className="case-footer-link case-footer-link-prev"
            href="https://www.ibm.com/products/decision-intelligence"
            target="_blank"
            rel="noreferrer"
          >
            <FooterArrow direction="left" />
            <span>IBM</span>
          </a>

          <p className="case-footer-meta">
            Last updated May 30 · Listening to{" "}
            <a
              className="case-footer-soundtrack"
              href="https://open.spotify.com/search/Jasmine%20DPR%20LIVE"
              target="_blank"
              rel="noreferrer"
            >
              <span className="case-footer-soundtrack-title">Jasmine by DPR LIVE</span>
            </a>
            <SpotifyIcon />
          </p>

          <Link className="case-footer-link case-footer-link-next" to="/projects/blue-guardian">
            <span>Blue Guardian</span>
            <FooterArrow />
          </Link>
        </div>
        </article>
      </div>
    </main>
  );
}
