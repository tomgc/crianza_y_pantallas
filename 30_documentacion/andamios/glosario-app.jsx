/* ───────────────────────────────────────────────────────────────
   GlosarioApp — índice + ficha
   Una sola arquitectura (lista a la izquierda, ficha a la derecha),
   tres modos de organizar el índice:
     · relevance — niveles curados por relevancia/novedad
     · alpha     — buscador + A–Z con filtro por tipo
     · matrix    — espejado en las 10 dimensiones de la matriz
   ─────────────────────────────────────────────────────────────── */
const { useState, useMemo } = React;

const G = window.GLOSARIO;

const CERT_LABEL = { h: "alta", m: "media", l: "baja" };

function MiniDot({ c }) {
  return <span className={`mini-dot ${c}`}></span>;
}

/* Chip: dónde aparece en la matriz (dimensión · tramo + certeza) */
function CellChip({ cell, onJump }) {
  const Tag = onJump ? "button" : "span";
  return (
    <Tag
      className={`gl-cell-chip${onJump ? " gl-cell-chip-btn" : ""}`}
      onClick={onJump ? () => onJump(cell.dim) : undefined}
      title={onJump ? `Ir a «${cell.dim}» en el índice` : undefined}
    >
      <MiniDot c={cell.cert} />
      <span className="gl-cell-dim">{cell.dim}</span>
      <span className="gl-cell-tramo">{G.TRAMOS[cell.tramo]}</span>
      {cell.chile && <span className="cl-mark" title="Tiene nota de contexto chileno">CL</span>}
    </Tag>
  );
}

