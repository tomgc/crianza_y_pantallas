# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v10
- **Fecha:** 2026-05-31
- **Sesión:** 10 — UI: footer de contacto, nota en Metodología, bibliografía sticky móvil; limpieza de código muerto; política `no_ref: true`
- **Modelo utilizado:** Claude Sonnet 4.6
- **Entorno:** Web estático (HTML/CSS/JS, GitHub Pages)
- **Archivos principales modificados:** `10_fuentes/app.js`, `10_fuentes/styles.css`, `10_fuentes/template.html`, `10_fuentes/data/claims.json`, `index.html`

---

## 2. Resumen ejecutivo

La sesión 10 abordó tres frentes: nuevas funcionalidades de UI, limpieza de código muerto y deuda técnica de integridad bibliográfica. En UI se implementó el footer de contacto (email con codificación HTML antispam + LinkedIn) en todas las vistas vía `template.html`, y la nota de contacto al final de la vista Metodología. El Pendiente C quedó cerrado: los controles de Bibliografía (filtros + buscador) son ahora sticky en móvil (≤960px), tras tres iteraciones que diagnosticaron que `position: sticky` se rompe con cualquier ancestro que tenga `overflow` distinto de `visible`; el fix fue agregar `.page-pane { overflow: visible }` en el media query. El código muerto `age-sel` y `gl-tramo-sel` fue eliminado completamente: 4 handlers en `app.js`, 1 restore en el init del IIFE y 1 regla CSS en `styles.css`. En deuda técnica se cerró P2: 54 claims interpretativos fueron marcados con `"no_ref": true`, dejando el assert de integridad limpio con exactamente 11 pendientes reales identificados (P1/P3). El repo quedó en `6478d45`, `main` sincronizada, working tree limpio, documentación de cierre versionada.

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Sitio en vivo en `https://tomgc.github.io/crianza_y_pantallas/` — `main` en `6478d45`.
- Pipeline modular completo: build reproducible desde JSONs vía `./00_build.sh`.
- Matriz 10×5: 50 celdas, 139 claims, chips `[ref]` navegables, popovers bibliográficos.
- 4 tabs en header (Matriz, Glosario, Bibliografía, Metodología).
- Footer de contacto en todas las vistas: email antispam (entidades HTML) + LinkedIn.
- Nota de contacto al final de Metodología con email enlazado.
- Bibliografía: filtros + buscador sticky en móvil (≤960px) — validado visualmente.
- 54 claims interpretativos con `"no_ref": true` — assert de integridad limpio.
- `app.js` sin código muerto: 0 referencias a `age-sel` o `gl-tramo-sel`.
- Responsive: scroll horizontal en grilla móvil; ficha en columna única bajo 960px.
- Bibliografía filtrable: 83 entradas. Glosario interactivo modo matriz: 22 términos.

### Qué no funciona / deuda conocida

- **11 claims con `refs=[]` sin `no_ref: true`** — pendientes reales P1/P3. Lista exacta:
  `lenguaje-lactante[1]`, `lenguaje-primera-infancia[1]`, `lenguaje-ninez-media[0]`,
  `lenguaje-ninez-media[1]`, `sueno-lactante[1]`, `sueno-primera-infancia[2]`,
  `fisica-preescolar[2]`, `vision-preescolar[0]`, `salud-mental-ninez-media[1]`,
  `salud-mental-preadolescencia[0]`, `comportamiento-ninez-media[0]`.
- **Dos fuentes bibliográficas paralelas:** `window.GLOSARIO.BIBLIO` (9 entradas en `glosario-data.js`) vs. `window.__DATA__.bibliografia` (83 entradas). No bloqueante pero puede divergir.
- **Texto del subtítulo hardcodeado** en `renderTopBar()` de `app.js`, no en `metadata.json`.
- **Archivos en `10_fuentes/` sin prefijos numéricos** — deuda estructural no urgente.
- **Ma2025 excluido del corpus:** DOI no verificable. Pendiente resolver.

### Qué cambió respecto al traspaso v09

| Aspecto | v09 | v10 |
|---|---|---|
| Footer de contacto | Ausente | Presente en todas las vistas (template.html) |
| Nota de contacto | Ausente | Al final de Metodología |
| Bibliografía sticky móvil | No sticky | Sticky (filtros + buscador fijos al scrollear) |
| Código muerto age-sel/gl-tramo-sel | Presente (handlers, restore, CSS) | Eliminado completamente |
| Claims con `no_ref: true` | 0 | 54 |
| Claims sin refs y sin no_ref (falsos positivos) | ~65 | 11 (reales P1/P3) |
| Commit HEAD | `ff012ec` | `6478d45` |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Footer de contacto en todas las vistas (Pendiente J)

