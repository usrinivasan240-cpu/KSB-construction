/**
 * KSB CONSTRUCTIONS — placeholder art generator.
 * ---------------------------------------------------------------------------
 * Produces premium, dark-architectural SVG artwork for every image slot used by
 * the site so the build ships with a complete visual system.
 *
 * TO REPLACE WITH REAL PHOTOGRAPHY: drop files into /public/assets/ using the
 * same filenames listed in src/lib/assets.ts — no code changes required.
 *
 * Run:  node scripts/gen-art.mjs
 */
import { mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "public", "assets");

/* -------------------------------------------------------------- palette ---- */
const C = {
  ink: "#070908",
  black: "#0B0D0C",
  green0: "#0C130F",
  green1: "#101A14",
  green4: "#2A4633",
  copper0: "#7A3F1D",
  copper1: "#B75F28",
  copper2: "#D97B3B",
  copper3: "#F0A765",
  bone: "#EFEAE2",
};

/* ------------------------------------------------------------- utilities ---- */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hex = (h) => {
  let s = h.replace("#", "");
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
function mix(a, b, t) {
  const m = hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * clamp(t, 0, 1)));
  return "#" + m.map((v) => v.toString(16).padStart(2, "0")).join("");
}

/** Definitions collector — returns gradient/filter ids so they can be referenced. */
class Defs {
  constructor() {
    this.items = [];
    this.n = 0;
  }
  lin(stops, x1 = "0%", y1 = "0%", x2 = "0%", y2 = "100%") {
    const id = `lg${++this.n}`;
    this.items.push(
      `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">` +
        stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("") +
        `</linearGradient>`,
    );
    return id;
  }
  rad(stops, cx = "50%", cy = "50%", r = "70%") {
    const id = `rg${++this.n}`;
    this.items.push(
      `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">` +
        stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("") +
        `</radialGradient>`,
    );
    return id;
  }
  grain(freq = 0.9, slope = 0.09) {
    const id = `gr${++this.n}`;
    this.items.push(
      `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">` +
        `<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="4" stitchTiles="stitch"/>` +
        `<feColorMatrix type="saturate" values="0"/>` +
        `<feComponentTransfer><feFuncA type="linear" slope="${slope}"/></feComponentTransfer></filter>`,
    );
    return id;
  }
  blur(dev) {
    const id = `bl${++this.n}`;
    this.items.push(
      `<filter id="${id}" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="${dev}"/></filter>`,
    );
    return id;
  }
  render() {
    return `<defs>${this.items.join("")}</defs>`;
  }
}

function vignette(d, w, h, strength = 0.72, r = 80) {
  const id = d.rad(
    [
      [0, "#000", 0],
      [0.5, "#000", 0],
      [0.78, "#000", strength * 0.45],
      [1, "#000", strength],
    ],
    "50%",
    "46%",
    `${r}%`,
  );
  return `<rect width="${w}" height="${h}" fill="url(#${id})"/>`;
}

function grainLayer(id, w, h) {
  return `<rect width="${w}" height="${h}" fill="#fff" filter="url(#${id})"/>`;
}

function wrap(w, h, defsMarkup, body) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" ` +
    `preserveAspectRatio="xMidYMid slice" role="img">` +
    defsMarkup +
    body +
    `</svg>`
  );
}

