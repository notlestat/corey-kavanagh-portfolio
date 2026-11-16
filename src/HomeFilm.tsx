import { useEffect, useRef, useState } from "react";

export default function HomeFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [playing, setPlaying] = useState(true);
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
        setPlaying(false);
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
      if (active) setPlaying(!video.paused);
    };
    const changeMotion = () => { void start(); };
    void start();
    motion.addEventListener("change", changeMotion);
    return () => { active = false; motion.removeEventListener("change", changeMotion); };
  }, []);

  // The caption shows the film's real position. It writes straight to the DOM once
  // per frame while the film plays, so React does not re-render 60 times a second.
  useEffect(() => {
    const video = videoRef.current, label = timeRef.current;
    if (!video || !label) return;
    let frame = 0;
    const two = (value: number) => String(Math.floor(value)).padStart(2, "0");
    const paint = () => {
      const time = video.currentTime;
      label.textContent = `${two(time / 60)}:${two(time % 60)}.${two((time % 1) * 100)}`;
      if (playing) frame = requestAnimationFrame(paint);
    };
    paint();
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const toggleSound = async () => {
    const video = videoRef.current;
    if (!video) return;
    const nextSound = !soundOn;
    video.muted = !nextSound;
    setAudioError(false);
    setSoundOn(nextSound);
    if (nextSound) {
      try { await video.play(); setPlaying(true); } catch {
        video.muted = true;
        setSoundOn(false);
        setAudioError(true);
      }
    }
  };

  // WCAG 2.2.2: a looping film needs a pause control, not only the reduced-motion preference.
  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try { await video.play(); setPlaying(true); } catch { setPlaying(false); }
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return <div className="home-film-wrap">
    <figure className="home-film">
      <video ref={videoRef} src="/work/gallery/video/moving-09-home.mp4" poster="/work/gallery/moving-09.jpg" width="1112" height="720" autoPlay loop playsInline muted={!soundOn} preload="auto" disablePictureInPicture disableRemotePlayback aria-label="Selected moving-image work by Corey Kavanagh" onError={() => setError(true)} />
      {error && <figcaption className="film-error">The film could not load. <a href="/work">View the work</a></figcaption>}
    </figure>
    <div className="home-film-controls">
      <p className="home-film-caption"><span>Moving image</span><span className="home-film-time" ref={timeRef} aria-hidden="true">00:00.00</span></p>
      <button className="sound-toggle theme-toggle" type="button" role="switch" aria-checked={playing} aria-label="Play film" disabled={error} onClick={() => { void togglePlayback(); }}>
        <span className="theme-toggle-track" aria-hidden="true"><span className="theme-toggle-thumb" /></span>
        <span className="theme-toggle-label" aria-hidden="true">Film</span>
      </button>
      <button className="sound-toggle theme-toggle" type="button" role="switch" aria-checked={soundOn} aria-label="Sound" disabled={error} onClick={() => { void toggleSound(); }}>
        <span className="theme-toggle-track" aria-hidden="true"><span className="theme-toggle-thumb" /></span>
        <span className="theme-toggle-label" aria-hidden="true">Sound</span>
      </button>
      {audioError && <p className="film-audio-error" role="status">Audio could not start. Try sound again.</p>}
    </div>
  </div>;
}
