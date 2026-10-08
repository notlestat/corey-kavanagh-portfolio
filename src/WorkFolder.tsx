import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { FOLDER_STATE_CHANGE, type FolderStateChange } from "./lib/folder-events";
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
    trigger.current.dispatchEvent(
      new CustomEvent<FolderStateChange>(FOLDER_STATE_CHANGE, {
        bubbles: true,
        detail: { source, open },
      }),
    );
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
              Art direction
              <br />
              Interaction / Technology
            </span>
          </span>
        </button>
        <nav
          id="folder-categories"
          className="folder-files"
          aria-label="Work categories"
          inert={!open}
          aria-hidden={!open}
        >
          {workDisciplines.map((item) => (
            <a
              key={item.number}
              href={item.href}
              className="folder-file"
              data-slot="folder-link"
              tabIndex={open ? 0 : -1}
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