/* -------------------------------------------------- scene: skyline / massing */
function skyline(opts = {}) {
  const {
    w = 2400,
    h = 1500,
    seed = 7,
    glowX = 0.72,
    glowY = 0.24,
    glowScale = 1,
    groundY = 0.86,
    layers = 4,
    crane = true,
    horizon = 0.72,
    shaft = true,
    density = 1,
  } = opts;

  const r = rng(seed);
  const d = new Defs();
  const bg = d.lin([
    [0, C.green1],
    [0.42, "#070A08"],
    [1, "#040605"],
  ]);
  const glow = d.rad(
    [
      [0, C.copper2, 0.5],
      [0.35, C.copper2, 0.2],
      [0.7, C.copper0, 0.08],
      [1, C.copper2, 0],
    ],
    "50%",
    "50%",
    "65%",
  );
  const soft = d.blur(42);
  const grain = d.grain(0.9, 0.09);

  let b = `<rect width="${w}" height="${h}" fill="url(#${bg})"/>`;

  // atmosphere
  b +=
    `<ellipse cx="${w * glowX}" cy="${h * glowY}" rx="${w * 0.46 * glowScale}" ` +
    `ry="${h * 0.38 * glowScale}" fill="url(#${glow})" filter="url(#${soft})"/>`;

  // distant ridge
  let ridge = `M0 ${(h * horizon).toFixed(1)}`;
  for (let x = 0; x <= w; x += w / 14) ridge += ` L${x.toFixed(0)} ${(h * horizon - r() * h * 0.05).toFixed(1)}`;
  ridge += ` L${w} ${h} L0 ${h} Z`;
  b += `<path d="${ridge}" fill="${C.green0}" opacity="0.9"/>`;

  // massing layers, far → near
  for (let L = 0; L < layers; L++) {
    const t = layers === 1 ? 1 : L / (layers - 1);
    const depth = 1 - t;
    const col = mix("#1A2C21", "#080B09", t);
    const op = 0.6 + depth * 0.38;
    const yBase = h * (groundY - 0.02 * depth) + (1 - depth) * h * 0.07;
    const minW = (w / 26) * (1.15 - t * 0.5);
    const maxW = (w / 8) * (1.2 - t * 0.55);
    const minH = h * (0.14 + (1 - depth) * 0.26);
    const maxH = h * (0.44 + (1 - depth) * 0.36);

    const face = d.lin(
      [
        [0, col],
        [1, mix(col, "#000", 0.5)],
      ],
      "0%",
      "0%",
      "100%",
      "0%",
    );

    let x = -w * 0.05;
    let i = 0;
    while (x < w * 1.05) {
      const bw = minW + r() * (maxW - minW);
      const bh = minH + r() * (maxH - minH);
      const by = yBase - bh;

      b += `<rect x="${x.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${(
        bh +
        h * 0.25
      ).toFixed(1)}" fill="url(#${face})" opacity="${op.toFixed(2)}"/>`;

      if (x + bw > w * (glowX - 0.28) && r() > 0.3) {
        b += `<rect x="${(x + bw - 3.5).toFixed(1)}" y="${by.toFixed(1)}" width="3.5" height="${bh.toFixed(
          1,
        )}" fill="${C.copper2}" opacity="${(0.14 + depth * 0.34).toFixed(2)}"/>`;
      }

      if (depth > 0.24 && i % 2 === 0) {
        const cols = Math.max(2, Math.floor(bw / (30 * density + r() * 22)));
        const rows = Math.max(3, Math.floor(bh / 36));
        const cw = bw / cols;
        const ch = bh / rows;
        for (let cx = 0; cx < cols; cx++) {
          for (let cy = 0; cy < rows; cy++) {
            const q = r();
            if (q > 0.84) continue;
            const lit = q < 0.09;
            b +=
              `<rect x="${(x + cx * cw + cw * 0.28).toFixed(1)}" y="${(by + cy * ch + ch * 0.26).toFixed(1)}" ` +
              `width="${Math.max(2, cw * 0.42).toFixed(1)}" height="${Math.max(2, ch * 0.36).toFixed(1)}" ` +
              `fill="${lit ? C.copper3 : C.copper1}" opacity="${lit ? 0.8 : (0.12 + r() * 0.24).toFixed(2)}"/>`;
          }
        }
      }
      x += bw + Math.max(3, w * 0.0022);
      i++;
    }
  }

  // light shaft
  if (shaft) {
    const sx = w * glowX;
    const sh = d.lin([
      [0, C.copper2, 0.3],
      [1, C.copper2, 0],
    ]);
    b +=
      `<path d="M${sx - w * 0.04} -10 L${sx + w * 0.3} ${h + 10} L${sx - w * 0.2} ${h + 10} Z" ` +
      `fill="url(#${sh})" filter="url(#${soft})" opacity="0.75"/>`;
  }

  // tower crane
  if (crane) {
    const cx = w * (0.09 + r() * 0.12);
    const top = h * 0.1;
    const baseY = h * 0.84;
    const jib = w * 0.34;
    b +=
      `<g stroke="#2B322E" stroke-width="${(w * 0.0026).toFixed(1)}" fill="none" opacity="0.95">` +
      `<path d="M${cx} ${baseY} L${cx} ${top}"/>` +
      `<path d="M${cx - jib * 0.34} ${top + h * 0.035} L${cx + jib} ${top}"/>` +
      `<path d="M${cx} ${top} L${cx + jib} ${top}"/>` +
      `<path d="M${cx - jib * 0.34} ${top + h * 0.035} L${cx} ${top - h * 0.05}"/>` +
      `<path d="M${cx} ${top - h * 0.05} L${cx + jib} ${top}"/>` +
      `<path d="M${cx - jib * 0.12} ${top} L${cx - jib * 0.12} ${baseY}" opacity="0.55"/>` +
      `</g>` +
      `<line x1="${cx + jib * 0.72}" y1="${top + h * 0.012}" x2="${cx + jib * 0.72}" y2="${
        h * 0.44
      }" stroke="#39423D" stroke-width="${(w * 0.0016).toFixed(1)}" opacity="0.75"/>` +
      `<rect x="${cx + jib * 0.72 - w * 0.013}" y="${h * 0.44}" width="${w * 0.026}" height="${
        h * 0.05
      }" fill="${C.copper1}" opacity="0.9"/>`;
  }

  // ground plane
  const gy = h * (groundY + 0.05);
  b += `<rect x="0" y="${gy}" width="${w}" height="${h - gy}" fill="#050706" opacity="0.97"/>`;
  b += `<rect x="0" y="${gy}" width="${w}" height="${Math.max(2, h * 0.004)}" fill="${C.copper2}" opacity="0.34"/>`;

  b += grainLayer(grain, w, h);
  b += vignette(d, w, h, 0.78);

  return wrap(w, h, d.render(), b);
}

