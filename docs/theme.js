// Runs first, so the chosen theme is on the page before it is drawn (no flash). Storage may be blocked: then the system theme stays.
(function () {
  try {
    var t = localStorage.getItem("ropework.theme");
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
  } catch (e) {
    /* the system theme stays */
  }
})();
