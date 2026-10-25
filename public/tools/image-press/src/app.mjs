import { DEFAULTS, renderPrint, clamp } from './print-model.mjs';
import { iso, lineOnTop, translateAlong } from '../vendor/anatomy/kit/iso-kit.mjs';

const $ = selector => document.querySelector(selector);
const inputs = [...document.querySelectorAll('input[type=range]')];
const settings = { ...DEFAULTS };
const proof = $('#proof');
const message = $('#message');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const arrowIcon = '<svg class="icon" aria-hidden="true"><use href="#icon-arrow"/></svg>';
const casingIcon = '<svg class="icon" aria-hidden="true"><use href="#icon-plus"/></svg>';
let source, geometry, assemblies = [], open = 0, targetOpen = 0;
let frame = 0, lastTime = 0, visible = true, printing = false, printStart = 0;
let printCount = 0, phase = 0, renderFrame = 0, sourceVersion = 0;

function say(text, error = false) {
  message.textContent = text;
  message.classList.toggle('error', error);
}

function enable(ready) {
  for (const el of [...inputs, $('#upload'), $('#photo'), $('#reset'), $('#print'), $('#export')]) el.disabled = !ready;
}

function updateKnobs() {
  document.documentElement.style.setProperty('--registration-x', `${settings.registration}px`);
  document.documentElement.style.setProperty('--registration-y', `${settings.registration * -.55}px`);
  inputs.forEach((input, i) => {
    const value = Number(input.value);
    const fraction = (value - Number(input.min)) / (Number(input.max) - Number(input.min));
    $(`[data-dial="${input.id}"]`).style.setProperty('--angle', `${-125 + fraction * 250}deg`);
    input.style.setProperty('--progress', `${fraction * 100}%`);
    const unit = input.id === 'contrast' ? '%' : 'PX';
    const text = input.id === 'registration' ? value.toFixed(1) : String(value).padStart(2, '0');
    $(`#${input.id}-value`).innerHTML = `${text} <small>${unit}</small>`;
    input.setAttribute('aria-valuetext', `${value} ${input.id === 'contrast' ? 'percent' : 'pixels'}`);
    const pointer = $(`[data-machine-pointer="${i}"]`);
    if (pointer && geometry) {
      const angle = (-125 + fraction * 250) * Math.PI / 180;
      const x = geometry.knobs[i];
      pointer.setAttribute('d', lineOnTop([x, 81], [x + Math.sin(angle) * 6.5, 81 - Math.cos(angle) * 6.5], 41, geometry.projection));
    }
  });
}

function updateProof(edition = Math.max(1, printCount)) {
  if (!source) return;
  renderPrint(proof, source, settings, { edition, scale: 2 });
  const image = $('[data-machine-print]');
  if (image) image.setAttribute('href', proof.toDataURL('image/png'));
  const plate = $('[data-registration-plate]');
  if (plate && geometry) plate.setAttribute('transform', translateAlong(geometry.projection, [settings.registration * .09, 0, 0]));
  proof.dataset.halftone = settings.halftone;
  proof.dataset.contrast = settings.contrast;
  proof.dataset.registration = settings.registration;
  updateKnobs();
}

function queueProof() {
  if (!renderFrame) renderFrame = requestAnimationFrame(() => { renderFrame = 0; updateProof(); });
}

for (const input of inputs) input.addEventListener('input', () => {
  settings[input.id] = Number(input.value);
  updateKnobs();
  queueProof();
});

