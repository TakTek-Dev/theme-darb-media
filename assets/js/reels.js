/* =========================================================
   Darb Reels Feed — immersive vertical viewer
   ---------------------------------------------------------
   - one reel per viewport, scroll-snap up/down
   - the visible reel plays, everything else pauses
   - lazy source loading: only the active reel ±2 carry src
   - muted autoplay with a clear unmute control (state is
     global: unmute once, the whole feed follows)
   - Darb chrome only: programme badge, title, share/copy,
     episode-page link, progress hairline. No social-clone UI.
   - keyboard: ↑/↓ navigate, Space play/pause, M mute, Esc exit
   - URL keeps ?e={id} of the active reel so links share cleanly
   ========================================================= */
(function () {
  "use strict";

  var D = window.DARB;
  if (!D || !document.body.matches('[data-page="reels"]')) return;

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  var AR = "٠١٢٣٤٥٦٧٨٩";
  function arNum(n) { return String(n).replace(/\d/g, function (d) { return AR[+d]; }); }
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#' + name + '"></use></svg>';
  }
  var dateFmt;
  try { dateFmt = new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }); } catch (e) {}
  function fmtDate(iso) { return dateFmt ? dateFmt.format(new Date(iso + "T12:00:00")) : iso; }

  var progBySlug = {};
  D.programs.forEach(function (p) { progBySlug[p.slug] = p; });

  /* feed order: newest first; ?e= picks the entry point */
  var eps = D.episodes.slice()
    .filter(function (e) { return e.video && e.video.type === "mp4" && e.video.src; })
    .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  var startId = new URLSearchParams(location.search).get("e");
  var startIndex = Math.max(0, eps.findIndex(function (e) { return e.id === startId; }));

  var feed = $("#reelsFeed");
  var globalMuted = true;
  var userPaused = false;

  /* ---------- build ---------- */
  feed.innerHTML = eps.map(function (ep, i) {
    var p = progBySlug[ep.program] || {};
    return (
      '<section class="rf-item" data-i="' + i + '" data-id="' + ep.id + '">' +
      /* the frame's own poster, blurred, fills the desktop letterbox so the
         surround belongs to the reel instead of being dead black */
      (ep.video.poster ? '<div class="rf-bg" style="background-image:url(' + esc(ep.video.poster) + ')" aria-hidden="true"></div>' : "") +
      '<div class="rf-frame">' +
      '<video class="rf-video" playsinline loop muted preload="none" poster="' + esc(ep.video.poster || "") + '" data-src="' + esc(ep.video.src) + '"></video>' +
      '<div class="rf-scrim" aria-hidden="true"></div>' +

      /* pause / buffering indicators */
      '<div class="rf-state" aria-hidden="true">' + icon("i-play", "icon--fill") + "</div>" +

      /* bottom info — Darb voice, not a social clone */
      '<div class="rf-info">' +
      '<a class="rf-prog" href="program.html?p=' + esc(ep.program) + '">' + icon("i-play", "icon--fill") + esc(p.title || "") + "</a>" +
      '<h2 class="rf-title">' + esc(ep.title) + "</h2>" +
      '<div class="rf-meta">' + fmtDate(ep.date) + ' · <span class="ltr-num">' + esc(ep.duration) + "</span></div>" +
      "</div>" +

      /* side actions */
      '<div class="rf-actions">' +
      '<button class="rf-act" data-act="mute" aria-label="الصوت">' + icon("i-vol") + icon("i-vol-x", "rf-ic-muted") + "</button>" +
      '<button class="rf-act" data-act="share" aria-label="مشاركة">' + icon("i-share") + "</button>" +
      '<button class="rf-act" data-act="copy" aria-label="نسخ الرابط">' + icon("i-copy") + "</button>" +
      '<a class="rf-act" href="episode.html?e=' + ep.id + '" aria-label="صفحة الحلقة">' + icon("i-info") + "</a>" +
      "</div>" +

      /* progress hairline */
      '<div class="rf-progress"><i></i></div>' +
      "</div></section>"
    );
  }).join("");

  var items = $$(".rf-item", feed);

  /* ---------- source windowing (active ±2) ---------- */
  function ensureSrc(item) {
    var v = $(".rf-video", item);
    if (v && !v.src && v.dataset.src) { v.src = v.dataset.src; v.load(); }
  }
  function windowSources(activeI) {
    for (var i = Math.max(0, activeI - 2); i <= Math.min(items.length - 1, activeI + 2); i++) {
      ensureSrc(items[i]);
    }
    /* release anything far outside the window so memory stays flat over a
       long feed — the poster keeps the card looking identical */
    items.forEach(function (it, i) {
      if (Math.abs(i - activeI) <= 4) return;
      var v = $(".rf-video", it);
      if (v && v.src) { v.pause(); v.removeAttribute("src"); v.load(); }
    });
  }

  /* ---------- playback control ---------- */
  var activeItem = null;

  function applyMuteUI(item) {
    item.classList.toggle("rf-muted", globalMuted);
  }
  function playItem(item) {
    if (activeItem === item) return;
    if (activeItem) stopItem(activeItem);
    activeItem = item;
    userPaused = false;
    ensureSrc(item);
    windowSources(+item.dataset.i);
    var v = $(".rf-video", item);
    v.muted = globalMuted;
    applyMuteUI(item);
    item.classList.add("rf-active");
    v.play().catch(function () {});
    /* share-friendly URL */
    history.replaceState(null, "", "reels.html?e=" + item.dataset.id);
  }
  function stopItem(item) {
    var v = $(".rf-video", item);
    v.pause();
    item.classList.remove("rf-active", "rf-paused");
  }

  var io = new IntersectionObserver(function (entries) {
    /* pick the most-visible item each callback, so a snap always resolves
       to exactly one active reel */
    var best = null, bestR = 0;
    entries.forEach(function (en) {
      if (en.intersectionRatio > bestR) { bestR = en.intersectionRatio; best = en.target; }
    });
    if (best && bestR >= 0.55) playItem(best);
  }, { root: feed, threshold: [0.3, 0.55, 0.8] });
  items.forEach(function (it) { io.observe(it); });

  /* progress hairline + ended-still-loops (loop attr handles restart) */
  feed.addEventListener("timeupdate", function (e) {
    var v = e.target;
    if (!v.matches(".rf-video") || !v.duration) return;
    var item = v.closest(".rf-item");
    $(".rf-progress i", item).style.width = (v.currentTime / v.duration * 100) + "%";
  }, true);
  feed.addEventListener("waiting", function (e) {
    if (e.target.matches(".rf-video")) e.target.closest(".rf-item").classList.add("rf-buffering");
  }, true);
  feed.addEventListener("playing", function (e) {
    if (e.target.matches(".rf-video")) e.target.closest(".rf-item").classList.remove("rf-buffering");
  }, true);

  /* ---------- interactions ---------- */
  function toggleMute() {
    globalMuted = !globalMuted;
    items.forEach(applyMuteUI);
    if (activeItem) $(".rf-video", activeItem).muted = globalMuted;
  }
  function togglePlay(item) {
    var v = $(".rf-video", item);
    if (v.paused) { userPaused = false; v.play().catch(function () {}); item.classList.remove("rf-paused"); }
    else { userPaused = true; v.pause(); item.classList.add("rf-paused"); }
  }
  function shortLink(id) {
    return location.origin === "null" || location.protocol === "file:"
      ? location.href.replace(/[^/\\]*$/, "") + "episode.html?e=" + id
      : location.origin + location.pathname.replace(/[^/]*$/, "") + "episode.html?e=" + id;
  }
  function toast(msg) {
    var t = $(".rf-toast") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "rf-toast" }));
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  feed.addEventListener("click", function (e) {
    var act = e.target.closest("[data-act]");
    var item = e.target.closest(".rf-item");
    if (!item) return;
    if (act) {
      var id = item.dataset.id;
      var kind = act.getAttribute("data-act");
      if (kind === "mute") toggleMute();
      else if (kind === "copy") {
        var link = shortLink(id);
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(link).then(function () { toast("تم نسخ الرابط"); });
        else { var ta = document.createElement("textarea"); ta.value = link; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("تم نسخ الرابط"); } catch (err) {} ta.remove(); }
      } else if (kind === "share") {
        var ep = eps[+item.dataset.i];
        if (navigator.share) navigator.share({ title: ep.title, url: shortLink(id) }).catch(function () {});
        else { act.setAttribute("data-act", "copy"); act.click(); act.setAttribute("data-act", "share"); }
      }
      return;
    }
    /* tap on the video toggles play/pause */
    if (e.target.closest(".rf-frame") && !e.target.closest("a")) togglePlay(item);
  });

  /* desktop arrows */
  function step(dir) {
    var i = activeItem ? +activeItem.dataset.i : startIndex;
    var next = items[Math.min(items.length - 1, Math.max(0, i + dir))];
    if (next) next.scrollIntoView({ behavior: "smooth" });
  }
  $("#rfPrev").addEventListener("click", function () { step(-1); });
  $("#rfNext").addEventListener("click", function () { step(1); });

  document.addEventListener("keydown", function (e) {
    if (e.target && e.target.matches && e.target.matches("input, textarea, select")) return;
    var k = e.key;
    var used = true;
    if (k === "ArrowUp") step(-1);
    else if (k === "ArrowDown") step(1);
    else if (k === " " || k.toLowerCase() === "k") { if (activeItem) togglePlay(activeItem); }
    else if (k.toLowerCase() === "m") toggleMute();
    else if (k === "Escape") exitFeed();
    else used = false;
    if (used) e.preventDefault();
  });

  function exitFeed() {
    if (history.length > 1 && document.referrer.indexOf(location.host) !== -1) history.back();
    else location.href = "index.html";
  }
  $("#rfClose").addEventListener("click", exitFeed);

  /* pause everything when the tab hides */
  document.addEventListener("visibilitychange", function () {
    if (!activeItem) return;
    var v = $(".rf-video", activeItem);
    if (document.hidden) v.pause();
    else if (!userPaused) v.play().catch(function () {});
  });

  /* scroll fallback: after any scroll settles, activate the centred item.
     Covers the initial programmatic jump and any IO timing edge. */
  var settleT;
  feed.addEventListener("scroll", function () {
    clearTimeout(settleT);
    settleT = setTimeout(function () {
      var mid = feed.scrollTop + feed.clientHeight / 2;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (it.offsetTop <= mid && it.offsetTop + it.offsetHeight > mid) {
          playItem(it);
          break;
        }
      }
    }, 120);
  }, { passive: true });

  /* ---------- start ---------- */
  windowSources(startIndex);
  if (startIndex > 0) items[startIndex].scrollIntoView();
  playItem(items[startIndex]);
})();
