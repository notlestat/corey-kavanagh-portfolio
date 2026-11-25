import type { Copy, Project } from "../onePageProjects";

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const projects: Project[] = JSON.parse($("project-data").textContent ?? "[]");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const num = (i: number) => String(i + 1).padStart(2, "0");

// ---- signature draws, then the letter fades in word by word ----
{
  const sig = $("sig"), letter = $("letter");
  // Wrap words, and whole links and chips, so each can arrive on its own delay.
  let i = 0;
  letter.querySelectorAll("p").forEach(p => {
    [...p.childNodes].forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (n.textContent ?? "").split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(t); return; }
          const s = document.createElement("span");
          s.className = "wd"; s.style.setProperty("--i", String(i++)); s.textContent = t;
          frag.append(s);
        });
        n.replaceWith(frag);
      } else if (n instanceof HTMLElement) {
        n.classList.add("wd"); n.style.setProperty("--i", String(i++));
      }
    });
  });
  const play = () => { sig.classList.remove("play"); void sig.offsetWidth; sig.classList.add("play"); };
  requestAnimationFrame(play);
  setTimeout(() => letter.classList.add("on"), reduce ? 0 : 2400);
  sig.addEventListener("click", play);
}

// ---- "digital products": letters near the cursor flip into code ----
{
  const el = $("code-word"), tag = $("code-tag");
  el.innerHTML = [...(el.textContent ?? "")].map(ch => ch === " " ? " " : `<span class="c" aria-hidden="true">${ch}</span>`).join("");
  if (!reduce && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const chars = [...el.querySelectorAll<HTMLElement>(".c")];
    const GLYPHS = "{}<>/=;()[]01_$#*&|:+.".split("");
    const TOKENS = ["<Design />", "useState()", "=> {}", "props", ".map()", "export", "{children}", "onHover"];
    const rnd = <T,>(a: T[]) => a[Math.random() * a.length | 0];
    let mx = 0, my = 0, inside = false, raf = 0, last = 0;
    const frame = (t: number) => {
      raf = 0;
      chars.forEach(c => {
        const r = c.getBoundingClientRect();
        const near = inside && Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my) < 70;
        if (near && (!c.classList.contains("on") || Math.random() < .3)) c.dataset.g = rnd(GLYPHS);
        c.classList.toggle("on", near);
      });
      if (inside) {
        tag.style.left = `${mx}px`; tag.style.top = `${my}px`;
        if (t - last > 900) { tag.textContent = rnd(TOKENS); last = t; }
        raf = requestAnimationFrame(frame);
      }
    };
    el.addEventListener("pointerenter", () => { inside = true; tag.classList.add("show"); if (!raf) raf = requestAnimationFrame(frame); });
    el.addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; });
    el.addEventListener("pointerleave", () => { inside = false; tag.classList.remove("show"); if (!raf) raf = requestAnimationFrame(frame); });
    addEventListener("scroll", () => { if (inside) { inside = false; tag.classList.remove("show"); } }, { passive: true });
  }
}

// ---- the working SourceLink calculator: same maths as the live tool (23% off the unit price) ----
{
  const price = document.getElementById("slc-price") as HTMLInputElement | null;
  const units = document.getElementById("slc-units") as HTMLInputElement | null;
  if (price && units) {
    const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
    const calc = () => {
      const cur = Math.max(0, Number(price.value) || 0) * Number(units.value);
      $("slc-units-out").textContent = Number(units.value).toLocaleString("en-GB");
      $("slc-cur").textContent = gbp.format(cur);
      $("slc-new").textContent = gbp.format(cur * .77);
      $("slc-save").textContent = gbp.format(cur * .23);
    };
    price.addEventListener("input", calc);
    units.addEventListener("input", calc);
  }
}

// ---- project sheet ----
const sheet = $<HTMLDialogElement>("sheet");
let cur = { p: 0, i: 0 };
const copy = (x: Copy) => typeof x === "string" ? esc(x) : `<span class="draft">${esc(x.draft)}</span>`;
const filled = (x: Copy) => typeof x !== "string" || x.length > 0;

function showImage(i: number) {
  const p = projects[cur.p]; cur.i = i;
  const slide = p.slides[i];
  $("sheet-stage").innerHTML = p.video
    ? `<video src="${p.video.src}" poster="${p.video.poster}" muted loop playsinline ${reduce ? "" : "autoplay"} controls aria-label="${esc(p.video.label)}"></video>`
    : `<img src="${slide.src}" alt="${esc(slide.alt)}" width="${slide.width}" height="${slide.height}">`;
  $("sheet-cap").textContent = slide.caption;
  $("sheet-count").textContent = p.slides.length > 1 ? `${num(i)} / ${String(p.slides.length).padStart(2, "0")}` : "";
  $("sheet-thumbs").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", String(j === i)));
}

