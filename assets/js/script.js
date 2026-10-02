/* =============================================================
   script.js
   Invio del form contatti con EmailJS, filtro categorie del blog
   e popup di iscrizione alla newsletter. Il menu mobile resta
   invece gestito con solo HTML e CSS (checkbox hack).
   ============================================================= */

(function () {
  "use strict";

  /* ----- Form contatti (EmailJS) --------------------------- *
   * DISATTIVATO. Per attivarlo:
   *  a) aggiungi nell'<head> di contatti.html:
   *       <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   *  b) sostituisci le costanti qui sotto con le tue chiavi EmailJS
   *  c) imposta EMAILJS_ENABLED = true
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
      button.addEventListener("click", function () {
        filters.forEach(function (btn) { btn.classList.remove("is-active"); });
        button.classList.add("is-active");

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
    var modalForm = document.getElementById("newsletter-modal-form");

    var alreadyDismissed = false;
    try {
      alreadyDismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch (e) {
      // Storage non disponibile (es. navigazione privata): mostriamo comunque il popup.
    }

    function closeModal() {
      modal.hidden = true;
      try {
        window.localStorage.setItem(DISMISS_KEY, "1");
      } catch (e) {
        // Niente di grave se non si può salvare: il popup si riaprirà alla prossima visita.
      }
    }

    if (!alreadyDismissed) {
      window.setTimeout(function () {
        modal.hidden = false;
      }, 2500);
    }

    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });

    if (modalForm) {
      modalForm.addEventListener("submit", function () {
        // Il form invia davvero a Brevo (target="_blank"): chiudiamo il popup per
        // non mostrarlo di nuovo a chi si è appena iscritto.
        window.setTimeout(closeModal, 300);
      });
    }
  }
})();
