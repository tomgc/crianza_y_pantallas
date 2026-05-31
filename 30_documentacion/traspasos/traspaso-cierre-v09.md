# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v09
- **Fecha:** 2026-05-30
- **Sesión:** 9 — UI: eliminación de selectores, fusión de vistas, subtítulo del sitio; batch bibliográfico de cognición
- **Modelo utilizado:** Claude Sonnet 4.6
- **Entorno:** Web estático (HTML/CSS/JS, GitHub Pages)
- **Archivos principales modificados:** `10_fuentes/app.js`, `10_fuentes/styles.css`, `10_fuentes/data/bibliografia.json`, `10_fuentes/data/claims.json`, `index.html`, `30_documentacion/activa/prompts_busqueda/09_resultados_codigo_prompt_cognicion.md`

---

## 2. Resumen ejecutivo

La sesión 9 tuvo dos focos paralelos: UI y contenido bibliográfico. En el frente UI se completaron seis pendientes acumulados desde la sesión 8: se eliminaron los selectores de tramo etario del glosario (H) y de la topbar de la matriz (I), se fusionó la vista Limitaciones dentro de Metodología con nuevo título y bajada (E+F), se eliminó la subsección "Decisiones editoriales" del render (G), se agregó el subtítulo descriptivo del sitio bajo el brand (B), y se corrigió el padding hardcodeado en el glosario móvil (A). En el frente de contenido se integró el batch bibliográfico de la dimensión cognición: 9 papers nuevos a `bibliografia.json` (74→83 entradas), 6 claims nuevos y 5 ediciones a `claims.json` (133→139 claims), con validación cruzada automatizada antes del commit. La sesión identificó y resolvió un problema recurrente de regresión por archivos descargados desactualizados: Claude Code aplicó los cambios de UI directamente sobre HEAD en lugar de copiar archivos del chat, evitando revertir commits anteriores. El repo quedó en `ff012ec`, `main` sincronizada, sitio publicado con todos los cambios. Quedan pendientes de UI: C (bibliografía móvil sticky), D (glosario móvil rediseño), J (contacto, datos pendientes de confirmar). Nuevos pendientes identificados esta sesión: P-ESTRUCTURA (prefijos numéricos en `10_fuentes/`) y P-QA (SEO, cross-browser, usabilidad).

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Sitio en vivo en `https://tomgc.github.io/crianza_y_pantallas/` — `main` en `ff012ec`.
- Pipeline modular completo: build reproducible desde JSONs vía `./00_build.sh`.
- Matriz 10×5: 50 celdas, 139 claims, chips `[ref]` navegables, popovers bibliográficos.
- 4 tabs en header (Matriz, Glosario, Bibliografía, Metodología) — Limitaciones fusionada.
- Metodología con título "Cómo leemos la evidencia", secciones de Limitaciones al final, sin "Decisiones editoriales".
- Subtítulo descriptivo visible bajo el brand en desktop; oculto en móvil (≤960px).
- Glosario sin selector de tramo etario; topbar sin selector de tramo.
- Bibliografía filtrable: 83 entradas.
- Glosario interactivo modo matriz: 22 términos.
- Responsive: scroll horizontal en grilla móvil; ficha en columna única bajo 960px.
- Padding glosario móvil corregido (eliminado override hardcodeado de 32px).

### Qué no funciona / deuda conocida

- **~57 claims con `refs=[]`** sin política `"no_ref": true` (antes ~66, reducidos por el batch cognición que agregó refs a 5 celdas existentes y 6 claims nuevos con refs). Sin política, validaciones futuras reportan falsos positivos.
- **Dos fuentes bibliográficas paralelas:** `window.GLOSARIO.BIBLIO` (9 entradas en `glosario-data.js`) vs. `window.__DATA__.bibliografia` (83 entradas). No bloqueante pero puede divergir.
- **Código muerto en `app.js`:** handlers `age-sel` y `gl-tramo-sel` (líneas ~131, 986, 992, 1041) apuntan a elementos que ya no se renderizan. Inofensivo pero sucio.
- **Ma2025 excluido del corpus:** DOI no verificable. Pendiente resolver para integrar.
- **Archivos en `10_fuentes/` sin prefijos numéricos:** `app.js`, `styles.css`, `template.html`, `glosario-data.js` y los JSONs en `data/` no siguen la convención de naming de POLITICA_PROYECTO.md.

### Qué cambió respecto al traspaso v08

| Aspecto | v08 | v09 |
|---|---|---|
| Tabs en header | 6 (incluía Limitaciones) | 4 (Limitaciones fusionada en Metodología) |
| Selector tramo glosario | Presente | Eliminado |
| Selector tramo topbar (Matriz) | Presente | Eliminado |
| Título Metodología | "Método / Cómo se construyó este documento" | "Cómo leemos la evidencia / Criterios, tramos etarios y niveles de certeza..." |
| Sección "Decisiones editoriales" | Visible en Metodología | Filtrada al render |
| Subtítulo brand | Ausente | Presente en desktop |
| Padding glosario móvil | `padding: 20px 18px 32px` hardcodeado | Eliminado; variables CSS cubren el caso |
| Entradas bibliografía | 74 | 83 (+9 batch cognición) |
| Total claims | 133 | 139 (+6 batch cognición) |
| Commit HEAD | `ed11ea2` | `ff012ec` |
| Código muerto age-sel/gl-tramo-sel | No existía (era markup activo) | Existe como handlers inertes |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Eliminar selector de tramo etario del índice del glosario (H)

