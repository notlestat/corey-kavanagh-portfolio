export const FORMAT = Object.freeze({ width: 800, height: 1000, image: { x: 52, y: 60, width: 696, height: 794 } });
export const DEFAULTS = Object.freeze({ halftone: 14, contrast: 110, registration: 6 });
export const PAPER = '#f5f0e5';
export const INK = '#df462b';
export const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));

export function coverCrop(width, height, targetWidth, targetHeight) {
  const scale = Math.max(targetWidth / width, targetHeight / height);
  const w = targetWidth / scale, h = targetHeight / scale;
  return { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
}

export function densityAt(red, green, blue, alpha, contrast) {
  const luminance = (red * .2126 + green * .7152 + blue * .0722) / 255;
  const composite = luminance * alpha / 255 + (1 - alpha / 255);
  return 1 - clamp((composite - .5) * contrast / 100 + .5, 0, 1);
}

export function dotRadius(density, spacing, separation = 1) {
  return spacing * .68 * Math.sqrt(clamp(density * separation, 0, 1));
}

export function renderPrint(canvas, source, settings, { edition = 1, scale = 2 } = {}) {
  canvas.width = FORMAT.width * scale;
  canvas.height = FORMAT.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, FORMAT.width, FORMAT.height);
  const f = FORMAT.image;
  const sampling = document.createElement('canvas');
  sampling.width = f.width;
  sampling.height = f.height;
  const sample = sampling.getContext('2d', { willReadFrequently: true });
  const crop = coverCrop(source.naturalWidth || source.width, source.naturalHeight || source.height, f.width, f.height);
  sample.fillStyle = '#fff';
  sample.fillRect(0, 0, f.width, f.height);
  sample.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, f.width, f.height);
  const pixels = sample.getImageData(0, 0, f.width, f.height).data;
  const spacing = Number(settings.halftone) / 2;
  const dots = [];
  for (let y = spacing / 2; y < f.height; y += spacing) {
    for (let x = spacing / 2; x < f.width; x += spacing) {
      const i = (Math.floor(y) * f.width + Math.floor(x)) * 4;
      dots.push([x, y, densityAt(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3], settings.contrast)]);
    }
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(f.x, f.y, f.width, f.height);
  ctx.clip();
  for (const ink of [{ colour: INK, amount: .82, offset: Number(settings.registration) / 2 }, { colour: '#242421', amount: .66, offset: 0 }]) {
    ctx.fillStyle = ink.colour;
    ctx.beginPath();
    for (const [x, y, density] of dots) {
      const r = dotRadius(density, spacing, ink.amount);
      if (r < .06) continue;
      const dx = f.x + x + ink.offset, dy = f.y + y - ink.offset * .55;
      ctx.moveTo(dx + r, dy);
      ctx.arc(dx, dy, r, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  ctx.restore();
  const cross = (x, y, offset, colour) => {
    ctx.strokeStyle = colour;
    ctx.lineWidth = .75;
    ctx.beginPath();
    ctx.moveTo(x - 7 + offset, y); ctx.lineTo(x + 7 + offset, y);
    ctx.moveTo(x + offset, y - 7); ctx.lineTo(x + offset, y + 7);
    ctx.stroke();
  };
  for (const [x, y] of [[27, 35], [773, 35], [27, 879], [773, 879]]) {
    cross(x, y, settings.registration * .25, INK);
    cross(x, y, 0, '#242421');
  }
  ctx.fillStyle = '#242421';
  ctx.font = '500 27px Helvetica, Arial, sans-serif';
  ctx.fillText('A different impression.', 52, 924);
  ctx.font = '11px monospace';
  ctx.fillText(`IMAGE PRESS / ${String(edition).padStart(3, '0')}`, 52, 953);
  ctx.textAlign = 'right';
  ctx.fillText(`${settings.halftone} PX DOT / ${settings.contrast}% / ${Number(settings.registration).toFixed(1)} PX REG`, 748, 953);
  ctx.textAlign = 'left';
  return canvas;
}
