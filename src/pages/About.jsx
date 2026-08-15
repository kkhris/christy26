import { useMemo, useRef } from "react";
import usePageReveal from "../hooks/usePageReveal";
import { assetPath } from "../utils/paths";

const notes = [
  {
    title: "Semester in Singapore",
    description: "Heat, humidity, and lots of chicken rice.",
    href: "https://sage-rook-c0d.notion.site/Life-in-Singapore-be-like-dc92a1dba36d45399cfd8741c4ea8a07",
    coverLight: assetPath("/assets/blogs/01-cover-light.png"),
    coverDark: assetPath("/assets/blogs/01-cover-dark.png"),
    hoverLight: assetPath("/assets/blogs/01-hover-light.png"),
    hoverDark: assetPath("/assets/blogs/01-hover-dark.png"),
  },
  {
    title: "The 3D Era",
    description: "My messy attempt at learning 3D modeling.",
    href: "https://sage-rook-c0d.notion.site/Life-as-a-3D-Modelling-Beginner-34fac252ce46467483c644663921f222",
    coverLight: assetPath("/assets/blogs/02-cover-light.png"),
    coverDark: assetPath("/assets/blogs/02-cover-dark.png"),
    hoverLight: assetPath("/assets/blogs/02-hover-light.png"),
    hoverDark: assetPath("/assets/blogs/02-hover-dark.png"),
  },
  {
    title: "The Unofficial Bio",
    description: "Things that didn't make it to my resume.",
    href: "https://sage-rook-c0d.notion.site/a-little-bit-more-about-me-272ca89af24680f0a88bf8d910410048",
    coverLight: assetPath("/assets/blogs/03-cover-light.png"),
    coverDark: assetPath("/assets/blogs/03-cover-dark.png"),
    hoverLight: assetPath("/assets/blogs/03-hover-light.png"),
    hoverDark: assetPath("/assets/blogs/03-hover-dark.png"),
  },
];

export default function About() {
  const pageRef = useRef(null);
  const revealTargets = useMemo(
    () => [
      { selector: ".page-reveal-about-hero", delay: 0 },
      { selector: ".page-reveal-about-notes", delay: 200 },
    ],
    [],
  );

  usePageReveal(pageRef, revealTargets);

  return (
    <section ref={pageRef} className="about-page">
      <header
        className="intro page-reveal-target page-reveal-grid page-reveal-about-hero"
        style={{ "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }}
      >
        <h1>Hi! I&apos;m Christal ツ</h1>
        <p>From pixels to people, I build products with innovation and heart.</p>
      </header>

      <div
        className="about-story"
      >
        <div className="about-copy">
          <p>
            I think good products start with paying attention — to people, to context, and to the little things.
          </p>
          <p>
            When things feel unclear, I slow down, ask questions, and help bring some order to the chaos. I
            like to map out the logic before jumping to conclusions, which helps me spot what users need and
            catch gaps the team might miss.
          </p>
          <p>
            When I&apos;m not building products, I&apos;m dancing in empty gyms, tripping over tennis balls,
            picking up golf, or filming vlogs I rarely edit. I&apos;m always chasing new hobbies, sometimes
            successfully, sometimes chaotically, but always with curiosity.
          </p>
        </div>

        <img
          className="about-photo"
          src={assetPath("/assets/about-flowers.jpg")}
          alt="Close-up photo of flowers"
          loading="eager"
          decoding="sync"
          fetchpriority="high"
        />
      </div>

      <section
        className="blog-section page-reveal-target page-reveal-grid page-reveal-about-notes"
        style={{ "--page-reveal-y": "200px", "--page-reveal-duration": "1000ms" }}
        aria-labelledby="about-notes-title"
      >
        <h2 id="about-notes-title">My Blogs</h2>
        <p>Outside of work, I share thoughts on the things I build, life, and whatever else I am up to. You&apos;ll find some of them here!</p>

        <div className="blog-grid">
          {notes.map((note) => (
            <a
              key={note.title}
              className="blog-card"
              href={note.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className="blog-cover" aria-hidden="true">
                <img className="blog-image blog-image-cover blog-image-light" src={note.coverLight} alt="" />
                <img className="blog-image blog-image-cover blog-image-dark" src={note.coverDark} alt="" />
                <img className="blog-image blog-image-hover blog-image-light" src={note.hoverLight} alt="" />
                <img className="blog-image blog-image-hover blog-image-dark" src={note.hoverDark} alt="" />
              </div>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}
