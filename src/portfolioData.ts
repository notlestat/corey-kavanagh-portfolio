import type { WorkDiscipline } from "./workDisciplines";

export type PortfolioItem = {
  image: string;
  video?: string;
  width?: number;
  height?: number;
};

export type Collection = {
  name: string;
  year?: string;
  category?: WorkDiscipline;
  items: PortfolioItem[];
};

function images(slug: string, count: number): PortfolioItem[] {
  return Array.from({ length: count }, (_, index) => ({
    image: `/work/gallery/${slug}-${String(index + 1).padStart(2, "0")}.jpg`,
  }));
}

const movingImage: PortfolioItem[] = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    image: `/work/gallery/moving-${number}.jpg`,
    video: `/work/gallery/video/moving-${number}.mp4`,
  };
});

export const collections: Collection[] = [
  { name: "BSTROY", year: "2023", items: images("bstroy", 15) },
  { name: "Stolen Girlfriends Club", year: "2023", items: images("stolen", 3) },
  { name: "Rowe", year: "2022", items: images("rowe", 10) },
  { name: "MSBHV", year: "2022", items: images("msbhv", 2) },
  { name: "Kettle.is", year: "2022", items: images("kettle", 3) },
  { name: "Jimi Vain", year: "2022", items: images("jimi", 3) },
  { name: "Stem Player", items: images("stem", 3) },
  { name: "Graphic Design", items: images("graphic", 7) },
  { name: "Personal work", items: images("personal", 85) },
  { name: "Video", items: movingImage },
];

export type GalleryItem = PortfolioItem & {
  category: number;
  position: number;
};

export const galleryItems: GalleryItem[] = [];
const used = collections.map(() => 0);

function addNext(category: number) {
  const position = used[category];
  galleryItems.push({
    ...collections[category].items[position],
    category,
    position,
  });
  used[category] += 1;
}

// Begin with one piece from each category, then distribute the larger folders
// across the entire strip so the later stretch is not only Personal work.
collections.forEach((_, category) => addNext(category));

while (
  galleryItems.length <
  collections.reduce((total, collection) => total + collection.items.length, 0)
) {
  const remaining = collections
    .map((collection, category) => ({
      category,
      progress: used[category] / collection.items.length,
    }))
    .filter(
      ({ category }) => used[category] < collections[category].items.length,
    )
    .sort((a, b) => a.progress - b.progress || a.category - b.category);
  const last = galleryItems.at(-1)?.category;
  const next = remaining.find((item) => item.category !== last) ?? remaining[0];
  addNext(next.category);
}

// Discipline filters keep the original collection/position IDs for the viewer.
export const graphicDesignGalleryItems = galleryItems.filter(
  (item) => collections[item.category].name === "Graphic Design",
);
export const artDirectionGalleryItems = galleryItems.filter(
  (item) => (collections[item.category].category ?? "art-direction") === "art-direction",
);