- **Archivo(s):** `10_fuentes/template.html`, `index.html` (build output)
- **Categoría temática:** Diseño visual y UX / contenido
- **Qué se hizo:** Agregado `<footer class="site-footer">` antes del cierre de `</body>` en `template.html`. Contiene email codificado en entidades HTML (`&#109;&#97;&#105;&#108;&#116;&#111;&#58;...`) y enlace a LinkedIn. Estilos `.site-footer`, `.footer-sep`, `.footer-link` agregados al final de `styles.css`.
- **Por qué se hizo:** El sitio carecía de datos de contacto del autor. El footer va en `template.html` (no en `index.html`) porque `00_build.sh` regenera `index.html` desde las fuentes — cualquier edición directa a `index.html` se pierde en el siguiente build.
- **Cómo se verificó:** Email decodificado correctamente en runtime (entidades HTML → dirección real). LinkedIn enlazado. Footer visible en todas las vistas. Cero errores de consola.
- **Commit:** `843dbd8`

#### Cambio 2: Nota de contacto al final de Metodología (Pendiente J)

- **Archivo(s):** `10_fuentes/app.js`
- **Categoría temática:** Diseño visual y UX / contenido
- **Qué se hizo:** `renderMetodologia()` retorna `renderTextPage(merged) + <div class="contact-note">`. Estilos `.contact-note` y `.contact-link` agregados a `styles.css`. Email también codificado en entidades HTML.
- **Por qué se hizo:** Permite al lector reportar errores o sugerir fuentes directamente desde la vista de metodología.
- **Cómo se verificó:** Nota visible en vista Metodología del sitio publicado.
- **Commit:** `843dbd8`

#### Cambio 3: Limpieza de código muerto age-sel y gl-tramo-sel (CODE-MUERTO)

- **Archivo(s):** `10_fuentes/app.js`, `10_fuentes/styles.css`
- **Categoría temática:** Deuda técnica
- **Qué se hizo:** Eliminados en `app.js`: handler `age-sel` en `onRootChange()` (L987–991), handler `gl-tramo-sel` en `onRootChange()` (L993–998), restore de `age-sel` en el init del IIFE (L1042–1043), bloque `syncTopBarActive()` que restauraba el valor del selector (L131–133). Eliminada en `styles.css`: regla `.gl-tramo-sel { }` (L614). Resultado: 0 referencias a `age-sel` y `gl-tramo-sel` en todo el proyecto.
- **Por qué se hizo:** Los elementos `#age-sel` y `#gl-tramo-sel` fueron eliminados del render en la sesión 9 (v09). Los handlers y estilos apuntaban a elementos inexistentes — código inofensivo pero sucio que debía eliminarse.
- **Cómo se verificó:** `grep age-sel app.js` = 0 resultados. `grep gl-tramo-sel styles.css` = 0 resultados. Build OK.
- **Commit:** `843dbd8`
- **Nota:** La limpieza fue más amplia que la planificada — Claude Code detectó una 3ª referencia a `age-sel` en `syncTopBarActive()` y la eliminó también para cumplir el criterio age-sel = 0.

#### Cambio 4: Bibliografía móvil — controles sticky (Pendiente C)

- **Archivo(s):** `10_fuentes/styles.css`, `index.html`
- **Categoría temática:** Diseño visual y UX
- **Qué se hizo:** Dentro del `@media (max-width: 960px)`, agregadas dos reglas: `.page-pane { overflow: visible }` y `.biblio-controls { position: sticky; top: 0; background: var(--bg); z-index: 10; padding: ...; margin: ...; border-bottom: 1px solid var(--border); }`. La línea clave es `overflow: visible` en `.page-pane`.
- **Por qué se hizo:** En móvil, los filtros de tipo y el buscador desaparecían al scrollear la lista de entradas, obligando al usuario a volver al inicio para cambiar el filtro.
- **Cómo se verificó:** Test empírico de scroll en preview a ancho móvil: tras scrollear 600px, los controles permanecen en `top: 0`. Metodología sin regresión (contenido no recortado, `docScrollable: true`). Screenshot confirmatorio.
- **Commit:** `a49bf4e`
- **Nota:** Requirió 3 iteraciones — ver Bug 1 de esta sesión.

