import { animate, domAnimation, LazyMotion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "motion/react";
// `m` is Motion's small component. On its own it renders nothing extra; LazyMotion
// hands it `domAnimation`, the part that writes motion values to an element's style.
// Together they leave out the drag and layout code the full `motion` component carries.
import * as m from "motion/react-m";
import { useEffect, useRef, type PointerEvent } from "react";

export type Page = "home" | "work";

export function GithubIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.12c-3.1.68-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.54 0-1.23.44-2.23 1.15-3.02-.11-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.22 2.7.11 2.98.72.79 1.15 1.79 1.15 3.02 0 4.31-2.61 5.25-5.1 5.53.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>;
}

// `rest` is the angle a tag hangs at when nothing is touching it. The two differ
// so the pair does not look machine-set.
const TAGS = [
  { page: "home", label: "Home", href: "/", rest: -2 },
  { page: "work", label: "Work", href: "/work", rest: 1.5 },
] as const;
type Tag = (typeof TAGS)[number];

// The spring pulls a tag back to hanging straight. Damping this low lets it
// pass through and return a few times first, which is what makes it a pendulum.
const PENDULUM = { type: "spring", stiffness: 55, damping: 2.6, mass: 1 } as const;
// With reduced motion a released tag returns once, without swinging.
const STILL = { type: "spring", stiffness: 260, damping: 34, mass: 1 } as const;

const MAX_ANGLE = 48;
const ARRIVAL_KEY = "tag-arrival";
const ARRIVAL_PUSH = 170;
const BRUSH_PAUSE = 350;
// A press has to travel this many pixels before it counts as a drag and not a click.
const DRAG_START = 4;

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

// Past the limit the tag keeps following, at a fifth of the distance.
const resist = (angle: number) => {
  const over = Math.abs(angle) - MAX_ANGLE;
  return over <= 0 ? angle : Math.sign(angle) * (MAX_ANGLE + over * .2);
};

export function PageNavigation({ page }: { page: Page }) {
  return <LazyMotion features={domAnimation} strict>
    <nav className="tag-navigation" aria-label="Pages">
      {TAGS.map(tag => <SwingTag key={tag.page} tag={tag} current={tag.page === page} />)}
    </nav>
  </LazyMotion>;
}

function SwingTag({ tag, current }: { tag: Tag; current: boolean }) {
  const reduce = useReducedMotion();

  // Degrees away from rest. Positive is clockwise, which carries the card left.
  // Everything that moves is derived from this one value.
  const swing = useMotionValue(0);
  const rotate = useTransform(swing, angle => angle + tag.rest);
  // The card trails the thread. It leans against the direction of travel, then catches up.
  const lean = useSpring(useTransform(useVelocity(swing), [-500, 500], [9, -9]), { stiffness: 220, damping: 14 });

  const hook = useRef({ x: 0, y: 0 });
  const press = useRef<{ id: number; x: number; y: number } | null>(null);
  const grip = useRef(0);
  const dragged = useRef(false);
  const brushedAt = useRef(0);

  // Let go: the spring takes over at whatever speed the tag already has, plus any push.
  const release = (push = 0) => {
    if (reduce) animate(swing, 0, STILL);
    else animate(swing, 0, { ...PENDULUM, velocity: swing.getVelocity() + push });
  };

  // The tag you clicked on the last page is still moving when this one opens.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ARRIVAL_KEY) !== tag.page) return;
      sessionStorage.removeItem(ARRIVAL_KEY);
    } catch { return; }
    if (!reduce) release(tag.rest < 0 ? ARRIVAL_PUSH : -ARRIVAL_PUSH);
    // Runs once, when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The angle of a line from the hook, at the top of the thread, to the pointer.
  const angleTo = (event: PointerEvent) =>
    -Math.atan2(event.clientX - hook.current.x, Math.max(event.clientY - hook.current.y, 1)) * 180 / Math.PI;

  const startDrag = (event: PointerEvent<HTMLAnchorElement>) => {
    const link = event.currentTarget;
    const nav = link.closest<HTMLElement>(".tag-navigation");
    if (!nav) return;
    // offsetLeft ignores the link's own rotation, so the hook stays put while the tag swings.
    const box = nav.getBoundingClientRect();
    hook.current = { x: box.left + link.offsetLeft + link.offsetWidth / 2, y: box.top + link.offsetTop };
    // Capture keeps the moves coming to this link after the pointer slides off it.
    link.setPointerCapture(event.pointerId);
    swing.stop();
    // Remember where on the swing the pointer took hold, so the tag does not jump to it.
    grip.current = angleTo(event) - swing.get();
    dragged.current = true;
  };

  // A pointer passing through knocks the tag the way it was travelling.
  const brush = (event: PointerEvent) => {
    if (reduce || event.pointerType !== "mouse" || event.buttons !== 0 || event.movementX === 0) return;
    if (event.timeStamp - brushedAt.current < BRUSH_PAUSE) return;
    brushedAt.current = event.timeStamp;
    release(clamp(event.movementX * -18, 300));
  };

  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    const held = press.current;
    if (held?.id !== event.pointerId) { brush(event); return; }
    if (!dragged.current) {
      if (Math.hypot(event.clientX - held.x, event.clientY - held.y) < DRAG_START) return;
      startDrag(event);
    }
    // While held, the tag follows the pointer exactly. No spring until it is let go.
    if (dragged.current) swing.set(resist(angleTo(event) - grip.current));
  };

  const letGo = (event: PointerEvent) => {
    if (press.current?.id !== event.pointerId) return;
    press.current = null;
    if (dragged.current) release();
  };

  return <m.a
    className={`tag-link tag-link-${tag.page}`}
    href={tag.href}
    aria-current={current ? "page" : undefined}
    draggable={false}
    style={{ rotate, originX: .5, originY: 0 }}
    onPointerDown={event => {
      if (event.button !== 0) return;
      press.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      dragged.current = false;
    }}
    onPointerMove={move}
    onPointerUp={letGo}
    onPointerCancel={letGo}
    onClick={event => {
      // A drag ends in a click. Only a press that did not move follows the link.
      if (dragged.current) { dragged.current = false; event.preventDefault(); return; }
      try { sessionStorage.setItem(ARRIVAL_KEY, tag.page); } catch { /* Storage is blocked; the page still opens. */ }
    }}
  >
    <span className="tag-string" aria-hidden="true" />
    <m.span className="tag" style={{ rotate: reduce ? 0 : lean }}>
      <i className="tag-eye" aria-hidden="true" />{tag.label}
    </m.span>
  </m.a>;
}