/* Ficha del término seleccionado */
function Ficha({ term, onPick, onJump }) {
  if (!term) {
    return (
      <div className="gl-ficha-empty">
        Elige un término del índice para ver su ficha: qué significa, por qué
        importa, en qué celdas de la matriz aparece y qué papers lo sostienen.
      </div>
    );
  }
  const g = G.GRUPOS[term.grupo];
  const papers = (term.refs || []).map((k) => ({ key: k, ...G.BIBLIO[k] })).filter((p) => p.authors);
  const related = (term.related || [])
    .map((id) => G.TERMS.find((t) => t.id === id))
    .filter(Boolean);

  // certeza dominante entre las celdas (para el chip de cabecera)
  let headCert = null;
  if (term.cells && term.cells.length) {
    if (term.cells.some((c) => c.cert === "h")) headCert = "h";
    else if (term.cells.some((c) => c.cert === "m")) headCert = "m";
    else headCert = "l";
  }

  return (
    <div className="gl-ficha">
      <div className="gl-ficha-chips">
        <span className={`gl-tag ${term.grupo}`}>{g.tag}</span>
        {term.novel && <span className="gl-novel-chip">Concepto destacado</span>}
        {headCert && (
          <span className="gl-ficha-cert">
            <span className={`cdot ${headCert === "h" ? "high" : headCert === "m" ? "medium" : "low"}`}></span>
            certeza {CERT_LABEL[headCert]}
          </span>
        )}
      </div>

      <h2 className="gl-ficha-title">{term.term}</h2>
      <p className="gl-def">{term.def}</p>

      <div className="gl-why">
        <span className="gl-why-label">Por qué importa</span>
        <p className="gl-why-text">{term.why}</p>
      </div>

      {term.cells && term.cells.length > 0 && (
        <div className="gl-sec">
          <div className="gl-sec-label">Dónde aparece en la matriz</div>
          <div className="gl-cells">
            {term.cells.map((c, i) => <CellChip key={i} cell={c} onJump={onJump} />)}
          </div>
        </div>
      )}

      {papers.length > 0 && (
        <div className="gl-sec">
          <div className="gl-sec-label">En la bibliografía</div>
          <div className="gl-papers">
            {papers.map((p) => (
              <a key={p.key} className="gl-paper" href={p.url} target="_blank" rel="noopener">
                <div className="gl-paper-meta">
                  <span className={`biblio-type type-${p.type}`}>{G.TYPE_LABEL[p.type]}</span>
                  <span className="gl-paper-authors">{p.authors} · {p.year}</span>
                </div>
                <div className="gl-paper-title">{p.title}</div>
                <div className="gl-paper-journal">{p.journal} ↗</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="gl-sec">
          <div className="gl-sec-label">Conceptos relacionados</div>
          <div className="gl-related">
            {related.map((r) => (
              <button key={r.id} className="gl-rel-chip" onClick={() => onPick(r.id)}>
                {r.term.split(" · ")[0].split(" (")[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {papers.length === 0 && (
        <a className="gl-extlink" href={term.wiki} target="_blank" rel="noopener">
          Definición general en Wikipedia ↗
        </a>
      )}
    </div>
  );
}

/* Ítem de lista del índice */
function IndexItem({ term, active, hint, tag, onPick }) {
  return (
    <button
      className={`gl-item${active ? " active" : ""}`}
      onClick={() => onPick(term.id)}
    >
      <span className="gl-item-main">
        {term.novel && <span className="gl-novel-dot" title="Concepto destacado"></span>}
        <span className="gl-item-term">{term.term.split(" · ")[0].split(" (")[0]}</span>
      </span>
      {tag && <span className={`gl-item-tag ${term.grupo}`}>{tag}</span>}
      {hint && <span className="gl-item-hint">{hint}</span>}
    </button>
  );
}

/* ── Índice: modo RELEVANCIA ─────────────────────────────────── */
function IndexRelevance({ selId, onPick }) {
  const order = ["campo", "metodo", "desarrollo"];
  return (
    <div className="gl-index-scroll">
      <p className="gl-index-intro">
        Ordenado para quien llega desde la matriz y los papers: primero los
        conceptos del campo —los que sorprenden—, luego cómo leer la evidencia
        y, al final, el desarrollo de base.
      </p>
      {order.map((gk) => {
        const g = G.GRUPOS[gk];
        const items = G.TERMS.filter((t) => t.grupo === gk);
        return (
          <div className="gl-tier" key={gk}>
            <div className="gl-tier-head">
              <span className="gl-tier-label">{g.label}</span>
              <span className="gl-tier-count">{items.length}</span>
            </div>
            <p className="gl-tier-blurb">{g.blurb}</p>
            <div className="gl-list">
              {items.map((t) => {
                const hint = t.cells && t.cells.length ? t.cells[0].dim : "transversal";
                return <IndexItem key={t.id} term={t} active={t.id === selId} hint={hint} onPick={onPick} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Índice: modo BUSCADOR A–Z ───────────────────────────────── */
function IndexAlpha({ selId, onPick }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filters = [
    { k: "all", label: "Todos" },
    { k: "campo", label: "Campo" },
    { k: "metodo", label: "Método" },
    { k: "desarrollo", label: "Desarrollo" },
    { k: "novel", label: "Destacados" },
  ];

  const list = useMemo(() => {
    const qn = norm(q.trim());
    return G.TERMS
      .filter((t) => {
        if (filter === "novel" ? !t.novel : filter !== "all" && t.grupo !== filter) return false;
        if (!qn) return true;
        return norm(t.term).includes(qn) || norm(t.def).includes(qn) || norm(t.why).includes(qn);
      })
      .slice()
      .sort((a, b) => norm(a.term).localeCompare(norm(b.term)));
  }, [q, filter]);

  return (
    <div className="gl-index-scroll">
      <input
        className="gl-search"
        type="text"
        placeholder="Buscar término o definición…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="gl-filters">
        {filters.map((f) => (
          <button
            key={f.k}
            className={`gl-chip${filter === f.k ? " active" : ""}`}
            onClick={() => setFilter(f.k)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="gl-list gl-list-flush">
        {list.length === 0 && <div className="gl-empty">Sin resultados.</div>}
        {list.map((t) => (
          <IndexItem key={t.id} term={t} active={t.id === selId} tag={G.GRUPOS[t.grupo].tag} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}

/* ── Índice: modo MATRIZ (por dimensión) ─────────────────────── */
function IndexMatrix({ selId, onPick, tramo, setTramo }) {
  // términos por dimensión (un término puede aparecer en varias)
  const byDim = G.DIMS.map((dim) => {
    const seen = new Set();
    const items = [];
    G.TERMS.forEach((t) => {
      const cell = (t.cells || []).find(
        (c) => c.dim === dim && (tramo === "all" || c.tramo === Number(tramo))
      );
      if (cell && !seen.has(t.id)) {
        seen.add(t.id);
        items.push({ term: t, cert: cell.cert, chile: cell.chile });
      }
    });
    return { dim, items };
  }).filter((d) => d.items.length);

  const transversal = G.TERMS.filter((t) => !t.cells || t.cells.length === 0);
  const totalDims = byDim.length;

  const tramoOpts = [
    { value: "all", label: "Todos los tramos" },
    { value: "0", label: "Lactante · 0–12 meses" },
    { value: "1", label: "Primera infancia · 1–3 años" },
    { value: "2", label: "Preescolar · 3–5 años" },
    { value: "3", label: "Niñez media · 6–8 años" },
    { value: "4", label: "Preadolescencia · 9–12 años" },
  ];

  return (
    <div className="gl-index-scroll">
      <p className="gl-index-intro">
        El glosario espejado en la matriz: bajo cada dimensión, los conceptos
        que la tocan. Elige un tramo para ver solo los que aparecen a esa edad.
      </p>

      <label className="gl-index-label" htmlFor="gl-tramo-sel">Tramo etario</label>
      <select
        id="gl-tramo-sel"
        className="select gl-tramo-sel"
        value={tramo}
        onChange={(e) => setTramo(e.target.value)}
      >
        {tramoOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {totalDims === 0 && <div className="gl-empty">Ningún concepto mapeado a este tramo todavía.</div>}

      {byDim.map(({ dim, items }) => {
        const hasSel = items.some((it) => it.term.id === selId);
        return (
          <div className="gl-dim-group" data-dim={dim} key={dim}>
            <div className={`gl-dim-head${hasSel ? " gl-dim-head-active" : ""}`}>
              <span>{dim}</span>
              <span className="gl-dim-count">{items.length}</span>
            </div>
            <div className="gl-list">
              {items.map(({ term, cert, chile }) => (
                <button
                  key={term.id}
                  className={`gl-item${term.id === selId ? " active" : ""}`}
                  onClick={() => onPick(term.id)}
                >
                  <span className="gl-item-main">
                    <MiniDot c={cert} />
                    <span className="gl-item-term">{term.term.split(" · ")[0].split(" (")[0]}</span>
                  </span>
                  {chile && <span className="cl-mark" title="Nota de contexto chileno">CL</span>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {transversal.length > 0 && (
        <div className="gl-dim-group" data-dim="__transversal">
          <div className="gl-dim-head gl-dim-head-soft">Transversal · cómo leer la evidencia</div>
          <div className="gl-list">
            {transversal.map((t) => (
              <IndexItem key={t.id} term={t} active={t.id === selId} onPick={onPick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────────── */
function GlosarioApp({ organize = "relevance" }) {
  const firstId = useMemo(() => {
    if (organize === "alpha") {
      const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return G.TERMS.slice().sort((a, b) => norm(a.term).localeCompare(norm(b.term)))[0].id;
    }
    if (organize === "matrix") {
      const t = G.TERMS.find((x) => (x.cells || []).some((c) => c.dim === G.DIMS[0]));
      return t ? t.id : G.TERMS[0].id;
    }
    return G.TERMS[0].id;
  }, [organize]);

  const [selId, setSelId] = useState(firstId);
  const [tramo, setTramo] = useState("all");
  const [pendingDim, setPendingDim] = useState(null);
  const indexRef = React.useRef(null);
  const term = G.TERMS.find((t) => t.id === selId);

  // Salto desde un chip «dónde aparece» a su dimensión en el índice.
  // Nonce (objeto nuevo en cada click) para que el efecto siempre re-dispare.
  const jumpToDim = organize === "matrix"
    ? (dim) => { setTramo("all"); setPendingDim({ dim }); }
    : undefined;

  React.useEffect(() => {
    if (!pendingDim || !indexRef.current) return;
    const idx = indexRef.current;
    const dim = pendingDim.dim;
    const doScroll = () => {
      const scroller = idx.querySelector(".gl-index-scroll");
      const target = idx.querySelector(`[data-dim="${dim}"]`);
      if (scroller && target) {
        const top = target.offsetTop - scroller.offsetTop - 8;
        idx.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      }
    };
    // doble rAF: garantiza que el DOM con tramo="all" ya está confirmado
    requestAnimationFrame(() => requestAnimationFrame(doScroll));
  }, [pendingDim]);

  const modeLabel = {
    relevance: "Por relevancia",
    alpha: "Buscador A–Z",
    matrix: "Por dimensión",
  }[organize];

  return (
    <div className="gl-app">
      {/* TOP BAR */}
      <div className="gl-topbar">
        <div className="gl-topbar-left">
          <span className="gl-brand">Crianza y pantallas</span>
          <span className="gl-divider"></span>
          <span className="gl-tab-active">Glosario</span>
          <span className="gl-mode">{modeLabel}</span>
        </div>
        <div className="gl-legend">
          <span className="gl-legend-item"><span className="cdot high"></span>alta</span>
          <span className="gl-legend-item"><span className="cdot medium"></span>media</span>
          <span className="gl-legend-item"><span className="cdot low"></span>baja</span>
        </div>
      </div>

      {/* CUERPO */}
      <div className="gl-body">
        <div className="gl-index" ref={indexRef}>
          {organize === "relevance" && <IndexRelevance selId={selId} onPick={setSelId} />}
          {organize === "alpha" && <IndexAlpha selId={selId} onPick={setSelId} />}
          {organize === "matrix" && <IndexMatrix selId={selId} onPick={setSelId} tramo={tramo} setTramo={setTramo} />}
        </div>
        <div className="gl-ficha-pane">
          <Ficha term={term} onPick={setSelId} onJump={jumpToDim} />
        </div>
      </div>
    </div>
  );
}

window.GlosarioApp = GlosarioApp;
