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
    "qissat-khaliya": "وثائقي",
    "ala-aldarb": "بودكاست",
    "thakira": "وثائقي",
    "adasat-darb": "تقرير",
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
    } else if (motif === "cell") {
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
    }
    return out;
  }

  function thumbSVG(ep, big) {
    var p = progOf(ep) || D.programs[0];
    var tone = TONES[p.tone] || TONES.deep;
    var W = big ? 800 : 480, H = Math.round(W * 9 / 16);
    var s = seed(ep.id);
    var num = arNum(ep.no);
    var numSize = big ? 210 : 138;
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="' + tone.bg + '"/>' +
      motifSVG(p.motif, s, W, H, tone) +
      /* big episode numeral, bottom-start (RTL visual right) */
      '<text x="' + (W - 30) + '" y="' + (H - 26) + '" text-anchor="end" ' +
      'font-family="Noto Kufi Arabic, Segoe UI, Tahoma, sans-serif" font-weight="800" ' +
      'font-size="' + numSize + '" fill="#FFFFFF" fill-opacity="0.94">' + num + "</text>" +
      /* small play mark, top-start corner */
      '<g transform="translate(' + (W - 54) + ',26)">' +
      '<rect x="0" y="0" width="28" height="28" rx="7" fill="' + GOLD + '"/>' +
      '<path d="M11 8.6v10.8c0 .7.8 1.1 1.4.75L20 14.6a.85.85 0 0 0 0-1.5l-7.6-5.55c-.6-.35-1.4.05-1.4.75Z" fill="' + tone.bg + '" transform="scale(0.93) translate(1,1)"/>' +
      "</g>" +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function coverSVG(p, big) {
    var tone = TONES[p.tone] || TONES.deep;
    var W = big ? 800 : 640, H = Math.round(W * 9 / 16);
    var s = seed(p.slug);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="' + tone.bg + '"/>' +
      motifSVG(p.motif, s, W, H, tone) +
      '<rect x="0" y="' + (H - 6) + '" width="' + W * 0.38 + '" height="6" fill="' + GOLD + '"/>' +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* =========================================================
     Header / footer
     ========================================================= */
  var NAV = [
    { href: "index.html", label: "الرئيسية", latin: "Home", key: "home" },
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
    mount.innerHTML =
      '<footer class="site-footer">' +
      '<div class="container">' +
      '<div class="footer-grid">' +
      '<div class="footer-brand">' +
      '<img src="assets/img/logo-dark.png" alt="درب ميديا">' +
      "<p>" + esc(D.site.description) + "</p>" +
      "</div>" +
      '<div class="footer-col"><h4>تصفّح</h4><ul>' +
      '<li><a href="index.html">الرئيسية</a></li>' +
      '<li><a href="programs.html">البرامج</a></li>' +
      '<li><a href="episodes.html">الحلقات</a></li>' +
      '<li><a href="search.html">بحث</a></li>' +
      "</ul></div>" +
      '<div class="footer-col"><h4>البرامج</h4><ul>' +
      D.programs.map(function (p) {
        return '<li><a href="' + progURL(p) + '">' + esc(p.title) + "</a></li>";
      }).join("") +
      "</ul></div>" +
      '<div class="footer-col"><h4>تابعنا</h4><ul>' +
      '<li><a href="' + D.site.telegram + '" target="_blank" rel="noopener">' + icon("i-telegram", "icon--s") + "تيليجرام</a></li>" +
      '<li><a href="' + D.site.instagram + '" target="_blank" rel="noopener">' + icon("i-instagram", "icon--s") + "إنستغرام</a></li>" +
      '<li><a href="about.html">' + icon("i-info", "icon--s") + "عن درب ميديا</a></li>" +
      "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom">' +
      '<span class="footer-statement">' + esc(D.site.statement) + "</span>" +
      '<span class="sep">•</span>' +
      "<span>منصة إعلامية عربية مستقلة</span>" +
      '<span class="footer-copy">© ' + arNum(year) + " درب ميديا — جميع الحقوق محفوظة</span>" +
      "</div></div></footer>";
  }

  /* =========================================================
     Cards
     ========================================================= */
  function epCard(ep, opts) {
    opts = opts || {};
    var p = progOf(ep);
    return (
      '<article class="ep-card rv"' + (opts.delay ? ' style="--d:' + opts.delay + 'ms"' : "") + ">" +
      '<a href="' + epURL(ep) + '" aria-label="' + esc(ep.title) + '">' +
      '<div class="ep-thumb">' +
      '<img src="' + thumbSVG(ep) + '" alt="" loading="lazy">' +
      '<span class="thumb-play">' + icon("i-play", "icon--fill") + "</span>" +
      '<span class="thumb-dur">' + esc(ep.duration) + "</span>" +
      "</div>" +
      '<div class="ep-body">' +
      '<span class="ep-program">' + esc(p.title) + "</span>" +
      '<h3 class="ep-title">' + esc(ep.title) + "</h3>" +
      '<div class="ep-meta"><span>' + icon("i-cal", "icon--s") + fmtDate(ep.date) + "</span></div>" +
      "</div></a></article>"
    );
  }

  function pickLead(ep) {
    var p = progOf(ep);
    return (
      '<article class="ep-card pick-lead rv">' +
      '<a href="' + epURL(ep) + '">' +
      '<div class="ep-thumb">' +
      '<img src="' + thumbSVG(ep, true) + '" alt="">' +
      '<span class="thumb-play">' + icon("i-play", "icon--fill") + "</span>" +
      '<span class="thumb-dur">' + esc(ep.duration) + "</span>" +
      "</div>" +
      '<div class="ep-body">' +
      '<span class="ep-program">' + esc(p.title) + "</span>" +
      '<h3 class="ep-title">' + esc(ep.title) + "</h3>" +
      '<p class="pick-desc">' + esc(ep.description) + "</p>" +
      '<div class="ep-meta"><span>' + icon("i-cal", "icon--s") + fmtDate(ep.date) + "</span><span>" + icon("i-clock", "icon--s") + esc(ep.duration) + "</span></div>" +
      "</div></a></article>"
    );
  }

  function pickRow(ep, i) {
    var p = progOf(ep);
    return (
      '<article class="ep-card pick-row rv" style="--d:' + (i * 70) + 'ms">' +
      '<a href="' + epURL(ep) + '" style="display:contents">' +
      '<div class="ep-thumb">' +
      '<img src="' + thumbSVG(ep) + '" alt="" loading="lazy">' +
      '<span class="thumb-play">' + icon("i-play", "icon--fill") + "</span>" +
      "</div>" +
      '<div class="pick-row-body">' +
      '<span class="ep-program">' + esc(p.title) + "</span>" +
      '<h3 class="ep-title">' + esc(ep.title) + "</h3>" +
      '<div class="ep-meta"><span>' + icon("i-clock", "icon--s") + esc(ep.duration) + "</span></div>" +
      "</div></a></article>"
    );
  }

  function progCard(p, i) {
    var eps = episodesOf(p.slug);
    var last = eps.slice().sort(byDateDesc)[0];
    return (
      '<a class="prog-card rv" style="--d:' + (i * 60) + 'ms" href="' + progURL(p) + '">' +
      '<div class="prog-cover"><img src="' + coverSVG(p) + '" alt="" loading="lazy"></div>' +
      '<div class="prog-body">' +
      "<h3>" + esc(p.title) + "</h3>" +
      '<div class="prog-tag">' + esc(p.tagline) + "</div>" +
      '<p class="prog-desc">' + esc(p.description) + "</p>" +
      "</div>" +
      '<div class="prog-side">' +
      '<div class="prog-count"><b>' + arNum(eps.length) + "</b>حلقات</div>" +
      '<span class="btn btn--gold btn--s">' + icon("i-play", "icon--fill icon--s") + "مشاهدة البرنامج</span>" +
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
    var stripEps = [featured].concat(latest(3, featured.id));
    var current = 0;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var AUTO_SECS = 7;

    /* stage */
    var stage = $("#heroStage");
    function stageHTML(ep) {
      var p = progOf(ep);
      return (
        '<div class="stage-media" id="stageMedia">' +
        '<img src="' + thumbSVG(ep, true) + '" alt="' + esc(ep.title) + '">' +
        '<div class="stage-scrim"></div>' +
        '<a class="stage-play" href="' + epURL(ep) + '" aria-label="تشغيل: ' + esc(ep.title) + '">' +
        '<span class="play-disc">' + icon("i-play", "icon--fill") + "</span></a>" +
        "</div>" +
        '<div class="stage-info">' +
        '<a class="stage-program" href="' + progURL(p) + '">' + icon("i-play", "icon--fill") + esc(p.title) + "</a>" +
        '<h1 class="stage-title"><a href="' + epURL(ep) + '">' + esc(ep.title) + "</a></h1>" +
        '<p class="stage-desc">' + esc(ep.description) + "</p>" +
        '<div class="stage-meta">' +
        "<span>" + icon("i-cal", "icon--s") + fmtDate(ep.date) + "</span>" +
        "<span>" + icon("i-clock", "icon--s") + esc(ep.duration) + "</span>" +
        "</div>" +
        '<div class="stage-actions">' +
        '<a class="btn btn--gold" href="' + epURL(ep) + '">' + icon("i-play", "icon--fill") + "شاهد الحلقة</a>" +
        '<button class="btn btn--ghost" data-copy="' + ep.id + '">' + icon("i-copy") + "نسخ الرابط</button>" +
        "</div></div>"
      );
    }

    function renderStage(ep, animate) {
      if (!animate) {
        stage.innerHTML = stageHTML(ep);
        return;
      }
      var media = $("#stageMedia");
      if (media) media.classList.add("is-swapping");
      var info = $(".stage-info", stage);
      if (info) { info.style.opacity = "0"; info.style.transition = "opacity 240ms ease"; }
      setTimeout(function () { stage.innerHTML = stageHTML(ep); }, 260);
    }

    /* strip */
    var strip = $("#heroStrip");
    strip.innerHTML = stripEps.map(function (ep, i) {
      var p = progOf(ep);
      return (
        '<button class="strip-item' + (i === 0 ? " active" : "") + '" data-i="' + i + '" style="--strip-secs:' + AUTO_SECS + 's">' +
        '<span class="strip-thumb"><img src="' + thumbSVG(ep) + '" alt=""></span>' +
        "<span>" +
        '<span class="strip-p">' + esc(p.title) + "</span>" +
        '<span class="strip-t">' + esc(ep.title) + "</span>" +
        "</span>" +
        '<span class="strip-bar"><i></i></span>' +
        "</button>"
      );
    }).join("");

    function setActive(i, animate) {
      current = i;
      renderStage(stripEps[i], animate);
      $$(".strip-item", strip).forEach(function (el, k) {
        var on = k === i;
        el.classList.toggle("active", on);
        if (on) {
          /* restart the progress hairline */
          var bar = $(".strip-bar i", el);
          if (bar) {
            bar.style.animation = "none";
            void bar.offsetWidth;
            bar.style.animation = "";
          }
        }
      });
    }

    renderStage(featured, false);

    var timer = null;
    function startAuto() {
      if (reduced || stripEps.length < 2) return;
      stopAuto();
      timer = setInterval(function () {
        setActive((current + 1) % stripEps.length, true);
      }, AUTO_SECS * 1000);
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

    strip.addEventListener("click", function (e) {
      var item = e.target.closest(".strip-item");
      if (!item) return;
      var i = +item.getAttribute("data-i");
      if (i === current) return;
      setActive(i, true);
      startAuto(); /* reset cadence after manual choice */
    });

    var hero = $(".hero");
    hero.addEventListener("mouseenter", function () { hero.classList.add("paused"); stopAuto(); });
    hero.addEventListener("mouseleave", function () { hero.classList.remove("paused"); startAuto(); });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAuto(); else startAuto();
    });
    startAuto();
    if (reduced) $$(".strip-bar", strip).forEach(function (b) { b.style.display = "none"; });

    /* latest */
    var latestEps = D.episodes.slice().sort(byDateDesc).slice(0, 8);
    $("#latestGrid").innerHTML = latestEps.map(function (ep, i) {
      return epCard(ep, { delay: (i % 4) * 60 });
    }).join("");
    $("#latestCount").textContent = arNum(D.episodes.length) + " حلقة في الأرشيف";

    /* programs */
    $("#programsList").innerHTML = D.programs.map(progCard).join("");

    /* picks */
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
    $("#programsList").innerHTML = D.programs.map(progCard).join("");
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
      "<span>" + icon("i-grid", "icon--s") + arNum(eps.length) + " حلقات</span>" +
      (lastDate ? "<span>" + icon("i-cal", "icon--s") + "آخر تحديث: " + fmtDate(lastDate.date) + "</span>" : "") +
      "</div></div>" +
      '<div class="prog-hero-cover rv in"><img src="' + coverSVG(p, true) + '" alt="' + esc(p.title) + '"></div>' +
      "</div></div>";

    var sort = "new";
    function renderList() {
      var sorted = eps.slice().sort(sort === "new" ? byDateDesc : byDateAsc);
      listEl.innerHTML = sorted.map(function (ep, i) {
        return epCard(ep, { delay: (i % 4) * 50 });
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
          return epCard(ep, { delay: (i % 4) * 45 });
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
    function setSheet(open) {
      sheet.classList.toggle("open", open);
      backdrop.classList.toggle("open", open);
      document.documentElement.style.overflow = open ? "hidden" : "";
    }
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
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
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
          return epCard(ep, { delay: (i % 4) * 40 });
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
    var next = progEps.filter(function (x) { return x.no === ep.no + 1; })[0];

    root.innerHTML =
      '<div class="watch-hero"><div class="container">' +
      '<div class="crumb" style="max-width:980px;margin-inline:auto">' +
      '<a href="' + progURL(p) + '">' + esc(p.title) + "</a>" + icon("i-arrow", "icon--s") +
      "<span>الحلقة " + arNum(ep.no) + "</span></div>" +
      '<div class="player" id="player">' +
      '<img class="player-poster" src="' + thumbSVG(ep, true) + '" alt="' + esc(ep.title) + '">' +
      '<div class="stage-scrim"></div>' +
      '<button class="stage-play" id="playBtn" aria-label="تشغيل الحلقة">' +
      '<span class="play-disc">' + icon("i-play", "icon--fill") + "</span></button>" +
      '<div class="player-note" id="playerNote">' + icon("i-info") +
      "<span>لم يُربط مصدر الفيديو لهذه الحلقة التجريبية بعد — تُشاهَد حاليًا عبر قناة تيليجرام.</span></div>" +
      "</div>" +
      '<div class="watch-info">' +
      '<a class="stage-program" href="' + progURL(p) + '">' + icon("i-play", "icon--fill") + esc(p.title) + "</a>" +
      "<h1>" + esc(ep.title) + "</h1>" +
      '<div class="watch-row">' +
      '<div class="stage-meta">' +
      "<span>" + icon("i-cal", "icon--s") + fmtDate(ep.date) + "</span>" +
      "<span>" + icon("i-clock", "icon--s") + esc(ep.duration) + "</span>" +
      "</div>" +
      '<div class="watch-actions">' +
      '<button class="btn btn--ghost btn--s" id="shareBtn">' + icon("i-share") + "مشاركة</button>" +
      '<button class="btn btn--gold btn--s" id="copyBtn">' + icon("i-copy") + "نسخ الرابط</button>" +
      "</div></div></div>" +
      "</div></div>" +

      '<div class="watch-body"><div class="container"><div class="watch-cols">' +
      '<div class="about-ep rv in">' +
      "<h2>عن الحلقة</h2>" +
      '<p class="about-text">' + esc(ep.description) + "</p>" +
      '<div class="tag-row">' +
      (ep.tags || []).map(function (t) {
        return '<a class="tag" href="search.html?q=' + encodeURIComponent(t) + '">' + esc(t) + "</a>";
      }).join("") +
      "</div></div>" +
      '<aside class="next-ep rv in">' +
      "<h2>التالي في البرنامج</h2>" +
      (next
        ? '<a class="next-card" href="' + epURL(next) + '">' +
          '<div class="ep-thumb"><img src="' + thumbSVG(next) + '" alt=""></div>' +
          '<div class="next-body">' +
          '<div class="next-kick">' + icon("i-play", "icon--fill icon--s") + "الحلقة " + arNum(next.no) + "</div>" +
          '<div class="next-title">' + esc(next.title) + "</div>" +
          '<div class="ep-meta" style="margin-block-start:8px"><span>' + icon("i-clock", "icon--s") + esc(next.duration) + "</span></div>" +
          "</div></a>"
        : '<div class="next-empty">هذه أحدث حلقة في «' + esc(p.title) + '».<br><a href="' + progURL(p) + '" style="color:var(--navy-700);font-weight:600">تصفّح حلقات البرنامج</a> أو تابع جديدنا على <a href="' + D.site.telegram + '" target="_blank" rel="noopener" style="color:var(--navy-700);font-weight:600">تيليجرام</a>.</div>') +
      "</aside>" +
      "</div>" +

      '<section class="section" style="padding-block-end:0">' +
      '<div class="sec-head"><h2>حلقات ذات صلة</h2>' +
      '<a class="sec-more" href="' + progURL(p) + '">كل حلقات ' + esc(p.title) + icon("i-arrow", "icon--s") + "</a></div>" +
      '<div class="ep-grid ep-grid--3" id="relatedGrid"></div>' +
      "</section>" +
      "</div></div>";

    /* related: same program first, then shared tags */
    var related = progEps.filter(function (x) { return x.id !== ep.id && (!next || x.id !== next.id); })
      .sort(byDateDesc);
    if (related.length < 3) {
      var tagset = {};
      (ep.tags || []).forEach(function (t) { tagset[t] = 1; });
      var extra = D.episodes.filter(function (x) {
        return x.program !== p.slug && (x.tags || []).some(function (t) { return tagset[t]; });
      }).sort(byDateDesc);
      related = related.concat(extra);
    }
    $("#relatedGrid").innerHTML = related.slice(0, 6).map(function (x, i) {
      return epCard(x, { delay: (i % 3) * 60 });
    }).join("");

    /* player */
    $("#playBtn").addEventListener("click", function () {
      var v = ep.video || {};
      var frame = "";
      if (v.type === "youtube" && v.src) {
        frame = '<iframe class="player-frame" src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.src) + '?autoplay=1&rel=0" title="' + esc(ep.title) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      } else if (v.type === "mp4" && v.src) {
        frame = '<video class="player-frame" src="' + esc(v.src) + '" controls autoplay playsinline></video>';
      } else if (v.type === "telegram" && v.src) {
        frame = '<iframe class="player-frame" src="https://t.me/' + esc(v.src) + '?embed=1&mode=tme" title="' + esc(ep.title) + '"></iframe>';
      }
      if (frame) {
        var player = $("#player");
        player.innerHTML = frame;
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
    renderHeader();
    renderFooter();

    /* delegated copy buttons (hero) */
    document.body.addEventListener("click", function (e) {
      var b = e.target.closest("[data-copy]");
      if (b) copyText(shortLink(epById[b.getAttribute("data-copy")]));
    });

    var page = document.body.getAttribute("data-page");
    if (page === "home") pageHome();
    else if (page === "programs") pagePrograms();
    else if (page === "program") pageProgram();
    else if (page === "episodes") pageEpisodes();
    else if (page === "search") pageSearch();
    else if (page === "episode") pageEpisode();

    initReveal();
  });
})();
