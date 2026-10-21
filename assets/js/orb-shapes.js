/* =============================================================
   orb-shapes.js
   Forme della sfera di particelle in home. Ogni forma e' un insieme
   di N punti 3D (raggio massimo = 1) che motion.js fa "trasformare"
   da una all'altra.

   Per aggiungere un logo: python3 logo_points.py logo.png bright
   e incolla il risultato in LOGOS (chiave + oggetto con e, d, b).
   ============================================================= */
(function () {
  "use strict";

  var LOGOS = {
    rv: {"e": 900, "d": 350, "b": "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"},
    tagup: {"e": 900, "d": 350, "b": "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"}
  };

  var GOLD = Math.PI * (3 - Math.sqrt(5));

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ----- utilita' geometriche ------------------------------ */
  function dist(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]) + (b[2] - a[2]) * (b[2] - a[2]));
  }

  // n punti equidistanti lungo una spezzata (aperta o chiusa)
  function path(v, n, closed, out) {
    var segs = [], total = 0, m = v.length - (closed ? 0 : 1), i;
    for (i = 0; i < m; i++) {
      var l = dist(v[i], v[(i + 1) % v.length]);
      segs.push(l); total += l;
    }
    for (var k = 0; k < n; k++) {
      var d = (k / (closed ? n : Math.max(n - 1, 1))) * total, s = 0;
      while (s < m - 1 && d > segs[s]) { d -= segs[s]; s++; }
      var a = v[s], b = v[(s + 1) % v.length], t = segs[s] ? d / segs[s] : 0;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
    }
  }

  // arco di cerchio: centro c, assi u e v (ortonormali), raggio r
  function arc(c, u, v, r, n, a0, a1, out) {
    for (var k = 0; k < n; k++) {
      var t = a0 + (a1 - a0) * (n === 1 ? 0 : k / n);
      var cs = Math.cos(t) * r, sn = Math.sin(t) * r;
      out.push([c[0] + u[0] * cs + v[0] * sn, c[1] + u[1] * cs + v[1] * sn, c[2] + u[2] * cs + v[2] * sn]);
    }
  }

  var AX = [1, 0, 0], AY = [0, 1, 0], AZ = [0, 0, 1];

  // porta a esattamente N punti, centra, scala a raggio 1 e ordina per altezza
  function finish(pts, N, rand) {
    var out = pts, i;
    if (out.length > N) {
      var step = out.length / N, tmp = [];
      for (i = 0; i < N; i++) tmp.push(out[Math.floor(i * step)]);
      out = tmp;
    } else {
      var base = out.length;
      while (out.length < N) {
        var s = out[Math.floor(rand() * base)];
        out.push([s[0] + (rand() - 0.5) * 0.02, s[1] + (rand() - 0.5) * 0.02, s[2] + (rand() - 0.5) * 0.02]);
      }
    }
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9], a;
    for (i = 0; i < N; i++) for (a = 0; a < 3; a++) {
      if (out[i][a] < mn[a]) mn[a] = out[i][a];
      if (out[i][a] > mx[a]) mx[a] = out[i][a];
    }
    var c = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2], maxR = 0;
    for (i = 0; i < N; i++) {
      out[i] = [out[i][0] - c[0], out[i][1] - c[1], out[i][2] - c[2]];
      var r = Math.sqrt(out[i][0] * out[i][0] + out[i][1] * out[i][1] + out[i][2] * out[i][2]);
      if (r > maxR) maxR = r;
    }
    var sc = 1 / maxR;
    // le forme sono disegnate con y verso l'alto; lo schermo ha y verso il basso, quindi si ribalta
    for (i = 0; i < N; i++) out[i] = [out[i][0] * sc, -out[i][1] * sc, out[i][2] * sc];
    // stessa logica della sfera (dall'alto al basso): le particelle scorrono vicino a dove erano
    out.sort(function (p, q) {
      var yp = Math.round(p[1] * 28), yq = Math.round(q[1] * 28);
      if (yp !== yq) return yq - yp;
      return Math.atan2(p[2], p[0]) - Math.atan2(q[2], q[0]);
    });
    return out;
  }

  /* ----- le forme ------------------------------------------ */
  function sphere(N) {
    var pts = [];
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = GOLD * i;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    return pts;
  }

  // pallone da basket: sfera con le cuciture addensate
  function ball(N) {
    var pts = [], per = Math.floor(N * 0.55 / 4), k, t;
    for (k = 0; k < per; k++) { t = (k / per) * Math.PI * 2; pts.push([Math.cos(t), 0, Math.sin(t)]); }
    for (k = 0; k < per; k++) { t = (k / per) * Math.PI * 2; pts.push([0, Math.cos(t), Math.sin(t)]); }
    [0.56, -0.56].forEach(function (cx) {
      var rr = Math.sqrt(1 - cx * cx);
      for (k = 0; k < per; k++) { t = (k / per) * Math.PI * 2; pts.push([cx, rr * Math.cos(t), rr * Math.sin(t)]); }
    });
    var rest = N - pts.length;
    for (var i = 0; i < rest; i++) {
      var y = 1 - (i / (rest - 1)) * 2, r = Math.sqrt(1 - y * y), th = GOLD * i;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    return pts;
  }

  // canestro: tabellone, quadrato, ferro e retina
  function hoop() {
    var P = [], k, s, th;
    path([[-0.78, -0.05, -0.5], [0.78, -0.05, -0.5], [0.78, 0.95, -0.5], [-0.78, 0.95, -0.5]], 300, true, P);
    path([[-0.27, 0.04, -0.5], [0.27, 0.04, -0.5], [0.27, 0.44, -0.5], [-0.27, 0.44, -0.5]], 110, true, P);
    var rimC = [0, 0.02, -0.04];
    arc(rimC, AX, AZ, 0.36, 230, 0, Math.PI * 2, P);
    path([[0, 0.02, -0.4], [0, 0.02, -0.5]], 20, false, P);
    var strands = 14;
    for (k = 0; k < strands; k++) {
      th = (k / strands) * Math.PI * 2;
      for (s = 0; s < 24; s++) {
        var u = s / 23, rad = 0.36 - 0.17 * u, ang = th + 0.55 * u;
        P.push([rimC[0] + Math.cos(ang) * rad, 0.02 - 0.72 * u, rimC[2] + Math.sin(ang) * rad]);
      }
    }
    [0.35, 0.68, 1].forEach(function (u) {
      arc([0, 0.02 - 0.72 * u, rimC[2]], AX, AZ, 0.36 - 0.17 * u, 56, 0, Math.PI * 2, P);
    });
    return P;
  }

  // lavagna tattica in piedi: campo, linee, X e O e frecce di movimento
  function court() {
    var P = [], i;
    // coordinate campo (cx, cy) poi appoggiate sul piano x-y
    function pt(x, y, z) { return [x, y, z || 0]; }
    path([pt(-0.75, -0.7), pt(0.75, -0.7), pt(0.75, 0.7), pt(-0.75, 0.7)], 230, true, P);          // perimetro
    path([pt(-0.19, -0.7), pt(-0.19, -0.15), pt(0.19, -0.15), pt(0.19, -0.7)], 100, false, P);       // area
    arc(pt(0, -0.15), AX, AY, 0.19, 50, 0, Math.PI, P);                                              // cerchio tiri liberi
    arc(pt(0, -0.15), AX, AY, 0.19, 24, Math.PI, Math.PI * 2, P);
    path([pt(-0.66, -0.7), pt(-0.66, -0.42)], 22, false, P);                                         // linea da 3
    path([pt(0.66, -0.7), pt(0.66, -0.42)], 22, false, P);
    arc(pt(0, -0.58), AX, AY, 0.68, 150, 0.245, Math.PI - 0.245, P);
    arc(pt(0, 0.7), AX, AY, 0.2, 54, Math.PI, Math.PI * 2, P);                                       // cerchio di meta' campo
    arc(pt(0, -0.58), AX, AY, 0.05, 26, 0, Math.PI * 2, P);                                          // canestro
    path([pt(-0.11, -0.66), pt(0.11, -0.66)], 14, false, P);
    // giocatori in attacco (O) e in difesa (X)
    [[-0.5, 0.1], [0.5, 0.18], [-0.05, 0.38], [0.2, -0.05]].forEach(function (p) {
      arc(pt(p[0], p[1]), AX, AY, 0.055, 24, 0, Math.PI * 2, P);
    });
    [[-0.3, -0.02], [0.28, 0.04], [0.02, 0.2], [0.42, -0.3]].forEach(function (p) {
      path([pt(p[0] - 0.05, p[1] - 0.05), pt(p[0] + 0.05, p[1] + 0.05)], 12, false, P);
      path([pt(p[0] - 0.05, p[1] + 0.05), pt(p[0] + 0.05, p[1] - 0.05)], 12, false, P);
    });
    // frecce di movimento (curve) con punta
    function curve(a, c, b, n) {
      for (i = 0; i < n; i++) {
        var t = i / (n - 1), u = 1 - t;
        P.push(pt(u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]));
      }
    }
    curve([-0.5, 0.1], [-0.55, -0.3], [-0.14, -0.4], 46);
    path([pt(-0.14, -0.4), pt(-0.22, -0.37)], 6, false, P);
    path([pt(-0.14, -0.4), pt(-0.2, -0.47)], 6, false, P);
    curve([0.5, 0.18], [0.45, -0.2], [0.17, -0.2], 40);
    path([pt(0.17, -0.2), pt(0.25, -0.15)], 6, false, P);
    path([pt(0.17, -0.2), pt(0.24, -0.26)], 6, false, P);
    // cornice della lavagna, su due piani
    path([pt(-0.92, -0.86, 0.04), pt(0.92, -0.86, 0.04), pt(0.92, 0.86, 0.04), pt(-0.92, 0.86, 0.04)], 90, true, P);
    path([pt(-0.92, -0.86, -0.04), pt(0.92, -0.86, -0.04), pt(0.92, 0.86, -0.04), pt(-0.92, 0.86, -0.04)], 90, true, P);
    return P;
  }

  // megafono con le onde del suono
  function megaphone() {
    var P = [], k, j;
    var x0 = -0.55, x1 = 0.45, r0 = 0.14, r1 = 0.55;
    for (k = 0; k < 14; k++) {
      var u = k / 13, x = x0 + (x1 - x0) * u, r = r0 + (r1 - r0) * u;
      arc([x, 0, 0], AY, AZ, r, 32, 0, Math.PI * 2, P);
    }
    for (j = 0; j < 9; j++) {
      var a = (j / 9) * Math.PI * 2;
      path([[x0, Math.cos(a) * r0, Math.sin(a) * r0], [x1, Math.cos(a) * r1, Math.sin(a) * r1]], 15, false, P);
    }
    arc([x1 + 0.02, 0, 0], AY, AZ, r1, 120, 0, Math.PI * 2, P);
    // impugnatura
    for (k = 0; k < 5; k++) arc([-0.12, -0.2 - k * 0.075, 0], AX, AZ, 0.07, 13, 0, Math.PI * 2, P);
    // onde
    [[0.66, 0.4], [0.84, 0.52], [1.02, 0.64]].forEach(function (w) {
      arc([w[0], 0, 0], AY, AZ, w[1], 64, 0, Math.PI * 2, P);
    });
    return P;
  }

  // logo estruso (monogramma, Tagup...) a partire dai punti 2D pre-calcolati
  function logo(L, rand) {
    var bin = atob(L.b), n = bin.length / 2, xs = [], ys = [], i;
    for (i = 0; i < n; i++) { xs.push(bin.charCodeAt(i * 2)); ys.push(bin.charCodeAt(i * 2 + 1)); }
    var mnx = Math.min.apply(null, xs), mxx = Math.max.apply(null, xs);
    var mny = Math.min.apply(null, ys), mxy = Math.max.apply(null, ys);
    var cx = (mnx + mxx) / 2, cy = (mny + mxy) / 2, sc = 2 / Math.max(mxx - mnx, mxy - mny), depth = 0.17;
    var P = [];
    for (i = 0; i < n; i++) {
      var z = i < L.e ? (rand() * 2 - 1) * depth : (i % 2 ? depth : -depth);
      P.push([(xs[i] - cx) * sc, -(ys[i] - cy) * sc, z]);
    }
    return P;
  }

  /* ----- elenco, nell'ordine in cui compaiono --------------- */
  window.OrbShapes = {
    build: function (N) {
      var rand = rng(11);
      var defs = [
        { label: "Idea", flat: false, pts: sphere(N) },
        { label: "Basket", flat: false, pts: ball(N) }
      ];
      if (LOGOS.tagup) defs.push({ label: "TagUp", flat: true, pts: logo(LOGOS.tagup, rand) });
      defs.push(
        { label: "Canestro", flat: false, pts: hoop() },
        { label: "Tattica", flat: true, pts: court() },
        { label: "Comunicazione", flat: false, pts: megaphone() }
      );
      if (LOGOS.rv) defs.push({ label: "Renato Valigi", flat: true, pts: logo(LOGOS.rv, rand) });
      return defs.map(function (d, idx) {
        d.pts = idx === 0 ? d.pts : finish(d.pts, N, rand);
        return d;
      });
    }
  };
})();
