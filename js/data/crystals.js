// 結晶構造データ（出典: kessyou.pdf, mondai.pdf）
// atoms: 単位格子内（境界を共有する原子も含む、教科書的な描画用）の分数座標 [x,y,z] (0〜1)
// bonds: 'nearest' の場合、crystal3d.js が最近接距離から自動で結合線を描く
// cubic: true の場合のみ、立方晶の d_hkl = a/sqrt(h^2+k^2+l^2) によるミラー面表示が有効

const CRYSTAL_STRUCTURES = [
  {
    id: "sc", name: "単純立方構造 (simple cubic)", cubic: true,
    color: "#3657c9", a: 1,
    atoms: cubeCorners(),
    coordination: 6,
    packing: "π/6 ≈ 0.52",
    examples: "— （教育用モデルとして登場。実在の単純金属は稀）",
    pages: "kessyou p.23, mondai p.5–6（結晶4, 6）",
    note: "最近接原子間距離 = 格子定数 a。頂点原子が1/8ずつ共有され、単位格子中の原子数は1個。"
  },
  {
    id: "bcc", name: "体心立方構造 (bcc)", cubic: true,
    color: "#b5651d", a: 1,
    atoms: cubeCorners().concat([[0.5, 0.5, 0.5]]),
    coordination: 8,
    packing: "√3π/8 ≈ 0.68",
    examples: "Li, Na, K, Rb, Cs, Be, Ca, Ti, V, Cr, Mn, α-Fe, Y, Zr, Nb, Mo, Hf, Ta, W, Tl, U",
    pages: "kessyou p.24, p.25, p.35（X線回折ピーク例：W）",
    note: "単位格子中の原子数：8×1/8 + 1 = 2個。"
  },
  {
    id: "fcc", name: "面心立方構造 (fcc) ／立方最密構造", cubic: true,
    color: "#1a8a5a", a: 1,
    atoms: cubeCorners().concat(faceCenters()),
    coordination: 12,
    packing: "√2π/6 ≈ 0.74",
    examples: "Ne, Ar, Kr, Xe, Cu, Ag, Au, Ca, Al, Pb, Mn, γ-Fe, Co, Ni, Rh, Pd, Ir, Pt",
    pages: "kessyou p.22, p.24, p.25, p.27",
    note: "単位格子中の原子数：8×1/8 + 6×1/2 = 4個。A-B-C積層でできる最密構造。"
  },
  {
    id: "hcp", name: "六方最密構造 (hcp)", cubic: false,
    color: "#c0392b", a: 1,
    hex: true,
    examples: "Li, Na, Be, Mg, α-Ti, Zr, Hf, Co, Zn, Cd, Tl",
    coordination: 12,
    packing: "√2π/6 ≈ 0.74",
    pages: "kessyou p.24, p.25, p.26",
    note: "単純六方格子で、結晶基は原点と (1/3, 2/3, 1/2) に原子。A-B-A-B積層でできる最密構造。ミラー指数は4指数(hkil)系を用いるため、この画面の(hkl)面表示機能は立方晶のみに対応しています。"
  },
  {
    id: "diamond", name: "ダイヤモンド構造", cubic: true,
    color: "#7a3ec7", a: 1,
    atoms: cubeCorners().concat(faceCenters()),
    interior: [[0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]],
    coordination: 4,
    packing: "√3π/16 ≈ 0.34",
    examples: "C（ダイヤモンド）, Si, Ge, Sn",
    pages: "kessyou p.24, p.25, p.28–30, mondai p.5, p.11, p.16, p.19（結晶5, 量子力学1・3）",
    note: "面心立方格子の格子点と、そこから [1/4 1/4 1/4] ずらした格子点の2組からなる。各原子は正四面体的に4個の最近接原子と共有結合する。"
  },
  {
    id: "nacl", name: "NaCl結晶構造（イオン結晶）", cubic: true,
    color: "#e8a33d", a: 1,
    twoSpecies: true,
    atomsA: cubeCorners().concat(faceCenters()), // Na+
    atomsB: edgeCenters().concat([[0.5, 0.5, 0.5]]), // Cl-
    labelA: "Na⁺", labelB: "Cl⁻",
    coordination: 6,
    examples: "NaCl（格子定数 a=0.564nm）, KCl など",
    pages: "mondai p.3（結晶2）, p.18（量子力学3 設問3 参考資料1）, p.6（KCl, 結晶6）",
    note: "Na⁺イオンとCl⁻イオンが交互に並ぶ構造。ブラベー格子としては面心立方格子。"
  },
  {
    id: "edge-dislocation", name: "刃状転位モデル（結晶欠陥）", cubic: false,
    dislocation: "edge", color: "#c0392b",
    coordination: "—", examples: "—（結晶欠陥モデル）",
    pages: "kessyou p.38, p.39",
    note: "転位線を境に、上側の結晶に余分な半平面が入り込んでいます。スライダーで転位（すべりの境界）の位置を動かせます。ミラー指数面の表示はこのモデルには対応していません。"
  },
  {
    id: "screw-dislocation", name: "らせん転位モデル（結晶欠陥）", cubic: false,
    dislocation: "screw", color: "#7a3ec7",
    coordination: "—", examples: "—（結晶欠陥モデル）",
    pages: "kessyou p.38, p.40",
    note: "結晶の一部を切り、その奥側だけを滑り方向（転位線と平行）にずらすと、らせん状の段差ができます。スライダーで切り込みの深さ（すべりの境界）を動かせます。ミラー指数面の表示はこのモデルには対応していません。"
  }
];

function cubeCorners() {
  var pts = [];
  [0, 1].forEach(function (x) {
    [0, 1].forEach(function (y) {
      [0, 1].forEach(function (z) {
        pts.push([x, y, z]);
      });
    });
  });
  return pts;
}

function faceCenters() {
  return [
    [0.5, 0.5, 0], [0.5, 0.5, 1],
    [0.5, 0, 0.5], [0.5, 1, 0.5],
    [0, 0.5, 0.5], [1, 0.5, 0.5]
  ];
}

function edgeCenters() {
  var pts = [];
  [0, 1].forEach(function (y) {
    [0, 1].forEach(function (z) {
      pts.push([0.5, y, z]);
    });
  });
  [0, 1].forEach(function (x) {
    [0, 1].forEach(function (z) {
      pts.push([x, 0.5, z]);
    });
  });
  [0, 1].forEach(function (x) {
    [0, 1].forEach(function (y) {
      pts.push([x, y, 0.5]);
    });
  });
  return pts;
}