function caseBody(p: Project) {
  const c = p.product!;
  let body = "";
  const section = (title: string, items: Copy[]) => {
    const shown = items.filter(filled);
    if (shown.length) body += `<div class="case-sec"><h3>${title}</h3>${shown.map(x => `<p>${copy(x)}</p>`).join("")}</div>`;
  };
  section("Problem", c.problem);
  section("Constraints", c.constraints);
  body += `<div class="case-sec"><h3>Decisions</h3>${c.decisions.map(d =>
    `<div class="decision"><b>${esc(d.title)}</b><p>${esc(d.what)}</p>${filled(d.why) ? `<p>${copy(d.why)}</p>` : ""}</div>`).join("")}</div>`;
  body += `<div class="case-sec"><h3>What I'd measure</h3><ul class="measure">${c.measure.map((m, k) => `<li><span class="g">${num(k)}</span><span>${esc(m)}</span></li>`).join("")}</ul>${filled(c.measureNote) ? `<p style="margin-top:8px">${copy(c.measureNote)}</p>` : ""}</div>`;
  return body;
}

function openProject(pi: number, i = 0) {
  const p = projects[pi]; cur = { p: pi, i };
  $("sheet-kicker").textContent = `${num(pi)} · ${p.discipline}`;
  $("sheet-title").textContent = p.name;
  $("sheet-summary").textContent = p.summary;
  $("sheet-meta").innerHTML = p.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
  let body = "";
  if (p.product) body = caseBody(p);
  else {
    if (p.disciplines) body += `<h3>Disciplines</h3><p>${esc(p.disciplines)}</p>`;
    if (p.context) body += `<h3>Context</h3><p>${esc(p.context)}</p>`;
    if (p.contribution) body += `<h3>My contribution</h3><ul>${p.contribution.map(c => `<li>${esc(c)}</li>`).join("")}</ul>`;
    if (p.approach) body += `<h3>Approach</h3><p>${esc(p.approach)}</p>`;
  }
  if (p.credit) body += `<p class="sheet-credit">${esc(p.credit)}</p>`;
  $("sheet-body").innerHTML = body;
  $("sheet-thumbs").innerHTML = p.slides.length > 1
    ? p.slides.map((s, j) => `<button type="button" data-t="${j}" aria-label="Show image ${j + 1}: ${esc(s.alt)}"><img src="${s.src}" alt=""></button>`).join("")
    : "";
  const ni = (pi + 1) % projects.length;
  $("sheet-foot").innerHTML = `${p.link ? `<a class="u" href="${p.link.href}" target="_blank" rel="noopener noreferrer">${esc(p.link.label)}</a>` : "<span></span>"}
    <button class="next-proj" type="button" data-next="${ni}"><span class="g">Next project</span><strong>${esc(projects[ni].name)}</strong></button>`;
  showImage(i);
  if (!sheet.open) sheet.showModal();
  sheet.querySelector(".sheet-info")!.scrollTop = 0;
}

document.addEventListener("click", e => {
  const target = e.target as HTMLElement;
  const t = target.closest<HTMLElement>("[data-p]"); if (t) { openProject(Number(t.dataset.p)); return; }
  const th = target.closest<HTMLElement>("[data-t]"); if (th) { showImage(Number(th.dataset.t)); return; }
  const nx = target.closest<HTMLElement>("[data-next]"); if (nx) { openProject(Number(nx.dataset.next)); return; }
  if (target.closest("[data-close]") || target === sheet) sheet.close();
});
// Arrow keys flip images inside the sheet (keyboard only, nothing drawn on screen).
sheet.addEventListener("keydown", e => {
  if ((e.target as HTMLElement).matches("input")) return;
  const n = projects[cur.p].slides.length;
  if (e.key === "ArrowRight" && n > 1) showImage((cur.i + 1) % n);
  if (e.key === "ArrowLeft" && n > 1) showImage((cur.i - 1 + n) % n);
});
sheet.addEventListener("close", () => { $("sheet-stage").innerHTML = ""; });

// ---- page edges, clocks, reduced motion ----
addEventListener("scroll", () => document.body.classList.toggle("at-end", innerHeight + scrollY >= document.documentElement.scrollHeight - 40), { passive: true });

const fmt = (tz: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date());
const tick = () => { $("ldn").textContent = fmt("Europe/London"); $("nz").textContent = fmt("Pacific/Auckland"); };
tick(); setInterval(tick, 30000);

if (reduce) document.querySelectorAll("video").forEach(v => { v.removeAttribute("autoplay"); v.pause(); });
