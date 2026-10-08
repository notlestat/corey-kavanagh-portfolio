import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import * as currentSound from "../src/components/sound";

export { currentSound as soundAPI };

function expect(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function mountSoundScopeRegression(scope: "all" | "folder") {
  const container = document.createElement("div");
  container.id = "sound-scope-regression";
  document.body.prepend(container);
  const root = createRoot(container);
  flushSync(() => root.render(
    <currentSound.SoundEffects scope={scope}>
      <currentSound.SoundToggle />
    </currentSound.SoundEffects>,
  ));
  return () => {
    flushSync(() => root.unmount());
    container.remove();
  };
}

export function checkMobileHeader() {
  const header = document.querySelector<HTMLElement>(".site-header")!;
  const selectors = [
    ".garment-link-home",
    ".garment-link-work",
    "button[data-sound]",
    "button.theme-toggle",
    ".github-link",
  ];
  const controls = selectors.map((selector) => {
    const element = header.querySelector<HTMLElement>(selector)!;
    expect(Boolean(element), `${selector} exists`);
    const rect = element.getBoundingClientRect();
    expect(rect.width > 0 && rect.height > 0, `${selector} is visible`);
    expect(getComputedStyle(element).visibility === "visible", `${selector} is available`);
    expect(rect.left >= 0 && rect.right <= innerWidth, `${selector} fits horizontally`);
    const bounds = header.getBoundingClientRect();
    expect(rect.top >= bounds.top && rect.bottom <= bounds.bottom, `${selector} fits the header`);
    return { selector, element, rect };
  });
  for (let i = 0; i < controls.length; i++) {
    for (let j = i + 1; j < controls.length; j++) {
      const a = controls[i];
      const b = controls[j];
      expect(
        a.rect.right <= b.rect.left || b.rect.right <= a.rect.left ||
        a.rect.bottom <= b.rect.top || b.rect.bottom <= a.rect.top,
        `${a.selector} does not overlap ${b.selector}`,
      );
    }
  }
  const github = controls.at(-1)!.element as HTMLAnchorElement;
  expect(github.href === "https://github.com/notlestat", "GitHub keeps its destination");
  github.focus();
  expect(document.activeElement === github, "GitHub accepts keyboard focus");
  github.blur();
  expect(document.documentElement.scrollWidth <= innerWidth, "No horizontal overflow");
  return { width: innerWidth, controls: controls.length, passed: true };
}

export function runSoundRegression(sound = currentSound, failReads = false) {
  const mutedKey = "kobra-sound-muted";
  const volumeKey = "kobra-sound-volume";
  const originalSet = Storage.prototype.setItem;
  const originalGet = Storage.prototype.getItem;
  const previousMuted = localStorage.getItem(mutedKey);
  const previousVolume = localStorage.getItem(volumeKey);
  localStorage.setItem(mutedKey, "0");
  localStorage.setItem(volumeKey, "0.8");
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  function Probe() {
    const muted = sound.useSoundMuted();
    const volume = sound.useSoundVolume();
    return <output data-muted={String(muted)} data-volume={String(volume)} />;
  }
  const assertState = (muted: boolean, volume: number) => {
    const probes = container.querySelectorAll("output");
    expect(probes.length === 2, "Both mounted subscribers render");
    for (const probe of probes) {
      expect(probe.dataset.muted === String(muted), `Mute subscribers render ${muted}`);
      expect(probe.dataset.volume === String(volume), `Volume subscribers render ${volume}`);
    }
    expect(container.querySelector("button")!.getAttribute("aria-pressed") === String(muted), "Toggle exposes current mute state");
  };
  let reads = 0;
  let writes = 0;
  try {
    if (failReads) {
      Storage.prototype.getItem = function (key) {
        if (key === mutedKey || key === volumeKey) throw new DOMException("Blocked", "SecurityError");
        return originalGet.call(this, key);
      };
    }
    flushSync(() => root.render(<><sound.SoundToggle /><Probe /><Probe /></>));
    assertState(false, failReads ? 0.5 : 0.8);
    if (!failReads) {
      flushSync(() => { sound.setSoundMuted(true); sound.setSoundVolume(0.3); });
      assertState(true, 0.3);
      expect(localStorage.getItem(mutedKey) === "1", "Mute persists when storage works");
      expect(localStorage.getItem(volumeKey) === "0.3", "Volume persists when storage works");
      flushSync(() => { sound.setSoundMuted(false); sound.setSoundVolume(0.8); });
    }
    Storage.prototype.getItem = function (key) {
      if (key === mutedKey || key === volumeKey) reads++;
      return originalGet.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === mutedKey || key === volumeKey) {
        writes++;
        throw new DOMException("Quota exhausted", "QuotaExceededError");
      }
      return originalSet.call(this, key, value);
    };
    flushSync(() => container.querySelector<HTMLButtonElement>("button")!.click());
    assertState(true, failReads ? 0.5 : 0.8);
    flushSync(() => sound.setSoundVolume(0.25));
    assertState(true, 0.25);
    expect(originalGet.call(localStorage, mutedKey) === "0", "Persisted mute remains stale");
    expect(originalGet.call(localStorage, volumeKey) === "0.8", "Persisted volume remains stale");
    flushSync(() => window.dispatchEvent(new StorageEvent("storage", { key: mutedKey, newValue: "0" })));
    assertState(true, 0.25);
    flushSync(() => container.querySelector<HTMLButtonElement>("button")!.click());
    assertState(false, 0.25);
    flushSync(() => { sound.setSoundVolume(NaN); sound.setSoundVolume(Infinity); });
    assertState(false, 0.25);
    flushSync(() => sound.setSoundVolume(-1));
    assertState(false, 0);
    flushSync(() => sound.setSoundVolume(2));
    assertState(false, 1);
    return { passed: true, failReads, subscribers: 2, reads, writes };
  } finally {
    flushSync(() => root.unmount());
    container.remove();
    Storage.prototype.setItem = originalSet;
    Storage.prototype.getItem = originalGet;
    for (const [key, value] of [[mutedKey, previousMuted], [volumeKey, previousVolume]]) {
      if (value === null) localStorage.removeItem(key!);
      else originalSet.call(localStorage, key!, value!);
    }
  }
}
