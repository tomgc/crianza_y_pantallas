# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v11
- **Fecha:** 2026-05-31
- **Sesión:** 11 — SEO básico (P-QA: meta tags, og:image, canonical) y cierre de los 11 claims empíricos sin referencia (P1/P3); más un diagrama de arquitectura del proyecto.
- **Modelo utilizado:** Claude Sonnet 4.6
- **Entorno:** Web estático (HTML/CSS/JS, GitHub Pages)
- **Archivos principales modificados:** `10_fuentes/template.html`, `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`, `30_documentacion/activa/CLAUDE.md`, `assets/og-image.png` (nuevo)

---

## 2. Resumen ejecutivo

La sesión 11 cerró dos pendientes de prioridad alta y agregó un artefacto de documentación. El primero fue P-QA (SEO básico): se creó la imagen Open Graph del sitio (diseñada en Claude Design, convertida a PNG en sesión), se agregaron meta tags `description`, `robots`, canonical, Open Graph completo y Twitter Card a `template.html`, y se subió `assets/og-image.png` al repo; el deploy fue verificado con `curl` (HTTP 200 + `og:image` presente en el HTML servido). El segundo fue P1/P3: se buscaron referencias para los 11 claims empíricos pendientes, se encontraron fuentes para los 11 (8 entradas nuevas en `bibliography.json`, 3 reutilizadas), se corrigió el texto de `lenguaje-primera-infancia[1]` (el umbral de 86 min no existe en la fuente; se reemplazó por la descripción real del efecto continuo), y se aplicaron los patches con validación cruzada completa (139 claims, 54 `no_ref`, 0 pendientes reales, 91 entradas, 0 huérfanos). También se corrigió una referencia desactualizada en `CLAUDE.md` (apuntaba a v05, corregida a v10). Como cierre, se generó un diagrama HTML de arquitectura del proyecto (estilo del diagrama de Seguimiento Educación Inicial), disponible en `30_documentacion/activa/arquitectura_crianza_pantallas.html`. Al cierre el repo está en commit `6598416`, assert de integridad en 0, sitio desplegado y working tree limpio.

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Sitio en vivo en `https://tomgc.github.io/crianza_y_pantallas/` — `main` en `6598416`.
- Pipeline modular completo: build reproducible desde JSONs vía `./00_build.sh`.
- Matriz 10×5: 50 celdas, 139 claims, chips `[ref]` navegables, popovers bibliográficos.
- 4 tabs en header (Matriz, Glosario, Bibliografía, Metodología).
- Footer de contacto en todas las vistas.
- Bibliografía: filtros + buscador sticky en móvil (≤960px).
- 54 claims interpretativos con `"no_ref": true`.
- **0 claims empíricos pendientes de ref** (assert de integridad limpio desde esta sesión).
- **SEO completo:** meta description, robots, canonical, Open Graph (title/description/image/type/url + width/height), Twitter Card. og:image servida en 200 desde GitHub Pages.
- `CLAUDE.md` actualizado a v10.
- Responsive: scroll horizontal en grilla móvil; ficha en columna única bajo 960px.
- Bibliografía filtrable: 91 entradas. Glosario interactivo modo matriz: 22 términos.

### Qué no funciona / deuda conocida

- **Dos fuentes bibliográficas paralelas:** `window.GLOSARIO.BIBLIO` (9 entradas en `glosario-data.js`) vs. `window.__DATA__.bibliografia` (91 entradas). No bloqueante pero puede divergir.
- **Archivos en `10_fuentes/` sin prefijos numéricos** — deuda estructural no urgente.
- **Ma2025 excluido del corpus:** DOI no verificable. Pendiente resolver entre sesiones.
- **Glosario móvil:** índice compacto pendiente (D).
- **Texto del subtítulo hardcodeado** en `renderTopBar()` de `app.js`, no en `metadata.json`.

### Qué cambió respecto al traspaso v10

| Aspecto | v10 | v11 |
|---|---|---|
| Claims pendientes (P1/P3) | 11 | **0** |
| Entradas bibliografía | 83 | **91** (+8) |
| SEO / Open Graph | Ausente | **Presente y verificado** |
| og:image | Ausente | **assets/og-image.png** (1200×630) |
| CLAUDE.md handoff reference | v05 | **v10** |
| Commit HEAD | `8f08aeb` | **`6598416`** |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Imagen Open Graph (og:image)

