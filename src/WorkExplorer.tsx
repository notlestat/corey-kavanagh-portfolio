import { useEffect, useRef, useState } from "react";
import { collections, galleryItems } from "./portfolioData";
import { caseStudies } from "./caseStudyData";

type SelectedWork = { category: number; position: number };

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
        viewport.scrollBy({ left: amount, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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
    {galleryItems.map((item, index) => <button type="button" className={`gallery-card shape-${index % 4}`} key={`${index}-${duplicate}`} tabIndex={duplicate ? -1 : undefined} onClick={() => onChoose(item.category, item.position)} aria-label={duplicate ? undefined : `View ${collections[item.category].name} ${item.video ? "film" : "image"} ${item.position + 1}`}>
      <figure><img src={item.image} alt={duplicate ? "" : `${collections[item.category].name} portfolio image`} loading={index < 5 && !duplicate ? "eager" : "lazy"} /></figure>
    </button>)}
  </div>;
  return <section className="gallery-section" id="art-direction" aria-labelledby="gallery-title">
    <div className="gallery-intro"><h2 id="gallery-title">Image archive</h2><span className="gallery-count">{galleryItems.length} images &amp; films</span></div>
    <div className="gallery-viewport" ref={viewportRef} tabIndex={0} role="region" aria-label="Work gallery. Scroll while pointing here, or use the left and right arrow keys." onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); moveRef.current(event.key === "ArrowRight" ? 360 : -360); } }}>
      <div className="gallery-track" ref={trackRef}>{renderCycle(false)}{renderCycle(true)}</div>
    </div>
    <div className="gallery-footer"><span className="desktop-gallery-hint">Scroll to explore. Select an image to view.</span><span className="mobile-gallery-hint">Swipe to explore.</span><div className="gallery-actions"><button type="button" onClick={() => moveRef.current(-360)} aria-label="Previous work">Prev</button><button type="button" onClick={() => moveRef.current(360)} aria-label="Next work">Next</button><a href="#work-index">Work index</a></div></div>
  </section>;
}

function WorkList({ onChoose }: { onChoose: (category: number, position: number) => void }) {
  return <section className="work-text-index work-container" id="work-index" aria-labelledby="work-index-title">
    <div className="work-text-index-heading"><div><p className="work-label">Portfolio</p><h2 id="work-index-title">Work.</h2></div><span className="work-label">{collections.length} collections</span></div>
    <ol className="work-text-list">{collections.map((collection, index) => {
      const study = caseStudies.find(item => item.name === collection.name);
      const content = <><span className="work-label">{String(index + 1).padStart(2, "0")}</span><span className="work-text-name">{collection.name}</span><span className="work-text-meta">{study ? "Case study" : "Archive"}</span></>;
      return <li key={collection.name}>{study ? <a href={`/work/${study.slug}`}>{content}</a> : <button type="button" onClick={() => onChoose(index, 0)} aria-label={`View the ${collection.name} archive`}>{content}</button>}</li>;
    })}</ol>
  </section>;
}

function ArchiveViewer({ selected, onChoose, onClose }: { selected: SelectedWork; onChoose: (category: number, position: number) => void; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  const collection = collections[selected.category];
  const item = collection.items[selected.position];
  const step = (amount: number) => onChoose(selected.category, (selected.position + amount + collection.items.length) % collection.items.length);
  const dismiss = () => { dialogRef.current?.close(); onClose(); };
  return <dialog ref={dialogRef} className="archive-viewer" aria-labelledby="archive-viewer-title" onCancel={event => { event.preventDefault(); dismiss(); }} onClick={event => { if (event.target === event.currentTarget) dismiss(); }} onKeyDown={event => {
    if (event.target instanceof HTMLVideoElement) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); }
  }}>
    <div className="archive-viewer-inner">
      <div className="archive-viewer-top"><h2 id="archive-viewer-title">{collection.name}</h2><button type="button" onClick={dismiss}>Close</button></div>
      <div className="archive-viewer-media" key={`${selected.category}-${selected.position}`}>
        {item.video ? <video src={item.video} poster={item.image} controls preload="metadata" aria-label={`${collection.name} film ${selected.position + 1}`} /> : <img src={item.image} alt={`${collection.name}, archive image ${selected.position + 1}`} />}
      </div>
      <div className="archive-viewer-bottom"><span aria-live="polite" aria-atomic="true">{String(selected.position + 1).padStart(2, "0")} / {String(collection.items.length).padStart(2, "0")}</span><div><button type="button" onClick={() => step(-1)}>Prev</button><button type="button" onClick={() => step(1)}>Next</button></div></div>
    </div>
  </dialog>;
}

export default function WorkExplorer() {
  const [selected, setSelected] = useState<SelectedWork | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const choose = (category: number, position: number) => {
    if (!selected && document.activeElement instanceof HTMLElement) triggerRef.current = document.activeElement;
    setSelected({ category, position });
  };
  const close = () => {
    setSelected(null);
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };
  return <><Gallery onChoose={choose} /><WorkList onChoose={choose} />{selected && <ArchiveViewer selected={selected} onChoose={choose} onClose={close} />}</>;
}
