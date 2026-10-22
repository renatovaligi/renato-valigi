/* =============================================================
   analytics.js
   Consenso ai cookie e Google Analytics 4.

   - Google Analytics viene scaricato SOLO dopo che l'utente ha cliccato
     "Accetta". Prima di quel momento non parte nessuna richiesta a Google
     e non viene installato nessun cookie (blocco preventivo).
   - La scelta si cambia in ogni momento dal link "Gestisci cookie" nel footer.
   - Se GA_MEASUREMENT_ID e' ancora quello di esempio, questo file non fa
     nulla: niente banner, niente tracciamento.

   PER ATTIVARLO: sostituisci G-MRQT8MXG85 con il tuo ID di misurazione
   (Google Analytics > Amministrazione > Flussi di dati > il tuo sito).
   ============================================================= */
(function () {
  "use strict";

  var GA_MEASUREMENT_ID = "G-MRQT8MXG85";

  if (!/^G-[A-Z0-9]{6,}$/.test(GA_MEASUREMENT_ID) || /^G-X+$/.test(GA_MEASUREMENT_ID)) { return; }

  var doc = document;
  var STORAGE_KEY = "consent-analytics";
  var DAY = 86400000;
  var RENEW_DENIED = 183 * DAY;   // dopo un rifiuto non richiedo prima di 6 mesi
  var RENEW_GRANTED = 365 * DAY;  // dopo un'accettazione richiedo dopo 12 mesi
  var PRIVACY_URL = "/privacy.html#cookie";
  var banner = null;
  var gaLoaded = false;

  /* ----- Scelta salvata ------------------------------------ */
  function readChoice() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      var maxAge = data.value === "granted" ? RENEW_GRANTED : RENEW_DENIED;
      if (!data.time || Date.now() - data.time > maxAge) return null;
      return data.value;
    } catch (e) { return null; }
  }

  function saveChoice(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: value, time: Date.now() }));
    } catch (e) { /* storage non disponibile: la scelta vale solo per questa pagina */ }
  }

  /* ----- Google Analytics ---------------------------------- */
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window["ga-disable-" + GA_MEASUREMENT_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };

    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 34128000          // 13 mesi
    });

    var s = doc.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    doc.head.appendChild(s);
  }

  function deleteCookie(name) {
    var host = window.location.hostname;
    var parts = host.split(".");
    var domains = ["", host, "." + host];
    if (parts.length > 2) { domains.push("." + parts.slice(-2).join(".")); }
    domains.forEach(function (d) {
      doc.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
    });
  }

  function stopGA() {
    window["ga-disable-" + GA_MEASUREMENT_ID] = true;
    doc.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid") { deleteCookie(name); }
    });
  }

  function track(name, params) {
    if (!gaLoaded || typeof window.gtag !== "function") return;
    window.gtag("event", name, params || {});
  }

  /* ----- Banner -------------------------------------------- */
  function closeBanner() {
    if (banner && banner.parentNode) { banner.parentNode.removeChild(banner); }
    banner = null;
  }

  function decide(value) {
    saveChoice(value);
    if (value === "granted") { loadGA(); } else { stopGA(); }
    closeBanner();
    doc.dispatchEvent(new CustomEvent("consent:decided", { detail: { value: value } }));
  }

  function showBanner() {
    if (banner) return;
    banner = doc.createElement("div");
    banner.className = "consent-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Preferenze cookie");
    banner.innerHTML =
      '<p class="consent-banner__title">Cookie e statistiche</p>' +
      '<p class="consent-banner__text">Questo sito usa Google Analytics per misurare in forma aggregata le visite e la lettura degli articoli, ' +
      "ma solo con il tuo consenso. Se rifiuti, non viene installato nessun cookie di analisi. " +
      'Puoi cambiare scelta in qualsiasi momento da "Gestisci cookie" in fondo alla pagina. ' +
      '<a href="' + PRIVACY_URL + '">Informativa</a></p>' +
      '<div class="consent-banner__actions">' +
      '<button type="button" class="consent-banner__btn" data-consent="denied">Rifiuta</button>' +
      '<button type="button" class="consent-banner__btn" data-consent="granted">Accetta</button>' +
      "</div>";
    doc.body.appendChild(banner);
    banner.querySelectorAll("[data-consent]").forEach(function (btn) {
      btn.addEventListener("click", function () { decide(btn.getAttribute("data-consent")); });
    });
  }

  /* ----- Link "Gestisci cookie" nel footer ----------------- */
  function addFooterLink() {
    var nav = doc.querySelector(".footer-nav");
    if (!nav || nav.querySelector("[data-consent-open]")) return;
    var li = doc.createElement("li");
    li.innerHTML = '<button type="button" class="link-button" data-consent-open>Gestisci cookie</button>';
    nav.appendChild(li);
  }

  doc.addEventListener("click", function (e) {
    var opener = e.target.closest ? e.target.closest("[data-consent-open]") : null;
    if (opener) { e.preventDefault(); showBanner(); }
  });

  /* ----- Eventi personalizzati ----------------------------- */
  function slugOf(url) {
    var m = /(?:^|\/)blog\/([^\/?#]+?)(?:\.html)?(?:[?#]|$)/.exec(url);
    return m ? m[1] : "";
  }

  function initEvents() {
    // click verso un articolo: da dove parte (home, elenco blog, altro articolo)
    doc.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a[href]") : null;
      if (link) {
        var slug = slugOf(link.getAttribute("href"));
        var here = slugOf(window.location.pathname);
        if (slug && slug !== here) {
          var source = "link";
          if (link.closest(".blog-teaser")) source = "home";
          else if (link.closest(".post-card")) source = "elenco_blog";
          else if (link.closest(".article__body")) source = "dentro_articolo";
          track("article_click", { article: slug, source: source });
        }
        var cta = link.closest(".hero__actions, .cta-magnet, .nav-menu li:last-child");
        if (cta) {
          track("cta_click", { label: (link.textContent || "").trim().slice(0, 60), destination: link.getAttribute("href") });
        }
      }
      var opener = e.target.closest ? e.target.closest("[data-open-case]") : null;
      if (opener) { track("case_open", { project: opener.getAttribute("data-open-case").replace(/^case-/, "") }); }

      var filter = e.target.closest ? e.target.closest(".blog-filter, .case-filter") : null;
      if (filter) {
        track("filter_use", {
          area: filter.classList.contains("blog-filter") ? "blog" : "progetti",
          filter: filter.getAttribute("data-filter")
        });
      }
    });

    // invio riuscito del form contatti
    var status = doc.getElementById("form-status");
    if (status && "MutationObserver" in window) {
      var sent = false;
      new MutationObserver(function () {
        if (!sent && /Messaggio inviato/.test(status.textContent)) {
          sent = true;
          track("generate_lead", { form: "contatti" });
        }
      }).observe(status, { childList: true, characterData: true, subtree: true });
    }

    // quanto si legge di un articolo (25, 50, 75, 100% del testo)
    var body = doc.querySelector(".article__body");
    if (body) {
      var slugNow = slugOf(window.location.pathname) || "articolo";
      var reached = {};
      var ticking = false;
      var check = function () {
        ticking = false;
        var rect = body.getBoundingClientRect();
        var viewBottom = window.innerHeight;
        var progress = (viewBottom - rect.top) / rect.height;
        [25, 50, 75, 100].forEach(function (p) {
          if (!reached[p] && progress >= p / 100) {
            reached[p] = true;
            track("article_progress", { article: slugNow, percent: p });
          }
        });
      };
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(check); }
      }, { passive: true });
      check();
    }
  }

  /* ----- Avvio --------------------------------------------- */
  function init() {
    addFooterLink();
    initEvents();
    var choice = readChoice();
    if (choice === "granted") { loadGA(); }
    else if (choice === "denied") { stopGA(); }
    else { showBanner(); }
  }

  if (doc.readyState === "loading") { doc.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