#### Cambio 5: Política `no_ref: true` en 54 claims interpretativos (P2)

- **Archivo(s):** `10_fuentes/data/claims.json`, `index.html`
- **Categoría temática:** Corrección de integridad bibliográfica
- **Qué se hizo:** Agregado `"no_ref": true` a 54 claims en 40 celdas distintas. Los claims afectados son interpretativos, síntesis de consenso, marcos conceptuales, hipótesis de mecanismo o afirmaciones metodológicas que no requieren cita propia. No se modificó `text`, `cert` ni `refs` existentes en ningún caso.
- **Por qué se hizo:** El assert de integridad reportaba ~65 falsos positivos (claims con `refs=[]` sin distinción entre intencionales y pendientes). Con la política, el assert ahora distingue: `no_ref: true` = intencional, `refs=[]` sin flag = pendiente real. Resultado: 11 pendientes reales (P1/P3) claramente identificados.
- **Cómo se verificó:** Script Python de validación: "no_ref aplicados correctamente: 54/54", 11 pendientes en P1/P3, assert = OK. Build OK.
- **Commit:** `171d959`

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020–2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON vía `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1–4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación.*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~13% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~10% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Limpieza editorial | ~23 | ~12% | Eliminación de citas inline, expansión de siglas, corrección de textos |
| Corrección de integridad bibliográfica | ~19 | ~10% | Huérfanas, mismatches, refs vacíos, política `no_ref: true` (P2) |
| Incorporación de evidencia | ~24 | ~12% | Sesiones 4 y 9: papers, ediciones de claims, claims nuevos por dimensión |
| Diseño visual y UX | ~31 | ~16% | Wireframe B, paleta, responsive, estilos, footer, sticky móvil |
| Implementación de motor JS | ~14 | ~7% | `app.js`, render, panel lateral, popovers, deep linking; glosario interactivo |
| Bibliografía y popovers | ~7 | ~4% | Diseño del popover, navegación, filtros |
| Infraestructura / herramientas operativas | ~10 | ~5% | Escáner, flujo de incorporación, prompts modulares, publicación, build |
| Documentación / gobernanza | ~9 | ~5% | CLAUDE.md, README, convenciones, traspasos, rama eliminada |
| Andamiaje entre celdas | ~5 | ~3% | Cascadas entre celdas |
| Corrección factual | ~2 | ~1% | 5 Cs AAP, certeza de la evidencia |
| Deuda técnica / limpieza de código | ~3 | ~2% | Código muerto, handlers inertes, CSS obsoleto |

**Total estimado: ~192**

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

**Total acumulado: ~192 cambios.**

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

### Sesión 10 (Sonnet 4.6) — 2026-05-31

Footer de contacto, nota en Metodología, bibliografía sticky móvil, limpieza de código muerto, política `no_ref: true`.

65. Footer de contacto agregado a `template.html` (no a `index.html`): email codificado en entidades HTML + LinkedIn. Estilos `.site-footer`, `.footer-sep`, `.footer-link` en `styles.css`.
66. Nota de contacto al final de `renderMetodologia()` en `app.js`: `<div class="contact-note">` con email enlazado. Estilos `.contact-note`, `.contact-link` en `styles.css`.
67. Código muerto eliminado de `app.js`: handler `age-sel` en `onRootChange()`, handler `gl-tramo-sel` en `onRootChange()`, restore de `age-sel` en init del IIFE, bloque `syncTopBarActive()` que restauraba el selector.
68. Regla CSS muerta `.gl-tramo-sel { }` eliminada de `styles.css`. Resultado: `age-sel` = 0 y `gl-tramo-sel` = 0 en todo el proyecto.
69. Bibliografía sticky en móvil: `.page-pane { overflow: visible }` + `.biblio-controls { position: sticky; top: 0; ... }` dentro de `@media (max-width: 960px)` en `styles.css`. Fix clave: `overflow: visible` en el ancestro.
70. 54 claims interpretativos marcados con `"no_ref": true` en `claims.json`. Assert de integridad queda limpio: 11 pendientes reales (P1/P3).
71. Traspaso v09 y escáner actualizado commiteados (`e4d968a`, `6478d45`).

---

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron 7 ítems nuevos (65–71) correspondientes a la sesión 10.
- "Diseño visual y UX" creció de ~28 a ~31 (footer, sticky móvil).
- "Corrección de integridad bibliográfica" creció de ~14 a ~19 (P2: 54 `no_ref: true`).
- Nueva categoría "Deuda técnica / limpieza de código" (~3): código muerto age-sel/gl-tramo-sel.
- P1 conocidos (3) expandidos a 11 al identificar todos los empíricos sin ref tras limpiar P2.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: `position: sticky` roto por `overflow` en ancestro

- **Síntoma observable:** Tras aplicar `.biblio-controls { position: sticky }` en móvil, los controles se movían con el scroll en lugar de quedarse fijos. `top` pasaba de 172 a −228 al scrollear.
- **Causa raíz:** `position: sticky` se rompe cuando cualquier ancestro tiene `overflow` distinto de `visible`. `.page-pane` tiene `overflow: auto` en su definición base. El primer intento agregó `overflow: hidden` al pane (también rompe sticky). El segundo intento quitó el override pero dejó `.page-pane` con su `overflow: auto` base — mismo problema. Solo `overflow: visible` permite que el sticky funcione relativo al scroll real (la ventana).
- **Solución aplicada:** Agregar `.page-pane { overflow: visible }` dentro del `@media (max-width: 960px)`.
- **Criterio de verificación (B.4):** Test empírico en preview: tras scrollear 600px, `top` = 0 (controles fijos). Metodología sin regresión (`docScrollable: true`, contenido no recortado).
- **Patrón general aprendido:** Antes de usar `position: sticky`, verificar que ningún ancestro entre el elemento y el contenedor de scroll tenga `overflow: auto`, `hidden` o `scroll`. Si lo hay, sobreescribirlo a `overflow: visible` o reestructurar el DOM.
- **Principios:** B.3 (cambios quirúrgicos), B.4 (criterio de éxito verificable).
- **Estado:** Resuelto. 3 iteraciones.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** El footer va en `template.html`, nunca en `index.html` directamente.
  - **Principio:** C.1 (inmutabilidad de la fuente) + C.3 (idempotencia).
  - **Contexto:** `00_build.sh` regenera `index.html` desde `template.html` + los JSONs. Cualquier edición manual a `index.html` se pierde en el siguiente build. `template.html` es la fuente canónica de la estructura HTML del sitio.
  - **Ejemplo:** El footer de esta sesión fue el primer elemento que debía ir en `<body>` fuera del `#app`. Instintivamente el primer borrador apuntó a `index.html`; Claude Code corrigió antes de aplicar.