- **Archivo:** `10_fuentes/app.js`
- **Categoría:** Diseño visual y UX
- **Qué se hizo:** Eliminado el `<label for="gl-tramo-sel">` y `<select id="gl-tramo-sel">` del render de `renderGlosarioIndex()`. Simplificada la intro del índice (eliminada la frase sobre filtrar por tramo). El estado `glosarioTramo` queda en "all" fijo; el handler en `onRootChange` queda como código muerto inofensivo.
- **Por qué:** El selector de tramo en el glosario no era necesario — las definiciones son independientes de tramo etario. Eliminarlo simplifica la interfaz sin perder funcionalidad real.
- **Cómo se verificó:** Build OK. Verificación en `index.html`: `id="gl-tramo-sel"` = 0 ocurrencias. Validación visual: índice del glosario sin selector.
- **Commit:** `b8ff7fe`

#### Cambio 2: Eliminar selector de tramo etario de la topbar (I)

- **Archivo:** `10_fuentes/app.js`
- **Categoría:** Diseño visual y UX
- **Qué se hizo:** Eliminado el bloque condicional `state.view === "matriz"` que renderizaba el label "Tramo" y `<select id="age-sel">` en `renderTopBar()`. El estado `selectedAge` queda en "all" fijo.
- **Por qué:** El selector de tramo en la Matriz solo iluminaba una columna y ocupaba espacio sin beneficio claro. Eliminarlo limpia el header.
- **Cómo se verificó:** `id="age-sel"` = 0 ocurrencias en `index.html`. Validación visual: topbar sin selector.
- **Commit:** `b8ff7fe`

#### Cambio 3: Fusionar Limitaciones en Metodología (E)

- **Archivo:** `10_fuentes/app.js`
- **Categoría:** Diseño visual y UX / arquitectura de contenido
- **Qué se hizo:** Eliminado el tab "Limitaciones" del array de tabs. `renderMetodologia()` reescrita para fusionar `methodology.sections` (filtradas) con `limitations.sections` en un objeto `merged`. `renderLimitaciones()` redirige a `renderMetodologia()` (por compatibilidad con deep-links al `case "limitaciones"`).
- **Por qué:** Limitaciones es documentación metodológica que conceptualmente pertenece a Metodología. Tener tab separado fragmentaba el contenido sin valor para el usuario.
- **Cómo se verificó:** 4 tabs en header (sin "Limitaciones"). Secciones de Limitaciones visibles dentro de Metodología. Validación en `index.html`: label "Limitaciones" = 0 en los tabs.
- **Commit:** `b8ff7fe`

#### Cambio 4: Nuevo título y bajada de Metodología (F)

- **Archivo:** `10_fuentes/app.js`
- **Categoría:** Diseño visual y UX / contenido
- **Qué se hizo:** El objeto `merged` en `renderMetodologia()` usa título hardcodeado "Cómo leemos la evidencia" y subtítulo "Criterios, tramos etarios y niveles de certeza que organizan esta síntesis.", en lugar de los valores de `metadata.json`.
- **Por qué:** El título anterior ("Método / Cómo se construyó este documento") era técnico e interno. El nuevo comunica el valor para el lector.
- **Cómo se verificó:** Texto visible en la vista Metodología del sitio publicado.
- **Commit:** `b8ff7fe`

#### Cambio 5: Eliminar subsección "Decisiones editoriales" del render (G)

- **Archivo:** `10_fuentes/app.js`
- **Categoría:** Diseño visual y UX / contenido
- **Qué se hizo:** `.filter(s => s.heading !== "Decisiones editoriales")` aplicado a `methodology.sections` en `renderMetodologia()`. El texto sigue en `metadata.json` pero no se renderiza.
- **Por qué:** "Decisiones editoriales" es documentación interna de producción, no información útil para el usuario del sitio.
- **Cómo se verificó:** La subsección no aparece en el sitio publicado. El texto sigue en el JSON (C.1: inmutabilidad de la fuente).
- **Commit:** `b8ff7fe`

#### Cambio 6: Agregar subtítulo descriptivo bajo el brand (B)

