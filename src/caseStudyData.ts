import type { WorkDiscipline } from "./workDisciplines";

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type CaseStudy = {
  slug: string;
  name: string;
  period: string;
  periodLabel?: string;
  role: string;
  summary: string;
  context?: string;
  contribution?: string[];
  approach?: string;
  category?: WorkDiscipline;
  presentation?: "visual" | "website" | "artwork" | "interactive";
  listingMedia?: ProjectImage;
  listingDetail?: ProjectImage;
  editorialNote?: string;
  previewScripts?: boolean;
  disciplines?: string[];
  liveUrl?: string;
  sourceUrl?: string;
  credit?: string;
  note?: string;
  media: { src: string; alt: string; mobileSrc?: string; srcSet?: string; width?: number; height?: number; caption?: string }[];
};

function albumArtwork(name: string, alt: string, caption: string, height = 2000): CaseStudy["media"][number] {
  const base = `/work/album-artwork/${name}`;
  return {
    src: `${base}-2000.webp`,
    srcSet: `${base}-640.webp 640w, ${base}-1200.webp 1200w, ${base}-2000.webp 2000w`,
    width: 2000,
    height,
    alt,
    caption,
  };
}

// BSTROY, Jimi Vain and Stem Player remain CV-grounded drafts using the archive.
// Website and app projects use live homepage previews with a short description.
export const caseStudies: CaseStudy[] = [
  {
    slug: "vory-lord-lift-me-up",
    name: "Vory / Lord Lift Me Up",
    period: "2025",
    periodLabel: "Release",
    role: "Art direction / Cover design",
    category: "art-direction",
    presentation: "artwork",
    summary: "Official cover artwork for Vory's Lord Lift Me Up, featuring Ye.",
    credit: "Cover artwork by Corey Kavanagh.",
    editorialNote: "",
    media: [albumArtwork("vory-lord-lift-me-up", "Lord Lift Me Up cover for Vory featuring Ye: a distressed black-and-white figure, divided at the waist, with vertical title lettering", "Lord Lift Me Up / Official cover / 2025")],
  },
  {
    slug: "unreleased-artwork",
    name: "Unreleased artwork",
    period: "Unused concepts",
    periodLabel: "Status",
    role: "Graphic design / Album artwork",
    category: "art-direction",
    presentation: "artwork",
    summary: "Unused album artwork for clients.",
    credit: "Artwork by Corey Kavanagh.",
    editorialNote: "",
    media: [
      albumArtwork("unreleased-portrait", "Faded portrait over a pale blue grid with distressed paper texture", "Unused cover concept / Portrait"),
      albumArtwork("unreleased-envelope", "Silver-grey envelope on black with layered lettering and a scattered tracklist", "Unused cover concept / Envelope"),
      albumArtwork("unreleased-light", "Blue-white light crossing a dark textured composition with a small tracklist", "Unused cover concept / Light"),
      albumArtwork("unreleased-letterforms", "Repeated blurred letterforms and thin typography over off-white paper", "Unused cover concept / Letterforms"),
      albumArtwork("unreleased-collage", "Monochrome street-scene collage with overlapping grain and fragmented type", "Unused cover concept / Collage", 2109),
      albumArtwork("unreleased-rollout", "Large faded typographic forms and a small tracklist on textured pale paper", "Unused artwork / Rollout concept"),
      albumArtwork("unreleased-silhouette", "Soft grey silhouette with torn green paper layers and dark flowing letterforms", "Unused cover concept / Silhouette"),
    ],
  },
  {
    slug: "sourcelink",
    listingMedia: { src: "/work/sourcelink/home-desktop.webp", alt: "SourceLink, website design for clothing supplier intelligence", width: 1440, height: 1000 },
    listingDetail: { src: "/work/sourcelink/home-mobile.webp", alt: "SourceLink website on a narrow mobile screen", width: 390, height: 844 },
    name: "SourceLink",
    period: "Live website",
    role: "Website design",
    category: "interaction-design",
    presentation: "website",
    disciplines: ["Website design", "Interaction design"],
    summary: "A website for clothing supplier intelligence, with sourcing reports, manufacturer guides and an interactive savings calculator.",
    liveUrl: "https://sourcelink.solutions/",
    credit: "Website design by Corey Kavanagh.",
    media: [],
  },
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
    slug: "image-press",
    name: "Image Press",
    period: "2026",
    role: "Creative coding / Interface design",
    category: "creative-technology",
    presentation: "interactive",
    summary: "An interactive two-ink photo press. Feed a photograph, adjust the halftone, contrast and registration, then pull and save an impression.",
    liveUrl: "/tools/image-press",
    sourceUrl: "https://github.com/notlestat/image-press",
    credit: "Built with SVG, Canvas and the Anatomy drawing kit.",
    listingMedia: { src: "/work/image-press/interface.webp", alt: "Image Press: an isometric printing machine, three ink controls and a carbon-and-vermilion photographic proof", width: 1448, height: 1217 },
    media: [],
  },
];
