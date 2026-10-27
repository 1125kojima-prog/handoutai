// 理解確認クイズ：mondai.pdf ベースの一問一答・計算問題（js/data/quiz.js の QUIZ_QUESTIONS を使用）

const QuizView = (function () {
  var bodyEl, progressEl, filterEl, restartBtn;
  var category = "all";
  var list = [];
  var index = 0;
  var score = 0;
  var answered = false;

  function startQuiz() {
    list = QUIZ_QUESTIONS.filter(function (q) { return category === "all" || q.category === category; });
    index = 0; score = 0; answered = false;
    renderQuestion();
  }

  function renderProgress() {
    progressEl.textContent = list.length ? ("第 " + (index + 1) + " / " + list.length + " 問　現在のスコア: " + score) : "";
  }

  function renderResult() {
    bodyEl.innerHTML =
      '<div class="quiz-card quiz-result-banner">' +
      "<h2>結果: " + score + " / " + list.length + " 問正解</h2>" +
      '<p class="muted">「最初から」ボタンでもう一度挑戦できます。</p>' +
      '</div>';
    progressEl.textContent = "終了";
  }

  function renderQuestion() {
    renderProgress();
    if (index >= list.length) { renderResult(); return; }
    var q = list[index];
    answered = false;

    var html = '<div class="quiz-card">' +
      '<div class="quiz-head"><strong>' + q.section + '</strong><span class="quiz-ref">出典: ' + q.pages + '</span></div>' +
      '<div class="quiz-question">' + q.question + '</div>';

    if (q.type === "choice") {
      html += '<div class="quiz-options">';
      q.choices.forEach(function (c, i) {
        html += '<button class="quiz-option" data-idx="' + i + '">' + c + '</button>';
      });
      html += '</div>';
    } else {
      html += '<div class="quiz-numeric"><input type="number" step="any" id="quiz-numeric-input" placeholder="数値を入力"><span class="muted">' + (q.unit || "") + '</span>' +
        '<button class="btn-primary" id="quiz-submit-numeric">採点する</button></div>';
    }

    html += '<div id="quiz-explain-slot"></div>' +
      '<div class="quiz-actions"><button class="btn-primary" id="quiz-next" disabled>次の問題へ</button></div>' +
      '</div>';
    bodyEl.innerHTML = html;

    if (q.type === "choice") {
      bodyEl.querySelectorAll(".quiz-option").forEach(function (btn) {
        btn.addEventListener("click", function () { handleChoiceAnswer(q, parseInt(btn.dataset.idx, 10)); });
      });
    } else {
      document.getElementById("quiz-submit-numeric").addEventListener("click", function () { handleNumericAnswer(q); });
      document.getElementById("quiz-numeric-input").addEventListener("keydown", function (e) {
        if (e.key === "Enter") handleNumericAnswer(q);
      });
    }
    document.getElementById("quiz-next").addEventListener("click", function () { index++; renderQuestion(); });
  }

  function showExplain(correct, text) {
    var slot = document.getElementById("quiz-explain-slot");
    slot.innerHTML = '<div class="quiz-explain ' + (correct ? "ok-explain" : "bad-explain") + '">' +
      "<strong>" + (correct ? "正解です。" : "不正解です。") + "</strong> " + text + "</div>";
    document.getElementById("quiz-next").disabled = false;
  }

  function handleChoiceAnswer(q, idx) {
    if (answered) return;
    answered = true;
    var correct = idx === q.answerIndex;
    if (correct) score++;
    bodyEl.querySelectorAll(".quiz-option").forEach(function (btn, i) {
      btn.disabled = true;
      if (i === q.answerIndex) btn.classList.add("correct");
      if (i === idx && i !== q.answerIndex) btn.classList.add("incorrect");
    });
    showExplain(correct, q.explain);
    renderProgressAfterAnswer();
  }

  function handleNumericAnswer(q) {
    if (answered) return;
    var input = document.getElementById("quiz-numeric-input");
    var val = parseFloat(input.value);
    if (isNaN(val)) { input.focus(); return; }
    answered = true;
    input.disabled = true;
    document.getElementById("quiz-submit-numeric").disabled = true;
    var tol = q.tolerancePct || 0.1;
    var diff = Math.abs(val - q.answer);
    var ref = Math.abs(q.answer) < 1e-9 ? 1 : Math.abs(q.answer);
    var correct = (diff / ref) <= tol;
    if (correct) score++;
    showExplain(correct, "正解は " + q.answer + " " + (q.unit || "") + " 程度です。" + q.explain);
    renderProgressAfterAnswer();
  }

  function renderProgressAfterAnswer() {
    progressEl.textContent = "第 " + (index + 1) + " / " + list.length + " 問　現在のスコア: " + score;
  }

  function init() {
    bodyEl = document.getElementById("quiz-body");
    progressEl = document.getElementById("quiz-progress");
    filterEl = document.getElementById("quiz-filter");
    restartBtn = document.getElementById("quiz-restart");

    filterEl.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        filterEl.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        category = chip.dataset.cat;
        startQuiz();
      });
    });
    restartBtn.addEventListener("click", startQuiz);

    startQuiz();
  }

  return { init: init };
})();

window.QuizView = QuizView;
