/* =============================================================
   script.js
   Unico uso di JavaScript nel sito: la predisposizione (disattivata
   di default) per l'invio del form contatti con EmailJS, come da
   requisito facoltativo del progetto. Il menu mobile e tutto il
   resto dell'interfaccia funzionano con solo HTML e CSS.
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
      if (!EMAILJS_ENABLED || typeof window.emailjs === "undefined") {
        // Nessun backend attivo: lasciamo che il browser gestisca la
        // validazione dei campi required e mostriamo un avviso.
        event.preventDefault();
        setStatus("L'invio automatico non è ancora attivo. Scrivimi su LinkedIn nel frattempo.", "is-error");
        return;
      }

      event.preventDefault();
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
})();