- **Archivo(s) afectado(s):** `assets/og-image.png` (nuevo archivo)
- **Categoría temática:** Infraestructura / herramientas operativas
- **Qué se hizo:** Diseño encargado a Claude Design (SVG 1200×630px, paleta exacta del sitio: navy `#042f4d`, amarillo `#f4dd8a`, azules claros). SVG convertido a PNG con `cairosvg` en sesión. PNG subido a `assets/og-image.png` en el repo.
- **Por qué se hizo:** Las redes sociales y WhatsApp muestran una preview visual cuando se comparte la URL. Sin og:image solo aparece texto; con imagen el share se ve profesional y aumenta el CTR.
- **Cómo se verificó:** `curl -s -o /dev/null -w "%{http_code}" https://tomgc.github.io/crianza_y_pantallas/assets/og-image.png` → 200. Imagen visual revisada y aprobada por el usuario.
- **Dependencias afectadas:** Referenciada por las meta tags agregadas en el Cambio 2.
- **Commit:** `683473f`

#### Cambio 2: Meta tags SEO y Open Graph en `template.html`

- **Archivo(s) afectado(s):** `10_fuentes/template.html`, `index.html` (regenerado)
- **Categoría temática:** Infraestructura / herramientas operativas
- **Qué se hizo:** Reemplazo del bloque `<head>` de `template.html` con: `<meta name="description">`, `<meta name="robots" content="index, follow">`, `<link rel="canonical">`, `<meta property="og:type/url/title/description/image">`, `<meta property="og:image:width/height">`, `<meta name="twitter:card/title/description/image">`. URL canónica: `https://tomgc.github.io/crianza_y_pantallas/`. Build regenerado.
- **Por qué se hizo:** Completar P-QA: las meta tags son el mínimo para que buscadores indexen correctamente y redes sociales muestren preview correcta.
- **Cómo se verificó:** `curl -s https://tomgc.github.io/crianza_y_pantallas/ | grep -o '<meta property="og:image"[^>]*>'` devuelve la tag. Verificado post-deploy.
- **Dependencias afectadas:** Depende de `assets/og-image.png` estando disponible en el repo.
- **Commit:** `683473f`

#### Cambio 3: Housekeeping — traspaso v10 y escáner versionados

- **Archivo(s) afectado(s):** `30_documentacion/traspasos/traspaso-cierre-v10.md`, `30_documentacion/estructura/` (snapshots)
- **Categoría temática:** Documentación / gobernanza
- **Qué se hizo:** Commit de los archivos de apertura de sesión que habían quedado untracked: traspaso v10 y escáner de apertura sesión 11.
- **Por qué se hizo:** Mantener el repo como fuente de verdad del estado del proyecto.
- **Cómo se verificó:** `git status` limpio tras commit.
- **Commit:** `8f08aeb`

#### Cambio 4: P1/P3 — referencias para los 11 claims empíricos

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`, `index.html` (regenerado)
- **Categoría temática:** Corrección de integridad bibliográfica
- **Qué se hizo:** Búsqueda bibliográfica dirigida para los 11 claims empíricos. Resultado: 8 entradas nuevas en `bibliografia.json` (`Bernardi2023`, `Fish2026`, `OECD2023`, `Savva2022`, `CMO2019`, `Zong2024`, `Lee2026`, `Saleem2024`) y 3 reutilizadas (`Janssen2020`, `LiuH2024`, ya existentes). Corrección de texto en `lenguaje-primera-infancia[1]`: el umbral de "86 minutos" no existe en la fuente (Fish et al./COT20s 2026 reporta una relación continua, no un umbral); texto reescrito para reflejar el efecto real (vocabulario de niños con más pantalla vs. menos). Patches aplicados a los 11 claims. Build regenerado.
- **Por qué se hizo:** El assert de integridad reportaba 11 pendientes reales desde v10. La deuda epistémica impide citar los claims como respaldados por evidencia.
- **Cómo se verificó:** Validación cruzada Python: total=139, no_ref=54, pendientes=0, bibliografía=91, duplicados=0, huérfanos=0. Gate cumplido antes de commit.
- **Dependencias afectadas:** `index.html` regenerado (+214 líneas respecto al anterior).
- **Commit:** `3ab9c2f`

#### Cambio 5: `CLAUDE.md` — referencia de handoff actualizada

- **Archivo(s) afectado(s):** `30_documentacion/activa/CLAUDE.md`
- **Categoría temática:** Documentación / gobernanza
- **Qué se hizo:** Línea 33: reemplazado `traspaso-cierre-v05.md` por `traspaso-cierre-v10.md`.
- **Por qué se hizo:** La referencia apuntaba al handoff de la sesión 5; el proyecto lleva 10 sesiones adicionales.
- **Cómo se verificó:** `git diff` confirmó cambio en línea 33, línea 16 (patrón genérico `vNN`) intacta.
- **Commit:** `6598416`

#### Cambio 6: Diagrama de arquitectura HTML

- **Archivo(s) afectado(s):** `30_documentacion/activa/arquitectura_crianza_pantallas.html` (nuevo)
- **Categoría temática:** Documentación / gobernanza
- **Qué se hizo:** Diagrama HTML standalone (mismo sistema visual que el diagrama de Seguimiento Educación Inicial) que documenta las 6 capas del proyecto: datos JSON → código JS/CSS → template HTML → build (`00_build.sh`) → `index.html` → GitHub Pages. Incluye estadísticas reales del proyecto, bloque de código con comandos canónicos y leyenda de colores.
- **Por qué se hizo:** El proyecto tiene una arquitectura no convencional (build estático, sin framework, sin servidor) que conviene documentar visualmente para facilitar onboarding y sesiones futuras.
- **Cómo se verificó:** Revisión visual del HTML en navegador.
- **Nota:** No commiteado aún — pendiente para la próxima sesión o entre sesiones.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020–2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON vía `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1–4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación.*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~12% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~10% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Limpieza editorial | ~23 | ~11% | Eliminación de citas inline, expansión de siglas, corrección de textos |
| Corrección de integridad bibliográfica | ~21 | ~10% | Huérfanas, mismatches, refs vacíos, `no_ref: true`, P1/P3 resueltos |
| Incorporación de evidencia | ~24 | ~12% | Sesiones 4, 9 y 11: papers, ediciones de claims, claims nuevos por dimensión |
| Diseño visual y UX | ~31 | ~15% | Wireframe B, paleta, responsive, estilos, footer, sticky móvil |
| Implementación de motor JS | ~14 | ~7% | `app.js`, render, panel lateral, popovers, deep linking; glosario interactivo |
| Bibliografía y popovers | ~7 | ~3% | Diseño del popover, navegación, filtros |
| Infraestructura / herramientas operativas | ~13 | ~6% | Escáner, flujo de incorporación, prompts modulares, publicación, build, SEO, og:image |
| Documentación / gobernanza | ~12 | ~6% | CLAUDE.md, README, convenciones, traspasos, diagrama arquitectura |
| Andamiaje entre celdas | ~5 | ~2% | Cascadas entre celdas |
| Corrección factual | ~2 | ~1% | 5 Cs AAP, certeza de la evidencia |
| Deuda técnica / limpieza de código | ~3 | ~1% | Código muerto, handlers inertes, CSS obsoleto |