- **Archivos:** `10_fuentes/app.js`, `10_fuentes/styles.css`
- **Categoría:** Diseño visual y UX / contenido
- **Qué se hizo:** En `renderTopBar()`, se agregó `<p class="brand-desc">Un mapa de la evidencia sobre el uso de pantallas en niños y niñas de 0 a 12 años. Sin prescribir ni alarmar, distingue lo bien establecido de lo que es hipótesis o creencia popular, para acompañar con evidencia las decisiones de padres y madres a lo largo de la infancia.</p>` dentro de `.brand`. En `styles.css`: `.topbar-left` cambió de `align-items: center` a `align-items: flex-start`; se agregó `.brand-desc` (11px, `var(--pencil)`, max-width 480px, margin-top 3px, line-height 1.45); `.brand-desc { display: none }` en media query 960px.
- **Por qué:** El sitio carecía de una descripción de propósito visible en todas las vistas. El subtítulo comunica para qué sirve y qué no es el sitio.
- **Cómo se verificó:** Subtítulo visible en desktop; ausente en móvil (media 960px). Tabs alineados arriba (`flex-start`). Screenshot de validación visual en Claude Code.
- **Commit:** `34e796a`
- **Nota técnica:** Este cambio fue aplicado por Claude Code directamente sobre HEAD (`b8ff7fe`) en lugar de copiar el archivo del chat. Razón: los archivos descargados del chat correspondían a una base anterior a `b8ff7fe` y habrían revertido la fusión de Limitaciones y la eliminación de selectores. Ver aprendizaje en sección 7.

#### Cambio 7: Corrección padding glosario móvil (A)

- **Archivo:** `10_fuentes/styles.css`
- **Categoría:** Diseño visual y UX / deuda técnica
- **Qué se hizo:** Eliminada la línea `padding: 20px 18px 32px` de `.gl-ficha-pane` dentro de `@media (max-width: 960px)`. Las variables `--page-pad-x` / `--page-pad-y` definidas en el override de `:root` dentro del mismo media query cubren el caso.
- **Por qué:** Era el único valor hardcodeado que escapaba al sistema de variables CSS introducido en la sesión anterior.
- **Commit:** `b8ff7fe`

#### Cambio 8: Batch bibliográfico cognición — 9 entradas a bibliografia.json

- **Archivo:** `10_fuentes/data/bibliografia.json`
- **Categoría:** Incorporación de evidencia
- **Qué se hizo:** Agregadas 9 entradas: `ChenJ2023`, `Hinten2025`, `LiuH2024`, `LiX2025`, `Mona2026`, `Paulich2021`, `Shou2025`, `TaheryanSong2025`, `Thorell2024`. Total: 74→83.
- **Por qué:** Cobertura de la dimensión `cognicion` estaba subrepresentada, especialmente en niñez media (6–12 años), TDAH, neuroimagen y videojuegos.
- **Cómo se verificó:** Script Python de validación cruzada: 0 IDs duplicados, 0 refs huérfanos, total esperado 83. Build OK. Validación visual de chips navegando a entradas nuevas.
- **Commit:** `dc67f43`
- **Excluido:** `Ma2025` — DOI no verificable (bandera Etapa 2 del reporte). El assert de validación lo detecta si se cuela.

#### Cambio 9: Batch bibliográfico cognición — 5 ediciones a claims existentes

- **Archivo:** `10_fuentes/data/claims.json`
- **Categoría:** Incorporación de evidencia
- **Qué se hizo:**
  - `cognicion-primera-infancia[2]`: texto actualizado con bandera de rango etario de TaheryanSong2025; ref agregada.
  - `cognicion-preescolar[0]`: `Hinten2025` agregado a refs.
  - `cognicion-preescolar[1]`: texto actualizado con OR 1.51; `LiuH2024` agregado a refs.
  - `cognicion-preescolar[3]`: `TaheryanSong2025` agregado a refs.
  - `cognicion-ninez-media[0]`: `LiX2025` y `Paulich2021` agregados a refs.
- **Commit:** `dc67f43`

#### Cambio 10: Batch bibliográfico cognición — 6 claims nuevos

- **Archivo:** `10_fuentes/data/claims.json`
- **Categoría:** Incorporación de evidencia
- **Qué se hizo:** Agregados 6 claims nuevos:
  - `cognicion-primera-infancia[4]`: contenido fantástico vs. ritmo (Hinten2025), certeza media.
  - `cognicion-ninez-media[3]`: logro académico TARGet Kids! (LiX2025 + Paulich2021), certeza alta.
  - `cognicion-ninez-media[4]`: exergames y EF (ChenJ2023), certeza media.
  - `cognicion-preadolescencia[3]`: ABCD neuroimagen (Shou2025 + Paulich2021), certeza alta.
  - `cognicion-preadolescencia[4]`: TDAH longitudinal (Thorell2024), certeza media.
  - `cognicion-preadolescencia[5]`: video corto adictivo (Mona2026), certeza baja con bandera explícita.
- **Total claims:** 133→139.
- **Commit:** `dc67f43`

#### Cambio 11: Documentar prompt batch cognición