/* ------------------------------------------------------------ scene: plan ---- */
function blueprint({ w = 1600, h = 1200, seed = 3 } = {}) {
  const r = rng(seed);
  const d = new Defs();
  const bg = d.lin([
    [0, "#080F0B"],
    [0.5, "#0A1512"],
    [1, "#060B08"],
  ]);
  const glow = d.rad(
    [
      [0, C.copper1, 0.26],
      [1, C.copper1, 0],
    ],
    "74%",
    "22%",
    "62%",
  );
  const grain = d.grain(1.1, 0.07);

  let b = `<rect width="${w}" height="${h}" fill="url(#${bg})"/>`;

  const step = w / 44;
  for (let x = 0; x <= w + step; x += step)
    b += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${h}" stroke="${C.green4}" stroke-width="0.7" opacity="0.3"/>`;
  for (let y = 0; y <= h + step; y += step)
    b += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" stroke="${C.green4}" stroke-width="0.7" opacity="0.3"/>`;

  b += `<rect width="${w}" height="${h}" fill="url(#${glow})"/>`;

  const t = Math.max(4, w * 0.005);
  const rooms = [
    [0.09, 0.14, 0.38, 0.4],
    [0.47, 0.14, 0.36, 0.24],
    [0.47, 0.38, 0.36, 0.16],
    [0.09, 0.54, 0.26, 0.32],
    [0.35, 0.54, 0.48, 0.32],
  ];
  for (const [rx, ry, rw, rh] of rooms) {
    const x = w * rx,
      y = h * ry,
      ww = w * rw,
      hh = h * rh;
    b += `<rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="none" stroke="${C.bone}" stroke-width="${t}" opacity="0.75"/>`;
    b += `<rect x="${x + t * 2.6}" y="${y + t * 2.6}" width="${ww - t * 5.2}" height="${hh - t * 5.2}" fill="none" stroke="${C.bone}" stroke-width="${t * 0.5}" opacity="0.4"/>`;
  }

  for (let i = 0; i < 7; i++) {
    const x = w * (0.13 + r() * 0.62);
    const y = h * (0.2 + r() * 0.58);
    const rad = w * 0.05;
    b += `<path d="M${x} ${y} L${x + rad} ${y} A${rad} ${rad} 0 0 1 ${x} ${y + rad}" fill="none" stroke="${C.copper2}" stroke-width="2.2" opacity="0.6"/>`;
    b += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + rad}" stroke="${C.copper2}" stroke-width="3.4" opacity="0.55"/>`;
  }

  for (let i = 0; i < 5; i++) {
    const y = h * (0.05 + i * 0.016);
    const x1 = w * (0.09 + r() * 0.22);
    const x2 = w * (0.58 + r() * 0.33);
    b +=
      `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.copper3}" stroke-width="1.4" opacity="0.5"/>` +
      `<path d="M${x1} ${y - 8} L${x1} ${y + 8} M${x2} ${y - 8} L${x2} ${y + 8}" stroke="${C.copper3}" stroke-width="1.4" opacity="0.5"/>`;
  }

  for (let i = 0; i < 30; i++) {
    const x = r() * w;
    const y = r() * h;
    b += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + w * 0.03).toFixed(0)}" y2="${y.toFixed(0)}" stroke="${C.bone}" stroke-width="1" opacity="0.13"/>`;
  }

  // section marker
  const sm = w * 0.68,
    sy = h * 0.78;
  b +=
    `<circle cx="${sm}" cy="${sy}" r="${w * 0.032}" fill="none" stroke="${C.copper2}" stroke-width="2.4" opacity="0.75"/>` +
    `<line x1="${sm - w * 0.06}" y1="${sy}" x2="${sm + w * 0.06}" y2="${sy}" stroke="${C.copper2}" stroke-width="2.4" opacity="0.75"/>`;

  b += grainLayer(grain, w, h);
  b += vignette(d, w, h, 0.62);

  return wrap(w, h, d.render(), b);
}