**Total estimado: ~200**

### 5.4 Resumen estadístico por sesión

| Sesión | Traspaso | N° cambios | Modelo | Foco principal |
|---|---|---|---|---|
| 1 | v01 | ~30 | Sonnet/Opus | Wireframe inicial React standalone |
| 2 | v02 | ~35 | Opus | Migración a estructura modular |
| 3 | v03 | ~35 | Opus | Build reproducible, JSONs validados, Fase 0–3 |
| entre 3–4 | — | ~3 | Sonnet | Fase 4 app.js, UX fix |
| 4 | v04 | 6 (con 27 sub-ediciones) | Opus | Bibliografía + prompts modulares |
| 5 | v05 | ~20 | Sonnet 4.6 | Infraestructura, limpieza editorial, integridad bibliográfica |
| 6 | v06 | ~17 | Sonnet 4.6 | Integridad bibliográfica, glosario, publicación |
| 7 | v07 | ~12 | Sonnet 4.6 | Responsive + glosario interactivo modo matriz |
| 8 | v08 | ~4 | Sonnet 4.6 | Estandarización de anchos + backlog UI |
| 9 | v09 | ~11 | Sonnet 4.6 | UI: selectores + fusión vistas + subtítulo; batch cognición |
| 10 | v10 | ~11 | Sonnet 4.6 | Footer contacto, sticky móvil, código muerto, no_ref |
| 11 | v11 | ~8 | Sonnet 4.6 | SEO + og:image (P-QA); 11 refs empíricos (P1/P3); arquitectura |

**Total acumulado: ~200 cambios.**

### 5.5 Detalle cronológico de cambios por sesión

### Sesiones 1–5 — ver traspaso v05 (ítems 1–22)

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v05.md`, sección 5.5.)*

---

### Sesión 6 (Sonnet 4.6) — 2026-05-29

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v06.md`, sección 5.5, ítems 23–39.)*

---

