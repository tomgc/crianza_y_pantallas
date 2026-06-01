# Traspaso de Cierre — Crianza y Pantallas
- **Versión de traspaso:** v16
- **Fecha:** 2026-06-01
- **Sesión:** 16 — D-click (labels de dimensión abren ficha lateral) y D-visual (colores por bloque temático en columna izquierda).
- **Modelo utilizado:** Opus 4.8
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)
- **Archivos principales modificados:**
  - `10_fuentes/app.js`
  - `10_fuentes/styles.css`
  - `index.html`

---

## 2. Resumen ejecutivo

La sesión 16 implementó dos features visuales acordadas desde el traspaso v14: D-click y D-visual. D-click reemplaza el tooltip flotante de hover por un clic en el label de dimensión que abre su definición (texto + links "Leer más") en la ficha lateral, con exclusión mutua respecto a la celda activa. D-visual agrega cuatro colores de fondo tenues en la columna izquierda de la matriz según bloque temático (cognitivo/azul, socioemocional/verde, digital/violeta, bienestar/naranja). La sesión tuvo una complicación operativa: en varias entregas intermedias el archivo `app.js` resultó ser una versión híbrida (tooltip hover restaurado + scaffolding D-click sin cablear), lo que requirió reconstruir el archivo desde base limpia. Ambas features quedaron verificadas funcionalmente en navegador con preview antes del commit. Se detectaron y corrigieron dos bugs de especificidad CSS (colores de bloque anulados por `.grid-cell.row-head`) y un bug de render (la ficha-dim no sobrevivía re-renders completos). Los dos commits están pusheados a `origin/main` y GitHub Pages sirve la versión actualizada. Quedan pendientes: fix escáner, DOIs sin verificar, no_ref-review y og-image.

---

## 3. Estado del proyecto al cierre

**Qué funciona:**
- Sitio en vivo: build OK, `index.html` 8436 líneas, assert 0 huérfanos / 0 duplicados / 240 claims / 250 refs.
- D-click operativo: clic en cualquiera de los 15 labels de dimensión abre ficha con eyebrow "Dimensión", chip con nombre, texto de definición (~100–150 palabras) y sección "Leer más" con 1–3 links verificados.
- Exclusión mutua D-click ↔ celda: clic en celda limpia `activeDim`; clic en dimensión limpia `activeCell`.
- Ficha-dim sobrevive re-renders completos (cambio de tab + vuelta a Matriz).
- D-visual operativo: 4 colores de fondo por bloque en columna izquierda, con hover más saturado y estado activo (`dim-active`) con borde azul + tinte oscuro del bloque.
- Hover antiguo (tooltip flotante) eliminado por completo — 0 referencias en `index.html`.
- Build reproducible: `./00_build.sh` → `index.html` desde fuentes.

**Qué no funciona / deuda conocida:**
- Escáner cuenta sus propios snapshots en el total (deuda de v15).
- `HernandezMosqueira2025` y `Ma2025`: DOIs sin verificar (deuda de v12).
- 19 claims `no_ref: true` sin revisión editorial formal.
- og-image decorativa muestra rejilla 10×5 (cosmético, sin generador en repo).
- En viewports muy estrechos donde el topbar envuelve, la leyenda "Certeza" puede quedar desalineada (cosmético, no crítico).

