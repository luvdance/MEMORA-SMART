import React, { useEffect, useRef } from "react";
import "./Portfolio.css";
import profilePic from "../assets/profile pic2.jpg";

// ---- Personalize these ----
const NAME = "DANIEL EWEZUGACHI NWANKWO";
const INITIALS = "ND";
const ROLE = "Full Stack Software Engineer";
const PHOTO_SRC = profilePic;
const STATUS = "Available for work";
const EMAIL = "danielnwankwo@memorasmart.com";
const FIVERR_URL = "https://fiverr.com/your-username";
const GITHUB_URL = "https://github.com/luvdance";
const LINKEDIN_URL = "www.linkedin.com/in/daniel-nwankwo-baa26b149";
// ----------------------------

const chapters = [
  {
    n: "01",
    title: "Where it started",
    text: "I picked up code to solve a small, real problem — and never really stopped. What began as curiosity turned into a habit of taking messy processes and turning them into something clean and usable.",
  },
  {
    n: "02",
    title: "What I build",
    text: "Sites and small systems for people who need more than a template — clinics, small businesses, ideas that need a working front door and the logic behind it to match.",
  },
  {
    n: "03",
    title: "How I work",
    text: "Fast, direct, and honest about scope. I'd rather ship something small and solid than something big and half-finished.",
  },
];

const projects = [
  {
    id: "01",
    title: "Mercy's Closet Luxe",
    sub: "Fashion and Clothing Brand",
    desc: "A full-stack fashion e-commerce platform built for a clothing boutique, featuring a modern, visually rich UI with a dark theme toggle for an elevated shopping experience.",
    tags: ["Bootstrap", "JavaScript", "Node.js", "Firebase Firestore", "Whatsapp Business API"],
    href: "https://mercyscloset.vercel.app/",
  },
  {
    id: "02",
    title: "Memora Smart Technologies",
    sub: "Memora Smart Integrated Web App",
    desc: "SaaS Website built with Javascript, React, Tailwind, Node.js and Vercel Serverless functions for the backend, AI Integration with Claude, Payment Integration and More...",
    tags: ["React", "Javascript", "Tailwind", "Node.js", "Vercel Serverless", "Claude API", "Firebase"],
    href: "https://www.memorasmart.com",
  },
  {
    id: "03",
    title: "Sports Oracle",
    sub: "Sports Oracle",
    desc: "The platform was built to transform raw sports data into actionable insights by combining predictive algorithms with an easy-to-use interface. Users can compare model probabilities against market odds and identify value opportunities. Built with React.js, Javascript, Node.js, Claude API, Vercel Serverless functions and more..",
    tags: ["React", "Javascript", "Node.js", "Vercel Serverless", "Claude API", "Firebase"],
    href: "https://sports-oracle-sigma.vercel.app/",
  },
];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      el.classList.add("is-visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export default function Portfolio() {
  return (
    <div className="pf-page">
      {/* NAV */}
      <nav className="pf-nav">
        <a href="#top" className="pf-mark">
          {INITIALS}
        </a>
        <div className="pf-nav-links">
          <a href="#story">Story</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
        <a href={`mailto:${EMAIL}`} className="pf-nav-cta">
          Say hello
        </a>
      </nav>

      {/* HERO */}
      <header id="top" className="pf-hero">
        <div className="pf-hero-text">
          <p className="pf-chapter-tag">CHAPTER 00 — INTRO</p>
          <h1 className="pf-headline">
            Hi, I'm {NAME.split(" ")[0]}.
            <br />I build things <em>that work.</em>
          </h1>
          <p className="pf-sub">{ROLE} — turning ideas into working sites and systems.</p>
          <div className="pf-hero-links">
            <a href="#work" className="pf-btn-primary">
              See the work
            </a>
            <a href="#story" className="pf-btn-ghost">
              Read the story ↓
            </a>
          </div>
        </div>

        <div className="pf-hero-photo">
          <div className="pf-photo-frame">
            <img
              src={PHOTO_SRC}
              alt={NAME}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
            <div className="pf-photo-fallback">{INITIALS}</div>
          </div>
          <span className="pf-photo-badge">{STATUS}</span>
        </div>
      </header>

      {/* STORY */}
      <section id="story" className="pf-section">
        <Reveal as="p" className="pf-section-label">
          MY STORY
        </Reveal>
        <div className="pf-story-list">
          {chapters.map((c) => (
            <Reveal as="article" className="pf-story-item" key={c.n}>
              <span className="pf-story-n">{c.n}</span>
              <div>
                <h3 className="pf-story-title">{c.title}</h3>
                <p className="pf-story-text">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="pf-section">
        <Reveal as="p" className="pf-section-label">
          SELECTED WORK
        </Reveal>
        <div className="pf-work-grid">
          {projects.map((p) => (
            <Reveal as="article" className="pf-work-card" key={p.id}>
              <div className="pf-work-thumb" aria-hidden="true">
                <span>{p.id}</span>
              </div>
              <div className="pf-work-body">
                <h3 className="pf-work-title">{p.title}</h3>
                <p className="pf-work-sub">{p.sub}</p>
                <p className="pf-work-desc">{p.desc}</p>
                <div className="pf-work-tags">
                  {p.tags.map((t) => (
                    <span className="pf-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <a href={p.href} className="pf-work-link" target="_blank">
                  View project →
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer id="contact" className="pf-footer">
        <Reveal as="div">
          <h2 className="pf-footer-headline">Let's build something.</h2>
          <p className="pf-footer-sub">
            Got a site or system you need built? I'm currently taking on new work.
          </p>
          <div className="pf-footer-links">
            <a href={`mailto:${EMAIL}`} className="pf-footer-link">
              {EMAIL}
            </a>
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-footer-link"
            >
              Fiverr
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-footer-link"
            >
              GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-footer-link"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>
        <p className="pf-copyright">
          © {new Date().getFullYear()} {NAME}. Built for MemoraSmart.
        </p>
      </footer>
    </div>
  );
}
