/* =============================================================
   jarvis.js
   Fa partire l'animazione "radar" del logo TagUp nella scheda di
   prodotti.html quando la scheda entra nello schermo. Dura circa
   tre secondi e si ferma: si rivede toccando o cliccando il riquadro,
   o tornando sulla scheda dopo aver scrollato altrove.
   Con "riduci movimento" attivo resta il logo gia' disegnato, fermo.
   Nessun suono, nessuna richiesta esterna.
   ============================================================= */
(function () {
  "use strict";
  var el = document.querySelector(".jarvis");
  if (!el) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function play() {
    el.classList.remove("is-on");
    void el.offsetWidth; // forza il riavvio delle animazioni
    el.classList.add("is-on");
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) play();
        else el.classList.remove("is-on");
      });
    }, { threshold: 0.4 }).observe(el);
  } else {
    play();
  }
  el.parentNode.addEventListener("click", play);
})();
