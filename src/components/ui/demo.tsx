"use client";
import { useState } from "react";
import DisplayCards from "@/components/ui/display-cards";
import { collections } from "@/portfolioData";

export function DisplayCardsDemo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const collection = collections[0];
  return <DisplayCards cards={collection.items} title={collection.name} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />;
}
