// クイズデータ（mondai.pdf「結晶1〜6」「量子力学1〜5」の例題をベースにした自己完結型の問題）
// type: 'choice'（選択式） | 'numeric'（数値入力、相対誤差 tolerancePct 以内を正解とする）

const QUIZ_QUESTIONS = [
  {
    id: "q-crystal1", category: "crystal", section: "結晶1", pages: "mondai p.2",
    type: "choice",
    question: "立方晶の単位格子において、原点 (0,0,0) から対角の頂点 (1,1,1) へ向かうベクトルの方向指数（格子方向）として正しいものは？",
    choices: ["[100]", "[110]", "[111]", "[112]"],
    answerIndex: 2,
    explain: "方向ベクトル (1,1,1) はすでに最小整数比なので、方向指数はそのまま [111] と表します。"
  },
  {
    id: "q-crystal2", category: "crystal", section: "結晶2", pages: "mondai p.3",
    type: "choice",
    question: "NaCl結晶（ブラベー格子：面心立方）の1つの単位格子に含まれるCl⁻イオンの数は？",
    choices: ["2個", "4個", "6個", "8個"],
    answerIndex: 1,
    explain: "Cl⁻は12本の辺の中心（各1/4）＋体心（1個）に位置するので 12×1/4 + 1 = 4個。Na⁺も同様に4個で、電気的に中性な組成比1:1と一致します。"
  },
  {
    id: "q-crystal3", category: "crystal", section: "結晶3", pages: "mondai p.4",
    type: "numeric",
    question: "ショットキー欠陥の割合は n/N = exp(−E_v / 2k_BT) で近似できる。活性化エネルギー E_v = 1.0 eV、温度 T = 1000 K のとき、n/N はいくらか（指数表記、有効数字2桁）。k_B = 8.617×10⁻⁵ eV/K とする。",
    answer: 0.0030, tolerancePct: 0.2, unit: "（例：3.0×10⁻³ なら 0.003 と入力）",
    explain: "E_v/(2k_BT) = 1.0 / (2×8.617×10⁻⁵×1000) ≈ 5.80。n/N = exp(−5.80) ≈ 3.0×10⁻³。"
  },
  {
    id: "q-crystal4a", category: "crystal", section: "結晶4", pages: "mondai p.5–10",
    type: "choice",
    question: "面心立方構造 (fcc) の原子パッキング率（充填率）はおよそいくつか？",
    choices: ["0.52", "0.68", "0.74", "0.34"],
    answerIndex: 2,
    explain: "fcc（立方最密構造）の充填率は √2π/6 ≈ 0.74 で、単純立方(0.52)・体心立方(0.68)より高密度です。"
  },
  {
    id: "q-crystal4b", category: "crystal", section: "結晶4", pages: "mondai p.5–10",
    type: "numeric",
    question: "格子定数 a = 0.543 nm のSi結晶（ダイヤモンド構造、単位格子中の原子数8個）の原子数密度 n = 8/a³ を求めよ。単位は 10²⁸ 個/m³ とし、小数1桁で答えよ。",
    answer: 5.0, tolerancePct: 0.1, unit: "×10²⁸ 個/m³",
    explain: "a³ = (0.543×10⁻⁹ m)³ ≈ 1.60×10⁻²⁸ m³。n = 8 / 1.60×10⁻²⁸ ≈ 5.0×10²⁸ 個/m³。"
  },
  {
    id: "q-crystal4c", category: "crystal", section: "結晶4", pages: "mondai p.5–10",
    type: "choice",
    question: "理想的な六方最密構造 (hcp) の軸比 c/a の値に最も近いものは？",
    choices: ["1.000", "1.414", "1.633", "2.000"],
    answerIndex: 2,
    explain: "剛体球を最密充填したときの理論値は c/a = √(8/3) ≈ 1.633 です。"
  },
  {
    id: "q-crystal5", category: "crystal", section: "結晶5", pages: "mondai p.11",
    type: "choice",
    question: "ダイヤモンド構造における最近接原子間距離を、格子定数 a を用いて正しく表したものは？",
    choices: ["a/2", "(√3/4) a", "(√2/4) a", "a/4"],
    answerIndex: 1,
    explain: "最近接原子は (0,0,0) と (1/4,1/4,1/4) の関係にあり、距離は √((a/4)²×3) = (√3/4)a です。"
  },
  {
    id: "q-crystal6", category: "crystal", section: "結晶6", pages: "mondai p.12",
    type: "numeric",
    question: "KCl結晶（NaCl型構造）で、K⁺とCl⁻の最近接距離（イオン半径の和）が 0.314 nm のとき、格子定数 a [nm] を求めよ（小数2桁）。",
    answer: 0.628, tolerancePct: 0.05, unit: "nm",
    explain: "NaCl型構造では最近接距離 = a/2 なので、a = 2×0.314 ≈ 0.628 nm。"
  },
  {
    id: "q-qm1a", category: "quantum", section: "量子力学1", pages: "mondai p.13–14",
    type: "numeric",
    question: "エネルギー 1 eV の光子の波数 k = 2π/λ [×10⁶ /m] を求めよ（小数1桁）。hc = 1240 eV·nm を使ってよい。",
    answer: 5.1, tolerancePct: 0.1, unit: "×10⁶ /m",
    explain: "λ = hc/E = 1240/1 = 1240 nm。k = 2π/λ = 2π/(1.24×10⁻⁶ m) ≈ 5.1×10⁶ /m。"
  },
  {
    id: "q-qm1b", category: "quantum", section: "量子力学1", pages: "mondai p.13–14",
    type: "numeric",
    question: "同じ 1 eV のエネルギーを持つ自由電子の波数 k = √(2mE)/ħ [×10⁹ /m] を求めよ（小数1桁）。m=9.11×10⁻³¹kg, ħ=1.055×10⁻³⁴J·s とする。",
    answer: 5.1, tolerancePct: 0.1, unit: "×10⁹ /m",
    explain: "E=1.602×10⁻¹⁹J。√(2mE)=√(2×9.11×10⁻³¹×1.602×10⁻¹⁹)≈5.40×10⁻²⁵。k=5.40×10⁻²⁵/1.055×10⁻³⁴≈5.1×10⁹ /m。光子の k（10⁶ /m台）より1000倍大きく、同じエネルギーでも電子の波長は光よりずっと短いことがわかります。"
  },
  {
    id: "q-qm2a", category: "quantum", section: "量子力学2", pages: "mondai p.15",
    type: "numeric",
    question: "He⁺イオン（原子番号Z=2の水素様原子）のn=1軌道半径 r₁ = a₀/Z [nm] を求めよ（小数4桁、a₀=0.0529nm）。",
    answer: 0.0265, tolerancePct: 0.1, unit: "nm",
    explain: "水素様原子の軌道半径は r_n = n²a₀/Z。n=1, Z=2 なので r₁ = 0.0529/2 ≈ 0.0265 nm。"
  },
  {
    id: "q-qm2b", category: "quantum", section: "量子力学2", pages: "mondai p.15",
    type: "choice",
    question: "電子の物質波長は加速電圧 V [V] を用いて λ[Å] = √(150/V) と近似できる。V = 100V のときの λ に最も近い値は？",
    choices: ["0.122 Å", "1.22 Å", "12.2 Å", "122 Å"],
    answerIndex: 1,
    explain: "λ = √(150/100) = √1.5 ≈ 1.22 Å。"
  },
  {
    id: "q-qm2c", category: "quantum", section: "量子力学2", pages: "mondai p.15",
    type: "numeric",
    question: "フェルミ・ディラック分布 f(E)=1/[exp((E−E_F)/k_BT)+1] において、E−E_F=+0.1eV、T=300K（k_BT≈0.0259eV）のときの f(E) を求めよ（小数2桁）。",
    answer: 0.02, tolerancePct: 0.3, unit: "",
    explain: "(E−E_F)/k_BT ≈ 0.1/0.0259 ≈ 3.87。f = 1/(e^3.87+1) ≈ 1/48.9 ≈ 0.02。フェルミ準位より0.1eV高いと、電子が見つかる確率はわずか2%程度まで下がります。"
  },
  {
    id: "q-qm3a", category: "quantum", section: "量子力学3", pages: "mondai p.16–20",
    type: "choice",
    question: "自由粒子の波動関数 f(x)=A·exp(−ikx) がシュレディンガー方程式の固有関数であるとき、対応する運動量固有値 p とエネルギー固有値 E の組み合わせとして正しいものは？",
    choices: ["p = ħk, E = ħ²k²/2m", "p = −ħk, E = ħ²k²/2m", "p = −ħk, E = ħω", "p = ħk, E = ħk"],
    answerIndex: 1,
    explain: "運動量演算子 −iħ d/dx を f(x) に作用させると −iħ(−ik)Ae^{−ikx} = −ħk·f(x) となるので p=−ħk。エネルギーは運動量演算子を2回適用（またはE=p²/2m）して E=ħ²k²/2m。"
  },
  {
    id: "q-qm3b", category: "quantum", section: "量子力学3", pages: "mondai p.16–20",
    type: "choice",
    question: "KCl結晶とダイヤモンド結晶の化学結合の種類の組み合わせとして正しいものは？",
    choices: ["KCl：共有結合／ダイヤモンド：イオン結合", "KCl：イオン結合／ダイヤモンド：共有結合", "両方ともイオン結合", "両方とも共有結合"],
    answerIndex: 1,
    explain: "KClはK⁺とCl⁻のクーロン力によるイオン結合、ダイヤモンドはsp³混成軌道による共有結合です。"
  },
  {
    id: "q-qm3c", category: "quantum", section: "量子力学3", pages: "mondai p.16–20",
    type: "numeric",
    question: "加速電圧 V=15000V で加速された電子の物質波長 λ[Å]=√(150/V) を求め、pm単位に換算せよ（1Å=100pm、小数1桁）。",
    answer: 10.0, tolerancePct: 0.15, unit: "pm",
    explain: "λ = √(150/15000) = √0.01 = 0.1 Å = 10 pm。X線に近い波長を持つため、電子線回折に利用できます。"
  },
  {
    id: "q-qm4a", category: "quantum", section: "量子力学4", pages: "mondai p.22–24",
    type: "numeric",
    question: "水素原子のn=3→n=2遷移で放出される光の波長 λ[nm] をリュードベリの式 1/λ=R(1/n²−1/m²) から求めよ（R=1.097×10⁷/m、小数0桁）。",
    answer: 656, tolerancePct: 0.03, unit: "nm",
    explain: "1/λ = R(1/4−1/9) = R×5/36 ≈ 1.524×10⁶/m。λ ≈ 656 nm（バルマー系列のHα線、赤色の輝線として知られる波長）。"
  },
  {
    id: "q-qm4b", category: "quantum", section: "量子力学4", pages: "mondai p.22–24",
    type: "numeric",
    question: "ボーア模型で水素原子のn=2のエネルギー準位 E₂[eV] を E_n=−13.6/n² から求めよ（小数1桁）。",
    answer: -3.4, tolerancePct: 0.05, unit: "eV",
    explain: "E₂ = −13.6/2² = −13.6/4 = −3.4 eV。"
  },
  {
    id: "q-qm5a", category: "quantum", section: "量子力学5", pages: "mondai p.25–26",
    type: "numeric",
    question: "コンプトン効果で散乱角θ=90°のときの波長変化 Δλ = (h/m_ec)(1−cosθ) [pm] を求めよ（小数2桁、h/m_ec=2.426pm）。",
    answer: 2.43, tolerancePct: 0.05, unit: "pm",
    explain: "θ=90°では1−cosθ=1なので、Δλ = h/m_ec ≈ 2.43 pm（コンプトン波長そのもの）。"
  },
  {
    id: "q-qm5b", category: "quantum", section: "量子力学5", pages: "mondai p.25–26",
    type: "choice",
    question: "次の現象のうち、電子の「波としての性質」が最も直接的に関わっているものはどれか？",
    choices: ["水素原子の発光スペクトル（輝線）", "電子線回折像", "シリコン結晶の共有結合形成", "金属の仕事関数による光電効果"],
    answerIndex: 1,
    explain: "電子線回折像は、電子線が結晶で回折・干渉してリング状の模様を作ることで、電子の波動性を直接的に示します。"
  }
];
