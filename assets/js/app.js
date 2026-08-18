import { categoriesData } from "./data/categories.js";
import { customData } from "./data/custom.js";
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

const BUNDLED_BY_CATEGORY = {
  windows: windowsData,
  linux: linuxData,
  redes: redesData,
  ciberseguridad: ciberseguridadData,
  compartir: compartirData,
  discos: discosData,
  servidores: servidoresData,
  ad: adData,
  router: routerSwitchData,
  herramientas: herramientasData
};

const CATEGORY_FILE_MAP = {
  windows: { path: "assets/js/data/windows.js", varName: "windowsData" },
  linux: { path: "assets/js/data/linux.js", varName: "linuxData" },
  redes: { path: "assets/js/data/redes.js", varName: "redesData" },
  ciberseguridad: { path: "assets/js/data/ciberseguridad.js", varName: "ciberseguridadData" },
  compartir: { path: "assets/js/data/compartir.js", varName: "compartirData" },
  discos: { path: "assets/js/data/discos.js", varName: "discosData" },
  servidores: { path: "assets/js/data/servidores.js", varName: "servidoresData" },
  ad: { path: "assets/js/data/active-directory.js", varName: "adData" },
  router: { path: "assets/js/data/router-switch.js", varName: "routerSwitchData" },
  herramientas: { path: "assets/js/data/herramientas.js", varName: "herramientasData" }
};

const BUILTIN_IDS = new Set(Object.keys(CATEGORY_FILE_MAP));

const CATEGORIES_FILE = { path: "assets/js/data/categories.js", varName: "categoriesData" };
const CUSTOM_FILE = { path: "assets/js/data/custom.js", varName: "customData" };
const CATEGORIES_DIRTY_KEY = "__categories__";
const CUSTOM_DIRTY_KEY = "__custom__";

const LS_PREFIX = "sysch:";
const LS_GITHUB_CONFIG = LS_PREFIX + "github";
const LS_CATEGORIES = LS_PREFIX + "categories";
const LS_SIDEBAR_WIDTH = LS_PREFIX + "sidebarWidth";
const LS_SIDEBAR_COLLAPSED = LS_PREFIX + "sidebarCollapsed";

const SIDEBAR_MIN_WIDTH = 170;
const SIDEBAR_MAX_WIDTH = 480;

const state = {
  query: "",
  activeCategory: "all"
};

const dirtySet = new Set(
  [...BUILTIN_IDS, CATEGORIES_DIRTY_KEY, CUSTOM_DIRTY_KEY].filter(
    (key) => localStorage.getItem(LS_PREFIX + "dirty:" + key) === "1"
  )
);

const haystackCache = new WeakMap();

/* ---------- utilidades de texto ---------- */

const DIACRITICS_RE = /[̀-ͯ]/g;

function normalize(str) {
  return (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_RE, "");
}

function slugify(str) {
  return normalize(str)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "entrada";
}

function escapeHtml(str) {
  return (str || "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

/* ---------- categorías (barra lateral) ---------- */

function getCategories() {
  const raw = localStorage.getItem(LS_CATEGORIES);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      /* falls through to default */
    }
  }
  return categoriesData.slice();
}

function setCategories(arr) {
  localStorage.setItem(LS_CATEGORIES, JSON.stringify(arr));
  markDirty(CATEGORIES_DIRTY_KEY);
}

function categoryLabel(id) {
  const c = getCategories().find((c) => c.id === id);
  return c ? c.label : id;
}

function categoryIcon(id) {
  const c = getCategories().find((c) => c.id === id);
  return c ? c.icon || "📁" : "📁";
}

function generateCategoryId(label) {
  const existingIds = new Set(getCategories().map((c) => c.id));
  const base = slugify(label);
  let candidate = base;
  let n = 2;
  while (existingIds.has(candidate)) {
    candidate = `${base}-${n}`;
    n++;
  }
  return candidate;
}