- **Regla:** `position: sticky` requiere que todos los ancestros entre el elemento y el contenedor de scroll real tengan `overflow: visible`.
  - **Principio:** B.4 (criterio de éxito verificable antes de asumir que funciona).
  - **Contexto:** `overflow: auto` y `overflow: hidden` en un ancestro rompen el sticky de la misma manera. El fix no es "quitar el overflow problemático" sino "poner `overflow: visible` explícitamente".
  - **Ejemplo:** `.page-pane { overflow: auto }` rompía el sticky de `.biblio-controls`. Fix: `.page-pane { overflow: visible }` en el media query.

- **Regla:** Las validaciones de sticky (y en general de comportamiento de scroll/posición) deben ser empíricas (scrollear y medir `getBoundingClientRect().top`), no basadas en el CSS computado.
  - **Principio:** B.4.
  - **Contexto:** `getComputedStyle(el).position === "sticky"` devuelve `"sticky"` aunque el sticky no funcione. El test real es scrollear y verificar que `top` no cambia.

- **Regla:** Cuando Claude Code debe agregar un cambio incremental sobre commits recientes, aplica el delta directamente sobre HEAD; no copia el archivo completo del chat. *(Confirmada desde v09.)*

- **Regla:** Los traspasos se generan en el chat web como archivo descargable, no en Claude Code. *(Confirmada desde v08.)*

---

## 8. Decisiones de diseño tomadas

#### Decisión 1 (v10): Email antispam por codificación HTML de entidades

- **Decisión:** Email `tgonzalez@gmail.com` codificado como entidades HTML (`&#116;&#103;&#111;...`) en `href` y en el texto del enlace.
- **Alternativas consideradas:** (a) JS que reensambla la dirección al hacer clic; (b) imagen del email; (c) formulario de contacto.
- **Justificación:** B.2 (simplicidad primero) — la codificación HTML es efectiva contra scrapers automáticos, no requiere JS adicional, y funciona aunque JS esté desactivado. Alineado con Decisión 3 (v06): sin dependencias externas JS, vanilla JS únicamente.
- **Implicancia:** Los scrapers sofisticados pueden decodificar entidades HTML. Protección básica, no absoluta.

