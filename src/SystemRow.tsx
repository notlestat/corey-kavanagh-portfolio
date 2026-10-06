import { useId, useState } from "react";
import type { systems } from "./systemData";

export default function SystemRow({ item, index }: { item: typeof systems[number]; index: number }) {
  const [open, setOpen] = useState(false), id = useId();
  return <article className="system-row"><button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><span className="system-number">{String(index + 1).padStart(2, "0")}</span><span className="system-name">{item.name}</span><span className="system-toggle" aria-hidden="true">{open ? "−" : "+"}</span></button><div className="system-panel" id={id} hidden={!open}><p className="system-short">{item.short}</p><p>{item.detail}</p><p>{item.outcome}</p></div></article>;
}