### Sesión 7 (Sonnet 4.6) — 2026-05-29

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v07.md`, sección 5.5, ítems 40–50.)*

---

### Sesión 8 (Sonnet 4.6) — 2026-05-30

Estandarización visual de anchos y acumulación de backlog UI.

51. Variables CSS `--content-width: 700px`, `--page-pad-x: 32px`, `--page-pad-y: 28px` introducidas en `:root`. `.page-pane` y `.gl-ficha-pane` usan las variables. `.gl-ficha` cambió de 560px a `var(--content-width)`. `.page-pane` cambió de 920px a `var(--content-width)`. `.page-body` eliminado. `.text-section-title` igualado a 14px. Override de variables en media query 960px.
52. Traspaso v07 commiteado (`ed11ea2`).
53. Rama `refactor/modular-build` eliminada local y remota (verificado ancestro completo de `main`).

---

### Sesión 9 (Sonnet 4.6) — 2026-05-30

UI: eliminación de selectores de tramo, fusión de vistas, subtítulo del sitio, corrección de padding móvil. Batch bibliográfico dimensión cognición.

54. Selector de tramo etario eliminado del índice del glosario (`renderGlosarioIndex()`). Intro simplificada. Código muerto de handler queda inerte.
55. Selector de tramo etario eliminado de la topbar de la Matriz (`renderTopBar()`). Bloque condicional `state.view === "matriz"` eliminado.
56. Tab "Limitaciones" eliminado del array de tabs. `renderMetodologia()` fusiona secciones de `methodology` y `limitations`. `renderLimitaciones()` redirige a `renderMetodologia()`.
57. Título de Metodología cambiado a "Cómo leemos la evidencia"; bajada actualizada.
58. Subsección "Decisiones editoriales" filtrada al render. Texto permanece en `metadata.json`.
59. Subtítulo descriptivo del sitio agregado bajo el brand (`<p class="brand-desc">`). `.topbar-left` cambia a `align-items: flex-start`. `.brand-desc` definido en CSS; oculto en móvil (≤960px).
60. Padding hardcodeado de `.gl-ficha-pane` en media query 960px eliminado. Variables CSS cubren el caso.
61. 9 entradas bibliográficas nuevas a `bibliografia.json` (74→83): `ChenJ2023`, `Hinten2025`, `LiuH2024`, `LiX2025`, `Mona2026`, `Paulich2021`, `Shou2025`, `TaheryanSong2025`, `Thorell2024`.
62. 5 ediciones a claims existentes en `claims.json`: `cognicion-primera-infancia[2]`, `cognicion-preescolar[0]`, `cognicion-preescolar[1]`, `cognicion-preescolar[3]`, `cognicion-ninez-media[0]`.
63. 6 claims nuevos en `claims.json` (133→139): `cognicion-primera-infancia[4]`, `cognicion-ninez-media[3]`, `cognicion-ninez-media[4]`, `cognicion-preadolescencia[3]`, `cognicion-preadolescencia[4]`, `cognicion-preadolescencia[5]`.
64. Prompt batch cognición (`09_resultados_codigo_prompt_cognicion.md`) trackeado y commiteado.

---

### Sesión 10 (Sonnet 4.6) — 2026-05-31

Footer de contacto, nota en Metodología, bibliografía sticky móvil, limpieza de código muerto, política `no_ref: true`.

65. Footer de contacto agregado a `template.html`: email codificado en entidades HTML + LinkedIn. Estilos `.site-footer`, `.footer-sep`, `.footer-link` en `styles.css`.
66. Nota de contacto al final de `renderMetodologia()` en `app.js`. Estilos `.contact-note`, `.contact-link` en `styles.css`.
67. Código muerto eliminado de `app.js`: handler `age-sel`, handler `gl-tramo-sel`, restore en init IIFE, bloque `syncTopBarActive()`.
68. Regla CSS muerta `.gl-tramo-sel { }` eliminada de `styles.css`.
69. Bibliografía sticky en móvil: `.page-pane { overflow: visible }` + `.biblio-controls { position: sticky; top: 0; ... }` en `@media (max-width: 960px)`.
70. 54 claims interpretativos marcados con `"no_ref": true` en `claims.json`. Assert queda en 11 pendientes reales.
71. Traspaso v09 y escáner commiteados (`e4d968a`, `6478d45`).

---

### Sesión 11 (Sonnet 4.6) — 2026-05-31

SEO + og:image (P-QA), cierre de 11 refs empíricos (P1/P3), doc-fix CLAUDE.md, diagrama de arquitectura.

72. Imagen Open Graph creada (diseño Claude Design, conversión PNG con `cairosvg`). Subida a `assets/og-image.png` (1200×630px, 42 KB).
73. Meta tags SEO agregados a `template.html`: `description`, `robots`, canonical, og:type/url/title/description/image/width/height, twitter:card/title/description/image. Build regenerado.
74. Traspaso v10 y escáner apertura sesión 11 commiteados (`8f08aeb`).
75. 8 entradas nuevas en `bibliografia.json` (83→91): `Bernardi2023`, `Fish2026`, `OECD2023`, `Savva2022`, `CMO2019`, `Zong2024`, `Lee2026`, `Saleem2024`.
76. Referencias asignadas a los 11 claims P1/P3 en `claims.json`. Texto de `lenguaje-primera-infancia[1]` corregido (umbral ficticio de 86 min eliminado; reemplazado por descripción real del efecto continuo de Fish et al. 2026). Assert de integridad: 0 pendientes reales.
77. `CLAUDE.md` actualizado: referencia de handoff corregida de v05 a v10 (línea 33).
78. Diagrama HTML de arquitectura del proyecto generado (`arquitectura_crianza_pantallas.html`). No commiteado aún.

---

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron 7 ítems nuevos (72–78) correspondientes a la sesión 11.
- "Corrección de integridad bibliográfica" creció de ~19 a ~21 (P1/P3: 11 refs asignadas + corrección texto).
- "Incorporación de evidencia" creció de ~24 a ~24 (estable; las refs P1/P3 van en integridad).
- "Infraestructura / herramientas operativas" creció de ~10 a ~13 (og:image, meta tags SEO).
- "Documentación / gobernanza" creció de ~9 a ~12 (CLAUDE.md fix, diagrama arquitectura, traspaso housekeeping).
- Total estimado pasó de ~192 a ~200.

---

## 6. Bugs encontrados y su resolución

No aplica en esta sesión. No se encontraron bugs durante la implementación. La única corrección fue editorial (texto de `lenguaje-primera-infancia[1]`), no técnica.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Los "adjuntos" del chat web no llegan al filesystem de Claude Code como archivos físicos automáticamente. Claude Code debe recibirlos colocados manualmente en una ruta del proyecto.
  - **Principio:** B.1 (no asumir el estado del entorno).
  - **Contexto:** La og:image y los JSONs generados en el chat web no aparecen en el filesystem de Claude Code hasta que el usuario los deposita manualmente. Claude Code debe localizar y validar antes de reemplazar archivos críticos.
  - **Ejemplo:** `og-image.png` apareció en `~/Desktop` (no en Downloads ni en la ruta del proyecto). Los JSONs de claims/bibliografía se colocaron directamente en `10_fuentes/data/`.

- **Regla:** El umbral de "86 minutos" no existe en el estudio Children of the 2020s. El efecto es continuo, no umbral.
  - **Principio:** C.11 (trazabilidad — los datos deben reflejar lo que la fuente dice, no una interpretación).
  - **Contexto:** `lenguaje-primera-infancia[1]` contenía un dato específico (86 min) que no aparece en ninguna publicación del COT20s. Fish et al. (2026) reporta diferencias en vocabulario entre quintiles de uso, no un umbral.

- **Regla:** Las redes sociales cachean la preview de og:image en el primer scrape. Para forzar refresh, usar el debugging tool de la plataforma (Facebook Sharing Debugger, LinkedIn Post Inspector, etc.).
  - **Principio:** C.13 (logging y observabilidad — verificar el estado real del deploy).
  - **Contexto:** Puede que al compartir inmediatamente después del deploy la preview se vea incompleta. No es un bug del sitio; es caché de la red social.

*(Reglas anteriores vigentes: ver secciones 7 de traspasos v06–v10.)*

---

## 8. Decisiones de diseño tomadas

#### Decisión 1 (v11): og:image como SVG convertido a PNG, no imagen generada por IA directamente

- **Decisión:** og:image diseñada como SVG por Claude Design (herramienta externa), convertida a PNG con `cairosvg` en sesión.
- **Alternativas consideradas:** (a) SVG directo en el repo (las redes sociales no aceptan SVG en og:image); (b) imagen generada con herramienta de imagen de IA; (c) captura de pantalla del sitio.
- **Justificación:** El SVG permite edición posterior sin pérdida de calidad. La conversión a PNG en sesión elimina dependencia de herramientas externas en futuros builds. El diseño con Claude Design produjo un resultado visualmente coherente con la paleta del sitio.
- **Implicancia:** El SVG fuente no está en el repo (solo el PNG). Si se quiere reeditar la imagen, hay que regenerarla.

#### Decisión 2 (v11): Corrección de texto de claim en lugar de marcar `no_ref: true`

- **Decisión:** `lenguaje-primera-infancia[1]` corregido con texto fiel a la fuente (Fish et al. 2026), no marcado como `no_ref: true`.
- **Alternativas consideradas:** Marcar `no_ref: true` y dejar el texto tal cual (deja un dato falso en el sitio).
- **Justificación:** El claim cita un dato empírico (ahora corregido al efecto real). `no_ref: true` es para claims interpretativos que no tienen respaldo directo por diseño, no para claims con datos incorrectos. La corrección es la opción editorialmente correcta.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| `--content-width` | 700px | `10_fuentes/styles.css` | Aplica a vistas secundarias |
| `--page-pad-x` | 32px (desktop) / 18px (≤960px) | `10_fuentes/styles.css` | |
| `--page-pad-y` | 28px (desktop) / 20px (≤960px) | `10_fuentes/styles.css` | |
| Tabs en header | 4 (Matriz, Glosario, Bibliografía, Metodología) | `10_fuentes/app.js` | |
| Tramos etarios | 5 | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Dimensiones | 10 | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Certeza levels | h / m / l | `10_fuentes/data/metadata.json` + `app.js` | Alta/Media/Baja |
| Términos glosario | 22 | `10_fuentes/glosario-data.js` | `window.GLOSARIO` |
| Refs bibliografía principal | **91** | `10_fuentes/data/bibliografia.json` | +8 desde v10 |
| Refs bibliografía glosario | 9 | `10_fuentes/glosario-data.js` | Fuente paralela — deuda técnica |
| Total claims | 139 | `10_fuentes/data/claims.json` | Sin cambios en v11 |
| Claims con `no_ref: true` | 54 | `10_fuentes/data/claims.json` | Sin cambios en v11 |
| Claims pendientes (P1/P3) | **0** | `10_fuentes/data/claims.json` | Resueltos en v11 |
| URL publicada | `https://tomgc.github.io/crianza_y_pantallas/` | GitHub Pages desde `main` | Activa en `6598416` |
| Rama de trabajo | `main` directo | Git | Sin rama feature activa |
| Email de contacto | `tgonzalez@gmail.com` | `template.html`, `app.js` | Codificado en entidades HTML |
| LinkedIn | `https://www.linkedin.com/in/tomasgonzalezcifuentes/` | `template.html`, `app.js` | |
| og:image | `assets/og-image.png` | repo raíz | 1200×630px, 42 KB |
| canonical URL | `https://tomgc.github.io/crianza_y_pantallas/` | `template.html` | |

