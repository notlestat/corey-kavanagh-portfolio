import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type ConversationMessage = {
  align: "start" | "end";
  text: string;
};

function wait(duration: number, signal: AbortSignal) {
  return new Promise<boolean>((resolve) => {
    if (signal.aborted) return resolve(false);
    const onAbort = () => {
      window.clearTimeout(timer);
      resolve(false);
    };
    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve(true);
    }, duration);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export function ConversationPlayback({ messages }: { messages: ConversationMessage[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLSpanElement>(null);
  const playbackController = useRef<AbortController | null>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [playback, setPlayback] = useState(0);
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? messages.length : 0);
  const [phase, setPhase] = useState<"waiting" | "incoming" | "composing" | "done">(reducedMotion ? "done" : "waiting");
  const [draft, setDraft] = useState("");

  useLayoutEffect(() => {
    if (draftRef.current) draftRef.current.scrollLeft = draftRef.current.scrollWidth;
  }, [draft]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (inView || !stageRef.current) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(messages.length);
      setPhase("done");
      setDraft("");
      return;
    }
    if (!inView) return;

    const controller = new AbortController();
    playbackController.current = controller;
    const play = async () => {
      setVisibleCount(0);
      setPhase("waiting");
      setDraft("");
      if (!(await wait(300, controller.signal))) return;

      for (let index = 0; index < messages.length; index += 1) {
        const message = messages[index];
        if (message.align === "start") {
          setPhase("incoming");
          if (!(await wait(650, controller.signal))) return;
        } else {
          setPhase("composing");
          for (let character = 1; character <= message.text.length; character += 1) {
            setDraft(message.text.slice(0, character));
            if (!(await wait(16, controller.signal))) return;
          }
          if (!(await wait(300, controller.signal))) return;
        }
        setVisibleCount(index + 1);
        setPhase("waiting");
        setDraft("");
        if (!(await wait(340, controller.signal))) return;
      }
      setPhase("done");
    };
    void play();
    return () => {
      controller.abort();
      if (playbackController.current === controller) playbackController.current = null;
    };
  }, [inView, playback, reducedMotion, messages]);

  const changePlayback = () => {
    if (phase !== "done") {
      playbackController.current?.abort();
      setVisibleCount(messages.length);
      setPhase("done");
      setDraft("");
      return;
    }
    setPlayback((current) => current + 1);
  };

  return <div className="conversation-playback" ref={stageRef}>
    <div className="sr-only" role="group" aria-label="A short conversation about the work">
      {messages.map((message, index) => <p key={index}><strong>{message.align === "end" ? "Corey" : "Visitor"}:</strong> {message.text}</p>)}
    </div>
    <div className="conversation-stage" aria-hidden="true">
      <div className="conversation">
        {messages.slice(0, visibleCount).map((message, index) => <div className="conversation-bubble" data-align={message.align} key={`${playback}-${index}`}><div className="conversation-content">{message.text}</div></div>)}
        {phase === "incoming" && <div className="conversation-typing"><i /><i /><i /></div>}
      </div>
      <div className="conversation-composer" data-active={phase === "composing"}>
        <span className="conversation-draft" ref={draftRef}>{draft || <span className="conversation-placeholder">Message</span>}{phase === "composing" && <span className="conversation-caret" />}</span>
        <span className="conversation-send" aria-hidden="true">↑</span>
      </div>
    </div>
    <button className="conversation-replay" type="button" hidden={reducedMotion} onClick={changePlayback}>{phase === "done" ? "Replay conversation" : "Show all messages"} <span aria-hidden="true">{phase === "done" ? "↺" : "↗"}</span></button>
  </div>;
}
