/**
 * ACADEMY DARK MODE — colour tokeniser and dark palette generator.
 *
 * The Academy stylesheets were written for a white page, with about a thousand
 * literal colours. Hand-writing a dark rule for each would double 16,000 lines
 * of CSS and rot the first time someone adds a rule. Instead every literal
 * colour that needs a dark counterpart is wrapped once, in place:
 *
 *     color: #b91c1c;   →   color: var(--acd-t-b91c1c, #b91c1c);
 *
 * The fallback IS the original colour, so light mode is unchanged by
 * construction. Dark mode defines --acd-* in academy-theme-dark.css, which
 * this script generates. Colours are mapped in OKLCH, by ROLE, because the same
 * hex means different things in different properties: #fff as a background is
 * a card (it goes dark), #fff as text sits on a coloured button (it stays).
 *
 *   b  background     light surfaces go dark; already-dark panels are kept
 *   t  text           dark ink goes light, keeping its hue; light text is kept
 *   l  border/shadow  light hairlines become dim hairlines
 *
 * A colour whose dark value equals itself (the typing arcade, the terminal
 * windows: dark on purpose) is left as a plain literal.
 *
 * The most common colours become the semantic tokens instead (#fff background
 * → var(--ac-surface), #e5e8f2 border → var(--ac-line) …), whose dark values
 * are chosen by hand in academy.css.
 *
 * A rule containing the comment  theme: fixed  is never touched (a sheet of
 * paper that must look like paper in both themes).
 *
 *   node scripts/academyTheme.mjs          check: exit 1 if anything is stale
 *   node scripts/academyTheme.mjs --write  tokenise and regenerate
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "src/academy");
const OUT = path.join(DIR, "academy-theme-dark.css");
const WRITE = process.argv.includes("--write");

const FILES = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".css") && f !== path.basename(OUT))
  .sort();

/* ── Colour maths: sRGB ⇄ OKLab ⇄ OKLCH ──────────────────────────────── */