#### Decisión 2 (v10): `.page-pane { overflow: visible }` solo en móvil

- **Decisión:** El override de `overflow` se aplica solo dentro del `@media (max-width: 960px)`, no globalmente.
- **Alternativas consideradas:** Cambiar `overflow: auto` en la definición base de `.page-pane` para todas las resoluciones.
- **Justificación:** En desktop `.page-pane` con `overflow: auto` funciona correctamente y no hay sticky que necesite su ancestro visible. El cambio global habría podido introducir regresiones en desktop difíciles de predecir. El scope mínimo (solo móvil) es más quirúrgico (B.3).

#### Decisión 3 (v10): Clasificación de 54 claims como `no_ref: true` sin búsqueda

- **Decisión:** Los 54 claims clasificados como interpretativos/síntesis recibieron `no_ref: true` sin buscar refs primero.
- **Alternativas consideradas:** Buscar refs para todos antes de marcar.
- **Justificación:** Un claim interpretativo ("no hay evidencia robusta de X", "el mecanismo es plausible por Y", "la hipótesis Z no tiene respaldo") no tiene un paper que lo respalde directamente — es una síntesis editorial. Forzar una cita sería citar un paper que dice algo distinto o más específico. Los 11 empíricos que sí citan datos concretos se dejaron como pendientes P1/P3 para búsqueda dirigida.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| `--content-width` | 700px | `10_fuentes/styles.css` | Aplica a vistas secundarias; Matriz no usa esta variable |
| `--page-pad-x` | 32px (desktop) / 18px (≤960px) | `10_fuentes/styles.css` | |
| `--page-pad-y` | 28px (desktop) / 20px (≤960px) | `10_fuentes/styles.css` | |
| Tabs en header | 4 (Matriz, Glosario, Bibliografía, Metodología) | `10_fuentes/app.js` | Limitaciones fusionada desde v09 |
| Tramos etarios | 5 | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Dimensiones | 10 | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Certeza levels | h / m / l | `10_fuentes/data/metadata.json` + `app.js` | Alta/Media/Baja |
| Términos glosario | 22 | `10_fuentes/glosario-data.js` | `window.GLOSARIO` |
| Refs bibliografía principal | 83 | `10_fuentes/data/bibliografia.json` | Sin cambios en v10 |
| Refs bibliografía glosario | 9 | `10_fuentes/glosario-data.js` | Fuente paralela — ver deuda técnica |
| Total claims | 139 | `10_fuentes/data/claims.json` | Sin cambios en v10 |
| Claims con `no_ref: true` | 54 | `10_fuentes/data/claims.json` | Nuevo desde v10 |
| Claims pendientes (P1/P3) | 11 | `10_fuentes/data/claims.json` | refs=[] sin no_ref flag |
| URL publicada | `https://tomgc.github.io/crianza_y_pantallas/` | GitHub Pages desde `main` | Activa, en `6478d45` |
| Rama de trabajo | `main` directo | Git | Sin rama feature activa al cierre |
| Email de contacto | `tgonzalez@gmail.com` | `template.html`, `app.js` | Codificado en entidades HTML |
| LinkedIn | `https://www.linkedin.com/in/tomasgonzalezcifuentes/` | `template.html`, `app.js` | |

---

## 10. Arquitectura de archivos relevante

Referencia: `30_documentacion/estructura/estructura_actual.md` (escáner ejecutado al cierre, 2026-05-31).

**Cambios estructurales en esta sesión:**
- `10_fuentes/template.html` — footer de contacto agregado.
- `10_fuentes/app.js` — nota de contacto en Metodología; código muerto eliminado.
- `10_fuentes/styles.css` — estilos footer, contact-note, sticky móvil; CSS muerto eliminado.
- `10_fuentes/data/claims.json` — 54 `no_ref: true` aplicados.

**Verificación contra política:**
- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Excepción documentada (Decisión 1, v05).
- ⚠️ Archivos en `10_fuentes/` sin prefijos numéricos (P-ESTRUCTURA, diferido).
- Sin `40_salidas/`: excepción documentada (output es `index.html` en raíz).

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente P1/P3: 11 claims empíricos sin ref

