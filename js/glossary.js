// 用語辞典ビュー：カード一覧・検索・フィルタ・簡易SVG図解・KaTeX数式表示

const FIGURES = {
  orderCompare: '<svg viewBox="0 0 220 110"><text x="10" y="14" font-size="10" fill="#677187">結晶（長距離秩序）</text>' +
    gridDots(10, 24, 6, 6, 18) +
    '<text x="110" y="14" font-size="10" fill="#677187">非晶質（短距離秩序のみ）</text>' +
    randomDots(110, 24, 90, 70) +
    '</svg>',

  unitCell: '<svg viewBox="0 0 200 178">' + cubeWire(40, 20, 110) +
    '<text x="6" y="168" font-size="10" fill="#677187">基本単位格子（平行六面体）と頂点の格子点</text></svg>',

  latticePoint: '<svg viewBox="0 0 200 150">' +
    gridDots(20, 20, 3, 3, 40) +
    latticeBasisDots(20, 20, 3, 3, 40) +
    '<text x="6" y="140" font-size="10" fill="#677187">格子点（青●）と、そこからずれた位置にある原子（橙●）</text></svg>',

  crystalAxis: '<svg viewBox="0 0 200 178">' + cubeWire(40, 20, 110) +
    '<line x1="40" y1="130" x2="111.5" y2="130" stroke="#c0392b" stroke-width="2.5"/>' +
    '<line x1="40" y1="130" x2="40" y2="58.5" stroke="#1a8a5a" stroke-width="2.5"/>' +
    '<line x1="40" y1="130" x2="78.5" y2="91.5" stroke="#e8a33d" stroke-width="2.5"/>' +
    '<text x="114" y="134" font-size="12" fill="#c0392b">a</text>' +
    '<text x="26" y="56" font-size="12" fill="#1a8a5a">c</text>' +
    '<text x="60" y="101" font-size="12" fill="#e8a33d">b</text>' +
    '<text x="6" y="168" font-size="10" fill="#677187">結晶軸 a, b, c（1つの格子点から伸びる3本の稜線）</text></svg>',

  millerDirection: '<svg viewBox="0 0 200 178">' + cubeWire(40, 20, 110) +
    '<line x1="40" y1="130" x2="150" y2="20" stroke="#c0392b" stroke-width="2.5" marker-end="url(#arrow)"/>' +
    '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#c0392b"/></marker></defs>' +
    '<text x="130" y="22" font-size="11" fill="#c0392b">[111]</text>' +
    '<text x="6" y="168" font-size="10" fill="#677187">原点から対角頂点への方向 [111]</text></svg>',

  millerPlane: '<svg viewBox="0 0 200 178">' + cubeWire(40, 20, 110) +
    '<polygon points="150,20 40,130 40,50" fill="#3657c9" opacity="0.35" stroke="#3657c9" stroke-width="1.5"/>' +
    '<text x="6" y="168" font-size="10" fill="#677187">単位格子を切る1つの結晶面（ミラー指数で表す）</text></svg>',

  latticePlaneFamily: '<svg viewBox="0 0 220 170">' +
    gridDots(20, 16, 5, 5, 26) +
    '<g stroke="#c0392b" stroke-width="2">' +
    '<line x1="20" y1="120" x2="120" y2="10"/>' +
    '<line x1="60" y1="130" x2="160" y2="10"/>' +
    '<line x1="100" y1="130" x2="200" y2="20"/>' +
    '</g>' +
    '<text x="6" y="158" font-size="10" fill="#677187">同じ向き・同じ間隔で並ぶ格子面の組（赤線）</text></svg>',

  bragg: '<svg viewBox="0 0 220 120">' +
    '<line x1="10" y1="40" x2="210" y2="40" stroke="#dde3ee"/>' +
    '<line x1="10" y1="70" x2="210" y2="70" stroke="#dde3ee"/>' +
    '<line x1="30" y1="0" x2="80" y2="40" stroke="#3657c9" stroke-width="2"/>' +
    '<line x1="80" y1="40" x2="130" y2="0" stroke="#3657c9" stroke-width="2"/>' +
    '<line x1="60" y1="0" x2="110" y2="70" stroke="#b5651d" stroke-width="2"/>' +
    '<line x1="110" y1="70" x2="160" y2="0" stroke="#b5651d" stroke-width="2"/>' +
    '<text x="6" y="36" font-size="9" fill="#677187">面1</text><text x="6" y="66" font-size="9" fill="#677187">面2</text>' +
    '<text x="10" y="110" font-size="9" fill="#677187">2d sinθ = nλ（反射波の位相がそろうと強め合う）</text></svg>',

  pointDefects: '<svg viewBox="0 0 220 110">' + gridDots(10, 10, 6, 5, 20) +
    '<circle cx="90" cy="30" r="0" /><circle cx="90" cy="30" r="5" fill="none" stroke="#c0392b" stroke-width="1.5"/>' +
    '<text x="78" y="46" font-size="8" fill="#c0392b">原子空孔</text>' +
    '<circle cx="135" cy="40" r="4" fill="#1a8a5a"/><text x="118" y="56" font-size="8" fill="#1a8a5a">格子間原子</text>' +
    '<circle cx="50" cy="50" r="5" fill="#e8a33d"/><text x="30" y="66" font-size="8" fill="#e8a33d">置換型不純物</text>' +
    '</svg>',

  edgeDislocation: '<svg viewBox="0 0 200 145">' + gridLines(10, 10, 180, 100, 20) +
    '<line x1="100" y1="10" x2="100" y2="55" stroke="#c0392b" stroke-width="2.5"/>' +
    '<line x1="94" y1="20" x2="100" y2="10" stroke="#c0392b" stroke-width="2.5"/>' +
    '<line x1="106" y1="20" x2="100" y2="10" stroke="#c0392b" stroke-width="2.5"/>' +
    '<text x="108" y="35" font-size="9" fill="#c0392b">転位線</text>' +
    '<text x="6" y="135" font-size="10" fill="#677187">格子の一部がずれ、垂直な余分な面が入り込む</text></svg>',

  screwDislocation: '<svg viewBox="0 0 200 145">' + gridLines(10, 10, 180, 100, 20) +
    '<path d="M60,100 L140,100 L140,20" stroke="#7a3ec7" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/>' +
    '<text x="144" y="24" font-size="9" fill="#7a3ec7">らせん状のずれ</text>' +
    '<text x="6" y="135" font-size="10" fill="#677187">滑り方向と転位線が平行</text></svg>',

  thomson: '<svg viewBox="0 0 160 120"><circle cx="80" cy="60" r="45" fill="#f0a63a" opacity="0.25" stroke="#e8a33d"/>' +
    dotsInCircle(80, 60, 35, 10) +
    '<text x="22" y="112" font-size="9" fill="#677187">正電荷の球に電子が一様分布</text></svg>',

  rutherford: '<svg viewBox="0 0 160 120"><circle cx="80" cy="60" r="6" fill="#c0392b"/>' +
    '<ellipse cx="80" cy="60" rx="50" ry="20" fill="none" stroke="#3657c9" stroke-width="1.3"/>' +
    '<circle cx="130" cy="60" r="3.5" fill="#3657c9"/>' +
    '<text x="12" y="112" font-size="9" fill="#677187">小さく重い原子核の周りを電子が運動</text></svg>',

  doubleSlit: '<svg viewBox="0 0 220 120">' +
    '<line x1="20" y1="10" x2="20" y2="110" stroke="#677187" stroke-width="3"/>' +
    '<line x1="18" y1="45" x2="22" y2="45" stroke="#fff" stroke-width="6"/>' +
    '<line x1="18" y1="75" x2="22" y2="75" stroke="#fff" stroke-width="6"/>' +
    '<line x1="200" y1="6" x2="200" y2="114" stroke="#dde3ee" stroke-width="6"/>' +
    waveBands(200, 6, 114) +
    '<text x="10" y="4" font-size="8" fill="#677187">波源</text><text x="175" y="118" font-size="8" fill="#677187">干渉縞</text></svg>',

  infiniteWell: '<svg viewBox="0 0 220 170">' +
    '<path d="M20,10 L20,100 L90,100" stroke="#677187" stroke-width="2" fill="none"/>' +
    '<path d="M150,100 L150,10" stroke="#677187" stroke-width="2" fill="none"/>' +
    '<path d="M90,100 L150,100" stroke="#677187" stroke-width="2" fill="none" stroke-dasharray="3 2"/>' +
    '<path d="M20,100 Q55,45 90,100 Q120,155 150,100" stroke="#3657c9" stroke-width="2" fill="none"/>' +
    '<text x="24" y="22" font-size="9" fill="#677187">V=∞</text><text x="150" y="22" font-size="9" fill="#677187">V=∞</text>' +
    '<text x="75" y="113" font-size="9" fill="#677187">0</text><text x="145" y="113" font-size="9" fill="#677187">L</text>' +
    '</svg>',

  finiteWell: '<svg viewBox="0 0 220 120">' +
    '<path d="M10,30 L50,30 L50,90 L150,90 L150,30 L210,30" stroke="#677187" stroke-width="2" fill="none"/>' +
    '<path d="M50,90 Q100,40 150,90" stroke="#3657c9" stroke-width="2" fill="none"/>' +
    '<path d="M30,80 Q40,88 50,90" stroke="#3657c9" stroke-width="1.5" fill="none" stroke-dasharray="2 2"/>' +
    '<path d="M150,90 Q160,88 190,78" stroke="#3657c9" stroke-width="1.5" fill="none" stroke-dasharray="2 2"/>' +
    '<text x="55" y="28" font-size="9" fill="#677187">V₀</text>' +
    '<text x="12" y="113" font-size="9" fill="#677187">井戸外にもしみ出す波動関数（点線）</text></svg>'
};

