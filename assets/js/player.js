/* =========================================================
   DarbPlayer — custom video player for Darb Media
   ---------------------------------------------------------
   Features:
   - custom controls: seek bar (buffered + played + drag +
     hover time tooltip), play/pause, ±10s, time readout,
     playback rate, volume + mute, Picture-in-Picture,
     fullscreen, next-episode
   - floating mini-player: when the player scrolls out of
     view while playing, it docks to the corner (CSS class
     only — the <video> element is never re-parented, so
     playback never restarts)
   - keyboard shortcuts: Space/K play, M mute, F fullscreen,
     P PiP, arrows ±5s, J/L ±10s, ↑/↓ volume, 0–9 jump %
   - resume: position saved per episode in localStorage,
     restored when >10s in and <95% done
   - remembered volume + rate across the site
   - auto-hiding controls, buffering spinner, end screen
     with next-episode countdown
   Works on the mp4 source type. YouTube/Telegram embeds keep
   their own chrome (the floating dock still works for them
   via the same slot technique in app.js).
   ========================================================= */
(function () {
  "use strict";

  var LS_VOL = "darb:vol";
  var LS_RATE = "darb:rate";
  var RATES = [1, 1.25, 1.5, 1.75, 2, 0.75];

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#' + name + '"></use></svg>';
  }
  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    t = Math.round(t);
    var h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
    var mm = (h ? String(m).padStart(2, "0") : m), ss = String(s).padStart(2, "0");
    return (h ? h + ":" : "") + mm + ":" + ss;
  }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /**
   * opts: {
   *   src, poster, title, storageKey,
   *   next: {title, href} | null,
   *   float: bool (default true) — dock when scrolled away while playing
   * }
   */
  function DarbPlayer(slot, opts) {
    this.slot = slot;
    this.opts = opts || {};
    this._teardown = [];
    this._build();
    this._wire();
  }

  DarbPlayer.prototype._on = function (target, ev, fn, o) {
    target.addEventListener(ev, fn, o);
    this._teardown.push(function () { target.removeEventListener(ev, fn, o); });
  };

  /* ---------------- DOM ---------------- */
  DarbPlayer.prototype._build = function () {
    var o = this.opts;
    var root = el("div", "dp");
    root.tabIndex = 0;

    var video = el("video", "dp-video");
    video.src = o.src;
    video.playsInline = true;
    video.preload = "metadata";
    if (o.poster) video.poster = o.poster;

    /* floating-mode top bar */
    var dock = el("div", "dp-dock",
      '<button class="dp-dock-btn" data-dp="expand" aria-label="العودة إلى المشغّل">' + icon("i-expand") + "</button>" +
      '<span class="dp-dock-title">' + (o.title || "") + "</span>" +
      '<button class="dp-dock-btn" data-dp="close" aria-label="إغلاق المشغّل العائم">' + icon("i-close") + "</button>");

    /* center overlays */
    var big = el("button", "dp-big", '<span class="dp-big-disc">' + icon("i-play", "icon--fill") + "</span>");
    big.setAttribute("aria-label", "تشغيل");
    var spin = el("div", "dp-spin", "<i></i>");

    /* end screen */
    var end = el("div", "dp-end");
    end.innerHTML =
      '<button class="dp-end-replay" data-dp="replay">' + icon("i-replay") + "إعادة التشغيل</button>" +
      (o.next
        ? '<a class="dp-end-next" href="' + o.next.href + '">' +
          '<span class="dp-end-kick">التالي في البرنامج<span class="dp-count" data-dp="count"></span></span>' +
          '<span class="dp-end-title">' + o.next.title + "</span>" +
          '<button class="dp-end-cancel" data-dp="cancelnext">إلغاء</button></a>'
        : "");

    /* controls */
    var ctl = el("div", "dp-ctl");
    ctl.innerHTML =
      '<div class="dp-track" data-dp="track">' +
      '<div class="dp-buf"></div><div class="dp-played"><i class="dp-thumb"></i></div>' +
      '<div class="dp-tip" dir="ltr">0:00</div>' +
      "</div>" +
      '<div class="dp-row">' +
      '<button class="dp-btn" data-dp="play" aria-label="تشغيل">' + icon("i-play", "icon--fill") + icon("i-pause", "icon--fill dp-ic-pause") + "</button>" +
      (o.next ? '<a class="dp-btn" href="' + o.next.href + '" aria-label="الحلقة التالية" title="الحلقة التالية">' + icon("i-next", "icon--fill") + "</a>" : "") +
      '<button class="dp-btn" data-dp="back" aria-label="رجوع ١٠ ثوانٍ">' + icon("i-b10") + "</button>" +
      '<button class="dp-btn" data-dp="fwd" aria-label="تقديم ١٠ ثوانٍ">' + icon("i-f10") + "</button>" +
      '<span class="dp-time" dir="ltr"><span data-dp="cur">0:00</span><span class="dp-time-sep">/</span><span data-dp="dur">0:00</span></span>' +
      '<span class="dp-flex"></span>' +
      '<button class="dp-btn dp-rate" data-dp="rate" aria-label="سرعة التشغيل" dir="ltr">1×</button>' +
      '<button class="dp-btn dp-pip" data-dp="pip" aria-label="صورة داخل صورة">' + icon("i-pip") + "</button>" +
      '<span class="dp-volwrap"><button class="dp-btn" data-dp="mute" aria-label="كتم الصوت">' +
      icon("i-vol") + icon("i-vol-x", "dp-ic-muted") + "</button>" +
      '<span class="dp-vol" data-dp="vol"><span class="dp-vol-track"><i></i></span></span></span>' +
      '<button class="dp-btn" data-dp="full" aria-label="ملء الشاشة">' + icon("i-full") + icon("i-full-x", "dp-ic-fullx") + "</button>" +
      "</div>";

    root.appendChild(video);
    root.appendChild(dock);
    root.appendChild(spin);
    root.appendChild(big);
    root.appendChild(end);
    root.appendChild(ctl);

    this.root = root;
    this.video = video;
    this.ui = {
      track: ctl.querySelector('[data-dp="track"]'),
      buf: ctl.querySelector(".dp-buf"),
      played: ctl.querySelector(".dp-played"),
      tip: ctl.querySelector(".dp-tip"),
      cur: ctl.querySelector('[data-dp="cur"]'),
      dur: ctl.querySelector('[data-dp="dur"]'),
      rate: ctl.querySelector('[data-dp="rate"]'),
      vol: ctl.querySelector('[data-dp="vol"] i'),
      volSlider: ctl.querySelector('[data-dp="vol"]'),
      pip: ctl.querySelector('[data-dp="pip"]'),
      count: end.querySelector('[data-dp="count"]'),
      big: big, end: end, ctl: ctl,
    };

    this.slot.innerHTML = "";
    this.slot.appendChild(root);

    /* restore user prefs */
    var v = parseFloat(read(LS_VOL)); if (!isNaN(v)) video.volume = Math.min(1, Math.max(0, v));
    var r = parseFloat(read(LS_RATE)); if (!isNaN(r) && RATES.indexOf(r) !== -1) { video.playbackRate = r; this.ui.rate.textContent = r + "×"; }
    if (!("pictureInPictureEnabled" in document)) this.ui.pip.style.display = "none";
  };

  /* ---------------- behaviour ---------------- */
  DarbPlayer.prototype._wire = function () {
    var self = this, v = this.video, root = this.root, o = this.opts;

    function setPlaying(p) { root.classList.toggle("dp-playing", p); }
    function togglePlay() { if (v.paused || v.ended) v.play(); else v.pause(); }

    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-dp]");
      if (!b) { if (!e.target.closest(".dp-ctl") && !e.target.closest(".dp-dock")) togglePlay(); return; }
      var k = b.getAttribute("data-dp");
      if (k === "play") togglePlay();
      else if (k === "back") v.currentTime = Math.max(0, v.currentTime - 10);
      else if (k === "fwd") v.currentTime = Math.min(v.duration || 1e9, v.currentTime + 10);
      else if (k === "rate") self._cycleRate();
      else if (k === "mute") { v.muted = !v.muted; root.classList.toggle("dp-muted", v.muted); }
      else if (k === "pip") self._pip();
      else if (k === "full") self._fullscreen();
      else if (k === "replay") { self._cancelNext(); v.currentTime = 0; v.play(); }
      else if (k === "cancelnext") { e.preventDefault(); e.stopPropagation(); self._cancelNext(); }
      else if (k === "close") { v.pause(); self._setFloat(false); self.userClosedFloat = true; }
      else if (k === "expand") { self._setFloat(false); self.slot.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });
    this.ui.big.addEventListener("click", function (e) { e.stopPropagation(); togglePlay(); });
    root.addEventListener("dblclick", function (e) {
      if (!e.target.closest(".dp-ctl")) self._fullscreen();
    });

    this._on(v, "play", function () { setPlaying(true); root.classList.remove("dp-ended"); self._armHide(); });
    this._on(v, "pause", function () { setPlaying(false); self._showCtl(); self._savePos(); });
    this._on(v, "waiting", function () { root.classList.add("dp-buffering"); });
    this._on(v, "playing", function () { root.classList.remove("dp-buffering"); });
    this._on(v, "ended", function () { root.classList.add("dp-ended"); self._showCtl(); self._startNextCountdown(); self._clearPos(); });
    this._on(v, "ratechange", function () { self.ui.rate.textContent = v.playbackRate + "×"; });
    this._on(v, "volumechange", function () {
      root.classList.toggle("dp-muted", v.muted || v.volume === 0);
      self.ui.vol.style.width = (v.muted ? 0 : v.volume * 100) + "%";
      store(LS_VOL, v.volume);
    });
    this._on(v, "durationchange", function () { self.ui.dur.textContent = fmt(v.duration); });
    this._on(v, "loadedmetadata", function () { self._resume(); });
    this._on(v, "timeupdate", function () { self._paint(); });
    this._on(v, "progress", function () { self._paintBuf(); });

    v.dispatchEvent(new Event("volumechange"));

    /* seek bar: pointer drag + hover tooltip */
    var track = this.ui.track, dragging = false;
    function pct(e) {
      var r = track.getBoundingClientRect();
      return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    }
    this._on(track, "pointerdown", function (e) {
      dragging = true;
      /* the pointer can be gone by now (fast tap release) — capture is
         an optimisation, never worth an uncaught NotFoundError */
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
      v.currentTime = pct(e) * (v.duration || 0);
    });
    this._on(track, "pointermove", function (e) {
      var p = pct(e);
      self.ui.tip.textContent = fmt(p * (v.duration || 0));
      self.ui.tip.style.left = (p * 100) + "%";
      if (dragging) v.currentTime = p * (v.duration || 0);
    });
    this._on(track, "pointerup", function () { dragging = false; });

    /* volume slider */
    var vol = this.ui.volSlider, vdrag = false;
    function vpct(e) {
      var r = vol.getBoundingClientRect();
      return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    }
    this._on(vol, "pointerdown", function (e) { vdrag = true; try { vol.setPointerCapture(e.pointerId); } catch (err) {} v.muted = false; v.volume = vpct(e); });
    this._on(vol, "pointermove", function (e) { if (vdrag) v.volume = vpct(e); });
    this._on(vol, "pointerup", function () { vdrag = false; });

    /* auto-hide controls */
    this._on(root, "pointermove", function () { self._showCtl(); self._armHide(); });
    this._on(root, "pointerleave", function () { if (!v.paused) root.classList.add("dp-idle"); });

    /* keyboard — active while the player is on the page */
    this._on(document, "keydown", function (e) {
      if (e.target && e.target.matches &&
          e.target.matches("input, textarea, select, [contenteditable]")) return;
      var k = e.key.toLowerCase();
      var used = true;
      if (k === " " || k === "k") togglePlay();
      else if (k === "m") v.muted = !v.muted;
      else if (k === "f") self._fullscreen();
      else if (k === "p") self._pip();
      else if (e.key === "ArrowRight") v.currentTime += 5;
      else if (e.key === "ArrowLeft") v.currentTime -= 5;
      else if (e.key === "ArrowUp") { v.muted = false; v.volume = Math.min(1, v.volume + 0.05); }
      else if (e.key === "ArrowDown") v.volume = Math.max(0, v.volume - 0.05);
      else if (k === "l") v.currentTime += 10;
      else if (k === "j") v.currentTime -= 10;
      else if (/^[0-9]$/.test(k) && v.duration) v.currentTime = v.duration * (+k / 10);
      else used = false;
      if (used) { e.preventDefault(); self._showCtl(); self._armHide(); }
    });

    /* fullscreen state class */
    this._on(document, "fullscreenchange", function () {
      root.classList.toggle("dp-full", document.fullscreenElement === root);
    });

    /* position persistence */
    this._posTimer = setInterval(function () { if (!v.paused && !v.ended) self._savePos(); }, 5000);
    this._teardown.push(function () { clearInterval(self._posTimer); });
    this._on(window, "beforeunload", function () { self._savePos(); });

    /* floating dock */
    if (o.float !== false && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        var visible = en[0].isIntersecting;
        if (!visible && !v.paused && !v.ended && !self.userClosedFloat) self._setFloat(true);
        else if (visible) { self._setFloat(false); self.userClosedFloat = false; }
      }, { threshold: 0.25 });
      io.observe(this.slot);
      this._teardown.push(function () { io.disconnect(); });
    }
  };

  /* ---------------- helpers ---------------- */
  DarbPlayer.prototype._paint = function () {
    var v = this.video;
    if (v.duration) this.ui.played.style.width = (v.currentTime / v.duration * 100) + "%";
    this.ui.cur.textContent = fmt(v.currentTime);
    this._paintBuf(); /* small files often buffer before the first progress event */
  };
  DarbPlayer.prototype._paintBuf = function () {
    var v = this.video;
    try {
      if (v.buffered.length && v.duration) {
        this.ui.buf.style.width = (v.buffered.end(v.buffered.length - 1) / v.duration * 100) + "%";
      }
    } catch (e) {}
  };
  DarbPlayer.prototype._cycleRate = function () {
    var v = this.video;
    var i = RATES.indexOf(v.playbackRate);
    v.playbackRate = RATES[(i + 1) % RATES.length];
    store(LS_RATE, v.playbackRate);
  };
  DarbPlayer.prototype._pip = function () {
    var v = this.video;
    if (!document.pictureInPictureEnabled) return;
    if (document.pictureInPictureElement) document.exitPictureInPicture();
    else v.requestPictureInPicture().catch(function () {});
  };
  DarbPlayer.prototype._fullscreen = function () {
    var root = this.root, v = this.video;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (root.requestFullscreen) root.requestFullscreen();
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); /* iOS */
  };
  DarbPlayer.prototype._showCtl = function () { this.root.classList.remove("dp-idle"); };
  DarbPlayer.prototype._armHide = function () {
    var self = this;
    clearTimeout(this._hideT);
    this._hideT = setTimeout(function () {
      if (!self.video.paused && !self.video.ended) self.root.classList.add("dp-idle");
    }, 2800);
  };

  DarbPlayer.prototype._setFloat = function (on) {
    this.root.classList.toggle("dp-float", on);
    document.body.classList.toggle("has-dp-float", on);
  };

  /* resume position */
  DarbPlayer.prototype._savePos = function () {
    if (!this.opts.storageKey) return;
    var v = this.video;
    if (v.duration && v.currentTime > 5 && v.currentTime < v.duration * 0.95) {
      store("darb:pos:" + this.opts.storageKey, v.currentTime);
    }
  };
  DarbPlayer.prototype._clearPos = function () {
    if (this.opts.storageKey) { try { localStorage.removeItem("darb:pos:" + this.opts.storageKey); } catch (e) {} }
  };
  DarbPlayer.prototype._resume = function () {
    if (!this.opts.storageKey) return;
    var t = parseFloat(read("darb:pos:" + this.opts.storageKey));
    var v = this.video;
    /* same floor as _savePos — anything saved is worth restoring */
    if (!isNaN(t) && t > 5 && v.duration && t < v.duration * 0.95) {
      v.currentTime = t;
      var chip = el("div", "dp-resume", "استؤنف من " + fmt(t));
      this.root.appendChild(chip);
      setTimeout(function () { chip.classList.add("show"); }, 30);
      setTimeout(function () { chip.classList.remove("show"); }, 3600);
      setTimeout(function () { chip.remove(); }, 4200);
    }
  };

  /* next-episode countdown on the end screen */
  DarbPlayer.prototype._startNextCountdown = function () {
    var self = this;
    if (!this.opts.next || !this.ui.count) return;
    var left = 8;
    this.ui.count.textContent = " خلال " + left + " ثوانٍ";
    this._nextT = setInterval(function () {
      left--;
      if (left <= 0) { self._cancelNext(); location.href = self.opts.next.href; return; }
      self.ui.count.textContent = " خلال " + left + " ثوانٍ";
    }, 1000);
  };
  DarbPlayer.prototype._cancelNext = function () {
    clearInterval(this._nextT);
    if (this.ui.count) this.ui.count.textContent = "";
    this.root.classList.remove("dp-ended");
  };

  DarbPlayer.prototype.play = function () { this.video.play(); };
  DarbPlayer.prototype.destroy = function () {
    this._savePos();
    this._cancelNext();
    clearTimeout(this._hideT);
    this._setFloat(false);
    this._teardown.forEach(function (fn) { fn(); });
    this._teardown = [];
    this.video.pause();
    this.video.removeAttribute("src");
    this.video.load();
    this.root.remove();
  };

  window.DarbPlayer = DarbPlayer;
})();
