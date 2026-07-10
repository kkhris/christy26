import { useMemo, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import ArrowIcon from "../../components/ArrowIcon";
import { FooterArrow, SpotifyIcon } from "../../components/CaseFooterIcons";
import useCaseSectionNavigation from "../../hooks/useCaseSectionNavigation";
import usePageReveal from "../../hooks/usePageReveal";

export default function BlueGuardian() {
  const pageRef = useRef(null);
  const { scrollRootRef, transition } = useOutletContext();
  const sectionLinks = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "problems", label: "Problem" },
      { id: "decision-01", label: "Wrong Tone", index: "01" },
      { id: "decision-02", label: "Borrowed Trust", index: "02" },
      { id: "decision-03", label: "First 30 Seconds", index: "03" },
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
    <main ref={pageRef} className="case-page blue-guardian-page">
      <div
        className="case-intro-group page-reveal-target page-reveal-case-intro"
        style={{ "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }}
      >
        <header className="intro case-hero">
          <h1>Blue Guardian, Generative AI Agent</h1>
          <p>Build trust in the first 30 seconds of AI support.</p>
        </header>

        <dl className="case-meta" aria-label="Project metadata">
          <div>
            <dt>Role</dt>
            <dd>Product Designer</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>1 Designer, 2 Developer, 1 Product Designer</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>Nov 2023 - June 2024</dd>
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
          <div className="case-notice">
            <p>
              Blue Guardian is now closed after two years of operation. The product and website are no longer active, but I had a great time building it and learned a lot throughout the process!
            </p>
          </div>

          <p>
            In late 2023, I joined Blue Guardian as the sole founding designer to build a generative AI wellness platform for youth. Over an 8-month cycle, I owned the product&apos;s end-to-end user experience, designing the core conversational interface and executing a zero-budget growth strategy to acquire our initial users.
          </p>

          <figure className="case-video">
            <iframe
              src="https://www.youtube.com/embed/sQ47C15gL20?autoplay=1&mute=1&loop=1&playlist=sQ47C15gL20&controls=1&playsinline=1&rel=0&modestbranding=1"
              title="Blue Guardian demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </figure>
          <a
            className="case-video-link"
            href="https://www.youtube.com/watch?v=sQ47C15gL20"
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
            Traditional clinical care is restricted by high costs and long waitlists. On top of that, social stigma creates a massive psychological barrier, causing most people to give up before taking the first step to look for help.
          </p>
          <div className="case-insight">
            <p>
              In Canada, <span>26% of youth</span> report poor or fair mental health, but <span>more than 1 in 3</span> who need support never receive it.
            </p>
          </div>
          <p className="case-source">Statistics Canada &amp; CIHI, 2023-2024</p>
          <p>
            Blue Guardian wasn&apos;t built to fix the system. It was built for the moment before people decide to try. We focused on the friction occurring before clinical care even becomes an option: the lack of a low-stakes, accessible space where young people can reach out to support.
          </p>
        </section>

        <section id="decision-01" className="case-section">
          <p className="case-kicker">Decision 01</p>
          <h2>The Wrong Tone</h2>
          <p>As AI companions became more common, more users were turning to them for emotional support.</p>

          <div className="case-stats">
            <div>
              <strong>12%</strong>
              <span>of teens reported turning to AI chatbots for emotional support or advice</span>
            </div>
            <div>
              <strong>93 min</strong>
              <span>average daily time users spent on AI companion apps</span>
            </div>
          </div>
          <p className="case-source">Common Sense Media, 2024</p>

          <p>
            However, most AI models are not optimized for emotional contexts. They rely on a rigid response style that fails to adapt to users&apos; emotional states. Someone who&apos;s panicking and someone who just needs a push have completely different needs. Applying one default tone creates an immediate mismatch that drives users away.
          </p>
          <div className="case-insight">
            <p>
              The well-intentioned provision of support may backfire and <span>lead to worse outcomes</span> when the supportive behavior <span>doesn&apos;t match the needs of the recipient.</span>
            </p>
          </div>
          <p className="case-source">Selcuk &amp; Ong, Health Psychology, 2013</p>

          <p>
            This limitation created the core product gap. Blue Guardian offered different response modes based on emotional context, letting the conversation surface which one fit rather than asking users to decide upfront before interacting.
          </p>

          <div className="case-flow" aria-label="Blue Guardian adaptive support process flow">
            <div className="case-flow-step case-flow-start">
              <strong>1</strong>
              <p>User<br />Message</p>
            </div>
            <div className="case-flow-step case-flow-new">
              <strong>2</strong>
              <p>Emotion<br />Detected</p>
              <em>new</em>
            </div>
            <div className="case-flow-step case-flow-new">
              <strong>3</strong>
              <p>Response<br />Options</p>
              <em>new</em>
            </div>
            <div className="case-flow-step case-flow-original">
              <strong>4</strong>
              <p>AI<br />Adapts</p>
            </div>
          </div>
          <p className="case-source">Other AI goes directly from step 1 to a fixed-tone response.</p>
        </section>

        <section id="decision-02" className="case-section">
          <p className="case-kicker">Decision 02</p>
          <h2>The Borrowed Trust</h2>
          <p>
            With no advertising budget, reaching our initial users felt nearly impossible, especially since the target audience are rarely proactive about seeking help. If they weren&apos;t going to find us, how could we find them?
          </p>
          <p>
            User research revealed a consistent pattern: people were far more willing to seek support in environments they already trusted. That insight shaped our distribution strategy.
          </p>

          <div className="case-channel-matrix" aria-label="Blue Guardian channel comparison matrix">
            <div className="case-channel-cell case-channel-empty" aria-hidden="true"></div>
            <div className="case-channel-cell case-channel-heading">Free</div>
            <div className="case-channel-cell case-channel-heading">Trusted</div>
            <div className="case-channel-cell case-channel-heading">Reach</div>

            <div className="case-channel-cell case-channel-label">Paid ads</div>
            <div className="case-channel-cell"><span className="case-channel-mark case-channel-no">×</span></div>
            <div className="case-channel-cell"><span className="case-channel-mark case-channel-no">×</span></div>
            <div className="case-channel-cell">
              <svg className="case-channel-check" viewBox="0 0 18 14" role="img" aria-label="Yes">
                <path d="M1.5 7.2 6.6 12 16.5 1.5" />
              </svg>
            </div>

            <div className="case-channel-cell case-channel-label">Student influencers</div>
            <div className="case-channel-cell"><span className="case-channel-mark case-channel-no">×</span></div>
            <div className="case-channel-cell"><span className="case-channel-varies">Varies</span></div>
            <div className="case-channel-cell">
              <svg className="case-channel-check" viewBox="0 0 18 14" role="img" aria-label="Yes">
                <path d="M1.5 7.2 6.6 12 16.5 1.5" />
              </svg>
            </div>

            <div className="case-channel-cell case-channel-label case-channel-selected">Campus peer accounts</div>
            <div className="case-channel-cell case-channel-selected">
              <svg className="case-channel-check" viewBox="0 0 18 14" role="img" aria-label="Yes">
                <path d="M1.5 7.2 6.6 12 16.5 1.5" />
              </svg>
            </div>
            <div className="case-channel-cell case-channel-selected">
              <svg className="case-channel-check" viewBox="0 0 18 14" role="img" aria-label="Yes">
                <path d="M1.5 7.2 6.6 12 16.5 1.5" />
              </svg>
            </div>
            <div className="case-channel-cell case-channel-selected">
              <svg className="case-channel-check" viewBox="0 0 18 14" role="img" aria-label="Yes">
                <path d="M1.5 7.2 6.6 12 16.5 1.5" />
              </svg>
            </div>
          </div>

          <p>
            Rather than building trust from scratch, we reached out to campus peer accounts that were student-run, free to partner with, and followed by thousands of incoming students. I designed marketing assets for these partnerships.
          </p>

          <div className="case-marketing-placeholders" aria-label="Blue Guardian marketing asset placeholders">
            <figure className="case-marketing-placeholder">
              <img src="/assets/blue-guardian-instagram-01.png" alt="Blue Guardian freshman year marketing asset" loading="lazy" decoding="async" />
            </figure>
            <figure className="case-marketing-placeholder">
              <img src="/assets/blue-guardian-instagram-02.png" alt="Blue Guardian customizable chatbot marketing asset" loading="lazy" decoding="async" />
            </figure>
            <figure className="case-marketing-placeholder">
              <img src="/assets/blue-guardian-instagram-03.png" alt="Blue Guardian voice integration marketing asset" loading="lazy" decoding="async" />
            </figure>
          </div>

          <p>The strategy acquired 300+ users within the first weeks of launch, with 0 spend on traditional marketing.</p>
        </section>

        <section id="decision-03" className="case-section">
          <p className="case-kicker">Decision 03</p>
          <h2>Winning the First 30 Seconds</h2>
          <p>Acquiring users solved the distribution problem. Retaining them required earning trust quickly.</p>
          <p>
            Early onboarding sessions revealed that users formed trust judgments within seconds, especially in emotionally vulnerable moments. If the experience felt overwhelming, clinical, or emotionally cold, engagement dropped almost immediately.
          </p>
          <div className="case-insight">
            <p>
              Visual cues influenced perceived trustworthiness. When brand logos were blue, <span>74% of participants</span> classified the brand as trustworthy, compared to just 50% for red.
            </p>
          </div>
          <p className="case-source">Su, Cui &amp; Walsh, Journal of Marketing Theory and Practice, 2019</p>
          <p>
            The interface was intentionally designed to reduce emotional friction during onboarding. Soft contrast, rounded components, and calmer visual hierarchy helped the product feel more approachable during the first interaction.
          </p>
          <figure className="case-visual case-visual-hero case-design-system-visual">
            <img src="/assets/Design System.png" alt="Blue Guardian design system overview" loading="lazy" decoding="async" />
          </figure>
          <p>
            Users consistently described the onboarding experience as approachable rather than clinical. This friction reduction served as a direct lever for early retention, transforming visual design into a product decision rather than just an aesthetic choice.
          </p>
        </section>

        <section id="outcome" className="case-section case-outcome">
          <h2>The Outcome</h2>
          <p>
            Blue Guardian launched and reached 300+ users within weeks, with zero advertising spend. The product was later featured in Maclean&apos;s for its approach to AI-driven youth mental health support.
          </p>

          <div className="case-outcome-story" aria-label="Blue Guardian outcome story">
            <a
              className="case-outcome-feature"
              href="https://macleans.ca/society/the-prospect-meet-the-22-year-old-ceo-using-ai-to-boost-kids-mental-health/"
              target="_blank"
              rel="noreferrer"
              aria-label="Read the Maclean's article about Blue Guardian"
            >
              <span className="case-outcome-feature-label">Press</span>
              <h3>Meet the 22-year-old CEO using AI to boost kids&apos; mental health</h3>
              <p>Maclean&apos;s, 2024</p>
              <span className="case-inline-link case-outcome-feature-cta">
                Read article
                <ArrowIcon />
              </span>
            </a>

            <div className="case-outcome-stats case-outcome-stats-stack" aria-label="Blue Guardian outcome metrics">
              <div>
                <strong>300+</strong>
                <span>users engaged within weeks of launch</span>
              </div>
              <div>
                <strong>0 - 1</strong>
                <span>AI product launched over an 8-month cycle</span>
              </div>
            </div>
          </div>
        </section>

        <section id="reflections" className="case-section case-reflections">
          <h2>Reflections</h2>

          <div className="case-reflection">
            <div>
              <h3>Trust comes before value</h3>
              <p>
                Users don&apos;t experience value unless they stay long enough to find it. Blue Guardian reinforced that trust isn&apos;t something layered onto a product after it&apos;s built. It shapes whether users engage with the product in the first place.
              </p>
            </div>
          </div>

          <div className="case-reflection">
            <div>
              <h3>Distribution shapes adoption</h3>
              <p>
                A product can&apos;t create impact if users never encounter it. This project pushed me to think beyond features and consider where trust already existed, and how distribution could become part of the user experience itself.
              </p>
            </div>
          </div>

          <div className="case-reflection">
            <div>
              <h3>Not every important decision is a feature</h3>
              <p>
                Some of the most consequential decisions weren&apos;t new capabilities. They influenced discovery, onboarding, and trust. Working on Blue Guardian reinforced that product success is often shaped by trust, distribution, and onboarding—not just the feature itself.
              </p>
            </div>
          </div>
        </section>

        <div className="case-footer" aria-label="Case study footer">
          <Link className="case-footer-link case-footer-link-prev" to="/projects/wildlight/">
            <FooterArrow direction="left" />
            <span>Wildlight</span>
          </Link>

          <p className="case-footer-meta">
            Last updated Jun 4 · Listening to{" "}
            <a
              className="case-footer-soundtrack"
              href="https://open.spotify.com/search/Automatic%20%E5%AE%87%E5%A4%9A%E7%94%B0%E5%85%89"
              target="_blank"
              rel="noreferrer"
            >
              <span className="case-footer-soundtrack-title">Automatic by 宇多田光</span>
            </a>
            <SpotifyIcon />
          </p>

          <Link className="case-footer-link case-footer-link-next" to="/projects/nus-iss/">
            <span>NUS-ISS</span>
            <FooterArrow />
          </Link>
        </div>
      </article>
    </main>
  );
}
