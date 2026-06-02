# Traspaso de Cierre — Crianza y Pantallas
- **Versión de traspaso:** v18
- **Fecha:** 2026-06-01
- **Sesión:** 18 — Cierre de deuda bibliográfica (Christakis2013, Baumgartner2014, Essex2025) y og-image actualizada a 15×5 con bandas D-visual.
- **Modelo utilizado:** Opus 4.8
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)
- **Archivos principales modificados:**
  - `10_fuentes/data/bibliografia.json`
  - `10_fuentes/data/claims.json`
  - `30_documentacion/activa/CLAUDE.md`
  - `assets/og-image.png`
  - `assets/og-image.html`
  - `00_generar_og_image.py`
  - `index.html`

---

## 2. Resumen ejecutivo

La sesión 18 completó los pendientes bibliográficos y visuales que quedaban abiertos desde v17. Se cerró `salud-mental-preescolar[1]`: Christakis2013 (*Pediatrics*, RCT con 565 preescolares 3–5 años, sustitución de contenido violento → mejora conductual) como ref de calce exacto, insertado en `bibliografia.json`, llevando `no_ref` de 15 a 14. Se cerró `cognicion-preadolescencia[0]`: Baumgartner2014 (*Journal of Early Adolescence*, 523 adolescentes 11–15 años, media multitasking → función ejecutiva incluyendo working memory) reemplazó a Ra2018 (calce flojo — síntomas TDAH); Ra2018 permanece en `cognicion-preadolescencia[1]`. Se completó `typeLabels` en app.js de 6 a 11 tipos (5 tipos se mostraban en crudo). Se corrigió el `journal` de `Essex2025`: "ECA, toddlers, UK. N verificar" → "Experimento intra-sujetos, N=36 (~18 meses), UK." (PMC11911715). Se actualizó la og-image de 10×5 a 15×5 con certeza real y bandas D-visual; se generó un script Python reutilizable (`00_generar_og_image.py`). Todo queda commiteado en 4 commits; push de los 2 últimos pendiente. Al cierre: 255 bib, 240 claims, 14 no_ref, 0 huérfanos.


---

## 3. Estado del proyecto al cierre

**Qué funciona:**
- Sitio local actualizado (commit `ee3e575`, sin pushear): build OK, `index.html` 8486 líneas, assert 0 huérfanos / 0 duplicados / 240 claims / 255 refs / 14 no_ref. GitHub Pages sirve `1063d4d` (push pendiente).
- Matriz 15×5 con 4 bandas D-visual contiguas; D-click operativo (D-hover removido).
- og-image actualizada: rejilla 15×5 real con certeza por celda y bandas de bloque; generador reutilizable en raíz.
- no_ref en 14 (todos documentados en CLAUDE.md).
- Escáner estable: 83 archivos (incluye 3 nuevos de esta sesión).

**Qué no funciona / deuda conocida:**
- `Essex2025`: `type: longitudinal` es incorrecto para un experimento intra-sujetos. Deuda documentada — agregar tipo `experimental` requiere 2 archivos (`metadata.biblioTypes` + `typeLabels` hardcodeado en `app.js`).
- `Essex2025` → bug preexistente en `typeLabels` de app.js: 5 tipos válidos (`transversal`, `cohort`, `theory`, `survey`, `report`) no tienen entrada en el objeto hardcodeado → se muestran en crudo en la vista de bib.
- Spot-check general de bib: los casos Hernández/Essex sugieren que puede haber más entradas con diseño mal caracterizado. No iniciado.