const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function rgbToOklch([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => toLin(v / 255));
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, Bb);
  const H = ((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360;
  return [L, C, H];
}

function oklchToRgbRaw([L, C, H]) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** OKLCH → sRGB, reducing chroma until the colour is displayable. */
function oklchToRgb([L, C, H]) {
  let c = C;
  for (let i = 0; i < 40; i++) {
    const lin = oklchToRgbRaw([L, c, H]);
    if (lin.every((v) => v >= -1e-4 && v <= 1 + 1e-4)) {
      return lin.map((v) => Math.round(toGam(Math.min(1, Math.max(0, v))) * 255));
    }
    c *= 0.9;
  }
  return oklchToRgbRaw([L, 0, H]).map((v) => Math.round(toGam(Math.min(1, Math.max(0, v))) * 255));
}

const hex2 = (n) => n.toString(16).padStart(2, "0");
const rgbHex = (rgb) => `#${rgb.map(hex2).join("")}`;

/* ── The role mappings ───────────────────────────────────────────────── */

// Neutral greys in the light theme lean indigo; their dark twins do too, so
// every grey in the Academy reads as one family.
const NEUTRAL_HUE = 275;
const isNeutral = (C) => C < 0.03;

/** Background: light surfaces darken, filled tints stay a step lighter. */
function darkBg([L, C, H]) {
  if (L < 0.75) return null; // already a mid or dark colour: a button, a panel
  if (isNeutral(C)) {
    // White is a card. Anything greyer than white was a FILLED element (a
    // chip, a track, an inset), which on a dark page reads as raised: lighter.
    const Ld = L >= 0.985 ? 0.215 : Math.min(0.215 + (0.985 - L) * 1.6, 0.42);
    return [Ld, 0.032, NEUTRAL_HUE];
  }
  if (C < 0.07) {
    // Pastel status fills (#fef2f2, #dcfce7): a dark tint of the same hue.
    return [Math.min(0.25 + (0.985 - L) * 0.6, 0.34), Math.min(Math.max(C * 2.4, 0.035), 0.07), H];
  }
  // Saturated light fills (#fcd34d highlight): a deep version of the hue.
  return [0.37, Math.min(C * 0.6, 0.1), H];
}

/** Text: dark ink lightens, keeping its hue; light text is already right. */
function darkText([L, C, H]) {
  if (isNeutral(C)) {
    if (L >= 0.65) return null;
    return [0.965 - L * 0.42, 0.018, NEUTRAL_HUE];
  }
  if (L >= 0.74) return null;
  return [0.81, Math.min(C, 0.15), H];
}

/** Hairlines: light lines become dim lines. White "cut-outs" track the card. */
function darkLine(lch) {
  const [L, C, H] = lch;
  if (L >= 0.99) return darkBg(lch);
  if (L < 0.8) return null;
  return [0.27 + (1 - L) * 0.7, isNeutral(C) ? 0.03 : Math.min(C * 1.3, 0.12), isNeutral(C) ? NEUTRAL_HUE : H];
}

const MAP = { b: darkBg, t: darkText, l: darkLine };

function roleOf(prop, lch) {
  if (/^background/.test(prop)) return "b";
  if (/^(color|-webkit-text-fill-color|caret-color|text-decoration-color|text-emphasis-color)$/.test(prop)) return "t";
  if (/^(border|outline|box-shadow|column-rule|text-shadow)/.test(prop)) return "l";
  // An SVG fill can be an area (light → background) or a glyph (dark → text).
  if (prop === "fill") return lch[0] >= 0.75 ? "b" : "t";
  if (prop === "stroke") return lch[0] >= 0.75 ? "l" : "t";
  return null; // accent-color, scrollbar colours, custom properties
}

/* ── Semantic tokens: the common colours, chosen by hand ─────────────── */

const SEMANTIC = {
  b: { ffffff: "--ac-surface", f6f7fc: "--ac-tint", eef1ff: "--ac-primary-soft", e5e8f2: "--ac-line", eef0f7: "--ac-line-soft" },
  t: { "0d1130": "--ac-ink", "2a3050": "--ac-ink-2", "4c5370": "--ac-text", "7a819b": "--ac-muted" },
  l: { e5e8f2: "--ac-line", eef0f7: "--ac-line-soft" },
};

/** A semantic text token used as a BACKGROUND means a dark or brand fill. */
const FILL_TOKENS = ["ink", "ink-2", "primary", "primary-dark", "muted"];

/* ── Parsing colour literals inside a declaration value ──────────────── */

const COLOR_RE =
  /var\(--acd-[a-z]-[0-9a-f]+,\s*(?:[^()]|\([^()]*\))*?\)|url\([^)]*\)|#[0-9a-fA-F]{3,8}\b|rgba?\(\s*[\d.]+\s*,?\s*[\d.]+\s*,?\s*[\d.]+\s*(?:[,/]\s*[\d.]+%?\s*)?\)|\bwhite\b/g;

function parseColor(lit) {
  if (lit === "white") return { rgb: [255, 255, 255], a: 1 };
  if (lit[0] === "#") {
    let h = lit.slice(1).toLowerCase();
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    const n = [0, 2, 4, 6].map((i) => parseInt(h.slice(i, i + 2), 16));
    return { rgb: n.slice(0, 3), a: h.length === 8 ? n[3] / 255 : 1 };
  }
  const nums = lit.match(/[\d.]+%?/g).map((s) => (s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s)));
  return { rgb: nums.slice(0, 3).map(Math.round), a: nums[3] ?? 1 };
}

const keyOf = ({ rgb, a }) => rgb.map(hex2).join("") + (a < 1 ? hex2(Math.round(a * 255)) : "");

/** The dark value for a colour in a role, or null to leave it alone. */
function darkFor(role, color) {
  // Translucent white overlays sit on dark or coloured panels already, and
  // translucent ink is a shadow: neither should flip.
  if (color.a < (role === "t" ? 0.4 : 0.5)) return null;
  const lch = rgbToOklch(color.rgb);
  const mapped = MAP[role](lch);
  if (!mapped) return null;
  const rgb = oklchToRgb(mapped);
  if (rgbHex(rgb) === rgbHex(color.rgb)) return null;
  return color.a < 1 ? `rgba(${rgb.join(", ")}, ${+color.a.toFixed(3)})` : rgbHex(rgb);
}