---

## 10. Arquitectura de archivos relevante

Referencia: `30_documentacion/estructura/estructura_actual.md` (escáner ejecutado al abrir sesión 11, 2026-05-31 12:59:50).

**Cambios estructurales en esta sesión:**
- `assets/og-image.png` — nuevo archivo.
- `10_fuentes/template.html` — `<head>` reemplazado con meta tags SEO + OG.
- `10_fuentes/data/claims.json` — 11 refs asignadas, 1 texto corregido.
- `10_fuentes/data/bibliografia.json` — 83 → 91 entradas.
- `30_documentacion/activa/CLAUDE.md` — línea 33 actualizada.
- `30_documentacion/activa/arquitectura_crianza_pantallas.html` — nuevo (pendiente commit).

**Verificación contra política:**
- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Excepción documentada (Decisión 1, v05).
- ⚠️ Archivos en `10_fuentes/` sin prefijos numéricos (P-ESTRUCTURA, diferido).
- Sin `40_salidas/`: excepción documentada (output es `index.html` en raíz).

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente A: Commitear diagrama de arquitectura

- **Descripción:** `30_documentacion/activa/arquitectura_crianza_pantallas.html` generado en sesión 11 pero no commiteado.
- **Tipo:** Documentación.
- **Impacto:** Sin urgencia funcional. Bajo.
- **Complejidad:** Baja — solo `git add + commit + push`.
- **Criterio de éxito:** Archivo versionado en repo.

