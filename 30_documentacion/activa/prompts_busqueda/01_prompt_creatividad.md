# Prompt de búsqueda bibliográfica — Creatividad y juego × pantallas en niños de 0 a 12 años

## CONTEXTO

Estoy construyendo una síntesis crítica de evidencia científica sobre crianza y pantallas en niños de 0 a 12 años, con anclaje en evidencia 2020-2026. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios:

- Tramos etarios: `lactante` (0-12 meses), `primera-infancia` (1-3 años), `preescolar` (3-5 años), `ninez-media` (6-8 años), `preadolescencia` (9-12 años).

Necesito que actúes como agente especializado en revisión bibliográfica. Tu output será procesado posteriormente para integrar al corpus existente del sitio, así que la calidad y rastreabilidad de las referencias es lo más importante.

## VENTANA TEMPORAL

- Rango principal: **2020 a 2026 inclusive**.
- Excepción declarada: documentos institucionales fundacionales (AAP, OMS, OECD, UNICEF, ministerios) anteriores a 2020 son aceptables solo si funcionan como anchor normativo aún citado en la literatura actual. Marcarlos explícitamente como "anchor pre-2020".

## CALIDAD DE EVIDENCIA — JERARQUÍA

Prioriza en este orden:

1. Meta-análisis y revisiones sistemáticas de alta calidad (PRISMA-compliant, idealmente Cochrane).
2. Cohortes longitudinales prospectivas con N > 1.000.
3. Ensayos controlados aleatorizados (raros en este campo).
4. Estudios transversales grandes (N > 5.000) con análisis multivariado y control de confusores.
5. Documentos institucionales recientes (AAP 2024-2026, OMS post-2019, ministerios).
6. Revisiones de alcance (scoping reviews) — incluir solo si no hay revisión sistemática equivalente.

**Descarta** estudios pequeños transversales (N < 500) sin justificación metodológica especial. **Descarta** opiniones, comentarios editoriales, notas de prensa.

## REGLAS ANTI-ALUCINACIÓN (críticas)

Tres bugs específicos detectados en agentes anteriores que NO debes reproducir:

1. **NO inventes autoría.** Si no puedes verificar el primer autor directamente desde PubMed, DOI o el journal, **omite el paper**. Es preferible un output de 7 papers verificados que 15 con autoría posiblemente alucinada.

2. **NO infieras DOIs.** Cada paper debe traer un DOI o PMID que resuelva a la página correcta. Si no encuentras el identificador, declara `URL: NO VERIFICABLE` y márcalo como bandera.

3. **NO reescribas hallazgos.** Si vas a citar un dato cuantitativo (N, effect size, OR, %), debe venir literal del abstract o del paper. Si parafraseas, declara que es paráfrasis. No inventes cifras que "suenan plausibles".

## CONOCIMIENTO DEL CORPUS EXISTENTE

El sitio ya integró los siguientes papers en sesiones anteriores. Si te encuentras con uno de estos, **NO lo propongas como nuevo**: márcalo como "ya integrado, propongo nuevas tributaciones si aplica".

Papers ya integrados (al cierre de sesión 4 / commit `baee3ed`):

```
AAP2016, AAP2024, AAP2026, AguilarFarias2021, Bakht2025, Bal2024,
Bustamante2023, Dutra2025, Eirich2022, EYSTAG2026, Fitzpatrick2024,
Foreman2021, Foreman2024, Gath2025, Gomes2024, Ha2025, He2025,
Jusiene2024, Karani2022, LlanosMerin2024, Madigan2020,
Mallawaarachchi2024, MINEDUC2026, Mori2026, NSF2024,
ObservatorioNutricional2025, PaezHerrera2025, Pearson2018,
SanchezMiguel2024, Sanders2024, SotoRamirez2025, Sticca2025,
ToledoVargas2025, UNICEF2024, Vasconcellos2025, WHO2019
```

(Esta lista puede no estar al día; cuando dudes, márcalo.)

## DIMENSIÓN ESPECÍFICA: CREATIVIDAD Y JUEGO (`creatividad`)

