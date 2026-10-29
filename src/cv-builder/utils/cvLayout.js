// ── CV LAYOUT MEASUREMENT (for print + PDF) ──
// How tall the CV really is and whether it's a sidebar (flex-row) template.
// Measured on an off-screen copy at A4 width, so it works even when the
// preview is hidden (e.g. the phone's Edit tab) or scaled down on screen.

// A4 page = 1123px at 96dpi; the buffer absorbs small font differences.
const PAGE = 1123;
const SINGLE_PAGE_BUFFER = 40;

function makeProbe(previewEl) {
  const probe = previewEl.cloneNode(true);
  Object.assign(probe.style, {
    position: "absolute",
    left: "-10000px",
    top: "0",
    width: "794px",
    minHeight: "0",
    height: "auto",
    transform: "none",
    margin: "0",
    visibility: "hidden",
    pointerEvents: "none",
  });
  document.body.appendChild(probe);
  return probe;
}

export function measureCvLayout(previewEl) {
  const probe = makeProbe(previewEl);
  const root = probe.firstElementChild;
  const height = root?.offsetHeight || probe.scrollHeight;
  const sidebar = !!root && getComputedStyle(root).display === "flex";
  probe.remove();
  return {
    height,
    sidebar,
    singlePage: height <= PAGE - SINGLE_PAGE_BUFFER,
    pages: Math.max(1, Math.ceil((height + SINGLE_PAGE_BUFFER) / PAGE)),
  };
}

// ── PAGINATION ──
// Browsers break pages wherever the content happens to reach the page end,
// which strands headings above their bullets and gives full-bleed pages no
// margins. Instead the pages are laid out by paginateInPlace:
//
//  - the CV is split into "atoms": the smallest pieces that should never be
//    cut (a bullet, a paragraph, a role/date line, a small kept section);
//  - an atom that would run into the bottom margin moves to the top margin of
//    the next page, pushed down by an empty spacer in front of it;
//  - short lines directly above it (a section heading, the job title and
//    company) move with it, but only up to MAX_CARRY px, so a long job still
//    splits between bullets and page 1 is not left half empty.
//
// Each sidebar column is its own flow, so both columns get the same margins.
// Pages print at @page margin 0: the margins are in the layout.
//
// It must run in the document that prints (the PDF server's page, the print
// frame), after fonts load: the app renders text a few pixels differently,
// enough to put a break in the wrong place. So the function is self-contained
// (no outside references) and is shipped into the PDF HTML as source text.
// Running it again first removes its previous spacers.

