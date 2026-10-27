// 量子力学シミュレーション：無限/有限井戸型ポテンシャル・ボーアモデル・不確定性原理・物質波（波束）

const QMSimView = (function () {
  var bodyEl, tabsEl;
  var currentSim = "infinite-well";
  var cleanupFn = null;
  var HBAR = 1.0546e-34, ME = 9.109e-31, EV = 1.602e-19, H_EV_NM = 1240; // hc in eV*nm

  function fitCanvas(canvas, cssHeight) {
    var w = canvas.parentElement.clientWidth;
    var dpr = window.devicePixelRatio || 1;
    canvas.style.height = cssHeight + "px";
    canvas.width = Math.max(200, w) * dpr;
    canvas.height = cssHeight * dpr;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: Math.max(200, w), h: cssHeight };
  }

  function clearCleanup() {
    if (cleanupFn) { cleanupFn(); cleanupFn = null; }
  }

  // ---------------------------------------------------------------
  // 1. 無限に深い井戸型ポテンシャル
  // ---------------------------------------------------------------
  function renderInfiniteWell() {
    bodyEl.innerHTML =
      '<div class="sim-layout">' +
      '<div class="sim-controls">' +
      '<h2>パラメータ</h2>' +
      '<div class="slider-row"><label>量子数 n <span id="iw-n-val">1</span></label><input type="range" id="iw-n" min="1" max="6" step="1" value="1"></div>' +
      '<div class="slider-row"><label>井戸の幅 L <span id="iw-L-val">1.0 nm</span></label><input type="range" id="iw-L" min="0.3" max="2.5" step="0.05" value="1.0"></div>' +
      '<div class="chip-group"><button class="chip active" data-mode="psi">波動関数 ψ</button><button class="chip" data-mode="psi2">確率密度 |ψ|²</button></div>' +
      '<div class="sim-readout" id="iw-readout"></div>' +
      '<p class="sim-note">出典: ryousi p.49–58。0≤x≤L で V=0、それ以外で V=∞ のモデル。境界条件からエネルギーが離散化される。</p>' +
      '</div>' +
      '<div class="sim-canvas-area"><canvas id="iw-canvas"></canvas>' +
      '<div class="sim-legend"><span><i style="background:#3657c9"></i>ポテンシャル V(x)</span><span><i style="background:#c0392b"></i>波動関数</span></div></div>' +
      '</div>';

    var mode = "psi";
    var nInput = document.getElementById("iw-n"), LInput = document.getElementById("iw-L");
    var canvas = document.getElementById("iw-canvas");

    function draw() {
      var n = parseInt(nInput.value, 10);
      var L = parseFloat(LInput.value);
      document.getElementById("iw-n-val").textContent = n;
      document.getElementById("iw-L-val").textContent = L.toFixed(2) + " nm";
      var En = 0.376 * n * n / (L * L); // eV, electron in a box

      var dims = fitCanvas(canvas, 320);
      var ctx = dims.ctx, w = dims.w, h = dims.h;
      var padL = 50, padR = 20, padT = 20, padB = 40;
      var plotW = w - padL - padR, plotH = h - padT - padB;
      ctx.clearRect(0, 0, w, h);

      // 井戸の壁
      ctx.strokeStyle = "#3657c9"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.lineTo(padL + plotW, padT);
      ctx.stroke();

      // 軸ラベル
      ctx.fillStyle = "#677187"; ctx.font = "12px sans-serif";
      ctx.fillText("0", padL - 4, padT + plotH + 18);
      ctx.fillText(L.toFixed(2) + " nm", padL + plotW - 24, padT + plotH + 18);
      ctx.fillText(mode === "psi" ? "ψ(x)" : "|ψ(x)|²", 6, padT + 10);

      var mid = padT + plotH / 2;
      ctx.strokeStyle = "#e4e7f0"; ctx.beginPath(); ctx.moveTo(padL, mid); ctx.lineTo(padL + plotW, mid); ctx.stroke();

      var N = 200;
      var maxAmp = Math.sqrt(2 / L);
      var scale = mode === "psi" ? (plotH * 0.42) / maxAmp : (plotH * 0.82) / (maxAmp * maxAmp);
      ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 2.2; ctx.beginPath();
      for (var i = 0; i <= N; i++) {
        var x = (i / N) * L;
        var psi = Math.sqrt(2 / L) * Math.sin(n * Math.PI * x / L);
        var val = mode === "psi" ? psi : psi * psi;
        var px = padL + (x / L) * plotW;
        var py = mode === "psi" ? (mid - val * scale) : (padT + plotH - val * scale);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      document.getElementById("iw-readout").innerHTML =
        "<div><b>E<sub>" + n + "</sub></b> = " + En.toFixed(3) + " eV　（電子, E<sub>n</sub>=0.376·n²/L²[eV], L in nm）</div>" +
        "<div>n が大きいほど、ノード（波動関数が0になる点）の数が増えます（n−1個）。</div>";
    }

    nInput.addEventListener("input", draw);
    LInput.addEventListener("input", draw);
    bodyEl.querySelectorAll(".chip-group .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        bodyEl.querySelectorAll(".chip-group .chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        mode = chip.dataset.mode;
        draw();
      });
    });
    draw();
    cleanupFn = function () { window.removeEventListener("resize", draw); };
    window.addEventListener("resize", draw);
  }

  // ---------------------------------------------------------------
  // 2. 有限の井戸型ポテンシャル（トンネル的浸透）
  // ---------------------------------------------------------------
  function solveFiniteWell(z0) {
    function gEven(z) { return z * Math.tan(z) - Math.sqrt(Math.max(z0 * z0 - z * z, 0)); }
    function gOdd(z) { return -z / Math.tan(z) - Math.sqrt(Math.max(z0 * z0 - z * z, 0)); }
    function bisect(g, lo, hi) {
      var glo = g(lo), ghi = g(hi);
      if (!isFinite(glo) || !isFinite(ghi)) return null;
      if (glo === 0) return lo;
      if (ghi === 0) return hi;
      if (glo * ghi > 0) return null;
      for (var i = 0; i < 60; i++) {
        var mid = (lo + hi) / 2, gm = g(mid);
        if (Math.abs(gm) < 1e-9 || (hi - lo) < 1e-9) return mid;
        if (glo * gm < 0) { hi = mid; ghi = gm; } else { lo = mid; glo = gm; }
      }
      return (lo + hi) / 2;
    }
    var states = [];
    var m = 0, EPS = 1e-4;
    while (m * Math.PI < z0 && m < 60) {
      var evStart = m * Math.PI, evEnd = Math.min(m * Math.PI + Math.PI / 2, z0) - EPS;
      if (evEnd > evStart + EPS) {
        var re = bisect(gEven, evStart + EPS, evEnd);
        if (re !== null) states.push({ z: re, parity: "even" });
      }
      var oStart = m * Math.PI + Math.PI / 2, oEnd = Math.min((m + 1) * Math.PI, z0) - EPS;
      if (oEnd > oStart + EPS) {
        var ro = bisect(gOdd, oStart + EPS, oEnd);
        if (ro !== null) states.push({ z: ro, parity: "odd" });
      }
      m++;
    }
    states.sort(function (a, b) { return a.z - b.z; });
    states.forEach(function (s, idx) { s.n = idx + 1; });
    return states;
  }

  function renderFiniteWell() {
    bodyEl.innerHTML =
      '<div class="sim-layout">' +
      '<div class="sim-controls">' +
      '<h2>パラメータ</h2>' +
      '<div class="slider-row"><label>井戸の深さ V₀ <span id="fw-V-val">2.0 eV</span></label><input type="range" id="fw-V" min="0.2" max="6" step="0.1" value="2.0"></div>' +
      '<div class="slider-row"><label>井戸の幅 L <span id="fw-L-val">1.0 nm</span></label><input type="range" id="fw-L" min="0.3" max="2.5" step="0.05" value="1.0"></div>' +
      '<div class="slider-row"><label>表示する状態 n <span id="fw-n-val">1</span></label><input type="range" id="fw-n" min="1" max="1" step="1" value="1"></div>' +
      '<div class="sim-readout" id="fw-readout"></div>' +
      '<p class="sim-note">出典: ryousi p.64–70。V₀ を小さくするほど束縛状態は少なくなり、波動関数は井戸の外側（古典的には入れない領域）に大きくしみ出します（トンネル的浸透）。</p>' +
      '</div>' +
      '<div class="sim-canvas-area"><canvas id="fw-canvas"></canvas>' +
      '<div class="sim-legend"><span><i style="background:#3657c9"></i>ポテンシャル V(x)</span><span><i style="background:#c0392b"></i>波動関数 ψ(x)</span></div></div>' +
      '</div>';

    var VInput = document.getElementById("fw-V"), LInput = document.getElementById("fw-L"), nInput = document.getElementById("fw-n");
    var canvas = document.getElementById("fw-canvas");

    function draw() {
      var V0 = parseFloat(VInput.value), L = parseFloat(LInput.value);
      document.getElementById("fw-V-val").textContent = V0.toFixed(1) + " eV";
      document.getElementById("fw-L-val").textContent = L.toFixed(2) + " nm";

      // z0 = (L/2) * sqrt(2 m V0) / hbar   -- nm, eV 単位から無次元化
      var L_m = L * 1e-9;
      var z0 = (L_m / 2) * Math.sqrt(2 * ME * V0 * EV) / HBAR;
      var states = solveFiniteWell(z0);

      nInput.max = Math.max(1, states.length);
      var n = Math.min(parseInt(nInput.value, 10) || 1, Math.max(1, states.length));
      nInput.value = n;
      document.getElementById("fw-n-val").textContent = n;

      var dims = fitCanvas(canvas, 320);
      var ctx = dims.ctx, w = dims.w, h = dims.h;
      var padL = 50, padR = 20, padT = 20, padB = 40;
      var plotW = w - padL - padR, plotH = h - padT - padB;
      ctx.clearRect(0, 0, w, h);

      var xMax = L * 1.8; // 表示範囲（nm, 原点中心）
      function X(x_nm) { return padL + ((x_nm + xMax) / (2 * xMax)) * plotW; }

      // ポテンシャル描画
      ctx.strokeStyle = "#3657c9"; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(X(-xMax), padT + plotH * 0.15);
      ctx.lineTo(X(-L / 2), padT + plotH * 0.15);
      ctx.lineTo(X(-L / 2), padT + plotH);
      ctx.lineTo(X(L / 2), padT + plotH);
      ctx.lineTo(X(L / 2), padT + plotH * 0.15);
      ctx.lineTo(X(xMax), padT + plotH * 0.15);
      ctx.stroke();
      ctx.fillStyle = "#677187"; ctx.font = "11px sans-serif";
      ctx.fillText("-L/2", X(-L / 2) - 14, padT + plotH + 16);
      ctx.fillText("L/2", X(L / 2) - 6, padT + plotH + 16);

      if (states.length === 0) {
        ctx.fillStyle = "#c0392b"; ctx.font = "13px sans-serif";
        ctx.fillText("この V₀・L では束縛状態が存在しません。V₀ か L を大きくしてください。", padL, padT + plotH / 2);
        document.getElementById("fw-readout").innerHTML = "<div>束縛状態数: 0</div>";
        return;
      }

      var st = states[n - 1];
      var k = (2 * st.z) / L_m;             // 井戸内の波数
      var kappa = (2 * Math.sqrt(z0 * z0 - st.z * st.z)) / L_m; // 外側の減衰係数
      var E = (HBAR * HBAR * k * k) / (2 * ME) / EV; // eV

      // 波動関数の構築と数値正規化
      var M = 400;
      var xs = [], ys = [];
      var halfRange = xMax * 1e-9;
      for (var i = 0; i <= M; i++) {
        var x_m = -halfRange + (i / M) * 2 * halfRange;
        var val;
        if (Math.abs(x_m) <= L_m / 2) {
          val = st.parity === "even" ? Math.cos(k * x_m) : Math.sin(k * x_m);
        } else {
          var edgeVal = st.parity === "even" ? Math.cos(k * L_m / 2) : Math.sin(k * L_m / 2);
          var decay = Math.exp(-kappa * (Math.abs(x_m) - L_m / 2));
          var tailSign = (st.parity === "odd" && x_m < 0) ? -1 : 1;
          val = tailSign * edgeVal * decay;
        }
        xs.push(x_m); ys.push(val);
      }
      var norm = 0;
      for (var j = 0; j < ys.length - 1; j++) norm += 0.5 * (ys[j] * ys[j] + ys[j + 1] * ys[j + 1]) * (xs[1] - xs[0]);
      var A = 1 / Math.sqrt(norm);

      var maxAbs = 0;
      for (var p = 0; p < ys.length; p++) maxAbs = Math.max(maxAbs, Math.abs(ys[p] * A));
      var mid = padT + plotH * 0.55;
      var scale = (plotH * 0.38) / maxAbs;

      ctx.strokeStyle = "#e4e7f0"; ctx.beginPath(); ctx.moveTo(padL, mid); ctx.lineTo(padL + plotW, mid); ctx.stroke();
      ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 2.2; ctx.beginPath();
      for (var q = 0; q < xs.length; q++) {
        var px = X(xs[q] * 1e9), py = mid - ys[q] * A * scale;
        if (q === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // しみ出し領域を強調
      ctx.fillStyle = "rgba(192,57,43,0.08)";
      ctx.fillRect(X(-xMax), padT, X(-L / 2) - X(-xMax), plotH);
      ctx.fillRect(X(L / 2), padT, X(xMax) - X(L / 2), plotH);

      var list = states.map(function (s, idx) {
        var kk = (2 * s.z) / L_m;
        var Ei = (HBAR * HBAR * kk * kk) / (2 * ME) / EV;
        return "E" + (idx + 1) + "=" + Ei.toFixed(3) + "eV(" + (s.parity === "even" ? "偶" : "奇") + ")";
      }).join("　");

      document.getElementById("fw-readout").innerHTML =
        "<div><b>束縛状態数:</b> " + states.length + "</div>" +
        "<div><b>表示中:</b> E<sub>" + n + "</sub> = " + E.toFixed(3) + " eV（" + (st.parity === "even" ? "偶" : "奇") + "パリティ）</div>" +
        "<div><b>浸透の深さ 1/κ ≈</b> " + (1 / kappa * 1e9).toFixed(3) + " nm（赤く塗った領域で波動関数が指数的に減衰）</div>" +
        '<div class="muted small">' + list + "</div>";
    }

    [VInput, LInput, nInput].forEach(function (el) { el.addEventListener("input", draw); });
    draw();
    cleanupFn = function () { window.removeEventListener("resize", draw); };
    window.addEventListener("resize", draw);
  }

  // ---------------------------------------------------------------
  // 3. ボーアの原子モデル
  // ---------------------------------------------------------------
  function renderBohr() {
    bodyEl.innerHTML =
      '<div class="sim-layout">' +
      '<div class="sim-controls">' +
      '<h2>電子の軌道</h2>' +
      '<div class="slider-row"><label>遷移前 n<sub>i</sub> <span id="bo-ni-val">3</span></label><input type="range" id="bo-ni" min="2" max="6" step="1" value="3"></div>' +
      '<div class="slider-row"><label>遷移後 n<sub>f</sub> <span id="bo-nf-val">1</span></label><input type="range" id="bo-nf" min="1" max="5" step="1" value="1"></div>' +
      '<div class="sim-readout" id="bo-readout"></div>' +
      '<p class="sim-note">出典: ryousi p.13–16。r<sub>n</sub>=n²a₀, E<sub>n</sub>=−13.6/n² eV（水素原子）。半径は見やすさのため実際の n² 比より圧縮して表示しています。</p>' +
      '</div>' +
      '<div class="sim-canvas-area"><canvas id="bo-canvas"></canvas></div>' +
      '</div>';

    var niInput = document.getElementById("bo-ni"), nfInput = document.getElementById("bo-nf");
    var canvas = document.getElementById("bo-canvas");
    var angle = 0, raf;

    function orbitR(n) { return 26 * Math.sqrt(n); } // 表示用スケール（px, 圧縮表示）

    function frame() {
      var ni = parseInt(niInput.value, 10), nf = parseInt(nfInput.value, 10);
      if (nf >= ni) { nf = ni - 1; nfInput.value = nf; }
      document.getElementById("bo-ni-val").textContent = ni;
      document.getElementById("bo-nf-val").textContent = nf;

      var dims = fitCanvas(canvas, 340);
      var ctx = dims.ctx, w = dims.w, h = dims.h;
      var cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      for (var n = 1; n <= 6; n++) {
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR(n), 0, Math.PI * 2);
        ctx.strokeStyle = (n === ni || n === nf) ? "#3657c9" : "#dde3ee";
        ctx.lineWidth = (n === ni || n === nf) ? 2 : 1;
        ctx.stroke();
        ctx.fillStyle = "#9aa4bb"; ctx.font = "10px sans-serif";
        ctx.fillText("n=" + n, cx + orbitR(n) * 0.68, cy - orbitR(n) * 0.68);
      }
      ctx.fillStyle = "#c0392b";
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();

      var rElec = orbitR(ni);
      var ex = cx + rElec * Math.cos(angle), ey = cy + rElec * Math.sin(angle);
      ctx.fillStyle = "#1a8a5a";
      ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill();

      var En_i = -13.6 / (ni * ni), En_f = -13.6 / (nf * nf);
      var dE = En_i - En_f; // 負のまま: 放出時 Ei<Ef はありえないので nf<ni を仮定
      var emitE = En_f - En_i; // 正の値が放出エネルギー(Ei->Ef, ni>nf のとき)
      var lambda = H_EV_NM / Math.abs(emitE);

      // 光子を表す波線（軌道間）
      var rf = orbitR(nf);
      ctx.strokeStyle = "#e8a33d"; ctx.lineWidth = 2;
      ctx.beginPath();
      var steps = 24;
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        var rr = rElec + (rf - rElec) * t;
        var a2 = angle + Math.PI * 0.4 + t * Math.PI * 0.6;
        var wob = Math.sin(t * Math.PI * 6) * 4;
        var xx = cx + (rr + wob) * Math.cos(a2), yy = cy + (rr + wob) * Math.sin(a2);
        if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();

      document.getElementById("bo-readout").innerHTML =
        "<div><b>E<sub>" + ni + "</sub></b> = " + En_i.toFixed(2) + " eV　<b>E<sub>" + nf + "</sub></b> = " + En_f.toFixed(2) + " eV</div>" +
        "<div><b>放出される光子のエネルギー:</b> " + Math.abs(emitE).toFixed(2) + " eV</div>" +
        "<div><b>波長 λ = hc/ΔE:</b> " + lambda.toFixed(1) + " nm</div>";

      angle += 0.02 * ni;
      raf = requestAnimationFrame(frame);
    }

    niInput.addEventListener("input", function () {
      if (parseInt(nfInput.value, 10) >= parseInt(niInput.value, 10)) nfInput.value = parseInt(niInput.value, 10) - 1;
    });
    frame();
    cleanupFn = function () { cancelAnimationFrame(raf); };
  }

  // ---------------------------------------------------------------
  // 4. 不確定性原理
  // ---------------------------------------------------------------
  function renderUncertainty() {
    bodyEl.innerHTML =
      '<div class="sim-layout">' +
      '<div class="sim-controls">' +
      '<h2>位置の不確かさ Δx</h2>' +
      '<div class="slider-row"><label>Δx <span id="un-dx-val">0.3 nm</span></label><input type="range" id="un-dx" min="0.05" max="2" step="0.01" value="0.3"></div>' +
      '<div class="sim-readout" id="un-readout"></div>' +
      '<p class="sim-note">出典: ryousi p.23。最小不確定性波束（ガウス波束）を仮定すると Δx·Δp=ħ/2 で一定になり、Δxを小さくするほどΔpは大きくなります。</p>' +
      '</div>' +
      '<div class="sim-canvas-area"><canvas id="un-canvas"></canvas>' +
      '<div class="sim-legend"><span><i style="background:#3657c9"></i>位置空間 |ψ(x)|²</span><span><i style="background:#c0392b"></i>運動量空間 |φ(p)|²</span></div></div>' +
      '</div>';

    var dxInput = document.getElementById("un-dx");
    var canvas = document.getElementById("un-canvas");

    function gauss(x, sigma) { return Math.exp(-(x * x) / (2 * sigma * sigma)); }

    function draw() {
      var dx = parseFloat(dxInput.value); // nm
      document.getElementById("un-dx-val").textContent = dx.toFixed(2) + " nm";
      var dp = HBAR / (2 * dx * 1e-9); // kg m/s
      var dp_display = dp / HBAR; // 1/nm 単位 (hbar*k の k)

      var dims = fitCanvas(canvas, 320);
      var ctx = dims.ctx, w = dims.w, h = dims.h;
      ctx.clearRect(0, 0, w, h);
      var halfW = w / 2;
      [{ x0: 0, sigma: dx, color: "#3657c9", label: "x [nm]", unitSigma: dx },
       { x0: halfW, sigma: 1 / dx, color: "#c0392b", label: "k [1/nm] (∝p)", unitSigma: 1 / (2 * dx) }
      ].forEach(function (panel) {
        var padL = panel.x0 + 46, padR = panel.x0 + halfW - 16, padT = 20, padB = 36;
        var plotW = padR - padL, plotH = h - padT - padB;
        ctx.strokeStyle = "#dde3ee"; ctx.beginPath();
        ctx.moveTo(padL, padT + plotH); ctx.lineTo(padR, padT + plotH); ctx.stroke();
        ctx.fillStyle = "#677187"; ctx.font = "11px sans-serif";
        ctx.fillText(panel.label, padL, h - 10);

        var range = panel.unitSigma * 4;
        ctx.strokeStyle = panel.color; ctx.lineWidth = 2; ctx.beginPath();
        var N = 150;
        for (var i = 0; i <= N; i++) {
          var xv = -range + (i / N) * 2 * range;
          var yv = gauss(xv, panel.unitSigma);
          var px = padL + ((xv + range) / (2 * range)) * plotW;
          var py = padT + plotH - yv * plotH * 0.9;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      ctx.strokeStyle = "#e4e7f0"; ctx.beginPath(); ctx.moveTo(halfW, 10); ctx.lineTo(halfW, h - 10); ctx.stroke();

      document.getElementById("un-readout").innerHTML =
        "<div><b>Δx</b> = " + dx.toFixed(2) + " nm</div>" +
        "<div><b>Δp = ħ/(2Δx)</b> ≈ " + (dp * 1e9 / HBAR).toFixed(2) + " ħ/nm</div>" +
        "<div><b>Δx·Δp</b> = ħ/2 （一定）</div>";
    }

    dxInput.addEventListener("input", draw);
    draw();
    cleanupFn = function () { window.removeEventListener("resize", draw); };
    window.addEventListener("resize", draw);
  }

  // ---------------------------------------------------------------
  // 5. 物質波（波束）
  // ---------------------------------------------------------------
  function renderDeBroglie() {
    bodyEl.innerHTML =
      '<div class="sim-layout">' +
      '<div class="sim-controls">' +
      '<h2>波束のパラメータ</h2>' +
      '<div class="slider-row"><label>中心波数 k₀ <span id="db-k0-val">10</span></label><input type="range" id="db-k0" min="4" max="20" step="0.5" value="10"></div>' +
      '<div class="slider-row"><label>波数の広がり Δk <span id="db-dk-val">2.0</span></label><input type="range" id="db-dk" min="0.3" max="5" step="0.1" value="2.0"></div>' +
      '<div class="sim-readout" id="db-readout"></div>' +
      '<p class="sim-note">出典: ryousi p.18, p.27。自由粒子 ω=ħk²/2m の分散関係から、群速度は位相速度の2倍になります（v_g=2v_p）。Δkが小さいほど波束は空間的に広がります（不確定性原理と対応）。</p>' +
      '</div>' +
      '<div class="sim-canvas-area"><canvas id="db-canvas"></canvas>' +
      '<div class="sim-legend"><span><i style="background:#dde3ee"></i>個々の平面波の位相（細線）</span><span><i style="background:#c0392b"></i>波束の包絡線 |Ψ(x)|</span></div></div>' +
      '</div>';

    var k0Input = document.getElementById("db-k0"), dkInput = document.getElementById("db-dk");
    var canvas = document.getElementById("db-canvas");
    var t = 0, raf;

    function frame() {
      var k0 = parseFloat(k0Input.value), dk = parseFloat(dkInput.value);
      document.getElementById("db-k0-val").textContent = k0.toFixed(1);
      document.getElementById("db-dk-val").textContent = dk.toFixed(1);

      var dims = fitCanvas(canvas, 320);
      var ctx = dims.ctx, w = dims.w, h = dims.h;
      var padL = 20, padR = 20, plotW = w - padL - padR, mid = h / 2;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#e4e7f0"; ctx.beginPath(); ctx.moveTo(padL, mid); ctx.lineTo(padL + plotW, mid); ctx.stroke();

      var vg = k0;   // ħk0/m を適当な表示スケールに正規化（比較のための相対値）
      var vp = k0 / 2;
      var xRange = 20;
      var N = 300;
      var M = 15;
      var envMax = 0;
      var envelope = [];
      for (var i = 0; i <= N; i++) {
        var x = -xRange + (i / N) * 2 * xRange;
        var re = 0;
        for (var j = -M; j <= M; j++) {
          var k = k0 + (j / M) * dk * 2;
          var amp = Math.exp(-((k - k0) * (k - k0)) / (2 * dk * dk));
          var omega = k * k * 0.5; // 自由粒子分散関係（規格化単位）
          re += amp * Math.cos(k * (x - vp * 0.001) - omega * t);
        }
        envelope.push(re);
        envMax = Math.max(envMax, Math.abs(re));
      }
      var scale = (h * 0.38) / (envMax || 1);
      ctx.strokeStyle = "#dde3ee"; ctx.lineWidth = 1; ctx.beginPath();
      for (var i2 = 0; i2 <= N; i2++) {
        var px = padL + (i2 / N) * plotW, py = mid - envelope[i2] * scale;
        if (i2 === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 包絡線（ガウス型、群速度で移動）
      var sigmaX = 1 / dk;
      ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 2.2;
      ctx.beginPath();
      var centerShift = ((vg * t * 0.08 + xRange) % (2 * xRange)) - xRange;
      for (var i3 = 0; i3 <= N; i3++) {
        var x3 = -xRange + (i3 / N) * 2 * xRange;
        var env = Math.exp(-((x3 - centerShift) * (x3 - centerShift)) / (2 * sigmaX * sigmaX * 4));
        var px3 = padL + (i3 / N) * plotW, py3 = mid - env * (h * 0.38);
        if (i3 === 0) ctx.moveTo(px3, py3); else ctx.lineTo(px3, py3);
      }
      ctx.stroke();

      document.getElementById("db-readout").innerHTML =
        "<div><b>群速度 v_g</b> ∝ " + vg.toFixed(1) + "　<b>位相速度 v_p</b> ∝ " + vp.toFixed(1) + "（v_g = 2v_p）</div>" +
        "<div><b>波束の空間的な広がり ~1/Δk</b> ≈ " + sigmaX.toFixed(2) + "</div>";

      t += 1;
      raf = requestAnimationFrame(frame);
    }

    frame();
    cleanupFn = function () { cancelAnimationFrame(raf); };
  }

  // ---------------------------------------------------------------
  var RENDERERS = {
    "infinite-well": renderInfiniteWell,
    "finite-well": renderFiniteWell,
    "bohr": renderBohr,
    "uncertainty": renderUncertainty,
    "debroglie": renderDeBroglie
  };

  function selectSim(id) {
    if (!RENDERERS[id]) return;
    clearCleanup();
    currentSim = id;
    tabsEl.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c.dataset.sim === id); });
    RENDERERS[id]();
  }

  function init() {
    bodyEl = document.getElementById("qmsim-body");
    tabsEl = document.getElementById("qmsim-tabs");
    tabsEl.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () { selectSim(chip.dataset.sim); });
    });
    selectSim(currentSim);
  }

  function onShow() {
    // 再表示時にcanvasサイズを再取得させるため、現在のシムを再描画
    if (RENDERERS[currentSim]) { clearCleanup(); RENDERERS[currentSim](); }
  }

  return { init: init, onShow: onShow, selectSim: selectSim };
})();

window.QMSimView = QMSimView;
