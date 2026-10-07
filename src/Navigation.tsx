import { useEffect, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";

export type Page = "home" | "work";
type Theme = "light" | "dark";
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

export function GithubIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.12c-3.1.68-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.54 0-1.23.44-2.23 1.15-3.02-.11-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.22 2.7.11 2.98.72.79 1.15 1.79 1.15 3.02 0 4.31-2.61 5.25-5.1 5.53.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>;
}

export function ThemeToggle() {
  // Render the same initial markup on the server and client, then read the
  // theme applied by the layout's early script once the island mounts.
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const applyTheme = (nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#000000" : "#eeefeb");
    try { localStorage.setItem("corey-theme", nextTheme); } catch { /* Storage may be unavailable. */ }
    flushSync(() => setTheme(nextTheme));
  };
  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    const doc = document as ViewTransitionDocument;
    if (event.detail === 0 || matchMedia("(prefers-reduced-motion: reduce)").matches || !doc.startViewTransition || !buttonRef.current) {
      applyTheme(nextTheme);
      return;
    }
    const bounds = buttonRef.current.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2, y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = doc.startViewTransition(() => applyTheme(nextTheme));
    void transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 420, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "both", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(() => { /* An interrupted transition leaves the selected theme in place. */ });
  };
  return <button ref={buttonRef} className="theme-toggle" type="button" onClick={toggleTheme} aria-pressed={theme === "dark"} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
    <span className="theme-toggle-track" aria-hidden="true"><span className="theme-toggle-thumb" /></span>
    <span className="theme-toggle-label" aria-hidden="true">{theme === "light" ? "Dark" : "Light"}</span>
  </button>;
}

export function PageNavigation({ page }: { page: Page }) {
  return <nav className="garment-navigation" aria-label="Pages">
    {(["home", "work"] as const).map(item => <a className={`garment-link garment-link-${item}`} key={item} href={item === "home" ? "/" : "/work"} aria-current={page === item ? "page" : undefined}>
      <span className="garment-button" aria-hidden="true"><span className="garment-holes"><i /><i /><i /><i /></span></span>
      <span className="garment-label">{item === "home" ? "Home" : "Work"}</span>
    </a>)}
  </nav>;
}
