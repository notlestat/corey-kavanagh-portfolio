import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { collections, galleryItems } from "./portfolioData";
import { ConversationPlayback, type ConversationMessage } from "./Conversation";

type SelectedWork = { category: number; position: number };
type Theme = "light" | "dark";
type Page = "home" | "work";
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};
const systems = [
  { name: "Axis ad workflow", short: "Campaign development with evidence and approval gates.", detail: "Organises brand material, research, strategy, campaign concepts, art direction, storyboards and production handoffs in one local workflow.", outcome: "Sources, assumptions, decisions and approved work stay visible before anything moves into production." },
  { name: "Axis post-production workflow", short: "A local system for turning source footage into reviewed edits.", detail: "Handles source intake, transcripts, clip selection, longform edits, shorts, captions, motion graphics, rendering and technical checks.", outcome: "The repetitive work is organised. Editorial choices and final watch-and-listen approval stay with a person." },
  { name: "Axis creative agency", short: "A Codex-first creative workflow for brands, artists and releases.", detail: "Moves a project through intake, research, creative opportunities, concepts, art direction, copy, storyboards and a controlled production package.", outcome: "Recommendations never become approvals by accident. Facts, inferences and unknowns stay separate." },
];
const services = [
  { name: "Art direction", text: "Visual worlds, image-making and creative direction across fashion, music and culture." },
  { name: "Design", text: "Brand identity, graphic design and digital work shaped by the same visual point of view." },
  { name: "Creative technology", text: "Websites, interactions and AI systems where the technology supports the idea." },
];

function HomeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3.5 10 8.5-7 8.5 7v9a2 2 0 0 1-2 2h-4.3v-6.3H9.8V21H5.5a2 2 0 0 1-2-2z" /></svg>;
}
function WorkIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="7" width="19" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2.5 12.5c5.8 3.8 13.2 3.8 19 0M10.5 14.7v2h3v-2" /></svg>;
}
function GithubIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.12c-3.1.68-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.54 0-1.23.44-2.23 1.15-3.02-.11-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.22 2.7.11 2.98.72.79 1.15 1.79 1.15 3.02 0 4.31-2.61 5.25-5.1 5.53.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>;
}

function Header({ page }: { page: Page }) {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  const applyTheme = (nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#191c19" : "#eeefeb");
    try { localStorage.setItem("corey-theme", nextTheme); } catch { /* Storage can be unavailable in private contexts. */ }
    flushSync(() => setTheme(nextTheme));
  };

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const viewTransitionDocument = document as ViewTransitionDocument;

    if (event.detail === 0 || reducedMotion || !viewTransitionDocument.startViewTransition || !themeButtonRef.current) {
      applyTheme(nextTheme);
      return;
    }

    const bounds = themeButtonRef.current.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = viewTransitionDocument.startViewTransition(() => applyTheme(nextTheme));

    transition.ready.then(() => {
      const options: KeyframeAnimationOptions & { pseudoElement: string } = {
        duration: 420,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
        fill: "both",
        pseudoElement: "::view-transition-new(root)",
      };
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        options,
      );
    });
  };

  return <header className="site-header">
    <a className="wordmark" href="/" aria-label="Corey Kavanagh, home"><img src="/ck-logo.png" alt="" width="320" height="180" /></a>
    <nav className="page-switch" aria-label="Pages">
      <a className={page === "home" ? "page-switch-link is-active" : "page-switch-link"} href="/" aria-label="Home" aria-current={page === "home" ? "page" : undefined}><HomeIcon /><span className="page-switch-tip">Home</span></a>
      <a className={page === "work" ? "page-switch-link is-active" : "page-switch-link"} href="/work" aria-label="Work" aria-current={page === "work" ? "page" : undefined}><WorkIcon /><span className="page-switch-tip">Work</span></a>
    </nav>
    <div className="header-actions">
      <button ref={themeButtonRef} className="theme-toggle" type="button" onClick={toggleTheme} aria-pressed={theme === "dark"} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
        <span className="theme-toggle-track" aria-hidden="true"><span className="theme-toggle-thumb" /></span>
        <span className="theme-toggle-label" aria-hidden="true">{theme === "light" ? "Dark" : "Light"}</span>
      </button>
      <a className="github-link" href="https://github.com/notlestat" target="_blank" rel="noopener noreferrer" aria-label="GitHub, opens in a new tab"><GithubIcon /></a>
    </div>
  </header>;
}