**Qué cambió respecto a v17:**
- `bibliografia.json`: Christakis2013 agregado (253→254); Essex2025 journal corregido.
- `claims.json`: `salud-mental-preescolar[1]` → `refs: ["Christakis2013"]`, `no_ref` removido.
- `CLAUDE.md`: lista no_ref actualizada (15→14; removida línea salud-mental-preescolar[1]).
- `assets/og-image.png`: actualizada a 15×5 con bandas D-visual y certeza real.
- `assets/og-image.html`: fuente HTML del generador.
- `00_generar_og_image.py`: script Python generador (lee metadata+claims → HTML → Chrome headless → PNG).

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Verificar y descartar candidatos para cognicion-preadolescencia[0]; identificar Baumgartner2014
- **Archivo(s) afectado(s):** ninguno (investigación)
- **Categoría temática:** Integración de evidencia
- **Qué se hizo:** Búsqueda web de papers sobre media multitasking → working memory/función ejecutiva en adolescentes. Baumgartner et al. 2014 (*J Early Adolescence* 34(8):1120–1144, DOI `10.1177/0272431614523133`) identificado y verificado: 523 adolescentes 11–15 años, mide working memory, shifting e inhibición con self-reports y tareas estandarizadas (Digit Span, Eriksen Flankers, Dots-Triangles). Calce directo con el claim. Van der Schuur 2020 también considerado (calce más débil — mide rendimiento académico, no función ejecutiva directamente).
- **Por qué se hizo:** Ra2018 (JAMA, mide uso de medios → síntomas TDAH) era soporte general para un claim sobre multitarea → memoria de trabajo. Baumgartner2014 mide exactamente ese mecanismo.
- **Cómo se verificó:** DOI confirmado en VU Amsterdam, Semantic Scholar y SAGE Journals. Autores verificados: Baumgartner SE, Weeda WD, van der Heijden LL, Huizinga M.
- **Estado:** Resuelto (`ee3e575`). Baumgartner2014 insertado en bib; `cognicion-preadolescencia[0]` actualizado (Ra2018 removido).

#### Cambio 2: Christakis2013 — insertar en bib y respaldar salud-mental-preescolar[1]
- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`, `10_fuentes/data/claims.json`, `30_documentacion/activa/CLAUDE.md`, `index.html`
- **Categoría temática:** Integración de evidencia / Corrección de bugs
- **Qué se hizo:**
  - Verificado en PMC3581844 y PubMed 23420911: Christakis DA, Garrison MM, Herrenkohl T, Haggerty K, Rivara FP, Zhou C, Liekweg K. *Pediatrics* 131(3):431–438, 2013. DOI `10.1542/peds.2012-1493`. N=565 padres de preescolares 3–5 años. RCT: sustitución de contenido violento/inadecuado por prosocial/educativo → mejora en competencia social y conducta externalizante a 6 y 12 meses.
  - Insertado en `bibliografia.json` (str_replace, sin json.dump): `group: "recent"`, `type: "longitudinal"` (convención para ECA, igual que Pickard2024).
  - `salud-mental-preescolar[1]`: `refs: ["Christakis2013"]`, `no_ref` removido.
  - CLAUDE.md: lista no_ref actualizada (15→14).
  - Rebuild: `index.html` 8477 líneas.
- **Cómo se verificó:** Assert OK — 254 bib, 240 claims, 0 huérfanos, 14 no_ref. 0 celdas sin campos editoriales.
- **Commit:** `80d862c` — "no_ref-review: Christakis2013 respalda salud-mental-preescolar[1] (14 no_ref restantes)"

#### Cambio 3: Essex2025 — corregir journal (N verificado, diseño correcto)
- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`, `index.html`
- **Categoría temática:** Corrección de bugs / Integración de evidencia
- **Qué se hizo:** Verificado PMC11911715 (texto completo libre). N=36 toddlers (~18 meses, 18 niñas), UK. Diseño: experimento intra-sujetos (within-subjects, 2 condiciones, 2 visitas) — no ECA ni longitudinal. Journal corregido: "ECA, toddlers, UK. N verificar en texto completo" → "Experimento intra-sujetos, N=36 (~18 meses), UK." (str_replace, sin json.dump). `type` queda en `longitudinal` (ver deuda en sección 3).
- **Cómo se verificó:** Assert OK (254 bib). JSON válido post-edición.
- **Commit:** `4e572ca` — "bib: corregir journal de Essex2025 (N=36 verificado, diseño intra-sujetos)"