**Qué cambió respecto a v15:**
- `app.js`: +`activeDim` en state; +`DIM_BLOCKS` (mapeo 15 dims → 4 clases); `renderFichaDim`; `openDimFicha`; handler click en `.row-head[data-dim-id]`; eliminadas `showDimTooltip`, `positionDimTooltip`, `closeDimTooltip` y sus listeners; fix línea 274 (ternario `activeDim ? renderFichaDim : renderFicha`); `activeCell` se limpia al abrir ficha-dim.
- `styles.css`: +4 variables de fondo por bloque con especificidad corregida (`.grid-cell.row-head.bloque-X`); +hover y dim-active por bloque; +`.dim-ficha-links`/`.dim-ficha-link`; eliminado bloque `.dim-tooltip` completo.
- 2 commits pusheados: `766752d` (D-click) + `ae70ae5` (D-visual + fix ficha-dim).

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: D-click — eliminación del tooltip hover
- **Archivo(s) afectado(s):** `10_fuentes/app.js`
- **Categoría temática:** UI / Render
- **Qué se hizo:** Eliminadas funciones `showDimTooltip`, `positionDimTooltip`, `closeDimTooltip` y sus listeners `mouseover`/`mouseleave`. Eliminada referencia a `closeDimTooltip` en handler Escape. Limpiado `onDocClick` (guard de `.dim-tooltip` eliminado).
- **Por qué se hizo:** El tooltip flotante no funciona en móvil y la ficha lateral es el patrón establecido del sitio para mostrar contenido detallado.
- **Cómo se verificó:** `grep -c "showDimTooltip\|closeDimTooltip" index.html` → 0.

#### Cambio 2: D-click — estado activeDim y exclusión mutua
- **Archivo(s) afectado(s):** `10_fuentes/app.js`
- **Categoría temática:** UI / Render
- **Qué se hizo:** Agregado `activeDim: null` en `state`. `openDimFicha(dimId)` setea `state.activeDim`, limpia `state.activeCell`, re-renderiza matriz y ficha. Handler de clic en `.data-cell` limpia `state.activeDim` al activar una celda.
- **Por qué se hizo:** Exclusión mutua para que la ficha muestre siempre un único estado coherente.
- **Cómo se verificó:** Preview funcional — clic dim → ficha dim; clic celda → ficha celda, highlight dim se limpia.

#### Cambio 3: D-click — renderFichaDim
- **Archivo(s) afectado(s):** `10_fuentes/app.js`
- **Categoría temática:** UI / Render
- **Qué se hizo:** Nueva función `renderFichaDim(dimId)`: eyebrow "Dimensión", chip con nombre de la dimensión, párrafo con el texto de `DIM_DESCRIPTIONS[dimId].text`, sección "Leer más" con links `dim-ficha-link`. Fallback a `renderFicha(null)` si no hay descripción.
- **Cómo se verificó:** Preview — 15/15 dimensiones muestran texto y links en la ficha.

#### Cambio 4: D-click — fix render completo (línea 274)
- **Archivo(s) afectado(s):** `10_fuentes/app.js`
- **Categoría temática:** Corrección de bugs
- **Qué se hizo:** Línea 274 (`renderMatrizView`) cambiada de `renderFicha(state.activeCell)` a `state.activeDim ? renderFichaDim(state.activeDim) : renderFicha(state.activeCell)`.
- **Por qué se hizo:** Sin el fix, un re-render completo (tab round-trip) con dimensión activa revertía la ficha a vacío mientras el highlight `dim-active` seguía visible → inconsistencia.
- **Cómo se verificó:** Tab round-trip con dim activa → ficha conserva definición ✓.

#### Cambio 5: D-click — estilos ficha de dimensión
- **Archivo(s) afectado(s):** `10_fuentes/styles.css`
- **Categoría temática:** UI / Render
- **Qué se hizo:** Agregados `.dim-ficha-links` (margin-top) y `.dim-ficha-link` (display block, color accent, borde inferior entre links, hover underline). Eliminado bloque `.dim-tooltip` completo (~40 líneas).
- **Cómo se verificó:** Visual en preview — links en ficha con estilo coherente con el resto del panel.

#### Cambio 6: D-visual — objeto DIM_BLOCKS
- **Archivo(s) afectado(s):** `10_fuentes/app.js`
- **Categoría temática:** UI / Render / Arquitectura de contenido
- **Qué se hizo:** Nuevo objeto `DIM_BLOCKS` que mapea los 15 `dimId` a 4 clases CSS: `bloque-cognitivo` (lenguaje, cognicion, creatividad), `bloque-socioemocional` (socioemocional, comportamiento, vinculo, co-regulacion), `bloque-digital` (alfabetizacion, privacidad, cyberbullying), `bloque-bienestar` (salud-mental, sueno, fisica, alimentacion, vision).
- **Por qué se hizo:** Permite etiquetar visualmente los 4 bloques temáticos acordados con Tomás en esta sesión.