/* --------------------------------------------------------- scene: material --- */
function material(kind, { w = 1400, h = 1400, seed = 11 } = {}) {
  const r = rng(seed);
  const d = new Defs();
  const grain = d.grain(1.0, 0.1);
  const soft = d.blur(28);

  const tone = {
    brick: ["#241610", "#3E241A"],
    concrete: ["#171A18", "#242927"],
    steel: ["#11161A", "#1E262B"],
    wood: ["#1E1712", "#33261A"],
    finish: ["#151816", "#272B28"],
    detail: ["#101312", "#1F2421"],
  }[kind] || ["#141715", "#232724"];

  const bg = d.lin(
    [
      [0, tone[1]],
      [1, tone[0]],
    ],
    "0%",
    "0%",
    "100%",
    "100%",
  );
  let b = `<rect width="${w}" height="${h}" fill="url(#${bg})"/>`;

  if (kind === "brick") {
    const bw = w / 9;
    const bh = bw * 0.44;
    for (let i = 0, y = -bh; y < h + bh; i++, y += bh) {
      const off = i % 2 ? -bw / 2 : 0;
      for (let x = off - bw; x < w + bw; x += bw) {
        const col = mix("#16100C", "#2B1C13", r());
        b += `<rect x="${(x + 4).toFixed(1)}" y="${(y + 4).toFixed(1)}" width="${(bw - 8).toFixed(1)}" height="${(
          bh - 8
        ).toFixed(1)}" rx="2" fill="${col}" opacity="${(0.8 + r() * 0.2).toFixed(2)}"/>`;
        b += `<rect x="${(x + 4).toFixed(1)}" y="${(y + 4).toFixed(1)}" width="${(bw - 8).toFixed(1)}" height="${(
          bh * 0.2
        ).toFixed(1)}" rx="2" fill="${C.copper3}" opacity="${(r() * 0.07).toFixed(2)}"/>`;
      }
    }
  } else if (kind === "concrete") {
    const pw = w / 3;
    const ph = h / 2;
    for (let i = 0; i < 6; i++) {
      const x = (i % 3) * pw;
      const y = Math.floor(i / 3) * ph;
      b += `<rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="${i % 2 ? "#141715" : "#101312"}" opacity="0.9"/>`;
      b += `<rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="none" stroke="#080A09" stroke-width="5" opacity="0.9"/>`;
      for (let a = 0; a < 3; a++)
        for (let c = 0; c < 2; c++) {
          const cx = x + pw * (0.24 + a * 0.26);
          const cy = y + ph * (0.3 + c * 0.4);
          b += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(w * 0.012).toFixed(1)}" fill="#070908"/>`;
          b += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(w * 0.012).toFixed(1)}" fill="none" stroke="#222825" stroke-width="2.4"/>`;
        }
    }
    for (let i = 0; i < 44; i++) {
      const x = r() * w;
      b += `<rect x="${x.toFixed(0)}" y="${(r() * h * 0.4).toFixed(0)}" width="${(2 + r() * 7).toFixed(1)}" height="${(
        h * (0.2 + r() * 0.6)
      ).toFixed(0)}" fill="#000" opacity="${(0.03 + r() * 0.08).toFixed(2)}"/>`;
    }
  } else if (kind === "steel") {
    // Dark brushed steel plates with a single copper rim-light edge.
    // (No geometric beams — those read as broken clip-art at large sizes.)
    const bar = d.lin(
      [
        [0, "#161D21"],
        [0.5, "#232D33"],
        [1, "#0E1316"],
      ],
      "0%",
      "0%",
      "100%",
      "0%",
    );
    const barV = d.lin([
      [0, "#141A1E"],
      [0.5, "#20292F"],
      [1, "#0D1114"],
    ]);
    const g = w / 11;
    for (let i = 0; i <= 13; i++) {
      const p = i * g;
      b += `<rect x="${p.toFixed(1)}" y="0" width="${(g * 0.26).toFixed(1)}" height="${h}" fill="url(#${barV})"/>`;
      for (let k = 0; k < 60; k++)
        b += `<rect x="${(k * (w / 60)).toFixed(1)}" y="${p.toFixed(1)}" width="${(g * 0.09).toFixed(
          1,
        )}" height="${(g * 0.26).toFixed(1)}" fill="#070A0B" opacity="0.55"/>`;
    }
    for (let j = 0; j <= 13; j++) {
      const p = j * g;
      b += `<rect x="0" y="${p.toFixed(1)}" width="${w}" height="${(g * 0.26).toFixed(1)}" fill="url(#${bar})"/>`;
    }
    // copper rim-light: one vertical highlight edge
    b += `<rect x="${(w * 0.62).toFixed(1)}" y="0" width="5" height="${h}" fill="${C.copper1}" opacity="0.5"/>`;
    b += `<rect x="${(w * 0.62 + 5).toFixed(1)}" y="0" width="22" height="${h}" fill="${C.copper1}" opacity="0.12"/>`;
  } else if (kind === "wood") {
    const pw = w / 7;
    for (let x = -pw * 0.4; x < w + pw; x += pw) {
      const col = mix("#1D140E", "#31221A", r());
      b += `<rect x="${x.toFixed(1)}" y="-12" width="${(pw - 6).toFixed(1)}" height="${h + 24}" fill="${col}"/>`;
      b += `<rect x="${(x + pw - 7).toFixed(1)}" y="-12" width="7" height="${h + 24}" fill="#0B0907" opacity="0.72"/>`;
      for (let k = 0; k < 15; k++) {
        const gy = r() * h;
        b += `<path d="M${x.toFixed(1)} ${gy.toFixed(1)} Q${(x + pw / 2).toFixed(1)} ${(
          gy + (r() - 0.5) * 46
        ).toFixed(1)} ${(x + pw - 6).toFixed(1)} ${(gy + (r() - 0.5) * 26).toFixed(1)}" fill="none" stroke="#1E140E" stroke-width="${(
          0.8 + r() * 2.2
        ).toFixed(1)}" opacity="0.5"/>`;
      }
      b += `<rect x="${x.toFixed(1)}" y="-12" width="${(pw - 6).toFixed(1)}" height="${h + 24}" fill="${
        C.copper3
      }" opacity="${(r() * 0.06).toFixed(2)}"/>`;
    }
  } else if (kind === "finish") {
    const f = d.lin(
      [
        [0, "#2C3230"],
        [0.55, "#1C201E"],
        [1, "#111413"],
      ],
      "0%",
      "0%",
      "100%",
      "100%",
    );
    b += `<rect width="${w}" height="${h}" fill="url(#${f})"/>`;
    b += `<path d="M0 ${h * 0.64} L${w} ${h * 0.1} L${w} ${h * 0.3} L0 ${h * 0.84} Z" fill="${C.bone}" opacity="0.055" filter="url(#${soft})"/>`;
    const x = w * 0.12,
      y = h * 0.16,
      ww = w * 0.76,
      hh = h * 0.68;
    b += `<rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="none" stroke="#3B423E" stroke-width="3" opacity="0.75"/>`;
    b += `<rect x="${x}" y="${y}" width="${ww}" height="4" fill="${C.copper2}" opacity="0.8"/>`;
    b += `<circle cx="${w * 0.5}" cy="${h * 0.5}" r="${w * 0.17}" fill="none" stroke="#3B423E" stroke-width="2" opacity="0.5"/>`;
    b += `<line x1="${x}" y1="${h * 0.84}" x2="${x + ww}" y2="${h * 0.84}" stroke="#3B423E" stroke-width="2" opacity="0.45"/>`;
  } else {
    for (let i = 0; i < 14; i++) {
      const t2 = i * (h / 15);
      const px = w * 0.1 + t2 * 0.44;
      const py = h * 0.9 - t2;
      b += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} l${(w * 0.2).toFixed(1)} 0 l0 ${(-h * 0.055).toFixed(
        1,
      )} l${(-w * 0.2).toFixed(1)} 0 Z" fill="${i % 2 ? "#141715" : "#0D100E"}" stroke="#070908" stroke-width="2"/>`;
      b += `<rect x="${px.toFixed(1)}" y="${(py - h * 0.055).toFixed(1)}" width="${(w * 0.2).toFixed(1)}" height="5" fill="${
        C.copper2
      }" opacity="0.6"/>`;
    }
    b += `<rect x="${w * 0.6}" y="${h * 0.06}" width="${w * 0.32}" height="${h * 0.88}" fill="#11100E" opacity="0.94"/>`;
    b += `<rect x="${w * 0.6}" y="${h * 0.06}" width="6" height="${h * 0.88}" fill="${C.copper1}" opacity="0.55"/>`;
  }

  const light = d.rad(
    [
      [0, C.copper3, 0.3],
      [0.45, C.copper1, 0.1],
      [1, "#000", 0],
    ],
    "16%",
    "6%",
    "88%",
  );
  b += `<rect width="${w}" height="${h}" fill="url(#${light})"/>`;
  b += grainLayer(grain, w, h);
  b += vignette(d, w, h, 0.68, 90);

  return wrap(w, h, d.render(), b);
}

