(function () {
  "use strict";

  var tabButtons = document.querySelectorAll(".tab-btn");
  var views = document.querySelectorAll(".view");
  var initialized = { glossary: false, crystal3d: false, qmsim: false, quiz: false };

  function activate(viewName) {
    tabButtons.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });
    views.forEach(function (sec) {
      sec.classList.toggle("active", sec.id === "view-" + viewName);
    });

    if (!initialized[viewName]) {
      initialized[viewName] = true;
      if (viewName === "glossary" && window.GlossaryView) window.GlossaryView.init();
      if (viewName === "crystal3d" && window.CrystalView) window.CrystalView.init();
      if (viewName === "qmsim" && window.QMSimView) window.QMSimView.init();
      if (viewName === "quiz" && window.QuizView) window.QuizView.init();
    } else {
      if (viewName === "crystal3d" && window.CrystalView) window.CrystalView.onShow();
      if (viewName === "qmsim" && window.QMSimView) window.QMSimView.onShow();
    }
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activate(btn.dataset.view);
    });
  });

  // 用語辞典カードからのクロスリンク（他タブへジャンプ）
  window.AppNav = {
    goTo: function (viewName, payload) {
      activate(viewName);
      if (viewName === "crystal3d" && window.CrystalView && payload) {
        window.CrystalView.selectStructure(payload.structureId);
      }
      if (viewName === "qmsim" && window.QMSimView && payload) {
        window.QMSimView.selectSim(payload.simId);
      }
    }
  };

  // 初期表示（用語辞典）
  activate("glossary");
})();
