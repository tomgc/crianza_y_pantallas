/* ─────────────────────────────────────────────────────────────
   Crianza y pantallas — Motor de la app
   Render desde window.__DATA__ (claims, metadata, bibliografia,
   andamiaje). Sin dependencias. Estilo: módulo IIFE con render
   por strings y delegación de eventos.
   ───────────────────────────────────────────────────────────── */
(() => {
  "use strict";

  // ── DATA ────────────────────────────────────────────────────
  const D = window.__DATA__ || {};
  const claims     = D.claims     || {};
  const metadata   = D.metadata   || {};
  const biblio     = D.bibliografia || [];
  const andamiaje  = (D.andamiaje && D.andamiaje.cascadas) || [];

  const ages = metadata.ageGroups || [];
  const dims = metadata.dimensions || [];
  const certaintyLabels = metadata.certaintyLabels || { high: "Alta", medium: "Media", low: "Baja" };
  const biblioTypes  = metadata.biblioTypes  || {};
  const biblioGroups = metadata.biblioGroups || [];
  const filterTypes  = metadata.filterTypes  || [{ id: "all", label: "Todas" }];
  const methodology  = metadata.methodology  || { title: "Método", sections: [] };
  const limitations  = metadata.limitations  || { title: "Limitaciones", sections: [] };

  // Index rápido de bibliografía por id
  const biblioById = Object.fromEntries(biblio.map(b => [b.id, b]));

  // ── STATE ───────────────────────────────────────────────────
  const state = {
    view: "matriz",              // matriz | bibliografia | metodologia | limitaciones
    activeCell: null,            // cellId actual mostrado en ficha (null = sin selección)
    selectedAge: "all",          // ageId | "all"
    biblioFilter: "all",         // filterTypes id
    biblioSearch: ""
  };

  // ── UTILS ───────────────────────────────────────────────────
  const escapeHtml = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  // Formato simple para texto de claims: **negrita** y *itálica*
  function fmt(text) {
    if (text == null) return "";
    let s = escapeHtml(text);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:)!?]|$)/g, "$1<em>$2</em>");
    s = s.replace(/\n/g, "<br>");
    return s;
  }

  const certLetter = (c) => c === "high" ? "h" : c === "medium" ? "m" : "l";

  // ── MOUNT ───────────────────────────────────────────────────
  const root = document.getElementById("app");
  if (!root) return;

  function mount() {
    root.innerHTML = `
      ${renderTopBar()}
      <div id="view-container" style="flex:1; min-height:0; display:flex; flex-direction:column;">
        ${renderCurrentView()}
      </div>
    `;
    bindGlobalEvents();
  }

  function rerenderView() {
    const container = document.getElementById("view-container");
    if (container) container.innerHTML = renderCurrentView();
    syncTopBarActive();
  }

  function renderCurrentView() {
    switch (state.view) {
      case "bibliografia": return renderBibliografia();
      case "glosario":     return renderGlosario();
      case "metodologia":  return renderMetodologia();
      case "limitaciones": return renderLimitaciones();
      case "matriz":
      default:             return renderMatrizView();
    }
  }

  // ── TOP BAR ─────────────────────────────────────────────────
  function renderTopBar() {
    const tabs = [
      { id: "matriz",       label: "Matriz" },
      { id: "bibliografia", label: "Bibliografía" },
      { id: "glosario",     label: "Glosario" },
      { id: "metodologia",  label: "Metodología" },
      { id: "limitaciones", label: "Limitaciones" }
    ];

    const ageOptions = [
      `<option value="all">Todos los tramos</option>`,
      ...ages.map(a => `<option value="${a.id}">${escapeHtml(a.label)} · ${escapeHtml(a.range)}</option>`)
    ].join("");

    return `
      <div class="topbar">
        <div class="topbar-left">
          <div class="brand">
            Crianza y pantallas <span class="brand-sub">· matriz de evidencia</span>
          </div>
          <nav class="tabs" id="tabs">
            ${tabs.map(t => `
              <button class="tab ${t.id === state.view ? "active" : ""}" data-tab="${t.id}">${t.label}</button>
            `).join("")}
          </nav>
        </div>
        <div class="topbar-right">
          ${state.view === "matriz" ? `
            <label class="eyebrow" for="age-sel">Tramo</label>
            <select id="age-sel" class="select">${ageOptions}</select>
          ` : ""}
          <span class="legend">
            <span class="cdot high"></span>alta
            <span class="cdot medium"></span>media
            <span class="cdot low"></span>baja
          </span>
        </div>
      </div>
    `;
  }

  function syncTopBarActive() {
    // Re-render del topbar entero para refrescar tabs + visibilidad de selector
    const topbar = root.querySelector(".topbar");
    if (!topbar) return;
    topbar.outerHTML = renderTopBar();
    // El selector se recrea: restaurar valor
    const sel = document.getElementById("age-sel");
    if (sel) sel.value = state.selectedAge;
  }

  // ── VISTA: MATRIZ ───────────────────────────────────────────
  function renderMatrizView() {
    return `
      <div class="matriz-body">
        <div class="matriz-pane">
          ${renderMatrizHelp()}
          ${renderMatriz()}
        </div>
        <aside class="ficha-pane" id="ficha-pane">
          ${renderFicha(state.activeCell)}
        </aside>
      </div>
    `;
  }

  function renderMatrizHelp() {
    const ageSel = state.selectedAge;
    const ageLabel = ageSel === "all" ? null : (ages.find(a => a.id === ageSel) || {}).label;
    return `
      <div class="matriz-help">
        10 dimensiones × 5 tramos etarios — clic en cualquier celda carga su ficha a la derecha.
        ${ageLabel ? `Mostrando <b>${escapeHtml(ageLabel)}</b>; otras edades atenuadas como contexto.` : ""}
      </div>
    `;
  }

  function renderMatriz() {
    const ageSel = state.selectedAge;
    const cols = ["120px", ...ages.map(() => "1fr")].join(" ");

    let html = `<div class="matriz-grid" style="grid-template-columns:${cols};">`;
    // Esquina superior izquierda
    html += `<div class="grid-cell col-head"></div>`;
    // Headers de tramos
    ages.forEach(a => {
      const dimmed = ageSel !== "all" && ageSel !== a.id;
      const focused = ageSel === a.id;
      const cls = ["grid-cell", "col-head", dimmed ? "dimmed" : "", focused ? "focused" : ""].filter(Boolean).join(" ");
      html += `
        <div class="${cls}">
          <div class="head-label">${escapeHtml(a.label)}</div>
          <div class="head-range">${escapeHtml(a.range)}</div>
        </div>`;
    });

    const paperCountByDim = {};
    dims.forEach(d => {
      const refs = new Set();
      ages.forEach(a => {
        const cell = claims[`${d.id}-${a.id}`];
        if (cell) (cell.claims || []).forEach(c => (c.refs || []).forEach(r => refs.add(r)));
      });
      paperCountByDim[d.id] = refs.size;
    });

    // Filas: dimension + 5 celdas
    dims.forEach(d => {
      const pc = paperCountByDim[d.id];
      html += `<div class="grid-cell row-head"><span>${escapeHtml(d.label)}</span>${pc > 0 ? `<span class="dim-paper-count">(${pc} ${pc === 1 ? "referencia" : "referencias"})</span>` : ""}</div>`;
      ages.forEach(a => {
        const cid = `${d.id}-${a.id}`;
        const cell = claims[cid];
        const dimmed = ageSel !== "all" && ageSel !== a.id;
        const isActive = cid === state.activeCell;
        const cls = ["grid-cell", "data-cell", dimmed ? "dimmed" : "", isActive ? "active" : ""].filter(Boolean).join(" ");

        if (!cell) {
          html += `<div class="${cls}" data-cellid="${cid}"><div class="cell-empty">—</div></div>`;
          return;
        }

        const dot = certLetter(cell.certainty);
        const hasChile = !!cell.chile_note;
        const summary = cell.summary || "";

        html += `
          <div class="${cls}" data-cellid="${cid}">
            <div class="cell-head">
              <span class="mini-dot ${dot}"></span>
              ${hasChile ? `<span class="cl-mark" title="Tiene nota de contexto chileno">CL</span>` : ""}
            </div>
            <div class="cell-summary">${escapeHtml(summary)}</div>
          </div>`;
      });
    });

    html += `</div>`;
    return html;
  }

  // ── FICHA DE CELDA ──────────────────────────────────────────
  function renderFicha(cellId) {
    if (!cellId || !claims[cellId]) {
      return `
        <div class="ficha-empty">
          <div class="eyebrow">Ficha activa</div>
          <div class="ficha-empty-msg">
            Haz clic en cualquier celda de la matriz para abrir su ficha de evidencia.
          </div>
        </div>
      `;
    }
    const cell = claims[cellId];
    const { dimId, ageId } = splitCellId(cellId);
    const dim = dims.find(d => d.id === dimId) || { label: dimId };
    const age = ages.find(a => a.id === ageId) || { label: ageId, range: "" };
    const cert = cell.certainty || "low";
    const certLab = certaintyLabels[cert] || cert;

    return `
      <div class="ficha">
        <div class="eyebrow">Ficha activa</div>

        <div class="ficha-chips">
          <span class="age-chip">${escapeHtml(dim.label)}</span>
          <span class="age-chip">${escapeHtml(age.label)} · ${escapeHtml(age.range)}</span>
          <span class="ficha-cert">
            <span class="cdot ${cert}"></span>certeza ${escapeHtml(certLab.toLowerCase())}
          </span>
        </div>

        <h2 class="ficha-title">${escapeHtml(cell.summary || "")}</h2>

        ${cell.intro ? `<p class="ficha-intro">${fmt(cell.intro)}</p>` : ""}

        ${renderFichaClaims(cell.claims || [])}

        ${cell.definitions ? renderFichaDefinitions(cell.definitions) : ""}

        ${cell.chile_note ? `
          <div class="chile-block">
            <div class="chile-label"><span class="cl-mark">CL</span>Contexto chileno</div>
            <div class="chile-body">${fmt(cell.chile_note)}</div>
          </div>
        ` : ""}

        ${cell.andamiaje ? renderFichaAndamiaje(cell.andamiaje) : ""}
      </div>
    `;
  }

  function renderFichaClaims(arr) {
    if (!arr.length) return "";
    return `
      <div class="ficha-evidence">
        <div class="eyebrow">Evidencia (${arr.length})</div>
        <div class="evidence-list">
          ${arr.map(c => {
            const cert = c.certainty || "low";
            const refs = (c.refs || []).map(r => renderRefChip(r)).join("");
            return `
              <div class="evidence-item">
                <span class="cdot ${cert}"></span>
                <span class="evidence-text">${fmt(c.text)}${refs}</span>
              </div>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderFichaDefinitions(defs) {
    // defs es array de {term, body} (estructura real en claims.json)
    let items = [];
    if (Array.isArray(defs)) {
      items = defs.map(d => ({
        term: d.term,
        body: d.body || d.definition || d.text || ""
      }));
    } else if (defs && typeof defs === "object") {
      items = Object.entries(defs).map(([term, body]) => ({ term, body }));
    }
    if (!items.length) return "";
    return `
      <div class="ficha-defs">
        <div class="eyebrow">Definiciones</div>
        <dl>
          ${items.map(d => `
            <dt>${escapeHtml(d.term)}</dt>
            <dd>${fmt(d.body)}</dd>
          `).join("")}
        </dl>
      </div>
    `;
  }

  function renderFichaAndamiaje(and) {
    // Estructura real: {upstream: [{to, certainty, text}], downstream: [{to, certainty, text}]}
    if (!and || typeof and !== "object") return "";
    const up = Array.isArray(and.upstream)   ? and.upstream   : [];
    const down = Array.isArray(and.downstream) ? and.downstream : [];
    if (!up.length && !down.length) return "";

    const renderArrow = (items, arrow, label) => {
      if (!items.length) return "";
      return `
        <div class="and-direction">
          <div class="and-direction-label"><span class="and-arrow">${arrow}</span> ${escapeHtml(label)}</div>
          <ul class="and-list">
            ${items.map(it => `
              <li class="and-item">
                <span class="cdot ${it.certainty || "low"}"></span>
                ${linkToCell(it.to)}
                ${it.text ? `<span class="and-text">— ${escapeHtml(it.text)}</span>` : ""}
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    };

    return `
      <div class="ficha-and">
        <div class="eyebrow">Andamiaje del desarrollo</div>
        ${renderArrow(up,   "↑", "Se apoya en")}
        ${renderArrow(down, "↓", "Alimenta a")}
      </div>
    `;
  }

  function linkToCell(cid) {
    if (typeof cid !== "string") return "";
    const { dimId, ageId } = splitCellId(cid);
    const dim = dims.find(d => d.id === dimId);
    const age = ages.find(a => a.id === ageId);
    if (!dim || !age) return escapeHtml(cid);
    return `<a href="#" class="cell-link" data-cellid="${cid}">${escapeHtml(dim.label)} · ${escapeHtml(age.label)}</a>`;
  }

  function renderRefChip(refId) {
    const b = biblioById[refId];
    if (!b) return `<span class="ref ref-missing" title="Referencia no encontrada: ${escapeHtml(refId)}">?</span>`;
    // Etiqueta corta: primer autor + año
    const label = shortLabel(b);
    return `<span class="ref" data-refid="${escapeHtml(refId)}" title="${escapeHtml(label)}">${escapeHtml(label)}</span>`;
  }

  function shortLabel(b) {
    if (!b) return "?";
    const authors = b.authors || "";
    // Año: último match de 4 dígitos en authors o journal
    const yearMatches = (authors.match(/\b(19|20)\d{2}\b/g) || []);
    const year = yearMatches.length
      ? yearMatches[yearMatches.length - 1]
      : ((b.journal || "").match(/\b(19|20)\d{2}\b/) || [""])[0];

    // Primer apellido: tomar lo anterior a la primera inicial o coma
    // Patrones típicos: "Apellido X.Y., Otro...", "Apellido X. y col. 2024",
    // "Early Years Screen Time Advisory Group (EYSTAG). 2026"
    let primary = authors.split(/\s\d{4}\b/)[0]; // descartar año al final
    // Cortar en el primer ", " (coautor) o en " y col" o en " et al"
    primary = primary.split(/, | y col| et al/i)[0].trim();
    // Si tiene inicial al final como "Apellido X." o "Apellido X.Y.", dejarla
    primary = primary.replace(/\s*$/, "");
    if (!primary) primary = b.id;

    // Si hay más de un autor, agregar "et al."
    const multipleAuthors = /,| y col| et al/i.test(authors);
    const etAl = multipleAuthors ? " et al." : "";

    return year ? `${primary}${etAl} ${year}` : `${primary}${etAl}`;
  }

  function splitCellId(cid) {
    // Soporta ages compuestos (primera-infancia, ninez-media, salud-mental, etc.)
    for (const a of ages) {
      const suffix = "-" + a.id;
      if (cid.endsWith(suffix)) {
        return { dimId: cid.slice(0, -suffix.length), ageId: a.id };
      }
    }
    const i = cid.lastIndexOf("-");
    return { dimId: cid.slice(0, i), ageId: cid.slice(i + 1) };
  }

  // ── VISTA: BIBLIOGRAFÍA ─────────────────────────────────────
  function renderGlosario() {
    const sections = [
      {
        title: "Conceptos del campo",
        subtitle: "Los términos propios de la investigación sobre pantallas en la infancia.",
        terms: [
          { term: "Technoference",            def: "Interferencia del uso de dispositivos del cuidador en la interacción cara a cara con el niño.",                                                                                        url: "https://en.wikipedia.org/wiki/Technoference" },
          { term: "Video deficit",             def: "Los niños menores de 3 años aprenden significativamente menos de un contenido en pantalla que de la misma información presentada en persona.",                                          url: "https://en.wikipedia.org/wiki/Video_deficit_effect" },
          { term: "TV de fondo",               def: "Televisión encendida en el hogar sin ser el foco de atención del niño; reduce la cantidad y calidad del habla dirigida.",                                                              url: "https://en.wikipedia.org/wiki/Background_television" },
          { term: "Fast-paced content",        def: "Contenido con cambios visuales y auditivos muy rápidos; se asocia con menor capacidad atencional inmediata en preescolares.",                                                          url: "https://en.wikipedia.org/wiki/Attention_span" },
          { term: "Co-visionado contingente",  def: "Ver pantallas junto al niño con interacción activa y responsiva del adulto; mitiga los efectos negativos del contenido pasivo.",                                                       url: "https://es.wikipedia.org/wiki/Mediaci%C3%B3n_parental_de_medios" },
          { term: "Corregulación",             def: "Proceso por el cual el cuidador ayuda al niño a manejar sus emociones antes de que pueda autorregularse solo.",                                                                       url: "https://es.wikipedia.org/wiki/Autorregulaci%C3%B3n_emocional" },
          { term: "PDER · regulación emocional con pantalla", def: "Parental Digital Emotion Regulation: uso del dispositivo por parte del cuidador para calmar o distraer al niño ante emociones difíciles.",                            url: "https://doi.org/10.1016/j.chb.2021.106866" },
          { term: "Las 5 Cs (AAP 2026)",       def: "Marco de la Academia Americana de Pediatría: Child, Content, Context, Caregiver y Crown (tiempo). Sustituye la regla de tiempo por criterios cualitativos.",                          url: "https://publications.aap.org/pediatrics/article/157/1/e2025071223/" },
          { term: "Tiempo de pantalla recreativa", def: "Uso de dispositivos con fines de entretenimiento, sin mediación adulta ni propósito educativo explícito.",                                                                        url: "https://es.wikipedia.org/wiki/Tiempo_de_pantalla" },
        ]
      },
      {
        title: "Para leer la evidencia",
        subtitle: "Cómo se produce y se pondera la evidencia científica en este campo.",
        terms: [
          { term: "Certeza de la evidencia: alta / media / baja", def: "Clasificación de este sitio: alta = meta-análisis o cohortes grandes replicadas; media = longitudinales con limitaciones; baja = transversales pequeños o preliminares.", url: "https://es.wikipedia.org/wiki/Medicina_basada_en_evidencia" },
          { term: "Meta-análisis",             def: "Método estadístico que combina los resultados de múltiples estudios independientes para estimar un efecto global con mayor precisión.",                                                  url: "https://es.wikipedia.org/wiki/Metaan%C3%A1lisis" },
          { term: "Cohorte longitudinal",      def: "Diseño que sigue a un grupo de personas durante años para observar cómo cambian ciertas variables en el tiempo.",                                                                      url: "https://es.wikipedia.org/wiki/Estudio_de_cohorte" },
          { term: "Estudio transversal",       def: "Diseño que mide variables en una población en un momento único; no permite establecer causalidad.",                                                                                    url: "https://es.wikipedia.org/wiki/Estudio_transversal" },
        ]
      },
      {
        title: "Desarrollo infantil",
        subtitle: "El sustrato del desarrollo humano sobre el que actúan las pantallas.",
        terms: [
          { term: "Función ejecutiva",         def: "Procesos mentales que permiten planificar, inhibir impulsos, sostener atención y cambiar de tarea.",                                                                                   url: "https://es.wikipedia.org/wiki/Funci%C3%B3n_ejecutiva" },
          { term: "Apego seguro",              def: "Vínculo estable entre el niño y su cuidador, caracterizado por confianza y disponibilidad emocional.",                                                                                 url: "https://es.wikipedia.org/wiki/Teor%C3%ADa_del_apego" },
          { term: "Ritmo circadiano",          def: "Ciclo biológico de ~24 horas que regula el sueño y la vigilia; sensible a la luz de pantallas en horas nocturnas.",                                                                   url: "https://es.wikipedia.org/wiki/Ritmo_circadiano" },
          { term: "Conciencia fonológica",     def: "Capacidad de identificar y manipular los sonidos del lenguaje oral; predictor clave del aprendizaje lector.",                                                                          url: "https://es.wikipedia.org/wiki/Conciencia_fonol%C3%B3gica" },
          { term: "Pensamiento divergente",    def: "Capacidad de generar múltiples soluciones ante un problema; componente central de la creatividad.",                                                                                    url: "https://es.wikipedia.org/wiki/Pensamiento_divergente" },
          { term: "Andamiaje del desarrollo",  def: "Relación de dependencia entre habilidades: algunas capacidades tempranas son prerequisito de otras posteriores.",                                                                     url: "https://es.wikipedia.org/wiki/Zona_de_desarrollo_pr%C3%B3ximo" },
          { term: "Miopía",                    def: "Trastorno refractivo en que los objetos lejanos se ven borrosos; su prevalencia ha aumentado globalmente, con evidencia que la asocia más al tiempo en interiores que a la pantalla en sí.", url: "https://es.wikipedia.org/wiki/Miop%C3%ADa" },
          { term: "Sedentarismo",              def: "Comportamiento de bajo gasto energético en posición sentada; el tiempo de pantalla es uno de sus principales correlatos en niños.",                                                    url: "https://es.wikipedia.org/wiki/Sedentarismo" },
          { term: "Retraso del desarrollo",    def: "Alteración en el ritmo o la secuencia del desarrollo esperado para la edad; puede afectar lenguaje, motricidad, cognición o área socioemocional.",                                    url: "https://es.wikipedia.org/wiki/Trastorno_del_desarrollo" },
        ]
      },
    ];

    const html = sections.map(s => `
      <div class="glosario-section">
        <h2 class="glosario-section-title">${escapeHtml(s.title)}</h2>
        <p class="glosario-section-sub">${escapeHtml(s.subtitle)}</p>
        <dl class="glosario-list">
          ${s.terms.map(t => `
            <div class="glosario-item">
              <dt class="glosario-term">
                ${escapeHtml(t.term)}
                <a class="glosario-link" href="${t.url}" target="_blank" rel="noopener">↗</a>
              </dt>
              <dd class="glosario-def">${escapeHtml(t.def)}</dd>
            </div>
          `).join("")}
        </dl>
      </div>
    `).join("");

    return `
      <div class="page-body">
        <h1 class="page-title">Glosario</h1>
        <p class="page-sub">Términos técnicos y conceptos clave usados en esta síntesis.</p>
        ${html}
      </div>`;
  }

  function renderBibliografia() {
    const q = state.biblioSearch.toLowerCase().trim();
    const f = state.biblioFilter;

    // Filtrado
    const filtered = biblio.filter(b => {
      if (f !== "all") {
        if (f === "featured" && !b.featured) return false;
        if (f !== "featured" && b.type !== f) return false;
      }
      if (q) {
        const hay = `${b.authors || ""} ${b.title || ""} ${b.journal || ""} ${b.id || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // Agrupar por biblioGroups (en orden declarado)
    const byGroup = {};
    filtered.forEach(b => {
      const g = b.group || "other";
      (byGroup[g] = byGroup[g] || []).push(b);
    });
    const orderedGroups = biblioGroups.filter(g => byGroup[g.id] && byGroup[g.id].length);

    return `
      <div class="page-pane">
        <div class="page-head">
          <h1 class="page-title">Bibliografía</h1>
          <div class="page-sub">${filtered.length} de ${biblio.length} entradas</div>
        </div>

        <div class="biblio-controls">
          <div class="biblio-filters">
            ${filterTypes.map(f => `
              <button class="chip-filter ${f.id === state.biblioFilter ? "active" : ""}" data-filter="${f.id}">
                ${escapeHtml(f.label)}
              </button>
            `).join("")}
          </div>
          <input type="search" id="biblio-search" class="search-input"
                 placeholder="Buscar por autor, título o revista…"
                 value="${escapeHtml(state.biblioSearch)}">
        </div>

        <div class="biblio-body">
          ${orderedGroups.length === 0
            ? `<div class="empty-state">No hay entradas que coincidan con el filtro.</div>`
            : orderedGroups.map(g => renderBiblioGroup(g, byGroup[g.id])).join("")
          }
        </div>
      </div>
    `;
  }

  function renderBiblioGroup(group, entries) {
    return `
      <section class="biblio-group">
        <h2 class="biblio-group-title">${escapeHtml(group.label)}</h2>
        <ul class="biblio-list">
          ${entries.map(renderBiblioEntry).join("")}
        </ul>
      </section>
    `;
  }

  function renderBiblioEntry(b) {
    const t = biblioTypes[b.type] || { label: b.type || "", cls: "" };
    const featured = b.featured ? `<span class="biblio-featured">★ destacada</span>` : "";
    const url = b.url ? `<a class="biblio-link" href="${escapeHtml(b.url)}" target="_blank" rel="noopener">↗ enlace</a>` : "";
    return `
      <li class="biblio-entry" id="ref-${escapeHtml(b.id)}">
        <div class="biblio-meta">
          <span class="biblio-type ${t.cls}">${escapeHtml(t.label)}</span>
          ${featured}
        </div>
        <div class="biblio-authors">${escapeHtml(b.authors || "")}</div>
        <div class="biblio-title">${escapeHtml(b.title || "")}</div>
        ${b.journal ? `<div class="biblio-journal">${escapeHtml(b.journal)}</div>` : ""}
        ${url}
      </li>
    `;
  }

  // ── VISTA: METODOLOGÍA Y LIMITACIONES ───────────────────────
  function renderMetodologia() { return renderTextPage(methodology); }
  function renderLimitaciones() { return renderTextPage(limitations); }

  function renderTextPage(page) {
    return `
      <div class="page-pane">
        <div class="page-head">
          <h1 class="page-title">${escapeHtml(page.title || "")}</h1>
          ${page.subtitle ? `<div class="page-sub">${escapeHtml(page.subtitle)}</div>` : ""}
        </div>
        <div class="text-body">
          ${(page.sections || []).map(renderTextSection).join("")}
        </div>
      </div>
    `;
  }

  function renderTextSection(sec) {
    return `
      <section class="text-section">
        <h2 class="text-section-title">${escapeHtml(sec.heading || "")}</h2>
        ${sec.content ? `<div class="text-section-content">${fmt(sec.content)}</div>` : ""}
        ${(sec.bullets && sec.bullets.length)
          ? `<ul class="text-section-bullets">${sec.bullets.map(b => `<li>${fmt(b)}</li>`).join("")}</ul>`
          : ""
        }
      </section>
    `;
  }

  // ── POPOVER DE REFERENCIA ───────────────────────────────────
  function showRefPopover(refId, anchorEl) {
    closePopover();
    const b = biblioById[refId];
    if (!b) return;
    const pop = document.createElement("div");
    pop.className = "popover ref-popover";
    pop.innerHTML = `
      <div class="eyebrow">Referencia</div>
      <div class="ref-authors">${escapeHtml(b.authors || "")}</div>
      <div class="ref-title">${escapeHtml(b.title || "")}</div>
      ${b.journal ? `<div class="ref-journal">${escapeHtml(b.journal)}</div>` : ""}
      <a href="#" class="ref-jump" data-jump="${escapeHtml(b.id)}">↗ Ver en bibliografía</a>
    `;
    document.body.appendChild(pop);
    positionPopover(pop, anchorEl);
    pop.dataset.opened = "1";
  }

  function positionPopover(pop, anchor) {
    const r = anchor.getBoundingClientRect();
    const popW = 260;
    const pad = 8;
    let left = r.right + pad;
    if (left + popW > window.innerWidth - 8) {
      left = r.left - popW - pad;
    }
    if (left < 8) left = 8;
    let top = r.top + window.scrollY;
    pop.style.position = "absolute";
    pop.style.left = left + "px";
    pop.style.top = top + "px";
    pop.style.width = popW + "px";
  }

  function closePopover() {
    document.querySelectorAll(".ref-popover").forEach(el => el.remove());
  }

  // ── EVENTOS ─────────────────────────────────────────────────
  function bindGlobalEvents() {
    root.addEventListener("click", onRootClick);
    root.addEventListener("change", onRootChange);
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePopover();
    });
    // Search input se enlaza por delegación con "input" event
    root.addEventListener("input", onRootInput);
  }

  function onRootClick(e) {
    // Tab
    const tab = e.target.closest("[data-tab]");
    if (tab) {
      state.view = tab.dataset.tab;
      closePopover();
      rerenderView();
      return;
    }

    // Celda de matriz
    const cellEl = e.target.closest(".data-cell[data-cellid]");
    if (cellEl) {
      const cid = cellEl.dataset.cellid;
      if (claims[cid]) {
        state.activeCell = cid;
        // Re-render solo de la matriz (para active class) y de la ficha
        const matrizPane = root.querySelector(".matriz-pane");
        const fichaPane  = root.querySelector("#ficha-pane");
        if (matrizPane) matrizPane.innerHTML = renderMatrizHelp() + renderMatriz();
        if (fichaPane)  fichaPane.innerHTML  = renderFicha(state.activeCell);
      }
      return;
    }

    // Link a celda (desde andamiaje en ficha)
    const cellLink = e.target.closest(".cell-link[data-cellid]");
    if (cellLink) {
      e.preventDefault();
      const cid = cellLink.dataset.cellid;
      if (claims[cid]) {
        state.activeCell = cid;
        if (state.view !== "matriz") {
          state.view = "matriz";
          rerenderView();
        } else {
          const matrizPane = root.querySelector(".matriz-pane");
          const fichaPane  = root.querySelector("#ficha-pane");
          if (matrizPane) matrizPane.innerHTML = renderMatrizHelp() + renderMatriz();
          if (fichaPane)  fichaPane.innerHTML  = renderFicha(state.activeCell);
        }
      }
      return;
    }

    // Ref chip
    const refEl = e.target.closest(".ref[data-refid]");
    if (refEl) {
      e.preventDefault();
      e.stopPropagation();
      const id = refEl.dataset.refid;
      // Si ya hay popover abierto para esta ref, cerrar
      const open = document.querySelector(".ref-popover");
      if (open && open.dataset.refid === id) {
        closePopover();
      } else {
        showRefPopover(id, refEl);
        const pop = document.querySelector(".ref-popover");
        if (pop) pop.dataset.refid = id;
      }
      return;
    }

    // Filtro de bibliografía
    const filterBtn = e.target.closest("[data-filter]");
    if (filterBtn) {
      state.biblioFilter = filterBtn.dataset.filter;
      rerenderView();
      return;
    }

    // Salto desde popover a entrada de biblio
    const jumpEl = e.target.closest("[data-jump]");
    if (jumpEl) {
      e.preventDefault();
      const id = jumpEl.dataset.jump;
      closePopover();
      state.view = "bibliografia";
      state.biblioFilter = "all";
      state.biblioSearch = "";
      rerenderView();
      setTimeout(() => {
        const target = document.getElementById(`ref-${id}`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("biblio-highlight");
          setTimeout(() => target.classList.remove("biblio-highlight"), 1800);
        }
      }, 30);
    }
  }

  function onRootChange(e) {
    if (e.target.id === "age-sel") {
      state.selectedAge = e.target.value;
      const matrizPane = root.querySelector(".matriz-pane");
      if (matrizPane) matrizPane.innerHTML = renderMatrizHelp() + renderMatriz();
    }
  }

  function onRootInput(e) {
    if (e.target.id === "biblio-search") {
      state.biblioSearch = e.target.value;
      // Re-render solo del cuerpo de bibliografía (no del input para no perder foco)
      const body = root.querySelector(".biblio-body");
      if (!body) return;
      const q = state.biblioSearch.toLowerCase().trim();
      const f = state.biblioFilter;
      const filtered = biblio.filter(b => {
        if (f !== "all") {
          if (f === "featured" && !b.featured) return false;
          if (f !== "featured" && b.type !== f) return false;
        }
        if (q) {
          const hay = `${b.authors || ""} ${b.title || ""} ${b.journal || ""} ${b.id || ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      const byGroup = {};
      filtered.forEach(b => { (byGroup[b.group] = byGroup[b.group] || []).push(b); });
      const ordered = biblioGroups.filter(g => byGroup[g.id] && byGroup[g.id].length);
      body.innerHTML = ordered.length === 0
        ? `<div class="empty-state">No hay entradas que coincidan con la búsqueda.</div>`
        : ordered.map(g => renderBiblioGroup(g, byGroup[g.id])).join("");
      // Actualizar contador
      const sub = root.querySelector(".page-sub");
      if (sub) sub.textContent = `${filtered.length} de ${biblio.length} entradas`;
    }
  }

  function onDocClick(e) {
    // Cerrar popover si se hace click fuera
    if (e.target.closest(".ref-popover")) return;
    if (e.target.closest(".ref[data-refid]")) return;
    closePopover();
  }

  // ── INIT ────────────────────────────────────────────────────
  mount();
  // Restaurar valor del selector de tramo si la vista inicial es matriz
  const sel = document.getElementById("age-sel");
  if (sel) sel.value = state.selectedAge;
})();
