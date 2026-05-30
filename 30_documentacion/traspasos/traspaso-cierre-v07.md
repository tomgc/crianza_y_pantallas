# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v07
- **Fecha:** 2026-05-29
- **Sesión:** 7 — Responsive (scroll horizontal en matriz móvil) y glosario interactivo modo matriz (vanilla JS, sin dependencias externas).
- **Modelo utilizado:** Sonnet 4.6
- **Entorno:** Web (HTML/JSON/JS estático). Asistente-ejecutor: sesión web + Claude Code.
- **Archivos principales modificados:**
  - `10_fuentes/styles.css` (responsive: overflow-x + min-width)
  - `10_fuentes/app.js` (glosario modo matriz: renderGlosarioView/Index/Ficha + handlers)
  - `10_fuentes/glosario-data.js` (archivo nuevo: window.GLOSARIO)
  - `10_fuentes/template.html` (marcador INJECT_GLOSARIO)
  - `00_build.sh` (inyección de glosario-data.js)
  - `index.html` (output del build, regenerado)
  - `.gitignore` (_archivo/ agregado)
  - `30_documentacion/traspasos/traspaso-cierre-v06.md` (trackeado en esta sesión)

---

## 2. Resumen ejecutivo

La sesión 7 abordó dos pendientes: P1 (responsive) y P3 (glosario interactivo modo matriz). El responsive se resolvió de forma quirúrgica en CSS: `overflow-x: auto` en `.matriz-pane` y `min-width` fijo en los breakpoints de 960px y 560px, eliminando los `grid-template-columns` con `!important` que colapsaban la grilla en móvil. El glosario interactivo se portó del prototipo React a vanilla JS, incorporando índice por dimensión con filtro por tramo, ficha con definición, "Por qué importa", celdas de la matriz donde aparece, papers linkados y conceptos relacionados. La integración requirió un archivo nuevo (`glosario-data.js`) que expone `window.GLOSARIO`, un marcador nuevo en `template.html` y lógica de inyección en `00_build.sh`. Ambas features fueron validadas en navegador antes de commitear. Los 3 commits de la sesión fueron mergeados a `main` y publicados en `https://tomgc.github.io/crianza_y_pantallas/`. Quedaron pendientes: los 3 claims sin ref conocidos (se requiere búsqueda en PubMed), los modos alpha y relevancia del glosario, la Fase 6 (adolescencia) y los prompts de búsqueda desactualizados.

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Sitio en vivo en `https://tomgc.github.io/crianza_y_pantallas/` — versión con responsive y glosario interactivo publicada (`main` en `4b894f2`).
- Pipeline modular completo: build reproducible desde JSONs vía `./00_build.sh`.
- Matriz con 50 celdas, 133 claims, chips `[ref]` navegables, popovers bibliográficos.
- **Responsive nuevo:** en viewport <768px la grilla hace scroll horizontal; la ficha aparece debajo en columna única. Validado en 375px (iPhone SE).
- **Glosario interactivo modo matriz:** índice por dimensión con filtro por tramo (5 opciones), ficha lateral con definición, "Por qué importa", celdas de la matriz, papers linkados, conceptos relacionados navegables. 22 términos, 10 dimensiones. `window.GLOSARIO` inyectado por el build.
- Glosario: 3 modos posibles en el prototipo (relevancia, alpha, matriz) — solo modo matriz implementado en producción.
- `glosario-data.js` trackeado como fuente del build en `10_fuentes/`.
- Escáner `00_escanear_proyecto.R` operativo.
- `bibliografia.json`: 74 entradas. `claims.json`: 133 claims en 50 celdas.

### Qué no funciona / deuda conocida

- **3 claims sin ref:** `sueno-primera-infancia[2]`, `cognicion-ninez-media[1]`, `cognicion-ninez-media[2]`. Requieren búsqueda en PubMed.
- **66 claims con `refs=[]` en total** — diagnóstico nuevo de esta sesión. De estos: 3 son los conocidos pendientes; ~10 son empíricos que deberían tener ref (citan estudios o dan datos concretos); ~46 son interpretativos/mecanísticos (hipótesis, marcos conceptuales, "no hay evidencia robusta") que son aceptables sin cita pero no tienen política explícita (`"no_ref": true` pendiente de implementar).
- **Dos fuentes bibliográficas paralelas:** `window.GLOSARIO.BIBLIO` (9 entradas, datos del glosario interactivo) y `window.__DATA__.bibliografia` (74 entradas, bibliografía principal). Pueden divergir con el tiempo. No bloqueante pero es deuda técnica real.
- Modos alpha y relevancia del glosario no implementados — quedaron para sesión dedicada.
- Prompts de búsqueda (`prompts_busqueda/`) tienen listas de "papers ya integrados" desactualizadas.
- `_archivo/` sin comentario en `.gitignore` (detalle de prolijidad menor).

