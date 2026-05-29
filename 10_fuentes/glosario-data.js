/* ───────────────────────────────────────────────────────────────
   Crianza y pantallas — datos del glosario
   Dataset compartido por las tres propuestas de organización.
   Cada término enlaza con: por qué importa, dónde aparece en la
   matriz (dimensión · tramo · certeza), papers de la bibliografía
   y términos relacionados.
   ─────────────────────────────────────────────────────────────── */
(function () {

  // ── Bibliografía referenciada ────────────────────────────────
  // type: review · meta · longitudinal · guideline · law · chilean
  const BIBLIO = {
    madigan2020: {
      authors: "Madigan, McArthur, Anhorn et al.",
      year: 2020,
      title: "Associations Between Screen Use and Child Language Skills",
      journal: "JAMA Pediatrics",
      type: "meta",
      url: "https://doi.org/10.1001/jamapediatrics.2020.0327",
    },
    children2020s: {
      authors: "Equipo Children of the 2020s",
      year: 2024,
      title: "Cohorte longitudinal de nacimiento (Reino Unido)",
      journal: "UK Dept. for Education",
      type: "longitudinal",
      url: "https://www.gov.uk/government/collections/children-of-the-2020s-study",
    },
    jing2023: {
      authors: "Jing, Liu, Zhang et al.",
      year: 2023,
      title: "Screen media use and educational content quality in early childhood",
      journal: "Review",
      type: "review",
      url: "https://doi.org/10.1016/j.edurev.2023.100534",
    },
    sundqvist2021: {
      authors: "Sundqvist, Koch, Birberg-Thornberg et al.",
      year: 2021,
      title: "Co-viewing and contingent talk during screen use",
      journal: "Infant Behavior & Development",
      type: "longitudinal",
      url: "https://doi.org/10.1016/j.infbeh.2021.101595",
    },
    aap2026: {
      authors: "American Academy of Pediatrics",
      year: 2026,
      title: "Media and children: the 5 Cs framework",
      journal: "Pediatrics",
      type: "guideline",
      url: "https://publications.aap.org/pediatrics/article/157/1/e2025071223/",
    },
    pder2021: {
      authors: "Coyne, Shawcroft, Gale et al.",
      year: 2021,
      title: "Parental Digital Emotion Regulation (PDER)",
      journal: "Computers in Human Behavior",
      type: "longitudinal",
      url: "https://doi.org/10.1016/j.chb.2021.106866",
    },
    christakis2004: {
      authors: "Christakis, Zimmerman, DiGiuseppe et al.",
      year: 2004,
      title: "Early Television Exposure and Subsequent Attentional Problems",
      journal: "Pediatrics",
      type: "longitudinal",
      url: "https://doi.org/10.1542/peds.113.4.708",
    },
    anderson2007: {
      authors: "Anderson & Pempek",
      year: 2007,
      title: "Television and Very Young Children (background TV)",
      journal: "American Behavioral Scientist",
      type: "review",
      url: "https://doi.org/10.1177/0002764204271506",
    },
    foreman2017: {
      authors: "Foreman, Salim, Praveen et al.",
      year: 2021,
      title: "Association between digital smart device use and myopia",
      journal: "The Lancet Digital Health",
      type: "meta",
      url: "https://doi.org/10.1016/S2589-7500(21)00135-7",
    },
  };

  // ── Dimensiones de la matriz (orden canónico) ─────────────────
  const DIMS = [
    "Lenguaje", "Cognición", "Socio-emocional", "Sueño", "Actividad física",
    "Visión", "Salud mental", "Comportamiento", "Vínculo", "Creatividad",
  ];

  // tramos: 0 lactante · 1 primera infancia · 2 preescolar · 3 niñez media · 4 preado
  const TRAMOS = ["0–12 m", "1–3 a", "3–5 a", "6–8 a", "9–12 a"];

  // ── Términos ──────────────────────────────────────────────────
  // grupo:  campo | metodo | desarrollo
  // cells:  apariciones en la matriz [{dim, tramo(0-4), cert}]
  // novel:  destaca como concepto que sorprende al lector
  const TERMS = [

    /* ——— Conceptos del campo (pantallas y crianza) ——— */
    {
      id: "technoference",
      term: "Technoference",
      grupo: "campo", novel: true,
      def: "Interferencia del uso de dispositivos del cuidador en la interacción cara a cara con el niño.",
      why: "Cambia el foco del problema: no es solo cuánto mira pantallas el niño, sino cuánto las mira el adulto frente a él.",
      cells: [
        { dim: "Vínculo", tramo: 1, cert: "h" },
        { dim: "Socio-emocional", tramo: 1, cert: "m" },
        { dim: "Lenguaje", tramo: 1, cert: "m" },
      ],
      refs: ["pder2021", "sundqvist2021"],
      related: ["pder", "tv-fondo", "corregulacion"],
      wiki: "https://en.wikipedia.org/wiki/Technoference",
    },
    {
      id: "video-deficit",
      term: "Video deficit",
      grupo: "campo", novel: true,
      def: "Los niños menores de 3 años aprenden significativamente menos de un contenido en pantalla que de la misma información presentada en persona.",
      why: "Explica por qué la AAP desaconseja pantallas antes de los 2 años aunque el contenido sea «educativo».",
      cells: [
        { dim: "Lenguaje", tramo: 0, cert: "h" },
        { dim: "Lenguaje", tramo: 1, cert: "h" },
        { dim: "Cognición", tramo: 1, cert: "m" },
      ],
      refs: ["madigan2020", "aap2026"],
      related: ["co-visionado", "andamiaje", "tv-fondo"],
      wiki: "https://en.wikipedia.org/wiki/Video_deficit_effect",
    },
    {
      id: "tv-fondo",
      term: "TV de fondo",
      grupo: "campo", novel: true,
      def: "Televisión encendida en el hogar sin ser el foco de atención del niño; reduce la cantidad y calidad del habla dirigida.",
      why: "Es la intervención más simple y barata: apagarla cuando nadie la está viendo recupera habla dirigida al niño.",
      cells: [
        { dim: "Lenguaje", tramo: 1, cert: "h", chile: true },
        { dim: "Cognición", tramo: 1, cert: "m" },
      ],
      refs: ["anderson2007", "madigan2020"],
      related: ["technoference", "video-deficit", "co-visionado"],
      wiki: "https://en.wikipedia.org/wiki/Background_television",
    },
    {
      id: "fast-paced",
      term: "Fast-paced content",
      grupo: "campo", novel: true,
      def: "Contenido con cambios visuales y auditivos muy rápidos; se asocia con menor capacidad atencional inmediata en preescolares.",
      why: "Sugiere que el ritmo de edición —no solo el tiempo total— afecta la atención del niño.",
      cells: [
        { dim: "Cognición", tramo: 2, cert: "m" },
        { dim: "Comportamiento", tramo: 2, cert: "m" },
        { dim: "Salud mental", tramo: 2, cert: "l" },
      ],
      refs: ["christakis2004", "jing2023"],
      related: ["funcion-ejecutiva", "tiempo-recreativo"],
      wiki: "https://en.wikipedia.org/wiki/Attention_span",
    },
    {
      id: "co-visionado",
      term: "Co-visionado contingente",
      grupo: "campo", novel: true,
      def: "Ver pantallas junto al niño con interacción activa y responsiva del adulto; mitiga los efectos negativos del contenido pasivo.",
      why: "Es el factor protector mejor documentado: el «con quién y cómo» pesa más que el «cuánto».",
      cells: [
        { dim: "Lenguaje", tramo: 1, cert: "h" },
        { dim: "Lenguaje", tramo: 2, cert: "m" },
        { dim: "Cognición", tramo: 2, cert: "m" },
      ],
      refs: ["sundqvist2021", "jing2023"],
      related: ["video-deficit", "tv-fondo", "5cs"],
      wiki: "https://es.wikipedia.org/wiki/Mediaci%C3%B3n_parental_de_medios",
    },
    {
      id: "corregulacion",
      term: "Corregulación",
      grupo: "campo", novel: true,
      def: "Proceso por el cual el cuidador ayuda al niño a manejar sus emociones antes de que pueda autorregularse solo.",
      why: "Cuando la pantalla reemplaza la corregulación, el niño no aprende a calmarse por sí mismo.",
      cells: [
        { dim: "Socio-emocional", tramo: 1, cert: "m" },
        { dim: "Vínculo", tramo: 1, cert: "h" },
      ],
      refs: ["pder2021"],
      related: ["pder", "apego", "technoference"],
      wiki: "https://es.wikipedia.org/wiki/Autorregulaci%C3%B3n_emocional",
    },
    {
      id: "pder",
      term: "PDER · regulación emocional con pantalla",
      grupo: "campo", novel: true,
      def: "Parental Digital Emotion Regulation: uso del dispositivo por parte del cuidador para calmar o distraer al niño ante emociones difíciles.",
      why: "Práctica muy extendida y de efecto discutido: alivia el momento, pero puede desplazar el aprendizaje de la autorregulación.",
      cells: [
        { dim: "Socio-emocional", tramo: 2, cert: "m" },
        { dim: "Salud mental", tramo: 2, cert: "l" },
        { dim: "Comportamiento", tramo: 2, cert: "m" },
      ],
      refs: ["pder2021"],
      related: ["corregulacion", "technoference", "tiempo-recreativo"],
      wiki: "https://doi.org/10.1016/j.chb.2021.106866",
    },
    {
      id: "5cs",
      term: "Las 5 Cs (AAP 2026)",
      grupo: "campo", novel: true,
      def: "Marco de la Academia Americana de Pediatría: Child, Content, Context, Caregiver y Crown (tiempo). Sustituye la regla de tiempo por criterios cualitativos.",
      why: "Marca el giro del campo: de «cuántos minutos» a «qué, con quién y en qué contexto».",
      cells: [
        { dim: "Comportamiento", tramo: 3, cert: "h" },
        { dim: "Salud mental", tramo: 4, cert: "m" },
      ],
      refs: ["aap2026"],
      related: ["co-visionado", "tiempo-recreativo"],
      wiki: "https://publications.aap.org/pediatrics/article/157/1/e2025071223/",
    },
    {
      id: "tiempo-recreativo",
      term: "Tiempo de pantalla recreativa",
      grupo: "campo",
      def: "Uso de dispositivos con fines de entretenimiento, sin mediación adulta ni propósito educativo explícito.",
      why: "Es la categoría que más correlaciona con efectos negativos, frente al uso mediado o educativo.",
      cells: [
        { dim: "Actividad física", tramo: 3, cert: "h", chile: true },
        { dim: "Sueño", tramo: 3, cert: "h" },
        { dim: "Salud mental", tramo: 4, cert: "m" },
      ],
      refs: ["aap2026"],
      related: ["sedentarismo", "5cs", "fast-paced"],
      wiki: "https://es.wikipedia.org/wiki/Tiempo_de_pantalla",
    },

    /* ——— Para interpretar la evidencia (metodología) ——— */
    {
      id: "certeza",
      term: "Certeza alta · media · baja",
      grupo: "metodo", novel: true,
      def: "Clasificación de este sitio: alta = meta-análisis o cohortes grandes replicadas; media = longitudinales con limitaciones; baja = transversales pequeños o preliminares.",
      why: "Es la clave de lectura de toda la matriz: cada celda lleva un punto de certeza que indica cuánto fiarse del hallazgo.",
      cells: [],
      refs: [],
      related: ["meta-analisis", "cohorte", "transversal"],
      wiki: "https://es.wikipedia.org/wiki/Medicina_basada_en_evidencia",
    },
    {
      id: "meta-analisis",
      term: "Meta-análisis",
      grupo: "metodo",
      def: "Método estadístico que combina los resultados de múltiples estudios independientes para estimar un efecto global con mayor precisión.",
      why: "Sostiene casi todas las celdas de certeza alta de la matriz; es la evidencia más fuerte disponible.",
      cells: [],
      refs: ["madigan2020", "foreman2017"],
      related: ["certeza", "cohorte"],
      wiki: "https://es.wikipedia.org/wiki/Metaan%C3%A1lisis",
    },
    {
      id: "cohorte",
      term: "Cohorte longitudinal",
      grupo: "metodo",
      def: "Diseño que sigue a un grupo de personas durante años para observar cómo cambian ciertas variables en el tiempo.",
      why: "Permite ver si la pantalla precede al efecto y no solo coincide con él: acerca a la causalidad sin probarla.",
      cells: [],
      refs: ["children2020s", "sundqvist2021"],
      related: ["transversal", "meta-analisis", "certeza"],
      wiki: "https://es.wikipedia.org/wiki/Estudio_de_cohorte",
    },
    {
      id: "transversal",
      term: "Estudio transversal",
      grupo: "metodo",
      def: "Diseño que mide variables en una población en un momento único; no permite establecer causalidad.",
      why: "Detrás de la mayoría de las celdas de certeza baja: muestra asociación, pero no qué causa qué.",
      cells: [],
      refs: [],
      related: ["cohorte", "certeza"],
      wiki: "https://es.wikipedia.org/wiki/Estudio_transversal",
    },

    /* ——— Desarrollo infantil (sustrato) ——— */
    {
      id: "funcion-ejecutiva",
      term: "Función ejecutiva",
      grupo: "desarrollo",
      def: "Procesos mentales que permiten planificar, inhibir impulsos, sostener atención y cambiar de tarea.",
      why: "Predictor robusto del logro académico; es lo que el contenido muy rápido parece tensionar.",
      cells: [
        { dim: "Cognición", tramo: 2, cert: "m" },
        { dim: "Comportamiento", tramo: 3, cert: "m" },
      ],
      refs: ["christakis2004"],
      related: ["fast-paced", "andamiaje"],
      wiki: "https://es.wikipedia.org/wiki/Funci%C3%B3n_ejecutiva",
    },
    {
      id: "apego",
      term: "Apego seguro",
      grupo: "desarrollo",
      def: "Vínculo estable entre el niño y su cuidador, caracterizado por confianza y disponibilidad emocional.",
      why: "Base del desarrollo socioemocional; es lo que la technoference puede erosionar de forma silenciosa.",
      cells: [
        { dim: "Vínculo", tramo: 0, cert: "m" },
        { dim: "Vínculo", tramo: 1, cert: "h" },
      ],
      refs: ["pder2021"],
      related: ["technoference", "corregulacion"],
      wiki: "https://es.wikipedia.org/wiki/Teor%C3%ADa_del_apego",
    },
    {
      id: "ritmo-circadiano",
      term: "Ritmo circadiano",
      grupo: "desarrollo",
      def: "Ciclo biológico de ~24 horas que regula el sueño y la vigilia; sensible a la luz de pantallas en horas nocturnas.",
      why: "Es el mecanismo por el que la pantalla nocturna retrasa y acorta el sueño infantil.",
      cells: [
        { dim: "Sueño", tramo: 2, cert: "h" },
        { dim: "Sueño", tramo: 3, cert: "h" },
        { dim: "Sueño", tramo: 4, cert: "h" },
      ],
      refs: ["children2020s"],
      related: ["tiempo-recreativo"],
      wiki: "https://es.wikipedia.org/wiki/Ritmo_circadiano",
    },
    {
      id: "conciencia-fonologica",
      term: "Conciencia fonológica",
      grupo: "desarrollo",
      def: "Capacidad de identificar y manipular los sonidos del lenguaje oral; predictor clave del aprendizaje lector.",
      why: "Se desarrolla en la conversación cara a cara, justo lo que la pantalla pasiva desplaza.",
      cells: [
        { dim: "Lenguaje", tramo: 2, cert: "m" },
        { dim: "Lenguaje", tramo: 3, cert: "m" },
      ],
      refs: ["madigan2020"],
      related: ["video-deficit", "andamiaje"],
      wiki: "https://es.wikipedia.org/wiki/Conciencia_fonol%C3%B3gica",
    },
    {
      id: "pensamiento-divergente",
      term: "Pensamiento divergente",
      grupo: "desarrollo",
      def: "Capacidad de generar múltiples soluciones ante un problema; componente central de la creatividad.",
      why: "El juego no estructurado lo entrena; el tiempo de pantalla recreativa compite con ese juego.",
      cells: [
        { dim: "Creatividad", tramo: 2, cert: "m" },
        { dim: "Creatividad", tramo: 3, cert: "l" },
      ],
      refs: [],
      related: ["tiempo-recreativo"],
      wiki: "https://es.wikipedia.org/wiki/Pensamiento_divergente",
    },
    {
      id: "andamiaje",
      term: "Andamiaje del desarrollo",
      grupo: "desarrollo", novel: true,
      def: "Relación de dependencia entre habilidades: algunas capacidades tempranas son prerequisito de otras posteriores.",
      why: "Explica por qué un efecto pequeño en la infancia temprana puede arrastrarse a etapas posteriores.",
      cells: [
        { dim: "Lenguaje", tramo: 1, cert: "h" },
        { dim: "Cognición", tramo: 2, cert: "m" },
      ],
      refs: ["children2020s"],
      related: ["funcion-ejecutiva", "conciencia-fonologica", "video-deficit"],
      wiki: "https://es.wikipedia.org/wiki/Zona_de_desarrollo_pr%C3%B3ximo",
    },
    {
      id: "miopia",
      term: "Miopía",
      grupo: "desarrollo",
      def: "Trastorno refractivo en que los objetos lejanos se ven borrosos; su prevalencia ha aumentado globalmente.",
      why: "La evidencia la asocia más al tiempo en interiores que a la pantalla en sí: un matiz que cambia la recomendación.",
      cells: [
        { dim: "Visión", tramo: 3, cert: "h" },
        { dim: "Visión", tramo: 4, cert: "h" },
      ],
      refs: ["foreman2017"],
      related: ["sedentarismo"],
      wiki: "https://es.wikipedia.org/wiki/Miop%C3%ADa",
    },
    {
      id: "sedentarismo",
      term: "Sedentarismo",
      grupo: "desarrollo",
      def: "Comportamiento de bajo gasto energético en posición sentada; el tiempo de pantalla es uno de sus principales correlatos en niños.",
      why: "Conecta la pantalla con salud física: el efecto suele ser por desplazamiento del movimiento, no directo.",
      cells: [
        { dim: "Actividad física", tramo: 3, cert: "h", chile: true },
        { dim: "Actividad física", tramo: 4, cert: "h" },
      ],
      refs: ["foreman2017"],
      related: ["tiempo-recreativo", "miopia"],
      wiki: "https://es.wikipedia.org/wiki/Sedentarismo",
    },
    {
      id: "displasia",
      term: "Retraso del desarrollo",
      grupo: "desarrollo",
      def: "Alteración en el ritmo o la secuencia del desarrollo esperado para la edad; puede afectar lenguaje, motricidad, cognición o área socioemocional.",
      why: "Es el desenlace que los estudios de cribado vinculan al exceso de pantalla en la primera infancia.",
      cells: [
        { dim: "Lenguaje", tramo: 1, cert: "m" },
        { dim: "Cognición", tramo: 1, cert: "m" },
      ],
      refs: ["madigan2020", "children2020s"],
      related: ["andamiaje", "video-deficit"],
      wiki: "https://es.wikipedia.org/wiki/Trastorno_del_desarrollo",
    },
  ];

  // ── Etiquetas de grupo ────────────────────────────────────────
  const GRUPOS = {
    campo: {
      label: "Conceptos del campo",
      tag: "Campo",
      blurb: "Los términos propios de la investigación sobre pantallas en la infancia: los que probablemente te resultaron nuevos al leer los papers.",
    },
    metodo: {
      label: "Para leer la evidencia",
      tag: "Método",
      blurb: "Cómo se produce y se pondera la evidencia. Te ayudan a interpretar los puntos de certeza de cada celda.",
    },
    desarrollo: {
      label: "Desarrollo infantil",
      tag: "Desarrollo",
      blurb: "El sustrato del desarrollo humano sobre el que actúan las pantallas. Conceptos para entender el «por qué» de cada efecto.",
    },
  };

  const TYPE_LABEL = {
    review: "Revisión",
    meta: "Meta-análisis",
    longitudinal: "Longitudinal",
    guideline: "Guía clínica",
    law: "Normativa",
    chilean: "Chile",
  };

  window.GLOSARIO = { BIBLIO, DIMS, TRAMOS, TERMS, GRUPOS, TYPE_LABEL };
})();