function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = sectionRef.current, name = nameRef.current, roles = rolesRef.current;
    if (!section || !name || !roles) return;
    const reduced = matchMedia("(max-width: 700px), (prefers-reduced-motion: reduce)");
    let frame = 0, visible = false, previous = -1;
    const update = () => {
      if (!visible) return;
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - innerHeight)));
      if (progress !== previous) {
        name.style.transform = `translate3d(${-progress * innerWidth * .12}px, ${-progress * innerHeight * .12}px, 0)`;
        name.style.opacity = String(Math.max(0, 1 - progress * .95));
        const travel = Math.max(0, roles.scrollWidth - innerWidth + 96);
        roles.style.transform = `translate3d(${-progress * travel}px, 0, 0)`;
        previous = progress;
      }
      frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !reduced.matches;
      cancelAnimationFrame(frame);
      if (visible) update();
    });
    const syncMotion = () => {
      if (reduced.matches) {
        visible = false;
        cancelAnimationFrame(frame);
        name.style.transform = "";
        name.style.opacity = "";
        roles.style.transform = "";
      } else {
        observer.observe(section);
      }
    };
    reduced.addEventListener("change", syncMotion);
    syncMotion();
    return () => { visible = false; cancelAnimationFrame(frame); observer.disconnect(); reduced.removeEventListener("change", syncMotion); };
  }, []);
  return <section className="intro-scroll" ref={sectionRef} aria-labelledby="intro-title">
    <div className="intro-sticky">
      <div className="intro-topline"><span>Independent practice / London & New Zealand</span></div>
      <h1 id="intro-title" ref={nameRef}><span>COREY</span><span>KAVANAGH<span className="accent-dot">.</span></span></h1>
      <p className="sr-only">Art Direction, Design and Creative Technology.</p>
      <div className="intro-roles-window" aria-hidden="true"><div className="intro-roles" ref={rolesRef}>{Array.from({ length: 3 }, (_, index) => <em key={index}>Art Direction / Design / Creative Technology</em>)}</div></div>
      <a className="intro-next" href="/work">Explore the work</a>
    </div>
  </section>;
}

const conversationMessages: ConversationMessage[] = [
  { align: "start", text: "What do you work on?" },
  { align: "end", text: "I direct images and identities for brands. I also build websites and tools with the same visual intent." },
  { align: "start", text: "Where should I start?" },
  { align: "end", text: "Start with the work. The image archive is there now, alongside the digital projects and systems I have made." },
];

function ConversationSection() {
  return <section className="conversation-section" id="about" aria-labelledby="conversation-title">
    <div className="conversation-heading"><p className="eyebrow">01 / The practice</p><h2 id="conversation-title">One point of view.<br /><span>More than one medium.</span></h2><p>The image, the identity, the interaction. Each needs a clear idea behind it.</p></div>
    <div className="conversation-side"><p className="conversation-label">A short conversation about the work</p><ConversationPlayback messages={conversationMessages} /><div className="conversation-links"><a href="/work#art-direction">Art direction</a><a href="/work#digital-work">Digital work</a></div></div>
  </section>;
}

function WorkLanding({ onChoose }: { onChoose: (category: number, position: number) => void }) {
  return <section className="work-landing" aria-labelledby="work-landing-title">
    <div className="work-landing-copy"><p className="eyebrow">Portfolio / All work</p><h1 id="work-landing-title">The work<span className="accent-dot">.</span></h1><p>Art direction, design and creative technology. Select a pin to enter the work, or scroll through the full index.</p></div>
    <div className="pinned-board" aria-label="Featured work and categories">
      <a className="pinned-card pinned-card-art" href="#art-direction" aria-label="Explore art direction work"><img src="/work/gallery/bstroy-01.jpg" alt="BSTROY portfolio work" /><span className="pinned-caption"><strong>Art direction</strong><small>Images / campaigns</small></span></a>
      <a className="pinned-card pinned-card-graphic" href="#work-index" onClick={() => onChoose(7, 0)} aria-label="Explore graphic design work"><img src="/work/gallery/graphic-01.jpg" alt="Graphic design portfolio work" /><span className="pinned-caption"><strong>Graphic design</strong><small>Identity / image</small></span></a>
      <a className="pinned-card pinned-card-digital" href="#digital-work" aria-label="Explore digital projects"><span className="pinned-digital-art" aria-hidden="true"><span className="pinned-digital-mark">CK<span>.</span></span><span className="pinned-digital-lines"><i /><i /><i /></span></span><span className="pinned-caption"><strong>Digital work</strong><small>Sites / systems</small></span></a>
    </div>
    <div className="work-landing-bottom"><span>Click a pin or scroll to browse</span></div>
  </section>;
}