/* --------------------------------------------------------- scene: interior --- */
function interior({ w = 1600, h = 1200, seed = 5 } = {}) {
  const r = rng(seed);
  const d = new Defs();
  const grain = d.grain(0.9, 0.08);

  const bg = d.lin([
    [0, "#181D1A"],
    [0.5, "#101413"],
    [1, "#070908"],
  ]);
  let b = `<rect width="${w}" height="${h}" fill="url(#${bg})"/>`;

  // floor
  b += `<rect x="0" y="${h * 0.68}" width="${w}" height="${h * 0.32}" fill="#0E1110"/>`;
  for (let i = 0; i <= 10; i++) {
    const y = h * 0.68 + h * 0.32 * Math.pow(i / 10, 1.8);
    b += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" stroke="#1C211E" stroke-width="2"/>`;
  }
  for (let i = -4; i <= 14; i++) {
    const x = (i / 10) * w;
    b += `<line x1="${x.toFixed(1)}" y1="${(h * 0.68).toFixed(1)}" x2="${(w * 0.5 + (x - w * 0.5) * 2.6).toFixed(
      1,
    )}" y2="${h}" stroke="#1C211E" stroke-width="2"/>`;
  }

  // glazing
  const pane = d.lin(
    [
      [0, "#EBCEA5", 0.72],
      [0.5, "#BC8D57", 0.3],
      [1, "#4E6C57", 0.16],
    ],
    "0%",
    "0%",
    "100%",
    "30%",
  );
  b += `<rect x="${w * 0.49}" y="${h * 0.05}" width="${w * 0.47}" height="${h * 0.63}" fill="#0A1512"/>`;
  for (let i = 0; i < 4; i++) {
    const x = w * (0.5 + i * 0.116);
    b += `<rect x="${x.toFixed(1)}" y="${(h * 0.07).toFixed(1)}" width="${(w * 0.1).toFixed(
      1,
    )}" height="${(h * 0.59).toFixed(1)}" fill="url(#${pane})"/>`;
    b += `<rect x="${x.toFixed(1)}" y="${(h * 0.07).toFixed(1)}" width="${(w * 0.1).toFixed(
      1,
    )}" height="${(h * 0.59).toFixed(1)}" fill="none" stroke="#0B0D0C" stroke-width="7"/>`;
  }

  const pool = d.rad(
    [
      [0, "#E7C79C", 0.24],
      [1, "#E7C79C", 0],
    ],
    "50%",
    "50%",
    "50%",
  );
  b += `<ellipse cx="${w * 0.7}" cy="${h * 0.85}" rx="${w * 0.36}" ry="${h * 0.17}" fill="url(#${pool})"/>`;

  // left wall + reveal
  b += `<rect x="0" y="0" width="${w * 0.3}" height="${h * 0.72}" fill="#131716"/>`;
  b += `<rect x="${w * 0.3}" y="0" width="${w * 0.03}" height="${h * 0.72}" fill="#1D2220"/>`;
  b += `<rect x="${(w * 0.33).toFixed(1)}" y="0" width="4" height="${h * 0.72}" fill="${C.copper2}" opacity="0.55"/>`;

  // pendants
  for (let i = 0; i < 3; i++) {
    const x = w * (0.37 + i * 0.07);
    const y = h * 0.3 + r() * h * 0.04;
    b += `<line x1="${x}" y1="0" x2="${x}" y2="${y}" stroke="#2A302D" stroke-width="2"/>`;
    b += `<circle cx="${x}" cy="${y}" r="${w * 0.007}" fill="${C.copper3}"/>`;
    b += `<circle cx="${x}" cy="${y}" r="${w * 0.032}" fill="${C.copper3}" opacity="0.13"/>`;
  }

  // table
  b += `<rect x="${w * 0.37}" y="${h * 0.6}" width="${w * 0.26}" height="${h * 0.045}" rx="3" fill="#090B0A"/>`;
  b += `<rect x="${w * 0.41}" y="${h * 0.645}" width="${w * 0.013}" height="${h * 0.11}" fill="#090B0A"/>`;
  b += `<rect x="${w * 0.58}" y="${h * 0.645}" width="${w * 0.013}" height="${h * 0.11}" fill="#090B0A"/>`;

  b += grainLayer(grain, w, h);
  b += vignette(d, w, h, 0.72);

  return wrap(w, h, d.render(), b);
}