- **Descripción:** Claims que citan datos, estudios o asociaciones empíricas específicas pero no tienen ref. Lista: `lenguaje-lactante[1]` (Children of the 2020s, 9 meses), `lenguaje-primera-infancia[1]` (Children of the 2020s, 2 años), `lenguaje-ninez-media[0]` (comprensión lectora), `lenguaje-ninez-media[1]` (uso educativo beneficioso), `sueno-lactante[1]` (duración sueño), `sueno-primera-infancia[2]` (intervenciones), `fisica-preescolar[2]` (CMOs Reino Unido), `vision-preescolar[0]` (miopía transversal vs longitudinal), `salud-mental-ninez-media[1]` (cyberbullying 8-9 años), `salud-mental-preadolescencia[0]` (redes sociales y depresión), `comportamiento-ninez-media[0]` (TDAH y pantalla).
- **Tipo:** Deuda epistémica / integridad bibliográfica.
- **Impacto:** Assert reporta 11 pendientes reales — no bloqueante pero indica claims citables sin cita.
- **Complejidad:** Baja-media. Búsqueda dirigida en PubMed por claim.
- **Criterio de éxito:** `refs=[]` solo en claims con `no_ref: true` explícito. Assert = 0 pendientes.

#### Pendiente D: Glosario móvil — rediseño de índice

- **Descripción:** En móvil el índice ocupa demasiado espacio antes de la ficha. Necesita presentación más compacta.
- **Tipo:** UI / UX móvil.
- **Complejidad:** Media-alta. Sesión dedicada. Requiere `app.js` + `styles.css`.
- **Criterio de éxito:** Usuario llega a ficha de término con scroll mínimo en móvil.

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

- **Descripción:** `app.js`, `styles.css`, `template.html`, `glosario-data.js` y JSONs en `10_fuentes/data/` sin prefijo numérico.
- **Tipo:** Deuda estructural.
- **Complejidad:** Media. Requiere `prompt_migrar_estructura.md` y DRY_RUN.
- **Precaución:** No combinar con otras ediciones. Sesión dedicada con commit limpio previo.
- **Criterio de éxito:** Build OK después de renombrar; 0 referencias a nombres antiguos.

#### Pendiente P-QA: SEO, cross-browser, usabilidad

- **Tipo:** QA / mejora.
- **Complejidad:** Media. Puede dividirse en sub-tareas.
- **Criterio de éxito:** Checklist SEO básico completo; sin regresiones en 4 navegadores principales.

#### Pendiente Ma2025: Verificar DOI y completar autores

- **Tipo:** Deuda epistémica. Puede hacerse entre sesiones.
- **Criterio de éxito:** DOI verificado, autores completos, entrada integrada al corpus.

### 11.2 Evaluación de deuda técnica

- **11 claims empíricos sin ref:** el assert ahora los distingue correctamente. Conveniente resolver antes del próximo batch bibliográfico.
- **Dos fuentes bibliográficas paralelas:** riesgo de divergencia a medida que crece la bibliografía (83 vs. 9).
- **Archivos sin prefijos en `10_fuentes/`:** deuda estructural no urgente, sesión dedicada cuando el contenido esté más estable.

### 11.3 Auditoría de cierre

- **¿Cada bloque de transformación tiene check de validación? (C.8)** → Sí. Script Python de validación cruzada con asserts numéricos antes de cada commit bibliográfico.
- **¿Los outputs son reproducibles e idempotentes? (C.2, C.3)** → Sí. `./00_build.sh` regenera `index.html` desde fuentes sin estado intermedio.
- **¿Hay decisiones metodológicas documentadas como constantes con nombre? (C.11)** → Sí. Variables CSS con nombres semánticos. Email y LinkedIn hardcodeados en `template.html` y `app.js` — documentados en sección 9.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **P1/P3 — 11 claims empíricos sin ref** — búsqueda dirigida en PubMed. Conveniente antes del próximo batch bibliográfico para no acumular más deuda. Criterio: assert = 0 pendientes reales.
2. **Próximo batch bibliográfico** (dimensión pendiente) — después de P1/P3 para no acumular más claims sin ref.
3. **D — Glosario móvil rediseño** — sesión dedicada cuando haya energía para UI compleja.
4. **P-QA — SEO básico** — meta tags, Open Graph, canonical. Baja complejidad, alto impacto en alcance.

