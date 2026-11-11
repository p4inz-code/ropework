// Small behaviours: the theme choice, copy buttons, the download tabs and the two forms. Nothing here talks to any address except the form endpoint.
(function () {
  var root = document.documentElement;

  // ---- theme
  function applyTheme(choice) {
    if (choice === "light" || choice === "dark") root.setAttribute("data-theme", choice);
    else root.removeAttribute("data-theme");
    document.querySelectorAll("[data-theme-set]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-set") === (choice || "system")));
    });
  }
  var saved = null;
  try {
    saved = localStorage.getItem("ropework.theme");
  } catch (e) {
    /* blocked */
  }
  applyTheme(saved);
  document.querySelectorAll("[data-theme-set]").forEach(function (b) {
    b.addEventListener("click", function () {
      var c = b.getAttribute("data-theme-set");
      applyTheme(c === "system" ? null : c);
      try {
        if (c === "system") localStorage.removeItem("ropework.theme");
        else localStorage.setItem("ropework.theme", c);
      } catch (e) {
        /* the choice lasts for this page */
      }
    });
  });

  // ---- copy buttons
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy");
      var done = function () {
        var old = b.lastChild.textContent;
        b.lastChild.textContent = " Copied";
        setTimeout(function () {
          b.lastChild.textContent = old;
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  // ---- download tabs (arrow keys move between them)
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.querySelector('[data-panel="' + t.getAttribute("data-tab") + '"]');
      if (p) p.hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      select(t);
    });
    t.addEventListener("keydown", function (e) {
      var j = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : -1;
      if (j < 0) return;
      e.preventDefault();
      var n = tabs[(j + tabs.length) % tabs.length];
      select(n);
      n.focus();
    });
  });

  // ---- forms
  var endpoint = (document.querySelector('meta[name="form-endpoint"]') || {}).content || "";
  var params = new URLSearchParams(location.search);
  var started = Date.now();
  document.querySelectorAll("form[data-kind]").forEach(function (form) {
    var status = form.querySelector(".status");
    var kind = form.getAttribute("data-kind");
    if (kind === "request" && params.get("plan")) {
      var ta = form.querySelector("textarea");
      if (ta && !ta.value) ta.value = "Asking about: " + params.get("plan").slice(0, 40) + ". ";
    }
    function show(tone, text) {
      status.hidden = false;
      status.className = "status notice " + (tone === "good" ? "good" : tone === "bad" ? "warn" : "info");
      status.textContent = text;
    }
    function clearErrors() {
      form.querySelectorAll(".err").forEach(function (e) {
        e.remove();
      });
      form.querySelectorAll("[aria-invalid]").forEach(function (e) {
        e.removeAttribute("aria-invalid");
        e.removeAttribute("aria-describedby");
      });
    }
    function fail(el, message) {
      el.setAttribute("aria-invalid", "true");
      var err = document.createElement("div");
      err.className = "err";
      err.id = (el.id || el.name) + "-err";
      err.textContent = message;
      el.setAttribute("aria-describedby", err.id);
      (el.closest(".field") || el.parentNode).appendChild(err);
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      clearErrors();
      var data = Object.fromEntries(new FormData(form).entries());
      var bad = [];
      var need = function (name, message) {
        var el = form.elements[name];
        if (el && !String(data[name] || "").trim()) {
          fail(el.length ? el[0] : el, message);
          bad.push(el);
        }
      };
      if (kind === "request") {
        need("name", "Please tell us your name.");
        need("email", "Please give a work email so we can reply.");
        need("studio", "Please tell us your studio.");
        need("people", "Please choose how many people would use it.");
        if (!data.terms) {
          fail(form.elements.terms, "Please tick to confirm you have read the beta terms and the privacy notice.");
          bad.push(1);
        }
      } else {
        need("email", "Please give an email so we can reply.");
        need("message", "Please write a message.");
      }
      if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
        fail(form.elements.email, "That does not look like an email address.");
        bad.push(1);
      }
      if (bad.length) {
        var first = form.querySelector("[aria-invalid]");
        if (first) first.focus();
        show("bad", "Some answers need a look. They are marked above.");
        return;
      }
      if (!endpoint) {
        show("bad", "The form is not connected yet, so nothing was sent. Please try again later.");
        return;
      }
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      show("info", "Sending...");
      var body = JSON.stringify({ kind: kind, fields: data, took: Date.now() - started });
      fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: body })
        .then(function (r) {
          return r.json().catch(function () {
            return {};
          }).then(function (j) {
            if (r.ok && j.ok) {
              form.reset();
              show("good", "We got it. You will hear from us within two working days.");
            } else show("bad", j.message || "It did not go through. Please try again in a moment.");
          });
        })
        .catch(function () {
          show("bad", "It did not go through. Please check your connection and try again.");
        })
        .then(function () {
          button.disabled = false;
        });
    });
  });
  // sections that open and close (the mobile menu, older releases): a button with aria-expanded and the panel it controls
  document.querySelectorAll("[data-toggle]").forEach(function (b) {
    var panel = document.getElementById(b.getAttribute("data-toggle"));
    if (!panel) return;
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll('[data-toggle="menu-panel"][aria-expanded="true"]').forEach(function (b) { b.click(); b.focus(); });
  });

  // ---- guide: questions open and close, a search box filters them, the contents list follows the page
  var qs = Array.prototype.slice.call(document.querySelectorAll(".qa"));
  qs.forEach(function (q) {
    var b = q.querySelector(".qa-q");
    var a = q.querySelector(".qa-a");
    function set(open) {
      b.setAttribute("aria-expanded", String(open));
      a.hidden = !open;
    }
    set(false);
    b.addEventListener("click", function () {
      set(b.getAttribute("aria-expanded") !== "true");
    });
    if (location.hash === "#" + q.id) set(true);
  });
  var box = document.querySelector(".qa-search");
  if (box) {
    var none = document.querySelector(".qa-none");
    box.addEventListener("input", function () {
      var term = box.value.trim().toLowerCase();
      var shown = 0;
      qs.forEach(function (q) {
        var hit = !term || q.textContent.toLowerCase().indexOf(term) !== -1;
        q.hidden = !hit;
        if (hit) shown++;
        if (term && hit) {
          q.querySelector(".qa-q").setAttribute("aria-expanded", "true");
          q.querySelector(".qa-a").hidden = false;
        }
      });
      if (none) none.hidden = shown !== 0;
    });
  }
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var seen = {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          seen[e.target.id] = e.isIntersecting;
        });
        var first = tocLinks.filter(function (l) {
          return seen[l.getAttribute("href").slice(1)];
        })[0];
        if (first) tocLinks.forEach(function (l) { l.setAttribute("aria-current", String(l === first)); });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    tocLinks.forEach(function (l) {
      var s = document.getElementById(l.getAttribute("href").slice(1));
      if (s) io.observe(s);
    });
  }

})();