### Qué cambió respecto al traspaso v06

| Aspecto | v06 | v07 |
|---|---|---|
| Responsive | Panel lateral no usable en móvil | Scroll horizontal en grilla; ficha en columna única bajo 960px |
| Glosario | Lista estática (definición + link Wikipedia) | Interactivo: índice por dimensión, ficha con "Por qué importa", papers, relacionados |
| `glosario-data.js` | En `30_documentacion/andamios/` (inerte) | En `10_fuentes/` (fuente del build, inyectado vía INJECT_GLOSARIO) |
| `template.html` | Sin marcador de glosario | Marcador INJECT_GLOSARIO antes del bloque de app |
| `00_build.sh` | Sin inyección de glosario-data | Inyecta `10_fuentes/glosario-data.js` |
| `.gitignore` | Sin `_archivo/` | `_archivo/` excluido |
| `traspaso-cierre-v06.md` | Untracked | Trackeado |
| Commits adelante de main | 0 | 0 (3 nuevos mergeados) |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Responsive — overflow-x en .matriz-pane y min-width en breakpoints
- **Archivo:** `10_fuentes/styles.css`
- **Categoría:** Diseño visual y UX
- **Qué se hizo:** Tres cambios quirúrgicos en CSS: (a) `overflow-x: auto` agregado a `.matriz-pane` (L167); (b) en breakpoint 960px: `grid-template-columns: 90px repeat(5, 1fr) !important` → `min-width: 520px`; (c) en breakpoint 560px: `grid-template-columns: 76px repeat(5, 1fr) !important` → `min-width: 480px`. Eliminados los `!important` que colapsaban las columnas.
- **Por qué:** En viewport <768px la grilla colapsaba a columnas de ~60px — ilegible. El patrón scroll horizontal es la solución estándar para tablas densas.
- **Cómo se verificó:** Preview en localhost:8080, viewport 375px confirmado funcional. Validación pre-commit con `git diff`.
- **Commit:** `7c91573`
- **Tensiones:** B.2 (simplicidad) vs. alternativas más complejas (selector de tramo obligatorio, vista de lista). Se eligió la opción más quirúrgica.

#### Cambio 2: Infraestructura — _archivo/ a .gitignore y traspaso v06 trackeado
- **Archivos:** `.gitignore`, `30_documentacion/traspasos/traspaso-cierre-v06.md`
- **Categoría:** Infraestructura / gobernanza
- **Qué se hizo:** `_archivo/` agregado al `.gitignore` (snapshots locales no deben entrar a Git). `traspaso-cierre-v06.md` commiteado (estaba untracked).
- **Por qué:** Coherencia con la política de no trackear snapshots locales. El traspaso es documentación de sesión que sí debe versionarse.
- **Cómo se verificó:** `git check-ignore _archivo/` confirmó exclusión. Working tree limpio post-commit.
- **Commit:** `47fc6f1`

#### Cambio 3: Glosario interactivo modo matriz — app.js
- **Archivo:** `10_fuentes/app.js`
- **Categoría:** Implementación de motor JS / glosario
- **Qué se hizo:** (a) State extendido: `glosarioSel` (id del término activo) y `glosarioTramo` ("all" | "0"–"4"); (b) `renderCurrentView()` conecta `case "glosario"` a `renderGlosarioView()`; (c) tres funciones nuevas: `renderGlosarioView()` (contenedor), `renderGlosarioIndex()` (índice por dimensión con selector de tramo), `renderGlosarioFicha()` (ficha con definición, "por qué importa", celdas, papers, relacionados); (d) handlers en `onRootClick`: `[data-gl-term]` selecciona término, `[data-gl-rel]` navega a relacionado con scroll suave; (e) handler en `onRootChange`: `gl-tramo-sel` filtra el índice sin re-render completo.
- **Por qué:** Portar el prototipo React (en andamios) a vanilla JS manteniendo la arquitectura existente del sitio. Sin React, sin Babel, sin dependencias externas. Decisión 3 del proyecto.
- **Cómo se verificó:** `node --check` (sintaxis), preview en navegador: índice carga, filtro por tramo funciona, ficha actualiza al hacer clic, chips de relacionados navegan entre términos, sin errores en consola.
- **Commit:** `3a35358`
- **Dependencias afectadas:** Requiere `window.GLOSARIO` definido antes de que `app.js` se ejecute — resuelto por `glosario-data.js` inyectado vía INJECT_GLOSARIO.