function Gallery({ onChoose }: { onChoose: (category: number, position: number) => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<(amount: number) => void>(() => {});
  useEffect(() => {
    const viewport = viewportRef.current, track = trackRef.current, cycle = cycleRef.current;
    if (!viewport || !track || !cycle) return;
    const interactive = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 701px) and (prefers-reduced-motion: no-preference)");
    let width = cycle.offsetWidth, current = 0, target = 0, frame = 0;
    const paint = () => {
      const distance = target - current;
      current += distance * .16;
      if (Math.abs(distance) < .35) current = target;
      const wrapped = ((current % width) + width) % width;
      track.style.transform = `translate3d(${-wrapped}px, 0, 0)`;
      frame = current === target ? 0 : requestAnimationFrame(paint);
    };
    const move = (amount: number) => {
      if (!interactive.matches) {
        viewport.scrollBy({ left: amount, behavior: "smooth" });
        return;
      }
      target += amount;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    moveRef.current = move;
    const onWheel = (event: WheelEvent) => {
      if (!interactive.matches) return;
      event.preventDefault();
      move(event.deltaY + event.deltaX);
    };
    const resize = new ResizeObserver(() => {
      width = Math.max(1, cycle.offsetWidth);
      if (!interactive.matches) { current = 0; target = 0; track.style.transform = ""; }
    });
    const onModeChange = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      current = 0;
      target = 0;
      track.style.transform = "";
      viewport.scrollLeft = 0;
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    interactive.addEventListener("change", onModeChange);
    resize.observe(cycle);
    return () => { cancelAnimationFrame(frame); viewport.removeEventListener("wheel", onWheel); interactive.removeEventListener("change", onModeChange); resize.disconnect(); };
  }, []);
  const renderCycle = (duplicate: boolean) => <div className="gallery-cycle" ref={duplicate ? undefined : cycleRef} aria-hidden={duplicate || undefined}>
    {galleryItems.map((item, index) => <a className={`gallery-card shape-${index % 4}`} href="#work-index" key={`${index}-${duplicate}`} tabIndex={duplicate ? -1 : undefined} onClick={() => onChoose(item.category, item.position)} aria-label={duplicate ? undefined : `View ${collections[item.category].name} image ${item.position + 1}`}>
      <figure><img src={item.image} alt={duplicate ? "" : `${collections[item.category].name} portfolio image`} loading={index < 5 && !duplicate ? "eager" : "lazy"} /><figcaption>{collections[item.category].name}</figcaption></figure>
    </a>)}
  </div>;
  return <section className="gallery-section" id="art-direction" aria-labelledby="gallery-title">
    <div className="gallery-intro"><div><h2 id="gallery-title">Art direction<span className="accent-dot">.</span></h2><p>Image-making, campaigns, graphic design and personal work. Every image leads to its category.</p></div><span className="gallery-count">{galleryItems.length} pieces</span></div>
    <div className="gallery-viewport" ref={viewportRef} tabIndex={0} role="region" aria-label="Work gallery. Scroll while pointing here, or use the left and right arrow keys." onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); moveRef.current(event.key === "ArrowRight" ? 360 : -360); } }}>
      <div className="gallery-track" ref={trackRef}>{renderCycle(false)}{renderCycle(true)}</div>
    </div>
    <div className="gallery-footer"><span className="desktop-gallery-hint">Point here and scroll to browse.</span><span className="mobile-gallery-hint">Swipe to browse.</span><div className="gallery-actions"><button type="button" onClick={() => moveRef.current(-360)} aria-label="Previous work">Prev</button><button type="button" onClick={() => moveRef.current(360)} aria-label="Next work">Next</button><a href="#work-index">All work</a></div></div>
  </section>;
}

