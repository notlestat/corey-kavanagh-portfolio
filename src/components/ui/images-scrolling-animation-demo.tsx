"use client";

import { caseStudies } from "@/caseStudyData";
import { ImagesScrollingAnimation } from "@/components/ui/images-scrolling-animation";

export default function ImagesScrollingAnimationDemo() {
  const projects = caseStudies.filter(project => project.featured && project.presentation === "website").map(project => {
    const image = project.listingMedia ?? project.displayMedia![0];
    return { title: project.name, href: `/work/${project.slug}`, role: project.role,
      src: image.src, alt: image.alt, width: image.width, height: image.height };
  });
  return <ImagesScrollingAnimation projects={projects} />;
}