- **Archivo:** `30_documentacion/activa/prompts_busqueda/09_resultados_codigo_prompt_cognicion.md`
- **Categoría:** Infraestructura / herramientas operativas
- **Qué se hizo:** Archivo trackeado y commiteado.
- **Commit:** `ff012ec`

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020–2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON vía `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1–4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación.*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~14% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~11% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Limpieza editorial | ~23 | ~13% | Eliminación de citas inline, expansión de siglas, corrección de textos |
| Corrección de integridad bibliográfica | ~14 | ~8% | Huérfanas, mismatches, refs vacíos, mismatch de edad |
| Incorporación de evidencia | ~24 | ~13% | Sesiones 4 y 9: papers, ediciones de claims, claims nuevos por dimensión |
| Diseño visual y UX | ~28 | ~16% | Wireframe B, paleta, responsive, estilos, estandarización de anchos, eliminación de selectores, fusión de vistas, subtítulo |
| Implementación de motor JS | ~14 | ~8% | `app.js`, render, panel lateral, popovers, deep linking; glosario interactivo |
| Bibliografía y popovers | ~7 | ~4% | Diseño del popover, navegación, filtros |
| Infraestructura / herramientas operativas | ~10 | ~6% | Escáner, flujo de incorporación, prompts modulares, publicación, build |
| Documentación / gobernanza | ~9 | ~5% | CLAUDE.md, README, convenciones, traspasos, rama eliminada |
| Andamiaje entre celdas | ~5 | ~3% | Cascadas entre celdas |
| Corrección factual | ~2 | ~1% | 5 Cs AAP, certeza de la evidencia |

**Total estimado: ~181**

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

**Total acumulado: ~181 cambios.**

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
58. Subsección "Decisiones editoriales" filtrada al render (`.filter(s => s.heading !== "Decisiones editoriales")`). Texto permanece en `metadata.json`.
59. Subtítulo descriptivo del sitio agregado bajo el brand (`<p class="brand-desc">`). `.topbar-left` cambia a `align-items: flex-start`. `.brand-desc` definido en CSS; oculto en móvil (≤960px).
60. Padding hardcodeado de `.gl-ficha-pane` en media query 960px eliminado. Variables CSS cubren el caso.
61. 9 entradas bibliográficas nuevas a `bibliografia.json` (74→83): `ChenJ2023`, `Hinten2025`, `LiuH2024`, `LiX2025`, `Mona2026`, `Paulich2021`, `Shou2025`, `TaheryanSong2025`, `Thorell2024`.
62. 5 ediciones a claims existentes en `claims.json`: `cognicion-primera-infancia[2]` (texto + TaheryanSong2025), `cognicion-preescolar[0]` (Hinten2025), `cognicion-preescolar[1]` (texto + LiuH2024), `cognicion-preescolar[3]` (TaheryanSong2025), `cognicion-ninez-media[0]` (LiX2025 + Paulich2021).
63. 6 claims nuevos en `claims.json` (133→139): `cognicion-primera-infancia[4]`, `cognicion-ninez-media[3]`, `cognicion-ninez-media[4]`, `cognicion-preadolescencia[3]`, `cognicion-preadolescencia[4]`, `cognicion-preadolescencia[5]`.
64. Prompt batch cognición (`09_resultados_codigo_prompt_cognicion.md`) trackeado y commiteado.

---

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron 11 cambios nuevos correspondientes a la sesión 9 (ítems 54–64).
- "Incorporación de evidencia" creció de ~13 a ~24 (batch cognición: 9 papers + 6 claims nuevos + 5 ediciones).
- "Diseño visual y UX" creció de ~21 a ~28 (selectores eliminados, fusión de vistas, subtítulo, padding móvil).
- "Infraestructura / herramientas operativas" creció de ~9 a ~10 (prompt cognición commiteado).
- Se identificaron dos nuevos pendientes: P-ESTRUCTURA (prefijos numéricos en `10_fuentes/`) y P-QA (SEO, cross-browser, usabilidad).

---

## 6. Bugs encontrados y su resolución

#### Bug 1: Regresión por archivos descargados desactualizados al aplicar subtítulo

- **Síntoma observable:** Al intentar copiar `~/Downloads/app.js` al repo para agregar el subtítulo (cambio B), Claude Code detectó que el archivo de Downloads correspondía a una base anterior a `b8ff7fe`: tenía de vuelta el tab Limitaciones, ambos selectores de tramo, y no tenía la fusión de renderMetodologia. Copiarlo habría revertido todos los cambios UI del commit anterior.
- **Causa raíz:** El flujo de trabajo "chat web genera archivo → usuario descarga → Claude Code copia" introduce un desfase temporal cuando hay commits intermedios. El archivo descargado parte de la base que tenía el chat al generarlo, no del HEAD actual del repo.
- **Solución aplicada:** Claude Code hizo `git checkout HEAD -- 10_fuentes/app.js 10_fuentes/styles.css` para restaurar el estado limpio de `b8ff7fe`, y aplicó solo el delta del subtítulo encima. Diff resultante: +8/−2 (mínimo esperado).
- **Criterio de verificación (B.4):** Diff de 8 líneas confirma que solo se agregó el subtítulo sin revertir trabajo previo. 4 tabs, sin selectores, validación visual OK.
- **Patrón general aprendido:** Cuando un cambio es incremental sobre commits recientes, Claude Code debe aplicarlo directamente sobre HEAD, no copiar un archivo completo del chat que puede estar desfasado. El diff mínimo es la prueba de éxito.
- **Principios:** B.3 (cambios quirúrgicos), C.3 (idempotencia), B.4 (criterio de éxito verificable).
- **Estado:** Resuelto.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Cuando Claude Code debe agregar un cambio incremental sobre commits recientes, aplica el delta directamente sobre HEAD; no copia el archivo completo del chat.
  - **Principio:** B.3 (cambios quirúrgicos) + C.3 (idempotencia).
  - **Contexto:** Los archivos generados en el chat web parten de la base que tenía el asistente al crearlos. Si hay commits intermedios en el repo, el archivo del chat puede estar desfasado y revertirlos al copiarse. El flujo seguro: `git checkout HEAD -- archivo`, luego aplicar solo el delta.
  - **Ejemplo:** El subtítulo (cambio B) se habría perdido la fusión de Limitaciones si se hubiera copiado el Downloads de app.js. Claude Code lo detectó antes del cp.

- **Regla:** Los traspasos se generan en el chat web, no en Claude Code. *(Confirmada desde v08.)*
  - **Principio:** C.11 (trazabilidad / documentación accesible).
  - **Contexto:** Claude Code no accede a la knowledge base del Project.

- **Regla:** Las variables CSS redefinidas en `@media` deben vivir dentro de `:root { }` dentro del bloque. *(Confirmada desde v08.)*

---

## 8. Decisiones de diseño tomadas

#### Decisión 1 (v09): Texto del subtítulo del sitio

- **Decisión:** "Un mapa de la evidencia sobre el uso de pantallas en niños y niñas de 0 a 12 años. Sin prescribir ni alarmar, distingue lo bien establecido de lo que es hipótesis o creencia popular, para acompañar con evidencia las decisiones de padres y madres a lo largo de la infancia."
- **Alternativa considerada:** "Este repositorio de evidencia científica sobre la exposición a pantallas en niños y niñas de 0 a 12 años busca servir de mapa para navegar sobre lo que sabemos y lo que no."
- **Justificación:** "repositorio" es frío e institucional; "navegar sobre" es zeugma incorrecto. La versión adoptada recupera la imagen del mapa, elimina el problema sintáctico y preserva la segunda oración que funciona bien.
- **Implicancia:** El texto está hardcodeado en `renderTopBar()` de `app.js`, no en `metadata.json`. Cambios futuros al texto requieren editar `app.js`.

#### Decisión 2 (v09): Excluir Ma2025 del batch cognición

- **Decisión:** Ma2025 no integrado al corpus. Solo se integraron los 9 papers con DOI/PMID plenamente verificados.
- **Alternativa considerada:** Integrar con bandera declarada en el claim (como se hizo con TaheryanSong2025 y Mona2026).
- **Justificación:** El reporte marcó Ma2025 con bandera de DOI no verificable (Etapa 2). A diferencia de TaheryanSong2025 (rango etario incierto pero DOI verificado) y Mona2026 (muestra amplia pero DOI verificado), Ma2025 no tiene identificador reproducible. Un paper sin DOI verificable no puede citarse de forma trazable.
- **Implicancia:** El assert de validación cruzada incluye `"Ma2025 NO debe estar integrado"` para detectar si se cuela en futuras sesiones.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| `--content-width` | 700px | `10_fuentes/styles.css` | Aplica a vistas secundarias; Matriz no usa esta variable |
| `--page-pad-x` | 32px (desktop) / 18px (≤960px) | `10_fuentes/styles.css` | |
| `--page-pad-y` | 28px (desktop) / 20px (≤960px) | `10_fuentes/styles.css` | |
| Tabs en header | 4 (Matriz, Glosario, Bibliografía, Metodología) | `10_fuentes/app.js` | Limitaciones fusionada desde v09 |
| Tramos etarios | 5 (lactante, primera infancia, preescolar, niñez media, preadolescencia) | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Dimensiones | 10 | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Certeza levels | h / m / l | `10_fuentes/data/metadata.json` + `app.js` | Alta/Media/Baja |
| Términos glosario | 22 | `10_fuentes/glosario-data.js` | `window.GLOSARIO` |
| Refs bibliografía principal | 83 | `10_fuentes/data/bibliografia.json` | Era 74 en v08 |
| Refs bibliografía glosario | 9 | `10_fuentes/glosario-data.js` | Fuente paralela — ver deuda técnica |
| Total claims | 139 | `10_fuentes/data/claims.json` | Era 133 en v08 |
| URL publicada | `https://tomgc.github.io/crianza_y_pantallas/` | GitHub Pages desde `main` | Activa, en `ff012ec` |
| Rama de trabajo | `main` directo | Git | Sin rama feature activa al cierre |

