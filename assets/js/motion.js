/* =============================================================
   motion.js
   Poco movimento, solo dove serve: il bordo dell'header quando si
   scorre, i filtri e le finestre di dettaglio dei progetti.
   Senza JS il contenuto resta tutto visibile.
   ============================================================= */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* ----- Header: stato "scrolled" -------------------------- */
  var header = $(".site-header");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.pageYOffset || root.scrollTop;
      if (header) header.classList.toggle("is-scrolled", y > 24);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

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

    /* Ordinamento per data di uscita. Di partenza resta l'ordine dell'HTML;
       premendo di nuovo il pulsante attivo si torna a quello. */
    var sortButtons = $$(".case-sort .blog-sort__btn");
    var grid = $(".case-grid");
    var status = doc.getElementById("case-status");
    if (sortButtons.length && grid && cards.length) {
      cards.forEach(function (card, i) { card.setAttribute("data-seq", i); });
      var sortCards = function (mode) {
        cards.slice().sort(function (a, b) {
          var sa = Number(a.getAttribute("data-seq"));
          var sb = Number(b.getAttribute("data-seq"));
          if (!mode) return sa - sb;
          var da = a.getAttribute("data-date") || "";
          var db = b.getAttribute("data-date") || "";
          if (da === db) return sa - sb;
          return mode === "vecchi" ? (da < db ? -1 : 1) : (da < db ? 1 : -1);
        }).forEach(function (card) { grid.appendChild(card); });
      };
      sortButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var wasActive = btn.classList.contains("is-active");
          sortButtons.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
          var mode = null;
          if (!wasActive) {
            btn.classList.add("is-active");
            btn.setAttribute("aria-pressed", "true");
            mode = btn.getAttribute("data-sort");
          }
          sortCards(mode);
          if (status) {
            status.textContent = mode === "nuovi" ? "Progetti ordinati dal più recente al meno recente."
              : mode === "vecchi" ? "Progetti ordinati dal meno recente al più recente."
              : "Ordine di partenza.";
          }
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

  /* ----- Progetti: apre il caso indicato nell'indirizzo ----- *
   * Dalla home i link arrivano come progetti.html#case-dott.
   */
  function openCaseFromHash() {
    var id = window.location.hash.replace("#", "");
    if (!/^case-[a-z0-9-]+$/.test(id)) return;
    var dlg = doc.getElementById(id);
    if (!dlg || dlg.tagName !== "DIALOG" || dlg.open) return;
    if (typeof dlg.showModal === "function") {
      dlg.showModal();
      doc.body.style.overflow = "hidden";
    } else {
      dlg.setAttribute("open", "");
    }
  }

  /* ----- Avvio -------------------------------------------- */
  initCases();
  openCaseFromHash();
  onScroll();
})();