/* ── Walk the stylesheets ────────────────────────────────────────────── */

const palette = new Map(); // --acd-name → dark value
let changedFiles = 0;
let wrapped = 0;
let semantic = 0;

const isFixed = (rule) => rule?.nodes?.some((n) => n.type === "comment" && /theme:\s*fixed/.test(n.text));
const inPrint = (node) => {
  for (let p = node.parent; p; p = p.parent) if (p.type === "atrule" && /print/.test(p.params)) return true;
  return false;
};

for (const file of FILES) {
  const full = path.join(DIR, file);
  const src = fs.readFileSync(full, "utf8");
  const root = postcss.parse(src, { from: full });

  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    if (prop.startsWith("--")) return;
    if (isFixed(decl.parent) || inPrint(decl)) return;

    let value = decl.value;

    // var(--ac-ink) as a background is a dark fill: it must not turn pale.
    if (/^background/.test(prop)) {
      value = value.replace(/var\(--ac-([a-z0-9-]+)\)/g, (m, name) =>
        FILL_TOKENS.includes(name) ? `var(--ac-${name}-fill)` : m
      );
    }

    value = value.replace(COLOR_RE, (lit) => {
      if (lit.startsWith("var(") || lit.startsWith("url(")) {
        // Already tokenised: re-register its dark value (the mapping may have
        // been tuned since), or a url() we never look inside.
        const m = lit.match(/^var\(--acd-([a-z])-([0-9a-f]+),\s*(.*)\)$/s);
        if (m) {
          const color = parseColor(m[3].trim());
          const dark = color && darkFor(m[1], color);
          if (dark) palette.set(`--acd-${m[1]}-${m[2]}`, dark);
          else return m[3].trim(); // no longer needs a dark twin
        }
        return lit;
      }
      const color = parseColor(lit);
      if (!color) return lit;
      const role = roleOf(prop, rgbToOklch(color.rgb));
      if (!role) return lit;
      const key = keyOf(color);
      const token = SEMANTIC[role]?.[key];
      if (token && color.a === 1) {
        semantic++;
        return `var(${token})`;
      }
      const dark = darkFor(role, color);
      if (!dark) return lit;
      const name = `--acd-${role}-${key}`;
      palette.set(name, dark);
      wrapped++;
      return `var(${name}, ${lit})`;
    });

    if (value !== decl.value) decl.value = value;
  });

  const out = root.toString();
  if (out !== src) {
    changedFiles++;
    if (WRITE) fs.writeFileSync(full, out);
    else console.log(`  untokenised colours in src/academy/${file}`);
  }
}

/* ── Emit the dark palette ───────────────────────────────────────────── */

const names = [...palette.keys()].sort();
const css = `/* GENERATED by scripts/academyTheme.mjs — do not edit by hand.
   Dark counterparts of the literal colours in the Academy stylesheets, mapped
   in OKLCH by role (b background · t text · l line). The hand-chosen semantic
   tokens (--ac-surface, --ac-ink …) live in academy.css. Run
   \`node scripts/academyTheme.mjs --write\` after changing any Academy CSS. */

@media screen {
  :root[data-ac-theme="dark"] .academy {
${names.map((n) => `    ${n}: ${palette.get(n)};`).join("\n")}
  }
}
`;

const stale = !fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== css;
if (WRITE) {
  if (stale) fs.writeFileSync(OUT, css);
  console.log(
    `academy theme: ${FILES.length} stylesheets, ${changedFiles} rewritten, ${wrapped} colours tokenised, ${semantic} mapped to semantic tokens, ${names.length} dark tokens`
  );
} else if (changedFiles || stale) {
  if (stale) console.log("  src/academy/academy-theme-dark.css is out of date");
  console.log("academy theme: FAIL — run `node scripts/academyTheme.mjs --write`");
  process.exit(1);
} else {
  console.log(`academy theme: ok (${names.length} dark tokens)`);
}
