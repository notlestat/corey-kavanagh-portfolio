// Projects for the one-page site. Copy comes from caseStudyData.ts and the Point study page.
// A string is published copy. A { draft } entry is a prompt for Corey to answer; it only renders in `astro dev`.

export type Copy = string | { draft: string };

export interface Slide {
  src: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
}

export interface Decision {
  title: string;
  what: string;
  why: Copy;
}

export interface ProductCase {
  problem: Copy[];
  constraints: Copy[];
  decisions: Decision[];
  measure: string[];
  measureNote: Copy;
}

export interface Project {
  id: string;
  discipline: string;
  name: string;
  summary: string;
  meta: [label: string, value: string][];
  disciplines?: string;
  context?: string;
  contribution?: string[];
  approach?: string;
  credit?: string;
  link?: { label: string; href: string };
  video?: { src: string; poster: string; label: string };
  slides: Slide[];
  product?: ProductCase;
}

const square = (src: string, caption: string, alt: string): Slide => ({ src, caption, alt, width: 1200, height: 1200 });

export const projects: Project[] = [
  {
    id: "sourcelink",
    discipline: "Website design",
    name: "SourceLink",
    summary: "A website for clothing supplier intelligence, with sourcing reports, manufacturer guides and an interactive savings calculator.",
    meta: [["Role", "Website design"], ["Status", "Live website"]],
    disciplines: "Website design / Interaction design",
    credit: "Website design by Corey Kavanagh.",
    link: { label: "Visit site", href: "https://sourcelink.solutions/" },
    slides: [
      { src: "/work/sourcelink/home-desktop.webp", caption: "SourceLink / Homepage", alt: "SourceLink homepage: vetted clothing manufacturers, ready to buy", width: 1440, height: 1000 },
      { src: "/work/sourcelink/sourcelink-calculator.jpg", caption: "SourceLink / Savings calculator", alt: "SourceLink savings calculator: price per unit, units in this order, current and estimated cost, and the estimated saving", width: 1440, height: 820 },
    ],
    // Facts come from the live site.
    product: {
      problem: [
        "Clothing brands often buy through sourcing agents, trading companies or marketplaces such as Alibaba. SourceLink connects them directly with factories instead.",
        "It's for small and growing clothing brands, from a first run of 30 units to orders in the thousands. Without contacts, they can't tell which factories are real or what buying direct would save them.",
      ],
      constraints: [
        "The 23% saving is SourceLink's average across its suppliers. It isn't a quote, so the calculator had to say what it leaves out: the report price, freight, duties and taxes.",
        "SourceLink mostly sells reports, paid once, from £29. Every page needed a next step a small brand could take without a sales call.",
        "Some visitors have never read a factory quote. Terms like MOQ and FOB needed plain explanations close by.",
      ],
      decisions: [
        {
          title: "A savings calculator before a contact form",
          what: "Two inputs, your current price per unit and the units in this order, return an estimated saving. It uses the 23% average per-unit saving SourceLink quotes for its suppliers.",
          why: "A quote form asks for trust before giving anything back. The calculator answers first, with the visitor's own unit price and order size, so the saving is about their order. Someone who has moved the slider already has a reason to read on.",
        },
        {
          title: "The estimate follows you to the form",
          what: "Below the calculator, a short form turns the estimate into a supplier shortlist request. The saving, units and unit price sit beside it, for example \"£2,185 estimated saving, 500 units at £19 per unit\".",
          why: "The form is where people usually leave. Seeing their own saving beside the fields reminds them why they're filling it in. I expected more people to go from a result to a sent request.",
        },
        {
          title: "Reports and guides alongside the sales pages",
          what: "Sourcing reports and manufacturer guides are part of the site, not hidden in a blog.",
          why: "Most people aren't ready to buy a report on their first visit. A guide to tech packs or small first orders answers the question they arrived with and shows SourceLink knows factories. The reports stay one click away in the same menu.",
        },
      ],
      measure: [
        "Visitors who change an input on the calculator",
        "Visitors who scroll from a result to the shortlist form",
        "Shortlist requests sent per calculator visit",
      ],
      measureNote: "I don't have SourceLink's analytics yet, so there are no results here. These are the first numbers I'd ask for.",
    },
  },
  {
    id: "vory-lord-lift-me-up",
    discipline: "Cover design",
    name: "Vory / Lord Lift Me Up",
    summary: "Official cover artwork for Vory's Lord Lift Me Up, featuring Ye.",
    meta: [["Role", "Art direction / Cover design"], ["Release", "2025"]],
    credit: "Cover artwork by Corey Kavanagh.",
    slides: [square("/work/album-artwork/vory-lord-lift-me-up-1200.webp", "Lord Lift Me Up / Official cover / 2025", "Lord Lift Me Up cover for Vory featuring Ye: a distressed black-and-white figure, divided at the waist, with vertical title lettering")],
  },
  {
    id: "unreleased-artwork",
    discipline: "Album artwork",
    name: "Unreleased artwork",
    summary: "Unused album artwork for clients.",
    meta: [["Role", "Graphic design / Album artwork"], ["Status", "Unused concepts"]],
    credit: "Artwork by Corey Kavanagh.",
    slides: [
      square("/work/album-artwork/unreleased-portrait-1200.webp", "Unused cover concept / Portrait", "Faded portrait over a pale blue grid with distressed paper texture"),
      square("/work/album-artwork/unreleased-envelope-1200.webp", "Unused cover concept / Envelope", "Silver-grey envelope on black with layered lettering and a scattered tracklist"),
      square("/work/album-artwork/unreleased-light-1200.webp", "Unused cover concept / Light", "Blue-white light crossing a dark textured composition with a small tracklist"),
      square("/work/album-artwork/unreleased-letterforms-1200.webp", "Unused cover concept / Letterforms", "Repeated blurred letterforms and thin typography over off-white paper"),
      { src: "/work/album-artwork/unreleased-collage-1200.webp", caption: "Unused cover concept / Collage", alt: "Monochrome street-scene collage with overlapping grain and fragmented type", width: 1200, height: 1265 },
      square("/work/album-artwork/unreleased-rollout-1200.webp", "Unused artwork / Rollout concept", "Large faded typographic forms and a small tracklist on textured pale paper"),
      square("/work/album-artwork/unreleased-silhouette-1200.webp", "Unused cover concept / Silhouette", "Soft grey silhouette with torn green paper layers and dark flowing letterforms"),
    ],
  },
  {
    id: "bstroy",
    discipline: "Photography",
    name: "BSTROY",
    summary: "Photo, video and digital imagery developed with the brand team.",
    meta: [["Role", "Art direction / Photography"], ["Period", "2022–2024"]],
    context: "I developed visual content for BSTROY across digital platforms, supporting product launches, campaigns and social content.",
    contribution: [
      "Developed and executed photo and video content in line with the brand's aesthetic.",
      "Collaborated with the brand team on a consistent visual identity.",
      "Worked with Photoshop, Illustrator and Blender to produce the imagery.",
    ],
    approach: "The work followed BSTROY's existing visual language and storytelling. My contribution combined art direction and image-making, with the brand team involved in maintaining a coherent identity across the content.",
    slides: ([[800, 1200], [800, 1200], [800, 1200], [965, 1200], [800, 1200], [959, 1200]] as const).map(([width, height], i) => ({
      src: `/work/gallery/bstroy-0${i + 1}.jpg`, caption: `0${i + 1} / Selected imagery`, alt: `BSTROY imagery ${i + 1}`, width, height,
    })),
  },
  {
    id: "jimi-vain",
    discipline: "Media design",
    name: "Jimi Vain",
    summary: "Mixed-media social imagery and editorial photo and video editing.",
    meta: [["Role", "Art direction / Media design"], ["Period", "2022–2023"]],
    context: "I worked with the Creative Director on brand promotion, developing moodboards and visual mixed media for social platforms. The work also included editorial photo and video editing for a magazine.",
    contribution: [
      "Used moodboards and visual references to develop mixed-media social content.",
      "Edited editorial photography and video.",
      "Applied colour grading and post-processing to match the brand's tone.",
    ],
    approach: "References and moodboards informed the visual direction. In post-production, I worked on colour and atmosphere to keep the edits aligned with the brand and the Creative Director's direction.",
    slides: ([[960, 1200], [800, 1200], [1200, 1200]] as const).map(([width, height], i) => ({
      src: `/work/gallery/jimi-0${i + 1}.jpg`, caption: `0${i + 1} / Selected imagery`, alt: `Jimi Vain imagery ${i + 1}`, width, height,
    })),
  },
  {
    id: "stem-player",
    discipline: "3D advertising",
    name: "Stem Player",
    summary: "Collaborative advert design exploring a product through image and motion.",
    meta: [["Role", "Design / 3D advertisement design"], ["Period", "2021–2022"]],
    context: "I collaborated with the Creative Director on the design and execution of an advert for Stem Player, helping translate live remixing and stem control into visual storytelling.",
    contribution: [
      "Contributed to the design and execution of the advert with the Creative Director.",
      "Helped communicate the product's remixing and stem-control functions visually.",
      "Gave creative input on colour grading, motion pacing and typography.",
    ],
    approach: "The product's functions provided the starting point. I contributed visual and motion decisions within a collaborative process, refining colour, pacing and type with the Creative Director.",
    slides: [
      { src: "/work/gallery/stem-01.jpg", caption: "01 / Selected imagery", alt: "Stem Player floating over grass", width: 1192, height: 1200 },
      { src: "/work/gallery/stem-02.jpg", caption: "02 / Selected imagery", alt: "Flowers growing around the Stem Player with a butterfly", width: 1200, height: 1192 },
      { src: "/work/gallery/stem-03.jpg", caption: "03 / Selected imagery", alt: "Flower-covered Stem Player in a field", width: 1200, height: 1198 },
    ],
  },
  {
    id: "point-study",
    discipline: "Moving image / Code",
    name: "Point study",
    summary: "A five-second looping film: a fragmented three-dimensional form made from shifting points of light.",
    meta: [["Role", "Moving image / Code"], ["Length", "00:05"]],
    video: { src: "/work/point-study/point-study-web.mp4", poster: "/work/point-study/poster.jpg", label: "Point study film" },
    slides: [{ src: "/work/point-study/poster.jpg", caption: "Image, points, image", alt: "Point study film", width: 1920, height: 1080 }],
  },
];

/** Drop draft prompts from published builds so they never reach the live page or its data. */
export function publishable(list: Project[], showDrafts: boolean): Project[] {
  if (showDrafts) return list;
  const keep = <T>(items: T[]) => items.filter(item => typeof item === "string");
  return list.map(p => p.product ? {
    ...p,
    product: {
      ...p.product,
      problem: keep(p.product.problem),
      constraints: keep(p.product.constraints),
      decisions: p.product.decisions.map(d => ({ ...d, why: typeof d.why === "string" ? d.why : "" })),
      measureNote: typeof p.product.measureNote === "string" ? p.product.measureNote : "",
    },
  } : p);
}
