(function () {
  const STORAGE_KEY = "real_options_8week_done_v1";

  function loadDone() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveDone(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  function refreshUI() {
    const done = loadDone();
    document.querySelectorAll("[data-lesson-item]").forEach(function (el) {
      const key = el.getAttribute("data-lesson-item");
      const badge = el.querySelector("[data-done-badge]");
      if (done.has(key)) {
        el.classList.add("is-done");
        if (badge) badge.textContent = "已完成";
      } else {
        el.classList.remove("is-done");
        if (badge) badge.textContent = "未开始";
      }
    });

    const totalEl = document.querySelector("[data-progress-total]");
    if (totalEl) {
      const total = parseInt(totalEl.getAttribute("data-progress-total"), 10) || 28;
      const count = done.size;
      const pct = Math.round((count / total) * 100);
      const textEl = document.getElementById("progress-text");
      const fillEl = document.getElementById("progress-fill");
      if (textEl) textEl.textContent = count + " / " + total + " 节点已完成（" + pct + "%）";
      if (fillEl) fillEl.style.width = pct + "%";
    }

    document.querySelectorAll("[data-stage-keys]").forEach(function (el) {
      const keys = el.getAttribute("data-stage-keys").split(",").filter(Boolean);
      const hit = keys.filter(function (k) { return done.has(k); }).length;
      el.textContent = "本地打卡：" + hit + " / " + keys.length;
    });

    const toggleBtn = document.getElementById("toggle-done-btn");
    if (toggleBtn) {
      const key = toggleBtn.getAttribute("data-lesson-key");
      if (done.has(key)) {
        toggleBtn.textContent = "已打卡完成（点击取消）";
        toggleBtn.classList.remove("btn-navy");
        toggleBtn.classList.add("btn-done");
      } else {
        toggleBtn.textContent = "标记本节已完成（本地打卡）";
        toggleBtn.classList.remove("btn-done");
        toggleBtn.classList.add("btn-navy");
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-done-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        const key = toggleBtn.getAttribute("data-lesson-key");
        const done = loadDone();
        if (done.has(key)) {
          done.delete(key);
        } else {
          done.add(key);
        }
        saveDone(done);
        refreshUI();
      });
    }

    if (typeof renderMathInElement === "function") {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    }

    refreshUI();
  });
})();
