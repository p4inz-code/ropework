// Runs first, so the chosen theme is on the page before it is drawn (no flash). Storage may be blocked: then the system theme stays.
(function () {
  try {
    var t = localStorage.getItem("ropework.theme");
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
  } catch (e) {
    /* the system theme stays */
  }
})();
// A page cannot be shown inside another site's frame (the policy header that does this cannot be set on this host).
try {
  if (window.top !== window.self) {
    document.documentElement.hidden = true;
    window.top.location = window.self.location;
  }
} catch (e) {
  document.documentElement.hidden = true;
}