for (const dial of document.querySelectorAll('[data-dial]')) {
  const input = $(`#${dial.dataset.dial}`);
  let drag;
  dial.addEventListener('pointerdown', event => {
    if (input.disabled) return;
    drag = { y: event.clientY, value: Number(input.value) };
    dial.setPointerCapture(event.pointerId);
    input.focus({ preventScroll: true });
  });
  dial.addEventListener('pointermove', event => {
    if (!drag) return;
    const step = Number(input.step);
    const span = Number(input.max) - Number(input.min);
    input.value = Math.round(clamp(drag.value + (drag.y - event.clientY) / 140 * span, Number(input.min), Number(input.max)) / step) * step;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  dial.addEventListener('pointerup', () => { drag = null; });
  dial.addEventListener('pointercancel', () => { drag = null; });
}

function reorder() {
  const host = $('#machine svg');
  if (!host) return;
  const near = Math.sin(geometry.projection.elevation * Math.PI / 180);
  const printPlane = $('[data-print-plane]');
  const sorted = [...assemblies].sort((a, b) => Number(a.dataset.key) + Number(a.dataset.lift) * open * near - Number(b.dataset.key) - Number(b.dataset.lift) * open * near);
  for (const part of sorted) host.insertBefore(part, printPlane);
}

function drawCasing() {
  for (const part of assemblies) if (part.dataset.piece === 'cover') part.setAttribute('transform', translateAlong(geometry.projection, [0, 0, 74 * open]));
  reorder();
  $('#machine-stage').dataset.open = open.toFixed(3);
}

function drawPhase() {
  const P = geometry.projection;
  for (const hub of document.querySelectorAll('[data-hub]')) {
    let dot = hub.querySelector('.phase-dot');
    if (!dot) { dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.setAttribute('class', 'phase-dot'); dot.setAttribute('r', '1.2'); dot.setAttribute('fill', '#62685b'); hub.append(dot); }
    const x = [-102, -12, 78][Number(hub.dataset.hub)];
    const [cx, cy] = iso([x + Math.sin(phase) * 6, 89, 58 + Math.cos(phase) * 6], P);
    dot.setAttribute('cx', cx); dot.setAttribute('cy', cy);
  }
}

function finishPrint() {
  printing = false;
  printCount++;
  $('#edition').textContent = String(printCount).padStart(3, '0');
  $('#machine-status').textContent = 'Impression ready';
  $('#print').innerHTML = `<span>Pull another print</span>${arrowIcon}`;
  document.body.classList.remove('is-printing');
  $('[data-emerging-sheet]')?.removeAttribute('transform');
  enable(true);
  updateProof();
  say(`Impression ${String(printCount).padStart(3, '0')} pulled. Keep experimenting, or save this one.`);
}

function animate(now) {
  frame = 0;
  if (!visible || document.hidden || !geometry) { lastTime = 0; return; }
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 1 / 30) : 1 / 60;
  lastTime = now;
  const previous = open;
  open = reduced.matches ? targetOpen : open + (targetOpen - open) * (1 - Math.exp(-dt / .22));
  if (Math.abs(open - targetOpen) < .001) open = targetOpen;
  if (open !== previous) drawCasing();
  if (printing) {
    const elapsed = now - printStart;
    const t = reduced.matches ? 1 : Math.min(elapsed / 2400, 1);
    const ease = t * t * (3 - 2 * t);
    $('[data-emerging-sheet]')?.setAttribute('transform', `translate(${-137.5 * (1 - ease)} 0)`);
    $('#machine-status').textContent = t < .23 ? 'Feeding the sheet' : t < .8 ? 'Laying down the ink' : 'Pulling the impression';
    phase += dt * 5;
    drawPhase();
    if (t === 1) finishPrint();
  }
  if (open !== targetOpen || printing) run();
}
function run() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(animate); }

$('#casing').addEventListener('click', () => {
  targetOpen = targetOpen ? 0 : 1;
  $('#casing').setAttribute('aria-pressed', String(!!targetOpen));
  $('#casing').innerHTML = `${targetOpen ? 'Close' : 'Open'} casing ${casingIcon}`;
  $('#casing-hint').textContent = targetOpen ? 'Rollers and ink plates exposed' : 'Open to inspect the mechanism';
  lastTime = 0;
  run();
});

$('#print').addEventListener('click', () => {
  if (!source || printing) return;
  if (renderFrame) { cancelAnimationFrame(renderFrame); renderFrame = 0; }
  updateProof(printCount + 1);
  printing = true;
  printStart = performance.now();
  enable(false);
  document.body.classList.add('is-printing');
  $('#print').textContent = 'Pulling the print…';
  say('');
  $('#machine-stage').scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'center' });
  if (reduced.matches) finishPrint(); else run();
});

$('#reset').addEventListener('click', () => {
  Object.assign(settings, DEFAULTS);
  for (const input of inputs) input.value = settings[input.id];
  updateProof();
  say('Settings reset. Your photograph is still on the press.');
});

$('#export').addEventListener('click', async () => {
  if (!source) return;
  if (renderFrame) { cancelAnimationFrame(renderFrame); renderFrame = 0; }
  updateProof();
  const blob = await new Promise(resolve => proof.toBlob(resolve, 'image/png'));
  if (!blob) { say('The print could not be saved. Please try again.', true); return; }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `image-press-${String(Math.max(1, printCount)).padStart(3, '0')}.png`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  say('Your impression is saved as a 1600 × 2000 PNG.');
});

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('This image could not be opened. Try a JPEG, PNG, WebP or AVIF photograph.'));
    image.src = url;
  });
}