**Diferir:**
- P-ESTRUCTURA — sesión dedicada con protocolo de migración, no mezclar con contenido.
- P4 (unificar biblio) — baja urgencia, diferir hasta que glosario crezca más.
- P6 (adolescencia) — sesión dedicada, alta complejidad.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** modificar `window.GLOSARIO.BIBLIO` (en `glosario-data.js`) sin verificar si el cambio debe replicarse en `bibliografia.json`, y viceversa. Son dos fuentes paralelas.
- ⚠️ **NO** asumir que un archivo JS nuevo en `10_fuentes/` entra al build automáticamente. Requiere marcador en `template.html` y lógica en `00_build.sh`. Ver Bug 8 (v07).
- ⚠️ **NO** asumir que `POLITICA_PROYECTO.md` describe la estructura real. El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1 (v05).
- ⚠️ **NO** agregar citas inline `(Autor et al., año)`. Solo chips `[ref]`. Ver Decisión 2 (v05).
- ⚠️ **NO** copiar `app.js` o `styles.css` del chat web si hay commits recientes encima. Aplicar el delta directamente sobre HEAD. Ver Bug 1 (v09).
- ⚠️ **NO** integrar Ma2025 hasta verificar el DOI en la versión final del journal.
- ⚠️ **NO** editar `index.html` directamente. El footer y cualquier elemento HTML del shell van en `template.html`. Ver Decisión 1 (v10) y Bug 1 (v10 — aprendizaje de footer).
- ✅ **ANTES** de cualquier edición de UI: pedir `app.js` y `styles.css`. No modificar sin leer el estado real.
- ✅ **ANTES** de abrir sesión: ejecutar `Rscript 00_escanear_proyecto.R` y adjuntar `estructura_actual.md`.
- ✅ **ANTES** de usar `position: sticky`: verificar que ningún ancestro entre el elemento y el contenedor de scroll tenga `overflow` distinto de `visible`. Ver Bug 1 (v10).
- 🔒 Sin dependencias externas JS — vanilla JS únicamente. Ver Decisión 3 (v06).
- 🔒 Flujo de trabajo: commit directo a `main` + push.
- 🔒 Los traspasos se generan en el chat web como archivo descargable, no en Claude Code.
- 🔒 El email de contacto está codificado en entidades HTML en `template.html` y `app.js`. No reemplazar por texto plano.

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

print(f'Claims pendientes P1/P3 (sin refs, sin no_ref): {len(sin_refs)}')
for cid, i, txt in sin_refs:
    print(f'  {cid}[{i}]: {txt}')
```

### Fix sticky: overflow en ancestro

```css
/* En el media query del breakpoint donde se usa sticky: */
@media (max-width: 960px) {
  /* REQUERIDO: cualquier ancestro entre el elemento sticky
     y el scroll container real debe tener overflow: visible */
  .page-pane { overflow: visible; }

  .biblio-controls {
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 10;
  }
}
```

### Ejecutar escáner

```bash
Rscript 00_escanear_proyecto.R
# Output en 30_documentacion/estructura/estructura_actual.md
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 11 (Sonnet)`
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
> ⚠️ Traspasos: se generan en el chat web como archivo descargable, no en Claude Code. Ver regla del traspaso v08.
>
> ⚠️ Archivos del chat: NO copiar `app.js`/`styles.css` del chat si hay commits recientes. Claude Code debe aplicar el delta sobre HEAD. Ver Bug 1 del traspaso v09.
>
> ⚠️ index.html: NO editar directamente. El shell HTML va en `template.html`. Ver Decisión 1 del traspaso v10.
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

- `30_documentacion/traspasos/traspaso-cierre-v10.md` (este documento)

**Output del escáner (adjuntar)**

- `30_documentacion/estructura/estructura_actual.md` (ejecutar `Rscript 00_escanear_proyecto.R` antes de abrir)

**Archivos del proyecto críticos (adjuntar según foco)**

- `10_fuentes/data/claims.json` — si la sesión aborda P1/P3 (11 pendientes empíricos).
- `10_fuentes/data/bibliografia.json` — si la sesión aborda próximo batch bibliográfico.
- `10_fuentes/app.js` — si la sesión aborda UI (Pendiente D u otros).
- `10_fuentes/styles.css` — si la sesión aborda UI o QA.

**Datos o referencias externas**

- No aplica para los pendientes de la ruta sugerida (P1/P3 requiere búsqueda en PubMed, no adjuntos).

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
