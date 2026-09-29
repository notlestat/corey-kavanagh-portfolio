import { useId, useState, type ReactNode } from "react";

type ConversationBubbleProps = {
  align?: "start" | "end";
  note?: string;
  children: ReactNode;
};

export function Conversation({ children }: { children: ReactNode }) {
  return <div className="conversation" aria-label="A conversation about the practice">{children}</div>;
}

export function ConversationBubble({ align = "start", note, children }: ConversationBubbleProps) {
  const [revealed, setRevealed] = useState(false);
  const [keyboardActivation, setKeyboardActivation] = useState(false);
  const noteId = useId();

  return <div className="conversation-bubble" data-align={align} data-no-motion={keyboardActivation}>
    {note ? <button className="conversation-content" type="button" aria-expanded={revealed} aria-controls={noteId} onClick={event => { setKeyboardActivation(event.detail === 0); setRevealed(open => !open); }}>
      <span>{children}</span><span className="conversation-indicator" aria-hidden="true">{revealed ? "−" : "+"}</span>
    </button> : <div className="conversation-content">{children}</div>}
    {note && <div className="conversation-note-wrap" id={noteId} data-open={revealed} aria-hidden={!revealed}><div><p className="conversation-note">{note}</p></div></div>}
  </div>;
}
