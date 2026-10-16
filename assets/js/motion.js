/* =============================================================
   motion.js
   Animazioni del sito: reveal allo scroll, contatori, testo che si
   accende, effetto riflettore sulle card, hero con sfera di particelle
   che cambia forma, alone del cursore, barra di avanzamento.
   Tutto e' un miglioramento: senza JS il contenuto resta visibile,
   e con "riduci movimento" attivo nel sistema le animazioni si fermano.
   ============================================================= */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* ----- Header: stato "scrolled" e barra di avanzamento ---- */
  var header = $(".site-header");
  var bar = doc.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  doc.body.appendChild(bar);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.pageYOffset || root.scrollTop;
      var max = root.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle("is-scrolled", y > 24);
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      root.style.setProperty("--sy", y + "px");
      updateScrub();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ----- Reveal allo scroll ------------------------------- *
   * Gli elementi vengono marcati in automatico, cosi' le pagine
   * interne non hanno bisogno di attributi aggiuntivi nell'HTML.
   */
  var autoTargets = [
    ".section .container-tight > .section-label",
    ".section .container-tight > h1",
    ".section .container-tight > h2",
    ".section .container-tight > .lead",
    ".section .container-tight > .text-measure",
    ".section-head",
    ".stat",
    ".about__media",
    ".about__text > *",
    ".method li",
    ".skill-card",
    ".project-card",
    ".case-card",
    ".blog-teaser__row",
    ".post-card",
    ".newsletter-box",
    ".cv-header",
    ".cv-section",
    ".cv-entry",
    ".contact-layout > *",
    ".case-filters",
    ".blog-filters",
    ".cta-title",
    ".section--ink .container-tight > *"
  ];

  function markReveal() {
    autoTargets.forEach(function (sel) {
      $$(sel).forEach(function (el) {
        if (el.hasAttribute("data-reveal") || el.closest(".article__body") || el.closest("dialog")) return;
        el.setAttribute("data-reveal", "");
        // ritardo a cascata tra fratelli dello stesso gruppo
        var siblings = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) {
          return c.matches(sel);
        }) : [];
        var idx = siblings.indexOf(el);
        if (idx > 0) el.style.setProperty("--i", Math.min(idx, 6));
      });
    });
  }

  /* a reveal concluso l'attributo viene tolto: cosi' le transizioni e gli
     hover propri di ogni card tornano a funzionare senza conflitti */
  function finishReveal(el) {
    var wait = 1100 + (parseInt(el.style.getPropertyValue("--i"), 10) || 0) * 90;
    window.setTimeout(function () {
      el.removeAttribute("data-reveal");
      el.classList.remove("is-in");
      el.style.removeProperty("--i");
    }, wait);
  }

  function observeReveal() {
    var items = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.removeAttribute("data-reveal"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          finishReveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ----- Contatori ---------------------------------------- */
  function initCounters() {
    var counters = $$("[data-count]");
    if (!counters.length) return;

    function setValue(el, value) {
      el.textContent = String(Math.round(value));
    }

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (reduceMotion) { setValue(el, target); return; }
      var duration = 1800;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
        setValue(el, target * eased);
        if (t < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(function (el) { setValue(el, parseFloat(el.getAttribute("data-count"))); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      if (!reduceMotion) el.textContent = "0";
      io.observe(el);
    });
  }

  /* ----- Testo che si accende parola per parola ----------- */
  var scrubEls = [];
  function initScrub() {
    $$("[data-scrub]").forEach(function (el) {
      if (reduceMotion) return;
      var words = [];
      (function wrap(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var frag = doc.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(part)); return; }
              var span = doc.createElement("span");
              span.className = "sw";
              span.textContent = part;
              words.push(span);
              frag.appendChild(span);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1) {
            wrap(child);
          }
        });
      })(el);
      el.classList.add("scrub");
      scrubEls.push({ el: el, words: words });
    });
    updateScrub();
  }

  function updateScrub() {
    var vh = window.innerHeight;
    scrubEls.forEach(function (item) {
      var rect = item.el.getBoundingClientRect();
      // 0 quando il blocco entra dal basso, 1 quando e' a un terzo dall'alto
      var p = (vh * 0.88 - rect.top) / (vh * 0.88 - vh * 0.3 + rect.height * 0.35);
      p = Math.max(0, Math.min(1, p));
      var lit = Math.round(p * item.words.length);
      for (var i = 0; i < item.words.length; i++) {
        item.words[i].classList.toggle("is-lit", i < lit);
      }
    });
  }

  /* ----- Effetto riflettore sulle card -------------------- */
  function initSpotlight() {
    if (!finePointer) return;
    $$(".skill-card, .project-card, .case-card, .post-card, .stat").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ----- Bottoni "magnetici" ------------------------------ */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    $$(".hero__actions .btn, .cta-magnet .btn").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.32;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* ----- Alone che segue il cursore ----------------------- */
  function initCursorGlow() {
    if (!finePointer || reduceMotion) return;
    var glow = doc.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    doc.body.appendChild(glow);
    var tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px)";
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        window.requestAnimationFrame(loop);
      } else { running = false; }
    }
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add("is-on");
      if (!running) { running = true; window.requestAnimationFrame(loop); }
    }, { passive: true });
    doc.addEventListener("pointerleave", function () { glow.classList.remove("is-on"); });
  }

  /* ----- Hero: sfera di particelle che cambia forma -------- */
  function initOrb() {
    var canvas = $(".hero__orb canvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var N = 1250;
    var GOLD = Math.PI * (3 - Math.sqrt(5));

    /* quattro forme: sfera, toro, onda, pallone da basket */
    function sphere() {
      var pts = [];
      for (var i = 0; i < N; i++) {
        var y = 1 - (i / (N - 1)) * 2;
        var r = Math.sqrt(1 - y * y);
        var th = GOLD * i;
        pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
      }
      return pts;
    }
    function torus() {
      var pts = [];
      for (var i = 0; i < N; i++) {
        var u = (i / N) * Math.PI * 2 * 1;
        var v = ((i * 0.61803398875) % 1) * Math.PI * 2;
        var R = 0.72, r = 0.3;
        pts.push([(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v) * 1.4, (R + r * Math.cos(v)) * Math.sin(u)]);
      }
      return pts;
    }
    function wave() {
      var pts = [];
      var side = Math.ceil(Math.sqrt(N));
      for (var i = 0; i < N; i++) {
        var gx = i % side, gz = Math.floor(i / side);
        var x = (gx / (side - 1)) * 2 - 1;
        var z = (gz / (side - 1)) * 2 - 1;
        var y = Math.sin(x * 4.2) * Math.cos(z * 4.2) * 0.32;
        pts.push([x * 1.05, y, z * 1.05]);
      }
      return pts;
    }
    function ball() {
      /* sfera con le cuciture del pallone: parte dei punti si addensa su cerchi massimi */
      var pts = [];
      var seam = Math.floor(N * 0.55);
      var per = Math.floor(seam / 4);
      var k, t;
      for (k = 0; k < per; k++) { // equatore
        t = (k / per) * Math.PI * 2;
        pts.push([Math.cos(t), 0, Math.sin(t)]);
      }
      for (k = 0; k < per; k++) { // meridiano
        t = (k / per) * Math.PI * 2;
        pts.push([0, Math.cos(t), Math.sin(t)]);
      }
      for (k = 0; k < per; k++) { // due archi laterali
        t = (k / per) * Math.PI * 2;
        var cx = 0.56, rr = Math.sqrt(1 - cx * cx);
        pts.push([cx + 0 * Math.cos(t), rr * Math.cos(t), rr * Math.sin(t)]);
      }
      for (k = 0; k < per; k++) {
        t = (k / per) * Math.PI * 2;
        var cx2 = -0.56, rr2 = Math.sqrt(1 - cx2 * cx2);
        pts.push([cx2, rr2 * Math.cos(t), rr2 * Math.sin(t)]);
      }
      var rest = N - pts.length;
      for (var i = 0; i < rest; i++) {
        var y = 1 - (i / (rest - 1)) * 2;
        var r = Math.sqrt(1 - y * y);
        var th = GOLD * i;
        pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
      }
      return pts;
    }

    var shapes = [sphere(), ball(), torus(), wave()];
    var cur = shapes[0].map(function (p) { return p.slice(); });
    var from = cur.map(function (p) { return p.slice(); });
    var target = 0;
    var morphStart = 0;
    var MORPH = 2400;      // durata morph
    var HOLD = 5200;       // pausa tra forme
    var nextSwitch = 0;

    /* sprite luminoso pre-renderizzato: molto piu' veloce di gradienti per punto */
    var sprite = doc.createElement("canvas");
    sprite.width = sprite.height = 64;
    var sctx = sprite.getContext("2d");
    var grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,240,215,1)");
    grad.addColorStop(0.24, "rgba(255,150,70,0.95)");
    grad.addColorStop(0.55, "rgba(255,74,34,0.3)");
    grad.addColorStop(1, "rgba(255,74,34,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);

    var w = 0, h = 0, dpr = 1;
    function resize() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", function () { resize(); if (reduceMotion) draw(0); });

    var mx = 0, my = 0, smx = 0, smy = 0;
    if (finePointer) {
      window.addEventListener("pointermove", function (e) {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);

      // morph tra le forme
      if (!reduceMotion) {
        if (time > nextSwitch && morphStart === 0) {
          from = cur.map(function (p) { return p.slice(); });
          target = (target + 1) % shapes.length;
          morphStart = time;
        }
        if (morphStart !== 0) {
          var t = Math.min((time - morphStart) / MORPH, 1);
          var e = ease(t);
          var dest = shapes[target];
          for (var i = 0; i < N; i++) {
            cur[i][0] = from[i][0] + (dest[i][0] - from[i][0]) * e;
            cur[i][1] = from[i][1] + (dest[i][1] - from[i][1]) * e;
            cur[i][2] = from[i][2] + (dest[i][2] - from[i][2]) * e;
          }
          if (t >= 1) { morphStart = 0; nextSwitch = time + HOLD; }
        }
      }

      smx += (mx - smx) * 0.05;
      smy += (my - smy) * 0.05;

      var ang = reduceMotion ? 0.6 : time * 0.00022 + smx * 0.6;
      var tilt = 0.38 + smy * 0.25;
      var ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tilt), st = Math.sin(tilt);
      var cx = w / 2, cy = h / 2;
      var R = Math.min(w, h) * 0.34;
      var focal = 3.2;
      var pulse = reduceMotion ? 1 : 1 + Math.sin(time * 0.0011) * 0.025;

      // anelli tecnici attorno alla forma
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 1;
      for (var ring = 0; ring < 3; ring++) {
        var rr = R * (1.28 + ring * 0.2) * pulse;
        ctx.strokeStyle = "rgba(255,138,61," + (0.22 - ring * 0.05) + ")";
        ctx.setLineDash(ring === 1 ? [2, 7] : ring === 2 ? [14, 10] : []);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr, rr * (0.34 + smy * 0.05 + ring * 0.06), ang * (ring % 2 ? -0.6 : 0.5) + ring, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // particelle
      ctx.globalCompositeOperation = "lighter";
      for (var j = 0; j < N; j++) {
        var p = cur[j];
        var x = p[0], y = p[1], z = p[2];
        // piccola ondulazione continua, cosi' la forma "respira"
        if (!reduceMotion) {
          var wob = 1 + Math.sin(time * 0.0012 + j * 0.37) * 0.012;
          x *= wob; y *= wob; z *= wob;
        }
        var rx = x * ca + z * sa;
        var rz = -x * sa + z * ca;
        var ry = y * ct - rz * st;
        var rz2 = y * st + rz * ct;
        var s = focal / (focal + rz2 * 0.9);
        var sx = cx + rx * R * s * pulse;
        var sy = cy + ry * R * s * pulse;
        var depth = (rz2 + 1.4) / 2.8;           // 0 dietro, 1 davanti
        var size = (7 + depth * 17) * s * (R / 300);
        ctx.globalAlpha = Math.max(0.12, Math.min(1, depth * 1.15));
        ctx.drawImage(sprite, sx - size / 2, sy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    if (reduceMotion) { draw(0); return; }

    var visible = true, rafId = 0;
    function frame(ts) {
      draw(ts);
      if (visible && !doc.hidden) rafId = window.requestAnimationFrame(frame);
      else rafId = 0;
    }
    function start() { if (!rafId) rafId = window.requestAnimationFrame(frame); }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }, { threshold: 0 }).observe(canvas);
    }
    doc.addEventListener("visibilitychange", function () { if (!doc.hidden) start(); });
    nextSwitch = 3200;
    start();
  }

  /* ----- Hero: ingresso del titolo ------------------------ */
  function initHero() {
    var hero = $(".hero");
    if (!hero) return;
    var go = function () { hero.classList.add("is-ready"); };
    if (doc.fonts && doc.fonts.ready) {
      Promise.race([doc.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
        window.requestAnimationFrame(go);
      });
    } else { go(); }

    // la sfera sale lentamente mentre si scorre la pagina
    var orb = $(".hero__orb");
    if (orb && !reduceMotion) {
      window.addEventListener("scroll", function () {
        var y = window.pageYOffset;
        if (y > window.innerHeight * 1.2) return;
        orb.style.transform = "translateY(calc(-50% + " + (y * 0.18) + "px))";
        orb.style.setProperty("--orb-fade", String(Math.max(0, 1 - y / (window.innerHeight * 0.9))));
      }, { passive: true });
    }
  }

  /* ----- Progetti: filtri e finestra di dettaglio --------- */
  function initCases() {
    var filters = $$(".case-filter");
    var cards = $$(".case-card");
    if (filters.length && cards.length) {
      filters.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var f = btn.getAttribute("data-filter");
          filters.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
          btn.classList.add("is-active");
          btn.setAttribute("aria-pressed", "true");
          cards.forEach(function (card) {
            var cats = (card.getAttribute("data-categories") || "").split(" ");
            var show = f === "tutti" || cats.indexOf(f) !== -1;
            card.hidden = !show;
            if (show && !reduceMotion) {
              card.classList.remove("pop");
              void card.offsetWidth;
              card.classList.add("pop");
            }
          });
        });
      });
    }

    $$("[data-open-case]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dlg = doc.getElementById(btn.getAttribute("data-open-case"));
        if (dlg && typeof dlg.showModal === "function") {
          dlg.showModal();
          doc.body.style.overflow = "hidden";
        } else if (dlg) {
          dlg.setAttribute("open", "");
        }
      });
    });
    $$("dialog.case-dialog").forEach(function (dlg) {
      dlg.addEventListener("close", function () { doc.body.style.overflow = ""; });
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg) dlg.close();            // click sullo sfondo
      });
      $$("[data-close-case]", dlg).forEach(function (b) {
        b.addEventListener("click", function () { dlg.close(); });
      });
    });
  }

  /* ----- Avvio -------------------------------------------- */
  markReveal();
  observeReveal();
  initCounters();
  initScrub();
  initSpotlight();
  initMagnetic();
  initCursorGlow();
  initHero();
  initOrb();
  initCases();
  onScroll();
})();
