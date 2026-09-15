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
})();