#### Pendiente D: Glosario móvil — rediseño de índice

- **Descripción:** En móvil el índice ocupa demasiado espacio antes de la ficha. Necesita presentación más compacta (índice colapsable o chips compactos).
- **Tipo:** UI / UX móvil.
- **Complejidad:** Media-alta. Sesión dedicada. Requiere `app.js` + `styles.css`.
- **Criterio de éxito:** Usuario llega a ficha de término con scroll mínimo en móvil.

#### Pendiente P4: Unificar fuentes bibliográficas

- **Descripción:** `window.GLOSARIO.BIBLIO` (9) vs. `window.__DATA__.bibliografia` (91). Riesgo de divergencia creciente.
- **Tipo:** Deuda técnica.
- **Complejidad:** Media.
- **Criterio de éxito:** Una sola fuente de verdad bibliográfica. 0 entradas duplicadas o divergentes.

#### Pendiente P5: Glosario modos alpha y relevancia

- **Tipo:** Funcionalidad nueva.
- **Complejidad:** Media (~1 sesión).
- **Criterio de éxito:** Toggle alpha/relevancia funcional en la vista glosario.

#### Pendiente P6: Fase 6 — adolescencia

- **Tipo:** Contenido / funcionalidad nueva (nuevo tramo etario o nueva dimensión).
- **Complejidad:** Alta. Sesión dedicada.

#### Pendiente P7: Actualizar prompts de búsqueda bibliográfica

- **Tipo:** Documentación.
- **Complejidad:** Baja. Entre sesiones.

#### Pendiente P8: PDFs UNICEF/CJE UC

- **Tipo:** Documentación. ~10 minutos. Entre sesiones.

#### Pendiente P-ESTRUCTURA: Prefijos numéricos en `10_fuentes/`

