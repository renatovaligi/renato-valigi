# Sito personale di Renato Valigi

Questo è il sito che ho costruito per il progetto pratico del modulo Sviluppo Web
del Master in Growth Marketing e Agenti AI (start2impact x Unimarconi). Racconta
le due anime del mio lavoro: comunicazione sportiva e digital marketing da un
lato, coaching di basket dall'altro. Nella pratica di solito finiscono per
intrecciarsi, e ho provato a farlo vedere anche nel sito.

È online qui: **https://renatovaligi.github.io/renato-valigi/**

## Cosa c'è dentro

Cinque pagine principali, home, progetti, CV, blog e contatti, più tre articoli
del blog in pagine a parte. Il CV è scritto direttamente in HTML, come richiesto,
non è un PDF caricato. I progetti nel portfolio sono lavori veri fatti durante il
master, con i PDF scaricabili. Gli articoli del blog invece li ho scritti io,
alcuni erano già usciti altrove (uno su una rivista di coaching cartacea) e li ho
adattati per il sito.

## Struttura dei file

```
renato-valigi/
├── assets/
│   ├── scss/                 # sorgenti Sass, da qui nasce il CSS
│   │   ├── _variables.scss   # colori, font, spaziature, breakpoint
│   │   ├── _base.scss        # reset e stili di base
│   │   ├── _components.scss  # navbar, bottoni, card, hero, form, footer...
│   │   └── style.scss        # punto di ingresso, importa gli altri file
│   ├── css/style.css         # il CSS compilato, quello che usa davvero il sito
│   ├── img/                  # foto profilo, favicon, immagini progetti
│   ├── js/script.js          # unico script del sito, vedi sotto
│   └── docs/                 # i PDF dei progetti scaricabili
├── blog/                     # i tre articoli, uno per file
├── index.html
├── progetti.html
├── cv.html
├── blog.html
├── contatti.html
└── .nojekyll                 # dice a GitHub Pages di non processare il sito con Jekyll
```

## Perché quasi zero JavaScript

Il sito è fatto solo con HTML e CSS, com'era richiesto. L'unica eccezione è lo
script per il form contatti, ed è lì solo perché la consegna nomina esplicitamente
EmailJS come opzione facoltativa per inviare i messaggi via email. Anche quello
comunque è disattivato di default: finché non lo attivo, il form si limita a
validare i campi obbligatori nel browser e mostra un avviso che rimanda a
LinkedIn.

Anche il menu ad hamburger su mobile, che di solito si farebbe con qualche riga
di JavaScript, qui è puro CSS: una checkbox nascosta collegata a una label,
pilotata con il selettore `:checked`. Funziona esattamente come un menu normale,
ma senza script.

### Attivare EmailJS, se un giorno vorrò farlo

1. In `contatti.html` scommentare nell'head la riga dello script EmailJS.
2. In `assets/js/script.js` mettere `EMAILJS_ENABLED = true` e inserire le tre
   chiavi (`EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`).
3. Nel template su EmailJS usare gli stessi nomi dei campi del form: `nome`,
   `email`, `messaggio`.

## Il resto delle scelte tecniche

Bootstrap 5 caricato da CDN, usato solo per griglia e qualche utility di base,
tutto l'aspetto è comunque riscritto in Sass.
qualunque. Il sito è mobile-first con tre breakpoint (576, 768, 992px) e l'header
resta sempre visibile durante lo scroll. La griglia dei progetti e quella delle
competenze usano CSS Grid, altre sezioni usano Flexbox. Ogni pagina ha i meta tag
Open Graph per quando il link viene condiviso sui social, e una favicon nell'head.
Il form contatti ha i campi obbligatori marcati con `required`, e non c'è nessuna
email o numero di telefono scritto in chiaro da qualche parte, per non farli
raccogliere dai bot.