---

## 10. Arquitectura de archivos relevante

Referencia: `30_documentacion/estructura/estructura_actual.md` (escáner ejecutado al cierre, 2026-05-30 22:33:11).

**Cambios estructurales en esta sesión:**
- `10_fuentes/app.js` — UI: selectores eliminados, fusión de vistas, subtítulo.
- `10_fuentes/styles.css` — `.brand-desc`, `.topbar-left` flex-start, padding móvil corregido.
- `10_fuentes/data/bibliografia.json` — 74→83 entradas.
- `10_fuentes/data/claims.json` — 133→139 claims.
- `30_documentacion/activa/prompts_busqueda/09_resultados_codigo_prompt_cognicion.md` — nuevo, trackeado.

**Verificación contra política:**
- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Excepción documentada (Decisión 1, v05). Ver CLAUDE.md.
- ⚠️ Archivos en `10_fuentes/` sin prefijos numéricos (nueva deuda identificada en v09). Ver Pendiente P-ESTRUCTURA.
- Sin `40_salidas/`: excepción documentada (output es `index.html` en raíz).
- Naming respeta sección 2.3: snake_case, sin tildes/ñ/espacios.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente C: Bibliografía móvil — filtros sticky
- **Descripción:** En viewport móvil, los filtros (chips de tipo + buscador) deben quedar fijos al hacer scroll.
- **Tipo:** UI / UX móvil.
- **Impacto:** Usabilidad en móvil degradada sin esto.
- **Complejidad:** Media. Requiere `styles.css` y posiblemente `app.js`.
- **Criterio de éxito:** Filtros visibles al scrollear la lista en viewport ≤960px.

