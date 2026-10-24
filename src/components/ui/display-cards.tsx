"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/portfolioData";
import "./display-cards.css";

export interface DisplayCardProps {
  image: string;
  title: string;
  video?: string;
  width?: number;
  height?: number;
  className?: string;
}

function DisplayCard({ image, title, video, width, height, className }: DisplayCardProps) {
  return <div className={cn("display-card relative col-start-1 row-start-1", className)}>
    {video ? <video key={video} src={video} poster={image} controls playsInline preload="metadata" aria-label={title} /> : <img src={image} alt={title} width={width} height={height} draggable={false} />}
  </div>;
}

export interface DisplayCardsProps {
  cards: PortfolioItem[];
  title: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

/** Image-based adaptation of the supplied stacked display-card reference. */
export default function DisplayCards({ cards, title, selectedIndex, onSelect, className }: DisplayCardsProps) {
  const activeThumb = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    // Wait until the parent dialog has opened before measuring the rail.
    const frame = requestAnimationFrame(() => {
      const thumb = activeThumb.current;
      if (thumb?.parentElement) {
        const rail = thumb.parentElement;
        if (thumb.offsetLeft < rail.scrollLeft) rail.scrollLeft = thumb.offsetLeft;
        else if (thumb.offsetLeft + thumb.offsetWidth > rail.scrollLeft + rail.clientWidth)
          rail.scrollLeft = thumb.offsetLeft + thumb.offsetWidth - rail.clientWidth;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedIndex]);
  const selected = cards[selectedIndex];
  return <div className={cn("display-cards", className)}>
    <div className="display-cards-stack grid" aria-label={`${title}, image display`}>
      {[2, 1].filter((offset) => offset < cards.length).map((offset) => {
        const index = (selectedIndex + offset) % cards.length;
        return <button key={offset} className={`display-card-preview display-card-preview-${offset} col-start-1 row-start-1`} type="button" onClick={() => onSelect(index)} aria-label={`View ${title} ${cards[index].video ? "film" : "image"} ${index + 1}`}>
          <img src={cards[index].image} alt="" draggable={false} /><span aria-hidden="true"><ArrowUpRight size={16} /></span>
        </button>;
      })}
      <DisplayCard {...selected} title={`${title}, ${selected.video ? "film" : "image"} ${selectedIndex + 1}`} className="display-card-active" />
    </div>
    <div className="display-cards-thumbnails flex" role="group" aria-label={`${title} thumbnails`}>
      {cards.map((card, index) => <button ref={index === selectedIndex ? activeThumb : undefined} key={card.image} type="button" className="display-card-thumbnail" aria-label={`Select ${title} ${card.video ? "film" : "image"} ${index + 1}`} aria-pressed={index === selectedIndex} onClick={() => onSelect(index)}>
        <img src={card.image} alt="" loading="lazy" width="72" height="72" />
        {card.video && <Play size={14} fill="currentColor" aria-hidden="true" />}
      </button>)}
    </div>
  </div>;
}
