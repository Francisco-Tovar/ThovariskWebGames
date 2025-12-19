(function () {
  const games = Array.isArray(window.GAMES) ? window.GAMES.slice() : [];

  const app = document.getElementById("app");
  const viewTitle = document.getElementById("viewTitle");
  const viewHint = document.getElementById("viewHint");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const themeBtn = document.getElementById("themeBtn");
  const themeGlyph = document.getElementById("themeGlyph");

  const modal = document.getElementById("gameModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalMeta = document.getElementById("modalMeta");
  const modalPlay = document.getElementById("modalPlay");
  const modalSource = document.getElementById("modalSource");
  const modalCopy = document.getElementById("modalCopy");
  const modalBadge = document.getElementById("modalBadge");

  let state = {
    route: "games",
    q: "",
    sort: "newest",
  };

  function safeText(v) {
    return String(v ?? "");
  }
  function norm(s) {
    return safeText(s).trim().toLowerCase();
  }
  function parseDate(iso) {
    const t = Date.parse(iso || "");
    return Number.isFinite(t) ? t : 0;
  }

  function setActiveNav(route) {
    document.querySelectorAll(".nav__link").forEach((a) => {
      const r = a.getAttribute("data-route");
      if (r === route) {
        a.classList.add("is-active");
      } else {
        a.classList.remove("is-active");
      }
    });
  }

  function routeFromHash() {
    const h = location.hash || "#/games";
    const parts = h.replace(/^#\//, "").split("/");
    return parts[0] || "games";
  }

  function matches(g, q) {
    if (!q) return true;
    const hay = [
      g.title,
      g.description,
      g.platform,
      Array.isArray(g.tags) ? g.tags.join(" ") : "",
      Array.isArray(g.stores) ? g.stores.map((x) => x.label).join(" ") : "",
    ]
      .map(norm)
      .join(" ");
    return hay.includes(q);
  }

  function sortGames(list, mode) {
    const copy = list.slice();

    if (mode === "az") {
      copy.sort((a, b) => norm(a.title).localeCompare(norm(b.title)));
      return copy;
    }
    if (mode === "featured") {
      copy.sort((a, b) => {
        const fa = a.featured ? 1 : 0;
        const fb = b.featured ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return parseDate(b.created) - parseDate(a.created);
      });
      return copy;
    }
    if (mode === "playtime") {
      function mins(g) {
        const m = safeText(g.playtime).match(/(\d+)/);
        return m ? Number(m[1]) : 9999;
      }
      copy.sort((a, b) => mins(a) - mins(b));
      return copy;
    }

    copy.sort((a, b) => parseDate(b.created) - parseDate(a.created));
    return copy;
  }

  function thumbHtml(g) {
    const price = safeText(g.priceTag).trim();
    const cover = safeText(g.cover).trim();

    const priceEl = price ? `<div class="pricechip">${price}</div>` : "";
    const body = cover
      ? `<img class="thumb__img" src="${cover}" alt="" loading="lazy" />`
      : `<div class="thumb__fallback" aria-hidden="true">${
          safeText(g.title).slice(0, 1).toUpperCase() || "G"
        }</div>`;

    return `<div class="thumb">${body}${priceEl}</div>`;
  }

  function metaLinks(g) {
    const stores = Array.isArray(g.stores) ? g.stores : [];
    const links = stores.slice(0, 3).map((s) => {
      return `<a href="${safeText(
        s.url
      )}" target="_blank" rel="noopener">${safeText(s.label)}</a>`;
    });

    links.push(
      `<button type="button" data-more="${safeText(g.id)}">Details</button>`
    );
    return links.join('<span aria-hidden="true"> | </span>');
  }

  function item(g) {
    return `
      <article class="item">
        ${thumbHtml(g)}
        <h2 class="name">${safeText(g.title)}</h2>
        <p class="sub">${safeText(g.platform || "")}</p>

        <div class="actions">
          <a class="playbtn" href="${safeText(
            g.url
          )}" target="_blank" rel="noopener">Play</a>
        </div>

        <div class="meta-links">
          ${metaLinks(g)}
        </div>
      </article>
    `;
  }

  function renderGamesView() {
    viewTitle.textContent = "Games";
    viewHint.textContent = "A quirky collection of my web games.";
    setActiveNav("games");

    const q = norm(state.q);
    const filtered = games.filter((g) => matches(g, q));
    const sorted = sortGames(filtered, state.sort);

    if (!sorted.length) {
      app.innerHTML = `<div class="empty">No matches. Update your search or add games in <code>games.js</code>.</div>`;
      return;
    }

    app.innerHTML = `<div class="grid">${sorted.map(item).join("")}</div>`;
  }

  function renderAbout() {
    viewTitle.textContent = "About";
    viewHint.textContent = "Why Thovarisk exists (and what you’ll find here).";
    setActiveNav("about");

    app.innerHTML = `
    <section class="about-hero">
      <div class="about-card">
        <div class="about-badge">THOVARISK • ARCADE CATALOG</div>

        <h2 class="about-title">
          Small projects. Fast ideas. Shippable builds.
        </h2>

        <p class="about-lead">
          <strong>Thovarisk</strong> is my launchpad for web games, prototypes, and experiments—
          each one designed to be <strong>playable</strong>, <strong>shareable</strong>, and <strong>easy to explore</strong>.
        </p>

        <div class="about-grid">
          <div class="about-panel">
            <h3 class="about-h3">What you’ll find</h3>
            <ul class="about-list">
              <li><strong>Playable demos</strong> with clean UI and quick onboarding</li>
              <li><strong>Experiments</strong> in interaction, animation, and game feel</li>
              <li><strong>Source links</strong> to learn from implementation details</li>
            </ul>
          </div>

          <div class="about-panel">
            <h3 class="about-h3">Why it matters</h3>
            <p class="about-text">
              Anyone can list skills. I prefer to show <strong>working software</strong>:
              decisions, polish, and iteration—end-to-end.
            </p>

            <div class="about-stats">
              <div class="stat">
                <div class="stat-k">Games</div>
                <div class="stat-v">Playable</div>
              </div>
              <div class="stat">
                <div class="stat-k">Builds</div>
                <div class="stat-v">Fast</div>
              </div>
              <div class="stat">
                <div class="stat-k">Focus</div>
                <div class="stat-v">Polish</div>
              </div>
            </div>
          </div>
        </div>
        <br/>
        
        <div class="about-cta" style="text-align: center;">
          <img
            src="./assets/portfolio.png"
            alt="Portfolio"
            width="100"
            height="100"
            style="vertical-align: middle; margin-right: 10px;"
          />
          <br/>
          <a
            style=" font-size: 24px;"
            class="about-primary"
            href="https://francisco-tovar.github.io/PORTAFOLIO/index.html"
            target="_blank"
            rel="noopener"
          >
          
            My portfolio
          </a>
          <br/>
          <br/>
          <img
            src="./assets/github.png"
            alt="Portfolio"
            width="100"
            height="100"
            style="vertical-align: middle; margin-right: 10px;"
          />
          <br/>
          <a
            style=" font-size: 24px;"
            class="about-secondary"
            href="https://github.com/Francisco-Tovar"
            target="_blank"
            rel="noopener"
          >
            Code on GitHub
          </a>
        </div>

      </div>
    </section>
  `;
  }

  function render() {
    if (state.route === "about") {
      renderAbout();
      return;
    }
    renderGamesView();
  }

  function openModal(gameId) {
    const g = games.find((x) => x.id === gameId);
    if (!g) return;

    modalBadge.textContent = safeText(g.featured ? "featured" : "game");
    modalTitle.textContent = safeText(g.title);
    modalDesc.textContent = safeText(g.description);

    modalPlay.href = safeText(g.url);

    const firstStore =
      Array.isArray(g.stores) && g.stores.length ? g.stores[0] : null;
    if (firstStore && firstStore.url) {
      modalSource.href = safeText(firstStore.url);
      modalSource.textContent = safeText(firstStore.label);
      modalSource.style.display = "";
    } else {
      modalSource.style.display = "none";
    }

    modalMeta.innerHTML = [
      g.platform ? `<span class="chip2">${safeText(g.platform)}</span>` : "",
      g.playtime
        ? `<span class="chip2">Playtime: ${safeText(g.playtime)}</span>`
        : "",
      g.created
        ? `<span class="chip2">Created: ${safeText(g.created)}</span>`
        : "",
      Array.isArray(g.tags) && g.tags.length
        ? `<span class="chip2">Tags: ${g.tags.map(safeText).join(", ")}</span>`
        : "",
    ]
      .filter(Boolean)
      .join("");

    modalCopy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(safeText(g.url));
        modalCopy.textContent = "Copied";
        setTimeout(() => (modalCopy.textContent = "Copy link"), 900);
      } catch {
        modalCopy.textContent = "Copy failed";
        setTimeout(() => (modalCopy.textContent = "Copy link"), 900);
      }
    };

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      window.open(g.url, "_blank", "noopener");
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeGlyph.textContent = "◑";
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeGlyph.textContent = "◐";
    }
    localStorage.setItem("thovarisk_theme", theme);
  }

  function toggleTheme() {
    const cur =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    applyTheme(cur === "dark" ? "light" : "dark");
  }

  // Events
  window.addEventListener("hashchange", () => {
    state.route = routeFromHash();
    render();
  });

  document.addEventListener("click", (e) => {
    const el =
      e.target && e.target.closest ? e.target.closest("[data-more]") : null;
    if (!el) return;
    openModal(el.getAttribute("data-more"));
  });

  searchInput.addEventListener("input", () => {
    state.q = searchInput.value || "";
    if (state.route !== "games") {
      location.hash = "#/games";
      return;
    }
    render();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    if (state.route !== "games") {
      location.hash = "#/games";
      return;
    }
    render();
  });

  themeBtn.addEventListener("click", toggleTheme);

  // Boot
  const savedTheme = localStorage.getItem("thovarisk_theme");
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  state.route = routeFromHash();
  render();
})();