function gridDots(x0, y0, cols, rows, step) {
  var s = "";
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      s += '<circle cx="' + (x0 + i * step) + '" cy="' + (y0 + j * step) + '" r="3" fill="#3657c9"/>';
    }
  }
  return s;
}
function latticeBasisDots(x0, y0, cols, rows, step) {
  var s = "";
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      s += '<circle cx="' + (x0 + i * step + step * 0.3) + '" cy="' + (y0 + j * step + step * 0.3) + '" r="4.5" fill="#e8a33d"/>';
    }
  }
  return s;
}
function gridLines(x0, y0, w, h, step) {
  var s = "";
  for (var x = x0; x <= x0 + w; x += step) s += '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + (y0 + h) + '" stroke="#dde3ee"/>';
  for (var y = y0; y <= y0 + h; y += step) s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + w) + '" y2="' + y + '" stroke="#dde3ee"/>';
  return s;
}
function randomDots(x0, y0, w, h) {
  var s = "", seed = 42;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (var i = 0; i < 36; i++) {
    s += '<circle cx="' + (x0 + rnd() * w) + '" cy="' + (y0 + rnd() * h) + '" r="2.6" fill="#b5651d"/>';
  }
  return s;
}
function cubeWire(x0, y0, size) {
  var o = size * 0.35;
  var p = {
    a: [x0, y0 + o], b: [x0 + size - o, y0 + o], c: [x0 + size, y0], d: [x0 + o, y0],
    e: [x0, y0 + size], f: [x0 + size - o, y0 + size], g: [x0 + size, y0 + size - o], h: [x0 + o, y0 + size - o]
  };
  var edges = [["a", "b"], ["b", "c"], ["c", "d"], ["d", "a"], ["e", "f"], ["f", "g"], ["g", "h"], ["h", "e"], ["a", "e"], ["b", "f"], ["c", "g"], ["d", "h"]];
  var s = "";
  edges.forEach(function (e) {
    s += '<line x1="' + p[e[0]][0] + '" y1="' + p[e[0]][1] + '" x2="' + p[e[1]][0] + '" y2="' + p[e[1]][1] + '" stroke="#677187" stroke-width="1.4"/>';
  });
  Object.keys(p).forEach(function (k) {
    s += '<circle cx="' + p[k][0] + '" cy="' + p[k][1] + '" r="3" fill="#3657c9"/>';
  });
  return s;
}
function dotsInCircle(cx, cy, r, n) {
  var s = "", seed = 7;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (var i = 0; i < n; i++) {
    var ang = rnd() * Math.PI * 2, rad = Math.sqrt(rnd()) * r;
    s += '<circle cx="' + (cx + Math.cos(ang) * rad) + '" cy="' + (cy + Math.sin(ang) * rad) + '" r="3" fill="#3657c9"/>';
  }
  return s;
}
function waveBands(x, y0, y1) {
  var s = "", n = 5;
  for (var i = 0; i < n; i++) {
    var yy = y0 + (i + 0.5) * (y1 - y0) / n;
    var op = 0.9 - Math.abs(i - (n - 1) / 2) * 0.18;
    s += '<rect x="' + (x - 4) + '" y="' + (yy - 5) + '" width="8" height="10" fill="#3657c9" opacity="' + op + '"/>';
  }
  return s;
}