/* ------------------------------------------------------- scene: construction -- */
function site({ w = 1600, h = 1200, seed = 9 } = {}) {
  const r = rng(seed);
  const d = new Defs();
  const grain = d.grain(1.0, 0.1);

  const bg = d.lin([
    [0, "#0E1411"],
    [1, "#060807"],
  ]);
  let b = `<rect width="${w}" height="${h}" fill="url(#${bg})"/>`;

  // backing slabs
  for (let i = 0; i < 5; i++)
    b += `<rect x="${(w * (0.05 + i * 0.19)).toFixed(1)}" y="${(h * (0.18 + r() * 0.3)).toFixed(
      1,
    )}" width="${(w * 0.16).toFixed(1)}" height="${(h * 0.44).toFixed(1)}" fill="#121614" opacity="0.75"/>`;

  // scaffold
  const cols = 9;
  const rows = 7;
  for (let i = 0; i <= cols; i++) {
    const x = w * 0.07 + (i * w * 0.87) / cols;
    b += `<rect x="${x.toFixed(1)}" y="${(h * 0.08).toFixed(1)}" width="7" height="${(h * 0.8).toFixed(1)}" fill="#2E352F"/>`;
  }
  for (let j = 0; j <= rows; j++) {
    const y = h * 0.08 + (j * h * 0.8) / rows;
    b += `<rect x="${(w * 0.07).toFixed(1)}" y="${y.toFixed(1)}" width="${(w * 0.87).toFixed(1)}" height="7" fill="#242A26"/>`;
    b += `<rect x="${(w * 0.07).toFixed(1)}" y="${y.toFixed(1)}" width="${(w * 0.87).toFixed(1)}" height="2" fill="${
      C.copper1
    }" opacity="0.22"/>`;
  }
  for (let i = 0; i < cols; i++) {
    const x1 = w * 0.07 + (i * w * 0.87) / cols;
    const x2 = w * 0.07 + ((i + 1) * w * 0.87) / cols;
    const y = h * 0.08 + (r() * rows * h * 0.8) / rows;
    b += `<line x1="${x1.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${(
      y +
      h * 0.11
    ).toFixed(1)}" stroke="#303834" stroke-width="6"/>`;
  }

  // work light
  const wl = d.rad(
    [
      [0, C.copper2, 0.42],
      [1, C.copper2, 0],
    ],
    "50%",
    "50%",
    "50%",
  );
  b += `<ellipse cx="${w * 0.79}" cy="${h * 0.64}" rx="${w * 0.42}" ry="${h * 0.42}" fill="url(#${wl})"/>`;

  // rebar foreground
  for (let i = 0; i < 18; i++) {
    const y = h * (0.85 + i * 0.0095);
    b += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${(y + (r() - 0.5) * 12).toFixed(1)}" stroke="${
      i % 3 ? "#252D32" : "#35424B"
    }" stroke-width="8" opacity="0.96"/>`;
  }

  b += grainLayer(grain, w, h);
  b += vignette(d, w, h, 0.76);

  return wrap(w, h, d.render(), b);
}