#### Cambio 4: og-image actualizada a 15×5 con bandas D-visual y certeza real
- **Archivo(s) afectado(s):** `assets/og-image.png`, `assets/og-image.html`, `00_generar_og_image.py`
- **Categoría temática:** SEO / Metadatos / Build / Infraestructura
- **Qué se hizo:** Script Python `00_generar_og_image.py` que lee `metadata.json` y `claims.json`, genera `assets/og-image.html` (HTML autocontenido con data embebida) y renderiza con Chrome headless a `assets/og-image.png` (1200×630). Panel derecho: mini-matriz real 15×5 con las 4 bandas de bloque (cognitivo azul, socioemocional verde, digital lila, bienestar naranja) y certeza real por celda (incluyendo las 3 vacías intencionales de cyberbullying × 0–5). Panel izquierdo: réplica del diseño anterior (marca, título, bajada, leyenda certeza, URL), con centrado vertical ajustado. Paleta exacta de D-visual (`#eef4fb`, `#f0f7f0`, `#f5f0fb`, `#fdf4ee`).
- **Por qué se hizo:** La og-image mostraba rejilla 10×5 decorativa desde antes de la expansión (sesión 13). Previews en redes sociales y mensajería reflejaban un sitio desactualizado.
- **Cómo se verificó:** PNG 1200×630 confirmado. Validación visual aprobada por usuario. Chrome headless renderizó sin errores.
- **Commit:** `1063d4d` — "og-image: actualizar a 15×5 con bandas D-visual y certeza real; agregar generador"