#### Cambio 7: D-visual — clase de bloque en row-head
- **Archivo(s) afectado(s):** `10_fuentes/app.js`
- **Categoría temática:** UI / Render
- **Qué se hizo:** En `renderMatriz`, cada `row-head` recibe clase `bloque-*` desde `DIM_BLOCKS[d.id]` además de `dim-active` cuando corresponde.

#### Cambio 8: D-visual — estilos por bloque con especificidad correcta
- **Archivo(s) afectado(s):** `10_fuentes/styles.css`
- **Categoría temática:** UI / Render
- **Qué se hizo:** Cuatro reglas de fondo base con selector `.grid-cell.row-head.bloque-X` (especificidad 0,3,0 para ganar a `.grid-cell.row-head` que es 0,2,0). Cuatro reglas hover/activo con selector `.grid-cell.row-head.bloque-X:hover` y `.grid-cell.row-head.bloque-X.dim-active` (0,4,0). Box-shadow para `dim-active` en los 4 bloques.
- **Por qué se hizo:** Primera versión usaba `.bloque-X` (0,1,0) que perdía contra la regla base de la celda → colores no visibles. Segunda versión corrigió base pero no hover/activo → tinte oscuro en estado activo no se aplicaba. Tercera iteración correcta.
- **Cómo se verificó:** Estilo computado en preview: los 4 colores de reposo y el color activo verificados por valor RGB exacto.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

Crianza y Pantallas es un sitio web estático que sintetiza evidencia científica revisada por pares sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz de dimensiones del desarrollo × tramos etarios. El sitio está dirigido a padres y cuidadores en Chile. La tecnología es HTML/CSS/JS vanilla con datos en JSON. El proyecto se inició en 2025 y se desarrolla en sesiones de trabajo con Claude, cada una documentada con un traspaso versionado.

### 5.2 Nota metodológica

Cada ítem del backlog representa una solicitud o decisión conceptualmente distinguible del usuario. Los errores introducidos por el asistente y corregidos inmediatamente en el mismo turno no se contabilizan; sí se cuentan los bugs reportados por el usuario o detectados en validación. La clasificación temática es por intención primaria. Las fuentes son los documentos de traspaso y el historial de conversaciones.

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Integración de evidencia | ~85 | 26% | Agregar claims, referencias bibliográficas, batches de papers, correcciones de citas |
| UI / Render | ~58 | 18% | Cambios en app.js, styles.css, lógica de render de matriz, ficha, glosario, tooltips, topbar, D-click, D-visual |
| Arquitectura de datos | ~45 | 14% | Cambios en estructura de JSON (claims, bib, metadata), esquemas, IDs, tipos |
| Documentación | ~45 | 14% | Traspasos, prompts de búsqueda, CLAUDE.md, README, diagramas de arquitectura |
| Corrección de bugs | ~40 | 12% | Bugs detectados y corregidos: render, datos, build, referencias huérfanas, campos vacíos, especificidad CSS |
| Arquitectura de contenido | ~26 | 8% | Decisiones editoriales: dimensiones, tramos, certeza, política no_ref, bloques temáticos |
| SEO / Metadatos | ~15 | 5% | Open Graph, meta tags, og-image, título, descripción |
| Build / Infraestructura | ~15 | 5% | 00_build.sh, template.html, escáner, git workflow |

**Total de cambios solicitados: ~329**

### 5.4 Resumen estadístico por sesión

