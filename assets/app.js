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
  // NOTE: marked@12 dropped headerIds/mangle — rendered headings carry NO id.
  // Any id we need (category jump-links) is assigned in JS; see enhancePipeline().
  marked.setOptions({ gfm: true, breaks: false });

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

    // Pipeline-only render-time enhancements. Order matters:
    // summary first (inserts mid-doc), then the sticky nav (becomes firstChild),
    // then linkify last so it also covers nodes the first two relocated.
    if (container.id === "md-pipeline") {
      enhanceSummary(container);
      enhancePipeline(container);
      linkifyRefs(container);
    }
  }

  /* ---------- shared helpers for pipeline enhancements ---------- */
  const REPO_URL = "https://github.com/flutter/flutter";
  const COMMIT = REPO_URL + "/commit/";
  const PULL = REPO_URL + "/pull/";
  const SHA_RE = /^[0-9a-f]{7}$/;                 // exactly 7 hex = a short SHA
  const PR_RE = /(^|[^\w/&#])#(\d{4,})\b/g;       // bare #NNNN, not inside paths/entities

  const slugify = (t) =>
    t.toLowerCase().trim().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");

  function mkAnchor(href, label) {
    const a = document.createElement("a");
    a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", label);
    return a;
  }

  function findH2(container, text) {
    return [...container.querySelectorAll("h2")].find((h) => h.textContent.trim() === text) || null;
  }

  // substring -> emoji; first matching pair wins, else fallback
  function pickIcon(text, pairs, fallback) {
    const l = text.toLowerCase();
    for (const [keys, icon] of pairs) {
      if (keys.split("|").some((k) => l.includes(k))) return icon;
    }
    return fallback;
  }
  const THEME_ICONS = [
    ["gpu", "⚡"], ["impeller", "🎨"], ["gamut", "🌈"], ["ios|swift", "🍎"],
    ["desktop|window", "🖥️"], ["android", "🤖"], ["dart", "🎯"], ["web|wasm", "🌐"],
  ];
  const CAT_ICONS = [
    ["framework", "🧩"], ["accessib", "♿"], ["cupertino|ios", "🍎"], ["android", "🤖"],
    ["web|wasm", "🌐"], ["desktop", "🖥️"], ["engine|impeller", "⚙️"], ["gpu", "🎮"],
    ["dart|tooling|devtools", "🛠️"], ["deprecat|breaking", "⚠️"],
  ];

  /* ---------- feature A: headline-themes summary callout ---------- */
  const CAVEAT =
    "Raw merged commits on Flutter main — NOT official release notes. " +
    "Reverts happen; nothing here is guaranteed to ship.";

  function enhanceSummary(container) {
    const h2 = findH2(container, "Headline themes");
    if (!h2 || h2.dataset.summaryDone) return;
    h2.dataset.summaryDone = "1";

    // collect the block (siblings until the next H2) before mutating
    const block = [];
    for (let n = h2.nextElementSibling; n && n.tagName !== "H2"; n = n.nextElementSibling) block.push(n);

    const callout = document.createElement("section");
    callout.className = "headline-callout";
    callout.setAttribute("role", "region");
    callout.setAttribute("aria-label", "Headline themes summary");

    const cav = document.createElement("div");
    cav.className = "caveat-banner";
    cav.setAttribute("role", "note");
    cav.textContent = CAVEAT;
    callout.appendChild(cav);

    const grid = document.createElement("div");
    grid.className = "theme-grid";

    for (let i = 0; i < block.length; i++) {
      const node = block[i];
      const lead = node.firstElementChild;
      if (node.tagName === "P" && lead && lead.tagName === "STRONG") {
        const titleText = lead.textContent
          .replace(/^\s*\d+\.\s*/, "")   // drop "1. "
          .replace(/[.\s]+$/, "");
        const card = document.createElement("div");
        card.className = "theme-card";
        const title = document.createElement("h3");
        title.className = "theme-card-title";
        title.textContent = pickIcon(titleText, THEME_ICONS, "•") + " " + titleText;
        card.appendChild(title);
        const body = document.createElement("div");
        body.className = "theme-card-body";
        lead.remove();
        while (node.firstChild) body.appendChild(node.firstChild);
        card.appendChild(body);
        node.remove();                  // discard the now-empty original <p>
        const after = block[i + 1];
        if (after && after.tagName === "UL") { body.appendChild(after); i++; } // fold trailing list in
        grid.appendChild(card);
      } else {
        grid.appendChild(node);         // preserve any stray node (no content loss)
      }
    }
    callout.appendChild(grid);

    // count chip on the heading (plain text, not a heading, not aria-live)
    const gd = findH2(container, "Grouped detail");
    let groups = 0;
    if (gd) for (let g = gd.nextElementSibling; g && g.tagName !== "H2"; g = g.nextElementSibling) {
      if (g.tagName === "H3") groups++;
    }
    const chip = document.createElement("span");
    chip.className = "theme-count-chip";
    chip.textContent = `${grid.children.length} themes · ${groups} categories`;
    h2.appendChild(chip);

    h2.insertAdjacentElement("afterend", callout);
  }

  /* ---------- feature B: sticky category chip-bar + scroll-spy ---------- */
  function enhancePipeline(container) {
    if (container.dataset.pipelineNav) return;   // single-mount assumption (no re-mount today)
    const gd = findH2(container, "Grouped detail");
    if (!gd) return;
    const cats = [];
    for (let g = gd.nextElementSibling; g && g.tagName !== "H2"; g = g.nextElementSibling) {
      if (g.tagName === "H3") cats.push(g);
    }
    if (!cats.length) return;
    container.dataset.pipelineNav = "1";

    const seen = new Set();
    const nav = document.createElement("nav");
    nav.className = "category-nav";
    nav.setAttribute("aria-label", "Pipeline categories");
    cats.forEach((h, i) => {
      let id = slugify(h.textContent) || ("cat-" + i);
      if (seen.has(id)) { let k = 2; while (seen.has(id + "-" + k)) k++; id += "-" + k; }
      seen.add(id);
      h.id = id;
      const label = h.textContent.trim();
      const a = document.createElement("a");
      a.className = "cat-chip";
      a.href = "#" + id;
      a.textContent = pickIcon(label, CAT_ICONS, "•") + " " + label;
      nav.appendChild(a);
    });
    container.insertBefore(nav, container.firstElementChild);

    const chips = [...nav.querySelectorAll(".cat-chip")];
    function setActive(id) {
      chips.forEach((c) => {
        const on = c.getAttribute("href").slice(1) === id;
        c.classList.toggle("active", on);
        if (on) c.setAttribute("aria-current", "true");
        else c.removeAttribute("aria-current");
      });
    }
    // keep the active chip visible in the horizontal strip when clicked
    chips.forEach((c) => c.addEventListener("click", () => {
      setActive(c.getAttribute("href").slice(1));
      c.scrollIntoView({ inline: "nearest", block: "nearest" });
    }));

    const spy = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      if (!vis.length) return;
      vis.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      setActive(vis[0].id);
    }, { rootMargin: "-130px 0px -70% 0px", threshold: 0 });
    cats.forEach((h) => spy.observe(h));

    // bottom fallback: dense final categories never become "topmost" otherwise
    document.addEventListener("scroll", () => {
      const d = document.documentElement;
      if (d.scrollTop + d.clientHeight >= d.scrollHeight - 4) setActive(cats[cats.length - 1].id);
    }, { passive: true });
  }

  /* ---------- feature C: linkify SHAs + PR refs (post-sanitize DOM walk) ---------- */
  function linkifyRefs(container) {
    // Pass A: a backticked short SHA -> commit link (keep the <code> chip look)
    container.querySelectorAll("code").forEach((code) => {
      if (code.closest("pre") || code.closest("a")) return;
      if (code.children.length) return;            // only plain-text code chips
      const sha = code.textContent.trim();
      if (!SHA_RE.test(sha)) return;
      const a = mkAnchor(COMMIT + sha, "commit " + sha);
      code.replaceWith(a);
      a.appendChild(code);
    });

    // Pass B: bare #NNNN in text -> PR link (skip pre/code/a; collect-then-mutate)
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.nodeValue.indexOf("#") === -1) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p || p.closest("pre, code, a")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const targets = [];
    for (let t = walker.nextNode(); t; t = walker.nextNode()) targets.push(t);

    targets.forEach((node) => {
      const text = node.nodeValue;
      PR_RE.lastIndex = 0;
      if (!PR_RE.test(text)) return;
      PR_RE.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0, m;
      while ((m = PR_RE.exec(text)) !== null) {
        const hashAt = m.index + m[1].length;      // index of '#'
        if (hashAt > last) frag.appendChild(document.createTextNode(text.slice(last, hashAt)));
        const a = mkAnchor(PULL + m[2], "pull request #" + m[2]);
        a.textContent = "#" + m[2];
        frag.appendChild(a);
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.replaceWith(frag);
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
