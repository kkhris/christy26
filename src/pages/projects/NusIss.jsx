import { useMemo, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import ArrowIcon from "../../components/ArrowIcon";
import { FooterArrow, SpotifyIcon } from "../../components/CaseFooterIcons";
import useCaseSectionNavigation from "../../hooks/useCaseSectionNavigation";
import usePageReveal from "../../hooks/usePageReveal";
import { assetPath } from "../../utils/paths";

export default function NusIss() {
  const pageRef = useRef(null);
  const { scrollRootRef, transition } = useOutletContext();
  const sectionLinks = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "problems", label: "Problem" },
      { id: "decision-01", label: "Audience Fit", index: "01" },
      { id: "decision-02", label: "Learning Fit", index: "02" },
      { id: "decision-03", label: "Feedback to Action", index: "03" },
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
    <main ref={pageRef} className="case-page nus-iss-page">
      <div
        className="case-intro-group page-reveal-target page-reveal-case-intro"
        style={{ "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }}
      >
        <header className="intro case-hero">
          <h1>NUS, Blended Learning Programmes</h1>
          <p>Designing blended-learning content and feedback systems for NUS-ISS.</p>
        </header>

        <dl className="case-meta" aria-label="Project metadata">
          <div>
            <dt>Role</dt>
            <dd>Research Assistant</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>4 Senior Lecturers, 1 Research Assistant</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>May - August 2023</dd>
          </div>
        </dl>
      </div>

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

      <article
        className="case-study page-reveal-target page-reveal-case-study"
        style={{ "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }}
      >
        <section id="overview" className="case-section">
          <p>
            In the summer of 2023, I joined the Institute of Systems Science at the National University of Singapore, one of Asia&apos;s top-ranked institutions, as a Digital Innovation and Design Research Assistant.
          </p>
          <p>
            Working alongside 4 senior lecturers, I drove curriculum and experience design for 2,000+ working professionals across government, finance, and enterprise, with outputs adopted into all subsequent programme runs.
          </p>
          <figure className="case-video">
            <iframe
              src="https://www.youtube.com/embed/y2ZfXlgEaJc?autoplay=1&mute=1&loop=1&playlist=y2ZfXlgEaJc&controls=1&playsinline=1&rel=0&modestbranding=1"
              title="NUS-ISS demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </figure>
          <a
            className="case-video-link"
            href="https://www.youtube.com/watch?v=y2ZfXlgEaJc"
            target="_blank"
            rel="noreferrer"
          >
            <span className="case-video-link-flower" aria-hidden="true">✿</span>
            Watch full video
            <ArrowIcon />
          </a>
        </section>

        <section id="problems" className="case-section">
          <h2>Problem</h2>
          <p>
            Blended learning for working professionals sits in an awkward middle ground. Learners arrive motivated, but generic content and a lack of personalised feedback quickly erode that. Most programmes have no way of knowing when, or why, engagement drops off.
          </p>
          <p>
            NUS-ISS had experience running online courses, but for students, not professionals. As blended learning expanded to serve working professionals, the team faced a different challenge: designing for learners with fundamentally different goals, constraints, and expectations.
          </p>
        </section>

        <section id="decision-01" className="case-section">
          <p className="case-kicker">Decision 01</p>
          <h2>Defining the Audience</h2>
          <p>
            Early conversations with learners and programme staff highlighted a different set of needs and expectations. Unlike full-time students, working professionals learn after hours, balance jobs and personal commitments, and expect content they can apply immediately.
          </p>

          <div className="case-compare-card" aria-label="Student learner and working professional comparison">
            <section className="case-compare-column" aria-labelledby="nus-student-learner">
              <h3 id="nus-student-learner">Student Learner</h3>
              <ul className="case-compare-list">
                <li><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.25" /><path d="M10 6.4v3.9l2.5 1.5" /></svg><span>Dedicated study time</span></li>
                <li><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.25 5.25h5a2.1 2.1 0 0 1 2 1.15 2.1 2.1 0 0 1 2-1.15h2.5v9.5h-2.5a3.6 3.6 0 0 0-2.9 1.15 3.6 3.6 0 0 0-2.85-1.15h-3.25Z" /><path d="M10.35 6.4v9" /></svg><span>Learning for exams</span></li>
                <li><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6.1" r="2.35" /><path d="M5.85 14.9a4.15 4.15 0 0 1 8.3 0" /></svg><span>Building foundational knowledge</span></li>
                <li><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.25" /><circle cx="10" cy="10" r="1.2" /></svg><span>Single-tasking</span></li>
              </ul>
            </section>

            <section className="case-compare-column" aria-labelledby="nus-working-professional">
              <h3 id="nus-working-professional">Working Professional</h3>
              <ul className="case-compare-list">
                <li><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.25" /><path d="M10 6.4v3.9l2.5 1.5" /></svg><span>Fitting learning around a full-time job</span></li>
                <li><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.1 7.15h9.8v7.25H5.1Z" /><path d="M7.65 7.15V6.2a2.35 2.35 0 0 1 4.7 0v.95" /><path d="M10 9.45v2.35" /></svg><span>Learning to apply immediately</span></li>
                <li><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4.1v2.2" /><path d="M10 13.7v2.2" /><path d="M4.1 10h2.2" /><path d="M13.7 10h2.2" /><circle cx="10" cy="10" r="2.9" /></svg><span>Bringing years of industry experience</span></li>
                <li><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.35 6.6h7.3" /><path d="M6.35 13.4h7.3" /><path d="M11.65 4.8 13.7 6.6l-2.05 1.85" /><path d="M8.35 11.55 6.3 13.4l2.05 1.8" /></svg><span>Constantly context-switching</span></li>
              </ul>
            </section>
          </div>

          <p>Defining the audience first gave the team a clearer framework for every decision that followed, from content design to feedback measurement.</p>
        </section>

        <section id="decision-02" className="case-section">
          <p className="case-kicker">Decision 02</p>
          <h2>Designing for Busy Learners</h2>
          <p>
            Blended learning shifts more responsibility from instructors to content. If the content fails to engage, there is no instructor in the room to recover attention.
          </p>
          <div className="case-insight">
            <p>
              Working professionals preferred content that was <span>visual and concise</span>, and flagged long-form reading as a <span>barrier to completing modules.</span>
            </p>
          </div>
          <p className="case-source">Learner survey · NUS-ISS blended learning · n = 200+</p>

          <div className="case-stats">
            <div>
              <strong>42%</strong>
              <span>higher retention with interactive visual content vs text-only modules</span>
            </div>
            <div>
              <strong>+16%</strong>
              <span>completion rate when videos are kept under 10 minutes</span>
            </div>
          </div>
          <p className="case-source">Coursera, Drivers of Quality in Online Learning (2020)</p>

          <p>
            These findings shifted our focus from producing more content to making content easier to consume. We introduced a mix of videos, visual references, and interactive exercises that working professionals could fit around a full schedule and apply immediately.
          </p>

          <section className="case-example-stack" aria-label="NUS format shift examples">
            <article className="case-example-block">
              <span className="case-example-label case-example-label-accent">Learn by Watching</span>
              <figure className="case-video case-example-video">
                <iframe
                  src="https://www.youtube.com/embed/uulDWS3vwzA?si=OVind1cpjUOquan4&controls=1&playsinline=1&rel=0&modestbranding=1"
                  title="NUS-ISS teaching video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </figure>
              <p className="case-source case-example-source">Translated UX concepts into short, workplace-focused learning videos.</p>
            </article>

            <article className="case-example-block">
              <span className="case-example-label case-example-label-accent">Learn by Reference</span>
              <figure className="case-example-asset case-example-asset-reference">
                <img
                  className="case-example-graphic case-example-graphic-full case-example-graphic-reference"
                  src={assetPath("/assets/thematic-analysis.webp")}
                  alt="Thematic analysis infographic created for blended learning content"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <p className="case-source case-example-source">Designed a step-by-step infographic that turned thematic analysis into a quick-reference visual for review after class.</p>
            </article>
          </section>

          <p>The framework was adopted across subsequent programme runs and later reached more than 2,000 learners across NUS-ISS’s blended learning portfolio.</p>
        </section>

        <section id="decision-03" className="case-section">
          <p className="case-kicker">Decision 03</p>
          <h2>From Feedback to Action</h2>
          <p>
            After each session, learners completed surveys, but the feedback rarely informed future decisions. Programme staff reviewed responses manually, and instructors often relied on individual observations rather than aggregated learner feedback.
          </p>
          <p>The problem wasn&apos;t a lack of feedback. It was that the feedback was invisible.</p>
          <p>
            We consolidated survey responses into a single dashboard that surfaced trends across cohorts, making it easier for instructors and programme staff to identify patterns that were previously buried across hundreds of individual survey responses.
          </p>
          <figure className="case-outcome-card case-example-dashboard">
            <img src={assetPath("/assets/nus-dashboard-april-detail.png")} alt="Dashboard showing NUS learner feedback trends across programmes, years, and satisfaction metrics" loading="lazy" decoding="async" />
          </figure>
          <p className="case-source case-example-source">Staff could filter feedback across programmes and years, track certification trends, and monitor overall satisfaction without manually consolidating survey data.</p>
          <p>By making learner feedback visible and actionable, the dashboard reduced reporting time by 50% and saved 100+ staff hours annually.</p>
        </section>

        <section id="outcome" className="case-section case-outcome">
          <h2>The Outcome</h2>
          <p>
            Across one summer, the team redesigned how blended learning content was delivered, evaluated, and improved across NUS-ISS programmes. The outputs were adopted across subsequent programme runs and became part of how NUS-ISS delivered professional education.
          </p>

          <div className="case-outcome-images" aria-label="NUS project outcomes">
            <figure className="case-outcome-card">
              <img src={assetPath("/assets/nus-annual-luncheon-v2.jpg")} alt="NUS-ISS Annual Luncheon team photo" loading="lazy" decoding="async" />
            </figure>
            <figure className="case-outcome-card">
              <img src={assetPath("/assets/nus-birthday-card-v2.jpg")} alt="NUS-ISS birthday card photo" loading="lazy" decoding="async" />
            </figure>
          </div>

          <div className="case-outcome-stats" aria-label="NUS case study outcomes">
            <div>
              <strong>2,000+</strong>
              <span>learners reached through redesigned blended learning</span>
            </div>
            <div>
              <strong>50%</strong>
              <span>faster reporting through feedback analytics</span>
            </div>
            <div>
              <strong>100+</strong>
              <span>staff hours saved through automated reporting</span>
            </div>
          </div>
        </section>

        <section id="reflections" className="case-section case-reflections">
          <h2>Reflections</h2>

          <div className="case-reflection">
            <div>
              <h3>Not Every Problem Needs a New Feature</h3>
              <p>
                Many of the challenges in this project weren&apos;t caused by missing features or missing content. The biggest opportunities came from improving how existing systems worked together more effectively over time in practice.
              </p>
            </div>
          </div>

          <div className="case-reflection">
            <div>
              <h3>Data Doesn&apos;t Drive Decisions</h3>
              <p>
                The feedback already existed. The challenge was making it visible enough for teams to use. That experience changed how I think about analytics, reporting, and decision-making systems in everyday practice and team settings.
              </p>
            </div>
          </div>

          <div className="case-reflection">
            <div>
              <h3>The Wrong Benchmark</h3>
              <p>
                Success became easier to define once we stopped comparing professional learners to students. The challenge was never how to move classroom content online. It was understanding that the audience, expectations, and measures of success had fundamentally changed.
              </p>
            </div>
          </div>
        </section>

        <div className="case-footer" aria-label="Case study footer">
          <Link className="case-footer-link case-footer-link-prev" to="/projects/blue-guardian/">
            <FooterArrow direction="left" />
            <span>Blue Guardian</span>
          </Link>

          <p className="case-footer-meta">
            Last updated Jun 4 · Listening to{" "}
            <a
              className="case-footer-soundtrack"
              href="https://open.spotify.com/search/%E3%81%8D%E3%82%89%E3%82%8A%20%E8%97%A4%E4%BA%95%E9%A2%A8"
              target="_blank"
              rel="noreferrer"
            >
              <span className="case-footer-soundtrack-title">きらり by 藤井風</span>
            </a>
            <SpotifyIcon />
          </p>

          <a
            className="case-footer-link case-footer-link-next"
            href="https://www.ibm.com/products/decision-intelligence"
            target="_blank"
            rel="noreferrer"
          >
            <span>IBM</span>
            <FooterArrow />
          </a>
        </div>
      </article>
    </main>
  );
}
