import { useEffect, useRef, useState } from "react";
import { collections, galleryItems } from "./portfolioData";

type SelectedWork = { category: number; position: number };

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

export default function WorkExplorer() {
  const [selected, setSelected] = useState<SelectedWork>({ category: 1, position: 0 });
  const choose = (category: number, position: number) => setSelected({ category, position });
  return <><WorkLanding onChoose={choose} /><Gallery onChoose={choose} /><WorkIndex selected={selected} onChoose={choose} /></>;
}
