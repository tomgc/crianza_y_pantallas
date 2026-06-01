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
    view: "matriz",              // matriz | bibliografia | glosario | metodologia | limitaciones
    activeCell: null,            // cellId actual mostrado en ficha (null = sin selección)
    activeDim: null,             // dimId cuya definición se muestra en ficha (null = sin selección)
    selectedAge: "all",          // ageId | "all"
    biblioFilter: "all",         // filterTypes id
    biblioSearch: "",
    glosarioSel: null,           // id del término activo en el glosario
    glosarioTramo: "all"         // tramo filtrado en el índice del glosario
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


  // ── DIMENSIONES: DEFINICIONES Y RECURSOS PARA HOVER ────────────
  const DIM_DESCRIPTIONS = {
    "lenguaje": {
      text: "El lenguaje es el andamio de todo aprendizaje posterior. En los primeros años se construye casi exclusivamente a través de la interacción cara a cara: turnos de habla, contacto visual y respuesta contingente del cuidador. Las pantallas actúan principalmente por desplazamiento: cuando hay TV de fondo o un adulto mirando el teléfono, el niño recibe menos palabras y menos intercambios conversacionales. El vocabulario consolidado antes de los 5 años predice la comprensión lectora, el rendimiento escolar y la autorregulación en la adolescencia.",
      links: [
        { label: "AAP – Tiempo de pantalla en bebés", url: "https://www.aap.org/en/patient-care/media-and-children/center-of-excellence-on-social-media-and-youth-mental-health/qa-portal/qa-portal-library/qa-portal-library-questions/screen-time-for-infants/" },
        { label: "AEPED – Cerebro infantil y pantallas", url: "https://www.aeped.es/enfamilia/salud-en-familia/cerebro-infantil-y-pantallas" },
        { label: "OMS – Crecer sanos: sentarse menos y jugar más", url: "https://www.who.int/es/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more" }
      ]
    },
    "cognicion": {
      text: "Las funciones ejecutivas —atención sostenida, memoria de trabajo y control de impulsos— son el núcleo de la cognición infantil y la base del aprendizaje escolar. La evidencia muestra que el factor crítico no es cuántas horas de pantalla, sino qué tipo: el contenido acelerado (videos cortos, cambios visuales rápidos) se asocia a peor función ejecutiva incluso tras exposiciones breves. El contenido lento, narrativo o interactivo con un adulto tiene efectos neutros o positivos. Las funciones ejecutivas consolidadas en la infancia predicen el logro académico y la salud mental en la adultez.",
      links: [
        { label: "Frontiers – Tiempo de pantalla y función ejecutiva (PMC)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643631/" },
        { label: "BMC Psychology – TV y funciones ejecutivas en preescolar (PMC)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11044375/" },
        { label: "Boletín de Pediatría – Niños, pantallas y desarrollo cognitivo (ES)", url: "https://boletindepediatria.org/boletin/article/view/1905" }
      ]
    },
    "creatividad": {
      text: "La creatividad infantil se construye en el juego libre no estructurado: el espacio donde el niño inventa reglas, transforma objetos y ensaya roles sin un guion externo. Las pantallas compiten directamente con ese tiempo. No es que el contenido digital sea incompatible con la creatividad, sino que desplaza las horas de exploración autónoma que son su materia prima. La capacidad de generar ideas, tolerar la ambigüedad y resolver problemas de forma flexible —habilidades críticas del siglo XXI— se ejercitan principalmente jugando sin pantalla.",
      links: [
        { label: "AEPED – Juego y juguetes", url: "https://enfamilia.aeped.es/vida-sana/juego-juguetes" },
        { label: "OMS – Crecer sanos: sentarse menos y jugar más", url: "https://www.who.int/es/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more" }
      ]
    },
    "socioemocional": {
      text: "El desarrollo socioemocional abarca el reconocimiento de emociones propias y ajenas, la empatía y la capacidad de relacionarse con pares y adultos. Estas habilidades se aprenden fundamentalmente en la interacción cara a cara, donde el niño lee expresiones, tonos de voz y señales corporales en tiempo real. Las pantallas actúan por dos vías: desplazan tiempo de interacción directa, y exponen al niño a modelos de conducta social. Las competencias socioemocionales consolidadas en la infancia predicen la salud mental, el éxito relacional y el rendimiento laboral en la adultez.",
      links: [
        { label: "UNICEF Uruguay – Tecnología en la primera infancia", url: "https://www.unicef.org/uruguay/crianza/digital/uso-de-la-tecnologia-en-la-primera-infancia-que-saber" },
        { label: "Coyne et al. 2023 – Pantallas, regulación emocional y empatía (PMC)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10570398/" }
      ]
    },
    "comportamiento": {
      text: "El comportamiento infantil —irritabilidad, impulsividad, agresividad o dificultades para seguir normas— está asociado de forma consistente con el uso de pantallas en la literatura científica. La magnitud es pequeña pero robusta: a mayor tiempo de pantalla, mayores problemas conductuales tanto externalizantes como internalizantes. La causalidad es bidireccional: los niños con más dificultades regulatorias también reciben más pantallas como calmante. La regulación conductual en la infancia es prerrequisito del funcionamiento social y académico.",
      links: [
        { label: "Eirich & Madigan et al. 2022 – Metaanálisis comportamiento y pantallas (PMC)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8928099/" },
        { label: "AEPED – Cerebro infantil y pantallas", url: "https://www.aeped.es/enfamilia/salud-en-familia/cerebro-infantil-y-pantallas" }
      ]
    },
    "vinculo": {
      text: "El vínculo de apego se construye en los primeros meses a través de la sincronía entre el bebé y su cuidador: miradas, respuestas contingentes y presencia sostenida. Las pantallas del adulto —no solo las del niño— interrumpen esa sincronía. El phubbing parental (mirar el teléfono en presencia del bebé) reduce la sensibilidad del cuidador y la calidad del intercambio emocional. Un apego seguro temprano es la base de la regulación emocional, la exploración del entorno y la salud mental a lo largo de toda la vida.",
      links: [
        { label: "UNICEF Uruguay – Tecnología en la primera infancia", url: "https://www.unicef.org/uruguay/crianza/digital/uso-de-la-tecnologia-en-la-primera-infancia-que-saber" },
        { label: "Coyne et al. 2023 – Pantallas y vínculo cuidador-niño (PMC)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10570398/" }
      ]
    },
    "co-regulacion": {
      text: "La co-regulación es el proceso por el cual el cuidador acompaña al niño a manejar emociones intensas hasta que este puede hacerlo por sí solo. Es el andamio desde el que emerge la autorregulación autónoma. Las pantallas interfieren de dos formas: reducen la disponibilidad del adulto para co-regular, y se usan como calmante que evita el aprendizaje en lugar de facilitarlo. La autoeficacia parental —sentirse capaz de acompañar sin recurrir al dispositivo— es la palanca interventiva más consistente en la evidencia.",
      links: [
        { label: "Radesky et al. 2023 – Dispositivos para calmar y reactividad emocional (PMC)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9857453/" },
        { label: "Frontiers 2024 – Pantallas, rabietas y autorregulación", url: "https://www.frontiersin.org/journals/child-and-adolescent-psychiatry/articles/10.3389/frcha.2024.1276154/full" }
      ]
    },
    "salud-mental": {
      text: "La salud mental infantil abarca el bienestar emocional, la ausencia de síntomas ansiosos o depresivos y la capacidad de funcionar en el entorno cotidiano. La relación con las pantallas es más robusta en preadolescentes —especialmente con el uso de redes sociales— y más indirecta en niños pequeños, donde opera principalmente vía afectación del sueño y el vínculo. La salud mental en la infancia es condición habilitante para el aprendizaje, las relaciones sociales y la productividad en la adultez.",
      links: [
        { label: "AAP HealthyChildren – Redes sociales y salud mental", url: "https://www.healthychildren.org/Spanish/family-life/Media/Paginas/social-media-and-your-childs-mental-health-what-research-says.aspx" },
        { label: "UNICEF – Salud mental de adolescentes y redes sociales", url: "https://www.unicef.org/parenting/mental-health/social-media-teens" }
      ]
    },
    "alfabetizacion": {
      text: "La alfabetización digital es la capacidad de usar la tecnología de forma crítica, segura y creativa: evaluar contenidos, reconocer desinformación y desenvolverse en entornos digitales con autonomía creciente. Se construye sobre habilidades pre-digitales (atención, comprensión narrativa, pensamiento causal) y madura principalmente en la niñez media y la preadolescencia. Las intervenciones de evaluación de credibilidad muestran efectos moderados-altos en estudios controlados. Es condición para la participación ciudadana y el mundo laboral del siglo XXI.",
      links: [
        { label: "UNESCO – Alfabetización mediática e informacional (ES)", url: "https://www.unesco.org/es/articles/curso-internacional-de-alfabetizacion-mediatica-e-informacional-para-reguladores-iberoamericanos" },
        { label: "Common Sense Media (portal en español)", url: "https://www.commonsensemedia.org/es" }
      ]
    },
    "privacidad": {
      text: "La privacidad y seguridad digital abarca los riesgos de exposición a contactos no seguros, contenido inapropiado y recolección de datos personales. En los primeros años el riesgo principal es el sharenting —la huella digital que generan los adultos sobre el niño—. Con el acceso a dispositivos propios (~9-10 años) emerge el riesgo de contacto no seguro y explotación sexual en línea (OCSEA), con una prevalencia global estimada en 8,1%. Comprender y gestionar estos riesgos es parte del desarrollo de la autonomía segura.",
      links: [
        { label: "UNICEF Argentina – El grooming es un delito", url: "https://www.unicef.org/argentina/el-grooming-es-un-delito" },
        { label: "INTERPOL – Disrupting Harm (protección de menores)", url: "https://www.interpol.int/es/Delitos/Delitos-contra-menores/Proyectos-para-proteger-a-los-ninos/Disrupting-Harm-neutralizar-el-dano" },
        { label: "ICMEC/UNICEF – Abuso sexual infantil en línea (PDF)", url: "https://cdn.icmec.org/wp-content/uploads/2020/09/Estudo-Legislativo-ICMEC_UNICEF-ES.pdf" }
      ]
    },
    "cyberbullying": {
      text: "El cyberbullying es el acoso y la agresión entre pares mediados por plataformas digitales. Emerge principalmente cuando los niños acceden a dispositivos propios (~10 años); antes de esa edad la evidencia es escasa o inexistente. El 15% de los adolescentes de 11 años reporta haber sido víctima (OMS/HBSC 2024). Sus efectos sobre la salud mental y la trayectoria escolar pueden ser duraderos. Los programas escolares de prevención reducen significativamente tanto la victimización como la perpetración.",
      links: [
        { label: "IS4K/INCIBE – Ciberacoso escolar (ES)", url: "https://www.is4k.es/necesitas-saber/ciberacoso-escolar" }
      ]
    },
    "sueno": {
      text: "El sueño de calidad es necesario para la consolidación de la memoria, la regulación emocional y el crecimiento físico en todos los tramos de la infancia. Las pantallas lo afectan por dos mecanismos: desplazan horas de sueño (el niño se duerme más tarde) y la luz azul de las pantallas retrasa la secreción de melatonina. El uso de dispositivos en el dormitorio es el factor de riesgo más consistente en la literatura. Una hora de pantalla antes de dormir reduce significativamente la duración y la calidad del sueño.",
      links: [
        { label: "AEPED – Sueño en niños y dispositivos electrónicos", url: "https://enfamilia.aeped.es/noticias/sueno-en-ninos-dispositivos-electronicos" },
        { label: "Sleep Research Society – Niños, preadolescentes y pantallas (PDF, ES)", url: "https://www.sleepresearchsociety.org/wp-content/uploads/2021/12/Kids-Tweens-Teens-and-Screens-Spanish.pdf" }
      ]
    },
    "fisica": {
      text: "La actividad física regular en la infancia es base del desarrollo motor, la salud metabólica y el bienestar psicológico. Las pantallas compiten directamente con el tiempo activo: el mecanismo principal no es el contenido sino el desplazamiento. Cada hora frente a una pantalla es una hora menos de movimiento, juego al aire libre o deporte. La OMS recomienda cero tiempo sedentario de pantalla para menores de 1 año y menos de 1 hora para niños de 2 a 4 años. El tiempo al aire libre tiene además un efecto protector independiente sobre la visión.",
      links: [
        { label: "OMS – Crecer sanos: sentarse menos y jugar más", url: "https://www.who.int/es/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more" },
        { label: "OMS – Actividad física (ficha técnica)", url: "https://www.who.int/es/news-room/fact-sheets/detail/physical-activity" }
      ]
    },
    "alimentacion": {
      text: "Las pantallas afectan la alimentación por dos vías: la alimentación distraída interfiere con las señales internas de saciedad del niño, y el marketing digital de alimentos no saludables moldea sus preferencias desde edades muy tempranas. El 75% de niños de 6-8 años estuvo expuesto a marcas de alimentos en YouTube en una semana típica. Los hábitos alimentarios que se forman en la infancia tienen alta persistencia en la adultez. La regulación del marketing digital de alimentos sigue siendo insuficiente en la mayoría de los países.",
      links: [
        { label: "AAP HealthyChildren – Comer frente a una pantalla no es saludable (ES)", url: "https://www.healthychildren.org/Spanish/family-life/Media/Paginas/Food-and-TV-Not-a-Healthy-Mix.aspx" },
        { label: "UNICEF LACRO – Marketing digital de alimentos dirigido a niños (PDF)", url: "https://www.unicef.org/lac/media/42141/file/Reporte-marketing-digital-esp.pdf" }
      ]
    },
    "vision": {
      text: "El tiempo prolongado frente a pantallas, especialmente en interiores y a distancias cortas, se asocia con el desarrollo y la progresión de la miopía. El factor protector con más evidencia no es limitar las pantallas per se, sino aumentar el tiempo al aire libre (mínimo 2 horas diarias): la luz natural regula el crecimiento del ojo independientemente del uso de pantallas. La miopía en la infancia tiende a progresar hasta la adultez; detectarla y manejarla temprano reduce el riesgo de complicaciones visuales graves.",
      links: [
        { label: "AAO – Control de la miopía en los niños (ES)", url: "https://www.aao.org/salud-ocular/enfermedades/control-de-la-miop%C3%ADa-en-los-ni%C3%B1os" },
        { label: "AAO – Uso de pantalla para los niños (ES)", url: "https://www.aao.org/salud-ocular/consejos/uso-de-pantalla-para-los-ninos" }
      ]
    }
  };

  // ── DIMENSIONES: BLOQUES TEMÁTICOS (D-visual) ───────────────
  const DIM_BLOCKS = {
    "lenguaje":       "bloque-cognitivo",
    "cognicion":      "bloque-cognitivo",
    "creatividad":    "bloque-cognitivo",
    "socioemocional": "bloque-socioemocional",
    "comportamiento": "bloque-socioemocional",
    "vinculo":        "bloque-socioemocional",
    "co-regulacion":  "bloque-socioemocional",
    "alfabetizacion": "bloque-digital",
    "privacidad":     "bloque-digital",
    "cyberbullying":  "bloque-digital",
    "salud-mental":   "bloque-bienestar",
    "sueno":          "bloque-bienestar",
    "fisica":         "bloque-bienestar",
    "alimentacion":   "bloque-bienestar",
    "vision":         "bloque-bienestar"
  };

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
      case "glosario":     return renderGlosarioView();
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
      { id: "glosario",     label: "Glosario" },
      { id: "bibliografia", label: "Bibliografía" },
      { id: "metodologia",  label: "Metodología" }
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
            <p class="brand-desc">Un mapa de la evidencia sobre el uso de pantallas en niños y niñas de 0 a 12 años. Sin prescribir ni alarmar, distingue lo bien establecido de lo que es hipótesis o creencia popular, para acompañar con evidencia las decisiones de padres y madres a lo largo de la infancia.</p>
          </div>
        </div>
        <nav class="tabs" id="tabs">
          ${tabs.map(t => `
            <button class="tab ${t.id === state.view ? "active" : ""}" data-tab="${t.id}">${t.label}</button>
          `).join("")}
        </nav>
        <div class="topbar-right">
          <span class="legend">
            <span class="legend-label">Certeza</span><span class="cdot high"></span>alta
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
          ${state.activeDim ? renderFichaDim(state.activeDim) : renderFicha(state.activeCell)}
        </aside>
      </div>
    `;
  }

  function renderMatrizHelp() {
    const ageSel = state.selectedAge;
    const ageLabel = ageSel === "all" ? null : (ages.find(a => a.id === ageSel) || {}).label;
    return `
      <div class="matriz-help">
        15 dimensiones × 5 tramos etarios — clic en cualquier celda carga su ficha a la derecha.
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
      const dimDesc = DIM_DESCRIPTIONS[d.id];
      const tooltipAttr = dimDesc ? ` data-dim-id="${escapeHtml(d.id)}"` : "";
      const bloqueClass = DIM_BLOCKS[d.id] ? ` ${DIM_BLOCKS[d.id]}` : "";
      const dimActive = state.activeDim === d.id ? " dim-active" : "";
      html += `<div class="grid-cell row-head${bloqueClass}${dimActive}"${tooltipAttr}><span>${escapeHtml(d.label)}</span>${pc > 0 ? `<span class="dim-paper-count">(${pc} ${pc === 1 ? "referencia" : "referencias"})</span>` : ""}</div>`;
      ages.forEach(a => {
        const cid = `${d.id}-${a.id}`;
        const cell = claims[cid];
        const dimmed = ageSel !== "all" && ageSel !== a.id;
        const isActive = cid === state.activeCell;
        const cls = ["grid-cell", "data-cell", dimmed ? "dimmed" : "", isActive ? "active" : ""].filter(Boolean).join(" ");

        if (!cell || !(cell.claims && cell.claims.length)) {
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
    if (!cellId || !claims[cellId] || !claims[cellId].claims?.length) {
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
          { term: "Las 5 Cs (AAP 2026)",       def: "Marco de la Academia Americana de Pediatría: Child, Content, Calm, Crowding-out y Communication. Sustituye la regla de tiempo por criterios cualitativos.",                          url: "https://publications.aap.org/pediatrics/article/157/1/e2025071223/" },
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


  // ── VISTA: GLOSARIO ─────────────────────────────────────────
  function renderGlosarioView() {
    const G = window.GLOSARIO;
    if (!G) return `<div style="padding:24px;color:var(--pencil)">Datos del glosario no disponibles.</div>`;

    // Inicializar selección si es null
    if (!state.glosarioSel && G.TERMS.length) {
      const first = G.TERMS.find(t => (t.cells || []).some(c => c.dim === G.DIMS[0]));
      state.glosarioSel = first ? first.id : G.TERMS[0].id;
    }

    return `
      <div class="gl-body">
        <div class="gl-index" id="gl-index">
          ${renderGlosarioIndex(G)}
        </div>
        <div class="gl-ficha-pane" id="gl-ficha-pane">
          ${renderGlosarioFicha(G, state.glosarioSel)}
        </div>
      </div>
    `;
  }

  function renderGlosarioIndex(G) {
    const tramo = state.glosarioTramo;

    const tramoOpts = [
      { value: "all", label: "Todos los tramos" },
      { value: "0", label: "Lactante · 0–12 meses" },
      { value: "1", label: "Primera infancia · 1–3 años" },
      { value: "2", label: "Preescolar · 3–5 años" },
      { value: "3", label: "Niñez media · 6–8 años" },
      { value: "4", label: "Preadolescencia · 9–12 años" },
    ];

    // Agrupar términos por dimensión
    const byDim = G.DIMS.map(dim => {
      const seen = new Set();
      const items = [];
      G.TERMS.forEach(t => {
        const cell = (t.cells || []).find(
          c => c.dim === dim && (tramo === "all" || c.tramo === Number(tramo))
        );
        if (cell && !seen.has(t.id)) {
          seen.add(t.id);
          items.push({ term: t, cert: cell.cert, chile: cell.chile });
        }
      });
      return { dim, items };
    }).filter(d => d.items.length);

    const transversal = G.TERMS.filter(t => !t.cells || t.cells.length === 0);

    const dimGroups = byDim.map(({ dim, items }) => {
      const hasSel = items.some(it => it.term.id === state.glosarioSel);
      return `
        <div class="gl-dim-group" data-gl-dim="${escapeHtml(dim)}">
          <div class="gl-dim-head${hasSel ? " active" : ""}">
            <span>${escapeHtml(dim)}</span>
            <span class="gl-dim-count">${items.length}</span>
          </div>
          <div class="gl-list">
            ${items.map(({ term, cert, chile }) => `
              <button class="gl-item${term.id === state.glosarioSel ? " active" : ""}"
                      data-gl-term="${escapeHtml(term.id)}">
                <span class="gl-item-main">
                  <span class="mini-dot ${cert}"></span>
                  <span class="gl-item-term">${escapeHtml(term.term.split(" · ")[0].split(" (")[0])}</span>
                </span>
                ${chile ? `<span class="cl-mark" title="Nota de contexto chileno">CL</span>` : ""}
              </button>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");

    const transGroup = transversal.length ? `
      <div class="gl-dim-group" data-gl-dim="__transversal">
        <div class="gl-dim-head soft">Transversal · cómo leer la evidencia</div>
        <div class="gl-list">
          ${transversal.map(t => `
            <button class="gl-item${t.id === state.glosarioSel ? " active" : ""}"
                    data-gl-term="${escapeHtml(t.id)}">
              <span class="gl-item-main">
                ${t.novel ? `<span class="gl-novel-dot"></span>` : ""}
                <span class="gl-item-term">${escapeHtml(t.term.split(" · ")[0].split(" (")[0])}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </div>
    ` : "";

    return `
      <div class="gl-index-scroll">
        <p class="gl-index-intro">
          El glosario espejado en la matriz: bajo cada dimensión, los conceptos que la tocan.
        </p>
        ${byDim.length === 0 ? `<div class="gl-empty">Ningún concepto mapeado todavía.</div>` : ""}
        ${dimGroups}
        ${transGroup}
      </div>
    `;
  }

  function renderGlosarioFicha(G, termId) {
    const term = G.TERMS.find(t => t.id === termId);
    if (!term) {
      return `
        <div class="gl-ficha-empty">
          Elige un término del índice para ver su ficha: qué significa, por qué
          importa, en qué celdas de la matriz aparece y qué papers lo sostienen.
        </div>
      `;
    }

    const g = G.GRUPOS[term.grupo];
    const papers = (term.refs || [])
      .map(k => biblioById[k])
      .filter(Boolean);
    const related = (term.related || [])
      .map(id => G.TERMS.find(t => t.id === id))
      .filter(Boolean);

    // Certeza dominante entre las celdas
    let headCert = null;
    if (term.cells && term.cells.length) {
      if (term.cells.some(c => c.cert === "h"))      headCert = "high";
      else if (term.cells.some(c => c.cert === "m")) headCert = "medium";
      else                                            headCert = "low";
    }
    const certLabels = { high: "alta", medium: "media", low: "baja" };

    const cellsHtml = (term.cells && term.cells.length) ? `
      <div class="gl-sec">
        <div class="gl-sec-label">Dónde aparece en la matriz</div>
        <div class="gl-cells">
          ${term.cells.map(c => `
            <span class="gl-cell-chip">
              <span class="mini-dot ${c.cert}"></span>
              <span class="gl-cell-dim">${escapeHtml(c.dim)}</span>
              <span class="gl-cell-tramo">${escapeHtml(G.TRAMOS[c.tramo])}</span>
              ${c.chile ? `<span class="cl-mark" title="Nota de contexto chileno">CL</span>` : ""}
            </span>
          `).join("")}
        </div>
      </div>
    ` : "";

    const papersHtml = papers.length ? `
      <div class="gl-sec">
        <div class="gl-sec-label">En la bibliografía</div>
        <div class="gl-papers">
          ${papers.map(p => {
            const typeLabels = { review:"Revisión", meta:"Meta-análisis", longitudinal:"Longitudinal", guideline:"Guía clínica", law:"Normativa", chilean:"Chile" };
            return `
              <a class="gl-paper" href="${escapeHtml(p.url || "")}" target="_blank" rel="noopener">
                <div class="gl-paper-meta">
                  <span class="biblio-type type-${escapeHtml(p.type || "")}">${escapeHtml(typeLabels[p.type] || p.type || "")}</span>
                  <span class="gl-paper-authors">${escapeHtml(p.authors || "")} · ${escapeHtml(String(p.year || ""))}</span>
                </div>
                <div class="gl-paper-title">${escapeHtml(p.title || "")}</div>
                ${p.journal ? `<div class="gl-paper-journal">${escapeHtml(p.journal)} ↗</div>` : ""}
              </a>
            `;
          }).join("")}
        </div>
      </div>
    ` : `<a class="gl-extlink" href="${escapeHtml(term.wiki || "")}" target="_blank" rel="noopener">Definición general en Wikipedia ↗</a>`;

    const relatedHtml = related.length ? `
      <div class="gl-sec">
        <div class="gl-sec-label">Conceptos relacionados</div>
        <div class="gl-related">
          ${related.map(r => `
            <button class="gl-rel-chip" data-gl-rel="${escapeHtml(r.id)}">
              ${escapeHtml(r.term.split(" · ")[0].split(" (")[0])}
            </button>
          `).join("")}
        </div>
      </div>
    ` : "";

    return `
      <div class="gl-ficha">
        <div class="gl-ficha-chips">
          <span class="gl-tag ${term.grupo}">${escapeHtml(g.tag)}</span>
          ${term.novel ? `<span class="gl-novel-chip">Concepto destacado</span>` : ""}
          ${headCert ? `
            <span class="gl-ficha-cert">
              <span class="cdot ${headCert}"></span>certeza ${certLabels[headCert]}
            </span>
          ` : ""}
        </div>
        <h2 class="gl-ficha-title">${escapeHtml(term.term)}</h2>
        <p class="gl-def">${escapeHtml(term.def)}</p>
        <div class="gl-why">
          <div class="gl-why-label">Por qué importa</div>
          <p class="gl-why-text">${escapeHtml(term.why)}</p>
        </div>
        ${cellsHtml}
        ${papersHtml}
        ${relatedHtml}
      </div>
    `;
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
  function renderMetodologia() {
    const metodoSections = (methodology.sections || [])
      .filter(s => s.heading !== "Decisiones editoriales");
    const limitSections  = limitations.sections || [];
    const merged = {
      title:    "Cómo leemos la evidencia",
      subtitle: "Criterios, tramos etarios y niveles de certeza que organizan esta síntesis.",
      sections: [...metodoSections, ...limitSections]
    };
    return renderTextPage(merged) + `
      <div class="contact-note">
        ¿Encuentras un error o quieres sugerir una fuente?
        <a href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#116;&#103;&#111;&#110;&#122;&#97;&#108;&#101;&#122;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;" class="contact-link">Escríbeme.</a>
      </div>`;
  }
  function renderLimitaciones() { return renderMetodologia(); }

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
  // ── FICHA DE DIMENSIÓN ──────────────────────────────────────
  function renderFichaDim(dimId) {
    const desc = DIM_DESCRIPTIONS[dimId];
    const dim  = dims.find(d => d.id === dimId) || { label: dimId };
    if (!desc) return renderFicha(null);
    const linksHtml = (desc.links || []).map(l =>
      `<a class="dim-ficha-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
    ).join("");
    return `
      <div class="ficha">
        <div class="eyebrow">Dimensión</div>
        <div class="ficha-chips">
          <span class="age-chip">${escapeHtml(dim.label)}</span>
        </div>
        <p class="ficha-intro">${escapeHtml(desc.text)}</p>
        ${linksHtml ? `
          <div class="dim-ficha-links">
            <div class="eyebrow" style="margin-bottom:6px;">Leer más</div>
            ${linksHtml}
          </div>` : ""}
      </div>
    `;
  }

  function openDimFicha(dimId) {
    state.activeDim = dimId;
    state.activeCell = null;
    const matrizPane = root.querySelector(".matriz-pane");
    const fichaPane  = root.querySelector("#ficha-pane");
    if (matrizPane) matrizPane.innerHTML = renderMatrizHelp() + renderMatriz();
    if (fichaPane)  fichaPane.innerHTML  = renderFichaDim(dimId);
  }

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
      if (e.key === "Escape") { closePopover(); }
    });
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

    // Clic en label de dimensión → ficha de definición
    const rowHead = e.target.closest(".grid-cell.row-head[data-dim-id]");
    if (rowHead) {
      openDimFicha(rowHead.dataset.dimId);
      return;
    }

    // Celda de matriz
    const cellEl = e.target.closest(".data-cell[data-cellid]");
    if (cellEl) {
      const cid = cellEl.dataset.cellid;
      if (claims[cid]) {
        state.activeCell = cid;
        state.activeDim = null;
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

    // Término del índice del glosario
    const glTerm = e.target.closest("[data-gl-term]");
    if (glTerm) {
      state.glosarioSel = glTerm.dataset.glTerm;
      const idx = document.getElementById("gl-index");
      const ficha = document.getElementById("gl-ficha-pane");
      if (idx)   idx.innerHTML   = renderGlosarioIndex(window.GLOSARIO);
      if (ficha) ficha.innerHTML = renderGlosarioFicha(window.GLOSARIO, state.glosarioSel);
      return;
    }

    // Chip de término relacionado en ficha del glosario
    const glRel = e.target.closest("[data-gl-rel]");
    if (glRel) {
      state.glosarioSel = glRel.dataset.glRel;
      const idx = document.getElementById("gl-index");
      const ficha = document.getElementById("gl-ficha-pane");
      if (idx)   idx.innerHTML   = renderGlosarioIndex(window.GLOSARIO);
      if (ficha) ficha.innerHTML = renderGlosarioFicha(window.GLOSARIO, state.glosarioSel);
      // Scroll al término activo en el índice
      setTimeout(() => {
        const active = document.querySelector(".gl-item.active");
        if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 30);
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
})();