#### Cambio 4: Glosario interactivo — glosario-data.js (archivo nuevo)
- **Archivo:** `10_fuentes/glosario-data.js`
- **Categoría:** Implementación de motor JS / glosario
- **Qué se hizo:** Archivo nuevo que expone `window.GLOSARIO = { BIBLIO, DIMS, TRAMOS, TERMS, GRUPOS, TYPE_LABEL }`. Datos tomados íntegros del prototipo React en andamios. IIFE autocontenido, sin dependencias.
- **Por qué:** `app.js` lee `window.GLOSARIO`; los datos deben cargarse en un script previo. Separar datos de lógica de render es coherente con la arquitectura del proyecto (JSONs separados de `app.js`).
- **Cómo se verificó:** `node --check`, `window.GLOSARIO` confirmado en runtime via `preview eval`.
- **Commit:** `3a35358`

#### Cambio 5: Glosario interactivo — estilos .gl-* en styles.css
- **Archivo:** `10_fuentes/styles.css`
- **Categoría:** Diseño visual y UX
- **Qué se hizo:** ~158 líneas nuevas con todos los estilos del glosario: `.gl-body`, `.gl-index`, `.gl-dim-group`, `.gl-dim-head`, `.gl-list`, `.gl-item`, `.gl-ficha-pane`, `.gl-ficha`, `.gl-why`, `.gl-cell-chip`, `.gl-papers`, `.gl-rel-chip`, responsive `@media (max-width: 960px)` para el glosario.
- **Por qué:** Estilos tomados del `Glosario.html` del prototipo, adaptados al sistema de variables CSS del proyecto.
- **Commit:** `3a35358`

#### Cambio 6: Build — marcador INJECT_GLOSARIO en template.html
- **Archivo:** `10_fuentes/template.html`
- **Categoría:** Infraestructura / herramientas operativas
- **Qué se hizo:** Agregado `<script><!--INJECT_GLOSARIO--></script>` antes del bloque de app en el template.
- **Por qué:** El build necesita un punto de inyección para `glosario-data.js`. Sin este marcador, `window.GLOSARIO` no llega al HTML generado y el glosario muestra "Datos del glosario no disponibles".
- **Commit:** `3a35358`

#### Cambio 7: Build — inyección de glosario-data.js en 00_build.sh
- **Archivo:** `00_build.sh`
- **Categoría:** Infraestructura / herramientas operativas
- **Qué se hizo:** Lógica nueva en el build: leer `10_fuentes/glosario-data.js`, reemplazar `<!--INJECT_GLOSARIO-->` con el contenido (con fallback a vacío si no existe el archivo).
- **Por qué:** Coherente con el patrón existente de inyección de `app.js` y `styles.css`.
- **Commit:** `3a35358`