#### Pendiente D: Glosario móvil — rediseño de índice
- **Descripción:** En móvil el índice ocupa demasiado espacio antes de la ficha. Necesita presentación más compacta.
- **Tipo:** UI / UX móvil.
- **Impacto:** Usabilidad en móvil.
- **Complejidad:** Media-alta. Sesión dedicada. Requiere `app.js` + `styles.css`.
- **Criterio de éxito:** Usuario llega a ficha de término con scroll mínimo en móvil.

#### Pendiente J: Contacto — footer + nota en Metodología
- **Descripción:** (a) Footer discreto con email y/o LinkedIn en todas las vistas; (b) nota al final de Metodología tipo "Si encuentras un error o quieres sugerir una fuente...".
- **Tipo:** UI / contenido.
- **Impacto:** Permite al usuario contactar al autor.
- **Dependencias:** Bloqueado hasta confirmar datos de contacto (email, LinkedIn o ambos).
- **Complejidad:** Baja-media. Requiere `app.js` + `styles.css`.
- **Precaución:** ⚠️ Confirmar datos con el usuario antes de implementar.
- **Criterio de éxito:** Footer visible en todas las vistas; nota en Metodología. Datos confirmados.

#### Pendiente P1: Resolver 3 claims sin ref conocidos
- **Descripción:** `sueno-primera-infancia[2]`, `cognicion-ninez-media[1]`, `cognicion-ninez-media[2]`. Requieren búsqueda en PubMed.
- **Tipo:** Deuda epistémica / integridad bibliográfica.
- **Complejidad:** Baja-media.
- **Criterio de éxito:** `refs=[]` solo en claims con `"no_ref": true` explícito.

#### Pendiente P2: Política `"no_ref": true` para ~57 claims interpretativos
- **Descripción:** Definir e implementar `"no_ref": true` en los claims interpretativos aceptables sin cita. El número exacto requiere reconteo (era ~46 en v08, subió levemente por nuevos claims con refs).
- **Tipo:** Deuda técnica / política de datos.
- **Complejidad:** Media (revisión claim por claim).
- **Criterio de éxito:** Assert limpio distingue intencionales vs. pendientes.

#### Pendiente P3: Resolver ~10 claims empíricos sin ref
- **Dependencia:** Conveniente después de P2.
- **Tipo:** Deuda epistémica.
- **Complejidad:** Media-alta.

#### Pendiente P4: Unificar fuentes bibliográficas
- **Descripción:** `window.GLOSARIO.BIBLIO` (9) vs. `window.__DATA__.bibliografia` (83). Riesgo de divergencia creciente.
- **Tipo:** Deuda técnica.
- **Complejidad:** Media.
- **Criterio de éxito:** Una sola fuente de verdad bibliográfica.

#### Pendiente P5: Glosario modos alpha y relevancia
- **Tipo:** Funcionalidad nueva.
- **Complejidad:** Media (~1 sesión).

#### Pendiente P6: Fase 6 — adolescencia
- **Tipo:** Contenido / funcionalidad nueva.
- **Complejidad:** Alta. Sesión dedicada.

#### Pendiente P7: Actualizar prompts de búsqueda bibliográfica
- **Tipo:** Documentación.
- **Complejidad:** Baja.

#### Pendiente P8: PDFs UNICEF/CJE UC
- **Tipo:** Documentación. ~10 minutos. Entre sesiones.

#### Pendiente P-ESTRUCTURA: Prefijos numéricos en `10_fuentes/`
- **Descripción:** Los archivos `app.js`, `styles.css`, `template.html`, `glosario-data.js` y los JSONs en `10_fuentes/data/` no llevan prefijo numérico según POLITICA_PROYECTO.md. Deberían llamarse `10_app.js`, `10_styles.css`, etc.
- **Tipo:** Deuda estructural.
- **Impacto:** No bloquea nada, pero viola la convención de naming del proyecto.
- **Dependencias:** Renombrar requiere actualizar referencias en `00_build.sh`, `template.html` y cualquier `source()` o path hardcodeado. Usar protocolo de migración con DRY_RUN.
- **Complejidad:** Media. Requiere `prompt_migrar_estructura.md` y `99_reorganizar_estructura_PLANTILLA.R`.
- **Criterio de éxito:** Todos los archivos en carpetas numeradas llevan prefijo que coincide con su carpeta. Build OK después de renombrar.
- **Precaución:** No combinar con otras ediciones. Sesión dedicada con commit limpio previo.