/* ----------------------------------------------------------------- emit ------ */
const jobs = [
  ["hero.svg", () => skyline({ w: 2400, h: 1500, seed: 21, glowX: 0.74, glowY: 0.2, crane: true, layers: 5 })],
  ["about.svg", () => site({ w: 1800, h: 1400, seed: 44 })],
  ["cta.svg", () =>
    skyline({ w: 2400, h: 1400, seed: 77, glowX: 0.5, glowY: 0.16, glowScale: 1.35, crane: true, layers: 3, groundY: 0.9 })],
  ["blueprint.svg", () => blueprint({ w: 1800, h: 1350, seed: 13 })],
  ["interior.svg", () => interior({ w: 1800, h: 1350, seed: 31 })],
  ["site.svg", () => site({ w: 1800, h: 1350, seed: 52 })],

  ["service-residential.svg", () =>
    skyline({ w: 1600, h: 1200, seed: 101, glowX: 0.3, glowY: 0.24, crane: false, layers: 3, horizon: 0.66, groundY: 0.82 })],
  ["service-commercial.svg", () =>
    skyline({ w: 1600, h: 1200, seed: 102, glowX: 0.8, glowY: 0.18, crane: true, layers: 4, horizon: 0.7, groundY: 0.86 })],
  ["service-renovation.svg", () => interior({ w: 1600, h: 1200, seed: 103 })],
  ["service-planning.svg", () => blueprint({ w: 1600, h: 1200, seed: 104 })],
  ["service-design3d.svg", () => blueprint({ w: 1600, h: 1200, seed: 105 })],
  ["service-structural.svg", () => material("steel", { w: 1600, h: 1200, seed: 106 })],

  ["project-01.svg", () =>
    skyline({ w: 1600, h: 2000, seed: 201, glowX: 0.62, glowY: 0.22, layers: 4, horizon: 0.62, groundY: 0.84, crane: false })],
  ["project-02.svg", () => interior({ w: 1600, h: 2000, seed: 202 })],
  ["project-03.svg", () => site({ w: 1600, h: 2000, seed: 203 })],
  ["project-04.svg", () =>
    skyline({ w: 1600, h: 2000, seed: 204, glowX: 0.24, glowY: 0.3, layers: 5, crane: true, horizon: 0.58, groundY: 0.88 })],
  ["project-05.svg", () => blueprint({ w: 1600, h: 2000, seed: 205 })],
  ["project-06.svg", () => interior({ w: 1600, h: 2000, seed: 206 })],

  ["material-brick.svg", () => material("brick", { seed: 301 })],
  ["material-concrete.svg", () => material("concrete", { seed: 302 })],
  ["material-steel.svg", () => material("steel", { seed: 303 })],
  ["material-wood.svg", () => material("wood", { seed: 304 })],
  ["material-finish.svg", () => material("finish", { seed: 305 })],
  ["material-detail.svg", () => material("detail", { seed: 306 })],
];

mkdirSync(OUT, { recursive: true });
for (const [name, fn] of jobs) writeFileSync(join(OUT, name), fn(), "utf8");
console.log(`Generated ${jobs.length} assets -> ${OUT}`);
console.log(readdirSync(OUT).sort().join("\n"));