function addCategory({ label, icon }) {
  const cats = getCategories();
  cats.push({ id: generateCategoryId(label), label, icon: icon || "📁" });
  setCategories(cats);
}

function updateCategory(id, { label, icon }) {
  const cats = getCategories().map((c) =>
    c.id === id ? { ...c, label, icon: icon || "📁" } : c
  );
  setCategories(cats);
}

function reorderCategories(newOrderIds) {
  const cats = getCategories();
  const byId = new Map(cats.map((c) => [c.id, c]));
  const reordered = newOrderIds.map((id) => byId.get(id)).filter(Boolean);
  setCategories(reordered);
}

function deleteCategory(id) {
  setCategoryEntries(id, []); // borra en cascada las entradas de esa categoría
  const cats = getCategories().filter((c) => c.id !== id);
  setCategories(cats);
  if (state.activeCategory === id) state.activeCategory = "all";
}

/* ---------- persistencia local (localStorage) de entradas ---------- */

function overrideKey(catId) {
  return LS_PREFIX + "data:" + catId;
}

function loadOverride(key) {
  const raw = localStorage.getItem(overrideKey(key));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getCustomBucket() {
  return loadOverride("custom") || customData.slice();
}

function setCustomBucket(arr) {
  localStorage.setItem(overrideKey("custom"), JSON.stringify(arr));
  markDirty(CUSTOM_DIRTY_KEY);
}

function getCategoryEntries(catId) {
  if (BUILTIN_IDS.has(catId)) {
    const override = loadOverride(catId);
    if (override) return override;
    return (BUNDLED_BY_CATEGORY[catId] || []).slice();
  }
  return getCustomBucket().filter((e) => e.category === catId);
}

function setCategoryEntries(catId, arr) {
  if (BUILTIN_IDS.has(catId)) {
    localStorage.setItem(overrideKey(catId), JSON.stringify(arr));
    markDirty(catId);
  } else {
    const rest = getCustomBucket().filter((e) => e.category !== catId);
    setCustomBucket([...rest, ...arr]);
  }
}

function getAllEntries() {
  return getCategories().flatMap((c) => getCategoryEntries(c.id));
}

function markDirty(key) {
  dirtySet.add(key);
  localStorage.setItem(LS_PREFIX + "dirty:" + key, "1");
}

function clearDirty(key) {
  dirtySet.delete(key);
  localStorage.removeItem(LS_PREFIX + "dirty:" + key);
}

/* ---------- CRUD de entradas ---------- */

function compact(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out;
}

function generateId(category, title) {
  const existingIds = new Set(getAllEntries().map((e) => e.id));
  const base = slugify(category) + "-" + slugify(title);
  let candidate = base;
  let n = 2;
  while (existingIds.has(candidate)) {
    candidate = `${base}-${n}`;
    n++;
  }
  return candidate;
}

function addEntry(entry) {
  const arr = getCategoryEntries(entry.category);
  arr.push(entry);
  setCategoryEntries(entry.category, arr);
}

function updateEntry(originalCategory, entry) {
  if (originalCategory !== entry.category) {
    const oldArr = getCategoryEntries(originalCategory).filter((e) => e.id !== entry.id);
    setCategoryEntries(originalCategory, oldArr);
    const newArr = getCategoryEntries(entry.category);
    newArr.push(entry);
    setCategoryEntries(entry.category, newArr);
  } else {
    const arr = getCategoryEntries(entry.category).map((e) => (e.id === entry.id ? entry : e));
    setCategoryEntries(entry.category, arr);
  }
}

function deleteEntry(catId, id) {
  const arr = getCategoryEntries(catId).filter((e) => e.id !== id);
  setCategoryEntries(catId, arr);
}

function reorderCategoryEntries(catId, newOrderIds) {
  const arr = getCategoryEntries(catId);
  const byId = new Map(arr.map((e) => [e.id, e]));
  const reordered = newOrderIds.map((id) => byId.get(id)).filter(Boolean);
  setCategoryEntries(catId, reordered);
}

/* ---------- parseo del formulario (GUI / CLI en texto plano) ---------- */

function parseGuiText(text) {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function guiToText(guiArray) {
  return guiArray ? guiArray.join("\n") : "";
}

function parseCliText(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let current = null;
  let pendingCmd = null;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^##\s*/.test(line)) {
      current = { os: line.replace(/^##\s*/, "").trim(), commands: [] };
      blocks.push(current);
      pendingCmd = null;
    } else if (/^\$\s?/.test(line)) {
      if (!current) {
        current = { os: "General", commands: [] };
        blocks.push(current);
      }
      pendingCmd = { cmd: line.replace(/^\$\s?/, ""), explain: "" };
      current.commands.push(pendingCmd);
    } else if (/^>\s?/.test(line)) {
      if (pendingCmd) {
        const extra = line.replace(/^>\s?/, "");
        pendingCmd.explain = pendingCmd.explain ? pendingCmd.explain + " " + extra : extra;
      }
    }
  }
  return blocks
    .filter((b) => b.commands.length > 0)
    .map((b) => ({
      os: b.os,
      commands: b.commands.map((c) => compact(c))
    }));
}

function cliToText(cliArray) {
  if (!cliArray) return "";
  return cliArray
    .map((block) => {
      const lines = [`## ${block.os}`];
      for (const c of block.commands) {
        lines.push(`$ ${c.cmd}`);
        if (c.explain) lines.push(`> ${c.explain}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

function parseTagsText(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function tagsToText(tags) {
  return tags ? tags.join(", ") : "";
}

/* ---------- búsqueda ---------- */

function entryHaystack(entry) {
  if (haystackCache.has(entry)) return haystackCache.get(entry);
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
  const haystack = normalize(parts.join(" • "));
  haystackCache.set(entry, haystack);
  return haystack;
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
  return getAllEntries().filter(
    (e) => matchesCategory(e, state.activeCategory) && matchesQuery(e, q)
  );
}

function countByCategory(catId) {
  const q = normalize(state.query.trim());
  return getAllEntries().filter(
    (e) => matchesCategory(e, catId) && matchesQuery(e, q)
  ).length;
}

function highlight(text, q) {
  const safe = escapeHtml(text);
  if (!q) return safe;
  try {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
    return safe.replace(re, (m) => `<mark>${m}</mark>`);
  } catch {
    return safe;
  }
}

/* ---------- toasts ---------- */

function toast(message, kind = "info") {
  const el = document.createElement("div");
  el.className = `toast toast-${kind}`;
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 4200);
}

/* ---------- drag & drop genérico (reordenar filas) ---------- */

function enableRowDragReorder(container, rowSelector, idAttr, onDrop) {
  let dragging = null;
  container.querySelectorAll(rowSelector).forEach((row) => {
    row.addEventListener("dragstart", () => {
      dragging = row;
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      dragging = null;
    });
    row.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      if (!dragging || dragging === row) return;
      const rect = row.getBoundingClientRect();
      const before = ev.clientY - rect.top < rect.height / 2;
      row.parentNode.insertBefore(dragging, before ? row : row.nextSibling);
    });
    row.addEventListener("drop", (ev) => {
      ev.preventDefault();
      const newOrder = [...container.querySelectorAll(rowSelector)].map((r) => r.dataset[idAttr]);
      onDrop(newOrder);
    });
  });
}

/* ---------- render: barra lateral de categorías ---------- */

function renderSidebar() {
  const nav = document.getElementById("category-nav");
  const cats = getCategories();
  const totalCount = countByCategory("all");

  const rows = [
    `<div class="cat-row cat-row-all">
      <button class="cat-btn ${state.activeCategory === "all" ? "active" : ""}" data-cat="all">
        <span class="cat-icon">🔎</span><span class="cat-label">Todo</span><span class="cat-count">${totalCount}</span>
      </button>
    </div>`
  ];

  for (const cat of cats) {
    const count = countByCategory(cat.id);
    rows.push(`
      <div class="cat-row" draggable="true" data-cat-row-id="${cat.id}">
        <span class="drag-handle" title="Arrastrar para reordenar">⠿</span>
        <button class="cat-btn ${state.activeCategory === cat.id ? "active" : ""}" data-cat="${cat.id}">
          <span class="cat-icon">${escapeHtml(cat.icon || "📁")}</span><span class="cat-label">${escapeHtml(cat.label)}</span><span class="cat-count">${count}</span>
        </button>
        <div class="cat-admin-actions">
          <button class="icon-btn cat-edit-btn" data-cat-id="${cat.id}" title="Modificar categoría">✏️</button>
          <button class="icon-btn cat-delete-btn" data-cat-id="${cat.id}" title="Eliminar categoría">🗑️</button>
        </div>
      </div>
    `);
  }

  rows.push(`<button id="add-category-btn" class="btn-add-category">+ Añadir categoría</button>`);

  nav.innerHTML = rows.join("");

  nav.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.dataset.cat;
      render();
    });
  });

  nav.querySelectorAll(".cat-edit-btn").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const cat = getCategories().find((c) => c.id === btn.dataset.catId);
      if (cat) openCategoryModal(cat);
    });
  });

  nav.querySelectorAll(".cat-delete-btn").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const cat = getCategories().find((c) => c.id === btn.dataset.catId);
      if (!cat) return;
      const count = getCategoryEntries(cat.id).length;
      const warn = count > 0 ? ` Se eliminarán también sus ${count} entrada(s).` : "";
      if (confirm(`¿Eliminar la categoría "${cat.label}"?${warn}`)) {
        deleteCategory(cat.id);
        toast(`Categoría "${cat.label}" eliminada localmente. Pulsa "Guardar cambios" para subirlo a GitHub.`, "info");
        render();
      }
    });
  });

  document.getElementById("add-category-btn").addEventListener("click", () => openCategoryModal(null));

  enableRowDragReorder(nav, '.cat-row[data-cat-row-id]', "catRowId", (newOrder) => {
    reorderCategories(newOrder);
    render();
  });
}

/* ---------- render: tarjetas de entradas ---------- */

function renderCard(entry, q, reorderEnabled) {
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

  const dragHandle = reorderEnabled
    ? `<span class="drag-handle card-drag-handle" title="Arrastrar para reordenar">⠿</span>`
    : "";

  return `
    <article class="card" data-id="${entry.id}" data-category="${entry.category}" draggable="${reorderEnabled}">
      <div class="card-header">
        ${dragHandle}
        <button class="card-toggle">
          <div class="card-title-wrap">
            <span class="card-cat-pill">${escapeHtml(categoryIcon(entry.category))} ${categoryLabel(entry.category)}${entry.subcategory ? " · " + escapeHtml(entry.subcategory) : ""}</span>
            <h3 class="card-title">${highlight(entry.title, q)}</h3>
          </div>
          <span class="chevron">▾</span>
        </button>
        <div class="card-admin-actions">
          <button class="icon-btn edit-btn" data-id="${entry.id}" title="Modificar">✏️</button>
          <button class="icon-btn delete-btn" data-id="${entry.id}" title="Eliminar">🗑️</button>
        </div>
      </div>
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

function updateSaveButton() {
  const btn = document.getElementById("save-github-btn");
  const badge = document.getElementById("dirty-count");
  if (dirtySet.size > 0) {
    btn.hidden = false;
    badge.textContent = dirtySet.size;
  } else {
    btn.hidden = true;
  }
}

function updateAddButtonLabel() {
  const btn = document.getElementById("add-entry-btn");
  if (state.activeCategory === "all") {
    btn.textContent = "+ Añadir entrada";
  } else {
    btn.textContent = `+ Añadir en ${categoryLabel(state.activeCategory)}`;
  }
}

function render() {
  renderSidebar();
  updateAddButtonLabel();
  updateSaveButton();
  const results = getFiltered();
  const q = normalize(state.query.trim());
  const container = document.getElementById("results");
  const resultCount = document.getElementById("result-count");
  const reorderHint = document.getElementById("reorder-hint");
  const reorderEnabled = state.activeCategory !== "all" && !q;

  resultCount.textContent = `${results.length} resultado${results.length === 1 ? "" : "s"}`;
  reorderHint.textContent = reorderEnabled
    ? "Arrastra ⠿ para cambiar el orden"
    : "Selecciona una categoría concreta (sin buscar) para poder reordenar";

  if (results.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <p>No se ha encontrado nada para "<strong>${escapeHtml(state.query)}</strong>".</p>
      <p>Prueba con otro término, revisa la categoría seleccionada, o añade una entrada nueva.</p>
    </div>`;
    return;
  }

  container.innerHTML = results.map((e) => renderCard(e, q, reorderEnabled)).join("");

  container.querySelectorAll(".card-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.closest(".card").classList.toggle("open");
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

  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const entry = getAllEntries().find((e) => e.id === btn.dataset.id);
      if (entry) openEntryModal(entry);
    });
  });

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const entry = getAllEntries().find((e) => e.id === btn.dataset.id);
      if (!entry) return;
      if (confirm(`¿Eliminar la entrada "${entry.title}"? Esta acción no se puede deshacer localmente (pero puedes volver a añadirla).`)) {
        deleteEntry(entry.category, entry.id);
        toast(`Entrada "${entry.title}" eliminada localmente. Pulsa "Guardar cambios" para subirlo a GitHub.`, "info");
        render();
      }
    });
  });

  if (reorderEnabled) {
    enableRowDragReorder(container, '.card[draggable="true"]', "id", (newOrder) => {
      reorderCategoryEntries(state.activeCategory, newOrder);
      render();
    });
  }

  if (q) {
    container.querySelectorAll(".card").forEach((c) => c.classList.add("open"));
  }
}

/* ---------- modal de entrada (añadir/editar) ---------- */

function populateCategorySelect() {
  const select = document.getElementById("entry-category");
  select.innerHTML = getCategories()
    .map((c) => `<option value="${c.id}">${escapeHtml(c.icon || "📁")} ${escapeHtml(c.label)}</option>`)
    .join("");
}

function openEntryModal(existingEntry) {
  populateCategorySelect();
  const modal = document.getElementById("entry-modal");
  const title = document.getElementById("entry-modal-title");
  const idField = document.getElementById("entry-id");
  const originalCategoryField = document.getElementById("entry-original-category");
  const categoryField = document.getElementById("entry-category");
  const subcategoryField = document.getElementById("entry-subcategory");
  const titleField = document.getElementById("entry-title");
  const descriptionField = document.getElementById("entry-description");
  const tagsField = document.getElementById("entry-tags");
  const guiField = document.getElementById("entry-gui");
  const cliField = document.getElementById("entry-cli");
  const notesField = document.getElementById("entry-notes");

  if (existingEntry) {
    title.textContent = "Modificar entrada";
    idField.value = existingEntry.id;
    originalCategoryField.value = existingEntry.category;
    categoryField.value = existingEntry.category;
    subcategoryField.value = existingEntry.subcategory || "";
    titleField.value = existingEntry.title || "";
    descriptionField.value = existingEntry.description || "";
    tagsField.value = tagsToText(existingEntry.tags);
    guiField.value = guiToText(existingEntry.gui);
    cliField.value = cliToText(existingEntry.cli);
    notesField.value = existingEntry.notes || "";
  } else {
    const defaultCats = getCategories();
    title.textContent = "Nueva entrada";
    idField.value = "";
    originalCategoryField.value = "";
    categoryField.value = state.activeCategory !== "all" ? state.activeCategory : (defaultCats[0]?.id || "");
    subcategoryField.value = "";
    titleField.value = "";
    descriptionField.value = "";
    tagsField.value = "";
    guiField.value = "";
    cliField.value = "";
    notesField.value = "";
  }

  modal.showModal();
  titleField.focus();
}

function handleEntryFormSubmit(ev) {
  ev.preventDefault();
  const idField = document.getElementById("entry-id");
  const originalCategoryField = document.getElementById("entry-original-category");
  const category = document.getElementById("entry-category").value;
  const subcategory = document.getElementById("entry-subcategory").value.trim();
  const titleValue = document.getElementById("entry-title").value.trim();
  const description = document.getElementById("entry-description").value.trim();
  const tags = parseTagsText(document.getElementById("entry-tags").value);
  const gui = parseGuiText(document.getElementById("entry-gui").value);
  const cli = parseCliText(document.getElementById("entry-cli").value);
  const notes = document.getElementById("entry-notes").value.trim();

  if (!titleValue || !description || !category) {
    toast("Título, descripción y categoría son obligatorios.", "error");
    return;
  }

  const isEdit = Boolean(idField.value);
  const id = isEdit ? idField.value : generateId(category, titleValue);

  const entry = compact({
    id,
    title: titleValue,
    category,
    subcategory,
    tags,
    description,
    gui,
    cli,
    notes
  });

  if (isEdit) {
    updateEntry(originalCategoryField.value, entry);
    toast(`Entrada "${entry.title}" actualizada localmente. Pulsa "Guardar cambios" para subirlo a GitHub.`, "success");
  } else {
    addEntry(entry);
    toast(`Entrada "${entry.title}" añadida localmente. Pulsa "Guardar cambios" para subirlo a GitHub.`, "success");
  }

  document.getElementById("entry-modal").close();
  render();
}

/* ---------- modal de categoría (añadir/editar) ---------- */

function openCategoryModal(existingCategory) {
  const modal = document.getElementById("category-modal");
  const title = document.getElementById("category-modal-title");
  const idField = document.getElementById("category-id");
  const labelField = document.getElementById("category-label");
  const iconField = document.getElementById("category-icon");

  if (existingCategory) {
    title.textContent = "Modificar categoría";
    idField.value = existingCategory.id;
    labelField.value = existingCategory.label;
    iconField.value = existingCategory.icon || "";
  } else {
    title.textContent = "Nueva categoría";
    idField.value = "";
    labelField.value = "";
    iconField.value = "";
  }

  modal.showModal();
  labelField.focus();
}

function handleCategoryFormSubmit(ev) {
  ev.preventDefault();
  const idField = document.getElementById("category-id");
  const label = document.getElementById("category-label").value.trim();
  const icon = document.getElementById("category-icon").value.trim();

  if (!label) {
    toast("El nombre de la categoría es obligatorio.", "error");
    return;
  }

  const isEdit = Boolean(idField.value);
  if (isEdit) {
    updateCategory(idField.value, { label, icon });
    toast(`Categoría "${label}" actualizada localmente. Pulsa "Guardar cambios" para subirlo a GitHub.`, "success");
  } else {
    addCategory({ label, icon });
    toast(`Categoría "${label}" añadida localmente. Pulsa "Guardar cambios" para subirlo a GitHub.`, "success");
  }

  document.getElementById("category-modal").close();
  render();
}

/* ---------- ajustes / conexión con GitHub ---------- */

function getGithubConfig() {
  try {
    return JSON.parse(localStorage.getItem(LS_GITHUB_CONFIG) || "null");
  } catch {
    return null;
  }
}

function saveGithubConfig(cfg) {
  localStorage.setItem(LS_GITHUB_CONFIG, JSON.stringify(cfg));
}

function forgetGithubConfig() {
  localStorage.removeItem(LS_GITHUB_CONFIG);
}

function openGithubModal() {
  const modal = document.getElementById("github-modal");
  const cfg = getGithubConfig();
  document.getElementById("gh-owner").value = cfg?.owner || "melvinfranco99";
  document.getElementById("gh-repo").value = cfg?.repo || "sysadmin-cheatsheet";
  document.getElementById("gh-branch").value = cfg?.branch || "master";
  document.getElementById("gh-token").value = cfg?.token || "";
  modal.showModal();
}

function handleGithubFormSubmit(ev) {
  ev.preventDefault();
  const owner = document.getElementById("gh-owner").value.trim();
  const repo = document.getElementById("gh-repo").value.trim();
  const branch = document.getElementById("gh-branch").value.trim();
  const token = document.getElementById("gh-token").value.trim();
  if (!owner || !repo || !branch || !token) {
    toast("Rellena usuario, repositorio, rama y token.", "error");
    return;
  }
  saveGithubConfig({ owner, repo, branch, token });
  document.getElementById("github-modal").close();
  toast("Conexión con GitHub guardada en este navegador.", "success");
  updateGithubButtonLabel();
}

function updateGithubButtonLabel() {
  const btn = document.getElementById("github-settings-btn");
  const cfg = getGithubConfig();
  btn.textContent = cfg ? `✅ ${cfg.owner}/${cfg.repo}` : "🔌 GitHub";
}

/* ---------- guardado en GitHub (API de contenidos) ---------- */

function dirtyKeyLabel(key) {
  if (key === CATEGORIES_DIRTY_KEY) return "Categorías (barra lateral)";
  if (key === CUSTOM_DIRTY_KEY) return "Entradas de categorías personalizadas";
  return categoryLabel(key);
}

function fileInfoForKey(key) {
  if (key === CATEGORIES_DIRTY_KEY) return CATEGORIES_FILE;
  if (key === CUSTOM_DIRTY_KEY) return CUSTOM_FILE;
  return CATEGORY_FILE_MAP[key];
}

function contentForKey(key) {
  if (key === CATEGORIES_DIRTY_KEY) return getCategories();
  if (key === CUSTOM_DIRTY_KEY) return getCustomBucket();
  return getCategoryEntries(key);
}

async function pushKeyToGitHub(key, cfg) {
  const { path, varName } = fileInfoForKey(key);
  const data = contentForKey(key);
  const content = `export const ${varName} = ${JSON.stringify(data, null, 2)};\n`;

  const apiBase = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
  const headers = {
    Authorization: `token ${cfg.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  let sha;
  const getResp = await fetch(`${apiBase}?ref=${encodeURIComponent(cfg.branch)}`, { headers });
  if (getResp.ok) {
    const getJson = await getResp.json();
    sha = getJson.sha;
  } else if (getResp.status !== 404) {
    throw new Error(`No se pudo leer ${path} (HTTP ${getResp.status}). Revisa el token y los permisos.`);
  }

  const putResp = await fetch(apiBase, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Actualiza ${path} desde el editor web`,
      content: utf8ToBase64(content),
      sha,
      branch: cfg.branch
    })
  });

  if (!putResp.ok) {
    const errJson = await putResp.json().catch(() => ({}));
    throw new Error(`Error al guardar ${path} (HTTP ${putResp.status}): ${errJson.message || "sin detalle"}`);
  }

  clearDirty(key);
}

async function saveAllDirtyToGitHub() {
  const cfg = getGithubConfig();
  if (!cfg) {
    toast("Primero conecta tu cuenta de GitHub (botón 🔌 GitHub).", "error");
    openGithubModal();
    return;
  }
  if (dirtySet.size === 0) {
    toast("No hay cambios pendientes.", "info");
    return;
  }

  const btn = document.getElementById("save-github-btn");
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = "Guardando...";

  const pending = [...dirtySet];
  const errors = [];
  for (const key of pending) {
    try {
      await pushKeyToGitHub(key, cfg);
    } catch (err) {
      errors.push(`${dirtyKeyLabel(key)}: ${err.message}`);
    }
  }

  btn.disabled = false;
  btn.textContent = originalText;

  if (errors.length === 0) {
    toast("Cambios guardados en GitHub. La web publicada tardará ~1 minuto en actualizarse.", "success");
  } else {
    toast(`Algunos cambios no se pudieron guardar: ${errors.join(" · ")}`, "error");
  }
  render();
}

/* ---------- barra lateral: colapsar y redimensionar ---------- */

function initSidebarControls() {
  const layout = document.getElementById("layout");
  const sidebarWrap = document.getElementById("sidebar-wrap");
  const resizer = document.getElementById("sidebar-resizer");
  const toggleBtn = document.getElementById("sidebar-toggle");

  const savedWidth = parseInt(localStorage.getItem(LS_SIDEBAR_WIDTH), 10);
  if (!Number.isNaN(savedWidth)) {
    const clamped = Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, savedWidth));
    document.documentElement.style.setProperty("--sidebar-width", clamped + "px");
  }

  const collapsed = localStorage.getItem(LS_SIDEBAR_COLLAPSED) === "1";
  layout.classList.toggle("sidebar-collapsed", collapsed);
  toggleBtn.title = collapsed ? "Mostrar barra lateral" : "Ocultar barra lateral";

  toggleBtn.addEventListener("click", () => {
    const nowCollapsed = layout.classList.toggle("sidebar-collapsed");
    localStorage.setItem(LS_SIDEBAR_COLLAPSED, nowCollapsed ? "1" : "0");
    toggleBtn.title = nowCollapsed ? "Mostrar barra lateral" : "Ocultar barra lateral";
  });

  let resizing = false;

  resizer.addEventListener("mousedown", (ev) => {
    if (layout.classList.contains("sidebar-collapsed")) return;
    ev.preventDefault();
    resizing = true;
    sidebarWrap.classList.add("resizing");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  });

  window.addEventListener("mousemove", (ev) => {
    if (!resizing) return;
    const wrapRect = sidebarWrap.getBoundingClientRect();
    const newWidth = Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, ev.clientX - wrapRect.left));
    document.documentElement.style.setProperty("--sidebar-width", newWidth + "px");
  });

  window.addEventListener("mouseup", () => {
    if (!resizing) return;
    resizing = false;
    sidebarWrap.classList.remove("resizing");
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    const width = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width").trim();
    if (width) localStorage.setItem(LS_SIDEBAR_WIDTH, parseInt(width, 10));
  });
}

/* ---------- init ---------- */

function init() {
  updateGithubButtonLabel();
  initSidebarControls();

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

  document.getElementById("add-entry-btn").addEventListener("click", () => openEntryModal(null));
  document.getElementById("entry-form").addEventListener("submit", handleEntryFormSubmit);
  document.getElementById("entry-cancel").addEventListener("click", () => document.getElementById("entry-modal").close());

  document.getElementById("category-form").addEventListener("submit", handleCategoryFormSubmit);
  document.getElementById("category-cancel").addEventListener("click", () => document.getElementById("category-modal").close());

  document.getElementById("github-settings-btn").addEventListener("click", openGithubModal);
  document.getElementById("github-form").addEventListener("submit", handleGithubFormSubmit);
  document.getElementById("gh-cancel").addEventListener("click", () => document.getElementById("github-modal").close());
  document.getElementById("gh-forget").addEventListener("click", () => {
    forgetGithubConfig();
    document.getElementById("github-modal").close();
    updateGithubButtonLabel();
    toast("Token olvidado en este navegador.", "info");
  });

  document.getElementById("save-github-btn").addEventListener("click", saveAllDirtyToGitHub);

  render();
}

document.addEventListener("DOMContentLoaded", init);
