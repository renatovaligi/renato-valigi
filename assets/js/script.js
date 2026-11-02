/* =============================================================
   script.js
   Invio del form contatti con EmailJS, filtro categorie del blog
   e popup di iscrizione alla newsletter. Il menu mobile resta
   invece gestito con solo HTML e CSS (checkbox hack).
   ============================================================= */

(function () {
  "use strict";

  /* ----- Form contatti (EmailJS) --------------------------- *
<<<<<<< HEAD
   * La libreria EmailJS e' ospitata sul sito (assets/vendor/emailjs.min.js):
   * il browser contatta i server di EmailJS solo quando l'utente invia il modulo.
   * Le chiavi qui sotto sono pubbliche per progetto (non sono segreti).
=======
   * DISATTIVATO. Per attivarlo:
   *  a) aggiungi nell'<head> di contatti.html:
   *       <script src="assets/js/vendor/emailjs.min.js" defer></script>
   *  b) sostituisci le costanti qui sotto con le tue chiavi EmailJS
   *  c) imposta EMAILJS_ENABLED = true
>>>>>>> cb7a2bb22f9d308d9db914b059e077d9dc0cfdef
   */
  var EMAILJS_ENABLED = true;
  var EMAILJS_PUBLIC_KEY = "SewHFgRaKh3bC7CTG";
  var EMAILJS_SERVICE_ID = "service_0o14ouk";
  var EMAILJS_TEMPLATE_ID = "template_1fjaj9l";

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  function setStatus(message, state) {
    status.textContent = message;
    status.classList.remove("is-error", "is-success");
    if (state) status.classList.add(state);
  }

  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Il form ha novalidate (per gestire noi i messaggi di stato), quindi
      // la validazione dei campi required va richiamata esplicitamente.
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!EMAILJS_ENABLED || typeof window.emailjs === "undefined") {
        setStatus("L'invio automatico non è ancora attivo. Scrivimi su LinkedIn nel frattempo.", "is-error");
        return;
      }

      setStatus("Invio in corso…", "is-success");

      window.emailjs
        .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY)
        .then(function () {
          form.reset();
          setStatus("Messaggio inviato, grazie! Ti risponderò al più presto.", "is-success");
        })
        .catch(function () {
          setStatus("Qualcosa è andato storto. Riprova o scrivimi su LinkedIn.", "is-error");
        });
    });
  }

  if (EMAILJS_ENABLED && typeof window.emailjs !== "undefined") {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  /* ----- Filtro categorie blog ----------------------------- */
  var filters = document.querySelectorAll(".blog-filter");
  var posts = document.querySelectorAll(".post-card[data-categories]");
  var emptyNotice = document.querySelector(".blog-empty");

  if (filters.length && posts.length) {
    filters.forEach(function (button) {
      button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");
      button.addEventListener("click", function () {
        filters.forEach(function (btn) {
          btn.classList.remove("is-active");
          btn.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");

        var filter = button.getAttribute("data-filter");
        var visibleCount = 0;

        posts.forEach(function (post) {
          var categories = post.getAttribute("data-categories").split(" ");
          var matches = filter === "tutti" || categories.indexOf(filter) !== -1;
          post.hidden = !matches;
          if (matches) visibleCount++;
        });

        if (emptyNotice) emptyNotice.hidden = visibleCount !== 0;
      });
    });
  }

  /* ----- Popup newsletter (blog, progetti) ------------------ */
  var modal = document.getElementById("newsletter-modal");

  if (modal) {
    var DISMISS_KEY = "newsletter-popup-dismissed";

    var alreadyDismissed = false;
    try {
      alreadyDismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch (e) {
      // Storage non disponibile (es. navigazione privata): mostriamo comunque il popup.
    }

    var lastFocus = null;

    function closeModal() {
      modal.hidden = true;
<<<<<<< HEAD
      if (lastFocus && typeof lastFocus.focus === "function") { lastFocus.focus(); }
=======
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
>>>>>>> cb7a2bb22f9d308d9db914b059e077d9dc0cfdef
      try {
        window.localStorage.setItem(DISMISS_KEY, "1");
      } catch (e) {
        // Niente di grave se non si può salvare: il popup si riaprirà alla prossima visita.
      }
    }

    if (!alreadyDismissed) {
      var openModal = function () {
        lastFocus = document.activeElement;
        modal.hidden = false;
<<<<<<< HEAD
        var card = modal.querySelector(".newsletter-modal__card");
        var firstFocus = modal.querySelector(".newsletter-modal__close");
        if (card) card.setAttribute("tabindex", "-1");
        window.setTimeout(function () { (firstFocus || card).focus(); }, 30);
=======
        var first = modal.querySelector(".newsletter-modal__close");
        if (first) first.focus();
>>>>>>> cb7a2bb22f9d308d9db914b059e077d9dc0cfdef
      };

      window.setTimeout(function () {
        // Se il banner dei cookie e' ancora aperto aspetto la scelta,
        // così i due messaggi non si sovrappongono.
        if (document.querySelector(".consent-banner")) {
          document.addEventListener("consent:decided", function () {
            window.setTimeout(openModal, 1200);
          }, { once: true });
        } else {
          openModal();
        }
      }, 2500);
    }

    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
<<<<<<< HEAD
      if (modal.hidden) return;
      if (event.key === "Escape") { closeModal(); return; }
      if (event.key !== "Tab") return;
      // tiene il focus dentro il popup finche' e' aperto
      var items = modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])');
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
=======
      if (event.key === "Escape" && !modal.hidden) closeModal();
      // il focus resta dentro il popup finche' e' aperto
      if (event.key === "Tab" && !modal.hidden) {
        var items = modal.querySelectorAll('a[href], button, input, select, textarea, iframe');
        var list = Array.prototype.filter.call(items, function (el) { return !el.disabled && el.offsetParent !== null; });
        if (!list.length) return;
        var firstEl = list[0], lastEl = list[list.length - 1];
        if (event.shiftKey && document.activeElement === firstEl) { event.preventDefault(); lastEl.focus(); }
        else if (!event.shiftKey && document.activeElement === lastEl) { event.preventDefault(); firstEl.focus(); }
>>>>>>> cb7a2bb22f9d308d9db914b059e077d9dc0cfdef
      }
    });
  }

  /* ----- Striscia scorrevole: pulsante di pausa ------------ */
  var marquee = document.querySelector(".marquee");
  var pauseBtn = marquee ? marquee.querySelector(".marquee__pause") : null;
  if (marquee && pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      var paused = marquee.classList.toggle("is-paused");
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.setAttribute("aria-label", paused ? "Riprendi l'animazione" : "Metti in pausa l'animazione");
      pauseBtn.textContent = paused ? "Riprendi" : "Pausa";
    });
  }

  /* ----- Modulo newsletter: caricato solo dopo il consenso ---- *
   * Il modulo di iscrizione e' ospitato da Brevo (iframe). Finche' l'utente
   * non spunta la casella, l'iframe NON viene caricato (src vuoto): nessuna
   * richiesta a Brevo parte all'apertura della pagina.
   */
  document.querySelectorAll(".newsletter-gate").forEach(function (checkbox) {
    var container = checkbox.closest(".newsletter-box, .newsletter-modal__card");
    var embed = container ? container.querySelector(".newsletter-embed") : null;
    if (!embed) return;
    var frame = embed.querySelector("iframe[data-src]");

    function sync() {
      if (checkbox.checked) {
        embed.removeAttribute("data-locked");
<<<<<<< HEAD
        if (frame && !frame.getAttribute("src")) { frame.setAttribute("src", frame.getAttribute("data-src")); }
      } else {
        embed.setAttribute("data-locked", "");
      }
=======
        // il modulo di Brevo si carica solo dopo la spunta: prima non parte nessuna richiesta verso Brevo
        var frame = embed.querySelector("iframe[data-src]");
        if (frame && !frame.getAttribute("src")) frame.setAttribute("src", frame.getAttribute("data-src"));
      } else embed.setAttribute("data-locked", "");
>>>>>>> cb7a2bb22f9d308d9db914b059e077d9dc0cfdef
    }

    checkbox.addEventListener("change", sync);
    sync();
  });
})();
