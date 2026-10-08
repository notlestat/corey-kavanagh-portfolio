const origin = "http://127.0.0.1:4335";
let checks = 0;

async function nativeClick(name) {
  const snapshot = await page.snapshot();
  const line = snapshot.split("\n").find(line => line.includes(`"${name}"`));
  const uid = line?.match(/uid=(\S+)/)?.[1];
  if (!uid) throw new Error(`Missing native click target: ${name}`);
  await page.click(`@${uid}`);
}

async function clickToggle() {
  const muted = await page.eval(() => document.querySelector('[data-slot="sound-toggle"]').getAttribute("aria-pressed") === "true");
  await nativeClick(muted ? "Unmute interface sounds" : "Mute interface sounds");
}

async function clickFolder() {
  const open = await page.eval(() => document.querySelector('[data-slot="folder-trigger"]').getAttribute("aria-expanded") === "true");
  await nativeClick(open ? "Close work folder" : "Open work folder");
}

async function installProbe() {
  await page.eval(async () => {
    const { soundAPI: sound } = await import("/tests/review-regressions.tsx");
    const probe = window.soundReview = { sound, starts: 0, peak: 0, saved: null, folderEvent: null };
    const analysers = [];
    const connect = AudioNode.prototype.connect;
    const start = OscillatorNode.prototype.start;
    AudioNode.prototype.connect = function (target, ...args) {
      const result = connect.call(this, target, ...args);
      if (target === this.context.destination) {
        const node = this.context.createAnalyser();
        node.fftSize = 2048;
        connect.call(this, node);
        analysers.push({ node, samples: new Float32Array(node.fftSize) });
      }
      return result;
    };
    OscillatorNode.prototype.start = function (...args) {
      probe.starts++;
      return start.apply(this, args);
    };
    probe.timer = setInterval(() => {
      for (const { node, samples } of analysers) {
        node.getFloatTimeDomainData(samples);
        for (const sample of samples) probe.peak = Math.max(probe.peak, Math.abs(sample));
      }
    }, 5);
    document.addEventListener("click", event => {
      if (event.isTrusted && event.target.closest('[data-slot="sound-toggle"]')) probe.saved = event;
    }, true);
    document.addEventListener("work-folder-state-change", event => { probe.folderEvent = event; }, true);
    probe.restore = () => {
      clearInterval(probe.timer);
      AudioNode.prototype.connect = connect;
      OscillatorNode.prototype.start = start;
      for (const { node } of analysers) node.disconnect();
    };
  });
}

async function check(label, action, audible, muted) {
  await page.wait(250);
  const before = await page.eval(() => { window.soundReview.peak = 0; return window.soundReview.starts; });
  await action();
  await page.wait(350);
  const result = await page.eval(() => ({
    starts: window.soundReview.starts,
    peak: window.soundReview.peak,
    muted: document.querySelector('[data-slot="sound-toggle"]').getAttribute("aria-pressed") === "true",
  }));
  const delta = result.starts - before;
  const passed = (audible ? delta === 1 && result.peak > 0.00001 : delta === 0 && result.peak === 0)
    && (muted === undefined || result.muted === muted);
  console.log(JSON.stringify({ label, passed, delta, ...result }));
  if (!passed) throw new Error(`${label}: ${JSON.stringify({ delta, ...result })}`);
  checks++;
}

async function checkSettings(prefix) {
  await check(`${prefix}: API mute`, () => page.eval(() => window.soundReview.sound.setSoundMuted(true)), false, true);
  await check(`${prefix}: pointer unmute once`, clickToggle, true, false);
  const savedTrusted = await page.eval(() => window.soundReview.saved?.isTrusted);
  if (!savedTrusted) throw new Error("Missing genuine saved click");
  for (let i = 0; i < 3; i++) {
    await check(`${prefix}: API mute ${i}`, () => page.eval(() => window.soundReview.sound.setSoundMuted(true)), false, true);
    await check(`${prefix}: saved-event API unmute ${i}`, () => page.eval(() => {
      window.soundReview.sound.setSoundMuted(false, window.soundReview.saved);
    }), false, false);
  }
  await check(`${prefix}: pointer mute once`, clickToggle, true, true);
  await check(`${prefix}: keyboard Enter unmute once`, async () => {
    await page.eval(() => document.querySelector('[data-slot="sound-toggle"]').focus());
    await page.press("Enter");
  }, true, false);
  await check(`${prefix}: keyboard Space mute once`, () => page.press("Space"), true, true);
  await check(`${prefix}: keyboard Space unmute once`, () => page.press("Space"), true, false);
  for (const muted of [true, false]) {
    await check(`${prefix}: storage ${muted}`, () => page.eval(`() => {
      localStorage.setItem("kobra-sound-muted", "${muted ? "1" : "0"}");
      window.dispatchEvent(new StorageEvent("storage", { key: "kobra-sound-muted" }));
    }`), false, muted);
  }
  await check(`${prefix}: API mute without event`, () => page.eval(() => window.soundReview.sound.setSoundMuted(true)), false, true);
  await check(`${prefix}: API unmute without event`, () => page.eval(() => window.soundReview.sound.setSoundMuted(false)), false, false);
  await check(`${prefix}: synthetic toggle mute`, () => page.eval(() => document.querySelector('[data-slot="sound-toggle"]').click()), false, true);
  await check(`${prefix}: synthetic toggle unmute`, () => page.eval(() => document.querySelector('[data-slot="sound-toggle"]').click()), false, false);
}

await page.open(`${origin}/work`);
await page.wait('[data-slot="sound-toggle"]');
await page.wait(500);
await installProbe();
await checkSettings("folder scope");
await check("trusted folder open", clickFolder, true);
for (let i = 0; i < 3; i++) {
  await check(`saved folder-event replay ${i}`, () => page.eval(() => {
    document.querySelector('[data-slot="folder-trigger"]').dispatchEvent(window.soundReview.folderEvent);
  }), false);
}
await check("synthetic Escape", () => page.eval(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))), false);
await check("trusted keyboard folder open", async () => {
  await page.eval(() => document.querySelector('[data-slot="folder-trigger"]').focus());
  await page.press("Enter");
}, true);
await check("trusted Escape close", () => page.press("Escape"), true);
await check("trusted Space folder open", () => page.press("Space"), true);
await check("trusted outside click close", () => nativeClick("Corey Kavanagh / Selected work"), true);
await check("mute before folder", () => page.eval(() => window.soundReview.sound.setSoundMuted(true)), false, true);
await check("muted folder open", clickFolder, false);
await check("muted folder close", clickFolder, false);
await page.eval(() => window.soundReview.restore());

await page.open(`${origin}/`);
await page.wait(500);
await page.eval(async () => {
  const tests = await import("/tests/review-regressions.tsx");
  window.unmountSoundReview = tests.mountSoundScopeRegression("all");
});
await installProbe();
await checkSettings("all scope");
await page.eval(() => { window.soundReview.restore(); window.unmountSoundReview(); });
console.log(JSON.stringify({ passed: true, checks }));
