import type { WorkDiscipline } from "./workDisciplines";

export type CaseStudy = {
  slug: string;
  name: string;
  period: string;
  role: string;
  summary: string;
  context?: string;
  contribution?: string[];
  approach?: string;
  category?: WorkDiscipline;
  presentation?: "visual";
  disciplines?: string[];
  liveUrl?: string;
  sourceUrl?: string;
  credit?: string;
  note?: string;
  media: { src: string; alt: string; mobileSrc?: string; width?: number; height?: number; caption?: string }[];
};

// The first three cases remain CV-grounded drafts using the existing archive.
// Authored digital projects use verified application captures and optional links.
export const caseStudies: CaseStudy[] = [
  {
    slug: "bstroy",
    name: "BSTROY",
    period: "2022–2024",
    role: "Art direction / Photography",
    summary: "Photo, video and digital imagery developed with the brand team.",
    context: "I developed visual content for BSTROY across digital platforms, supporting product launches, campaigns and social content.",
    contribution: [
      "Developed and executed photo and video content in line with the brand's aesthetic.",
      "Collaborated with the brand team on a consistent visual identity.",
      "Worked with Photoshop, Illustrator and Blender to produce the imagery.",
    ],
    approach: "The work followed BSTROY's existing visual language and storytelling. My contribution combined art direction and image-making, with the brand team involved in maintaining a coherent identity across the content.",
    media: [
      { src: "/work/gallery/bstroy-01.jpg", alt: "BSTROY archive: two figures in a monochrome fashion composition" },
      { src: "/work/gallery/bstroy-02.jpg", alt: "BSTROY selected archive image 2" },
      { src: "/work/gallery/bstroy-03.jpg", alt: "BSTROY selected archive image 3" },
      { src: "/work/gallery/bstroy-04.jpg", alt: "BSTROY selected archive image 4" },
    ],
  },
  {
    slug: "jimi-vain",
    name: "Jimi Vain",
    period: "2022–2023",
    role: "Art direction / Media design",
    summary: "Mixed-media social imagery and editorial photo and video editing.",
    context: "I worked with the Creative Director on brand promotion, developing moodboards and visual mixed media for social platforms. The work also included editorial photo and video editing for a magazine.",
    contribution: [
      "Used moodboards and visual references to develop mixed-media social content.",
      "Edited editorial photography and video.",
      "Applied colour grading and post-processing to match the brand's tone.",
    ],
    approach: "References and moodboards informed the visual direction. In post-production, I worked on colour and atmosphere to keep the edits aligned with the brand and the Creative Director's direction.",
    media: [
      { src: "/work/gallery/jimi-01.jpg", alt: "Jimi Vain archive: seated figure in black leather with a blurred portrait" },
      { src: "/work/gallery/jimi-02.jpg", alt: "Jimi Vain selected archive image 2" },
      { src: "/work/gallery/jimi-03.jpg", alt: "Jimi Vain selected archive image 3" },
    ],
  },
  {
    slug: "stem-player",
    name: "Stem Player",
    period: "2021–2022",
    role: "Design / 3D advertisement design",
    summary: "Collaborative advert design exploring a product through image and motion.",
    context: "I collaborated with the Creative Director on the design and execution of an advert for Stem Player, helping translate live remixing and stem control into visual storytelling.",
    contribution: [
      "Contributed to the design and execution of the advert with the Creative Director.",
      "Helped communicate the product's remixing and stem-control functions visually.",
      "Gave creative input on colour grading, motion pacing and typography.",
    ],
    approach: "The product's functions provided the starting point. I contributed visual and motion decisions within a collaborative process, refining colour, pacing and type with the Creative Director.",
    media: [
      { src: "/work/gallery/stem-01.jpg", alt: "Stem Player archive: rounded product form against a blue and green setting" },
      { src: "/work/gallery/stem-02.jpg", alt: "Stem Player selected archive image 2" },
      { src: "/work/gallery/stem-03.jpg", alt: "Stem Player selected archive image 3" },
    ],
  },
  {
    slug: "study-01",
    name: "STUDY 01",
    period: "2026",
    role: "Design / Development / Creative technology",
    category: "creative-technology",
    presentation: "visual",
    disciplines: ["Creative coding", "Design engineering", "Experimental typography"],
    summary: "A browser-based composition instrument for image and type. ORDER, SILENCE and TENSION set the starting rules; seeds and selective locks develop variations.",
    liveUrl: "https://study-01-nu.vercel.app/",
    sourceUrl: "https://github.com/notlestat/study-01",
    credit: "Art direction and design by Corey Kavanagh. Built with Codex.",
    note: "One source, three visual systems. These compositions were generated in the live instrument using its built-in sample. The full application also includes material treatments, saved studies and PNG / SVG export.",
    media: [
      { src: "/work/study-01/interface.webp", mobileSrc: "/work/study-01/order.webp", width: 2000, height: 1389, alt: "An ORDER composition generated in STUDY 01, combining large aligned typography with geometric imagery", caption: "The instrument / ORDER, seed 4" },
      { src: "/work/study-01/order.webp", width: 840, height: 1120, alt: "ORDER composition: large title aligned above a geometric image and small metadata", caption: "01 / ORDER / Seed 4" },
      { src: "/work/study-01/silence.webp", width: 840, height: 1120, alt: "SILENCE composition: restrained typography and geometric imagery separated by generous empty space", caption: "02 / SILENCE / Seed 10" },
      { src: "/work/study-01/tension.webp", width: 840, height: 1120, alt: "TENSION composition: a narrow title block opposed by a dense image column", caption: "03 / TENSION / Seed 4" },
    ],
  },
];
