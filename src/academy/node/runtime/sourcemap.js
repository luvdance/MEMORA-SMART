/**
 * Positions in the learner's own code.
 *
 * ES modules and TypeScript files run after sucrase rewrites them (imports
 * become requires, types are removed). Lines stay where they were, but
 * columns can move, so an error's position would point at the wrong place
 * in the line. Sucrase's source map says where each piece came from; stack
 * traces and crash reports use it to show the position in the file as the
 * learner wrote it, as Node does.
 */

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const VALUE = new Map([...B64].map((c, i) => [c, i]));

function decodeVlq(segment) {
  const out = [];
  let value = 0;
  let shift = 0;
  for (const ch of segment) {
    const digit = VALUE.get(ch);
    value += (digit & 31) << shift;
    if (digit & 32) {
      shift += 5;
    } else {
      out.push(value & 1 ? -(value >>> 1) : value >>> 1);
      value = 0;
      shift = 0;
    }
  }
  return out;
}

/** mappings → per generated line (0-based), a list of [generatedColumn, sourceLine, sourceColumn]. */
export function decodeMappings(mappings) {
  const lines = [];
  let srcLine = 0;
  let srcCol = 0;
  let srcIdx = 0;
  for (const line of mappings.split(";")) {
    let genCol = 0;
    const segs = [];
    if (line) {
      for (const seg of line.split(",")) {
        const v = decodeVlq(seg);
        genCol += v[0];
        if (v.length >= 4) {
          srcIdx += v[1];
          srcLine += v[2];
          srcCol += v[3];
          segs.push([genCol, srcLine, srcCol]);
        }
      }
    }
    lines.push(segs);
  }
  void srcIdx;
  return lines;
}

/** Map a 1-based generated (line, column) to the original 1-based (line, column). */
export function originalPosition(decoded, line, column) {
  const segs = decoded[line - 1];
  if (!segs || !segs.length) return null;
  const col = column - 1;
  let best = null;
  for (const s of segs) {
    if (s[0] <= col) best = s;
    else break;
  }
  if (!best) best = segs[0];
  return { line: best[1] + 1, column: best[2] + (col - best[0]) + 1 };
}
