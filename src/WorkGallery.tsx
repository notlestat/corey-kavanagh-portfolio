import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { collections, galleryItems, type GalleryItem } from "./portfolioData";
import DisplayCards from "./components/ui/display-cards";

export type SelectedWork = { category: number; position: number };

type GalleryProps = {
  onChoose: (category: number, position: number) => void;
  items?: GalleryItem[];
  title?: string;
  id?: string;
  autoPlay?: boolean;
  indexHref?: string;
  suspended?: boolean;
  filters?: ReactNode;
};

export function Gallery({
  onChoose,
  items = galleryItems,
  title = "Image archive",
  id = "art-direction",
  autoPlay = false,
  indexHref = "#work-index",
  suspended = false,
  filters,
}: GalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<(amount: number, instant?: boolean) => void>(() => {});
  const wakeRef = useRef<() => void>(() => {});
  const pausedRef = useRef(false);
  const suspendedRef = useRef(suspended);
  const [paused, setPaused] = useState(false);
  const [canLoop, setCanLoop] = useState(false);
  const [repeatCount, setRepeatCount] = useState(2);
  // Roving tabindex: one card is in the tab order; arrow keys move between cards.
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    suspendedRef.current = suspended;
    wakeRef.current();
  }, [suspended]);

  useEffect(() => {
    const viewport = viewportRef.current,
      track = trackRef.current,
      cycle = cycleRef.current;
    if (!viewport || !track || !cycle) return;
    const interactive = matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 701px) and (prefers-reduced-motion: no-preference)",
    );
    let width = Math.max(1, cycle.offsetWidth),
      current = 0,
      target = 0,
      frame = 0;
    let previousTime = 0,
      visible = false,
      hovered = false,
      focused = false,
      keyboardNavigation = false;
    const looping = () =>
      autoPlay &&
      interactive.matches &&
      visible &&
      !document.hidden &&
      !hovered &&
      !focused &&
      !pausedRef.current &&
      !suspendedRef.current;
    const render = () => {
      const wrapped = ((current % width) + width) % width;
      track.style.transform = `translate3d(${-wrapped}px, 0, 0)`;
    };
    const paint = (time: number) => {
      frame = 0;
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      const auto = looping();
      if (auto) {
        // Linear 24px/s drift, independent of display refresh rate.
        current += elapsed * 0.024;
        target += elapsed * 0.024;
      }
      const distance = target - current;
      current += distance * 0.16;
      if (Math.abs(distance) < 0.35) current = target;
      render();
      if (auto || current !== target) frame = requestAnimationFrame(paint);
      else previousTime = 0;
    };
    const wake = () => {
      if (!frame && interactive.matches) {
        previousTime = 0;
        frame = requestAnimationFrame(paint);
      }
    };
    wakeRef.current = wake;
    const move = (amount: number, instant = false) => {
      if (!interactive.matches) {
        viewport.scrollBy({
          left: amount,
          behavior:
            instant || matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
        });
        return;
      }
      target += amount;
      if (instant) {
        current = target;
        render();
      }
      wake();
    };
    moveRef.current = move;
    const onWheel = (event: WheelEvent) => {
      if (!interactive.matches) return;
      event.preventDefault();
      move(event.deltaY + event.deltaX);
    };
    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
      wake();
    };
    const onDocumentKeyDown = (event: KeyboardEvent) => {
      keyboardNavigation = ["Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key);
    };
    const onDocumentPointerDown = () => {
      keyboardNavigation = false;
    };
    const onFocus = (event: FocusEvent) => {
      focused = true;
      if (!interactive.matches || !(event.target instanceof HTMLElement))
        return;
      const card = event.target.closest<HTMLElement>(".gallery-card");
      if (!card || !keyboardNavigation || !card.matches(":focus-visible")) return;
      // Tabbing to a real image must bring it into view, without animated focus travel.
      current = target = card.offsetLeft;
      viewport.scrollLeft = 0;
      render();
    };
    const onBlur = (event: FocusEvent) => {
      if (
        event.relatedTarget instanceof Node &&
        viewport.contains(event.relatedTarget)
      )
        return;
      focused = false;
      wake();
    };
    const onModeChange = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      current = 0;
      target = 0;
      track.style.transform = "";
      viewport.scrollLeft = 0;
      setCanLoop(interactive.matches);
      wake();
    };
    const resize = new ResizeObserver(() => {
      width = Math.max(1, cycle.offsetWidth);
      // Short collections need enough copies to cover the viewport at the wrap.
      setRepeatCount(Math.max(2, Math.ceil(viewport.offsetWidth / width) + 1));
      if (!interactive.matches) {
        current = 0;
        target = 0;
        track.style.transform = "";
      } else render();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    viewport.addEventListener("focusin", onFocus);
    viewport.addEventListener("focusout", onBlur);
    document.addEventListener("visibilitychange", wake);
    document.addEventListener("keydown", onDocumentKeyDown, true);
    document.addEventListener("pointerdown", onDocumentPointerDown, true);
    interactive.addEventListener("change", onModeChange);
    setCanLoop(interactive.matches);
    resize.observe(cycle);
    resize.observe(viewport);
    intersection.observe(viewport);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      viewport.removeEventListener("focusin", onFocus);
      viewport.removeEventListener("focusout", onBlur);
      document.removeEventListener("visibilitychange", wake);
      document.removeEventListener("keydown", onDocumentKeyDown, true);
      document.removeEventListener("pointerdown", onDocumentPointerDown, true);
      interactive.removeEventListener("change", onModeChange);
      resize.disconnect();
      intersection.disconnect();
      wakeRef.current = () => {};
    };
  }, [autoPlay, items]);

  const renderCycle = (duplicate: boolean, key = "original") => (
    <div
      key={key}
      className="gallery-cycle"
      ref={duplicate ? undefined : cycleRef}
      aria-hidden={duplicate || undefined}
    >
      {items.map((item, index) => (
        <button
          type="button"
          className={`gallery-card shape-${index % 4}`}
          key={`${item.category}-${item.position}-${duplicate}`}
          tabIndex={duplicate || index !== activeIndex ? -1 : 0}
          onFocus={duplicate ? undefined : () => setActiveIndex(index)}
          onClick={() => onChoose(item.category, item.position)}
          aria-label={
            duplicate
              ? undefined
              : `View ${collections[item.category].name} ${item.video ? "film" : "image"} ${item.position + 1}`
          }
        >
          <figure>
            <img
              src={item.image}
              width={item.width}
              height={item.height}
              alt={
                duplicate
                  ? ""
                  : `${collections[item.category].name} portfolio image`
              }
              loading={index < 5 && !duplicate ? "eager" : "lazy"}
            />
          </figure>
        </button>
      ))}
    </div>
  );
  return (
    <section
      className={`gallery-section${autoPlay ? " discipline-gallery" : ""}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <div className="gallery-intro">
        <h2 id={`${id}-title`}>{title}</h2>
        <span className="gallery-count">{items.length} images &amp; films</span>
      </div>
      {filters}
      <div
        className="gallery-viewport"
        ref={viewportRef}
        role="region"
        aria-label={`${title}. Scroll or swipe to explore, or use the left and right arrow keys.`}
        onKeyDown={(event) => {
          const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
          const cards = cycleRef.current?.children;
          if (!keys.includes(event.key) || !cards?.length) return;
          event.preventDefault();
          const last = cards.length - 1;
          const next =
            event.key === "Home" ? 0
            : event.key === "End" ? last
            : event.key === "ArrowRight" ? Math.min(activeIndex + 1, last)
            : Math.max(activeIndex - 1, 0);
          setActiveIndex(next);
          (cards[next] as HTMLElement).focus();
        }}
      >
        <div className="gallery-track" ref={trackRef}>
          {renderCycle(false)}
          {Array.from({ length: repeatCount - 1 }, (_, index) => renderCycle(true, `copy-${index}`))}
        </div>
      </div>
      <div className="gallery-footer">
        <span className="desktop-gallery-hint">Select an image to view.</span>
        <span className="mobile-gallery-hint">Swipe to explore.</span>
        <div className="gallery-actions">
          {autoPlay && (
            <button
              className="gallery-pause"
              type="button"
              disabled={!canLoop}
              aria-label={paused ? "Resume image loop" : "Pause image loop"}
              onClick={() => {
                pausedRef.current = !pausedRef.current;
                setPaused(pausedRef.current);
                wakeRef.current();
              }}
            >
              {paused ? "Resume" : "Pause"}
            </button>
          )}
          <button
            type="button"
            onClick={(event) => moveRef.current(-360, event.detail === 0)}
            aria-label="Previous work"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={(event) => moveRef.current(360, event.detail === 0)}
            aria-label="Next work"
          >
            Next
          </button>
          <a href={indexHref}>{autoPlay ? "Case studies" : "Work index"}</a>
        </div>
      </div>
    </section>
  );
}

export default function WorkGallery({
  filterable = false,
  ...props
}: Omit<GalleryProps, "onChoose" | "suspended" | "filters"> & { filterable?: boolean }) {
  const [selected, setSelected] = useState<SelectedWork | null>(null);
  const allItems = props.items ?? galleryItems;
  const [filter, setFilter] = useState<number | null>(null);
  // Projects in collection order, with how many pieces each has in this gallery.
  const projects = useMemo(() => {
    const counts = new Map<number, number>();
    allItems.forEach((item) => counts.set(item.category, (counts.get(item.category) ?? 0) + 1));
    return [...counts].sort(([a], [b]) => a - b);
  }, [allItems]);
  const items = useMemo(
    () => (filter === null ? allItems : allItems.filter((item) => item.category === filter)),
    [allItems, filter],
  );
  const filters = filterable && (
    <div className="gallery-filters" role="group" aria-label="Filter by project">
      <button type="button" aria-pressed={filter === null} onClick={() => setFilter(null)}>
        All <span>{allItems.length}</span>
      </button>
      {projects.map(([category, count]) => (
        <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>
          {collections[category].name} <span>{count}</span>
        </button>
      ))}
    </div>
  );
  const triggerRef = useRef<HTMLElement | null>(null);
  const choose = (category: number, position: number) => {
    if (!selected && document.activeElement instanceof HTMLElement)
      triggerRef.current = document.activeElement;
    setSelected({ category, position });
  };
  const close = () => {
    setSelected(null);
    requestAnimationFrame(() =>
      triggerRef.current?.focus({ preventScroll: true }),
    );
  };
  return (
    <>
      {/* A new key remounts the slider so its loop and keyboard position restart with the filter. */}
      <Gallery {...props} key={filter ?? "all"} items={items} filters={filters || undefined} onChoose={choose} suspended={!!selected} />
      {selected && (
        <ArchiveViewer selected={selected} onChoose={choose} onClose={close} />
      )}
    </>
  );
}

export function ArchiveViewer({
  selected,
  onChoose,
  onClose,
}: {
  selected: SelectedWork;
  onChoose: (category: number, position: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  const collection = collections[selected.category];
  const step = (amount: number) =>
    onChoose(
      selected.category,
      (selected.position + amount + collection.items.length) %
        collection.items.length,
    );
  const dismiss = () => {
    dialogRef.current?.close();
    onClose();
  };
  return (
    <dialog
      ref={dialogRef}
      className="archive-viewer"
      aria-labelledby="archive-viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
      onKeyDown={(event) => {
        if (event.target instanceof HTMLVideoElement) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          step(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="archive-viewer-inner">
        <div className="archive-viewer-top">
          <h2 id="archive-viewer-title">{collection.name}</h2>
          <button type="button" onClick={dismiss}>
            Close
          </button>
        </div>
        <div className="archive-viewer-media">
          <DisplayCards cards={collection.items} title={collection.name} selectedIndex={selected.position} onSelect={(position) => onChoose(selected.category, position)} />
        </div>
        <div className="archive-viewer-bottom">
          <span aria-live="polite" aria-atomic="true">
            {String(selected.position + 1).padStart(2, "0")} /{" "}
            {String(collection.items.length).padStart(2, "0")}
          </span>
          <div>
            <button type="button" onClick={() => step(-1)}>
              Prev
            </button>
            <button type="button" onClick={() => step(1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