#### Cambio 8: Merge refactor/modular-build → main y push a producción
- **Categoría:** Infraestructura / gobernanza
- **Qué se hizo:** `git merge refactor/modular-build --no-ff` en main (merge `4b894f2`, 8 archivos, +2325/−10). `git push origin main`. Sitio publicado.
- **Por qué:** Los 3 commits de la sesión validados visualmente antes de publicar.
- **Commit de merge:** `4b894f2`

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020-2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON vía `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1-4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación.*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~16% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~13% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Limpieza editorial | ~23 | ~15% | Eliminación de citas inline, expansión de siglas, corrección de textos, glosario mejorado |
| Corrección de integridad bibliográfica | ~14 | ~9% | Sesiones 5-6: huérfanas, mismatches, refs vacíos, mismatch de edad |
| Incorporación de evidencia | 13 | ~8% | Sesión 4: 13 papers + 27 ediciones + 1 corrección epistémica |
| Diseño visual y UX | ~18 | ~12% | Wireframe B, paleta, estados vacíos, responsive, estilos glosario |
| Implementación de motor JS | ~14 | ~9% | Fase 4: `app.js`, render, panel lateral, popovers, deep linking; sesión 7: glosario interactivo |
| Bibliografía y popovers | ~7 | ~5% | Diseño del popover, navegación, filtros |
| Infraestructura / herramientas operativas | ~9 | ~6% | Escáner, flujo de incorporación, prompts modulares, publicación, build con INJECT_GLOSARIO |
| Documentación / gobernanza | ~8 | ~5% | CLAUDE.md, README, convenciones, excepciones estructurales, .gitignore |
| Andamiaje entre celdas | ~5 | ~3% | Cascadas entre celdas |
| Corrección factual | ~2 | ~1% | 5 Cs AAP, certeza de la evidencia |

**Total estimado: ~158**

### 5.4 Resumen estadístico por sesión

| Sesión | Traspaso | N° cambios | Modelo | Foco principal |
|---|---|---|---|---|
| 1 | v01 | ~30 | Sonnet/Opus | Wireframe inicial React standalone |
| 2 | v02 | ~35 | Opus | Migración a estructura modular |
| 3 | v03 | ~35 | Opus | Build reproducible, JSONs validados, Fase 0-3 |
| entre 3-4 | — | ~3 | Sonnet | Fase 4 app.js, UX fix |
| 4 | v04 | 6 (con 27 sub-ediciones) | Opus | Bibliografía + prompts modulares |
| 5 | v05 | ~20 | Sonnet 4.6 | Infraestructura, limpieza editorial, integridad bibliográfica |
| 6 | v06 | ~17 | Sonnet 4.6 | Integridad bibliográfica, glosario, publicación |
| 7 | v07 | ~12 | Sonnet 4.6 | Responsive + glosario interactivo modo matriz |

**Total acumulado: ~158 cambios.**

### 5.5 Detalle cronológico de cambios por sesión

### Sesiones 1-5 — ver traspaso v05 (ítems 1-22)

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v05.md`, sección 5.5.)*

---