function WorkIndex({ selected, onChoose }: { selected: SelectedWork; onChoose: (category: number, position: number) => void }) {
  const collection = collections[selected.category];
  const item = collection.items[selected.position];
  const step = (amount: number) => onChoose(selected.category, (selected.position + amount + collection.items.length) % collection.items.length);
  return <section className="work-index" id="work-index" aria-labelledby="work-index-title">
    <div className="index-heading"><p className="eyebrow">Portfolio</p><h2 id="work-index-title">Work<span className="accent-dot">.</span></h2><span className="index-count">{collections.length} categories</span></div>
    <div className="index-body"><div className="index-list" role="group" aria-label="Work categories">
      {collections.map((entry, index) => <button className={index === selected.category ? "index-item is-selected" : "index-item"} type="button" key={entry.name} onClick={() => onChoose(index, 0)} aria-pressed={index === selected.category}><span className="index-number">{String(index + 1).padStart(2, "0")}</span><span className="index-name">{entry.name}</span></button>)}
    </div><div className="index-visual" aria-live="polite" aria-atomic="true">
      <div className="visual-main" key={`${selected.category}-${selected.position}`}>{item.video ? <video src={item.video} poster={item.image} controls preload="metadata" aria-label={`${collection.name} video ${selected.position + 1} of ${collection.items.length}`} /> : <img src={item.image} alt={`${collection.name} portfolio image ${selected.position + 1} of ${collection.items.length}`} />}</div>
      <div className="visual-secondary" aria-hidden="true"><img src={collection.items[(selected.position + 1) % collection.items.length].image} alt="" /></div>
      <div className="visual-caption"><span>{collection.name}</span><span>{collection.year ?? "Selected work"}</span></div>
      <div className="visual-controls"><button type="button" onClick={() => step(-1)} aria-label={`Previous ${collection.name} item`}>Prev</button><span>{String(selected.position + 1).padStart(2, "0")} / {String(collection.items.length).padStart(2, "0")}</span><button type="button" onClick={() => step(1)} aria-label={`Next ${collection.name} item`}>Next</button></div>
    </div></div><div className="index-bottom"><span>Art Direction / Design / Creative Technology</span><a href="/#about">The practice</a></div>
  </section>;
}

function Practice() {
  return <section className="practice-section" id="practice" aria-labelledby="practice-title"><div className="practice-top"><p className="eyebrow">02 / What I do</p><span>London / New Zealand</span></div><div className="practice-grid"><h2 id="practice-title">Direction that carries through the details<span className="accent-dot">.</span></h2><div className="practice-copy"><p>My current work is rooted in art direction, photography and graphic design.</p><p>I’m bringing that eye to websites, interactive experiences and useful creative systems.</p></div></div><div className="services-list">{services.map((service, index) => <article key={service.name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.name}</h3><p>{service.text}</p></article>)}</div></section>;
}
function SystemRow({ item, index }: { item: typeof systems[number]; index: number }) {
  const [open, setOpen] = useState(false), id = useId();
  return <article className="system-row"><button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><span className="system-number">{String(index + 1).padStart(2, "0")}</span><span className="system-name">{item.name}</span><span className="system-toggle" aria-hidden="true">{open ? "−" : "+"}</span></button><div className="system-panel" id={id} hidden={!open}><p className="system-short">{item.short}</p><p>{item.detail}</p><p>{item.outcome}</p></div></article>;
}
function DigitalWork() {
  return <section className="systems-section digital-work" id="digital-work" aria-labelledby="systems-title"><div className="systems-header"><p className="eyebrow">Digital / Websites & systems</p><h2 id="systems-title">Digital work<span className="accent-dot">.</span></h2><p>This part of the portfolio is growing. It begins with this website and local tools built to organise creative work.</p></div><div className="systems-list"><a className="digital-site-link" href="/" aria-label="Explore the Corey Kavanagh portfolio website"><span className="digital-site-number">01</span><span className="digital-site-name">This portfolio</span><span className="digital-site-type">Website / ongoing</span></a>{systems.map((item, index) => <SystemRow key={item.name} item={item} index={index + 1} />)}<p className="digital-next">More websites and product work will appear here as they are built.</p></div></section>;
}
function Footer() {
  return <footer className="site-footer" id="contact"><div><p className="eyebrow">Contact</p><h2>Tell me what you’re trying to create<span className="accent-dot">.</span></h2><p>Art direction, design, a website, or a tool that makes creative work easier.</p></div><div className="footer-bottom"><span>Art Direction / Design / Creative Technology</span><a href="#top">Back to top</a></div></footer>;
}
export default function App() {
  const page: Page = window.location.pathname.replace(/\/+$/, "") === "/work" ? "work" : "home";
  const [selected, setSelected] = useState<SelectedWork>({ category: 1, position: 0 });
  const choose = (category: number, position: number) => setSelected({ category, position });
  useEffect(() => { document.title = page === "work" ? "Work | Corey Kavanagh" : "COREY KAVANAGH | Art Direction / Design / Creative Technology"; }, [page]);
  useEffect(() => {
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [page]);
  return <div id="top" className="site-shell"><Header page={page} /><main>{page === "home" ? <><Intro /><ConversationSection /><Practice /></> : <><WorkLanding onChoose={choose} /><Gallery onChoose={choose} /><WorkIndex selected={selected} onChoose={choose} /><DigitalWork /></>}</main><Footer /></div>;
}