Buscar evidencia científica reciente (2020-2026) sobre el impacto del uso de pantallas en la creatividad y el juego infantil en niños de 0 a 12 años.

### Sub-temas a cubrir

1. **Pensamiento divergente y fluidez creativa.** Tests estandarizados (Torrance, Wallach-Kogan) y su asociación con uso de pantallas.
2. **Juego simbólico libre.** Capacidad de inventar, transformar objetos, crear escenarios; tiempo dedicado vs. tiempo en pantalla.
3. **Aburrimiento como precursor de creatividad.** El rol del aburrimiento no medicado por pantalla.
4. **Imaginación narrativa.** Cuentos inventados, juego de roles, construcción de mundos.
5. **Pantalla creativa vs. pantalla consumo.** Diferencia entre apps de creación (Minecraft modo creativo, ScratchJr, apps de dibujo) y consumo pasivo.
6. **Maker culture y educación STEAM digital** (programación, robótica educativa) en niñez media.
7. **Juego al aire libre estructurado vs. no estructurado** como alternativa a pantallas.
8. **Producción creativa propia** (videos hechos por los niños, no consumidos) y su impacto en habilidades.

### Lo que ya tenemos integrado (no proponer como nuevos)

Esta dimensión está poco poblada en el corpus actual; cualquier hallazgo robusto es bienvenido.

### Foco específico de novedad

Esta es una dimensión con **alta sed de evidencia**:

- La literatura sobre creatividad y pantallas es comparativamente escasa frente a sueño, cognición o salud mental.
- Necesitamos meta-análisis o revisiones sistemáticas si existen; si no, las mejores cohortes longitudinales disponibles.
- Estudios sobre **juego libre y desarrollo creativo** post-pandemia (donde se observó disminución de juego al aire libre).
- Evidencia sobre apps de creación específicas (no genéricas): ¿Minecraft, Scratch, Roblox creativo, generan creatividad real transferible?
- Distinción rigurosa entre **consumo de contenido creativo** (ver a alguien dibujar) y **producción propia** (dibujar).
- Estudios sobre **aburrimiento y creatividad infantil** con métricas conductuales, no solo autorreporte.
- Evidencia latinoamericana, si existe, sobre juego infantil y pantallas.

## FORMATO DE RESPUESTA

Para cada paper devuelve este bloque markdown, en este orden estricto. No agregues secciones. No omitas campos. Si un campo no aplica, escribe "No aplica" con justificación de una línea.

```markdown
### [ApellidoPrimerAutorAño]

**Cita completa:** Apellido N., Apellido N., et al. AÑO. Título completo. Journal volumen(número):páginas.

**Tipo:** meta-análisis / revisión sistemática / scoping review / cohorte longitudinal / transversal / ECA / guía oficial / norma jurídica / reporte técnico.

**Muestra:** N=XX.XXX participantes. K estudios incluidos (si aplica). Rango etario X-Y años. País/región.

**Hallazgo central (literal o paráfrasis declarada):** [3-5 líneas. Si hay cifras, son del abstract verbatim. Si parafraseas, declarar "(paráfrasis)".]

**Tributa a la dimensión `creatividad`, tramos etarios:**
- `[tramo-etario]` con certeza **alta/media/baja**. Justificación: [una línea sobre por qué encaja en ese tramo].
- [repetir si tributa a más de un tramo etario]

**Banderas metodológicas o de aplicabilidad:**
- [bandera 1: heterogeneidad, sesgo de selección, dependencia de autoreporte, contexto cultural específico, etc.]
- [bandera 2 si aplica]

**¿Probablemente ya integrado en el corpus?** Sí / No / Posible (justificar en una línea).

**URL/DOI:** https://doi.org/... o PubMed PMID.

---
```

## OUTPUT FINAL ESPERADO

10-15 papers de la calidad especificada, cada uno con el bloque markdown completo, ordenados por **calidad de evidencia** (meta-análisis y revisiones primero, luego longitudinales, luego transversales, institucionales al final).

Al cierre, dame una **sección de "vacíos de evidencia detectados"**: 2-4 áreas dentro de la dimensión que están sub-investigadas o que tienen evidencia contradictoria, en 2-3 líneas cada una.