- **Descripción:** `app.js`, `styles.css`, `template.html`, `glosario-data.js` y JSONs en `10_fuentes/data/` sin prefijo numérico.
- **Tipo:** Deuda estructural.
- **Complejidad:** Media. Requiere `prompt_migrar_estructura.md` y DRY_RUN.
- **Precaución:** No combinar con otras ediciones. Sesión dedicada con commit limpio previo. Actualizar marcadores en `template.html` y lógica en `00_build.sh`.
- **Criterio de éxito:** Build OK después de renombrar; 0 referencias a nombres antiguos.

#### Pendiente Ma2025: Verificar DOI y completar autores

- **Tipo:** Deuda epistémica. Entre sesiones.
- **Criterio de éxito:** DOI verificado, autores completos, entrada integrada al corpus.

#### Pendiente Batch-bibliográfico: Siguiente dimensión

- **Descripción:** Con P1/P3 resueltos, el próximo batch bibliográfico puede incorporar una dimensión nueva sin acumular pendientes.
- **Tipo:** Incorporación de evidencia.
- **Complejidad:** Media (~1 sesión). Usar prompts en `30_documentacion/activa/prompts_busqueda/`.
- **Criterio de éxito:** Claims nuevos con refs asignadas desde el inicio. Assert = 0 tras el batch.

### 11.2 Evaluación de deuda técnica

- **Dos fuentes bibliográficas paralelas:** con la bibliografía en 91, el riesgo de divergencia es mayor que cuando la glosario tenía 9 vs. 74. Conveniente unificar antes de que el glosario crezca más.
- **Archivos sin prefijos en `10_fuentes/`:** deuda estructural no urgente. Sesión dedicada cuando el contenido esté más estable. No mezclar con ediciones de contenido.
- **SVG fuente de og:image no versionado:** si se quiere editar la imagen en el futuro, hay que regenerarla desde cero. Riesgo bajo pero documentado.

### 11.3 Auditoría de cierre

- **¿Cada bloque de transformación tiene check de validación? (C.8)** → Sí. Validación cruzada Python antes de cada commit bibliográfico (total, no_ref, pendientes, huérfanos, duplicados).
- **¿Los outputs son reproducibles e idempotentes? (C.2, C.3)** → Sí. `./00_build.sh` regenera `index.html` desde fuentes sin estado intermedio.
- **¿Hay decisiones metodológicas documentadas como constantes con nombre? (C.11)** → Sí. Variables CSS con nombres semánticos. Email y LinkedIn documentados en sección 9.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Commitear diagrama de arquitectura (A)** — trivial, 5 min. Limpiar el working tree antes de empezar otra cosa.
2. **Próximo batch bibliográfico** — con P1/P3 a cero, es el momento de agregar una dimensión nueva sin acumular deuda. Elegir dimensión; usar prompt modular correspondiente.
3. **D — Glosario móvil rediseño** — sesión dedicada cuando haya energía para UI compleja.
4. **P4 — Unificar fuentes bibliográficas** — priorizar antes de que la bibliografía crezca mucho más.

**Diferir:**
- P-ESTRUCTURA — sesión dedicada con protocolo de migración, no mezclar con contenido.
- P5 (modos glosario) — funcionalidad, después de resolver deuda.
- P6 (adolescencia) — sesión dedicada, alta complejidad.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** modificar `window.GLOSARIO.BIBLIO` (en `glosario-data.js`) sin verificar si el cambio debe replicarse en `bibliografia.json`, y viceversa. Son dos fuentes paralelas.
- ⚠️ **NO** asumir que un archivo JS nuevo en `10_fuentes/` entra al build automáticamente. Requiere marcador en `template.html` y lógica en `00_build.sh`. Ver Bug 8 (v07).
- ⚠️ **NO** asumir que `POLITICA_PROYECTO.md` describe la estructura real. El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1 (v05).
- ⚠️ **NO** agregar citas inline `(Autor et al., año)`. Solo chips `[ref]`. Ver Decisión 2 (v05).
- ⚠️ **NO** copiar `app.js` o `styles.css` del chat web si hay commits recientes encima. Aplicar el delta directamente sobre HEAD. Ver Bug 1 (v09).
- ⚠️ **NO** integrar Ma2025 hasta verificar el DOI en la versión final del journal.
- ⚠️ **NO** editar `index.html` directamente. El footer y cualquier elemento HTML del shell van en `template.html`. Ver Decisión 1 (v10).
- ⚠️ **NO** usar el umbral de "86 minutos" en ningún claim relacionado con COT20s/Fish 2026. El efecto es continuo. Ver Decisión 2 (v11).
- ✅ **ANTES** de cualquier edición de UI: pedir `app.js` y `styles.css`. No modificar sin leer el estado real.
- ✅ **ANTES** de abrir sesión: ejecutar `Rscript 00_escanear_proyecto.R` y adjuntar `estructura_actual.md`.
- ✅ **ANTES** de usar `position: sticky`: verificar que ningún ancestro entre el elemento y el scroll container tenga `overflow` distinto de `visible`. Ver Bug 1 (v10).
- ✅ **RECUERDA** que los adjuntos del chat web no llegan automáticamente al filesystem de Claude Code. Claude Code debe localizar los archivos en el proyecto o el usuario debe depositarlos manualmente. Ver aprendizaje sesión 11.
- 🔒 Sin dependencias externas JS — vanilla JS únicamente. Ver Decisión 3 (v06).
- 🔒 Flujo de trabajo: commit directo a `main` + push.
- 🔒 Los traspasos se generan en el chat web como archivo descargable, no en Claude Code.
- 🔒 El email de contacto está codificado en entidades HTML en `template.html` y `app.js`. No reemplazar por texto plano.