async function upload(file) {
  if (!file || printing) return;
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) { say('Choose a JPEG, PNG, WebP or AVIF photograph.', true); return; }
  if (file.size > 30 * 1024 * 1024) { say('Choose a photograph smaller than 30 MB.', true); return; }
  const version = ++sourceVersion;
  enable(false);
  say('Feeding your photograph…');
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    if (version !== sourceVersion) return;
    if (image.naturalWidth * image.naturalHeight > 64000000) throw new Error('Choose a photograph up to 64 megapixels.');
    const max = 2400;
    const ratio = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
    const resized = document.createElement('canvas');
    resized.width = Math.max(1, Math.round(image.naturalWidth * ratio));
    resized.height = Math.max(1, Math.round(image.naturalHeight * ratio));
    resized.getContext('2d').drawImage(image, 0, 0, resized.width, resized.height);
    source = resized;
    $('#source-name').textContent = file.name;
    $('#source-note').textContent = `${image.naturalWidth} × ${image.naturalHeight} PX / on the press`;
    printCount = 0;
    $('#edition').textContent = '001';
    $('#machine-status').textContent = 'Ready to make an impression';
    $('#print').innerHTML = `<span>Pull a print</span>${arrowIcon}`;
    updateProof();
    say('Photograph loaded. Turn the dials, then pull a print.');
  } catch (error) { say(error.message, true); }
  finally { URL.revokeObjectURL(url); if (version === sourceVersion) enable(!!source); $('#photo').value = ''; }
}

$('#upload').addEventListener('click', () => $('#photo').click());
$('#photo').addEventListener('change', event => upload(event.target.files[0]));
let dragDepth = 0;
document.addEventListener('dragenter', event => {
  if (!event.dataTransfer.types.includes('Files')) return;
  event.preventDefault(); dragDepth++; document.body.classList.add('drag-over');
});
document.addEventListener('dragover', event => { if (event.dataTransfer.types.includes('Files')) event.preventDefault(); });
document.addEventListener('dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; document.body.classList.remove('drag-over'); } });
document.addEventListener('drop', event => {
  if (!event.dataTransfer.types.includes('Files')) return;
  event.preventDefault(); dragDepth = 0; document.body.classList.remove('drag-over');
  if (event.dataTransfer.files.length !== 1) say('Feed one photograph at a time.', true); else upload(event.dataTransfer.files[0]);
});

new IntersectionObserver(entries => {
  visible = entries.at(-1).isIntersecting;
  if (visible) { if (printing) printStart = performance.now(); lastTime = 0; run(); }
}).observe($('#machine-stage'));
document.addEventListener('visibilitychange', () => {
  lastTime = 0;
  if (!document.hidden) { if (printing) printStart = performance.now(); run(); }
});
reduced.addEventListener('change', () => { if (printing && reduced.matches) finishPrint(); run(); });

async function init() {
  try {
    const [svg, data, image] = await Promise.all([
      fetch('/tools/image-press/public/machine.svg').then(r => { if (!r.ok) throw new Error('Machine drawing could not load.'); return r.text(); }),
      fetch('/tools/image-press/public/machine-data.json').then(r => { if (!r.ok) throw new Error('Machine geometry could not load.'); return r.json(); }),
      loadImage('/tools/image-press/public/sample-landscape.jpg')
    ]);
    $('#machine').innerHTML = svg;
    $('#machine svg').setAttribute('viewBox', '135 105 720 440');
    geometry = data;
    assemblies = [...document.querySelectorAll('.assembly')];
    source = image;
    const machinePrint = $('[data-machine-print]');
    machinePrint.setAttribute('width', '110');
    machinePrint.setAttribute('height', '137.5');
    $('#machine-stage').setAttribute('aria-busy', 'false');
    $('#casing').disabled = false;
    $('#machine-status').textContent = 'Ready to make an impression';
    enable(true);
    updateProof();
    drawPhase();
    drawCasing();
    document.body.dataset.ready = 'true';
  } catch (error) { say(`${error.message} Refresh the page to try again.`, true); $('#machine-status').textContent = 'The press needs attention'; }
}
updateKnobs();
init();
