import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import "./hover-preview-list.css";

export interface PreviewProject {
  title: string;
  href: string;
  role: string;
  period: string;
  src: string;
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
}

// The preview hangs to the right of the pointer and stays inside the window.
const OFFSET = 36;
const PREVIEW_WIDTH = 340;
const EDGE = 24;
// Each frame closes this fraction of the gap to the pointer, so the image trails slightly.
const FOLLOW = 0.16;

/** Title rows with an image that follows the pointer. A pattern common to
    portfolio indexes (see the Cursor and Flowing Menu components in
    motion-primitives and React Bits), written here without an animation
    library. Touch screens get a small thumbnail in each row instead. */
export default function HoverPreviewList({ projects, label, allHref }: { projects: PreviewProject[]; label: string; allHref: string }) {
  const [active, setActive] = useState<number | null>(null);
  // The preview images download on the first hover or keyboard focus, so visitors
  // who never point at the list, and every touch screen, skip them.
  const [armed, setArmed] = useState(false);
  const float = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const shown = useRef(false);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const place = () => {
    if (float.current) float.current.style.transform = `translate3d(${current.current.x.toFixed(1)}px, ${current.current.y.toFixed(1)}px, 0)`;
  };
  const follow = () => {
    frame.current = 0;
    const dx = target.current.x - current.current.x, dy = target.current.y - current.current.y;
    if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
      current.current = { ...target.current };
      place();
      return;
    }
    current.current.x += dx * FOLLOW;
    current.current.y += dy * FOLLOW;
    place();
    frame.current = requestAnimationFrame(follow);
  };
  const moveTo = (x: number, y: number, instant: boolean) => {
    target.current = {
      x: Math.min(x, window.innerWidth - PREVIEW_WIDTH - EDGE),
      y: Math.max(200, Math.min(y, window.innerHeight - 200)),
    };
    if (instant) {
      current.current = { ...target.current };
      place();
    } else if (!frame.current) frame.current = requestAnimationFrame(follow);
  };

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse") return;
    const row = (event.target as HTMLElement).closest<HTMLElement>("[data-row]");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The first frame snaps, so the image appears at the pointer instead of flying in.
    setArmed(true);
    moveTo(event.clientX + OFFSET, event.clientY, still || !shown.current);
    shown.current = row !== null;
    setActive(row ? Number(row.dataset.row) : null);
  };
  const hide = () => {
    shown.current = false;
    setActive(null);
  };
  // Keyboard focus shows the same preview, parked at the right of the focused row.
  const onFocus = (event: FocusEvent<HTMLAnchorElement>, index: number) => {
    if (!event.currentTarget.matches(":focus-visible")) return;
    setArmed(true);
    const box = event.currentTarget.getBoundingClientRect();
    moveTo(box.right - PREVIEW_WIDTH, box.top + box.height / 2, true);
    shown.current = true;
    setActive(index);
  };

  return <section className="preview-index work-container" aria-labelledby="preview-index-title">
    <header className="preview-index-heading">
      <h2 id="preview-index-title">{label}</h2>
      <a href={allHref}>All work</a>
    </header>
    <ul className="preview-list" onPointerMove={onPointerMove} onPointerLeave={hide}>
      {projects.map((project, index) => <li key={project.href}>
        <a className="preview-row" href={project.href} data-row={index} onFocus={event => onFocus(event, index)} onBlur={hide}>
          <span className="preview-thumb"><img src={project.src} srcSet={project.srcSet} sizes="64px" alt="" loading="lazy" decoding="async" /></span>
          <span className="preview-name">{project.title}</span>
          <span className="preview-role">{project.role}</span>
          <span className="preview-period">{project.period}</span>
        </a>
      </li>)}
    </ul>
    <div className="preview-float" ref={float} aria-hidden="true">
      {armed && projects.map((project, index) => <img key={project.href} src={project.src} srcSet={project.srcSet} sizes={`${PREVIEW_WIDTH}px`} alt="" width={project.width} height={project.height} data-active={active === index} decoding="async" />)}
    </div>
  </section>;
}
