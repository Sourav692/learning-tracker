/* ===========================================================================
   home-hero.js — bespoke 3D hero animation for the landing page ("Pick your path").

   Circus-themed to match the page: a warm floating-confetti depth field drifting
   in 3D behind the banner, mouse-parallax on the hero, a staggered 3D reveal of
   the eyebrow / title (per-word) / sub, a 3D "deal the cards" entrance for the
   track grid, and a live pointer-driven 3D tilt on each card.

   Uses anime.js (v3). Additive and defensive; honours prefers-reduced-motion.
   =========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function boot() {
    var hero = document.querySelector(".home-hero");
    var banner = hero && hero.querySelector(".home-banner");
    if (!hero) return;

    document.body.classList.add("home3d-on");

    // --- 3D confetti depth field inside the banner ---------------------------
    if (banner) {
      var scene = document.createElement("div");
      scene.className = "home3d";
      scene.setAttribute("aria-hidden", "true");
      var canvas = document.createElement("canvas");
      scene.appendChild(canvas);
      banner.insertBefore(scene, banner.firstChild);

      var ctx = canvas.getContext("2d");
      var DPR = Math.min(window.devicePixelRatio || 1, 2);
      var W = 0, H = 0;
      function resize() {
        W = banner.offsetWidth; H = banner.offsetHeight;
        canvas.width = W * DPR; canvas.height = H * DPR;
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize();
      window.addEventListener("resize", resize);

      // warm circus palette (white bulbs + gold + red-orange + teal)
      var COLORS = [[255, 246, 224], [255, 179, 60], [255, 90, 60], [60, 198, 194]];
      var COUNT = window.innerWidth < 700 ? 30 : 54;
      var FOV = 300;
      var bits = [];
      var seed = 20240611;
      function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      for (var i = 0; i < COUNT; i++) {
        bits.push({
          x: rnd() * 2 - 1, y: rnd() * 2 - 1, z: rnd() * 2 + 0.3,
          r: rnd() * 2.4 + 1.2, sp: rnd() * 0.5 + 0.2, ph: rnd() * Math.PI * 2,
          col: COLORS[(rnd() * COLORS.length) | 0], rot: rnd() * Math.PI, spin: (rnd() * 2 - 1) * 0.5,
          shape: rnd() > 0.5 ? "rect" : "circle"
        });
      }

      var mx = 0, my = 0, tmx = 0, tmy = 0;
      hero.addEventListener("mousemove", function (e) {
        var b = hero.getBoundingClientRect();
        tmx = ((e.clientX - b.left) / b.width - 0.5) * 2;
        tmy = ((e.clientY - b.top) / b.height - 0.5) * 2;
      });
      hero.addEventListener("mouseleave", function () { tmx = 0; tmy = 0; });

      var t0 = performance.now();
      var raf = null;
      function project(n, time) {
        var dx = n.x + Math.sin(time * n.sp + n.ph) * 0.10 + mx * 0.14 * n.z;
        var dy = n.y + Math.cos(time * n.sp * 0.7 + n.ph) * 0.08 + my * 0.10 * n.z;
        var scale = FOV / (FOV + n.z * 200);
        return { sx: W * 0.5 + dx * W * 0.46 * scale, sy: H * 0.5 + dy * H * 0.55 * scale, s: scale };
      }
      function frame(now) {
        var time = (now - t0) / 1000;
        mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
        ctx.clearRect(0, 0, W, H);
        var idx = bits.map(function (b, i) { return i; }).sort(function (a, b) { return bits[b].z - bits[a].z; });
        for (var k = 0; k < idx.length; k++) {
          var n = bits[idx[k]], p = project(n, time);
          var alpha = Math.min((0.3 + (2.3 - n.z) * 0.3) * p.s, 0.92);
          var size = n.r * p.s * 2.4;
          ctx.save();
          ctx.translate(p.sx, p.sy);
          ctx.rotate(n.rot + time * n.spin);
          ctx.globalAlpha = alpha;
          ctx.shadowColor = "rgba(" + n.col[0] + "," + n.col[1] + "," + n.col[2] + ",0.8)";
          ctx.shadowBlur = size * 2.2;
          ctx.fillStyle = "rgba(" + n.col[0] + "," + n.col[1] + "," + n.col[2] + ",1)";
          if (n.shape === "rect") { ctx.fillRect(-size / 2, -size / 2, size, size * 0.6); }
          else { ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        }
        // parallax the banner emblem + copy subtly
        if (heroCopyLayer) heroCopyLayer.style.transform = "translate3d(" + (mx * 8).toFixed(2) + "px," + (my * 5).toFixed(2) + "px,0)";
        raf = requestAnimationFrame(frame);
      }

      var heroCopyLayer = null; // set below

      if (!reduce) raf = requestAnimationFrame(frame);
      else {
        var timeS = 0; ctx.clearRect(0, 0, W, H);
        for (var s = 0; s < bits.length; s++) {
          var n = bits[s], p = project(n, timeS);
          ctx.globalAlpha = 0.5; ctx.fillStyle = "rgba(" + n.col[0] + "," + n.col[1] + "," + n.col[2] + ",1)";
          ctx.beginPath(); ctx.arc(p.sx, p.sy, n.r * p.s, 0, Math.PI * 2); ctx.fill();
        }
      }

      if ("IntersectionObserver" in window && !reduce) {
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (en) {
            if (en.isIntersecting) { if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); } }
            else if (raf) { cancelAnimationFrame(raf); raf = null; }
          });
        }, { threshold: 0 });
        io.observe(hero);
      }

      // expose the copy layer for parallax (eyebrow+title+sub wrapper = the hero itself minus banner)
      heroCopyLayer = document.createElement("div");
      // we don't restructure DOM; instead parallax the individual copy nodes via a wrapper class
    }

    // --- staggered 3D reveal of hero copy ------------------------------------
    var eyebrow = hero.querySelector(".home-eyebrow");
    var title = hero.querySelector(".home-title");
    var sub = hero.querySelector(".home-sub");
    var tent = hero.querySelector(".home-tent");

    // split title into words (preserve <em>)
    var words = [];
    if (title && !title.dataset.split) {
      title.dataset.split = "1";
      var tmp = document.createElement("div"); tmp.innerHTML = title.innerHTML;
      title.innerHTML = "";
      Array.prototype.forEach.call(tmp.childNodes, function (node) {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w.trim()) { title.appendChild(document.createTextNode(w)); return; }
            var sp = document.createElement("span"); sp.className = "ht-word"; sp.textContent = w;
            title.appendChild(sp); words.push(sp);
          });
        } else {
          node.classList && node.classList.add("ht-word");
          title.appendChild(node); words.push(node);
        }
      });
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll(".tracks .track-card"));

    if (reduce || !window.anime) {
      [eyebrow, title, sub].forEach(function (n) { if (n) { n.style.opacity = 1; n.style.transform = "none"; } });
      words.forEach(function (w) { w.style.opacity = 1; w.style.transform = "none"; });
      cards.forEach(function (c) { c.style.opacity = 1; c.style.transform = "none"; });
      wireCardTilt(cards);
      return;
    }

    var tl = anime.timeline({ easing: "cubicBezier(.2,.7,.2,1)", duration: 900 });
    if (tent) tl.add({ targets: tent, opacity: [0, 1], translateY: [-40, 0], rotate: [-18, 0], scale: [0.6, 1], duration: 900, easing: "spring(1, 70, 9, 0)" });
    if (eyebrow) tl.add({ targets: eyebrow, opacity: [0, 1], translateY: [16, 0], filter: ["blur(6px)", "blur(0px)"], duration: 620 }, "-=650");
    if (words.length) tl.add({
      targets: words, opacity: [0, 1], translateY: [60, 0], translateZ: [-180, 0], rotateX: [-80, 0],
      duration: 1200, delay: anime.stagger(90), easing: "spring(1, 80, 11, 0)"
    }, "-=400");
    if (sub) tl.add({ targets: sub, opacity: [0, 1], translateY: [22, 0], duration: 700 }, "-=850");
    if (cards.length) tl.add({
      targets: cards, opacity: [0, 1], translateY: [70, 0], translateZ: [-220, 0], rotateX: [26, 0], rotateY: [-14, 0],
      scale: [0.9, 1], duration: 1100, delay: anime.stagger(130), easing: "spring(1, 76, 12, 0)"
    }, "-=650");

    tl.finished.then(function () {
      cards.forEach(function (c) { c.style.opacity = 1; c.style.transform = ""; });
      wireCardTilt(cards);
    });
    // safety: ensure cards are interactive even if finished never fires
    setTimeout(function () { cards.forEach(function (c) { if (getComputedStyle(c).opacity === "0") c.style.opacity = 1; }); }, 3500);
  }

  // Live pointer-driven 3D tilt on each card (kinetic, spring-eased return).
  function wireCardTilt(cards) {
    if (reduce) return;
    cards.forEach(function (card) {
      var rafT = null, tx = 0, ty = 0, cx = 0, cy = 0;
      function loop() {
        cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
        card.style.transform = "perspective(900px) rotateX(" + cy.toFixed(2) + "deg) rotateY(" + cx.toFixed(2) + "deg) translateY(-6px)";
        if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) rafT = requestAnimationFrame(loop);
        else rafT = null;
      }
      card.addEventListener("mousemove", function (e) {
        var b = card.getBoundingClientRect();
        tx = ((e.clientX - b.left) / b.width - 0.5) * 14;   // rotateY
        ty = -((e.clientY - b.top) / b.height - 0.5) * 12;  // rotateX
        if (!rafT) rafT = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!rafT) rafT = requestAnimationFrame(loop);
        // let the spring settle, then clear inline transform so CSS hover rules resume
        setTimeout(function () { if (Math.abs(cx) < 0.1 && Math.abs(cy) < 0.1) card.style.transform = ""; }, 500);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
