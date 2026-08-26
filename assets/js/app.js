/* =========================================================
   Darb Media — app.js
   Data-driven rendering for all pages (static, CMS-ready).
   ========================================================= */
(function () {
  "use strict";

  var D = window.DARB;
  if (!D) return;

  /* ---------------- helpers ---------------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function param(name) {
    return new URLSearchParams(location.search).get(name);
  }
  var AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  function arNum(n) {
    return String(n).replace(/\d/g, function (d) { return AR_DIGITS[+d]; });
  }
  var dateFmt;
  try {
    dateFmt = new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" });
  } catch (e) { dateFmt = null; }
  function fmtDate(iso) {
    var d = new Date(iso + "T12:00:00");
    if (dateFmt) return dateFmt.format(d);
    return iso;
  }
  function normAr(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[ً-ْٰـ]/g, "")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي").replace(/ئ/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ة/g, "ه");
  }
  /* deterministic tiny hash for pattern variation */
  function seed(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 997;
    return h;
  }

  /* ---------------- data access ---------------- */
  var progBySlug = {};
  D.programs.forEach(function (p) { progBySlug[p.slug] = p; });
  var epById = {};
  D.episodes.forEach(function (e) { epById[e.id] = e; });

  function progOf(ep) { return progBySlug[ep.program]; }
  function episodesOf(slug) {
    return D.episodes.filter(function (e) { return e.program === slug; });
  }
  function byDateDesc(a, b) { return a.date < b.date ? 1 : -1; }
  function byDateAsc(a, b) { return a.date > b.date ? 1 : -1; }
  function latest(n, excludeId) {
    return D.episodes
      .filter(function (e) { return e.id !== excludeId; })
      .sort(byDateDesc)
      .slice(0, n);
  }
  function epURL(ep) { return "episode.html?e=" + ep.id; }
  function progURL(p) { return "program.html?p=" + p.slug; }
  function shortLink(ep) {
    /* production: {origin}/e/{id} — emulated for static hosting */
    var base = location.origin === "null" || location.protocol === "file:"
      ? location.href.replace(/[^/\\]*$/, "")
      : location.origin + location.pathname.replace(/[^/]*$/, "");
    return base + "episode.html?e=" + ep.id;
  }

  /* content type per program (used by search filters) */
  var PROG_TYPE = {
    "ijaz": "نشرة",
    "shahadat": "وثائقي",
    "ala-aldarb": "بودكاست",
    "thakira": "وثائقي",
    "adasat-darb": "تقرير",
    "masarat": "وثائقي",
    "ala-alwaraq": "بودكاست",
  };

  /* ---------------- icons ---------------- */
  var SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">' +
    '<symbol id="i-play" viewBox="0 0 24 24"><path d="M7 4.8v14.4c0 .9 1 1.5 1.8 1L20.6 13a1.2 1.2 0 0 0 0-2L8.8 3.8c-.8-.5-1.8.1-1.8 1Z"/></symbol>' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></symbol>' +
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>' +
    '<symbol id="i-cal" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></symbol>' +
    '<symbol id="i-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5"/></symbol>' +
    '<symbol id="i-share" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.6"/><circle cx="17.5" cy="5.5" r="2.6"/><circle cx="17.5" cy="18.5" r="2.6"/><path d="m8.4 10.8 6.8-4M8.4 13.2l6.8 4"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24"><path d="m4.5 12.5 5 5L19.5 7"/></symbol>' +
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M20 12H4.5M11 5.5 4.5 12l6.5 6.5"/></symbol>' +
    '<symbol id="i-chev" viewBox="0 0 24 24"><path d="m8.5 5.5 7 6.5-7 6.5"/></symbol>' +
    '<symbol id="i-chev-d" viewBox="0 0 24 24"><path d="m5.5 9 6.5 6.5L18.5 9"/></symbol>' +
    '<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></symbol>' +
    '<symbol id="i-close" viewBox="0 0 24 24"><path d="m5.5 5.5 13 13m0-13-13 13"/></symbol>' +
    '<symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 6.5h16M7 12h10M10 17.5h4"/></symbol>' +
    '<symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></symbol>' +
    '<symbol id="i-telegram" viewBox="0 0 24 24"><path d="M21 4.5 3.6 11.2c-.9.35-.86 1.63.06 1.93l4.34 1.4 1.63 5.06c.28.87 1.4 1.05 1.94.32l2.4-3.24 4.53 3.32c.7.5 1.68.13 1.86-.72L23 5.9c.2-1-.8-1.8-2-1.4Z" transform="translate(-1.2 0)"/><path d="m8 14.5 9.5-8.5"/></symbol>' +
    '<symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none"/></symbol>' +
    '<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none"/></symbol>' +
    /* player set */
    '<symbol id="i-pause" viewBox="0 0 24 24"><rect x="6" y="4.5" width="4.2" height="15" rx="1.2"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"/></symbol>' +
    '<symbol id="i-next" viewBox="0 0 24 24"><path d="M5 5.6v12.8c0 .9 1 1.4 1.7 1L16 13.2V18a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v4.8L6.7 4.7C6 4.2 5 4.7 5 5.6Z" transform="scale(-1,1) translate(-24,0)"/></symbol>' +
    '<symbol id="i-b10" viewBox="0 0 24 24"><path d="M12 4.5a8 8 0 1 1-7.6 5.5"/><path d="M4 4.5v5h5"/><text x="12" y="15.5" text-anchor="middle" font-size="7.5" font-weight="700" fill="currentColor" stroke="none" font-family="inherit">10</text></symbol>' +
    '<symbol id="i-f10" viewBox="0 0 24 24"><path d="M12 4.5a8 8 0 1 0 7.6 5.5"/><path d="M20 4.5v5h-5"/><text x="12" y="15.5" text-anchor="middle" font-size="7.5" font-weight="700" fill="currentColor" stroke="none" font-family="inherit">10</text></symbol>' +
    '<symbol id="i-replay" viewBox="0 0 24 24"><path d="M12 5a7.5 7.5 0 1 1-7.2 5.2"/><path d="M4.5 3.5v5h5"/></symbol>' +
    '<symbol id="i-vol" viewBox="0 0 24 24"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" fill="currentColor" stroke="none"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.8a7.6 7.6 0 0 1 0 10.4"/></symbol>' +
    '<symbol id="i-vol-x" viewBox="0 0 24 24"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" fill="currentColor" stroke="none"/><path d="m15.5 9.5 5 5m0-5-5 5"/></symbol>' +
    '<symbol id="i-pip" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2"/><rect x="11.5" y="11.5" width="6.5" height="5" rx="1" fill="currentColor" stroke="none"/></symbol>' +
    '<symbol id="i-full" viewBox="0 0 24 24"><path d="M9 4.5H5.5a1 1 0 0 0-1 1V9M15 4.5h3.5a1 1 0 0 1 1 1V9M9 19.5H5.5a1 1 0 0 1-1-1V15M15 19.5h3.5a1 1 0 0 0 1-1V15"/></symbol>' +
    '<symbol id="i-full-x" viewBox="0 0 24 24"><path d="M9 4.5V8a1 1 0 0 1-1 1H4.5M15 4.5V8a1 1 0 0 0 1 1h3.5M9 19.5V16a1 1 0 0 0-1-1H4.5M15 19.5V16a1 1 0 0 1 1-1h3.5"/></symbol>' +
    '<symbol id="i-expand" viewBox="0 0 24 24"><path d="M14.5 4.5H19a.5.5 0 0 1 .5.5v4.5M9.5 19.5H5a.5.5 0 0 1-.5-.5v-4.5M19.5 4.5 13 11M4.5 19.5 11 13"/></symbol>' +
    "</svg>";
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#' + name + '"></use></svg>';
  }

  /* =========================================================
     Thumbnail generator — authored SVG posters per program
     (geometry + Arabic-Indic episode numeral; no external fonts)
     ========================================================= */
  var TONES = {
    deep: { bg: "#161D2F", bg2: "#1B2338", line: "#2A3450" },
    night: { bg: "#101624", bg2: "#161D2F", line: "#242E48" },
    brand: { bg: "#20283F", bg2: "#26304A", line: "#323E5E" },
  };
  var GOLD = "#FBC118";

  function motifSVG(motif, s, W, H, tone) {
    /* all geometry proportional to W/H so covers (800px) and thumbs (480px)
       carry the same visual density */
    var out = "";
    var i, x, y;
    if (motif === "bulletin") {
      /* breaking-news diagonal wedge + ticker lines */
      out += '<path d="M' + (W * 0.62) + ' 0 L' + W + " 0 L" + W + " " + H + " L" + (W * 0.5) + " " + H + ' Z" fill="' + tone.bg2 + '"/>';
      out += '<path d="M' + (W * 0.66) + " 0 L" + (W * 0.7) + " 0 L" + (W * 0.54) + " " + H + " L" + (W * 0.5) + " " + H + ' Z" fill="' + GOLD + '" opacity="0.92"/>';
      for (i = 0; i < 6; i++) {
        y = H - H * 0.09 - i * H * 0.045;
        var lw = W * (0.07 + ((s * (i + 3)) % 9) / 55);
        out += '<rect x="' + (W * 0.06) + '" y="' + y + '" width="' + lw + '" height="' + (H * 0.014) + '" rx="' + (H * 0.007) + '" fill="' + tone.line + '"/>';
      }
    } else if (motif === "network") {
      /* network of nodes and links */
      var pts = [];
      for (i = 0; i < 9; i++) {
        pts.push([
          W * (0.1 + ((s * (i + 2) * 13) % 74) / 92),
          H * (0.12 + ((s * (i + 5) * 7) % 68) / 92),
        ]);
      }
      var lw2 = Math.max(1.2, W * 0.0022);
      for (i = 0; i < pts.length - 1; i++) {
        out += '<line x1="' + pts[i][0] + '" y1="' + pts[i][1] + '" x2="' + pts[i + 1][0] + '" y2="' + pts[i + 1][1] + '" stroke="' + tone.line + '" stroke-width="' + lw2 + '"/>';
      }
      /* a few cross links for density */
      for (i = 0; i < 4; i++) {
        var a = pts[(s + i * 2) % pts.length], b2 = pts[(s + i * 5 + 3) % pts.length];
        out += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b2[0] + '" y2="' + b2[1] + '" stroke="' + tone.line + '" stroke-width="' + lw2 + '" opacity="0.6"/>';
      }
      for (i = 0; i < pts.length; i++) {
        var main = i === (s % pts.length);
        out += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + (main ? W * 0.013 : W * 0.006) + '" fill="' + (main ? GOLD : tone.bg) + '" stroke="' + (main ? "none" : tone.line) + '" stroke-width="' + lw2 + '"/>';
      }
    } else if (motif === "wave") {
      /* podcast soundwave: sinusoid + seeded jitter guarantees amplitude */
      var n = 30, bw = (W * 0.84) / n;
      for (i = 0; i < n; i++) {
        var amp = Math.abs(Math.sin(i * 0.82 + s * 0.7)) * 0.34 + 0.07;
        var jit = ((s * (i + 1)) % 13) / 100;
        var hh = H * (amp + jit);
        x = W * 0.08 + i * bw;
        var gold = i === (s % n);
        out += '<rect x="' + x + '" y="' + (H * 0.54 - hh / 2) + '" width="' + (bw * 0.44) + '" height="' + hh + '" rx="' + (bw * 0.22) + '" fill="' + (gold ? GOLD : tone.line) + '"/>';
      }
    } else if (motif === "halftone") {
      /* archival halftone field + gold frame corners */
      var cols = 12, rows = 7, gap = W * 0.052;
      var x0 = W * 0.3, y0 = H * 0.14;
      for (y = 0; y < rows; y++) {
        for (x = 0; x < cols; x++) {
          var rr = W * 0.0026 * (1 + ((x + y * 3 + s) % 5));
          out += '<circle cx="' + (x0 + x * gap) + '" cy="' + (y0 + y * gap) + '" r="' + rr + '" fill="' + tone.line + '"/>';
        }
      }
      var c = W * 0.045, m = W * 0.032, fw = Math.max(2, W * 0.005);
      out += '<path d="M' + m + " " + (m + c) + " V" + m + " H" + (m + c) + '" stroke="' + GOLD + '" stroke-width="' + fw + '" fill="none"/>';
      out += '<path d="M' + (W - m - c) + " " + (H - m) + " H" + (W - m) + " V" + (H - m - c) + '" stroke="' + GOLD + '" stroke-width="' + fw + '" fill="none"/>';
    } else if (motif === "lens") {
      /* camera viewfinder */
      var cx = W * 0.46, cy = H * 0.5, R = H * 0.36;
      var st = Math.max(1.4, W * 0.0028);
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" stroke="' + tone.line + '" stroke-width="' + st + '" fill="none"/>';
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * 0.62) + '" stroke="' + tone.line + '" stroke-width="' + st + '" fill="none"/>';
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * 0.2) + '" fill="' + tone.bg2 + '" stroke="' + tone.line + '" stroke-width="' + st + '"/>';
      out += '<line x1="' + (cx - R * 1.12) + '" y1="' + cy + '" x2="' + (cx - R * 0.72) + '" y2="' + cy + '" stroke="' + tone.line + '" stroke-width="' + st + '"/>';
      out += '<line x1="' + (cx + R * 0.72) + '" y1="' + cy + '" x2="' + (cx + R * 1.12) + '" y2="' + cy + '" stroke="' + tone.line + '" stroke-width="' + st + '"/>';
      out += '<circle cx="' + (cx + R * 0.3) + '" cy="' + (cy - R * 0.34) + '" r="' + (W * 0.009) + '" fill="' + GOLD + '"/>';
      var b = W * 0.032, mm = W * 0.026, vw2 = Math.max(1.6, W * 0.0032);
      out += '<path d="M' + mm + " " + (mm + b) + " V" + mm + " H" + (mm + b) + '" stroke="#fff" stroke-opacity="0.5" stroke-width="' + vw2 + '" fill="none"/>';
      out += '<path d="M' + (W - mm - b) + " " + mm + " H" + (W - mm) + " V" + (mm + b) + '" stroke="#fff" stroke-opacity="0.5" stroke-width="' + vw2 + '" fill="none"/>';
      out += '<path d="M' + mm + " " + (H - mm - b) + " V" + (H - mm) + " H" + (mm + b) + '" stroke="#fff" stroke-opacity="0.5" stroke-width="' + vw2 + '" fill="none"/>';
      out += '<path d="M' + (W - mm - b) + " " + (H - mm) + " H" + (W - mm) + " V" + (H - mm - b) + '" stroke="#fff" stroke-opacity="0.5" stroke-width="' + vw2 + '" fill="none"/>';
    } else if (motif === "map") {
      /* contour lines + a route with a gold waypoint */
      var lw3 = Math.max(1.1, W * 0.002);
      for (i = 0; i < 5; i++) {
        var yy = H * (0.2 + i * 0.14);
        var amp2 = H * (0.05 + ((s * (i + 2)) % 7) / 90);
        var d = "M0 " + yy;
        for (x = 1; x <= 8; x++) {
          d += " Q" + (W * (x - 0.5) / 8) + " " + (yy + (x % 2 ? -amp2 : amp2)) +
               " " + (W * x / 8) + " " + yy;
        }
        out += '<path d="' + d + '" stroke="' + tone.line + '" stroke-width="' + lw3 + '" fill="none" opacity="' + (0.5 + i * 0.1) + '"/>';
      }
      /* the route itself */
      var rx1 = W * 0.16, ry1 = H * 0.74, rx2 = W * 0.78, ry2 = H * 0.28;
      out += '<path d="M' + rx1 + " " + ry1 + " C" + (W * 0.34) + " " + (H * 0.52) +
             " " + (W * 0.52) + " " + (H * 0.66) + " " + rx2 + " " + ry2 +
             '" stroke="' + GOLD + '" stroke-width="' + (W * 0.005) + '" fill="none" stroke-dasharray="' + (W * 0.02) + " " + (W * 0.016) + '"/>';
      out += '<circle cx="' + rx1 + '" cy="' + ry1 + '" r="' + (W * 0.009) + '" fill="' + GOLD + '"/>';
      out += '<circle cx="' + rx2 + '" cy="' + ry2 + '" r="' + (W * 0.013) + '" fill="none" stroke="' + GOLD + '" stroke-width="' + (W * 0.005) + '"/>';
    } else if (motif === "column") {
      /* printed text columns — one gold rule marks the live line */
      var colW = W * 0.19, gap2 = W * 0.045, top = H * 0.16;
      for (var c2 = 0; c2 < 3; c2++) {
        var cx2 = W * 0.28 + c2 * (colW + gap2);
        var lines = 9;
        for (i = 0; i < lines; i++) {
          var yl = top + i * (H * 0.075);
          var frac = 0.55 + ((s * (i + c2 * 3 + 1)) % 45) / 100;
          out += '<rect x="' + cx2 + '" y="' + yl + '" width="' + (colW * frac) + '" height="' + (H * 0.016) + '" rx="' + (H * 0.008) + '" fill="' + tone.line + '"/>';
        }
      }
      var gy = top + (s % 8) * (H * 0.075);
      out += '<rect x="' + (W * 0.28) + '" y="' + gy + '" width="' + (colW * 0.8) + '" height="' + (H * 0.016) + '" rx="' + (H * 0.008) + '" fill="' + GOLD + '"/>';
      /* margin rule */
      out += '<line x1="' + (W * 0.22) + '" y1="' + (H * 0.12) + '" x2="' + (W * 0.22) + '" y2="' + (H * 0.88) + '" stroke="' + tone.bg2 + '" stroke-width="' + Math.max(1.4, W * 0.003) + '"/>';
    }
    return out;
  }

  /* posters are emitted as INLINE SVG (not <img src="data:">) so the page's
     webfont (Noto Kufi Arabic) shapes the big episode numerals.
     The archive is a vertical-video (Reels) library: 9:16 is the DEFAULT
     poster format. `wide` exists only for the few genuinely landscape
     surfaces (programme covers use coverSVG instead). */
  function thumbSVG(ep, big, wide, eager) {
    var p = progOf(ep) || D.programs[0];
    /* a real poster frame beats a drawn placeholder — use it when present.
       It ships inside a programme-tinted ground so a still-loading card is
       never a blank slab, fades in on decode, and carries a faint tone
       glaze that pulls the whole pool of stills toward the brand palette. */
    if (ep.video && ep.video.poster && !wide) {
      var t0 = TONES[p.tone] || TONES.deep;
      return (
        '<span class="pm pm-wrap" style="background:linear-gradient(165deg,' + t0.bg2 + " 0%," + t0.bg + ' 100%)">' +
        '<img class="pm-img" src="' + esc(ep.video.poster) + '" alt=""' +
        (eager ? ' fetchpriority="high"' : ' loading="lazy"') +
        ' decoding="async" onload="this.classList.add(&quot;ok&quot;)">' +
        '<span class="pm-glaze" style="background:' + t0.bg2 + '" aria-hidden="true"></span>' +
        "</span>"
      );
    }
    var tone = TONES[p.tone] || TONES.deep;
    var W, H;
    if (wide) { W = big ? 800 : 480; H = Math.round(W * 9 / 16); }
    else { W = big ? 720 : 480; H = Math.round(W * 16 / 9); }
    var s = seed(ep.id);
    var num = arNum(ep.no);
    var numSize = wide ? (big ? 210 : 138) : (big ? 220 : 160);
    /* unique ids so multiple posters on one page keep their own defs */
    var gid = "g" + s + "_" + Math.abs(seed(ep.slug));
    return (
      '<svg class="pm" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      "<defs>" +
      '<linearGradient id="bg' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + tone.bg2 + '"/>' +
      '<stop offset="1" stop-color="' + tone.bg + '"/>' +
      "</linearGradient>" +
      '<radialGradient id="vg' + gid + '" cx="0.5" cy="0.42" r="0.78">' +
      '<stop offset="0.45" stop-color="#000" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity="0.42"/>' +
      "</radialGradient>" +
      "</defs>" +
      '<rect width="' + W + '" height="' + H + '" fill="url(#bg' + gid + ')"/>' +
      motifSVG(p.motif, s, W, H, tone) +
      /* outline numeral, part of the artwork — bottom-start on portrait, where
         there is real vertical room; the wide variant keeps the old placement */
      (wide
        ? (big
            ? '<text x="30" y="' + (H - 26) + '" text-anchor="start" '
            : '<text x="' + (W - 30) + '" y="' + (H - 26) + '" text-anchor="end" ')
        /* portrait: sits above the duration chip, clear of the frame edge */
        : '<text x="' + (W - 34) + '" y="' + (H - 120) + '" text-anchor="end" ') +
      'font-family="\'Noto Kufi Arabic\', \'IBM Plex Sans Arabic\', \'Segoe UI\', Tahoma, sans-serif" font-weight="800" ' +
      'font-size="' + numSize + '" ' +
      'fill="#FFFFFF" fill-opacity="0.07" stroke="#FFFFFF" stroke-opacity="0.32" stroke-width="' + Math.max(1.6, W * 0.0034) + '"' +
      ">" + num + "</text>" +
      /* vignette last so it settles over the whole composition */
      '<rect width="' + W + '" height="' + H + '" fill="url(#vg' + gid + ')"/>' +
      "</svg>"
    );
  }

  function coverSVG(p, big) {
    var tone = TONES[p.tone] || TONES.deep;
    var W = big ? 800 : 640, H = Math.round(W * 9 / 16);
    var s = seed(p.slug);
    return (
      '<svg class="pm" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<rect width="' + W + '" height="' + H + '" fill="' + tone.bg + '"/>' +
      motifSVG(p.motif, s, W, H, tone) +
      '<rect x="0" y="' + (H - 6) + '" width="' + W * 0.38 + '" height="6" fill="' + GOLD + '"/>' +
      "</svg>"
    );
  }

  /* =========================================================
     Header / footer
     ========================================================= */
  var NAV = [
    { href: "index.html", label: "الرئيسية", latin: "Home", key: "home" },
    { href: "reels.html", label: "ريلز", latin: "Reels", key: "reels" },
    { href: "programs.html", label: "البرامج", latin: "Programs", key: "programs" },
    { href: "episodes.html", label: "الحلقات", latin: "Episodes", key: "episodes" },
    { href: "about.html", label: "عن درب ميديا", latin: "About", key: "about" },
  ];

  function renderHeader() {
    var page = document.body.getAttribute("data-page");
    var darkTop = document.body.getAttribute("data-header") === "dark";
    var mount = $("#hdr");
    if (!mount) return;

    var links = NAV.map(function (n) {
      var active = n.key === page || (n.key === "programs" && page === "program") ||
                   (n.key === "episodes" && page === "episode");
      return '<a href="' + n.href + '"' + (active ? ' aria-current="page"' : "") + ">" + n.label + "</a>";
    }).join("");

    mount.innerHTML =
      '<header class="site-header' + (darkTop ? " over-dark" : " is-scrolled") + '" id="siteHeader">' +
      '<div class="container">' +
      '<a class="brand" href="index.html" aria-label="درب ميديا — الرئيسية">' +
      '<img class="brand-dark" src="assets/img/logo.png" alt="درب ميديا">' +
      '<img class="brand-light" src="assets/img/logo-dark.png" alt="درب ميديا">' +
      "</a>" +
      '<nav class="main-nav" aria-label="التنقل الرئيسي">' + links + "</nav>" +
      '<div class="hdr-actions">' +
      '<a class="hdr-search" href="search.html">' + icon("i-search", "icon--s") + '<span class="hdr-search-label">بحث</span></a>' +
      '<button class="menu-btn" id="menuBtn" aria-label="القائمة" aria-expanded="false">' + icon("i-menu") + "</button>" +
      "</div></div></header>" +
      /* mobile sheet */
      '<div class="nav-sheet" id="navSheet" role="dialog" aria-modal="true" aria-label="القائمة">' +
      '<div class="nav-sheet-top">' +
      '<img src="assets/img/logo-dark.png" alt="درب ميديا">' +
      '<button class="nav-sheet-close" id="navClose" aria-label="إغلاق القائمة">' + icon("i-close") + "</button>" +
      "</div><nav>" +
      NAV.map(function (n, i) {
        var active = n.key === page;
        return '<a href="' + n.href + '"' + (active ? ' aria-current="page"' : "") +
          ' style="transition-delay:' + (60 + i * 45) + 'ms">' + n.label +
          '<span class="nav-latin">' + n.latin + "</span></a>";
      }).join("") +
      '<a href="search.html" style="transition-delay:' + (60 + NAV.length * 45) + 'ms">بحث<span class="nav-latin">Search</span></a>' +
      "</nav>" +
      '<div class="nav-sheet-foot">' +
      '<a class="social-btn" href="' + D.site.telegram + '" target="_blank" rel="noopener" aria-label="تيليجرام">' + icon("i-telegram") + "</a>" +
      '<a class="social-btn" href="' + D.site.instagram + '" target="_blank" rel="noopener" aria-label="إنستغرام">' + icon("i-instagram") + "</a>" +
      "</div></div>";

    /* scroll state */
    var header = $("#siteHeader");
    if (darkTop) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 30);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* mobile sheet */
    var sheet = $("#navSheet"), btn = $("#menuBtn");
    function setNav(open) {
      sheet.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.documentElement.style.overflow = open ? "hidden" : "";
    }
    btn.addEventListener("click", function () { setNav(true); });
    $("#navClose").addEventListener("click", function () { setNav(false); });
    sheet.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
  }

  function renderFooter() {
    var mount = $("#ftr");
    if (!mount) return;
    var year = new Date().getFullYear();
    /* Colophon, not a second brand moment: the statement above owns the voice.
       The footer's own signature is the giant outline wordmark cropped by the
       page edge — same lettering language as the poster numerals. */
    var firstYear = D.episodes.map(function (e) { return e.date.slice(0, 4); }).sort()[0];
    mount.innerHTML =
      '<footer class="site-footer">' +
      '<div class="container footer-inner">' +
      '<div class="footer-grid">' +
      '<div class="footer-brand">' +
      '<img src="assets/img/logo-dark.png" alt="درب ميديا">' +
      /* not site.description — the statement right above already says that */
      "<p>الجديد يصل قناتنا على تيليجرام أولًا، ثم يستقر هنا في الأرشيف — لكل حلقة صفحة ثابتة ورابط قصير يبقى صالحًا.</p>" +
      "</div>" +
      '<div class="footer-col"><h4>تصفّح</h4><ul>' +
      '<li><a href="index.html">الرئيسية</a></li>' +
      '<li><a href="programs.html">البرامج</a></li>' +
      '<li><a href="episodes.html">الحلقات</a></li>' +
      '<li><a href="search.html">بحث</a></li>' +
      '<li><a href="about.html">عن درب ميديا</a></li>' +
      "</ul></div>" +
      '<div class="footer-col"><h4>البرامج</h4><ul>' +
      D.programs.map(function (p) {
        return '<li><a href="' + progURL(p) + '">' + esc(p.title) + "</a></li>";
      }).join("") +
      "</ul></div>" +
      '<div class="footer-col"><h4>تواصل</h4><ul>' +
      '<li><a href="' + D.site.telegram + '" target="_blank" rel="noopener">' + icon("i-telegram", "icon--s") + "تيليجرام</a></li>" +
      '<li><a href="' + D.site.instagram + '" target="_blank" rel="noopener">' + icon("i-instagram", "icon--s") + "إنستغرام</a></li>" +
      "</ul>" +
      '<div class="footer-stats">' +
      '<span class="fs-num">' + arNum(D.programs.length) + "</span> برامج" +
      '<span class="fs-sep"></span>' +
      '<span class="fs-num">' + arNum(D.episodes.length) + "</span> حلقة" +
      '<span class="fs-sep"></span>' +
      "أرشيف مفتوح منذ " + arNum(firstYear) +
      "</div></div>" +
      "</div>" +
      '<div class="footer-bottom">' +
      "<span>© " + arNum(year) + " درب ميديا — جميع الحقوق محفوظة</span>" +
      '<span class="footer-note">منصة إعلامية عربية مستقلة</span>' +
      "</div></div>" +
      '<div class="footer-wordmark" aria-hidden="true">درب ميديا</div>' +
      "</footer>";
  }

  /* =========================================================
     Cards
     ========================================================= */
  /* ReelCard — the vertical-video primitive. The 9:16 thumbnail is the card;
     a restrained overlay carries the programme label (top) and duration
     (bottom), play appears on hover. Title + meta sit below, quiet. */
  function epCard(ep, eager) {
    var p = progOf(ep);
    return (
      '<article class="reel">' +
      '<a href="' + epURL(ep) + '" aria-label="' + esc(ep.title) + '">' +
      '<div class="reel-media">' +
      thumbSVG(ep, false, false, eager) +
      '<span class="reel-prog">' + esc(p.title) + "</span>" +
      '<span class="reel-no">' + arNum(ep.no) + "</span>" +
      '<button type="button" class="reel-play" data-reel="' + ep.id + '" aria-label="تشغيل في وضع الريلز: ' + esc(ep.title) + '">' + icon("i-play", "icon--fill") + "</button>" +
      '<span class="reel-dur"><span class="ltr-num">' + esc(ep.duration) + "</span></span>" +
      "</div>" +
      '<div class="reel-body">' +
      '<h3 class="reel-title">' + esc(ep.title) + "</h3>" +
      '<div class="reel-meta">' + fmtDate(ep.date) + "</div>" +
      "</div></a></article>"
    );
  }

  /* Archive picks: a larger featured reel beside supporting ones — both keep
     the native 9:16 frame, the lead is simply given more room. */
  function pickLead(ep) {
    var p = progOf(ep);
    return (
      '<article class="reel pick-lead">' +
      '<a href="' + epURL(ep) + '">' +
      '<div class="reel-media">' +
      thumbSVG(ep, true, false, true) +
      '<span class="reel-prog">' + esc(p.title) + "</span>" +
      '<span class="reel-year">' + arNum(ep.date.slice(0, 4)) + "</span>" +
      '<button type="button" class="reel-play" data-reel="' + ep.id + '" aria-label="تشغيل في وضع الريلز: ' + esc(ep.title) + '">' + icon("i-play", "icon--fill") + "</button>" +
      '<span class="reel-dur"><span class="ltr-num">' + esc(ep.duration) + "</span></span>" +
      "</div>" +
      '<div class="reel-body">' +
      '<h3 class="reel-title">' + esc(ep.title) + "</h3>" +
      '<p class="pick-desc">' + esc(ep.description) + "</p>" +
      '<div class="reel-meta">' + fmtDate(ep.date) + "</div>" +
      "</div></a></article>"
    );
  }

  function pickRow(ep) {
    var p = progOf(ep);
    return (
      '<article class="reel pick-row">' +
      '<a href="' + epURL(ep) + '">' +
      '<div class="reel-media">' +
      thumbSVG(ep) +
      '<span class="reel-year">' + arNum(ep.date.slice(0, 4)) + "</span>" +
      '<button type="button" class="reel-play" data-reel="' + ep.id + '" aria-label="تشغيل في وضع الريلز: ' + esc(ep.title) + '">' + icon("i-play", "icon--fill") + "</button>" +
      "</div>" +
      '<div class="reel-body">' +
      '<h3 class="reel-title">' + esc(ep.title) + "</h3>" +
      '<div class="reel-meta">' + esc(p.title) + " · " + arNum(ep.date.slice(0, 4)) + "</div>" +
      "</div></a></article>"
    );
  }

  /* Homepage programme index: a typographic line-up, not a stack of cards.
     The artwork bleeds in from the inline-end edge and opens on hover, so the
     programme name stays the loudest thing in the row. */
  function progRow(p) {
    var eps = episodesOf(p.slug);
    var latest3 = eps.slice().sort(byDateDesc).slice(0, 3);
    var lead = latest3[0];
    return (
      '<a class="pgm" href="' + progURL(p) + '">' +
      '<span class="pgm-art" aria-hidden="true">' + coverSVG(p, true) + "</span>" +
      '<span class="pgm-rule" aria-hidden="true"></span>' +
      '<span class="pgm-main">' +
      '<span class="pgm-name">' + esc(p.title) + "</span>" +
      '<span class="pgm-tag">' + esc(p.tagline) + "</span>" +
      "</span>" +
      /* the lead row's extra width carries its newest episode by name */
      (lead
        ? '<span class="pgm-latest"><span class="pgm-latest-k">أحدث حلقة</span><span class="pgm-latest-t">' + esc(lead.title) + "</span></span>"
        : "") +
      /* three newest stills — the programme's actual face, not an abstract */
      '<span class="pgm-strip" aria-hidden="true">' +
      latest3.map(function (x) { return '<span class="pgm-mini">' + thumbSVG(x) + "</span>"; }).join("") +
      "</span>" +
      '<span class="pgm-meta">' +
      '<span class="pgm-count">' + arNum(eps.length) + " حلقة</span>" +
      '<span class="pgm-go">' + icon("i-arrow", "icon--s") + "</span>" +
      "</span></a>"
    );
  }

  function progCard(p, lead) {
    var eps = episodesOf(p.slug);
    var latest3 = eps.slice().sort(byDateDesc).slice(0, 3);
    return (
      '<a class="prog-card' + (lead ? " prog-card--lead" : "") + '" href="' + progURL(p) + '">' +
      '<div class="prog-cover">' + coverSVG(p, lead) + "</div>" +
      '<div class="prog-body">' +
      "<h3>" + esc(p.title) + "</h3>" +
      '<div class="prog-tag">' + esc(p.tagline) + "</div>" +
      '<p class="prog-desc">' + esc(p.description) + "</p>" +
      '<span class="prog-strip" aria-hidden="true">' +
      latest3.map(function (x) { return '<span class="prog-mini">' + thumbSVG(x) + "</span>"; }).join("") +
      "</span>" +
      "</div>" +
      /* count and CTA are support, never rivals to the programme identity */
      '<div class="prog-side">' +
      '<div class="prog-count"><b>' + arNum(eps.length) + "</b> حلقة</div>" +
      '<span class="prog-cta">مشاهدة البرنامج' + icon("i-arrow", "icon--s") + "</span>" +
      "</div></a>"
    );
  }

  /* =========================================================
     Toast + copy + share
     ========================================================= */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = icon("i-check") + esc(msg);
    requestAnimationFrame(function () { toastEl.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }

  function copyText(text, okMsg) {
    function done() { toast(okMsg || "تم نسخ الرابط"); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("تعذّر النسخ"); }
      document.body.removeChild(ta);
    }
  }

  /* Shared playback mount — used by the homepage hero and the episode page.
     mp4 sources get the full DarbPlayer (custom controls, floating dock,
     shortcuts, resume); YouTube/Telegram embeds keep their own chrome.
     Returns true when something was mounted. */
  function mountPlayback(container, ep, autoplay) {
    var v = ep.video || {};
    if (!v.type || !v.src) return false;

    if (v.type === "mp4" && window.DarbPlayer) {
      var p = progOf(ep);
      var progEps = episodesOf(p.slug).sort(function (a, b) { return a.no - b.no; });
      var next = progEps.filter(function (x) { return x.no === ep.no + 1; })[0];
      var player = new DarbPlayer(container, {
        src: v.src,
        poster: v.poster || "",
        title: ep.title,
        storageKey: ep.id,
        next: next ? { title: next.title, href: epURL(next) } : null,
      });
      if (autoplay) player.play();
      container._darbPlayer = player;
      return true;
    }

    var frame = "";
    if (v.type === "youtube") {
      frame = '<iframe class="player-frame" src="https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(v.src) + "?autoplay=" + (autoplay ? 1 : 0) + '&rel=0" title="' + esc(ep.title) +
        '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    } else if (v.type === "mp4") {
      frame = '<video class="player-frame" src="' + esc(v.src) + '" controls ' + (autoplay ? "autoplay " : "") + "playsinline></video>";
    } else if (v.type === "telegram") {
      frame = '<iframe class="player-frame" src="https://t.me/' + esc(v.src) +
        '?embed=1&mode=tme" title="' + esc(ep.title) + '"></iframe>';
    }
    if (!frame) return false;
    container.innerHTML = frame;
    return true;
  }

  function shareEp(ep) {
    var url = shortLink(ep);
    if (navigator.share) {
      navigator.share({ title: ep.title, text: ep.title + " — درب ميديا", url: url }).catch(function () {});
    } else {
      copyText(url);
    }
  }

  /* =========================================================
     Reveal on scroll
     ========================================================= */
  function initReveal() {
    var els = $$(".rv");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* =========================================================
     Page: home
     ========================================================= */
  function pageHome() {
    var featured = epById[D.featured] || D.episodes.slice().sort(byDateDesc)[0];

    /* stage — a full three-part composition: featured Reel (inline-start),
       episode information (centre), latest-clips rail (inline-end).
       No empty regions: every column earns its width. */
    var stage = $("#heroStage");

    function heroRailHTML(exclude) {
      var items = latest(4, exclude.id);
      return (
        '<aside class="hero-rail" aria-label="أحدث المقاطع">' +
        '<div class="hero-rail-head">أحدث المقاطع</div>' +
        items.map(function (x) {
          var xp = progOf(x);
          return (
            '<a class="hr-item" href="' + epURL(x) + '">' +
            '<span class="hr-thumb">' + thumbSVG(x, false, false, true) + "</span>" +
            '<span class="hr-body">' +
            '<span class="hr-title">' + esc(x.title) + "</span>" +
            '<span class="hr-meta">' + esc(xp.title) + ' · <span class="ltr-num">' + esc(x.duration) + "</span></span>" +
            "</span></a>"
          );
        }).join("") +
        "</aside>"
      );
    }

    function stageHTML(ep) {
      var p = progOf(ep);
      return (
        '<div class="stage-media" id="stageMedia">' +
        thumbSVG(ep, true, false, true) +
        '<div class="stage-scrim"></div>' +
        '<span class="stage-badge">' + icon("i-play", "icon--fill icon--s") + "ريلز</span>" +
        '<button class="stage-play" data-hero-play="' + ep.id + '" aria-label="تشغيل: ' + esc(ep.title) + '">' +
        '<span class="play-disc">' + icon("i-play", "icon--fill") + "</span></button>" +
        '<span class="stage-dur"><span class="ltr-num">' + esc(ep.duration) + "</span></span>" +
        '<div class="stage-note" id="stageNote">' + icon("i-info") +
        "<span>لم يُربط مصدر الفيديو لهذه الحلقة بعد.</span></div>" +
        "</div>" +
        '<div class="stage-info">' +
        '<a class="stage-program" href="' + progURL(p) + '">' + icon("i-play", "icon--fill") + esc(p.title) + "</a>" +
        '<h1 class="stage-title"><a href="' + epURL(ep) + '">' + esc(ep.title) + "</a></h1>" +
        '<p class="stage-desc">' + esc(ep.description) + "</p>" +
        '<div class="stage-meta"><span>' + fmtDate(ep.date) + '</span><span class="meta-dot">·</span><span class="ltr-num">' + esc(ep.duration) + "</span></div>" +
        '<div class="stage-actions">' +
        '<a class="btn btn--gold btn--hero" href="' + epURL(ep) + '">' + icon("i-play", "icon--fill") + "شاهد الفيديو</a>" +
        '<button class="btn btn--ghost btn--s" data-copy="' + ep.id + '">' + icon("i-copy") + "نسخ الرابط</button>" +
        "</div></div>" +
        heroRailHTML(ep)
      );
    }

    var playingInline = false;

    function destroyStagePlayer() {
      var media = $("#stageMedia");
      if (media && media._darbPlayer) {
        media._darbPlayer.destroy();
        media._darbPlayer = null;
      }
    }

    function renderStage(ep, animate) {
      destroyStagePlayer();
      stage.classList.remove("is-playing");
      playingInline = false;
      if (!animate) {
        stage.innerHTML = stageHTML(ep);
        return;
      }
      stage.classList.add("is-swapping");
      setTimeout(function () {
        stage.innerHTML = stageHTML(ep);
        stage.classList.remove("is-swapping");
      }, 260);
    }

    /* play the featured reel inline, right in the hero stage */
    stage.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-hero-play]");
      if (!btn) return;
      var ep = epById[btn.getAttribute("data-hero-play")];
      if (!ep) return;
      playingInline = true;    // never yank a playing video away
      stage.classList.add("is-playing");
      var ok = mountPlayback($("#stageMedia"), ep, true);
      if (!ok) {
        playingInline = false;
        stage.classList.remove("is-playing");
        var note = $("#stageNote");
        if (note) {
          note.classList.add("show");
          clearTimeout(note._t);
          note._t = setTimeout(function () { note.classList.remove("show"); }, 3600);
        }
      }
    });

    renderStage(featured, false);

    /* latest */
    var latestEps = D.episodes.slice().sort(byDateDesc).slice(0, 8);
    $("#latestGrid").innerHTML = latestEps.map(function (ep, i) {
      return epCard(ep, i < 4);   /* first row rides the initial paint */
    }).join("");
    $("#latestCount").textContent = arNum(D.episodes.length) + " حلقة في الأرشيف";

    /* programs — the full line-up reads as an index, so it stays light enough
       to show every programme without swallowing the page's rhythm */
    $("#programsList").innerHTML = D.programs.map(progRow).join("");
    var progMore = $("#programsMore");
    if (progMore) progMore.textContent = "صفحة البرامج";

    /* discover gateway: quick routes into the archive */
    var chipsEl = $("#discoverChips");
    if (chipsEl) {
      chipsEl.innerHTML =
        '<a class="d-chip is-all" href="episodes.html">الكل</a>' +
        D.programs.map(function (pr) {
          return '<a class="d-chip" href="' + progURL(pr) + '">' + esc(pr.title) + "</a>";
        }).join("") +
        '<span class="d-chip-sep" aria-hidden="true"></span>' +
        '<a class="d-chip d-chip--sort" href="episodes.html?sort=new">الأحدث</a>' +
        '<a class="d-chip d-chip--sort" href="episodes.html?sort=old">الأقدم</a>';
      var sub = $("#discoverSub");
      if (sub) sub.textContent = "ابحث في مكتبة درب ميديا — " + arNum(D.episodes.length) + " حلقة عبر " + arNum(D.programs.length) + " برامج";
    }

    /* archive picks: one featured lead + compact rows */
    var picks = (D.picks || []).map(function (id) { return epById[id]; }).filter(Boolean);
    if (picks.length) {
      $("#pickLead").innerHTML = pickLead(picks[0]);
      $("#pickRows").innerHTML = picks.slice(1, 5).map(pickRow).join("");
    }
  }

  /* =========================================================
     Page: programs
     ========================================================= */
  function pagePrograms() {
    /* the deepest programme leads the line-up */
    var ordered = D.programs.slice().sort(function (a, b) {
      return episodesOf(b.slug).length - episodesOf(a.slug).length;
    });
    $("#programsList").innerHTML = ordered.map(function (p, i) {
      return progCard(p, i === 0);
    }).join("");
    $("#progCount").textContent =
      arNum(D.programs.length) + " برامج — " + arNum(D.episodes.length) + " حلقة";
  }

  /* =========================================================
     Page: program
     ========================================================= */
  function pageProgram() {
    var slug = param("p");
    var p = progBySlug[slug];
    var hero = $("#progHero"), listEl = $("#progEpisodes");
    if (!p) {
      hero.innerHTML =
        '<div class="container"><div class="crumb"><a href="programs.html">البرامج</a>' + icon("i-arrow", "icon--s") + "<span>غير موجود</span></div>" +
        "<h1>هذا البرنامج غير موجود</h1>" +
        '<p class="prog-about">ربما تغيّر الرابط — تصفّح قائمة البرامج الكاملة.</p>' +
        '<div style="margin-block-start:24px"><a class="btn btn--gold" href="programs.html">كل البرامج</a></div></div>';
      return;
    }
    document.title = p.title + " — درب ميديا";

    var eps = episodesOf(p.slug);
    var lastDate = eps.slice().sort(byDateDesc)[0];

    hero.innerHTML =
      '<div class="container"><div class="prog-hero-grid"><div>' +
      '<div class="crumb"><a href="programs.html">البرامج</a>' + icon("i-arrow", "icon--s") + "<span>" + esc(p.title) + "</span></div>" +
      "<h1>" + esc(p.title) + "</h1>" +
      '<div class="prog-tagline">' + esc(p.tagline) + "</div>" +
      '<p class="prog-about">' + esc(p.description) + "</p>" +
      '<div class="page-meta">' +
      "<span>" + arNum(eps.length) + " حلقات</span>" +
      (lastDate ? '<span class="meta-dot">·</span><span>آخر تحديث: ' + fmtDate(lastDate.date) + "</span>" : "") +
      "</div></div>" +
      '<div class="prog-hero-cover">' + coverSVG(p, true) + "</div>" +
      "</div></div>";

    var sort = "new";
    function renderList() {
      var sorted = eps.slice().sort(sort === "new" ? byDateDesc : byDateAsc);
      listEl.innerHTML = sorted.map(function (ep, i) {
        return epCard(ep, i < 8);
      }).join("");
      initReveal();
    }
    $("#epCount").textContent = arNum(eps.length) + " حلقة";
    $$("#sortSeg button").forEach(function (b) {
      b.addEventListener("click", function () {
        sort = b.getAttribute("data-sort");
        $$("#sortSeg button").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        renderList();
      });
    });
    renderList();
  }

  /* =========================================================
     Page: episodes (archive + filters)
     ========================================================= */
  function pageEpisodes() {
    var grid = $("#epGrid"), countEl = $("#resCount"), emptyEl = $("#emptyState");
    var years = Array.from(new Set(D.episodes.map(function (e) { return e.date.slice(0, 4); }))).sort().reverse();
    var MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    var state = {
      p: param("p") || "",
      y: param("y") || "",
      m: param("m") || "",
      sort: param("sort") === "old" ? "old" : "new",
    };

    /* fill selects (desktop bar + mobile sheet share options) */
    function fillSelect(sel, options, current) {
      sel.innerHTML = options.map(function (o) {
        return '<option value="' + o.v + '"' + (o.v === current ? " selected" : "") + ">" + o.t + "</option>";
      }).join("");
    }
    var progOpts = [{ v: "", t: "كل البرامج" }].concat(D.programs.map(function (p) {
      return { v: p.slug, t: p.title };
    }));
    var yearOpts = [{ v: "", t: "كل السنوات" }].concat(years.map(function (y) {
      return { v: y, t: arNum(y) };
    }));
    var monthOpts = [{ v: "", t: "كل الشهور" }].concat(MONTHS.map(function (m, i) {
      return { v: String(i + 1).padStart(2, "0"), t: m };
    }));
    var sortOpts = [{ v: "new", t: "الأحدث أولًا" }, { v: "old", t: "الأقدم أولًا" }];

    $$("select[data-f]").forEach(function (sel) {
      var f = sel.getAttribute("data-f");
      fillSelect(sel, f === "p" ? progOpts : f === "y" ? yearOpts : f === "m" ? monthOpts : sortOpts, state[f]);
      sel.addEventListener("change", function () {
        state[f] = sel.value;
        syncAll();
        apply();
      });
    });

    function syncAll() {
      $$("select[data-f]").forEach(function (sel) {
        var f = sel.getAttribute("data-f");
        if (sel.value !== state[f]) sel.value = state[f];
        sel.closest(".field").classList.toggle("is-active", f !== "sort" && state[f] !== "");
      });
      /* URL */
      var q = new URLSearchParams();
      if (state.p) q.set("p", state.p);
      if (state.y) q.set("y", state.y);
      if (state.m) q.set("m", state.m);
      if (state.sort !== "new") q.set("sort", state.sort);
      var qs = q.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
      /* badge */
      var n = (state.p ? 1 : 0) + (state.y ? 1 : 0) + (state.m ? 1 : 0);
      var badge = $("#filterBadge");
      if (badge) {
        badge.textContent = arNum(n);
        badge.style.display = n ? "grid" : "none";
      }
    }

    function apply() {
      var res = D.episodes.filter(function (e) {
        if (state.p && e.program !== state.p) return false;
        if (state.y && e.date.slice(0, 4) !== state.y) return false;
        if (state.m && e.date.slice(5, 7) !== state.m) return false;
        return true;
      }).sort(state.sort === "new" ? byDateDesc : byDateAsc);

      countEl.textContent = res.length ? arNum(res.length) + " حلقة" : "";
      if (!res.length) {
        grid.innerHTML = "";
        emptyEl.style.display = "";
      } else {
        emptyEl.style.display = "none";
        grid.innerHTML = res.map(function (ep, i) {
          return epCard(ep, i < 8);
        }).join("");
      }
      initReveal();
    }

    function clearAll() {
      state.p = ""; state.y = ""; state.m = ""; state.sort = "new";
      syncAll(); apply();
    }
    $$(".chip-clear[data-clear]").forEach(function (b) { b.addEventListener("click", clearAll); });
    var emptyClear = $("#emptyClear");
    if (emptyClear) emptyClear.addEventListener("click", clearAll);

    /* mobile sheet */
    var sheet = $("#filterSheet"), backdrop = $("#sheetBackdrop");
    var sheetOpener = null;
    function setSheet(open) {
      sheet.classList.toggle("open", open);
      backdrop.classList.toggle("open", open);
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (open) {
        sheetOpener = document.activeElement;
        var first = $("select", sheet);
        if (first) first.focus();
      } else if (sheetOpener) {
        sheetOpener.focus();
        sheetOpener = null;
      }
    }
    sheet.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setSheet(false);
    });
    var openBtn = $("#filterOpen");
    if (openBtn) openBtn.addEventListener("click", function () { setSheet(true); });
    backdrop.addEventListener("click", function () { setSheet(false); });
    $("#sheetApply").addEventListener("click", function () { setSheet(false); });
    $("#sheetClear").addEventListener("click", function () { clearAll(); });

    syncAll();
    apply();
  }

  /* =========================================================
     Page: search
     ========================================================= */
  function pageSearch() {
    var input = $("#searchInput");
    var grid = $("#searchGrid"), emptyEl = $("#searchEmpty"), countEl = $("#searchCount"), hintRow = $("#searchHints");
    var years = Array.from(new Set(D.episodes.map(function (e) { return e.date.slice(0, 4); }))).sort().reverse();
    var types = Array.from(new Set(D.programs.map(function (p) { return PROG_TYPE[p.slug]; })));

    var state = { q: param("q") || "", p: "", y: "", t: "" };
    input.value = state.q;

    /* filters */
    function fill(sel, opts, cur) {
      sel.innerHTML = opts.map(function (o) {
        return '<option value="' + o.v + '"' + (o.v === cur ? " selected" : "") + ">" + o.t + "</option>";
      }).join("");
    }
    fill($("#fProg"), [{ v: "", t: "كل البرامج" }].concat(D.programs.map(function (p) { return { v: p.slug, t: p.title }; })), "");
    fill($("#fYear"), [{ v: "", t: "كل السنوات" }].concat(years.map(function (y) { return { v: y, t: arNum(y) }; })), "");
    fill($("#fType"), [{ v: "", t: "كل الأنواع" }].concat(types.map(function (t) { return { v: t, t: t }; })), "");

    $$("select[data-sf]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        state[sel.getAttribute("data-sf")] = sel.value;
        sel.closest(".field").classList.toggle("is-active", sel.value !== "");
        run();
      });
    });

    /* hint chips from tags */
    var tagCount = {};
    D.episodes.forEach(function (e) {
      (e.tags || []).forEach(function (t) { tagCount[t] = (tagCount[t] || 0) + 1; });
    });
    var topTags = Object.keys(tagCount).sort(function (a, b) { return tagCount[b] - tagCount[a]; }).slice(0, 6);
    hintRow.innerHTML = "<span>جرّب:</span>" + topTags.map(function (t) {
      return '<button class="hint-chip" data-q="' + esc(t) + '">' + esc(t) + "</button>";
    }).join("");
    hintRow.addEventListener("click", function (e) {
      var chip = e.target.closest(".hint-chip");
      if (!chip) return;
      input.value = chip.getAttribute("data-q");
      state.q = input.value;
      run();
      input.focus();
    });

    function matches(ep, q) {
      if (!q) return true;
      var p = progOf(ep);
      var hay = normAr(ep.title + " " + ep.description + " " + (ep.tags || []).join(" ") + " " + p.title + " " + p.tagline);
      return q.split(/\s+/).every(function (w) {
        if (hay.indexOf(w) !== -1) return true;
        /* forgive the definite article: "الأدب" should also find "أدب" */
        if (w.length > 3 && w.slice(0, 2) === "ال" && hay.indexOf(w.slice(2)) !== -1) return true;
        return false;
      });
    }

    function run() {
      var q = normAr(state.q.trim());
      var res = D.episodes.filter(function (e) {
        if (state.p && e.program !== state.p) return false;
        if (state.y && e.date.slice(0, 4) !== state.y) return false;
        if (state.t && PROG_TYPE[e.program] !== state.t) return false;
        return matches(e, q);
      }).sort(byDateDesc);

      var hasQuery = q || state.p || state.y || state.t;
      countEl.textContent = hasQuery
        ? (res.length ? arNum(res.length) + " نتيجة" : "")
        : "كل الحلقات — " + arNum(D.episodes.length) + " حلقة";

      if (!res.length) {
        grid.innerHTML = "";
        emptyEl.style.display = "";
        var eq = $("#emptyQuery");
        if (eq) eq.textContent = state.q.trim() ? "«" + state.q.trim() + "»" : "";
      } else {
        emptyEl.style.display = "none";
        grid.innerHTML = res.map(function (ep, i) {
          return epCard(ep, i < 8);
        }).join("");
      }
      initReveal();

      var qs = new URLSearchParams();
      if (state.q.trim()) qs.set("q", state.q.trim());
      var s = qs.toString();
      history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
    }

    var deb;
    input.addEventListener("input", function () {
      clearTimeout(deb);
      deb = setTimeout(function () {
        state.q = input.value;
        run();
      }, 140);
    });

    $$("[data-search-clear]").forEach(function (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = ""; state.q = ""; state.p = ""; state.y = ""; state.t = "";
        $$("select[data-sf]").forEach(function (sel) {
          sel.value = "";
          sel.closest(".field").classList.remove("is-active");
        });
        run();
        input.focus();
      });
    });

    run();
    if (!state.q) input.focus();
  }

  /* =========================================================
     Page: episode (watch)
     ========================================================= */
  function pageEpisode() {
    var id = param("e");
    var ep = epById[id] || D.episodes.filter(function (x) { return x.slug === param("s"); })[0];
    var root = $("#watchRoot");

    if (!ep) {
      root.innerHTML =
        '<div class="watch-hero"><div class="container">' +
        '<div class="crumb"><a href="episodes.html">الحلقات</a>' + icon("i-arrow", "icon--s") + "<span>غير موجودة</span></div>" +
        '<div style="max-width:980px;margin-inline:auto;text-align:center;padding-block:60px">' +
        '<h1 style="font-family:var(--f-display);font-size:1.8rem">هذه الحلقة غير موجودة</h1>' +
        '<p style="color:var(--on-navy-2);margin-block-start:12px">ربما تغيّر الرابط أو حُذفت الحلقة. جرّب البحث في الأرشيف.</p>' +
        '<div style="display:flex;gap:10px;justify-content:center;margin-block-start:26px;flex-wrap:wrap">' +
        '<a class="btn btn--gold" href="search.html">' + icon("i-search") + "ابحث في الأرشيف</a>" +
        '<a class="btn btn--ghost" href="episodes.html">كل الحلقات</a>' +
        "</div></div></div></div>";
      return;
    }

    var p = progOf(ep);
    document.title = ep.title + " — " + p.title + " — درب ميديا";

    var progEps = episodesOf(p.slug).sort(function (a, b) { return a.no - b.no; });
    var epIndex = progEps.indexOf(ep);

    /* programme playlist rows — the current episode carries a live indicator */
    var plRows = progEps.map(function (x) {
      var cur = x.id === ep.id;
      return (
        '<a class="pl-item' + (cur ? " is-current" : "") + '" href="' + (cur ? "#" : epURL(x)) + '"' +
        (cur ? ' aria-current="true"' : "") + ">" +
        '<span class="pl-no">' + (cur ? '<span class="pl-eq"><i></i><i></i><i></i></span>' : arNum(x.no)) + "</span>" +
        '<span class="pl-thumb">' + thumbSVG(x) + "</span>" +
        '<span class="pl-body">' +
        '<span class="pl-title">' + esc(x.title) + "</span>" +
        '<span class="pl-meta"><span class="ltr-num">' + esc(x.duration) + "</span></span>" +
        "</span></a>"
      );
    }).join("");

    root.innerHTML =
      '<div class="watch-hero"><div class="container">' +
      '<div class="crumb">' +
      '<a href="' + progURL(p) + '">' + esc(p.title) + "</a>" + icon("i-arrow", "icon--s") +
      "<span>الحلقة " + arNum(ep.no) + "</span></div>" +

      /* info | portrait player | playlist — the 9:16 frame is the centrepiece */
      '<div class="watch-grid">' +
      '<div class="watch-info">' +
      '<a class="stage-program" href="' + progURL(p) + '">' + icon("i-play", "icon--fill") + esc(p.title) + "</a>" +
      "<h1>" + esc(ep.title) + "</h1>" +
      '<div class="stage-meta">' +
      "<span>" + fmtDate(ep.date) + "</span>" +
      '<span class="meta-dot">·</span><span class="ltr-num">' + esc(ep.duration) + "</span>" +
      "</div>" +
      '<p class="watch-desc">' + esc(ep.description) + "</p>" +
      '<div class="tag-row">' +
      (ep.tags || []).map(function (t) {
        return '<a class="tag" href="search.html?q=' + encodeURIComponent(t) + '">' + esc(t) + "</a>";
      }).join("") +
      "</div>" +
      '<div class="watch-actions">' +
      '<button class="btn btn--gold btn--s" id="copyBtn">' + icon("i-copy") + "نسخ الرابط</button>" +
      '<button class="btn btn--ghost btn--s" id="shareBtn">' + icon("i-share") + "مشاركة</button>" +
      "</div>" +
      /* the column's tail points forward instead of trailing off */
      (progEps[epIndex + 1]
        ? (function (nx) {
            return (
              '<a class="watch-next" href="' + epURL(nx) + '">' +
              '<span class="wn-thumb">' + thumbSVG(nx) + "</span>" +
              '<span class="wn-body">' +
              '<span class="wn-k">التالي في البرنامج</span>' +
              '<span class="wn-t">' + esc(nx.title) + "</span>" +
              '<span class="wn-m"><span class="ltr-num">' + esc(nx.duration) + "</span></span>" +
              "</span></a>"
            );
          })(progEps[epIndex + 1])
        : "") +
      "</div>" +

      '<div class="watch-stage">' +
      '<div class="player" id="player">' +
      thumbSVG(ep, true, false, true) +
      '<div class="stage-scrim"></div>' +
      '<button class="stage-play" id="playBtn" aria-label="تشغيل الفيديو">' +
      '<span class="play-disc">' + icon("i-play", "icon--fill") + "</span></button>" +
      '<span class="stage-dur"><span class="ltr-num">' + esc(ep.duration) + "</span></span>" +
      '<div class="player-note" id="playerNote">' + icon("i-info") +
      "<span>لم يُربط مصدر الفيديو لهذه الحلقة بعد.</span></div>" +
      "</div></div>" +

      /* playlist rail */
      '<aside class="pl" aria-label="قائمة تشغيل البرنامج">' +
      '<div class="pl-head">' +
      '<span class="pl-kick">قائمة التشغيل</span>' +
      '<a class="pl-prog" href="' + progURL(p) + '">' + esc(p.title) + "</a>" +
      '<span class="pl-count"><span class="ltr-num">' + arNum(epIndex + 1) + " / " + arNum(progEps.length) + "</span></span>" +
      "</div>" +
      '<div class="pl-list" id="plList">' + plRows + "</div>" +
      "</aside>" +
      "</div></div></div>" +

      '<div class="watch-body"><div class="container">' +

      '<section class="section" style="padding-block-end:0">' +
      '<div class="sec-head"><h2>حلقات ذات صلة</h2>' +
      '<a class="sec-more" href="' + progURL(p) + '">كل حلقات ' + esc(p.title) + icon("i-arrow", "icon--s") + "</a></div>" +
      '<div class="reel-grid reel-grid--related" id="relatedGrid"></div>' +
      "</section>" +
      "</div></div>";

    /* keep the current row in view inside the playlist rail */
    var curRow = $(".pl-item.is-current");
    if (curRow) curRow.scrollIntoView({ block: "nearest" });

    /* related: other programmes with shared tags (the same programme already
       lives in the playlist rail, so repeating it here would be noise) */
    var tagset = {};
    (ep.tags || []).forEach(function (t) { tagset[t] = 1; });
    var related = D.episodes.filter(function (x) {
      return x.program !== p.slug && (x.tags || []).some(function (t) { return tagset[t]; });
    }).sort(byDateDesc);
    if (related.length < 3) {
      related = related.concat(D.episodes.filter(function (x) {
        return x.program !== p.slug && related.indexOf(x) === -1;
      }).sort(byDateDesc));
    }
    /* exactly one full row — an orphaned 4+2 reads as a broken archive */
    $("#relatedGrid").innerHTML = related.slice(0, 4).map(function (x) {
      return epCard(x);
    }).join("");

    /* player */
    $("#playBtn").addEventListener("click", function () {
      if (mountPlayback($("#player"), ep, true)) {
        /* mounted */
      } else {
        var note = $("#playerNote");
        note.classList.add("show");
        clearTimeout(note._t);
        note._t = setTimeout(function () { note.classList.remove("show"); }, 3600);
      }
    });

    $("#copyBtn").addEventListener("click", function () { copyText(shortLink(ep)); });
    $("#shareBtn").addEventListener("click", function () { shareEp(ep); });
  }

  /* =========================================================
     Boot
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML("afterbegin", SPRITE);

    /* keyboard route past the chrome, on every page with a <main> */
    var mainEl = document.querySelector("main");
    if (mainEl) {
      if (!mainEl.id) mainEl.id = "main";
      mainEl.setAttribute("tabindex", "-1");
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<a class="skip-link" href="#' + mainEl.id + '">تخطَّ إلى المحتوى</a>'
      );
    }

    renderHeader();
    renderFooter();

    /* delegated: copy buttons (hero) + card play → Reels feed.
       The play disc opens the immersive feed at that reel; the card itself
       still links to the episode page. */
    document.body.addEventListener("click", function (e) {
      var b = e.target.closest("[data-copy]");
      if (b) { copyText(shortLink(epById[b.getAttribute("data-copy")])); return; }
      var play = e.target.closest(".reel-play");
      if (play && play.getAttribute("data-reel")) {
        e.preventDefault();
        e.stopPropagation();
        /* cross-document view transition: tag the clicked frame as the
           shared element before navigating. Inert where unsupported. */
        var vtMedia = play.closest(".reel-media");
        if (vtMedia) vtMedia.style.viewTransitionName = "reel-frame";
        location.href = "reels.html?e=" + play.getAttribute("data-reel");
      }
    });

    /* returning from the reels feed: the feed's active frame morphs back
       into its own card. pagereveal fires before the first paint, so the
       tag is in place when the transition captures the new page. */
    window.addEventListener("pagereveal", function (ev) {
      /* stale tags (bfcache restore, cancelled navigation) would collide
         with the one we set next — clear first */
      $$('.reel-media[style*="view-transition-name"]').forEach(function (m) {
        m.style.viewTransitionName = "";
      });
      if (!ev.viewTransition) return;
      var fromURL = null;
      try {
        fromURL = window.navigation && navigation.activation &&
          navigation.activation.from && navigation.activation.from.url;
      } catch (err) {}
      if (!fromURL || fromURL.indexOf("reels.html") === -1) return;
      var id = new URL(fromURL, location.href).searchParams.get("e");
      var btn = id && document.querySelector('.reel-play[data-reel="' + id + '"]');
      var media = btn && btn.closest(".reel-media");
      if (!media) return;
      media.style.viewTransitionName = "reel-frame";
      ev.viewTransition.finished.finally(function () {
        media.style.viewTransitionName = "";
      });
    });

    var page = document.body.getAttribute("data-page");
    if (page === "home") pageHome();
    else if (page === "programs") pagePrograms();
    else if (page === "program") pageProgram();
    else if (page === "episodes") pageEpisodes();
    else if (page === "search") pageSearch();
    else if (page === "episode") pageEpisode();
    else if (page === "about") pageAbout();

    initReveal();
  });

  /* =========================================================
     Page: about — live facts + a wall of real archive stills
     ========================================================= */
  function pageAbout() {
    var yearsAll = D.episodes.map(function (e) { return e.date.slice(0, 4); }).sort();
    var stats = {
      programs: arNum(D.programs.length),
      episodes: arNum(D.episodes.length),
      since: yearsAll.length ? arNum(yearsAll[0]) : "",
    };
    $$("[data-stat]").forEach(function (el) {
      el.textContent = stats[el.getAttribute("data-stat")] || "";
    });

    /* the programmes line, generated so it can never go stale */
    var progLine = $("#aboutPrograms");
    if (progLine) {
      progLine.innerHTML = arNum(D.programs.length) + " مسارات نمشي فيها بالتوازي: " +
        D.programs.map(function (p) {
          return '<a href="' + progURL(p) + '"><b>' + esc(p.title) + "</b></a> " + esc(p.tagline);
        }).join("، ") + ".";
    }

    /* six stills, one per programme where possible — the archive's face */
    var wall = $("#aboutWall");
    if (wall) {
      var picks = [];
      D.programs.forEach(function (p) {
        var eps = episodesOf(p.slug).sort(byDateDesc);
        if (eps[0]) picks.push(eps[0]);
      });
      wall.innerHTML = picks.slice(0, 6).map(function (ep) {
        return '<a href="' + epURL(ep) + '" aria-label="' + esc(ep.title) + '">' + thumbSVG(ep) + "</a>";
      }).join("");
    }
  }
})();
