# Sito personale — Renato Valigi

Sito multipagina statico (HTML + CSS) realizzato per il progetto pratico del modulo
**Sviluppo Web** del Master in Growth Marketing e Agenti AI (start2impact × Unimarconi).

Presenta due identità professionali: **comunicazione sportiva / digital marketing** e
**coaching di basket**.

## Struttura

```
renato-valigi/
├── assets/
│   ├── scss/                 # sorgenti Sass (da compilare)
│   │   ├── _variables.scss   # palette, tipografia, spaziature, breakpoint
│   │   ├── _base.scss        # reset leggero, elementi HTML, helper di layout
│   │   ├── _components.scss  # navbar, bottoni, card, hero, form, footer, CV, blog
│   │   └── style.scss        # entrypoint: importa i partial
│   ├── css/
│   │   └── style.css         # CSS COMPILATO (non modificare a mano)
│   ├── img/
│   │   ├── foto-profilo.png
│   │   └── favicon-master-512.png
│   ├── js/
│   │   └── script.js         # menu mobile sticky + predisposizione EmailJS
│   └── docs/
│       └── portfolio-analisi-strategica-dott.pdf
├── blog/
│   └── vincere-o-sbagliare.html # articolo pubblicato: "Vincere o sbagliare"
├── index.html                # Home
├── progetti.html             # Portfolio (griglia in CSS Grid)
├── cv.html                   # Curriculum in HTML
├── blog.html                 # Elenco articoli
├── contatti.html             # Form di contatto + social
├── .nojekyll                  # evita l'elaborazione Jekyll su GitHub Pages
└── README.md
```

## Compilare il Sass

Il file `assets/css/style.css` è già compilato e versionato, così il sito funziona
anche senza toolchain. Se modifichi i `.scss`, rigeneralo:

```bash
# con Dart Sass installato (npm i -g sass  oppure  brew install sass/sass/sass)
sass assets/scss/style.scss assets/css/style.css --style=expanded

# durante lo sviluppo, ricompilazione automatica:
sass --watch assets/scss/style.scss assets/css/style.css
```

## Scelte tecniche

- **Solo HTML e CSS** per struttura e stile. JavaScript usato **solo** per:
  1. il menu di navigazione sticky in versione mobile (`assets/js/script.js`);
  2. una predisposizione **disattivata** per l'invio del form contatti con EmailJS.
- **Bootstrap 5 via CDN**, limitato a griglia, utility e componenti di base. Tutto
  l'aspetto visivo è ridefinito in Sass per non sembrare un template standard.
- **Mobile-first**, responsive al 100% (breakpoint 576 / 768 / 992 px).
- **Menu sticky**: l'header resta fisso su tutte le larghezze; su mobile il menu è
  collassato e si apre con il pulsante hamburger (gestito via JS).
- **Layout in CSS Grid**: la griglia progetti (`.project-grid`) e quella competenze
  (`.skill-grid`). Diverse sezioni usano Flexbox.
- **Meta tag Open Graph** (title, description, image, url) in ogni pagina.
- **Favicon**: collegata nel `<head>` di ogni pagina puntando a
  `assets/img/favicon-master-512.png`. Per un set completo (`.ico`, 16/32/180 px)
  puoi generare i file da quel master e aggiungere i relativi `<link>`.
- **Form contatti**: campi `nome`, `email`, `messaggio` tutti con attributo `required`;
  nessun indirizzo email o numero di telefono scritto in pagina.

## Attivare il form con EmailJS (opzionale)

1. In `contatti.html`, decommenta nell'`<head>` la riga dello script EmailJS.
2. In `assets/js/script.js` imposta `EMAILJS_ENABLED = true` e inserisci
   `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`.
3. Nel template EmailJS usa i nomi dei campi del form: `nome`, `email`, `messaggio`.

Finché è disattivato, il form valida i campi obbligatori nel browser e mostra un
avviso che rimanda a LinkedIn.

## Pubblicazione su GitHub Pages

1. Crea un repository (es. `renato-valigi`) e fai push del contenuto di questa cartella.
2. Repository → **Settings → Pages** → Source: `Deploy from a branch`, branch `main`, cartella `/root`.
3. Il sito sarà su `https://<username>.github.io/<repo>/`.

> **Da aggiornare dopo il primo deploy:** i meta tag `og:image` e `og:url` in ogni
> pagina usano l'URL segnaposto `https://renatovaligi.github.io/renato-valigi/`.
> Sostituiscilo con l'URL reale di pubblicazione (cerca e sostituisci in tutti i `.html`).

## Contenuti provvisori

Bio, CV, il primo articolo del blog e il progetto "Analisi Strategica: Dott" sono
contenuti reali. Sono segnalati come `[PLACEHOLDER]` / badge "Placeholder":

- `progetti.html`: progetti 2 e 3;
- `blog.html`: articoli 2 e 3.

## Checklist consegna

- [x] Tutte le pagine si aprono e i link interni funzionano
- [x] Responsive mobile / tablet / desktop, approccio mobile-first
- [x] Menu sticky funzionante su mobile
- [x] Campi obbligatori del form con `required`
- [x] Meta tag Open Graph su ogni pagina
- [x] Favicon collegata nel `<head>`
- [x] Percorsi relativi, nessuna dipendenza server-side, pronto per GitHub Pages