| Sesión | Traspaso | N° de cambios | Modelo | Foco principal |
|---|---|---|---|---|
| 1 | v01–v03 | ~45 | Opus | Arquitectura inicial, matriz base |
| 2 | v04 | ~20 | Opus | Glosario, bibliografía |
| 3 | v05 | ~18 | Opus | Decisiones fundacionales (Decisión 1–3) |
| 4 | v06 | ~22 | Opus | Dependencias JS, build |
| 5 | v07 | ~20 | Opus | Bugs críticos render |
| 6 | v08 | ~18 | Sonnet | Batches de evidencia |
| 7 | v09 | ~25 | Sonnet | SEO, Open Graph |
| 8 | v10 | ~20 | Sonnet | Batches bibliográficos, template.html |
| 9 | v11 | ~22 | Sonnet | Corrección umbral 86 min, arquitectura |
| 10 | v12 | ~25 | Sonnet | P4 unificación bibliografía, batches |
| 11 | v13 | ~30 | Sonnet | Expansión 10×5 → 15×5, 5 dimensiones |
| 12 | v14 | ~12 | Sonnet | D-hover + summaries dimensiones nuevas |
| 13 | v15 | ~10 | Opus 4.8 | Verificación D-hover, P7, topbar polish |
| 14 | v16 | ~37 | Opus 4.8 | D-click + D-visual |
| — | — | ~5 | — | Refinamientos menores distribuidos |

**Total de cambios solicitados: ~329**

### 5.5 Detalle cronológico — Sesión 16

**Sesión 16 (Opus 4.8) — 2026-06-01**

D-click (labels de dimensión abren ficha lateral) y D-visual (4 colores por bloque temático). Sesión con complicación operativa: varias entregas intermedias de `app.js` resultaron en versión híbrida por conflicto entre archivo del workspace y archivo del proyecto; requirió reconstrucción desde base limpia y múltiples rondas de verificación.

293. Definición del modelo de interacción D-click: clic en label → ficha lateral (no tooltip); hover con efecto de oscuramiento igual que celdas.
294. Decisión: ficha-dim muestra solo definición + links (no resumen de papers).
295. Eliminación de `showDimTooltip`, `positionDimTooltip`, `closeDimTooltip` y listeners `mouseover`/`mouseleave`.
296. Agregado `activeDim: null` en state con exclusión mutua respecto a `activeCell`.
297. Nueva función `renderFichaDim(dimId)`: eyebrow + chip + texto + links "Leer más".
298. Nueva función `openDimFicha(dimId)`: setea estado, limpia activeCell, re-renderiza.
299. Handler de clic en `.row-head[data-dim-id]` dentro de `onRootClick`.
300. Estilos `.dim-ficha-links`/`.dim-ficha-link` en CSS; eliminado bloque `.dim-tooltip`.
301. CSS `.row-head[data-dim-id]`: `cursor: pointer`; hover `accent-soft`; `.dim-active` con highlight + borde.
302. Commit `766752d`: D-click (3 archivos, +126/−164).
303. Definición de los 4 bloques temáticos con Tomás: Desarrollo cognitivo, Desarrollo socioemocional, Ciudadanía digital, Salud y bienestar.
304. Objeto `DIM_BLOCKS` en `app.js` con mapeo de 15 dims a 4 clases CSS.
305. Clase `bloque-*` aplicada a cada `row-head` en `renderMatriz`.
306. Primera versión CSS de bloques con especificidad 0,1,0 → bug: colores invisibles (anulados por `.grid-cell.row-head`).
307. Fix especificidad base: `.grid-cell.row-head.bloque-X` (0,3,0).
308. Segunda iteración: colores de reposo correctos pero activo regresado → fix hover/activo a 0,4,0.
309. Fix línea 274: ternario `activeDim ? renderFichaDim : renderFicha` para que la ficha-dim sobreviva re-renders completos.
310. Verificación por estilo computado: 4 reposos + activo correctos por RGB exacto.
311. Verificación funcional en preview: D-click, exclusión mutua, tab round-trip con dim activa.
312. Commit `ae70ae5`: D-visual + fix ficha-dim (3 archivos, +79/−15).
313. Push `766752d..ae70ae5` con assert gate (250 bib / 240 claims / 0 huérfanos).

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron los cambios 293–313 correspondientes a la sesión 16.
- Categoría "UI / Render" subió de ~50 a ~58 por D-click y D-visual.
- Categoría "Corrección de bugs" subió de ~35 a ~40 (bugs de especificidad CSS + fix render línea 274).
- Categoría "Arquitectura de contenido" subió de ~25 a ~26 (decisión de bloques temáticos).
- Total actualizado: ~329 cambios.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: Versión híbrida de app.js en entregas intermedias
- **Síntoma observable:** El archivo entregado tenía `showDimTooltip` + listeners hover restaurados junto con scaffolding D-click sin cablear (`activeDim` leído pero nunca asignado, `dim-active` código muerto).
- **Causa raíz:** Conflicto entre el archivo del workspace de Claude (versión v15 base) y el archivo del proyecto; al copiar manualmente se copió la versión equivocada en varias instancias.
- **Solución aplicada:** Reconstrucción de `app.js` desde la versión base v15 aplicando todos los cambios D-click explícitamente con str_replace verificados.
- **Patrón aprendido:** Al inicio de cada sesión que modifica `app.js`, verificar con `grep -c "openDimFicha\|showDimTooltip"` que el archivo del proyecto coincide con el estado esperado antes de editar.
- **Estado:** Resuelto.