const GlossaryView = (function () {
  var listEl, countEl, searchEl, filterEl;
  var currentFilter = "all";
  var currentQuery = "";

  function matches(t) {
    if (currentFilter !== "all" && t.category !== currentFilter) return false;
    if (!currentQuery) return true;
    var q = currentQuery.toLowerCase();
    return (t.term + " " + t.def).toLowerCase().indexOf(q) !== -1;
  }

  function linkLabel(link) {
    if (link.view === "crystal3d") return "3Dモデルで見る";
    if (link.view === "qmsim") return "シミュレーションで見る";
    return "見る";
  }

  function render() {
    var items = TERMS.filter(matches);
    countEl.textContent = items.length + " / " + TERMS.length + " 件";
    listEl.innerHTML = "";
    items.forEach(function (t) {
      var card = document.createElement("div");
      card.className = "term-card";

      var catLabel = t.category === "crystal" ? "結晶 kessyou.pdf" : t.category === "quantum" ? "量子力学 ryousi.pdf" : "問題集 mondai.pdf";
      var head = document.createElement("div");
      head.className = "term-head";
      var headLeft = document.createElement("div");
      headLeft.className = "term-head-left";
      headLeft.innerHTML = '<h3>' + t.term + '</h3><span class="badge ' + t.category + '">' + catLabel + '</span>';
      var toggleBtn = document.createElement("button");
      toggleBtn.className = "term-toggle";
      toggleBtn.type = "button";
      toggleBtn.textContent = "+";
      toggleBtn.setAttribute("aria-label", "説明を表示");
      toggleBtn.setAttribute("aria-expanded", "false");
      head.appendChild(headLeft);
      head.appendChild(toggleBtn);
      card.appendChild(head);

      var body = document.createElement("div");
      body.className = "term-body";
      body.hidden = true;

      var def = document.createElement("div");
      def.className = "term-def";
      def.textContent = t.def;
      body.appendChild(def);

      if (t.figure && FIGURES[t.figure]) {
        var fig = document.createElement("div");
        fig.className = "term-figure";
        fig.innerHTML = FIGURES[t.figure];
        body.appendChild(fig);
      }

      if (t.formula) {
        var fdiv = document.createElement("div");
        fdiv.className = "term-formula";
        body.appendChild(fdiv);
        try {
          katex.render(t.formula, fdiv, { throwOnError: false, displayMode: false });
        } catch (e) { fdiv.textContent = t.formula; }
      }

      var src = document.createElement("div");
      src.className = "term-source";
      src.innerHTML = "出典: " + t.pages;
      body.appendChild(src);

      if (t.link) {
        var links = document.createElement("div");
        links.className = "term-links";
        var btn = document.createElement("button");
        btn.textContent = linkLabel(t.link);
        btn.addEventListener("click", function () {
          window.AppNav.goTo(t.link.view, t.link);
        });
        links.appendChild(btn);
        body.appendChild(links);
      }

      card.appendChild(body);

      function toggle() {
        body.hidden = !body.hidden;
        toggleBtn.textContent = body.hidden ? "+" : "−";
        toggleBtn.setAttribute("aria-expanded", String(!body.hidden));
        card.classList.toggle("open", !body.hidden);
      }
      toggleBtn.addEventListener("click", toggle);
      headLeft.addEventListener("click", toggle);

      listEl.appendChild(card);
    });
  }

  function init() {
    listEl = document.getElementById("glossary-list");
    countEl = document.getElementById("glossary-count");
    searchEl = document.getElementById("glossary-search");
    filterEl = document.getElementById("glossary-filter");

    searchEl.addEventListener("input", function () {
      currentQuery = searchEl.value.trim();
      render();
    });
    filterEl.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        filterEl.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        currentFilter = chip.dataset.filter;
        render();
      });
    });

    render();
  }

  return { init: init };
})();

window.GlossaryView = GlossaryView;