export function paginateInPlace(page, margin) {
  var PAGE = 1123;            // A4 height in CSS px at 96dpi
  var SINGLE_BUFFER = 40;     // absorbs small font differences on one page
  var ROW_ATOM_MAX = 260;     // a side-by-side row taller than this is a column layout
  var STICKY_MAX = 56;        // short lines that belong with what follows
  var STICKY_GAP = 28;        // ...when what follows starts this close below
  var MAX_CARRY = 170;        // most we pull back onto the next page with an atom
  var TALL_SHARE = 0.4;       // atoms taller than this share of a page may split
  var ATOM_TAGS = /^(LI|P|IMG|SVG|H[1-6]|TR|TABLE)$/i;
  var NOT_STICKY = /^(LI|P|IMG|SVG)$/i;

  if (!page || !page.firstElementChild) return { pages: 1, singlePage: true };
  var win = page.ownerDocument.defaultView;
  var root = page.firstElementChild;
  var css = function (el) { return win.getComputedStyle(el); };
  var setImportant = function (el, prop, value) {
    if (value == null) el.style.removeProperty(prop);
    else el.style.setProperty(prop, value, "important");
  };

  // Start clean, measured without the page-filling minimum height.
  page.querySelectorAll("[data-cv-page-break]").forEach(function (s) { s.remove(); });
  [page, root].forEach(function (el) {
    setImportant(el, "height", null);
    setImportant(el, "overflow", null);
    setImportant(el, "min-height", "0px");
  });

  var finish = function (pages) {
    var fill = pages > 1 ? "calc(" + pages * 297 + "mm - 1mm)" : null;
    [page, root].forEach(function (el) {
      setImportant(el, "min-height", fill);
      setImportant(el, "height", fill);
    });
    setImportant(page, "overflow", pages > 1 ? "hidden" : null);
    return { pages: pages, singlePage: pages === 1 };
  };

  if (root.offsetHeight <= PAGE - SINGLE_BUFFER) return finish(1);

  var usable = PAGE - 2 * margin;
  var flowChildren = function (el) {
    return Array.prototype.filter.call(el.children, function (c) {
      var s = css(c);
      return s.display !== "none" && s.position !== "absolute" && s.position !== "fixed";
    });
  };
  var isInline = function (c) {
    var d = css(c).display;
    return d === "inline" || d === "contents";
  };
  var isRow = function (s, kids) {
    if (kids.length < 2) return false;
    if (s.display.indexOf("flex") >= 0) return s.flexDirection.indexOf("column") !== 0;
    if (s.display.indexOf("grid") >= 0) return s.gridTemplateColumns.trim().split(/\s+/).length > 1;
    return false;
  };
  // A bullet drawn as a row: a marker ("▸", "•" or an empty dot) and its
  // text. Short like a heading, but it is content, not a heading.
  var isBulletRow = function (el, kids) {
    if (kids.length < 2) return false;
    var marker = kids[0].textContent.trim();
    return marker.length <= 2 && el.textContent.trim().length - marker.length > 40;
  };
  var extent = function (els) {
    var o = page.getBoundingClientRect().top;
    var top = Infinity, bottom = -Infinity;
    els.forEach(function (e) {
      var r = e.getBoundingClientRect();
      top = Math.min(top, r.top - o);
      bottom = Math.max(bottom, r.bottom - o);
    });
    return { top: top, bottom: bottom };
  };

  var atoms = [];
  var collect = function (el, flow) {
    var s = css(el);
    var h = el.getBoundingClientRect().height;
    if (!h) return;
    var kids = flowChildren(el);
    var wholeSection = el.classList.contains("cv-section-keep") && h <= usable * 0.5;
    var leaf = ATOM_TAGS.test(el.tagName) || !kids.length || kids.every(isInline) || wholeSection;
    if (leaf) {
      // A complete small section is content in its own right, not a heading.
      var sticky = h <= STICKY_MAX && !NOT_STICKY.test(el.tagName) && !wholeSection;
      atoms.push({ els: [el], flow: flow, sticky: sticky });
      return;
    }
    if (isRow(s, kids)) {
      if (h <= ROW_ATOM_MAX || s.flexWrap === "wrap") {
        atoms.push({ els: [el], flow: flow, sticky: h <= STICKY_MAX && !isBulletRow(el, kids) });
      } else {
        kids.forEach(function (c) { collect(c, c); }); // side-by-side columns
      }
      return;
    }
    // Blocks mixed with inline pieces (a company <span> between the title
    // and the bullets): each run of inline siblings shares its lines, so it
    // is one atom and moves as a whole.
    var run = [];
    var flush = function () {
      if (!run.length) return;
      var e = extent(run);
      atoms.push({ els: run, flow: flow, sticky: e.bottom - e.top <= STICKY_MAX });
      run = [];
    };
    kids.forEach(function (c) {
      if (isInline(c)) { run.push(c); return; }
      flush();
      collect(c, flow);
    });
    flush();
  };
  collect(root, root);

  // Move an atom down until its top sits at `target`, with an empty spacer in
  // front of it. (Not a margin: print drops margins that touch a page break.)
  // When the atom opens its entry (the title line of a job), the spacer goes
  // in front of the whole entry, so the entry's own decorations (a timeline
  // dot, a border) move with it. Re-measured each round because the spacer
  // stops the margins on either side of it collapsing into each other.
  var moveTo = function (atom, target) {
    var anchor = atom.els[0];
    while (anchor.parentElement && anchor.parentElement !== atom.flow
      && flowChildren(anchor.parentElement)[0] === anchor) {
      anchor = anchor.parentElement;
    }
    var spacer = page.ownerDocument.createElement("div");
    spacer.setAttribute("data-cv-page-break", "");
    spacer.style.cssText = "height:0;flex-shrink:0;margin:0;padding:0;";
    anchor.parentNode.insertBefore(spacer, anchor);
    var height = 0;
    for (var round = 0; round < 4; round++) {
      var dy = target - extent(atom.els).top;
      if (Math.abs(dy) < 0.5) return;
      height = Math.max(0, height + dy);
      spacer.style.height = height + "px";
    }
  };

  for (var i = 0; i < atoms.length; i++) {
    var b = extent(atoms[i].els);
    if (b.bottom - b.top > usable * TALL_SHARE) continue;
    var pageTop = Math.floor(b.top / PAGE) * PAGE;

    if (b.bottom > pageTop + PAGE - margin) {
      // Doesn't fit above the bottom margin: start the next page, bringing
      // the heading lines directly above along.
      var first = i;
      for (var j = i - 1; j >= 0; j--) {
        var a = atoms[j];
        if (a.flow !== atoms[i].flow || !a.sticky) break;
        var bj = extent(a.els);
        if (bj.top < pageTop) break;
        if (extent(atoms[j + 1].els).top - bj.bottom > STICKY_GAP) break;
        if (b.top - bj.top > MAX_CARRY) break;
        first = j;
      }
      moveTo(atoms[first], pageTop + PAGE + margin);
    } else if (pageTop > 0 && b.top < pageTop + margin) {
      // Starts inside the top margin of a later page.
      moveTo(atoms[i], pageTop + margin);
    }
  }

  // Count pages by where the last real content ends (template bottom padding
  // is not content), and hold the page to exactly that many A4 pages so the
  // padding can't spill a blank extra page.
  var contentBottom = 0;
  atoms.forEach(function (a) { contentBottom = Math.max(contentBottom, extent(a.els).bottom); });
  return finish(Math.max(1, Math.ceil(contentBottom / PAGE)));
}

// Page margin (px) for a CV's format: a little more than its own padding.
export function pageMarginFor(format) {
  return Math.max(36, (format?.pagePadding || 24) + 12);
}

// <script> for the PDF HTML: lays the pages out in the PDF server's own page
// once fonts are ready. The server calls window.__cvPaginate() again after it
// has loaded every font, so the final layout uses the final text metrics.
export function paginationScript(format) {
  return `<script>
(function () {
  var paginateInPlace = ${paginateInPlace.toString()};
  window.__cvPaginate = function () {
    return paginateInPlace(document.querySelector(".cv-preview__page"), ${pageMarginFor(format)});
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(window.__cvPaginate);
})();
</script>`;
}

// A minimal slice of the base reset (Tailwind preflight) the preview runs
// under, so print and PDF lay out like the on-screen preview.
export const PRINT_BASE_RESET = `
  *, *::before, *::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: currentColor; }
  html { line-height: 1.5; -webkit-text-size-adjust: 100%; }
  body { margin: 0; font-family: inherit; line-height: inherit; }
  h1, h2, h3, h4, h5, h6, p, blockquote, figure, hr, pre { margin: 0; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  ol, ul { list-style: none; margin: 0; padding: 0; }
  b, strong { font-weight: bolder; }
  img, svg { display: block; vertical-align: middle; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; text-indent: 0; border-color: inherit; }
  a { color: inherit; text-decoration: inherit; }
`;