#### Bug 2: Colores de bloque invisibles (especificidad CSS)
- **Síntoma observable:** Verificación por estilo computado reveló `rgb(240,242,245)` en los 4 bloques — idéntico a `--bg-soft`, no los colores de bloque.
- **Causa raíz:** `.bloque-X { background: ... }` tiene especificidad 0,1,0; pierde contra `.grid-cell.row-head { background: var(--bg-soft) }` que es 0,2,0.
- **Solución aplicada:** Prefijo `.grid-cell.row-head` en las 4 reglas base → 0,3,0.
- **Estado:** Resuelto.

#### Bug 3: Color activo anulado tras fix de especificidad
- **Síntoma observable:** Tras el fix del Bug 2, el color activo (`dim-active`) mostraba el tinte base en lugar del tinte oscuro — el borde azul aparecía pero no el color.
- **Causa raíz:** Las reglas hover/activo (`.bloque-X.dim-active`, 0,2,0) ahora perdían contra la base recién subida (`.grid-cell.row-head.bloque-X`, 0,3,0).
- **Solución aplicada:** Prefijo `.grid-cell.row-head` en las 4 reglas hover/activo → 0,4,0.
- **Estado:** Resuelto.

#### Bug 4: Ficha-dim no sobrevive re-render completo
- **Síntoma observable:** Con una dimensión activa, al navegar a otro tab y volver a Matriz, la ficha volvía a vacío mientras el highlight `dim-active` persistía.
- **Causa raíz:** `renderMatrizView` (línea 274) siempre renderizaba `renderFicha(state.activeCell)` sin considerar `state.activeDim`.
- **Solución aplicada:** Ternario `state.activeDim ? renderFichaDim(state.activeDim) : renderFicha(state.activeCell)`.
- **Criterio de verificación:** Tab round-trip con dim activa → ficha conserva definición ✓.
- **Estado:** Resuelto.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Al abrir una sesión que va a modificar `app.js`, verificar el estado real del archivo en el proyecto antes de editar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js`. Si el resultado no es el esperado, no editar hasta resolver la discrepancia.
  - **Principio:** C.8 / B.3 (nunca modificar código sin haberlo leído).

- **Regla:** Cuando se sube la especificidad de una regla CSS base, revisar inmediatamente si las reglas de estado (hover, activo) de esa misma clase también necesitan subir.
  - **Contexto:** Subir `.bloque-X` a `.grid-cell.row-head.bloque-X` sin subir `.bloque-X.dim-active` crea una regresión silenciosa en el estado activo.

- **Regla:** El color computado real de un elemento CSS no es verificable con screenshot (JPEG, compresión). Usar `window.getComputedStyle` en el preview para confirmar valores RGB exactos.

- **Regla:** `node --check` no detecta bugs de runtime como funciones no declaradas en state, ramas faltantes en render, o especificidad CSS. Siempre completar con verificación funcional en navegador.

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: D-click reemplaza D-hover completamente
- **Decisión:** El tooltip flotante se elimina; la ficha lateral es el único lugar donde se muestra la definición de dimensión.
- **Alternativas consideradas:** (a) Convivir tooltip + ficha. (b) Solo ficha (elegida).
- **Justificación:** El tooltip flotante no funciona en móvil. La ficha ya es el patrón establecido para contenido detallado.

#### Decisión 2: Ficha-dim muestra solo definición + links
- **Decisión:** No incluir resumen de papers ni certeza agregada de la dimensión.
- **Justificación:** La ficha-dim es punto de entrada para entender qué es la dimensión; el detalle de evidencia está en las celdas individuales.

#### Decisión 3: 4 bloques temáticos
- **Decisión:** Desarrollo cognitivo (3 dims), Desarrollo socioemocional (4 dims), Ciudadanía digital (3 dims), Salud y bienestar (5 dims).
- **Alternativas consideradas:** "Salud digital" (descartado — implica solo riesgos), "Bienestar" (descartado — muy genérico), "Bienestar personal" (descartado — Tomás pidió dos palabras con más sustancia).
- **Implicancia:** Los nombres de bloque no están expuestos en la UI en esta versión — solo se usan como claves internas para las clases CSS.

#### Decisión 4: activeDim y activeCell mutuamente excluyentes
- **Decisión:** Clic en dimensión limpia `activeCell`; clic en celda limpia `activeDim`.
- **Justificación:** Una sola ficha lateral; el modelo mental más simple para el usuario.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| Dimensiones | 15 | `metadata.json` | Sin cambio |
| Tramos etarios | 5 | `metadata.json` | Sin cambio |
| Total claims | 240 | `claims.json` | Sin cambio |
| Total referencias | 250 | `bibliografia.json` | Sin cambio |
| Claims `no_ref: true` | 19 | `claims.json` | Sin cambio |
| Celdas vacías intencionales | 3 | `claims.json` | cyberbullying × 0–5 |
| Bloques temáticos | 4 | `app.js` (DIM_BLOCKS) | Nuevo en v16 |
| Commit actual `main` local | `ae70ae5` | git | Pusheado |
| Commit actual `origin/main` | `ae70ae5` | git | Sincronizado |

---

## 10. Arquitectura de archivos relevante

La estructura de carpetas no cambió. Se modificaron 2 archivos en `10_fuentes/` y se regeneró `index.html`. El escáner debe correrse al inicio de la próxima sesión.

**Nota:** `30_documentacion/` (no `50_documentacion/`) es la carpeta de documentación de este proyecto — convención establecida en sesiones anteriores. No migrar sin protocolo completo.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: Escáner fix — excluir snapshots propios del conteo
- **Descripción:** Parchear `00_escanear_proyecto.R` para excluir `2*_estructura.{md,txt}` del árbol y del conteo.
- **Tipo:** Deuda técnica / Build.
- **Complejidad:** Baja (~10 min).
- **Criterio de éxito:** Dos corridas consecutivas producen el mismo total de archivos.

#### Pendiente 2: DOIs sin verificar
- **Descripción:** `HernandezMosqueira2025` y `Ma2025` con DOI pendiente de verificación.
- **Tipo:** Deuda técnica / Bibliografía.
- **Complejidad:** Baja.
- **Criterio de éxito:** DOIs confirmados o entradas marcadas con nota explícita.

#### Pendiente 3: no_ref-review — Revisión editorial de 19 claims `no_ref: true`
- **Descripción:** 19 claims interpretativos/mecanísticos sin referencia. Revisar y documentar justificación editorial en CLAUDE.md.
- **Tipo:** Deuda técnica / Gobernanza de contenido.
- **Complejidad:** Media (~1 sesión dedicada).
- **Criterio de éxito:** Cada claim tiene justificación documentada o se agrega referencia.

#### Pendiente 4: og-image — Rejilla decorativa 10×5 → 15×5
- **Tipo:** Mejora visual / SEO.
- **Complejidad:** Media (sin generador en repo).

#### Pendiente 5: Nombre de bloque en ficha-dim
- **Descripción:** La ficha-dim muestra el nombre de la dimensión pero no el bloque al que pertenece. Podría ser útil mostrar "Bloque: Desarrollo cognitivo" como contexto.
- **Tipo:** Mejora UX.
- **Complejidad:** Baja (requiere objeto inverso DIM_BLOCKS → nombre legible).
- **Criterio de éxito:** Ficha-dim muestra chip de bloque junto al chip de dimensión.

### 11.2 Evaluación de deuda técnica

- **Versión híbrida de app.js:** el patrón de conflicto entre workspace y proyecto se repitió varias veces en esta sesión. Mitigación: verificar estado del archivo con grep al inicio de cada sesión que toque `app.js`.
- **Especificidad CSS acumulada:** los selectores de bloque ahora tienen 0,3,0 y 0,4,0. Si se agregan más estados visuales, habrá que seguir escalando. Evaluar si conviene mover a CSS custom properties por bloque para desacoplar.

### 11.3 Auditoría de cierre

- ¿Cada bloque de transformación tiene un check de validación? (C.8) → **Sí** — assert pre-push limpio, verificación por estilo computado.
- ¿Los outputs son reproducibles e idempotentes? (C.2, C.3) → **Sí** — `./00_build.sh` reproduce `index.html` desde fuentes.
- ¿Hay decisiones metodológicas documentadas? (C.11) → **Sí** — sección 8 de este traspaso.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Escáner fix** — trivial, 10 min, cierra ruido de conteo.
2. **DOIs** — baja complejidad, cierra deuda de v12.
3. **Nombre de bloque en ficha-dim** (Pendiente 5) — baja complejidad, mejora coherencia UX con D-visual recién implementado.
4. **no_ref-review** — sesión dedicada de gobernanza de contenido.

**Diferir:** og-image (pase de diseño separado).

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **ANTES** de editar `app.js`, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar `2` y `0`. Si no, el archivo no es la versión correcta.
- ⚠️ **NO** editar `metadata.json` con `json.dump`. Siempre Edit quirúrgico (str_replace).
- ⚠️ **NO** usar campo `flags` en claims hasta que `app.js` lo soporte.
- ⚠️ **NO** agregar entradas bib con `group` nuevo sin verificar que exista en `metadata.biblioGroups`.
- ⚠️ **NO** usar `HernandezMosqueira2025` sin DOI verificado.
- ⚠️ **NO** citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
- ⚠️ **NO** usar umbral de "86 min" en claims COT20s.
- ⚠️ **NO** editar `index.html` directamente. Shell HTML va en `template.html`.
- ⚠️ **ANTES** de integrar batch nuevo, verificar que cada celda tenga `summary`/`intro`/`certainty`. El assert no detecta campos editoriales vacíos.
- ⚠️ **ANTES** de push, confirmar assert: 0 huérfanos, 0 duplicados.
- 🔒 19 claims `no_ref: true` — no reducir sin revisión editorial explícita.
- 🔒 3 celdas cyberbullying × 0–5 son vacías intencionales.
- 🔒 `DIM_DESCRIPTIONS` en `app.js` — definiciones embebidas; `definiciones_dimensiones.md` es el documento-fuente.
- 🔒 El topbar tiene 3 hijos flex: `.topbar-left`, `nav.tabs`, `.topbar-right`. No meter `nav.tabs` dentro de `.topbar-left`.
- 🔒 `activeDim` y `activeCell` son mutuamente excluyentes — no romper esa invariante.

---

## 13. Fragmentos de código de referencia

**Assert completo de integridad (vigente):**
```python
import json, re, sys
bib = json.load(open("10_fuentes/data/bibliografia.json"))
claims = json.load(open("10_fuentes/data/claims.json"))
glosario_src = open("10_fuentes/glosario-data.js").read()
bib_ids = {b["id"] for b in bib}
errors = []
if len([b["id"] for b in bib]) != len(bib_ids):
    errors.append("IDs duplicados en bib.json")