---

## 13. Fragmentos de código de referencia

### Validación cruzada batch bibliográfico

```bash
set -e
python3 - << 'PYEOF'
import json, sys

bib = json.load(open("10_fuentes/data/bibliografia.json"))
claims = json.load(open("10_fuentes/data/claims.json"))
errors = []

ids = [b["id"] for b in bib]
if len(ids) != len(set(ids)):
    errors.append("IDs duplicados en biblio")

id_set = set(ids)
for cid, cell in claims.items():
    for c in cell.get("claims", []):
        for r in c.get("refs", []):
            if r not in id_set:
                errors.append(f"Ref huérfano: {r} en {cid}")

all_claims = [c for cell in claims.values() for c in cell.get("claims", [])]
no_ref_true = sum(1 for c in all_claims if c.get("no_ref"))
empty_refs   = [(k, i) for k, cell in claims.items()
                for i, c in enumerate(cell["claims"])
                if not c.get("refs") and not c.get("no_ref")]

print(f"Total claims: {len(all_claims)}")
print(f"no_ref=True:  {no_ref_true}")
print(f"Pendientes reales: {len(empty_refs)}")
print(f"Bibliografía: {len(bib)}")
if errors:
    print("ERRORES:", errors); sys.exit(1)
else:
    print("OK — assert pasado")
PYEOF
```

### Patrón seguro para cambios incrementales en Claude Code

```bash
# Cuando el cambio es incremental sobre commits recientes:
# 1. Restaurar HEAD limpio
git checkout HEAD -- 10_fuentes/app.js 10_fuentes/styles.css

# 2. Verificar estado limpio antes de editar
grep -n "texto_que_debe_estar" 10_fuentes/app.js

# 3. Aplicar solo el delta (Edit tool o str_replace, no cp del Downloads)
# 4. Verificar diff mínimo
git diff --stat

# 5. Build + validación visual antes de commit
./00_build.sh
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 12 (Opus)`
(Reemplazar "Opus" por el modelo que vayas a usar.)

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos de la sesión anterior.
>
> ⚠️ El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1 del traspaso v05. ⚠️ Claims: solo chips `[ref]`, sin citas inline. Ver Decisión 2 del traspaso v05. ⚠️ Sin dependencias externas JS. Ver Decisión 3 del traspaso v06. ⚠️ Archivos JS nuevos requieren marcador en `template.html` + lógica en `00_build.sh`. Ver Bug 8 del traspaso v07. ⚠️ Traspasos: chat web como archivo descargable, no Claude Code. Ver traspaso v08. ⚠️ NO copiar `app.js`/`styles.css` del chat si hay commits recientes. Delta sobre HEAD. Ver Bug 1 del traspaso v09. ⚠️ NO editar `index.html` directamente. Shell HTML va en `template.html`. Ver traspaso v10. ⚠️ NO usar umbral de "86 min" en claims COT20s. Ver traspaso v11.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos a adjuntar

**Documentos para la próxima sesión:**

#### Documentos de protocolo (knowledge base del Project)

No requieren adjuntarse. Verificar que estén disponibles:

- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`

#### Documentos opcionales según el foco de la próxima sesión

- `asistente_claude_code_seguro.md` — la próxima sesión usará Claude Code.
- `prompt_migrar_estructura.md` — solo si se aborda P-ESTRUCTURA.

#### Documento de traspaso de esta sesión (adjuntar al nuevo chat)

- `30_documentacion/traspasos/traspaso-cierre-v11.md`

#### Output del escáner del proyecto (adjuntar al nuevo chat)

- `30_documentacion/estructura/estructura_actual.md` (ejecutar `Rscript 00_escanear_proyecto.R` antes de abrir)

#### Archivos del proyecto críticos para retomar (adjuntar al nuevo chat)

- `10_fuentes/data/claims.json` — si la sesión incluye edición de claims o batch bibliográfico (78 KB, voluminoso)
- `10_fuentes/data/bibliografia.json` — si la sesión incluye batch bibliográfico
- `10_fuentes/app.js` — si la sesión incluye edición de UI o lógica (44 KB, voluminoso)
- `10_fuentes/styles.css` — si la sesión incluye edición de estilos

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
