import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { collections, galleryItems } from "./portfolioData";

type SelectedWork = { category: number; position: number };
type Theme = "light" | "dark";
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

function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  const menuId = useId();
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  const applyTheme = (nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#0b0b0b" : "#ffffff");
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
    <a className="wordmark" href="#top" aria-label="Corey Kavanagh, back to top"><img src="/ck-logo.png" alt="" width="320" height="180" /></a>
    <div className="header-actions">
      <button ref={themeButtonRef} className="theme-toggle" type="button" onClick={toggleTheme} aria-pressed={theme === "dark"} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
        <span className="theme-toggle-track" aria-hidden="true"><span className="theme-toggle-thumb" /></span>
        <span className="theme-toggle-label" aria-hidden="true">{theme === "light" ? "Dark" : "Light"}</span>
      </button>
      <button className="menu-button" type="button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      <nav id={menuId} className={open ? "site-nav is-open" : "site-nav"} aria-label="Primary navigation">
        <a href="#work-index" onClick={() => setOpen(false)}>Work</a>
        <a href="#about" onClick={() => setOpen(false)}>Info</a>
        <a href="https://github.com/notlestat" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
      </nav>
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
      <div className="intro-topline"><span>Portfolio / Selected work</span></div>
      <h1 id="intro-title" ref={nameRef}><span>COREY</span><span>KAVANAGH<span className="accent-dot">.</span></span></h1>
      <p className="sr-only">Art Direction, Design and Creative Technology.</p>
      <div className="intro-roles-window" aria-hidden="true"><div className="intro-roles" ref={rolesRef}>{Array.from({ length: 3 }, (_, index) => <em key={index}>Art Direction / Design / Creative Technology</em>)}</div></div>
      <a className="intro-next" href="#work">View work <span aria-hidden="true">↓</span></a>
    </div>
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
  return <section className="gallery-section" id="work" aria-labelledby="gallery-title">
    <div className="gallery-intro"><div><h2 id="gallery-title">Selected work<span className="accent-dot">.</span></h2><p>Art direction, photography and design. Every image leads to its category.</p></div><span className="gallery-count">{galleryItems.length} pieces</span></div>
    <div className="gallery-viewport" ref={viewportRef} tabIndex={0} role="region" aria-label="Work gallery. Scroll while pointing here, or use the left and right arrow keys." onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); moveRef.current(event.key === "ArrowRight" ? 360 : -360); } }}>
      <div className="gallery-track" ref={trackRef}>{renderCycle(false)}{renderCycle(true)}</div>
    </div>
    <div className="gallery-footer"><span className="desktop-gallery-hint">Point here and scroll to browse.</span><span className="mobile-gallery-hint">Swipe to browse.</span><div className="gallery-actions"><button type="button" onClick={() => moveRef.current(-360)} aria-label="Previous work">←</button><button type="button" onClick={() => moveRef.current(360)} aria-label="Next work">→</button><a href="#work-index">All work ↗</a></div></div>
  </section>;
}

