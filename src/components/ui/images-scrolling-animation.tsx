"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import "./images-scrolling-animation.css";

export interface ScrollingProject {
  title: string;
  src: string;
  alt: string;
  href: string;
  role: string;
  width?: number;
  height?: number;
}

/** Native horizontal project rail, adapted to Corey's latest preview reference. */
function ImagesScrollingAnimation({ projects }: { projects: ScrollingProject[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [navigation, setNavigation] = useState({ ready: false, start: true, end: true });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => setNavigation({
      ready: true,
      start: element.scrollLeft < 2,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [projects.length]);

  function move(direction: number, event: MouseEvent<HTMLButtonElement>) {
    const element = rail.current;
    if (!element) return;
    const item = element.firstElementChild as HTMLElement | null;
    const distance = (item?.offsetWidth ?? element.clientWidth) + parseFloat(getComputedStyle(element).columnGap || "0");
    const immediate = event.detail === 0 || matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * distance, behavior: immediate ? "instant" : "smooth" });
  }

  return <section className="website-projects" aria-label="Website projects">
    <ul className="website-project-rail" ref={rail} tabIndex={projects.length > 1 ? 0 : undefined} data-project-count={projects.length}>
      {projects.map((project, index) => <li className="website-project-item" key={project.href}>
        <a className="website-project-link" href={project.href}>
          <figure>
            <span className="project-site-frame"><img src={project.src} alt={project.alt} width={project.width} height={project.height} loading={index === 0 ? "eager" : "lazy"} draggable={false} /></span>
            <figcaption><h2>{project.title}</h2><p>{project.role}</p></figcaption>
          </figure>
        </a>
      </li>)}
    </ul>
    {projects.length > 1 && <nav className="website-project-controls" aria-label="Browse website projects" hidden={!navigation.ready}>
      <button type="button" aria-label="Previous website project" disabled={navigation.start} onClick={event => move(-1, event)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
      <button type="button" aria-label="Next website project" disabled={navigation.end} onClick={event => move(1, event)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
    </nav>}
  </section>;
}

export { ImagesScrollingAnimation };
