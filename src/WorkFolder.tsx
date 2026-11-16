import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

import { dispatchFolderStateChange } from "./lib/folder-events";
import { workDisciplines } from "./workDisciplines";

export default function WorkFolder() {
  const [open, setOpen] = useState(false);
  const [keyed, setKeyed] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const changeSource = useRef<Event | null>(null);
  const previousOpen = useRef(open);

  useLayoutEffect(() => {
    if (previousOpen.current === open) return;
    previousOpen.current = open;
    const source = changeSource.current;
    changeSource.current = null;
    if (!source || !trigger.current) return;
    dispatchFolderStateChange(trigger.current, source, open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      changeSource.current = event;
      setKeyed(true);
      setOpen(false);
      trigger.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !stage.current?.contains(event.target)
      ) {
        changeSource.current = event;
        setKeyed(false);
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // The folder leans toward the pointer and its prints shift the other way, so the
  // prints read as sitting deeper than the cover. Mouse only, and off for reduced motion.
  useEffect(() => {
    const element = stage.current, room = element?.parentElement;
    const prints = element?.querySelector<HTMLElement>(".folder-prints");
    if (!element || !room || !prints) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const target = { x: 0, y: 0 }, current = { x: 0, y: 0 };
    let frame = 0;
    const paint = () => {
      frame = 0;
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      const resting = Math.abs(target.x - current.x) < 0.002 && Math.abs(target.y - current.y) < 0.002;
      if (resting) { current.x = target.x; current.y = target.y; }
      // x and y run from -1 to 1 across the room; 5 degrees is the most the folder leans.
      if (resting && target.x === 0 && target.y === 0) element.style.removeProperty("--lean");
      else element.style.setProperty("--lean", `perspective(1100px) rotateX(${(-current.y * 5).toFixed(2)}deg) rotateY(${(current.x * 5).toFixed(2)}deg)`);
      prints.style.translate = `${(-current.x * 5).toFixed(2)}px ${(-current.y * 4).toFixed(2)}px`;
      if (!resting) frame = requestAnimationFrame(paint);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !fine.matches || still.matches) return;
      const box = room.getBoundingClientRect();
      target.x = ((event.clientX - box.left) / box.width) * 2 - 1;
      target.y = ((event.clientY - box.top) / box.height) * 2 - 1;
      wake();
    };
    const onLeave = () => { target.x = 0; target.y = 0; wake(); };
    room.addEventListener("pointermove", onMove);
    room.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      room.removeEventListener("pointermove", onMove);
      room.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="folder-room" aria-labelledby="folder-title">
      <h1 id="folder-title" className="sr-only">
        Work
      </h1>
      <div
        ref={stage}
        className="folder-stage"
        data-open={open}
        data-keyed={keyed}
      >
        <div className="folder-back" aria-hidden="true" />
        <button
          ref={trigger}
          className="folder-trigger"
          type="button"
          data-slot="folder-trigger"
          aria-expanded={open}
          aria-controls="folder-categories"
          aria-label={open ? "Close work folder" : "Open work folder"}
          onClick={(event) => {
            changeSource.current = event.nativeEvent;
            setKeyed(event.detail === 0);
            setOpen(!open);
          }}
        >
          <span className="folder-front" aria-hidden="true">
            <span className="folder-edition">CK / 01—03</span>
            <span className="folder-imprint">
              <span>W</span>
              <span>o</span>
              <span>r</span>
              <span>k</span>
              <i>.</i>
            </span>
            <span className="folder-stamp">
              Design
              <br />
              Interaction / Technology
            </span>
          </span>
        </button>
        {/* One print per discipline, tucked into the folder so work shows before it opens.
            Decorative: the trigger's enlarged hit area takes the click. */}
        <div className="folder-prints" aria-hidden="true">
          <img className="folder-print folder-print-design" src="/work/folder/design.webp" alt="" width="200" height="300" />
          <img className="folder-print folder-print-interaction" src="/work/folder/interaction.webp" alt="" width="280" height="194" />
          <img className="folder-print folder-print-technology" src="/work/folder/technology.webp" alt="" width="180" height="243" />
        </div>
        <nav
          id="folder-categories"
          className="folder-files"
          aria-label="Work categories"
          inert={!open}
          aria-hidden={!open}
        >
          {workDisciplines.map((item, index) => (
            <a
              key={item.number}
              href={item.href}
              className="folder-file"
              data-slot="folder-link"
              tabIndex={open ? 0 : -1}
              style={{ "--n": index } as CSSProperties}
            >
              <span className="folder-file-number">{item.number}</span>
              <span className="folder-file-title">
                {item.name}
                <small>{item.note}</small>
              </span>
            </a>
          ))}
        </nav>
        <p className="folder-caption" aria-hidden="true">
          {open ? "Select a discipline" : "Work / 3 folders"}
        </p>
      </div>
      <noscript>
        <style>{".folder-stage { display: none; }"}</style>
        <nav className="folder-fallback" aria-label="Work categories">
          {workDisciplines.map((item) => (
            <a key={item.href} href={item.href}>
              {item.name}
            </a>
          ))}
        </nav>
      </noscript>
    </section>
  );
}
