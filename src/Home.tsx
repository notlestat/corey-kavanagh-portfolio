import { useEffect, useRef, useState } from "react";
import { ConversationPlayback, type ConversationMessage } from "./Conversation";
import { GithubIcon, PageNavigation, ThemeToggle } from "./Navigation";
import { ToolRail } from "./ToolRail";

const messages: ConversationMessage[] = [
  { align: "start", text: "What do you work on?" },
  { align: "end", text: "Art direction, images and identities. I also design and build digital experiences." },
  { align: "start", text: "Where should I start?" },
  { align: "end", text: "The work. There are images, films and experiments in there." },
];

function HomeFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [error, setError] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    const start = async () => {
      if (motion.matches) {
        video.pause();
        video.muted = true;
        setSoundOn(false);
        return;
      }
      try {
        await video.play();
      } catch {
        if (!active) return;
        // First visits usually require muted autoplay. The sound switch unlocks audio.
        video.muted = true;
        setSoundOn(false);
        try { await video.play(); } catch { /* Sound's user gesture can retry playback. */ }
      }
    };
    const changeMotion = () => { void start(); };
    void start();
    motion.addEventListener("change", changeMotion);
    return () => { active = false; motion.removeEventListener("change", changeMotion); };
  }, []);

  const toggleSound = async () => {
    const video = videoRef.current;
    if (!video) return;
    const nextSound = !soundOn;
    video.muted = !nextSound;
    setAudioError(false);
    setSoundOn(nextSound);
    if (nextSound) {
      try { await video.play(); } catch {
        video.muted = true;
        setSoundOn(false);
        setAudioError(true);
      }
    }
  };

  return <div className="home-film-wrap">
    <figure className="home-film">
      <video ref={videoRef} src="/work/gallery/video/moving-09.mp4" poster="/work/gallery/moving-09.jpg" width="1112" height="720" autoPlay loop playsInline muted={!soundOn} preload="auto" disablePictureInPicture disableRemotePlayback aria-label="Selected moving-image work by Corey Kavanagh" onError={() => setError(true)} />
      {error && <figcaption className="film-error">The film could not load. <a href="/work">View the work</a></figcaption>}
    </figure>
    <div className="home-film-controls" aria-label="Film and appearance">
      <button className="sound-toggle theme-toggle" type="button" role="switch" aria-checked={soundOn} aria-label={`Turn sound ${soundOn ? "off" : "on"}`} disabled={error} onClick={() => { void toggleSound(); }}>
        <span className="theme-toggle-track" aria-hidden="true"><span className="theme-toggle-thumb" /></span>
        <span className="theme-toggle-label" aria-hidden="true">Sound</span>
      </button>
      <ThemeToggle />
      {audioError && <p className="film-audio-error" role="status">Audio could not start. Try sound again.</p>}
    </div>
  </div>;
}

export default function Home() {
  return <>
    <a className="home-skip" href="#home-introduction">Skip to introduction</a>
    <div className="home-navigation"><PageNavigation page="home" /></div>
    <main className="minimal-home">
      <HomeFilm />
      <section className="home-introduction" id="home-introduction" aria-labelledby="home-title">
        <h1 id="home-title">Corey Kavanagh</h1>
        <p className="home-disciplines">Art Direction / Design / Creative Technology</p>
        <p className="home-description">An experimental designer working across images, identities and digital experiences. Drawn to fashion, industrial forms and the quieter side of design.</p>
        <ToolRail />
      </section>
      <section className="home-conversation" id="about" aria-labelledby="home-conversation-title">
        <h2 id="home-conversation-title">A short conversation</h2>
        <ConversationPlayback messages={messages} />
        <div className="conversation-links"><a href="/work#art-direction">Art direction</a><a href="/work#digital-work">Digital work</a></div>
      </section>
    </main>
    <footer className="home-footer"><span>London / New Zealand</span><a href="https://github.com/notlestat" target="_blank" rel="noopener noreferrer" aria-label="GitHub, opens in a new tab"><GithubIcon /></a><a href="#top">Back to top</a></footer>
  </>;
}
