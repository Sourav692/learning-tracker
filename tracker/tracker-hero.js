/* ===========================================================================
   tracker-hero.js — bespoke 3D hero animation for the topic-first hub header.

   Builds a layered, perspective-projected depth field behind the hero copy
   (floating nodes + connective grid, drifting in 3D), a mouse-parallax tilt on
   the whole hero stage, a staggered 3D reveal of the eyebrow / title / sub /
   stats / controls, and a count-up on the stat pills.

   Uses anime.js (v3). Purely additive: it decorates existing markup and never
   blocks the tracker's data rendering. Honours prefers-reduced-motion.
   =========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function boot() {
    var header = document.querySelector("header.hdr");
    if (!header) return;
    var stage = header.querySelector(".wrap");
    if (!stage) return;

    // --- inject a 3D scene canvas behind the hero copy ------------------------
    var scene = document.createElement("div");
    scene.className = "hero3d";
    scene.setAttribute("aria-hidden", "true");
    var canvas = document.createElement("canvas");
    scene.appendChild(canvas);
    header.insertBefore(scene, header.firstChild);

    // establish 3D context + reveal targets
    header.classList.add("hero3d-on");

    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    function resize() {
      W = header.offsetWidth; H = header.offsetHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // --- 3D node field --------------------------------------------------------
    // Nodes live in a normalized 3D box; we project them with a simple pinhole
    // camera. Depth drives size, alpha, and parallax — the "expensive" feel.
    var TEAL = [52, 214, 193];
    var AMBER = [244, 169, 60];
    var COUNT = window.innerWidth < 700 ? 26 : 46;
    var FOV = 320;
    var nodes = [];
    // seeded pseudo-random so layout is stable within a session
    var seed = 1337;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    for (var i = 0; i < COUNT; i++) {
      nodes.push({
        x: (rnd() * 2 - 1),           // -1..1
        y: (rnd() * 2 - 1),
        z: rnd() * 2 + 0.4,           // 0.4..2.4 depth
        r: rnd() * 1.6 + 0.8,
        sp: rnd() * 0.4 + 0.15,       // drift speed
        ph: rnd() * Math.PI * 2,
        amber: rnd() > 0.78
      });
    }

    var mx = 0, my = 0, tmx = 0, tmy = 0; // mouse parallax (target + eased)
    header.addEventListener("mousemove", function (e) {
      var b = header.getBoundingClientRect();
      tmx = ((e.clientX - b.left) / b.width - 0.5) * 2;   // -1..1
      tmy = ((e.clientY - b.top) / b.height - 0.5) * 2;
    });
    header.addEventListener("mouseleave", function () { tmx = 0; tmy = 0; });

    var t0 = performance.now();
    var raf = null;
    function project(n, time) {
      // drift + gentle orbit
      var dx = n.x + Math.sin(time * n.sp + n.ph) * 0.06 + mx * 0.10 * n.z;
      var dy = n.y + Math.cos(time * n.sp * 0.8 + n.ph) * 0.05 + my * 0.10 * n.z;
      var scale = FOV / (FOV + n.z * 220);
      return {
        sx: W * 0.5 + dx * W * 0.42 * scale,
        sy: H * 0.5 + dy * H * 0.62 * scale,
        s: scale,
        z: n.z
      };
    }

    function frame(now) {
      var time = (now - t0) / 1000;
      mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
      ctx.clearRect(0, 0, W, H);

      // pre-project
      var pts = [];
      for (var i = 0; i < nodes.length; i++) pts.push(project(nodes[i], time));

      // connective lines between near neighbours (depth-aware)
      ctx.lineWidth = 1;
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var ddx = pts[a].sx - pts[b].sx, ddy = pts[a].sy - pts[b].sy;
          var d2 = ddx * ddx + ddy * ddy;
          if (d2 < 128 * 128) {
            var al = (1 - Math.sqrt(d2) / 128) * 0.16 * Math.min(pts[a].s, pts[b].s);
            ctx.strokeStyle = "rgba(" + TEAL[0] + "," + TEAL[1] + "," + TEAL[2] + "," + al.toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(pts[a].sx, pts[a].sy); ctx.lineTo(pts[b].sx, pts[b].sy); ctx.stroke();
          }
        }
      }
      // nodes (draw far→near)
      var orderIdx = pts.map(function (p, i) { return i; }).sort(function (i, j) { return pts[j].z - pts[i].z; });
      for (var k = 0; k < orderIdx.length; k++) {
        var idx = orderIdx[k], p = pts[idx], n = nodes[idx];
        var col = n.amber ? AMBER : TEAL;
        var alpha = (0.22 + (2.4 - n.z) * 0.28) * p.s;
        var rad = n.r * p.s * 2.2;
        var g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad * 3);
        g.addColorStop(0, "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + Math.min(alpha, 0.9).toFixed(3) + ")");
        g.addColorStop(1, "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rad * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + Math.min(alpha + 0.25, 1).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(p.sx, p.sy, Math.max(rad, 0.6), 0, Math.PI * 2); ctx.fill();
      }

      // subtle parallax on the copy layer
      stage.style.transform = "translate3d(" + (mx * 10).toFixed(2) + "px," + (my * 6).toFixed(2) + "px,0) rotateX(" + (-my * 2.2).toFixed(2) + "deg) rotateY(" + (mx * 2.6).toFixed(2) + "deg)";

      raf = requestAnimationFrame(frame);
    }

    if (!reduce) raf = requestAnimationFrame(frame);
    else {
      // static single paint for reduced-motion
      var now = t0; frameStatic();
      function frameStatic() {
        var time = 0; ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < nodes.length; i++) {
          var p = project(nodes[i], time), n = nodes[i], col = n.amber ? AMBER : TEAL;
          ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.4)";
          ctx.beginPath(); ctx.arc(p.sx, p.sy, Math.max(n.r * p.s * 2, 1), 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // pause the loop when the header scrolls out of view (perf)
    if ("IntersectionObserver" in window && !reduce) {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); } }
          else if (raf) { cancelAnimationFrame(raf); raf = null; stage.style.transform = ""; }
        });
      }, { threshold: 0 });
      io.observe(header);
    }

    // --- staggered 3D reveal of the hero copy --------------------------------
    revealCopy();
    function revealCopy() {
      var eyebrow = stage.querySelector(".eyebrow");
      var title = stage.querySelector(".h1");
      var sub = stage.querySelector(".sub");
      var controls = stage.querySelector(".hub-controls");

      // split the title into per-word spans for a 3D cascade
      var titleWords = [];
      if (title && !title.dataset.split) {
        title.dataset.split = "1";
        var html = title.innerHTML;
        // wrap top-level words while preserving the <em> element
        var tmp = document.createElement("div"); tmp.innerHTML = html;
        title.innerHTML = "";
        Array.prototype.forEach.call(tmp.childNodes, function (node) {
          if (node.nodeType === 3) {
            node.textContent.split(/(\s+)/).forEach(function (w) {
              if (!w.trim()) { title.appendChild(document.createTextNode(w)); return; }
              var s = document.createElement("span"); s.className = "h1-word"; s.textContent = w;
              title.appendChild(s); titleWords.push(s);
            });
          } else {
            node.classList && node.classList.add("h1-word");
            title.appendChild(node); titleWords.push(node);
          }
        });
      }

      if (reduce) {
        [eyebrow, title, sub, controls].forEach(function (n) { if (n) { n.style.opacity = 1; n.style.transform = "none"; } });
        titleWords.forEach(function (w) { w.style.opacity = 1; w.style.transform = "none"; });
        animateStats(true);
        return;
      }

      if (!window.anime) { // library missing — just show everything
        [eyebrow, title, sub, controls].forEach(function (n) { if (n) n.style.opacity = 1; });
        titleWords.forEach(function (w) { w.style.opacity = 1; });
        animateStats(true);
        return;
      }

      var tl = anime.timeline({ easing: "cubicBezier(.2,.7,.2,1)", duration: 900 });
      if (eyebrow) tl.add({ targets: eyebrow, opacity: [0, 1], translateY: [14, 0], filter: ["blur(6px)", "blur(0px)"], duration: 650 });
      if (titleWords.length) tl.add({
        targets: titleWords,
        opacity: [0, 1],
        translateY: [46, 0],
        translateZ: [-140, 0],
        rotateX: [-70, 0],
        duration: 1100,
        delay: anime.stagger(85),
        easing: "spring(1, 82, 12, 0)"
      }, "-=350");
      if (sub) tl.add({ targets: sub, opacity: [0, 1], translateY: [20, 0], duration: 720 }, "-=750");
      var statPills = stage.querySelectorAll(".stat-row .stat");
      if (statPills.length) tl.add({ targets: statPills, opacity: [0, 1], translateY: [16, 0], scale: [0.9, 1], delay: anime.stagger(70), duration: 620 }, "-=520");
      if (controls) tl.add({ targets: controls, opacity: [0, 1], translateY: [14, 0], duration: 560 }, "-=420");
      tl.finished.then(function () { animateStats(false); });
      // stats may render slightly after boot (tracker-app populates them); observe.
      watchStats();
    }

    // Count-up on the numeric stat pills once they exist.
    var statsDone = false;
    function animateStats(instant) {
      if (statsDone) return;
      var pills = stage.querySelectorAll(".stat-row .stat");
      if (!pills.length) return;
      statsDone = true;
      pills.forEach(function (pill) {
        var m = pill.textContent.match(/^(\d[\d,]*)(.*)$/);
        if (!m) return;
        var target = parseInt(m[1].replace(/,/g, ""), 10);
        var suffix = m[2];
        if (instant || reduce || !window.anime) { pill.textContent = target + suffix; return; }
        var obj = { v: 0 };
        anime({ targets: obj, v: target, round: 1, duration: 1200, easing: "cubicBezier(.15,.85,.25,1)",
          update: function () { pill.textContent = obj.v + suffix; } });
      });
    }
    function watchStats() {
      var tries = 0;
      var iv = setInterval(function () {
        var pills = stage.querySelectorAll(".stat-row .stat");
        if (pills.length || tries++ > 40) { clearInterval(iv); if (pills.length) animateStats(false); }
      }, 100);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