#### Cambio 5: Baumgartner2014 — insertar en bib y actualizar cognicion-preadolescencia[0]
- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`, `10_fuentes/data/claims.json`, `index.html`
- **Categoría temática:** Integración de evidencia
- **Qué se hizo:** Baumgartner2014 insertado en `bibliografia.json` después de Bakht2025 (`type: transversal`, `group: recent`, DOI `10.1177/0272431614523133`). `cognicion-preadolescencia[0]` actualizado: `refs: ["Ra2018"]` → `refs: ["Baumgartner2014"]`. Ra2018 permanece en `cognicion-preadolescencia[1]`.
- **Cómo se verificó:** Assert OK — 255 bib, 240 claims, 0 huérfanos, 14 no_ref. Build OK (8486 líneas).
- **Commit:** `ee3e575` — "P1+P2: Baumgartner2014 respalda cognicion-preadolescencia[0] (multitarea→función ejecutiva); typeLabels completo (11 tipos)"

#### Cambio 6: typeLabels — completar 5 tipos faltantes en app.js
- **Archivo(s) afectado(s):** `10_fuentes/app.js`, `index.html`
- **Categoría temática:** Corrección de bugs / UI / Render
- **Qué se hizo:** Objeto `typeLabels` en app.js (L771) ampliado de 6 a 11 tipos. Agregados: `transversal: "Transversal"`, `cohort: "Cohorte"`, `theory: "Marco teórico"`, `survey: "Encuesta"`, `report: "Reporte"`. Los 5 tipos que se mostraban en crudo en la vista de bib ahora tienen etiqueta en español.
- **Cómo se verificó:** `node --check app.js` ✓. Build OK. Assert ✓.
- **Commit:** `ee3e575` (junto con Cambio 5)

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

Crianza y Pantallas es un sitio web estático que sintetiza evidencia científica revisada por pares sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz de dimensiones del desarrollo × tramos etarios. El sitio está dirigido a padres y cuidadores en Chile. La tecnología es HTML/CSS/JS vanilla con datos en JSON. El proyecto se inició en 2025 y se desarrolla en sesiones de trabajo con Claude, cada una documentada con un traspaso versionado.

### 5.2 Nota metodológica

Cada ítem del backlog representa una solicitud o decisión conceptualmente distinguible del usuario. Los errores introducidos por el asistente y corregidos inmediatamente en el mismo turno no se contabilizan; sí se cuentan los bugs reportados por el usuario o detectados en validación. La clasificación temática es por intención primaria. Las fuentes son los documentos de traspaso y el historial de conversaciones.

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Integración de evidencia | ~91 | 26% | Agregar claims, referencias bibliográficas, batches de papers, correcciones de citas, no_ref-review, Christakis2013 |
| UI / Render | ~60 | 17% | Cambios en app.js, styles.css, lógica de render de matriz, ficha, glosario, tooltips, D-click, D-visual, reorden dimensiones |
| Arquitectura de datos | ~46 | 13% | Cambios en estructura de JSON (claims, bib, metadata), esquemas, IDs, tipos |
| Documentación | ~48 | 14% | Traspasos, prompts de búsqueda, CLAUDE.md, README, diagramas, política no_ref |
| Corrección de bugs | ~44 | 13% | Bugs detectados y corregidos: render, datos, build, referencias huérfanas, autoría errónea, escáner, Essex journal |
| Arquitectura de contenido | ~27 | 8% | Decisiones editoriales: dimensiones, tramos, certeza, política no_ref, bloques temáticos, orden |
| SEO / Metadatos | ~17 | 5% | Open Graph, meta tags, og-image 10×5→15×5, generador, título, descripción |
| Build / Infraestructura | ~17 | 5% | 00_build.sh, template.html, escáner, git workflow, 00_generar_og_image.py |

**Total de cambios solicitados: ~353**

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
| 15 | v17 | ~13 | Opus 4.8 | Escáner, DOIs, no_ref-review, reorden dims |
| 16 | v18 | ~8 | Opus 4.8 | Christakis2013, Essex fix, og-image 15×5 |
| — | — | ~5 | — | Refinamientos menores distribuidos |

**Total de cambios solicitados: ~353**

### 5.5 Detalle cronológico — Sesión 18

**Sesión 18 (Opus 4.8) — 2026-06-01**

Cierre de deuda bibliográfica (Christakis2013, Baumgartner2014, Essex2025 journal), typeLabels fix y actualización de og-image a 15×5 con bandas D-visual.

341. Búsqueda y verificación de Baumgartner2014 para `cognicion-preadolescencia[0]`: DOI `10.1177/0272431614523133`, N=523 adolescentes 11–15, media multitasking → función ejecutiva. Pendiente de inserción.
342. Verificación de Christakis2013 (PMC3581844): RCT, N=565 preescolares 3–5 años, sustitución contenido violento → mejora conductual. Calce exacto con `salud-mental-preescolar[1]`.
343. Pre-flight de esquema bib: `group: "recent"`, `type: "longitudinal"` (convención ECA).
344. Inserción de Christakis2013 en `bibliografia.json` (str_replace, bib 253→254).
345. `salud-mental-preescolar[1]`: `refs: ["Christakis2013"]`, `no_ref` removido (14 no_ref restantes).
346. CLAUDE.md: lista no_ref actualizada (removida línea salud-mental-preescolar[1]).
347. Assert OK — 254 bib, 240 claims, 0 huérfanos, 14 no_ref.
348. Rebuild: index.html 8477 líneas.
349. Commit `80d862c`: Christakis2013 + no_ref update.
350. Push `80d862c` a origin/main.
351. Verificación de Essex2025 en PMC11911715: N=36 (~18 meses), experimento intra-sujetos (no ECA). Decisión: `type` queda `longitudinal` (opción a — sin churn); `journal` se corrige.
352. Fix `journal` de Essex2025: "ECA, toddlers, UK. N verificar en texto completo" → "Experimento intra-sujetos, N=36 (~18 meses), UK."
353. Assert OK (254 bib). Rebuild.
354. Commit `4e572ca`: Essex journal fix.
355. Push `4e572ca` a origin/main.
356. Diseño og-image (A): mini-matriz real 15×5 con certeza real + bandas D-visual + paleta exacta del sitio.
357. Script `00_generar_og_image.py`: lee metadata+claims → HTML autocontenido → Chrome headless → PNG 1200×630.
358. Render PNG temporal + validación visual (panel izquierdo recentrado verticalmente).
359. Ajuste de alineación vertical panel izquierdo; re-render aprobado.
360. `cp /tmp/og-image-new.png assets/og-image.png`.
361. Commit `1063d4d`: og-image 15×5 + generador (`assets/og-image.png`, `assets/og-image.html`, `00_generar_og_image.py`).
362. Push `1063d4d` a origin/main.
363. Escáner de cierre: 83 archivos (estable).
364. Inserción de Baumgartner2014 en `bibliografia.json` (str_replace; bib 254→255). `type: transversal`, `group: recent`.
365. `cognicion-preadolescencia[0]`: `refs: ["Ra2018"]` → `refs: ["Baumgartner2014"]`. Ra2018 removida del claim (calce flojo TDAH); sigue en `cognicion-preadolescencia[1]`.
366. Assert OK — 255 bib, 240 claims, 0 huérfanos, 14 no_ref.
367. `typeLabels` en app.js L771: completado de 6 a 11 tipos (agregados `transversal`, `cohort`, `theory`, `survey`, `report`). `node --check` ✓.
368. Build: index.html 8486 líneas.
369. Assert OK — sin cambios en conteos de claims o no_ref.
370. Commit `ee3e575`: Baumgartner2014 + typeLabels fix (4 archivos, +36/−8).

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron los cambios 341–363 correspondientes a la sesión 18.
- Categoría "Integración de evidencia" subió de ~88 a ~91 (Christakis2013).
- Categoría "Corrección de bugs" subió de ~43 a ~44 (Essex journal).
- Categoría "SEO / Metadatos" subió de ~15 a ~17 (og-image 15×5 + generador).
- Categoría "Build / Infraestructura" subió de ~16 a ~17 (00_generar_og_image.py).
- Categoría "Documentación" subió de ~47 a ~48 (CLAUDE.md no_ref actualizado).
- Se agregaron los cambios 364–370 correspondientes a P1+P2 (Baumgartner2014, typeLabels fix).
- Categoría "Integración de evidencia" subió a ~92 (Baumgartner2014).
- Categoría "Corrección de bugs / UI" subió a ~46 (typeLabels fix).
- Total actualizado: ~353 cambios.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: Essex2025 — diseño mal caracterizado en journal y N no verificado
- **Síntoma observable:** Campo `journal` decía "ECA, toddlers, UK. N verificar en texto completo". El diseño era incorrecto (es experimento intra-sujetos, no ECA) y el N era una nota pendiente.
- **Causa raíz:** La entrada se creó sin verificar el texto completo. PMC no fue consultado en la sesión de integración.
- **Solución aplicada:** PMC11911715 verificado. N=36, diseño intra-sujetos confirmados. `journal` corregido vía str_replace.
- **Patrón aprendido:** El campo `journal` de entradas bibliográficas debe incluir el diseño real verificado en texto completo, no el diseño supuesto. Notas "pendiente" en campos de datos son deuda activa.
- **Estado:** Resuelto (journal). Deuda residual: `type: longitudinal` incorrecto (documentado).

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Verificar `type` contra el diseño real del paper (no el supuesto) antes de insertar. Para estudios experimentales, `longitudinal` es el calce convencional disponible; documentar la discrepancia en el `journal`.
  - **Principio:** C.8 (Validación de integridad).

- **Regla:** El objeto `typeLabels` en `app.js` (línea ~771) es independiente de `metadata.biblioTypes`. Ahora cubre los 11 tipos válidos. Si se agrega un tipo nuevo (por ejemplo `experimental` para Essex2025), actualizar ambos artefactos.
  - **Principio:** C.11 (Transparencia del cambio) — dos fuentes de verdad para el mismo dato requieren actualización coordinada.

- **Regla:** El generador `00_generar_og_image.py` lee `metadata.json` y `claims.json` en runtime y produce `assets/og-image.html` (autocontenido) y `assets/og-image.png`. Si cambia la matriz (certeza, dimensiones, bloques), correr el generador antes del próximo commit de og-image.
  - **Principio:** C.2 (Reproducibilidad).

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: og-image con datos reales vs. decorativa
- **Decisión:** Mini-matriz real (certeza + bandas D-visual), no decorativa abstracta.
- **Alternativas consideradas:** (A) Real-data — elegida. (B) Decorativa 15×5 simple.
- **Justificación:** Representa el trabajo real del sitio (D-visual, certeza por celda). La imagen es un preview del producto real, no un logotipo abstracto.
- **Implicancia:** Debe regenerarse si cambian las certezas o los bloques temáticos. El generador lo hace reproducible.

#### Decisión 2: Essex2025 type queda en longitudinal
- **Decisión:** No agregar tipo `experimental` a biblioTypes + app.js por una sola entrada.
- **Alternativas consideradas:** (a) Dejar `longitudinal` — elegida. (b) Agregar tipo `experimental` (2 archivos).
- **Justificación:** Costo desproporcionado (2 archivos, incluido app.js frágil) para 1 entrada. El `journal` corregido documenta el diseño real de forma legible.
- **Implicancia:** Bug preexistente de `typeLabels` queda como deuda; si se agregan más entradas experimentales, vale la pena unificar en ese momento.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| Dimensiones | 15 | `metadata.json` | Sin cambio |
| Tramos etarios | 5 | `metadata.json` | Sin cambio |
| Total claims | 240 | `claims.json` | Sin cambio |
| Total referencias | 255 | `bibliografia.json` | +2 vs. v17 (Christakis2013, Baumgartner2014) |
| Claims `no_ref: true` | 14 | `claims.json` | −1 vs. v17 (15→14) |
| Celdas vacías intencionales | 3 | `claims.json` | cyberbullying × 0–5 |
| Bloques temáticos | 4 | `app.js` (DIM_BLOCKS) | Sin cambio |
| Archivos reales (escáner) | 83 | `00_escanear_proyecto.R` | +3 vs. v17 (og-image.html, og-image.py, traspaso v17) |
| Commit actual `main` local | `ee3e575` | git | Sin pushear |
| Commit actual `origin/main` | `1063d4d` | git | 1 commit adelante |

---

## 10. Arquitectura de archivos relevante

La estructura de carpetas no cambió. Se agregaron 2 archivos en `assets/` (`og-image.html`, y `og-image.png` reemplazado) y 1 en raíz (`00_generar_og_image.py`). El escáner de cierre refleja 83 archivos.

**Nota permanente:** `30_documentacion/` (no `50_documentacion/`) es la carpeta de documentación de este proyecto. No migrar sin protocolo completo.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: spot-check general de bib
- **Descripción:** Los casos Hernández (autoría errónea) y Essex (diseño mal caracterizado) sugieren que puede haber más entradas con campos incorrectos. Revisar entradas del grupo `recent` y `digital` prioritariamente.
- **Tipo:** Deuda técnica / Gobernanza de contenido.
- **Complejidad:** Media (~1 sesión).
- **Criterio de éxito:** Lista de entradas revisadas documentada en CLAUDE.md o en un archivo de auditoría.


### 11.2 Evaluación de deuda técnica

- **Dos fuentes de verdad para biblioTypes:** `metadata.biblioTypes` (fuente de datos) y `typeLabels` en app.js. Ahora alineados (11/11 tipos). Si se agrega `experimental` para Essex2025, actualizar ambos.
- **`Essex2025` type incorrecto:** `longitudinal` para un experimento intra-sujetos. Aceptable mientras no haya tipo `experimental`; documentado.

### 11.3 Auditoría de cierre

- ¿Cada bloque de transformación tiene un check de validación? (C.8) → **Sí** — assert post-inserción en cada cambio.
- ¿Los outputs son reproducibles e idempotentes? (C.2, C.3) → **Sí** — `./00_build.sh` reproduce `index.html`; `00_generar_og_image.py` reproduce la og-image.
- ¿Hay decisiones metodológicas documentadas? (C.11) → **Sí** — secciones 7 y 8 de este traspaso.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Pendiente 1: spot-check bib** — sesión dedicada; revisar `recent` y grupos de dimensiones nuevas prioritariamente.

**Diferir:** Phase 6 (adolescencia), glosario mejoras, P-ESTRUCTURA.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **ANTES** de editar `app.js`, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar `2` y `0`.
- ⚠️ **NO** editar `metadata.json` con `json.dump`. Siempre str_replace quirúrgico sobre texto crudo.
- ⚠️ **NO** usar campo `flags` en claims hasta que `app.js` lo soporte.
- ⚠️ **NO** agregar entradas bib sin verificar que `type` esté en `metadata.biblioTypes` y `group` en `metadata.biblioGroups`. El campo `year` no existe en el esquema.
- ⚠️ **NO** citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
- ⚠️ **NO** usar umbral de "86 min" en claims COT20s.
- ⚠️ **NO** editar `index.html` directamente. Shell HTML va en `template.html`.
- ⚠️ **ANTES** de integrar batch nuevo, verificar que cada celda tenga `summary`/`intro`/`certainty`. El assert no detecta campos editoriales vacíos.
- ⚠️ **ANTES** de push, confirmar assert: 0 huérfanos, 0 duplicados.
- ⚠️ Al agregar nueva dimensión, verificar inmediatamente que su posición en `metadata.dimensions` coincide con su bloque en `DIM_BLOCKS`.
- ⚠️ Si se regenera og-image, correr `00_generar_og_image.py` desde raíz del proyecto (requiere Chrome headless disponible).
- 🔒 14 claims `no_ref: true` — política documentada en CLAUDE.md; no reducir sin revisión editorial.
- 🔒 3 celdas cyberbullying × 0–5 son vacías intencionales.
- 🔒 `DIM_DESCRIPTIONS` en `app.js` — definiciones embebidas; `definiciones_dimensiones.md` es el documento-fuente.
- 🔒 El topbar tiene 3 hijos flex: `.topbar-left`, `nav.tabs`, `.topbar-right`. No meter `nav.tabs` dentro de `.topbar-left`.
- 🔒 `activeDim` y `activeCell` son mutuamente excluyentes.
- 🔒 `typeLabels` en app.js (~L771) cubre los 11 tipos válidos. Si se agrega tipo nuevo (e.g. `experimental`), actualizar también `metadata.biblioTypes`.

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
no_ref_count = sum(1 for cell in claims.values() for c in cell.get("claims",[]) if c.get("no_ref"))
if errors:
    for e in errors: print(f"  ✗ {e}"); sys.exit(1)
print(f"✓ Assert OK — {len(bib)} bib, {sum(len(c.get('claims',[])) for c in claims.values())} claims, {no_ref_count} no_ref")
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

**Pre-flight de esquema antes de insertar entradas bib:**
```python
import json
meta = json.load(open("10_fuentes/data/metadata.json"))
valid_types = set(meta["biblioTypes"].keys())
valid_groups = {g["id"] for g in meta["biblioGroups"]}
candidatas = [
    {"id": "Ejemplo2025", "type": "meta", "group": "recent"}
]
for e in candidatas:
    if e.get("type") not in valid_types:
        print(f"⚠ type inválido en {e['id']}: {e.get('type')}")
    if e.get("group") not in valid_groups:
        print(f"⚠ group inválido en {e['id']}: {e.get('group')}")
    if "year" in e:
        print(f"⚠ campo 'year' no existe en el esquema: {e['id']}")
