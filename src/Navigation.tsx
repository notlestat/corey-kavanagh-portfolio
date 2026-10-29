export type Page = "home" | "work";

export function GithubIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.12c-3.1.68-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.54 0-1.23.44-2.23 1.15-3.02-.11-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.22 2.7.11 2.98.72.79 1.15 1.79 1.15 3.02 0 4.31-2.61 5.25-5.1 5.53.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>;
}

export function PageNavigation({ page }: { page: Page }) {
  return <nav className="garment-navigation" aria-label="Pages">
    {(["home", "work"] as const).map(item => <a className={`garment-link garment-link-${item}`} key={item} href={item === "home" ? "/" : "/work"} aria-current={page === item ? "page" : undefined}>
      <span className="garment-button" aria-hidden="true"><span className="garment-holes"><i /><i /><i /><i /></span></span>
      <span className="garment-label">{item === "home" ? "Home" : "Work"}</span>
    </a>)}
  </nav>;
}
