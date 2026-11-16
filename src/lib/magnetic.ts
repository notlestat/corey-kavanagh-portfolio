// Pulls an element a short way toward the pointer while the pointer is over its
// zone, like a button on a loose thread. The pattern is the "Magnetic" component
// from motion-primitives, written without the animation library: the element's
// own CSS transition on `translate` does the smoothing and the return.
//
//   <a data-magnetic-zone><span data-magnetic>…</span></a>
//
// `translate` is separate from `transform`, so existing hover and press
// transforms on the element keep working.

const STRENGTH = 0.28;

export function initMagnetic(root: ParentNode = document) {
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  root.querySelectorAll<HTMLElement>("[data-magnetic-zone]").forEach(zone => {
    const target = zone.querySelector<HTMLElement>("[data-magnetic]");
    if (!target) return;

    zone.addEventListener("pointermove", event => {
      if (event.pointerType !== "mouse" || !fine.matches || still.matches) return;
      const box = zone.getBoundingClientRect();
      const x = (event.clientX - (box.left + box.width / 2)) * STRENGTH;
      const y = (event.clientY - (box.top + box.height / 2)) * STRENGTH;
      target.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    zone.addEventListener("pointerleave", () => {
      target.style.translate = "";
    });
  });
}