### Sesión 6 (Sonnet 4.6) — 2026-05-29

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v06.md`, sección 5.5, ítems 23-39.)*

---

### Sesión 7 (Sonnet 4.6) — 2026-05-29

Responsive móvil y glosario interactivo modo matriz (vanilla JS).

**Diagnóstico y auditoría**

40. Auditoría de archivos adjuntos: confirmado que `claims.json` y `bibliografia.json` son versiones post-sesión 6 (74 refs, refs de sueño/cognición correctas). Detectados 66 claims con `refs=[]` — el traspaso v06 solo documentaba 3; los 63 restantes son combinación de 10 empíricos sin ref por omisión y ~46 interpretativos/mecanísticos sin política explícita.
41. Clasificación de los 66 claims sin ref: 3 pendientes conocidos, ~10 empíricos que necesitan búsqueda, ~46 interpretativos que son aceptables sin cita (política `"no_ref": true` pendiente de implementar).

**Responsive (P1)**

42. CSS responsive: `overflow-x: auto` en `.matriz-pane`; `min-width: 520px` en breakpoint 960px; `min-width: 480px` en breakpoint 560px. Eliminados `!important` y `grid-template-columns` hardcodeados.
43. Infraestructura: `_archivo/` agregado a `.gitignore`; `traspaso-cierre-v06.md` trackeado.

**Glosario interactivo modo matriz (P3)**

44. `app.js`: state extendido con `glosarioSel` y `glosarioTramo`; funciones `renderGlosarioView`, `renderGlosarioIndex`, `renderGlosarioFicha`; handlers para `[data-gl-term]`, `[data-gl-rel]`, `gl-tramo-sel`.
45. `glosario-data.js`: archivo nuevo en `10_fuentes/` con `window.GLOSARIO` (22 términos, 10 dims, 9 refs de la bibliografía del prototipo).
46. `styles.css`: ~158 líneas de estilos `.gl-*` tomados del prototipo, adaptados al sistema de variables del proyecto.
47. `template.html`: marcador `INJECT_GLOSARIO` agregado antes del bloque de app.
48. `00_build.sh`: lógica de inyección de `glosario-data.js` en el marcador INJECT_GLOSARIO.
49. Validación runtime: `window.GLOSARIO` definido, 22 términos, 10 dims, sin errores en consola. Glosario renderiza en navegador con índice, filtro por tramo y ficha.
50. Merge `refactor/modular-build` → `main` y push a producción (`4b894f2`).

---

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron ~12 cambios nuevos correspondientes a la sesión 7 (ítems 40-50).
- Se refinó la taxonomía: "Diseño visual y UX" creció de ~15 a ~18 por los estilos del glosario; "Implementación de motor JS" creció de ~8 a ~14 por el glosario interactivo; "Infraestructura" creció de ~7 a ~9 por INJECT_GLOSARIO y build.sh.

---

## 6. Bugs encontrados y su resolución

### Bug 8: window.GLOSARIO undefined en primera integración
- **Síntoma:** Tab "Glosario" mostraba "Datos del glosario no disponibles" al cargar el sitio local.
- **Causa raíz:** `app.js` nuevo referencia `window.GLOSARIO` (definido por `glosario-data.js`), pero el build no inyectaba ese archivo. Claude Code había determinado incorrectamente que `glosario-data.js` era redundante porque "el glosario ya estaba embebido en app.js" — confundió las funciones de render con los datos.
- **Solución:** Marcador `INJECT_GLOSARIO` en `template.html` + lógica de inyección en `00_build.sh`. `glosario-data.js` copiado a `10_fuentes/` y trackeado.
- **Criterio de verificación:** `window.GLOSARIO` presente en `index.html` generado; tab Glosario renderiza en navegador sin errores.
- **Patrón aprendido:** El build solo consume lo que está en `template.html` + `data/*.json` + `app.js`. Cualquier archivo JS nuevo en `10_fuentes/` requiere un marcador de inyección explícito — no entra automáticamente.
- **Principios:** C.9 (resiliencia: el build debería fallar con mensaje claro si falta INJECT_GLOSARIO, no silenciosamente).
- **Estado:** Resuelto.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Todo archivo JS nuevo en `10_fuentes/` requiere un marcador de inyección explícito en `template.html` y lógica correspondiente en `00_build.sh`. No entra al build automáticamente.
  - **Principio:** C.12 (dependencias explícitas).
  - **Contexto:** El build consume exactamente lo que está en el template. Asumir que un archivo en `10_fuentes/` "entra solo" es el error más probable al agregar nuevas fuentes.
  - **Ejemplo:** `glosario-data.js` pasó por 3 intentos fallidos antes de diagnosticar que faltaba el marcador.

- **Regla:** `window.GLOSARIO.BIBLIO` y `window.__DATA__.bibliografia` son dos fuentes bibliográficas paralelas. No modificar una sin revisar si debe actualizarse en la otra.
  - **Principio:** C.1 (inmutabilidad de la fuente, aplicado a consistencia entre fuentes).
  - **Contexto:** El glosario interactivo usa sus propios 9 papers (del prototipo React), distintos de los 74 de `bibliografia.json`. Si se agregan nuevas refs a `bibliografia.json`, los papers del glosario no se actualizan automáticamente.

---

## 8. Decisiones de diseño tomadas

### Decisión 4: Responsive por scroll horizontal (no por colapso de columnas)

- **Decisión:** En móvil, la grilla mantiene su ancho natural y `.matriz-pane` hace scroll horizontal.
- **Alternativas consideradas:** (a) Selector de tramo obligatorio en móvil (ocultar 4 columnas, mostrar 1); (b) Vista de lista reemplazando la grilla.
- **Justificación:** La opción A es la más quirúrgica — solo CSS, no toca `app.js`, es el patrón estándar para tablas densas. Las alternativas B y C requerían cambios en `app.js` y más riesgo de regresión.
- **Implicancia:** Si el feedback de usuarios indica que el scroll no es suficiente, la Decisión 4 puede revisarse y evolucionar a la opción B en sesión dedicada.

### Decisión 5: Glosario con datos externalizados en window.GLOSARIO

- **Decisión:** Los datos del glosario (`TERMS`, `DIMS`, `BIBLIO`, etc.) viven en `glosario-data.js` (expuesto como `window.GLOSARIO`), separado de `app.js`.
- **Alternativas consideradas:** (a) Inline en `app.js`; (b) Convertir a `data/glosario.json` y leer desde `window.__DATA__`.
- **Justificación:** La separación datos/lógica es coherente con la arquitectura del proyecto. La opción B hubiera requerido cambios más profundos en el build y en cómo `app.js` accede a los datos.
- **Implicancia:** Existe deuda técnica de dos fuentes bibliográficas paralelas. A largo plazo convendría unificar `window.GLOSARIO.BIBLIO` con `window.__DATA__.bibliografia`.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| Tramos etarios | 5 (lactante, primera infancia, preescolar, niñez media, preadolescencia) | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Dimensiones | 10 (Lenguaje, Cognición, ...) | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Certeza levels | h / m / l | `10_fuentes/data/metadata.json` + `app.js` | Alta/Media/Baja |
| Términos glosario | 22 | `10_fuentes/glosario-data.js` | TERMS array en window.GLOSARIO |
| Refs bibliografía principal | 74 | `10_fuentes/data/bibliografia.json` | |
| Refs bibliografía glosario | 9 | `10_fuentes/glosario-data.js` | BIBLIO en window.GLOSARIO — fuente paralela |
| URL publicada | `https://tomgc.github.io/crianza_y_pantallas/` | GitHub Pages desde `main` | Activa, en `4b894f2` |
| Rama de trabajo | nueva rama para próxima sesión | Git | `refactor/modular-build` mergeada a main |

---

## 10. Arquitectura de archivos relevante

Referencia: ejecutar `Rscript 00_escanear_proyecto.R` al abrir la próxima sesión — el escáner no se corrió al cierre de esta sesión.

**Cambios estructurales en esta sesión:**
- `10_fuentes/glosario-data.js` — archivo nuevo, trackeado, fuente del build.
- `10_fuentes/template.html` — marcador INJECT_GLOSARIO agregado.
- `00_build.sh` — lógica de inyección del glosario.
- `_archivo/20260529/` — snapshot local pre-cambios (ignorado por git).

**Verificación contra política:**
- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Excepción documentada y aceptada (Decisión 1, v05). Ver CLAUDE.md.
- Sin `40_salidas/`: excepción documentada (output es `index.html` en raíz).
- Naming respeta sección 2.3: snake_case, sin tildes/ñ/espacios.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: Resolver 3 claims sin ref conocidos
- **Descripción:** `sueno-primera-infancia[2]` ("intervenciones reducen pantalla → mejoran sueño"), `cognicion-ninez-media[1]` ("pantalla educativa puede ser beneficiosa"), `cognicion-ninez-media[2]` ("restricción celulares en aula no mejora resultados").
- **Tipo:** Deuda epistémica / integridad bibliográfica.
- **Impacto:** Claims sin respaldo navegable en el sitio público.
- **Complejidad:** Baja-media (requiere búsqueda en PubMed + verificación de tramo etario).
- **Precauciones:** No asignar refs sin verificar que la muestra corresponde al tramo. Ver Bug 7 (v06).
- **Criterio de éxito:** `refs=[]` solo en claims con `"no_ref": true` explícito.

#### Pendiente 2: Política para claims interpretativos (46 casos)
- **Descripción:** Definir e implementar `"no_ref": true` en los ~46 claims interpretativos/mecanísticos que son aceptables sin cita. Separar visualmente de los que sí necesitan ref.
- **Tipo:** Deuda técnica / política de datos.
- **Impacto:** Sin esta política, cualquier assert de "cero `refs=[]`" reporta 66 falsos positivos.
- **Complejidad:** Media (requiere revisar los 46 claims, aprobar claim por claim).
- **Criterio de éxito:** Assert limpio distingue intencionales vs. pendientes.

#### Pendiente 3: Resolver 10 claims empíricos sin ref
- **Descripción:** ~10 claims que citan estudios por nombre, dan cifras concretas o mencionan instituciones pero no tienen `refs[]`. Requieren búsqueda bibliográfica.
- **Tipo:** Deuda epistémica.
- **Dependencias:** Conveniente después de P2 (política definida).
- **Complejidad:** Media-alta (sesión dedicada + PubMed).

#### Pendiente 4: Unificar fuentes bibliográficas
- **Descripción:** `window.GLOSARIO.BIBLIO` (9 entradas) y `window.__DATA__.bibliografia` (74 entradas) son fuentes paralelas que pueden divergir. Opciones: (a) que `glosario-data.js` lea de `window.__DATA__`; (b) agregar los 9 papers del glosario a `bibliografia.json`.
- **Tipo:** Deuda técnica.
- **Impacto:** Bajo a corto plazo; riesgo de divergencia a medida que crezca la bibliografía.
- **Complejidad:** Media.
- **Criterio de éxito:** Una sola fuente bibliográfica en el proyecto.

#### Pendiente 5: Glosario — modos alpha y relevancia
- **Descripción:** Implementar los dos modos restantes del prototipo React: buscador A-Z con filtros por tipo, e índice por relevancia/novedad.
- **Tipo:** Funcionalidad nueva.
- **Dependencias:** Modo matriz ya funcional (completado).
- **Complejidad:** Media (~1 sesión).
- **Criterio de éxito:** Tres modos funcionando con selector visible.

#### Pendiente 6: Fase 6 — claims de adolescencia
- **Descripción:** Filas faltantes en la matriz para el tramo de adolescencia.
- **Tipo:** Funcionalidad nueva / contenido.
- **Complejidad:** Alta. Sesión dedicada.

#### Pendiente 7: Actualizar prompts de búsqueda bibliográfica
- **Descripción:** Los 11 archivos en `30_documentacion/activa/prompts_busqueda/` tienen listas de "papers ya integrados" que no reflejan las 74 entradas actuales.
- **Tipo:** Documentación / gobernanza.
- **Complejidad:** Baja.

#### Pendiente 8: PDFs UNICEF/CJE UC
- **Tipo:** Documentación. ~10 minutos. Entre sesiones.

### 11.2 Evaluación de deuda técnica

- **Dos fuentes bibliográficas paralelas:** `window.GLOSARIO.BIBLIO` y `window.__DATA__.bibliografia`. No bloqueante pero puede crear inconsistencias.
- **66 claims con `refs=[]`:** Sin política `"no_ref": true`, cualquier validación futura reportará falsos positivos. Conveniente resolver antes de agregar más contenido.
- **Build sin validación de marcadores:** Si un marcador `INJECT_*` falla silenciosamente, el HTML generado no muestra error — solo el feature no funciona. Sería útil agregar un assert post-build que verifique que los marcadores fueron reemplazados (ver Bug 8).

### 11.3 Auditoría de cierre

- **¿Cada bloque de transformación tiene check de validación? (C.8)** → Sí para los cambios a CSS y JS (verificación en navegador). No hay asserts automatizados para CSS — aceptable para este tipo de proyecto.
- **¿Los outputs son reproducibles e idempotentes? (C.2, C.3)** → Sí. `./00_build.sh` regenera `index.html` desde fuentes sin estado intermedio.
- **¿Hay decisiones metodológicas documentadas como constantes con nombre? (C.11)** → Parcialmente. Decisiones arquitectónicas documentadas en este traspaso y en CLAUDE.md.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Política `"no_ref": true` (Pendiente 2)** — Bajo riesgo, alta claridad. Define el baseline limpio para todos los asserts futuros. Requiere `claims.json`. Criterio: assert distingue intencionales vs. pendientes.
2. **Resolver 3 claims conocidos sin ref (Pendiente 1)** — Integridad del corpus publicado. Requiere búsqueda en PubMed. Criterio: validación cruzada sin huérfanas no-intencionales.
3. **Unificar fuentes bibliográficas (Pendiente 4)** — Deuda técnica concreta con solución clara. Criterio: una sola fuente bibliográfica.
4. **Glosario modos alpha y relevancia (Pendiente 5)** — Si la sesión alcanza.

**Diferir:**
- Pendiente 3 (10 empíricos sin ref) — requiere sesión de lectura de papers.
- Pendiente 6 (Fase 6 adolescencia) — alta complejidad, sesión dedicada.
- Pendientes 7 y 8 — entre sesiones.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** integrar entradas bibliográficas sin verificar autoría primaria Y tramo etario de la muestra contra PubMed o DOI. Ver Bug 7 (v06) y Bug 3 (v04).
- ⚠️ **NO** asumir que `POLITICA_PROYECTO.md` describe la estructura real del proyecto. El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1 (v05). Verificar con `ls` antes de generar rutas.
- ⚠️ **NO** agregar citas inline `(Autor et al., año)` al texto de claims. Solo chips `[ref]`. Ver Decisión 2 (v05).
- ⚠️ **NO** usar regex ciego para ediciones masivas de texto en claims. Siempre hand-curated con aprobación claim por claim.
- ⚠️ **NO** usar `sed -i` sin sufijo en macOS — falla silenciosamente. Usar `sed -i ''` o Edit tool.
- ⚠️ **NO** asumir que un archivo JS nuevo en `10_fuentes/` entra al build automáticamente. Requiere marcador en `template.html` y lógica en `00_build.sh`. Ver Bug 8 (esta sesión).
- ⚠️ **NO** modificar `window.GLOSARIO.BIBLIO` (en `glosario-data.js`) sin verificar si el cambio debe replicarse en `bibliografia.json`, y viceversa. Son dos fuentes paralelas.
- ✅ **ANTES** de cualquier sesión: ejecutar `Rscript 00_escanear_proyecto.R` y adjuntar `estructura_actual.md`.
- ✅ **ANTES** de asignar un ref a un claim, verificar que el tramo etario de la muestra del paper corresponde al tramo de la celda.
- 🔒 El sitio se publica desde `main` vía GitHub Pages. Cambios van en rama dedicada hasta validación visual completa.
- 🔒 Sin dependencias externas JS — vanilla JS únicamente. Ver Decisión 3 (v06).

---

## 13. Fragmentos de código de referencia

### Verificar claims sin refs (clasificación)

```python
import json, re

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

### Marcar claim como no_ref intencional

```python
import json

claims = json.load(open('10_fuentes/data/claims.json'))

# Verificar estado previo
assert not claims['cognicion-ninez-media']['claims'][1].get('no_ref')

# Marcar
claims['cognicion-ninez-media']['claims'][1]['no_ref'] = True

with open('10_fuentes/data/claims.json', 'w', encoding='utf-8') as f:
    json.dump(claims, f, ensure_ascii=False, indent=2)
    f.write('\n')
print('OK')
```

### Flujo canónico de incorporación bibliográfica

```bash
set -e

python3 -c "
import json

biblio = json.load(open('10_fuentes/data/bibliografia.json'))
ids = {b['id'] for b in biblio}

assert 'NuevoId2025' not in ids, 'ID ya existe'
assert len(biblio) == 74, f'Esperado 74, hay {len(biblio)}'

biblio.append({
    'id': 'NuevoId2025',
    'group': 'recent',
    'type': 'review',
    'authors': 'Apellido A., et al. 2025',
    'title': 'Titulo sin punto final',
    'journal': 'Journal Vol(N):pp',
    'url': 'https://doi.org/...'
})

assert len(biblio) == 75

with open('10_fuentes/data/bibliografia.json', 'w', encoding='utf-8') as f:
    json.dump(biblio, f, ensure_ascii=False, indent=2)
    f.write('\n')
print('OK')
"

./00_build.sh
git add 10_fuentes/data/bibliografia.json 10_fuentes/data/claims.json index.html
git commit -m "Incorporar NuevoId2025: descripcion del cambio"
```

### Snippet para obtener IDs vigentes en biblio

```bash
python3 -c "import json; print(sorted([b['id'] for b in json.load(open('10_fuentes/data/bibliografia.json'))]))"
```

### Ejecutar escáner

```bash
Rscript 00_escanear_proyecto.R
# Output en 30_documentacion/estructura/estructura_actual.md
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 8 (Opus)`
(Reemplazar "Opus" por el modelo que vayas a usar.)

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
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos para la próxima sesión

**Documentos de protocolo (knowledge base del Project)**

NO requieren ser adjuntados. Verifica que estén disponibles:

- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md` (⚠️ con discrepancia respecto al proyecto real, ver Decisión 1)
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`
- `prompt-cierre-sesion.md`

**Opcionales según foco**

- `asistente_claude_code_seguro.md` — la próxima sesión probablemente usa Claude Code.

**Documento de traspaso (adjuntar)**

- `30_documentacion/traspasos/traspaso-cierre-v07.md` (este documento)

**Output del escáner (adjuntar)**

- `30_documentacion/estructura/estructura_actual.md` (ejecutar `Rscript 00_escanear_proyecto.R` antes de abrir)

**Archivos del proyecto críticos (adjuntar)**

- `10_fuentes/data/claims.json` — 50 celdas / 133 claims. Necesario para P1 (claims sin ref) y P2 (política no_ref).
- `10_fuentes/data/bibliografia.json` — 74 entradas. Necesario para verificar IDs.
- `10_fuentes/glosario-data.js` — si la sesión toca el glosario (modos alpha/relevancia o unificación de fuentes).
- `10_fuentes/app.js` — si la sesión toca el glosario o cualquier feature de JS.
- `30_documentacion/activa/CLAUDE.md` — convenciones actualizadas del proyecto.

**Datos o referencias externas**

No aplica.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