```

**Regenerar og-image (desde raíz del proyecto):**
```bash
python3 00_generar_og_image.py
# Produce: assets/og-image.html + assets/og-image.png (1200×630)
# Requiere Chrome headless disponible en el sistema
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 19 (Opus)`
(Reemplazar "Opus" por el modelo que vayas a usar.)

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos de la sesión anterior.
>
> ⚠️ ANTES de editar `app.js`, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar 2 y 0.
> ⚠️ NO editar `metadata.json` con `json.dump` — siempre str_replace quirúrgico sobre texto crudo.
> ⚠️ NO usar campo `flags` en claims — las advertencias van en el texto.
> ⚠️ NO agregar entradas bib sin verificar type en biblioTypes y group en biblioGroups. El campo `year` no existe en el esquema.
> ⚠️ NO citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
> ⚠️ NO usar umbral de "86 min" en claims COT20s.
> ⚠️ NO editar `index.html` directamente. Shell HTML va en `template.html`.
> ⚠️ ANTES de integrar batch nuevo, verificar summary/intro/certainty en cada celda nueva.
> ⚠️ Al agregar nueva dimensión, verificar que su posición en metadata.dimensions coincide con su bloque en DIM_BLOCKS.
> ⚠️ `typeLabels` en app.js (~L771) cubre 11/11 tipos. Si se agrega tipo nuevo (e.g. `experimental` para Essex2025), actualizar también `metadata.biblioTypes`.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos a adjuntar

**Documentos de protocolo (knowledge base del Project — no adjuntar):**
- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`

**Documento de traspaso (adjuntar al nuevo chat):**
- `traspaso-cierre-v18.md` (este documento)

**Output del escáner (adjuntar al nuevo chat):**
- `30_documentacion/estructura/estructura_actual.md`

**Archivos del proyecto críticos para retomar:**
- `10_fuentes/data/bibliografia.json` — para Pendiente 1 (spot-check bib)

**Documentos opcionales según foco:**
- Si la sesión incluye spot-check bib: adjuntar `10_fuentes/data/bibliografia.json`.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
