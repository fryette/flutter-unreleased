/* ============ Flutter Unreleased Tracker — app ============ */
(() => {
  "use strict";

  const FILES = {
    pipeline:  "data/unreleased-pipeline.md",
    structure: "data/release-structure.md",
    readme:    "README.md",
  };

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const saved = localStorage.getItem("fu-theme");
  if (saved) root.setAttribute("data-theme", saved);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("fu-theme", next);
  });

  /* ---------- markdown render ---------- */
  marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });

  function render(md) {
    const dirty = marked.parse(md);
    return DOMPurify.sanitize(dirty, { ADD_ATTR: ["target", "rel"] });
  }

  // Wrap tables for horizontal scroll + add copy buttons to code blocks.
  function enhance(container) {
    container.querySelectorAll("table").forEach((tbl) => {
      if (tbl.parentElement.classList.contains("table-scroll")) return;
      const wrap = document.createElement("div");
      wrap.className = "table-scroll";
      tbl.parentNode.insertBefore(wrap, tbl);
      wrap.appendChild(tbl);
    });
    container.querySelectorAll("pre").forEach((pre) => {
      if (pre.parentElement.classList.contains("code-wrap")) return;
      const wrap = document.createElement("div");
      wrap.className = "code-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText);
          btn.textContent = "Copied!"; btn.classList.add("done");
          setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1600);
        } catch { btn.textContent = "Press ⌘C"; }
      });
      wrap.appendChild(btn);
    });
    // open external links in new tab
    container.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.target = "_blank"; a.rel = "noopener";
    });
  }

  async function load(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    return res.text();
  }

  function mountInto(id, md) {
    const el = document.getElementById(id);
    el.innerHTML = render(md);
    enhance(el);
  }

  function fail(id, url) {
    document.getElementById(id).innerHTML =
      `<p class="loading">Couldn't load <code>${url}</code>. ` +
      `If you opened this file directly, serve it over HTTP (e.g. <code>python3 -m http.server</code>).</p>`;
  }

  /* ---------- snapshot stat cards (parsed from README) ---------- */
  // Inline-render backticks/bold inside a value string.
  function inlineMd(s) {
    return DOMPurify.sanitize(
      s.replace(/`([^`]+)`/g, "<code>$1</code>")
       .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    );
  }

  const ICONS = {
    refreshed: "🕒", stable: "🚀", next: "🧪", edge: "🔭", cut: "✂️",
  };
  function iconFor(label) {
    const l = label.toLowerCase();
    if (l.includes("refresh")) return ICONS.refreshed;
    if (l.includes("next")) return ICONS.next;
    if (l.includes("edge") || l.includes("main")) return ICONS.edge;
    if (l.includes("cut")) return ICONS.cut;
    if (l.includes("stable")) return ICONS.stable;
    return "•";
  }

  function buildStats(readme) {
    // Grab "> - **Label:** value" lines from the snapshot blockquote.
    const rows = [];
    const re = /^>\s*-\s*\*\*(.+?):?\*\*[:\s]*(.+)$/gm;
    let m;
    while ((m = re.exec(readme)) !== null) {
      let label = m[1].trim().replace(/:$/, "");
      let value = m[2].trim();
      // Split off a trailing "— note" as a sub-line where present.
      let sub = "";
      const dash = value.split(/\s+—\s+/);
      if (dash.length > 1) { value = dash[0].trim(); sub = dash.slice(1).join(" — ").trim(); }
      rows.push({ label, value, sub });
    }
    const grid = document.getElementById("stat-grid");
    if (!rows.length) { grid.style.display = "none"; return; }
    grid.innerHTML = rows.slice(0, 5).map((r) => `
      <div class="stat-card">
        <div class="stat-label">${iconFor(r.label)} ${r.label.replace(/`/g, "")}</div>
        <div class="stat-value">${inlineMd(r.value)}</div>
        ${r.sub ? `<div class="stat-sub">${inlineMd(r.sub)}</div>` : ""}
      </div>`).join("");
  }

  /* ---------- boot ---------- */
  (async () => {
    // pipeline + structure
    for (const [key, url] of Object.entries(FILES)) {
      const id = key === "pipeline" ? "md-pipeline" : key === "structure" ? "md-structure" : "md-readme";
      try {
        const md = await load(url);
        mountInto(id, md);
        if (key === "readme") buildStats(md);
      } catch (e) {
        console.error(e);
        fail(id, url);
        if (key === "readme") document.getElementById("stat-grid").style.display = "none";
      }
    }
  })();

  /* ---------- scroll progress + back-to-top ---------- */
  const progress = document.getElementById("scroll-progress");
  const toTop = document.getElementById("to-top");
  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    progress.style.width = (scrolled * 100) + "%";
    toTop.classList.toggle("show", h.scrollTop > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- active nav + reveal ---------- */
  const sections = [...document.querySelectorAll(".doc-section")];
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in-view");
        const id = en.target.id;
        navLinks.forEach((l) => l.classList.toggle("active", l.dataset.section === id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
  sections.forEach((s) => io.observe(s));

  // separate observer just for reveal (lower threshold, fires earlier)
  const revealIo = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add("in-view"); });
  }, { threshold: 0.05 });
  sections.forEach((s) => revealIo.observe(s));
})();
