import { useRef, useState } from "react";
import { collections } from "./portfolioData";
import { caseStudies } from "./caseStudyData";
import { Gallery, ArchiveViewer, type SelectedWork } from "./WorkGallery";

function WorkList({
  onChoose,
}: {
  onChoose: (category: number, position: number) => void;
}) {
  return (
    <section
      className="work-text-index work-container"
      id="work-index"
      aria-labelledby="work-index-title"
    >
      <div className="work-text-index-heading">
        <div>
          <p className="work-label">Portfolio</p>
          <h2 id="work-index-title">Work.</h2>
        </div>
        <span className="work-label">{collections.length} collections</span>
      </div>
      <ol className="work-text-list">
        {collections.map((collection, index) => {
          const study = caseStudies.find(
            (item) => item.name === collection.name,
          );
          const content = (
            <>
              <span className="work-label">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="work-text-name">{collection.name}</span>
              <span className="work-text-meta">
                {study ? "Case study" : "Archive"}
              </span>
            </>
          );
          return (
            <li key={collection.name}>
              {study ? (
                <a href={`/work/${study.slug}`}>{content}</a>
              ) : (
                <button
                  type="button"
                  onClick={() => onChoose(index, 0)}
                  aria-label={`View the ${collection.name} archive`}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function WorkExplorer() {
  const [selected, setSelected] = useState<SelectedWork | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const choose = (category: number, position: number) => {
    if (!selected && document.activeElement instanceof HTMLElement)
      triggerRef.current = document.activeElement;
    setSelected({ category, position });
  };
  const close = () => {
    setSelected(null);
    requestAnimationFrame(() =>
      triggerRef.current?.focus({ preventScroll: true }),
    );
  };
  return (
    <>
      <Gallery onChoose={choose} />
      <WorkList onChoose={choose} />
      {selected && (
        <ArchiveViewer selected={selected} onChoose={choose} onClose={close} />
      )}
    </>
  );
}
