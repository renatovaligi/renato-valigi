/* =============================================================
   script.js
   Unico uso di JavaScript nel sito:
   1. Menu di navigazione sticky in versione mobile (toggle hamburger).
   2. Predisposizione (disattivata) per l'invio del form contatti con
      EmailJS, da attivare solo se in futuro lo decidiamo.
   ============================================================= */

(function () {
  "use strict";

  /* ----- 1. Menu mobile ------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Chiudi il menu dopo aver scelto una voce (utile su mobile)
    menu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Torna allo stato desktop se si allarga la finestra
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----- 2. Form contatti (EmailJS) ----------------------- *
   * DISATTIVATO. Per attivarlo:
   *  a) aggiungi nell'<head> di contatti.html:
   *       <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   *  b) sostituisci le costanti qui sotto con le tue chiavi EmailJS
   *  c) imposta EMAILJS_ENABLED = true
   */
  var EMAILJS_ENABLED = false;
  var EMAILJS_PUBLIC_KEY = "LA_TUA_PUBLIC_KEY";
  var EMAILJS_SERVICE_ID = "IL_TUO_SERVICE_ID";
  var EMAILJS_TEMPLATE_ID = "IL_TUO_TEMPLATE_ID";

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", function (event) {
      if (!EMAILJS_ENABLED || typeof window.emailjs === "undefined") {
        // Nessun backend attivo: lasciamo che il browser gestisca la
        // validazione dei campi required e mostriamo un avviso.
        event.preventDefault();
        status.textContent =
          "L'invio automatico non è ancora attivo. Scrivimi su LinkedIn nel frattempo.";
        status.style.color = "#9d0e19";
        return;
      }

      event.preventDefault();
      status.textContent = "Invio in corso…";
      status.style.color = "#1f3a3d";

      window.emailjs
        .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY)
        .then(function () {
          form.reset();
          status.textContent = "Messaggio inviato, grazie! Ti rispondo al più presto.";
          status.style.color = "#1f3a3d";
        })
        .catch(function () {
          status.textContent = "Qualcosa è andato storto. Riprova o scrivimi su LinkedIn.";
          status.style.color = "#9d0e19";
        });
    });
  }

  if (EMAILJS_ENABLED && typeof window.emailjs !== "undefined") {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  /* ----- 3. Filtro categorie blog ------------------------ */
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

  /* ----- Anno corrente nel footer ------------------------ */
  var yearEl = document.querySelectorAll("[data-current-year]");
  yearEl.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