for cell_id, cell in claims.items():
    for i, c in enumerate(cell.get("claims", [])):
        for r in c.get("refs", []):
            if r not in bib_ids:
                errors.append(f"Huérfano: {r} en {cell_id}[{i}]")
refs_raw = re.findall(r'refs:\s*\[([^\]]*)\]', glosario_src, re.DOTALL)
for r in {r for m in refs_raw for r in re.findall(r'"([^"]+)"', m)}:
    if r not in bib_ids:
        errors.append(f"Huérfano glosario: {r}")
if errors:
    for e in errors: print(f"  ✗ {e}"); sys.exit(1)
print(f"✓ Assert OK — {len(bib)} bib, {sum(len(c.get('claims',[])) for c in claims.values())} claims")
```

**Verificación de campos editoriales en celdas:**
```python
import json
claims = json.load(open("10_fuentes/data/claims.json"))
vacias = [k for k, cell in claims.items()
          if cell.get("claims") and not (cell.get("summary") and cell.get("intro") and cell.get("certainty"))]
if vacias:
    print(f"⚠ Celdas sin campos editoriales: {len(vacias)}")
    for k in vacias: print(f"  {k}")
else:
    print("✓ Todas las celdas con claims tienen summary, intro y certainty")
```

**Verificar estado de app.js al abrir sesión:**
```bash
grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js
# Esperado: 2 (openDimFicha) y 0 (showDimTooltip)
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 17 (Sonnet)`
(Reemplazar "Sonnet" por el modelo que vayas a usar.)

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos de la sesión anterior.
>
> ⚠️ ANTES de editar app.js, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar 2 y 0.
> ⚠️ NO editar `metadata.json` con `json.dump` — siempre Edit quirúrgico.
> ⚠️ NO usar campo `flags` en claims — las advertencias van en el texto.
> ⚠️ NO agregar entradas bib con `group` nuevo sin verificar que exista en `metadata.biblioGroups`.
> ⚠️ NO usar `HernandezMosqueira2025` sin DOI verificado.
> ⚠️ NO citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
> ⚠️ NO usar umbral de "86 min" en claims COT20s.
> ⚠️ NO editar `index.html` directamente. Shell HTML va en `template.html`.
> ⚠️ ANTES de integrar batch nuevo, verificar summary/intro/certainty en cada celda nueva.
> ⚠️ El topbar tiene 3 hijos flex: .topbar-left, nav.tabs, .topbar-right — no meter nav.tabs dentro de .topbar-left.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos a adjuntar

**Documentos de protocolo (knowledge base del Project — no adjuntar):**
- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`

**Documento de traspaso (adjuntar al nuevo chat):**
- `traspaso-cierre-v16.md` (este documento)

**Output del escáner (adjuntar al nuevo chat):**
- `30_documentacion/estructura/estructura_actual.md`

**Archivos del proyecto críticos para retomar:**
- `10_fuentes/app.js` — si la sesión incluye ajustes a D-click, D-visual o cualquier feature de UI
- `10_fuentes/styles.css` — si la sesión incluye ajustes visuales

**Documentos opcionales según foco:**
- Si la sesión incluye no_ref-review: adjuntar `10_fuentes/data/claims.json`.
- Si la sesión incluye Pendiente 5 (bloque en ficha-dim): adjuntar `10_fuentes/app.js`.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
