import { windowsData } from "./data/windows.js";
import { linuxData } from "./data/linux.js";
import { redesData } from "./data/redes.js";
import { ciberseguridadData } from "./data/ciberseguridad.js";
import { compartirData } from "./data/compartir.js";
import { discosData } from "./data/discos.js";
import { servidoresData } from "./data/servidores.js";
import { adData } from "./data/active-directory.js";
import { routerSwitchData } from "./data/router-switch.js";
import { herramientasData } from "./data/herramientas.js";

const CATEGORIES = [
  { id: "windows", label: "Windows", icon: "🪟" },
  { id: "linux", label: "Linux", icon: "🐧" },
  { id: "redes", label: "Redes y Wifi", icon: "📶" },
  { id: "ciberseguridad", label: "Ciberseguridad", icon: "🛡️" },
  { id: "compartir", label: "Compartir datos", icon: "🔗" },
  { id: "discos", label: "Discos y archivos", icon: "💾" },
  { id: "servidores", label: "Servidores", icon: "🖥️" },
  { id: "ad", label: "Active Directory", icon: "🏢" },
  { id: "router", label: "Router y Switch", icon: "🌐" },
  { id: "herramientas", label: "Herramientas (Pendrive)", icon: "🧰" }
];

const ALL_ENTRIES = [
  ...windowsData,
  ...linuxData,
  ...redesData,
  ...ciberseguridadData,
  ...compartirData,
  ...discosData,
  ...servidoresData,
  ...adData,
  ...routerSwitchData,
  ...herramientasData
];

const state = {
  query: "",
  activeCategory: "all"
};

const DIACRITICS_RE = /[̀-ͯ]/g;

function normalize(str) {
  return (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_RE, "");
}

function entryHaystack(entry) {
  if (entry._haystack) return entry._haystack;
  const parts = [
    entry.title,
    entry.description,
    entry.subcategory,
    entry.notes,
    ...(entry.tags || [])
  ];
  if (entry.gui) parts.push(...entry.gui);
  if (entry.cli) {
    for (const block of entry.cli) {
      parts.push(block.os);
      for (const c of block.commands || []) {
        parts.push(c.cmd, c.explain);
      }
    }
  }
  entry._haystack = normalize(parts.join(" • "));
  return entry._haystack;
}

function matchesQuery(entry, q) {
  if (!q) return true;
  return entryHaystack(entry).includes(q);
}

function matchesCategory(entry, cat) {
  return cat === "all" || entry.category === cat;
}

function getFiltered() {
  const q = normalize(state.query.trim());
  return ALL_ENTRIES.filter(
    (e) => matchesCategory(e, state.activeCategory) && matchesQuery(e, q)
  );
}

function countByCategory(catId) {
  const q = normalize(state.query.trim());
  return ALL_ENTRIES.filter(
    (e) => matchesCategory(e, catId) && matchesQuery(e, q)
  ).length;
}

function escapeHtml(str) {
  return (str || "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlight(text, q) {
  const safe = escapeHtml(text);
  if (!q) return safe;
  try {
    const normText = normalize(text || "");
    const idx = normText.indexOf(q);
    if (idx === -1) return safe;
    // Fallback simple highlight: wrap literal substring match case-insensitively.
    const re = new RegExp(
      q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "ig"
    );
    return safe.replace(re, (m) => `<mark>${m}</mark>`);
  } catch {
    return safe;
  }
}

function renderSidebar() {
  const nav = document.getElementById("category-nav");
  const totalCount = countByCategory("all");
  const items = [
    `<button class="cat-btn ${state.activeCategory === "all" ? "active" : ""}" data-cat="all">
      <span class="cat-icon">🔎</span><span class="cat-label">Todo</span><span class="cat-count">${totalCount}</span>
    </button>`
  ];
  for (const cat of CATEGORIES) {
    const count = countByCategory(cat.id);
    items.push(`
      <button class="cat-btn ${state.activeCategory === cat.id ? "active" : ""}" data-cat="${cat.id}">
        <span class="cat-icon">${cat.icon}</span><span class="cat-label">${cat.label}</span><span class="cat-count">${count}</span>
      </button>
    `);
  }
  nav.innerHTML = items.join("");
  nav.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.dataset.cat;
      render();
    });
  });
}

function categoryLabel(id) {
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? c.label : id;
}

function renderCard(entry, q) {
  const guiBlock = entry.gui
    ? `<div class="block block-gui">
         <h4>🖱️ Modo gráfico</h4>
         <ol>${entry.gui.map((s) => `<li>${highlight(s, q)}</li>`).join("")}</ol>
       </div>`
    : "";

  const cliBlock = entry.cli
    ? `<div class="block block-cli">
         <h4>⌨️ Modo consola</h4>
         ${entry.cli
           .map(
             (block) => `
           <div class="cli-os">
             <span class="cli-os-label">${escapeHtml(block.os)}</span>
             ${block.commands
               .map(
                 (c) => `
               <div class="cmd-row">
                 <pre class="cmd"><code>${highlight(c.cmd, q)}</code></pre>
                 <button class="copy-btn" data-copy="${escapeHtml(c.cmd)}" title="Copiar comando">Copiar</button>
                 ${c.explain ? `<p class="cmd-explain">${highlight(c.explain, q)}</p>` : ""}
               </div>`
               )
               .join("")}
           </div>`
           )
           .join("")}
       </div>`
    : "";

  const notesBlock = entry.notes
    ? `<div class="block block-notes"><h4>📌 Notas</h4><p>${highlight(entry.notes, q)}</p></div>`
    : "";

  const tagsBlock = entry.tags
    ? `<div class="tags">${entry.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`
    : "";

  return `
    <article class="card" data-id="${entry.id}">
      <button class="card-header">
        <div class="card-title-wrap">
          <span class="card-cat-pill">${categoryLabel(entry.category)}${entry.subcategory ? " · " + escapeHtml(entry.subcategory) : ""}</span>
          <h3 class="card-title">${highlight(entry.title, q)}</h3>
        </div>
        <span class="chevron">▾</span>
      </button>
      <div class="card-body">
        <p class="card-desc">${highlight(entry.description, q)}</p>
        ${guiBlock}
        ${cliBlock}
        ${notesBlock}
        ${tagsBlock}
      </div>
    </article>
  `;
}

function render() {
  renderSidebar();
  const results = getFiltered();
  const q = normalize(state.query.trim());
  const container = document.getElementById("results");
  const resultCount = document.getElementById("result-count");
  resultCount.textContent = `${results.length} resultado${results.length === 1 ? "" : "s"}`;

  if (results.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <p>No se ha encontrado nada para "<strong>${escapeHtml(state.query)}</strong>".</p>
      <p>Prueba con otro término, o revisa la categoría seleccionada.</p>
    </div>`;
    return;
  }

  container.innerHTML = results.map((e) => renderCard(e, q)).join("");

  container.querySelectorAll(".card-header").forEach((header) => {
    header.addEventListener("click", () => {
      header.closest(".card").classList.toggle("open");
    });
  });

  container.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = "¡Copiado!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1200);
      } catch {
        btn.textContent = "Error";
      }
    });
  });

  // Auto-open cards when there is an active search query, to show matches immediately.
  if (q) {
    container.querySelectorAll(".card").forEach((c) => c.classList.add("open"));
  }
}

function init() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });

  document.getElementById("clear-search").addEventListener("click", () => {
    state.query = "";
    searchInput.value = "";
    searchInput.focus();
    render();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  render();
}

document.addEventListener("DOMContentLoaded", init);