#### Pendiente P-QA: SEO, cross-browser rendering y usabilidad
- **Descripción:** Auditoría de calidad del sitio publicado: (a) SEO básico (meta tags, Open Graph, canonical, sitemap); (b) rendering en Chrome, Firefox, Safari, Edge; (c) revisión de usabilidad (flujo de navegación, accesibilidad básica, legibilidad).
- **Tipo:** QA / mejora.
- **Impacto:** Afecta alcance y experiencia del sitio publicado.
- **Complejidad:** Media. Puede dividirse en sub-tareas por navegador o por área.
- **Criterio de éxito:** Checklist de SEO básico completo; sin regresiones visuales en los 4 navegadores principales; al menos un ciclo de revisión de usabilidad documentado.

#### Pendiente CODE-MUERTO: Barrido de handlers inertes en app.js
- **Descripción:** Líneas ~131, 986, 992, 1041 de `app.js` referencian `age-sel` y `gl-tramo-sel` — elementos que ya no se renderizan. Inofensivo pero sucio.
- **Tipo:** Deuda técnica menor.
- **Complejidad:** Baja. Agrupar con cualquier otra edición a `app.js`.
- **Criterio de éxito:** 0 referencias a `age-sel` y `gl-tramo-sel` en `app.js`.

#### Pendiente Ma2025: Verificar DOI y completar autores
- **Descripción:** Ma S., Chen E.E., et al. 2025 — *Journal of Applied Developmental Psychology* [en prensa]. DOI no capturado de forma independiente. Verificar en la versión final del journal y completar la lista de autores.
- **Tipo:** Deuda epistémica / integridad bibliográfica.
- **Complejidad:** Baja (verificación externa). Puede hacerse entre sesiones.
- **Criterio de éxito:** DOI verificado, autores completos, entrada integrada al corpus.

### 11.2 Evaluación de deuda técnica

- **~57 claims con `refs=[]`:** creciente con cada batch. Conveniente resolver P2 antes del próximo batch bibliográfico.
- **Dos fuentes bibliográficas paralelas:** riesgo de divergencia a medida que crece la bibliografía (ahora 83 vs. 9).
- **Código muerto age-sel/gl-tramo-sel:** trivial, agrupar con próxima edición a `app.js`.
- **Archivos sin prefijos en `10_fuentes/`:** deuda estructural no urgente pero que crece con el proyecto.

### 11.3 Auditoría de cierre

- **¿Cada bloque de transformación tiene check de validación? (C.8)** → Sí. Script Python de validación cruzada antes de cada commit de batch bibliográfico. Build verificado con exit code 0.
- **¿Los outputs son reproducibles e idempotentes? (C.2, C.3)** → Sí. `./00_build.sh` regenera `index.html` desde fuentes sin estado intermedio.
- **¿Hay decisiones metodológicas documentadas como constantes con nombre? (C.11)** → Sí. Variables CSS con nombres semánticos. Texto del subtítulo hardcodeado en `renderTopBar()` — documentado en Decisión 1 de esta sección.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Pendiente J — Contacto** — Confirmar datos de contacto primero (email/LinkedIn). Una vez confirmados, implementación baja. Criterio: footer visible en todas las vistas.
2. **Pendiente C — Bibliografía móvil sticky** — UI pura, sin dependencias. Criterio: filtros visibles al scrollear en móvil.
3. **Pendiente P2 — Política `"no_ref": true`** — Conveniente antes del próximo batch bibliográfico. Criterio: assert limpio sin falsos positivos.
4. **Pendiente P1 — 3 claims sin ref** — Requiere búsqueda dirigida. Criterio: refs=[] solo en claims con no_ref explícito.
5. **Próximo batch bibliográfico** (dimensión pendiente) — Después de P2+P1 para no acumular más deuda.

**Diferir:**
- D (glosario móvil rediseño) — sesión dedicada, alta complejidad.
- P-ESTRUCTURA — sesión dedicada con protocolo de migración.
- P-QA — sesión dedicada cuando el contenido esté más estable.
- P6 (adolescencia) — sesión dedicada.
- CODE-MUERTO — agrupar con próxima edición a `app.js`.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** modificar `window.GLOSARIO.BIBLIO` (en `glosario-data.js`) sin verificar si el cambio debe replicarse en `bibliografia.json`, y viceversa. Son dos fuentes paralelas.
- ⚠️ **NO** asumir que un archivo JS nuevo en `10_fuentes/` entra al build automáticamente. Requiere marcador en `template.html` y lógica en `00_build.sh`. Ver Bug 8 (v07).
- ⚠️ **NO** asumir que `POLITICA_PROYECTO.md` describe la estructura real. El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1 (v05).
- ⚠️ **NO** agregar citas inline `(Autor et al., año)`. Solo chips `[ref]`. Ver Decisión 2 (v05).
- ⚠️ **NO** copiar `app.js` o `styles.css` del chat web si hay commits recientes encima. Aplicar el delta directamente sobre HEAD. Ver Bug 1 (v09).
- ⚠️ **NO** integrar Ma2025 hasta verificar el DOI en la versión final del journal.
- ✅ **ANTES** de cualquier edición de UI: pedir `app.js` y `styles.css`. No modificar sin leer el estado real.
- ✅ **ANTES** de implementar Pendiente J (contacto): confirmar con el usuario qué datos mostrar (email, LinkedIn, ambos).
- ✅ **ANTES** de abrir sesión: ejecutar `Rscript 00_escanear_proyecto.R` y adjuntar `estructura_actual.md`.
- 🔒 Sin dependencias externas JS — vanilla JS únicamente. Ver Decisión 3 (v06).
- 🔒 Flujo de trabajo: commit directo a `main` + push.
- 🔒 Los traspasos se generan en el chat web, no en Claude Code.
- 🔒 El texto del subtítulo del brand está hardcodeado en `renderTopBar()` de `app.js`, no en `metadata.json`.

