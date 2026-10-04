(function () {
  "use strict";
  var S = window.SITE;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Links built from config ---------- */
  function waLink(text) {
    return "https://wa.me/" + S.phoneIntl + "?text=" + encodeURIComponent(text);
  }
  var telHref = "tel:+" + S.phoneIntl;

  document.querySelectorAll("[data-call]").forEach(function (a) { a.setAttribute("href", telHref); });
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var extra = a.getAttribute("data-msg");
    a.setAttribute("href", waLink(extra ? S.whatsappGreeting + " " + extra : S.whatsappGreeting));
  });
  document.querySelectorAll("[data-phone]").forEach(function (el) { el.textContent = S.phoneDisplay; });
  document.getElementById("yr").textContent = new Date().getFullYear();

  /* ---------- Running banner ---------- */
  var items = [
    S.businessName.toUpperCase(),
    "TOYOTA RUMION 7-SEATER AC",
    "SIWAN TO ANYWHERE IN BIHAR AND INDIA",
    "CALL NOW: " + S.phoneDisplay,
    "24x7 CAB SERVICE",
    "WHATSAPP BOOKING OPEN"
  ];
  var strip = items.map(function (t) { return "<span>" + t + "</span>"; }).join("");
  document.getElementById("tickerTrack").innerHTML = strip + strip + strip + strip;
  // track holds 4 copies; animating -50% = 2 copies = seamless loop

  /* ---------- Priority green board ---------- */
  document.getElementById("pboardGrid").innerHTML = S.priorityRoutes.map(function (r, i) {
    var msg = r.to === "Siwan"
      ? S.whatsappGreeting + " I need a local cab in Siwan."
      : S.whatsappGreeting + " Pickup: Siwan. Drop: " + r.to + ".";
    return '<a class="pcity" target="_blank" rel="noopener" href="' + waLink(msg) + '">' +
      '<em>' + (i + 1) + '</em><span><b>' + r.to + '</b><small>' + r.state + '</small></span><i aria-hidden="true">&rarr;</i></a>';
  }).join("");

  /* ---------- Highway signs ---------- */
  var signs = document.getElementById("signs");
  signs.innerHTML = S.routes.map(function (r) {
    var msg = S.whatsappGreeting + " Pickup: Siwan. Drop: " + r.to + ".";
    return '<a class="sign" target="_blank" rel="noopener" href="' + waLink(msg) + '">' +
      "<small>" + r.state + "</small><b>" + r.to + "</b><span>Book this route</span></a>";
  }).join("");

  /* ---------- Rates ---------- */
  var ratesSection = document.getElementById("rates");
  if (!S.showRates) {
    ratesSection.hidden = true;
    document.getElementById("navRates").hidden = true;
  } else {
    document.getElementById("meter").innerHTML = S.rates.map(function (r) {
      return '<div class="meter-row"><span>' + r.label + "</span><b>" + r.price + "<small>" + r.unit + "</small></b></div>";
    }).join("") + '<p class="meter-note">Sample guide prices. Final fare depends on distance, trip type, date and availability.</p>';
  }

  /* ---------- Booking form -> WhatsApp ---------- */
  var dateEl = document.getElementById("f-date");
  var today = new Date();
  dateEl.min = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

  var note = document.getElementById("formNote");
  document.getElementById("sendWa").addEventListener("click", function () {
    var to = document.getElementById("f-to").value.trim();
    var from = document.getElementById("f-from").value.trim() || "Siwan";
    if (!to) {
      note.textContent = "Enter the city you are going to.";
      note.className = "note err";
      document.getElementById("f-to").focus();
      return;
    }
    var name = document.getElementById("f-name").value.trim();
    var lines = [
      S.whatsappGreeting,
      name ? "Name: " + name : null,
      "Pickup: " + from,
      "Drop: " + to,
      dateEl.value ? "Date: " + dateEl.value : null,
      "Passengers: " + document.getElementById("f-pax").value,
      "Trip: " + document.getElementById("f-type").value
    ].filter(Boolean);
    note.textContent = "Opening WhatsApp with your message.";
    note.className = "note";
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });

  /* ---------- 3D tilt (desktop pointer only) ---------- */
  if (finePointer && !reduce) {
    var bb = document.getElementById("billboard");
    var stage = document.getElementById("stage");
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      bb.style.setProperty("--ry", (-14 + x * 16) + "deg");
      bb.style.setProperty("--rx", (4 - y * 12) + "deg");
    });
    stage.addEventListener("pointerleave", function () {
      bb.style.setProperty("--ry", "-14deg");
      bb.style.setProperty("--rx", "4deg");
    });

    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "rotateY(" + (x * 14) + "deg) rotateX(" + (-y * 14) + "deg) translateZ(8px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- Pseudo-3D highway (canvas) ---------- */
  var canvas = document.getElementById("road");
  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, off = 0, tm = 0, last = performance.now(), running = false, visible = true;
  var stars = [];
  for (var i = 0; i < 90; i++) stars.push({ x: Math.random(), y: Math.random() * 0.8, r: Math.random() * 1.4 + 0.3, p: Math.random() * 6 });

  function resize() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce) draw(performance.now());
  }

  function mountain(base, amp, seed, color, hz, shift) {
    ctx.beginPath();
    ctx.moveTo(0, hz);
    for (var x = 0; x <= W + 8; x += 8) {
      var n = Math.sin((x + shift) * 0.006 + seed) * 0.55 + Math.sin((x + shift) * 0.017 + seed * 2.3) * 0.3 + Math.sin((x + shift) * 0.041 + seed * 4.1) * 0.15;
      ctx.lineTo(x, hz - base - (n * 0.5 + 0.5) * amp);
    }
    ctx.lineTo(W, hz);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function draw(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduce) { off += dt * 2.6; tm += dt; }

    var hz = Math.round(H * 0.44);
    var cx = W * (W > 980 ? 0.44 : 0.5);
    var curve = Math.sin(tm * 0.28) * 0.22;
    var rw = W * 0.62;

    /* sky */
    var sky = ctx.createLinearGradient(0, 0, 0, hz);
    sky.addColorStop(0, "#060a24");
    sky.addColorStop(0.45, "#1b2468");
    sky.addColorStop(0.78, "#8a3f7c");
    sky.addColorStop(1, "#ff9a3c");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, hz + 1);

    /* stars */
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      var a = 0.35 + 0.65 * Math.abs(Math.sin(tm * 1.2 + st.p));
      ctx.fillStyle = "rgba(255,255,255," + (a * (1 - st.y)).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(st.x * W, st.y * hz, st.r, 0, 6.283); ctx.fill();
    }

    /* sun */
    var sr = Math.min(W, H) * 0.17;
    var sx = cx + W * 0.2, sy = hz - sr * 0.15;
    var glow = ctx.createRadialGradient(sx, sy, sr * 0.4, sx, sy, sr * 3);
    glow.addColorStop(0, "rgba(255,170,70,.55)");
    glow.addColorStop(1, "rgba(255,170,70,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(sx - sr * 3, sy - sr * 3, sr * 6, sr * 6);
    ctx.save();
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 6.283); ctx.clip();
    var sg = ctx.createLinearGradient(0, sy - sr, 0, sy + sr);
    sg.addColorStop(0, "#ffe08a"); sg.addColorStop(0.55, "#ff9a3c"); sg.addColorStop(1, "#e2457a");
    ctx.fillStyle = sg; ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
    ctx.restore();

    /* mountains */
    mountain(0, H * 0.12, 1.3, "#2a2a6e", hz, tm * 4);
    mountain(0, H * 0.075, 4.2, "#14184a", hz, tm * 9 + 300);

    /* ground and road, row by row for the perspective effect */
    var rows = H - hz;
    var step = 1;
    for (var y = hz; y < H; y += step) {
      var p = (y - hz) / rows;
      if (p < 0.012) p = 0.012;
      var d = 1 / p;
      var dx = curve * W * 0.42 * (1 - p) * (1 - p);
      var c0 = Math.round(cx + dx);
      var half = Math.round(rw * p);
      var rumble = half * 0.075;
      var ph = d * 0.8 + off;

      ctx.fillStyle = Math.sin(ph * 0.5) > 0 ? "#0b1038" : "#0e1544";
      ctx.fillRect(0, y, W, step);

      ctx.fillStyle = Math.sin(d * 1.6 + off * 2) > 0 ? "#f5821f" : "#ffffff";
      ctx.fillRect(c0 - half - rumble, y, rumble, step);
      ctx.fillRect(c0 + half, y, rumble, step);

      ctx.fillStyle = Math.sin(ph) > 0 ? "#161a2a" : "#1a1f31";
      ctx.fillRect(c0 - half, y, half * 2, step);

      ctx.fillStyle = "rgba(255,255,255,.85)";
      var lw = Math.max(1, half * 0.02);
      ctx.fillRect(c0 - half * 0.93, y, lw, step);
      ctx.fillRect(c0 + half * 0.93 - lw, y, lw, step);

      if (Math.sin(ph) > 0.45) {
        ctx.fillStyle = "#ffd36b";
        var dw = Math.max(1, half * 0.03);
        ctx.fillRect(c0 - dw / 2, y, dw, step);
      }
    }

    /* sunset haze at the horizon */
    var haze = ctx.createLinearGradient(0, hz - 6, 0, hz + rows * 0.3);
    haze.addColorStop(0, "rgba(255,140,60,.55)");
    haze.addColorStop(1, "rgba(255,140,60,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, hz - 6, W, rows * 0.3 + 6);

    /* street lamps, far to near */
    var lamps = [];
    var SP = 6, N = 8, K = 0.8;
    for (var n = 0; n < N; n++) {
      var dd = (((n * SP - off) % (N * SP)) + N * SP) % (N * SP) / K;
      if (dd < 1) continue;
      lamps.push({ d: dd, side: n % 2 ? 1 : -1 });
    }
    lamps.sort(function (a, b) { return b.d - a.d; });
    for (var l = 0; l < lamps.length; l++) {
      var lp = 1 / lamps[l].d;
      var ly = hz + rows * lp;
      var ldx = curve * W * 0.42 * (1 - lp) * (1 - lp);
      var lx = cx + ldx + lamps[l].side * (rw * lp * 1.2);
      var lh = rows * lp * 0.95;
      var lwid = Math.max(1, 7 * lp);
      ctx.fillStyle = "#2b3254";
      ctx.fillRect(lx - lwid / 2, ly - lh, lwid, lh);
      var armX = lx - lamps[l].side * rw * lp * 0.2;
      ctx.strokeStyle = "#2b3254"; ctx.lineWidth = lwid;
      ctx.beginPath(); ctx.moveTo(lx, ly - lh); ctx.lineTo(armX, ly - lh - lh * 0.03); ctx.stroke();
      var gr = Math.max(6, 70 * lp);
      var lg = ctx.createRadialGradient(armX, ly - lh, 0, armX, ly - lh, gr);
      lg.addColorStop(0, "rgba(255,238,180,.95)");
      lg.addColorStop(0.25, "rgba(255,214,120,.45)");
      lg.addColorStop(1, "rgba(255,214,120,0)");
      ctx.fillStyle = lg;
      ctx.fillRect(armX - gr, ly - lh - gr, gr * 2, gr * 2);
    }

    if (running && !reduce) requestAnimationFrame(draw);
  }

  function start() {
    if (reduce || running || !visible || document.hidden) return;
    running = true; last = performance.now();
    requestAnimationFrame(draw);
  }
  function stop() { running = false; }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      visible ? start() : stop();
    }).observe(document.getElementById("hero"));
  }
  resize();
  if (reduce) draw(performance.now()); else start();
})();
