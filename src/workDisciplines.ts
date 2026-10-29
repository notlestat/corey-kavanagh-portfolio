export const workDisciplines = [
  {
    id: "art-direction",
    number: "01",
    name: "Design",
    href: "/work/design",
    note: "Branding, visual identity, graphic design, photography and moving image.",
  },
  {
    id: "interaction-design",
    number: "02",
    name: "Interaction design",
    href: "/work/interaction-design",
    note: "Websites, digital editorial experiences, interfaces and interactive identities.",
  },
  {
    id: "creative-technology",
    number: "03",
    name: "Creative technology",
    href: "/work/creative-technology",
    note: "Image tools, generative systems, AI applications and creative software.",
  },
] as const;

export type WorkDiscipline = (typeof workDisciplines)[number]["id"];