---

## 13. Fragmentos de código de referencia

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

# Ajustar EXPECTED_BIB y EXPECTED_CLAIMS al inicio de cada batch
EXPECTED_BIB = 83
EXPECTED_CLAIMS = 139
if len(bib) != EXPECTED_BIB:
    errors.append(f"Biblio esperada {EXPECTED_BIB}, hay {len(bib)}")
total = sum(len(c.get("claims", [])) for c in claims.values())
if total != EXPECTED_CLAIMS:
    errors.append(f"Claims esperados {EXPECTED_CLAIMS}, hay {total}")

# Paper con bandera activa — no debe estar integrado
for cid, cell in claims.items():
    for c in cell.get("claims", []):
        if "Ma2025" in c.get("refs", []):
            errors.append(f"Ma2025 integrado en {cid} — DOI sin resolver")

if errors:
    print("\n".join(f"  ✗ {e}" for e in errors))
    sys.exit(1)
print("✓ Validaciones OK")
PYEOF
```

### Verificar claims sin refs (clasificación)

```python
import json

claims = json.load(open('10_fuentes/data/claims.json'))

sin_refs = []
for celda_id, celda in claims.items():
    for i, c in enumerate(celda.get('claims', [])):
        if not c.get('refs') and not c.get('no_ref'):
            sin_refs.append((celda_id, i, c.get('text','')[:80]))

print(f'Claims sin refs no-intencionales: {len(sin_refs)}')
for cid, i, txt in sin_refs:
    print(f'  {cid}[{i}]: {txt}')
```

### Ejecutar escáner

```bash
Rscript 00_escanear_proyecto.R
# Output en 30_documentacion/estructura/estructura_actual.md
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 10 (Sonnet)`
(Reemplazar "Sonnet" por el modelo que vayas a usar.)

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos de la sesión anterior.
>
> ⚠️ Nota crítica: el proyecto usa `30_documentacion/`, no `50_documentacion/` como dice POLITICA_PROYECTO.md. Verificar con `ls` antes de generar rutas. Ver Decisión 1 del traspaso v05.
>
> ⚠️ Convención de citas: los claims NO llevan citas inline `(Autor et al., año)`. Solo chips `[ref]`. Ver Decisión 2 del traspaso v05.
>
> ⚠️ Restricción de arquitectura: sin dependencias externas JS (no React, no Vue). Ver Decisión 3 del traspaso v06.
>
> ⚠️ Build: todo archivo JS nuevo en `10_fuentes/` requiere marcador en `template.html` + lógica en `00_build.sh`. Ver Bug 8 del traspaso v07.
>
> ⚠️ Traspasos: se generan en el chat web, no en Claude Code. Ver regla nueva del traspaso v08.
>
> ⚠️ Archivos del chat: NO copiar `app.js`/`styles.css` del chat si hay commits recientes. Claude Code debe aplicar el delta sobre HEAD. Ver Bug 1 del traspaso v09.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos para la próxima sesión

**Documentos de protocolo (knowledge base del Project)**

No requieren ser adjuntados. Verifica que estén disponibles:

- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md` (⚠️ con discrepancia respecto al proyecto real, ver Decisión 1 v05)
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`
- `prompt-cierre-sesion.md`

**Opcionales según foco**

- `asistente_claude_code_seguro.md` — la próxima sesión probablemente usa Claude Code.

**Documento de traspaso (adjuntar)**

- `30_documentacion/traspasos/traspaso-cierre-v09.md` (este documento)

**Output del escáner (adjuntar)**

- `30_documentacion/estructura/estructura_actual.md` (ejecutar `Rscript 00_escanear_proyecto.R` antes de abrir)

**Archivos del proyecto críticos (adjuntar)**

- `10_fuentes/app.js` — necesario para pendientes J (contacto) y CODE-MUERTO (barrido handlers).
- `10_fuentes/styles.css` — necesario para pendiente C (bibliografía sticky móvil) y cualquier ajuste visual.
- `10_fuentes/data/claims.json` — si la sesión aborda P1/P2/P3 o próximo batch bibliográfico.
- `10_fuentes/data/bibliografia.json` — si la sesión aborda próximo batch bibliográfico.

**Datos o referencias externas**

- No aplica para los pendientes de la ruta sugerida.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
