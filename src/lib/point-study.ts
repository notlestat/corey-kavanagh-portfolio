/** A small command interpreter for the film. Never evaluates user-supplied code. */
export function initPointStudies() {
  document.querySelectorAll<HTMLElement>("[data-point-study]").forEach((stage) => {
    const video = stage.querySelector<HTMLVideoElement>("video")!;
    const button = stage.querySelector<HTMLButtonElement>(".point-toggle")!;
    const label = stage.querySelector<HTMLElement>(".point-toggle-label")!;
    const state = stage.querySelector<HTMLElement>(".point-state")!;
    const clock = stage.querySelector<HTMLElement>("[data-point-time]")!;
    const frame = stage.querySelector<HTMLElement>("[data-point-frame]")!;
    const rate = stage.querySelector<HTMLElement>("[data-point-rate]")!;
    const code = stage.querySelector<HTMLElement>("[data-point-code]")!;
    const codeWindow = stage.querySelector<HTMLElement>(".point-code")!;
    const form = stage.querySelector<HTMLFormElement>(".point-command")!;
    const input = form.querySelector<HTMLInputElement>("input")!;
    const response = stage.querySelector<HTMLElement>(".point-command-response")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let requested = false;
    let visible = false;
    let booted = false;
    let demoCancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    let lines = ["// image → points → image"];
    const history: string[] = [];
    let historyIndex = 0;
    button.hidden = false;
    form.hidden = false;

    const drawCode = () => {
      code.textContent = lines.join("\n");
      codeWindow.scrollTop = codeWindow.scrollHeight;
    };
    const append = (line: string) => {
      lines = [...lines, line].slice(-16);
      drawCode();
    };
    const paint = () => {
      const time = video.currentTime;
      clock.textContent = `00:${time.toFixed(2).padStart(5, "0")}`;
      // The supplied film and the web encode are both 30 fps.
      frame.textContent = String(Math.floor(time * 30)).padStart(4, "0");
      rate.textContent = `${video.playbackRate.toFixed(2)}×`;
    };
    const update = () => {
      const playing = !video.paused;
      stage.dataset.playing = String(playing);
      state.textContent = playing ? "playing" : "still";
      // The visible words are the accessible name, so voice control can say exactly what it reads.
      label.textContent = playing ? "Pause motion" : "Play motion";
      clearInterval(timer);
      if (playing) timer = setInterval(paint, 120);
      paint();
    };
    const sync = async () => {
      if (requested && visible && !document.hidden) {
        try { await video.play(); }
        catch { requested = false; update(); }
      } else video.pause();
    };
    const boot = async () => {
      if (booted) return;
      booted = true;
      if (motion.matches || connection?.saveData) {
        append("// Press play to begin.");
        return;
      }
      const steps = [
        { text: 'const film = document.querySelector("video");', run: () => {} },
        { text: "film.loop = true;", run: () => { video.loop = true; } },
        { text: "film.playbackRate = 1;", run: () => { video.playbackRate = 1; } },
        { text: "await film.play();", run: () => { requested = true; void sync(); } },
      ];
      for (const step of steps) {
        if (demoCancelled) return;
        lines.push("");
        for (const letter of step.text) {
          if (demoCancelled) return;
          lines[lines.length - 1] += letter;
          drawCode();
          await new Promise((resolve) => setTimeout(resolve, 24));
        }
        step.run();
      }
      append("// Your turn. Type help below.");
    };
    const reply = (message: string) => {
      append(`// ${message}`);
      response.textContent = message;
    };
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const command = input.value.trim();
      if (!command) return;
      demoCancelled = true;
      history.push(command);
      historyIndex = history.length;
      input.value = "";
      append(`> ${command}`);
      const [name, value, ...rest] = command.toLowerCase().split(/\s+/);
      const amount = Number(value);
      if (name === "help" && !value) reply("play · pause · speed 0.25–2 · seek 0–5.33 · clear");
      else if (name === "play" && !value) {
        requested = true;
        await sync();
        reply(video.paused ? "Playback unavailable. Try Play motion." : "Playing point-study.mp4");
      } else if (name === "pause" && !value) {
        requested = false;
        await sync();
        reply("Paused.");
      } else if (name === "speed" && value && !rest.length && Number.isFinite(amount) && amount >= 0.25 && amount <= 2) {
        video.playbackRate = amount;
        paint();
        reply(`Playback rate = ${amount}×`);
      } else if (name === "seek" && value && !rest.length && Number.isFinite(amount) && amount >= 0 && amount <= 5.33) {
        // Seeking is available only after metadata has established a time range.
        if (video.readyState < 1) reply("Press play once to load the film, then seek.");
        else { video.currentTime = amount; paint(); reply(`Position = ${amount.toFixed(2)}s`); }
      } else if (name === "clear" && !value) {
        lines = ["// point-study.js"];
        drawCode();
        response.textContent = "Terminal cleared.";
      } else reply("Unknown command. Type help.");
    });
    input.addEventListener("focus", () => { demoCancelled = true; });
    input.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      historyIndex = Math.min(history.length, Math.max(0, historyIndex + (event.key === "ArrowUp" ? -1 : 1)));
      input.value = history[historyIndex] ?? "";
    });
    button.addEventListener("click", () => {
      demoCancelled = true;
      requested = video.paused;
      append(requested ? "await film.play();" : "film.pause();");
      void sync();
    });
    video.addEventListener("play", update);
    video.addEventListener("pause", update);
    video.addEventListener("seeked", paint);
    video.addEventListener("error", () => {
      stage.querySelector<HTMLElement>(".point-error")!.hidden = false;
      button.hidden = true;
      demoCancelled = true;
      requested = false;
      video.pause();
      clearInterval(timer);
      reply("The film could not load.");
    });
    motion.addEventListener("change", () => {
      demoCancelled = true;
      requested = false;
      void sync();
    });
    document.addEventListener("visibilitychange", () => { void sync(); });
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) void boot();
      void sync();
    }, { threshold: 0.05 }).observe(stage.closest(".point-study") ?? stage);
    window.addEventListener("pagehide", () => { demoCancelled = true; clearInterval(timer); });
  });
}
