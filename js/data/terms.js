// 用語辞典データ（出典: kessyou.pdf / ryousi.pdf / mondai.pdf、contents.md に基づく）
// category: 'crystal' | 'quantum' | 'mondai'
// figure:   glossary.js の FIGURES に定義された SVG 図解のキー（任意）
// link:     他タブへのジャンプ先 { view: 'crystal3d', structureId } または { view: 'qmsim', simId }

const TERMS = [
  // ===== kessyou.pdf =====
  {
    id: "crystal-def", term: "結晶 (crystal)", category: "crystal",
    def: "原子またはイオンの集団が空間に周期的に配列した固体。",
    pages: "kessyou p.2"
  },
  {
    id: "amorphous", term: "非晶質固体／アモルファス (amorphous)", category: "crystal",
    def: "短距離秩序性のみを持つ固体で、液体に近い構造性を持つ。例：ガラス、プラスチック。結晶は長距離秩序性を持つ点で区別される。",
    figure: "orderCompare",
    pages: "kessyou p.2, p.8, p.41"
  },
  {
    id: "space-lattice", term: "空間格子 (space lattice)", category: "crystal",
    def: "結晶内に規則正しく配置された格子点の集合。その周期性は原子の並びの周期性と一致する。",
    figure: "unitCell",
    pages: "kessyou p.3"
  },
  {
    id: "unit-lattice", term: "基本単位格子 (unit lattice)", category: "crystal",
    def: "空間格子を構成する平行六面体のうち、最小単位となる格子。これを3方向に並べると結晶全体の格子が再現される。",
    figure: "unitCell",
    link: { view: "crystal3d" },
    pages: "kessyou p.3, p.5, p.22"
  },
  {
    id: "lattice-point", term: "格子点 (lattice point)", category: "crystal",
    def: "結晶基（原子・イオンの集団）の周期性に合わせて配置される点。必ずしも原子・イオンそのものの位置と一致する必要はない。",
    figure: "latticePoint",
    pages: "kessyou p.3, p.4"
  },
  {
    id: "crystal-axis", term: "結晶軸 (crystal axis)", category: "crystal",
    def: "格子点を結んで構成される平行六面体の稜線。a軸・b軸・c軸と呼ぶ。",
    figure: "crystalAxis",
    link: { view: "crystal3d" },
    pages: "kessyou p.3"
  },
  {
    id: "unit-vectors", term: "基本単位格子ベクトルと稜角 (a, b, c, α, β, γ)", category: "crystal",
    def: "基本単位格子の形状を決めるパラメータ。a, b, c は稜の長さ、α, β, γ はそれぞれ b-c間、a-c間、a-b間のなす角。",
    formula: "V = abc\\sqrt{1-\\cos^2\\alpha-\\cos^2\\beta-\\cos^2\\gamma+2\\cos\\alpha\\cos\\beta\\cos\\gamma}",
    pages: "kessyou p.5, p.20"
  },
  {
    id: "crystal-base", term: "結晶基 (crystal base)", category: "crystal",
    def: "1個の格子点に対して、原子・イオンがどのように配置されているかを表す単位。",
    formula: "\\text{結晶構造} = \\text{空間格子} + \\text{結晶基}",
    pages: "kessyou p.6"
  },
  {
    id: "crystalline-structure", term: "結晶構造 (crystalline structure)", category: "crystal",
    def: "現実の結晶における原子・分子・イオンの空間的配置そのもの。空間格子（骨組み）と結晶基（格子点ごとの原子配置）の組み合わせで決まる。",
    pages: "kessyou p.6"
  },
  {
    id: "direction-index", term: "格子方向の表記 [uvw]", category: "crystal",
    def: "方位ベクトルを基本単位格子ベクトル a, b, c の1次結合として表し、係数を最小の整数比にして [ ] でくくって表す。負の方向は数字の上にバーを付けて表す（例：[1 1 \\bar2]）。",
    figure: "millerDirection",
    link: { view: "crystal3d" },
    pages: "kessyou p.7, p.8"
  },
  {
    id: "lattice-plane", term: "格子面／結晶面 (lattice plane)", category: "crystal",
    def: "格子点が網目状に並ぶ、同一方向を向いた平面の組。結晶の中には同じ向きの面が等間隔で無数に存在する。",
    figure: "latticePlaneFamily",
    link: { view: "crystal3d" },
    pages: "kessyou p.9"
  },
  {
    id: "miller-index", term: "ミラー指数／面指数 (Miller's index)", category: "crystal",
    def: "格子面が a, b, c 軸を切る長さ（単位格子の辺の長さを単位とする）の逆数を、最小の整数比にして (hkl) の形で表す指数。",
    figure: "millerPlane",
    link: { view: "crystal3d" },
    pages: "kessyou p.9, p.10"
  },
  {
    id: "plane-normal", term: "面と方向の直交性", category: "crystal",
    def: "(hkl) 面の法線ベクトルは [hkl] 方向ベクトルと平行になる。つまりミラー指数 (hkl) が表す数字の組は、その面に垂直な方向も表している。",
    pages: "kessyou p.11, p.12"
  },
  {
    id: "d-spacing", term: "面間隔 d（隣接する同種の面の間隔）", category: "crystal",
    def: "(hkl) 面の法線ベクトルの大きさから求まる、隣り合う同一ミラー指数の面同士の距離。立方晶系では格子定数 a のみで決まる。",
    formula: "d_{hkl} = \\dfrac{a}{\\sqrt{h^2+k^2+l^2}}",
    link: { view: "crystal3d" },
    pages: "kessyou p.13–16"
  },
  {
    id: "bravais", term: "ブラベー格子 (Bravais lattice)", category: "crystal",
    def: "軸長・軸角の条件によって分類される7種の結晶系（立方・正方・斜方・六方・単斜・三方（菱面体）・三斜）に、単純・体心・面心・底心の格子点配置を組み合わせた、合計14種類の空間格子。",
    pages: "kessyou p.17–20"
  },
  {
    id: "centering", term: "面心・体心・底心", category: "crystal",
    def: "単位格子に追加される格子点の位置。面心 (face centered) は各面の中心、体心 (body centered) は空間格子の中心、底心 (base centered) は上下の底面の中心に格子点を持つ。",
    pages: "kessyou p.17, p.18"
  },
  {
    id: "atoms-per-cell", term: "単位格子に属する原子数の数え方", category: "crystal",
    def: "頂点にある原子は 1/8、面心にある原子は 1/2、体心にある原子は丸ごと1個が、その単位格子に所属するとして数える。例：fcc は 8×1/8 + 6×1/2 = 4 個。",
    link: { view: "crystal3d", structureId: "fcc" },
    pages: "kessyou p.22"
  },
  {
    id: "packing-fraction", term: "パッキング率（充填率）", category: "crystal",
    def: "単位格子の体積のうち、原子が占める部分の体積の割合。単純立方構造では π/6 ≈ 0.52。",
    formula: "\\eta_{sc} = \\dfrac{\\pi}{6} \\approx 0.52",
    link: { view: "crystal3d", structureId: "sc" },
    pages: "kessyou p.23"
  },
  {
    id: "xray", term: "X線 (X-ray)", category: "crystal",
    def: "波長がおよそ10〜0.01nmの電磁波。結晶構造の解析に用いられる。",
    pages: "kessyou p.31"
  },
  {
    id: "xray-spectrum", term: "連続X線・特性X線", category: "crystal",
    def: "X線発生装置（ターゲット例：Cr, Fe, Co, Cu, Mo, Ag, W）から発生するX線スペクトルの2つの成分。連続X線は広い波長域、特性X線はターゲット元素固有の波長に鋭いピークを持つ。",
    pages: "kessyou p.32"
  },
  {
    id: "bragg", term: "X線回折とブラッグの条件", category: "crystal",
    def: "結晶内の等間隔な面で反射したX線どうしの位相がそろう（干渉で強め合う）条件。面間隔 d、入射角 θ、波長 λ、整数 n に対して成り立つ。",
    formula: "2d\\sin\\theta = n\\lambda",
    figure: "bragg",
    link: { view: "crystal3d" },
    pages: "kessyou p.33"
  },
  {
    id: "theta-2theta", term: "θ-2θ法", category: "crystal",
    def: "試料表面に対する入射角と反射角を常に等しく保ちながら角度を走査するX線回折測定法。",
    pages: "kessyou p.34"
  },
  {
    id: "xrd-peak", term: "X線回折ピーク（例：タングステンW）", category: "crystal",
    def: "体心立方格子をもつ金属Wの粉末結晶X線回折で観測されるピークの実例（110面、200面など）。",
    link: { view: "crystal3d", structureId: "bcc" },
    pages: "kessyou p.35"
  },
  {
    id: "lattice-defect", term: "格子欠陥", category: "crystal",
    def: "結晶の周期性が部分的に乱れた箇所。色・発光特性、半導体の電気伝導、機械的性質など「構造敏感性」のある性質に影響する。",
    pages: "kessyou p.36"
  },
  {
    id: "point-defect", term: "点欠陥 (point defect)", category: "crystal",
    def: "広がりを持たず点状に存在する欠陥。原子空孔、格子間原子、格子間不純物原子、置換型不純物原子などに分類される。",
    figure: "pointDefects",
    pages: "kessyou p.37"
  },
  {
    id: "line-defect", term: "線欠陥 (line defect)：転位 (dislocation)", category: "crystal",
    def: "線状に伸びた欠陥。機械的強度（加工硬化）、結晶成長、原子の拡散、電気伝導度などに影響する。",
    pages: "kessyou p.36, p.38"
  },
  {
    id: "edge-dislocation", term: "刃状転位 (edge dislocation)", category: "crystal",
    def: "転位線の方向と原子がすべる方向（滑り方向）が垂直になっている転位。",
    figure: "edgeDislocation",
    link: { view: "crystal3d", structureId: "edge-dislocation" },
    pages: "kessyou p.38, p.39"
  },
  {
    id: "screw-dislocation", term: "らせん転位 (screw dislocation)", category: "crystal",
    def: "転位線の方向と滑り方向が平行になっている転位。",
    figure: "screwDislocation",
    link: { view: "crystal3d", structureId: "screw-dislocation" },
    pages: "kessyou p.38, p.40"
  },

  // ===== ryousi.pdf =====
  {
    id: "blackbody", term: "黒体放射 (black-body radiation)", category: "quantum",
    def: "理想的に全ての電磁波を吸収する物体（黒体）からの熱放射。1900年、プランクによるエネルギーの量子化という考え方の出発点となった現象。",
    pages: "ryousi p.2, p.4"
  },
  {
    id: "stefan-boltzmann", term: "ステファン・ボルツマンの法則", category: "quantum",
    def: "黒体が単位時間・単位面積あたりに放出する電磁波のエネルギーは、絶対温度の4乗に比例する。",
    formula: "P(T) = \\sigma T^4",
    pages: "ryousi p.5"
  },
  {
    id: "rayleigh-jeans", term: "レーリー・ジーンズの公式", category: "quantum",
    def: "電磁気学・統計力学から導かれる黒体放射のスペクトル理論式。長波長域で実測によく一致するが、短波長側で発散してしまう（紫外発散）。",
    pages: "ryousi p.6"
  },
  {
    id: "wien", term: "ウィーンの公式／ウィーンの変位則", category: "quantum",
    def: "黒体放射スペクトルの理論式のひとつ。短波長域で実測とよく一致する。変位則はスペクトルが最大となる波長と温度の積が一定であることを示す。",
    formula: "\\lambda_m T = \\text{一定}",
    pages: "ryousi p.6"
  },
  {
    id: "planck", term: "プランクの公式／量子化説", category: "quantum",
    def: "振動子のエネルギーが nhν (n=1,2,3,…) という離散的な値しか取れないと仮定することで、実測の黒体放射スペクトルを全波長域で正しく説明できた式。",
    formula: "E = nh\\nu \\quad (n=1,2,3,\\dots)",
    pages: "ryousi p.7"
  },
  {
    id: "photoelectric", term: "光電効果 (photoelectric effect)", category: "quantum",
    def: "1905年、アインシュタインが光量子説（光は粒子としての性質を持つ）を提唱する契機となった現象。",
    link: { view: "qmsim", simId: "debroglie" },
    pages: "ryousi p.2"
  },
  {
    id: "emission-spectrum", term: "原子の発光スペクトル（連続／輝線）", category: "quantum",
    def: "白熱電球や太陽光は連続スペクトル（すべての波長を含む）だが、ナトリウムランプ・水銀ランプ・水素原子などは特定の波長だけが輝く輝線スペクトルを示す。",
    pages: "ryousi p.8"
  },
  {
    id: "spectral-series", term: "バルマー系列・ライマン系列・パッシェン系列", category: "quantum",
    def: "水素原子の発光スペクトルに見られる波長の規則性。リュードベリ定数 R と整数 n, m を用いて表される。",
    formula: "\\frac{1}{\\lambda} = R\\left(\\frac{1}{n^2}-\\frac{1}{m^2}\\right)",
    link: { view: "qmsim", simId: "bohr" },
    pages: "ryousi p.9"
  },
  {
    id: "thomson-model", term: "トムソンの原子モデル", category: "quantum",
    def: "正電荷を帯びた球の内部に、負電荷を持つ電子が一様に分布しているとする原子モデル。",
    figure: "thomson",
    pages: "ryousi p.10"
  },
  {
    id: "nagaoka-rutherford", term: "長岡・ラザフォードの原子モデル", category: "quantum",
    def: "正電荷と質量の大部分が原子の中心（原子核）に集中し、その周りを電子が運動しているとする原子モデル。",
    figure: "rutherford",
    link: { view: "qmsim", simId: "bohr" },
    pages: "ryousi p.10"
  },
  {
    id: "rutherford-scattering", term: "ラザフォードのα線散乱実験", category: "quantum",
    def: "金箔にα粒子を照射し、ごく一部が大きく跳ね返されることから、原子中心に重く小さい原子核が存在することを示した実験。",
    pages: "ryousi p.11"
  },
  {
    id: "classical-contradiction", term: "原子模型と古典論の矛盾", category: "quantum",
    def: "古典電磁気学では、円運動する電子は常に電磁波を放射し続けてエネルギーを失い、原子核に落ち込んで不安定になるはずだが、実際の原子は安定に存在する。",
    pages: "ryousi p.12"
  },
  {
    id: "bohr-postulates", term: "ボーアの仮定（量子条件・振動数条件）", category: "quantum",
    def: "仮説1（量子条件）：電子はある特定の軌道上でのみ運動でき、そこでは角運動量が h/2π の整数倍に量子化されている。仮説2（振動数条件）：電子が軌道を遷移するときのみ、その差に応じた光を放出・吸収する。",
    formula: "m v r = n\\hbar \\quad (n=1,2,3,\\dots)",
    link: { view: "qmsim", simId: "bohr" },
    pages: "ryousi p.13"
  },
  {
    id: "bohr-radius", term: "ボーアの電子軌道計算／ボーア半径", category: "quantum",
    def: "電子に働くクーロン引力と円運動の遠心力が釣り合う条件と量子条件を組み合わせて、軌道半径を導出する。n=1 の軌道半径がボーア半径。",
    formula: "r_n = n^2 a_0, \\qquad a_0 = \\dfrac{4\\pi\\varepsilon_0\\hbar^2}{m e^2} \\approx 0.0529\\,\\text{nm}",
    link: { view: "qmsim", simId: "bohr" },
    pages: "ryousi p.14"
  },
  {
    id: "bohr-energy", term: "軌道上の電子のエネルギー $E_n$", category: "quantum",
    def: "n番目の軌道にある電子のエネルギー。運動エネルギーとクーロンポテンシャルエネルギーの和から導かれ、n が大きいほど0に近づく（束縛が弱くなる）。",
    formula: "E_n = -\\dfrac{13.6\\,\\text{eV}}{n^2}",
    link: { view: "qmsim", simId: "bohr" },
    pages: "ryousi p.15"
  },
  {
    id: "rydberg", term: "軌道遷移と光の放出・吸収／リュードベリ定数", category: "quantum",
    def: "電子が軌道を遷移する際に放出・吸収される光の振動数を、ボーアモデルのエネルギー差から導くと、実験的に知られる水素のリュードベリ定数と一致することが示される。",
    link: { view: "qmsim", simId: "bohr" },
    pages: "ryousi p.16"
  },
  {
    id: "compton", term: "コンプトン効果 (Compton effect)", category: "quantum",
    def: "X線を物質に入射すると、散乱されたX線の中に元の波長より長い波長が含まれる現象。光を粒子（光子）とみなし、電子との衝突でのエネルギー・運動量保存則から説明される。",
    formula: "\\Delta\\lambda = \\dfrac{h}{m_e c}(1-\\cos\\theta)",
    pages: "ryousi p.2, p.17"
  },
  {
    id: "matter-wave", term: "物質波／ド・ブロイ波", category: "quantum",
    def: "1924年、ド・ブロイが提唱。電子のような粒子も波としての性質を持つという考え方で、電子線回折像によって実験的に確認された。",
    formula: "\\lambda = \\dfrac{h}{p}",
    link: { view: "qmsim", simId: "debroglie" },
    pages: "ryousi p.18"
  },
  {
    id: "prob-photon", term: "確率波の解釈（光子の計測）", category: "quantum",
    def: "ピンホール実験：光子の数が少ないとスクリーン上にばらばらな点が現れ、数が多くなると回折像（干渉パターン）が浮かび上がる。ある点に光子が見つかる確率は、電場強度の絶対値の2乗 |E|² に比例する（ボルンの解釈）。",
    pages: "ryousi p.20"
  },
  {
    id: "double-slit", term: "確率波の解釈（二重スリット実験）", category: "quantum",
    def: "両方のスリットを開けると干渉像が現れるが、どちらのスリットを通ったかを観測して経路を確定すると干渉像は消える。",
    figure: "doubleSlit",
    pages: "ryousi p.21"
  },
  {
    id: "prob-electron", term: "確率波の解釈（電子波）", category: "quantum",
    def: "電子もまた波動関数 Ψ(x,y,z,t) によって記述され、|Ψ|²dxdydz がその微小領域に電子を見出す確率を与える。",
    pages: "ryousi p.22"
  },
  {
    id: "uncertainty", term: "不確定性原理 (uncertainty principle)", category: "quantum",
    def: "粒子の位置と運動量を同時に正確に測定することはできない。位置の不確かさ Δx と運動量の不確かさ Δp の積は、プランク定数程度の下限を持つ。",
    formula: "\\Delta x \\, \\Delta p \\gtrsim \\hbar",
    link: { view: "qmsim", simId: "uncertainty" },
    pages: "ryousi p.23"
  },
  {
    id: "wave-function", term: "波動関数 (wave function)", category: "quantum",
    def: "量子力学的な粒子の状態を記述する複素数値の関数。自由粒子の場合は平面波の形を持つ。",
    formula: "\\Psi(x,t) = A\\,e^{i(kx-\\omega t)}",
    link: { view: "qmsim", simId: "debroglie" },
    pages: "ryousi p.25, p.26"
  },
  {
    id: "wave-packet", term: "平面波・波束・位相速度・群速度", category: "quantum",
    def: "単一の波数を持つ波を平面波、複数の波数の重なりで局在した波を波束と呼ぶ。位相速度は波の山が進む速さ、群速度は波束（エネルギーや粒子）が進む速さ。",
    formula: "v_p = \\dfrac{\\omega}{k}, \\qquad v_g = \\dfrac{d\\omega}{dk}",
    link: { view: "qmsim", simId: "debroglie" },
    pages: "ryousi p.27"
  },
  {
    id: "operator", term: "演算子 (operator)", category: "quantum",
    def: "波動関数に作用して物理量を取り出す数学的操作。例えばエネルギー演算子・運動量演算子がある。",
    formula: "\\hat p = -i\\hbar\\dfrac{\\partial}{\\partial x}, \\qquad \\hat E = i\\hbar\\dfrac{\\partial}{\\partial t}",
    pages: "ryousi p.28"
  },
  {
    id: "schrodinger", term: "シュレディンガーの波動方程式", category: "quantum",
    def: "波動関数の時間発展を記述する基礎方程式。ハミルトニアン演算子 Ĥ（運動エネルギー＋ポテンシャル）を用いて一般形が書かれる。",
    formula: "i\\hbar\\frac{\\partial \\Psi}{\\partial t} = \\hat H \\Psi = \\left[-\\frac{\\hbar^2}{2m}\\nabla^2 + V\\right]\\Psi",
    link: { view: "qmsim", simId: "infinite-well" },
    pages: "ryousi p.29, p.30"
  },
  {
    id: "state-quantity-value", term: "状態・物理量・測定値（古典 vs 量子）", category: "quantum",
    def: "古典力学では状態・物理量・測定値は不可分だが、量子力学では状態は波動関数、物理量は演算子、測定値は期待値（固有値）として、互いに分離して対応づけられる。",
    pages: "ryousi p.31"
  },
  {
    id: "postulates", term: "量子力学の要請（要請I〜IV）", category: "quantum",
    def: "量子力学の基礎となる4つの要請。I: 状態は波動関数で表される。II: 物理量は演算子に対応する。III: 波動関数は波動方程式に従う。IV: 測定値は演算子の固有値として得られる。",
    pages: "ryousi p.32–36"
  },
  {
    id: "eigen", term: "固有関数・固有値・エルミート演算子", category: "quantum",
    def: "演算子 Â を関数 ψ に作用させた結果が ψ の定数倍（a·ψ）になるとき、ψ を固有関数、a を固有値と呼ぶ。物理量に対応する演算子はエルミート演算子であり、その固有値は必ず実数になる。",
    formula: "\\hat A\\,\\psi = a\\,\\psi",
    pages: "ryousi p.37"
  },
  {
    id: "complete-orthogonal", term: "完全直交系 (complete orthogonal system)", category: "quantum",
    def: "互いに直交する関数の組の1次結合によって、任意の関数を表すことができるとき、その関数の組を完全直交系と呼ぶ。",
    pages: "ryousi p.38–41"
  },
  {
    id: "steady-state", term: "定常状態 (steady state)", category: "quantum",
    def: "波動関数が時間に依存しない状態。Ψ(x,y,z,t) = φ(x,y,z)T(t) のように空間部分と時間部分に変数分離できる。",
    formula: "\\Psi(x,t) = \\varphi(x)\\,e^{-iEt/\\hbar}",
    pages: "ryousi p.42–45"
  },
  {
    id: "free-particle", term: "1次元自由粒子", category: "quantum",
    def: "ポテンシャルが場所・時間によらず一定（V = 一定）である空間を運動する1個の粒子のモデル。",
    link: { view: "qmsim", simId: "debroglie" },
    pages: "ryousi p.46–48"
  },
  {
    id: "momentum-operator", term: "運動量演算子の固有値問題", category: "quantum",
    def: "波動関数に運動量演算子を作用させ、固有値方程式を満たす固有値（運動量）と固有関数（平面波）を求める。",
    formula: "-i\\hbar\\frac{d\\psi}{dx} = p\\,\\psi \\;\\Rightarrow\\; \\psi(x) = A e^{ipx/\\hbar}",
    pages: "ryousi p.48, p.56, p.57"
  },
  {
    id: "infinite-well-term", term: "無限に深い井戸型ポテンシャル", category: "quantum",
    def: "0≤x≤L の範囲で V=0、それ以外で V=∞ となるモデル。境界条件（井戸の外では波動関数が0）と規格化条件から、エネルギー固有値と波動関数が離散的に決まる。",
    formula: "E_n = \\dfrac{n^2\\pi^2\\hbar^2}{2mL^2}, \\qquad \\psi_n(x)=\\sqrt{\\tfrac{2}{L}}\\sin\\!\\left(\\tfrac{n\\pi x}{L}\\right)",
    figure: "infiniteWell",
    link: { view: "qmsim", simId: "infinite-well" },
    pages: "ryousi p.49–58"
  },
  {
    id: "normalization", term: "規格化条件 (normalization)", category: "quantum",
    def: "粒子が空間のどこかに存在する確率は1であるという条件。波動関数の絶対値の2乗を全空間で積分すると1になる。",
    formula: "\\int_{-\\infty}^{\\infty} |\\psi(x)|^2\\,dx = 1",
    pages: "ryousi p.54"
  },
  {
    id: "3d-extension", term: "井戸型ポテンシャルの3次元への拡張", category: "quantum",
    def: "1次元の井戸型ポテンシャルの解を3次元に拡張したもの。k空間における等エネルギー球を考えることで、エネルギーの状態密度 g(E) を導くことができる。",
    pages: "ryousi p.59–63"
  },
  {
    id: "finite-well-term", term: "有限の井戸型ポテンシャル", category: "quantum",
    def: "井戸の深さが有限であるポテンシャルモデル。境界条件を適用すると解析的に解けない方程式（超越方程式）が現れ、図式解法（グラフの交点から解を求める方法）で束縛状態のエネルギーを求める。",
    figure: "finiteWell",
    link: { view: "qmsim", simId: "finite-well" },
    pages: "ryousi p.64–70"
  },
  {
    id: "tunneling-leak", term: "波動関数のしみ出し（トンネル的浸透）", category: "quantum",
    def: "有限の深さの井戸型ポテンシャルでは、古典力学では粒子が存在し得ない井戸の外側（ポテンシャル障壁の中）にも、電子を見出す確率がゼロにならずに指数関数的にしみ出す。",
    link: { view: "qmsim", simId: "finite-well" },
    pages: "ryousi p.70"
  },

  // ===== mondai.pdf のみ =====
  {
    id: "schottky-defect", term: "ショットキー型欠陥", category: "mondai",
    def: "格子点にあった原子が結晶の表面に抜け出すことで、内部に原子空孔だけが残る欠陥。",
    pages: "mondai p.4（結晶3 補足）"
  },
  {
    id: "frenkel-defect", term: "フレンケル欠陥", category: "mondai",
    def: "原子が本来の格子点から格子間位置に入り込むことで、空孔と格子間原子の対ができる欠陥。",
    pages: "mondai p.4（結晶3 補足図）"
  },
  {
    id: "ionic-crystal", term: "イオン結晶／イオン結合", category: "mondai",
    def: "NaCl・KClのように、正負のイオン間に働くクーロン引力によって形成される結晶。",
    link: { view: "crystal3d", structureId: "nacl" },
    pages: "mondai p.18（量子力学3 設問3 参考資料1）"
  },
  {
    id: "covalent-crystal", term: "共有結合結晶", category: "mondai",
    def: "ダイヤモンド・シリコン・ポリエチレンなど、原子間で電子を共有することによって結合した結晶。",
    link: { view: "crystal3d", structureId: "diamond" },
    pages: "mondai p.19–20（量子力学3 設問3 参考資料2・3）"
  },
  {
    id: "sp3", term: "sp³混成軌道", category: "mondai",
    def: "2s軌道1個と2p軌道3個が混じり合ってできる、4本の等価な方向を持つ軌道。ダイヤモンド構造の正四面体的な結合に関わる。",
    link: { view: "crystal3d", structureId: "diamond" },
    pages: "mondai p.19（量子力学3 設問3 参考資料2）"
  },
  {
    id: "polyethylene-bond", term: "ポリエチレンの化学結合", category: "mondai",
    def: "C-C結合・C-H結合がいずれもsp³混成軌道によるσ結合で構成されている例。",
    pages: "mondai p.20（量子力学3 設問3 参考資料3）"
  },
  {
    id: "work-function", term: "仕事関数 (work function)", category: "mondai",
    def: "金属中の電子を真空中に取り出すために必要な最小のエネルギー W。光電効果の閾値を決める。",
    formula: "h\\nu = W + \\tfrac{1}{2}m v^2",
    pages: "mondai p.23（量子力学4 設問1 参考資料）"
  },
  {
    id: "fermi-dirac", term: "フェルミ・ディラックの分布関数", category: "mondai",
    def: "電子がエネルギー E の状態を占める確率 f(E,T) を温度の関数として与える分布関数。温度が上がるとフェルミ準位付近のなだらかさが増す。",
    formula: "f(E,T) = \\dfrac{1}{\\exp\\!\\left(\\frac{E-E_F}{k_BT}\\right)+1}",
    pages: "mondai p.15（量子力学2 設問5）"
  }
];