function WorkIndex({ selected, onChoose }: { selected: SelectedWork; onChoose: (category: number, position: number) => void }) {
  const collection = collections[selected.category];
  const item = collection.items[selected.position];
  const step = (amount: number) => onChoose(selected.category, (selected.position + amount + collection.items.length) % collection.items.length);
  return <section className="work-index" id="work-index" aria-labelledby="work-index-title">
    <div className="index-heading"><p className="eyebrow">Portfolio</p><h2 id="work-index-title">Work<span className="accent-dot">.</span></h2><span className="index-count">{collections.length} categories</span></div>
    <div className="index-body"><div className="index-list" role="group" aria-label="Work categories">
      {collections.map((entry, index) => <button className={index === selected.category ? "index-item is-selected" : "index-item"} type="button" key={entry.name} onClick={() => onChoose(index, 0)} aria-pressed={index === selected.category}><span className="index-number">{String(index + 1).padStart(2, "0")}</span><span className="index-name">{entry.name}</span><span className="index-arrow" aria-hidden="true">↗</span></button>)}
    </div><div className="index-visual" aria-live="polite" aria-atomic="true">
      <div className="visual-main" key={`${selected.category}-${selected.position}`}>{item.video ? <video src={item.video} poster={item.image} controls preload="metadata" aria-label={`${collection.name} video ${selected.position + 1} of ${collection.items.length}`} /> : <img src={item.image} alt={`${collection.name} portfolio image ${selected.position + 1} of ${collection.items.length}`} />}</div>
      <div className="visual-secondary" aria-hidden="true"><img src={collection.items[(selected.position + 1) % collection.items.length].image} alt="" /></div>
      <div className="visual-caption"><span>{collection.name}</span><span>{collection.year ?? "Selected work"}</span></div>
      <div className="visual-controls"><button type="button" onClick={() => step(-1)} aria-label={`Previous ${collection.name} item`}>←</button><span>{String(selected.position + 1).padStart(2, "0")} / {String(collection.items.length).padStart(2, "0")}</span><button type="button" onClick={() => step(1)} aria-label={`Next ${collection.name} item`}>→</button></div>
    </div></div><div className="index-bottom"><span>Art Direction / Design / Creative Technology</span><a href="#about">The practice <span aria-hidden="true">↗</span></a></div>
  </section>;
}

function Practice() {
  return <section className="practice-section" id="about" aria-labelledby="practice-title"><div className="practice-top"><p className="eyebrow">02 / The practice</p><span>London / New Zealand</span></div><div className="practice-grid"><h2 id="practice-title">I work across art direction, design and creative technology<span className="accent-dot">.</span></h2><div className="practice-copy"><p>My current portfolio is rooted in art direction, photography and graphic design.</p><p>I’m moving into design engineering and creative technology, bringing the same visual direction to websites, interactive experiences, digital products and AI systems.</p></div></div><div className="services-list">{services.map((service, index) => <article key={service.name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.name}</h3><p>{service.text}</p></article>)}</div></section>;
}
function SystemRow({ item, index }: { item: typeof systems[number]; index: number }) {
  const [open, setOpen] = useState(false), id = useId();
  return <article className="system-row"><button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><span className="system-number">{String(index + 1).padStart(2, "0")}</span><span className="system-name">{item.name}</span><span className="system-toggle" aria-hidden="true">{open ? "−" : "+"}</span></button><div className="system-panel" id={id} hidden={!open}><p className="system-short">{item.short}</p><p>{item.detail}</p><p>{item.outcome}</p></div></article>;
}
function Systems() {
  return <section className="systems-section" id="systems" aria-labelledby="systems-title"><div className="systems-header"><p className="eyebrow">03 / Built systems</p><h2 id="systems-title">Ideas made operational<span className="accent-dot">.</span></h2><p>Local workflows I have built to organise creative work, keep decisions visible and reduce avoidable admin.</p></div><div className="systems-list">{systems.map((item, index) => <SystemRow key={item.name} item={item} index={index} />)}</div></section>;
}
function Footer() {
  return <footer className="site-footer" id="contact"><div><p className="eyebrow">04 / Contact</p><h2>Tell me what you’re trying to create<span className="accent-dot">.</span></h2><p>Or tell me what is taking too much time. We can use that as the starting point.</p><p className="contact-note">Contact details will be added before launch.</p></div><div className="footer-bottom"><span>Art Direction / Design / Creative Technology</span><a href="#top">Back to top ↑</a></div></footer>;
}
export default function App() {
  const [selected, setSelected] = useState<SelectedWork>({ category: 1, position: 0 });
  const choose = (category: number, position: number) => setSelected({ category, position });
  return <div id="top" className="site-shell"><Header /><main><Intro /><Gallery onChoose={choose} /><WorkIndex selected={selected} onChoose={choose} /><Practice /><Systems /></main><Footer /></div>;
}
