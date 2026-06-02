# Traspaso de Cierre — Crianza y Pantallas
- **Versión de traspaso:** v17
- **Fecha:** 2026-06-01
- **Sesión:** 17 — Escáner fix, corrección bibliográfica HernandezMartinez2025, no_ref-review (4 claims respaldados + política documentada), reorden de dimensiones para bandas D-visual contiguas.
- **Modelo utilizado:** Opus 4.8
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)
- **Archivos principales modificados:**
  - `00_escanear_proyecto.R`
  - `10_fuentes/data/bibliografia.json`
  - `10_fuentes/data/claims.json`
  - `10_fuentes/data/metadata.json`
  - `30_documentacion/activa/CLAUDE.md`
  - `30_documentacion/activa/prompts_busqueda/` (16 archivos)
  - `index.html`

---

## 2. Resumen ejecutivo

La sesión 17 abrió con el handoff v16 y abordó cuatro pendientes del backlog. Primero se parchó el escáner (`00_escanear_proyecto.R`) para excluir snapshots timestamped del conteo y el árbol, logrando conteo estable en 80 archivos reales. Segundo, se corrigió la entrada bibliográfica con autoría errónea: `HernandezMosqueira2025` → `HernandezMartinez2025` (primer autor real: Hernández-Martínez J.), con DOI verificado `10.3390/children12010029`, y se actualizó la referencia en el único claim afectado y en las 16 listas P7. Tercero, se completó el no_ref-review: se incorporaron 3 entradas bib nuevas (Ra2018, Goodyear2025, SmithBasak2023), se respaldaron 4 claims que habían quedado sin referencia, se corrigió "ensayo controlado" → "estudio observacional" en un claim, y se documentó la política editorial de `no_ref` en CLAUDE.md con justificación para los 15 claims que conservan ese flag. Cuarto, se detectó y corrigió el orden de dimensiones en `metadata.json`: `salud-mental` estaba en posición 7 (mezclada con el bloque socioemocional) y se movió a posición 10 (después de cyberbullying), logrando que los 4 bloques de D-visual formen bandas de color contiguas en la matriz. Todo quedó commiteado y pusheado en 7 commits; el único pendiente real es og-image.

---

## 3. Estado del proyecto al cierre

**Qué funciona:**
- Sitio en vivo (GitHub Pages): build OK, `index.html` 8467 líneas, assert 0 huérfanos / 0 duplicados / 240 claims / 253 refs.
- Matriz 15×5 con 4 bandas de color contiguas: cognitivo (azul), socioemocional (verde), digital (lila), bienestar (naranja). Salud mental ahora en bloque bienestar.
- D-click operativo: clic en label de dimensión abre ficha con definición + links.
- D-visual operativo: colores por bloque, hover y estado activo correctos.
- Escáner con conteo estable: dos corridas seguidas = 80 archivos (antes inflaba +2 por corrida).
- no_ref-review completo: 15 claims con `no_ref: true` documentados editorialmente en CLAUDE.md; 4 claims antes sin ref ahora tienen ref verificada.
- Build reproducible: `./00_build.sh` desde terminal.

**Qué no funciona / deuda conocida:**
- og-image decorativa muestra rejilla 10×5 (desactualizada desde sesión 13).
- `cognicion-preadolescencia[0]` (multitarea → memoria de trabajo): referenciado con Ra2018, que mide uso de medios → síntomas TDAH. Calce metodológico flojo — anotado para revisión futura.
- `salud-mental-preescolar[1]` (contenido violento/prosocial → resultados emocionales): sigue `no_ref: true` — no se encontró ref que calzara sin forzar la cita.
- `Essex2025`: nota "N verificar en texto completo" — verificación pendiente.
- En viewports muy estrechos la leyenda "Certeza" puede quedar desalineada (cosmético).

**Qué cambió respecto a v16:**
- `00_escanear_proyecto.R`: +`PATRON_ESCANER` en 4 lugares; conteo estable.
- `bibliografia.json`: `HernandezMosqueira2025` → `HernandezMartinez2025` (autores y DOI corregidos); 3 entradas nuevas (Ra2018, Goodyear2025, SmithBasak2023). Total: 250 → 253.
- `claims.json`: 4 claims pierden `no_ref`; 1 texto corregido ("ensayo controlado" → "estudio observacional"); ref inline errónea en fisica-preadolescencia removida.
- `metadata.json`: `salud-mental` movida de posición 7 a posición 10 (después de cyberbullying).
- `CLAUDE.md`: sección "Política no_ref" con 15 claims justificados.
- 16 prompts P7: `HernandezMosqueira2025` → `HernandezMartinez2025`.

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Escáner fix — excluir snapshots timestamped del conteo y árbol
- **Archivo(s) afectado(s):** `00_escanear_proyecto.R`
- **Categoría temática:** Build / Infraestructura
- **Qué se hizo:** Agregado `PATRON_ESCANER <- "[0-9]{8}_[0-9]{6}_estructura\\.(md|txt)$"` en 4 puntos: definición (L37), filtro en árbol (L52), filtro en extensiones (L81), filtro en conteo (L98).
- **Por qué se hizo:** El escáner contaba sus propios snapshots timestamped en cada corrida, inflando el total +2 por ejecución. Deuda desde v15.
- **Cómo se verificó:** Dos corridas seguidas → 80 archivos ambas (antes llegaba a 109 acumulando).
- **Dependencias afectadas:** `30_documentacion/estructura/estructura_actual.md/.txt` regenerados con árbol y conteo limpios.

#### Cambio 2: Renombrar HernandezMosqueira2025 → HernandezMartinez2025; corregir autores y DOI
- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`, `10_fuentes/data/claims.json`, 16 archivos en `30_documentacion/activa/prompts_busqueda/`
- **Categoría temática:** Corrección de bugs / Integración de evidencia
- **Qué se hizo:** ID renombrado (apellido del 1er autor estaba mal: Hernández-Mosqueira → Hernández-Martínez). Autores corregidos con lista completa verificada en PMC11763999. DOI `10.3390/children12010029` agregado al campo journal. Nota "pendiente — ver PMC12027561" eliminada. URL PMC11763999 conservada (era correcta). Ref en claims.json y en 16 listas P7 actualizadas. Autor inline en `fisica-preadolescencia[3]` removido (violaba convención de no citar autor en texto).
- **Cómo se verificó:** Assert OK (253 bib, 0 huérfanos). `grep -c "HernandezMosqueira" data/` → 0.
- **Causa raíz del error original:** Alucinación de autoría en la sesión de integración — el ID se construyó sobre un apellido inventado.

#### Cambio 3: no_ref-review — agregar 3 entradas bib y respaldar 4 claims
- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`, `10_fuentes/data/claims.json`
- **Categoría temática:** Integración de evidencia / Corrección de bugs
- **Qué se hizo:**
  - Agregadas 3 entradas con esquema correcto (group + type válidos, sin campo year):
    - `Ra2018`: longitudinal/recent — JAMA 320(3):255-263, DOI 10.1001/jama.2018.8931
    - `Goodyear2025`: transversal/school — Lancet Reg Health Eur 50:101198, DOI 10.1016/S2666-7762(25)00003-1
    - `SmithBasak2023`: meta/recent — PLoS ONE 18(8):e0285925, DOI 10.1371/journal.pone.0285925
  - 4 claims actualizados (no_ref removido, ref agregada):
    - `cognicion-ninez-media[2]` → Goodyear2025; texto "ensayo controlado" → "estudio observacional"
    - `cognicion-preadolescencia[0]` → Ra2018
    - `cognicion-preadolescencia[1]` → Ra2018
    - `cognicion-preadolescencia[2]` → SmithBasak2023
  - `salud-mental-preescolar[1]` mantiene no_ref (candidatos Anderson2007 y Christakis2004 no calzaban con el claim sin forzar la cita).
- **Cómo se verificó:** Assert OK — 253 bib, 240 claims, 0 huérfanos. Conteo no_ref: 19 → 15.
- **Nota de criterio:** `cognicion-preadolescencia[0]` (multitarea → memoria de trabajo) usa Ra2018 como soporte general; Ra2018 mide frecuencia de uso → síntomas TDAH, no multitarea específicamente. Anotado para revisión.

#### Cambio 4: Política no_ref documentada en CLAUDE.md
- **Archivo(s) afectado(s):** `30_documentacion/activa/CLAUDE.md`
- **Categoría temática:** Documentación / Gobernanza de contenido
- **Qué se hizo:** Sección "Política no_ref" agregada al final de CLAUDE.md con: (a) 4 tipos de claims que justifican no_ref (mecanísticos, ausencia de evidencia, remisión entre dimensiones, gap en la literatura); (b) lista de los 15 claims con no_ref vigente al 2026-06-01, con justificación por tipo.
- **Por qué se hizo:** Los 15 claims restantes con no_ref son editorialmente correctos, pero sin documentación explícita podían interpretarse como omisiones a corregir. La política formaliza la distinción.

#### Cambio 5: Reordenar salud-mental en metadata.json para bandas D-visual contiguas
- **Archivo(s) afectado(s):** `10_fuentes/data/metadata.json`, `index.html` (rebuild)
- **Categoría temática:** UI / Render / Arquitectura de contenido
- **Qué se hizo:** `salud-mental` movida de posición 7 a posición 10 en el array `dimensions` (después de `cyberbullying`), mediante str_replace quirúrgico sobre el texto crudo del archivo (sin json.dump). Rebuild del sitio.
- **Por qué se hizo:** `DIM_BLOCKS` asigna `salud-mental` a `bloque-bienestar` (naranja), pero su posición 7 la ubicaba visualmente dentro de la secuencia socioemocional/digital, partiendo el bloque digital en dos. Con el reorden los 4 bloques forman bandas contiguas: filas 0–2 cognitivo, 3–6 socioemocional, 7–9 digital, 10–14 bienestar.
- **Cómo se verificó:** Screenshot del preview confirmó las 4 bandas de color contiguas. Claims no afectados (van por id, no por posición).
- **Regla reforzada:** `metadata.json` se edita SIEMPRE con str_replace sobre texto crudo. Nunca `json.dump`. Ver Bug 2 del traspaso v13.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

Crianza y Pantallas es un sitio web estático que sintetiza evidencia científica revisada por pares sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz de dimensiones del desarrollo × tramos etarios. El sitio está dirigido a padres y cuidadores en Chile. La tecnología es HTML/CSS/JS vanilla con datos en JSON. El proyecto se inició en 2025 y se desarrolla en sesiones de trabajo con Claude, cada una documentada con un traspaso versionado.

### 5.2 Nota metodológica

Cada ítem del backlog representa una solicitud o decisión conceptualmente distinguible del usuario. Los errores introducidos por el asistente y corregidos inmediatamente en el mismo turno no se contabilizan; sí se cuentan los bugs reportados por el usuario o detectados en validación. La clasificación temática es por intención primaria. Las fuentes son los documentos de traspaso y el historial de conversaciones.

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Integración de evidencia | ~88 | 26% | Agregar claims, referencias bibliográficas, batches de papers, correcciones de citas, no_ref-review |
| UI / Render | ~60 | 18% | Cambios en app.js, styles.css, lógica de render de matriz, ficha, glosario, tooltips, D-click, D-visual, reorden dimensiones |
| Arquitectura de datos | ~46 | 14% | Cambios en estructura de JSON (claims, bib, metadata), esquemas, IDs, tipos |
| Documentación | ~47 | 14% | Traspasos, prompts de búsqueda, CLAUDE.md, README, diagramas, política no_ref |
| Corrección de bugs | ~43 | 13% | Bugs detectados y corregidos: render, datos, build, referencias huérfanas, autoría errónea, escáner |
| Arquitectura de contenido | ~27 | 8% | Decisiones editoriales: dimensiones, tramos, certeza, política no_ref, bloques temáticos, orden |
| SEO / Metadatos | ~15 | 4% | Open Graph, meta tags, og-image, título, descripción |
| Build / Infraestructura | ~16 | 5% | 00_build.sh, template.html, escáner, git workflow |

**Total de cambios solicitados: ~342**

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
| — | — | ~5 | — | Refinamientos menores distribuidos |

**Total de cambios solicitados: ~342**

### 5.5 Detalle cronológico — Sesión 17

**Sesión 17 (Opus 4.8) — 2026-06-01**

Escáner fix, corrección de autoría bibliográfica, no_ref-review y reorden de dimensiones para coherencia visual con D-visual.

314. Escáner fix: definición de `PATRON_ESCANER` y aplicación en 4 puntos de `00_escanear_proyecto.R`.
315. Verificación de conteo estable: dos corridas = 80 archivos (antes 109 acumulando snapshots).
316. Commit `9826d23`: escáner fix + estructura_actual regenerada.
317. Push `9826d23` a origin/main.
318. Diagnóstico de `HernandezMosqueira2025`: primer autor erróneo (Hernández-Mosqueira vs. Hernández-Martínez), DOI faltante, PMC incorrecto en nota — verificado con PMC11763999.
319. Decisión: renombrar ID a `HernandezMartinez2025` (opción A — integridad sobre pragmatismo).
320. Corrección en `bibliografia.json`: autores reales, DOI verificado, URL PMC correcta, nota eliminada.
321. Actualización de ref en `claims.json` (1 celda: fisica-preadolescencia[3]).
322. Remoción de autor inline en fisica-preadolescencia[3] (violaba convención).
323. Actualización de `HernandezMosqueira2025` → `HernandezMartinez2025` en 16 listas P7.
324. Commit `732e6ff`: rename bib + claims + 16 prompts.
325. Push `732e6ff` con assert gate.
326. Clasificación de los 19 claims no_ref en Tipo A (mecanísticos/gap), Tipo B (empíricos con ref implícita) y Tipo C (vagos).
327. Búsquedas web para 7 claims Tipo B: Goodyear2025 (SMART Schools), Ra2018 (JAMA ADHD), SmithBasak2023 (meta videojuegos visuoespacial).
328. Verificación de candidatos para salud-mental-preescolar[1]: Anderson2007 y Christakis2004 no calzan → mantiene no_ref.
329. Pre-flight de esquema bib: corrección de types inválidos (observational→transversal, meta-analysis→meta) y grupo faltante (group agregado a 3 entradas).
330. Agregado de Ra2018, Goodyear2025, SmithBasak2023 a bibliografia.json (250→253).
331. Actualización de 4 claims: no_ref removido, refs agregadas, texto corregido en cognicion-ninez-media[2].
332. Assert post-no_ref-review: 253 bib, 240 claims, 0 huérfanos, 15 no_ref restantes.
333. Política no_ref documentada en CLAUDE.md (4 tipos + 15 claims justificados al 2026-06-01).
334. Commit `a707cc8`: no_ref-review completo (4 archivos + rebuild).
335. Push `a707cc8` con assert gate.
336. Diagnóstico de orden de dimensiones: salud-mental en posición 7 partía visualmente el bloque digital de D-visual.
337. Reorden de salud-mental a posición 10 en metadata.json vía str_replace quirúrgico (sin json.dump).
338. Rebuild y screenshot: 4 bandas de color contiguas confirmadas.
339. Commit `63c4524`: reorden metadata + rebuild.
340. Push `63c4524` a origin/main.

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron los cambios 314–340 correspondientes a la sesión 17.
- Categoría "Corrección de bugs" subió de ~40 a ~43 (escáner, autoría, texto claim).
- Categoría "Integración de evidencia" subió de ~85 a ~88 (no_ref-review).
- Categoría "Documentación" subió de ~45 a ~47 (política no_ref en CLAUDE.md).
- Categoría "Build / Infraestructura" subió de ~15 a ~16 (escáner).
- Categoría "Arquitectura de contenido" subió de ~26 a ~27 (reorden dimensiones).
- Total actualizado: ~342 cambios.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: Escáner inflaba el conteo de archivos en cada corrida
- **Síntoma observable:** Dos corridas consecutivas del escáner producían totales distintos (113 → 115 → ...). El árbol listaba los snapshots `YYYYMMDD_HHMMSS_estructura.*` propios.
- **Causa raíz:** El escáner no excluía sus propios outputs timestamped de los tres recorridos (árbol, extensiones, conteo).
- **Solución aplicada:** `PATRON_ESCANER` aplicado en 4 puntos del script.
- **Criterio de verificación:** Dos corridas = 80 archivos idénticos.
- **Patrón aprendido:** Un escáner que no se excluye a sí mismo es autoinconsistente — verificar con dos corridas consecutivas.
- **Estado:** Resuelto.

#### Bug 2: Autoría errónea en HernandezMosqueira2025
- **Síntoma observable:** ID y autores del 1er y 2do autor incorrectos; DOI faltante; PMC en nota distinto al PMC en url.
- **Causa raíz:** Alucinación de autoría en la sesión de integración (sesión anterior al v12). El ID se construyó sobre un apellido inventado que nunca fue verificado.
- **Solución aplicada:** Verificación en PMC autoritativo + renombrado completo del ID + corrección de todos los campos + actualización en 18 archivos.
- **Patrón aprendido:** Los IDs bibliográficos deben verificarse contra la fuente autoritativa (PMC, DOI) antes de su primera integración. Un ID con apellido erróneo puede propagarse silenciosamente a decenas de archivos.
- **Estado:** Resuelto.

#### Bug 3: salud-mental en posición incorrecta para D-visual
- **Síntoma observable:** En la matriz, salud-mental aparecía con color naranja (bienestar) pero ubicada entre co-regulación y alfabetización digital, rompiendo visualmente la continuidad del bloque digital (lila).
- **Causa raíz:** `DIM_BLOCKS` asignaba salud-mental al bloque bienestar, pero su posición en `metadata.dimensions` correspondía al bloque socioemocional, donde quedó al integrarla en la expansión 15×5.
- **Solución aplicada:** Reordenamiento de salud-mental a posición 10 en metadata.json vía str_replace.
- **Estado:** Resuelto.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Al agregar entradas a `bibliografia.json`, verificar que `type` esté en `metadata.biblioTypes` y que `group` esté en `metadata.biblioGroups` antes de insertar. Tipos válidos: review, meta, longitudinal, transversal, cohort, guideline, law, chilean, theory, survey, report. El campo `year` no existe en el esquema.
  - **Principio:** C.8 (Validación de integridad).

- **Regla:** Al incorporar una nueva dimensión a la matriz, verificar inmediatamente que su posición en `metadata.dimensions` sea coherente con su `DIM_BLOCKS` en `app.js`. El orden visual de la matriz lo dicta `metadata.dimensions`; los colores de bloque los dicta `DIM_BLOCKS`. Si no están sincronizados, los colores quedan incongruentes.
  - **Principio:** C.11 (Transparencia del cambio).

- **Regla:** Verificar IDs bibliográficos contra fuente autoritativa (PMC, DOI) antes de la primera integración. Un apellido erróneo en el ID se propaga silenciosamente.
  - **Principio:** Anti-alucinación (regla de los prompts de búsqueda).

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: Renombrar ID bibliográfico con apellido erróneo (opción A)
- **Decisión:** Renombrar `HernandezMosqueira2025` → `HernandezMartinez2025` actualizando todos los archivos afectados.
- **Alternativas consideradas:** (a) Renombrado completo. (b) Conservar ID, corregir solo campos visibles.
- **Justificación:** El proyecto es estricto con la integridad de citas. Dejar un ID con apellido inventado contradice ese estándar y puede confundir a futuros colaboradores.
- **Implicancia:** 18 archivos actualizados; más churn que (B), pero corpus limpio.

#### Decisión 2: salud-mental-preescolar[1] mantiene no_ref
- **Decisión:** No agregar ref forzada. El claim sobre contenido violento/prosocial → resultados emocionales en preescolares no tiene un paper único que lo respalde directamente sin sobreextender la cita.
- **Alternativas consideradas:** Anderson2007, Christakis2004 — ambos descartados por no calzar con el claim.
- **Justificación:** Forzar una cita irrelevante sería peor que documentar la ausencia. El claim es editorialmente válido (Tipo A — consenso implícito sin paper único citable).

#### Decisión 3: cognicion-preadolescencia[0] respaldado con Ra2018 (calce flojo aceptado)
- **Decisión:** Ra2018 como ref de soporte general para el claim sobre multitarea y memoria de trabajo.
- **Justificación:** Ra2018 es longitudinal y mide uso de medios → atención, que es adyacente. Calce flojo pero defendible como soporte. Anotado para revisión si se encuentra un paper más específico sobre multitarea.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| Dimensiones | 15 | `metadata.json` | salud-mental reordenada a pos. 10 |
| Tramos etarios | 5 | `metadata.json` | Sin cambio |
| Total claims | 240 | `claims.json` | Sin cambio |
| Total referencias | 253 | `bibliografia.json` | +3 vs. v16 |
| Claims `no_ref: true` | 15 | `claims.json` | −4 vs. v16 (19→15) |
| Celdas vacías intencionales | 3 | `claims.json` | cyberbullying × 0–5 |
| Bloques temáticos | 4 | `app.js` (DIM_BLOCKS) | Sin cambio |
| Archivos reales (escáner) | 80 | `00_escanear_proyecto.R` | Estable post-fix |
| Commit actual `main` local | `63c4524` | git | Pusheado |
| Commit actual `origin/main` | `63c4524` | git | Sincronizado |

---

## 10. Arquitectura de archivos relevante

La estructura de carpetas no cambió. Se modificaron archivos en `10_fuentes/data/`, `30_documentacion/activa/` y la raíz (`00_escanear_proyecto.R`). El escáner debe correrse al inicio de la próxima sesión para obtener el snapshot actualizado.

**Nota permanente:** `30_documentacion/` (no `50_documentacion/`) es la carpeta de documentación de este proyecto — convención establecida en sesiones anteriores. No migrar sin protocolo completo.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: og-image — Rejilla decorativa 10×5 → 15×5
- **Descripción:** La og-image actual (`assets/og-image.png`) muestra una rejilla 10×5 decorativa. Desde la expansión a 15×5 está desactualizada. Opcionalmente incorporar los 4 colores de bloque de D-visual.
- **Tipo:** Mejora visual / SEO.
- **Impacto:** La imagen aparece en previews de redes sociales y mensajería. Bajo impacto funcional; cosmético/comunicacional.
- **Complejidad:** Media (sin generador en repo; requiere diseño HTML → screenshot o herramienta externa).
- **Criterio de éxito:** `assets/og-image.png` muestra rejilla 15×5, 1200×630px, coherente con el diseño actual.

#### Pendiente 2: cognicion-preadolescencia[0] — Ref más específica para multitarea
- **Descripción:** El claim sobre multitarea con medios → peor memoria de trabajo y rendimiento académico usa Ra2018 como soporte (calce flojo). Buscar un paper más específico sobre media multitasking en preadolescentes.
- **Tipo:** Deuda técnica / Integración de evidencia.
- **Complejidad:** Baja (búsqueda web dirigida; Van der Schuur 2020 o Baumgartner 2018 son candidatos del corpus de literatura disponible).
- **Criterio de éxito:** Ref más específica o confirmación de que Ra2018 es suficiente.

#### Pendiente 3: salud-mental-preescolar[1] — Ref para contenido violento/prosocial
- **Descripción:** Claim sobre contenido violento → peores resultados emocionales en preescolares sigue no_ref. Requiere búsqueda más dirigida (Valkenburg 2025 SED meta-analysis o Christakis RCT de sustitución de contenido).
- **Tipo:** Deuda técnica / Integración de evidencia.
- **Complejidad:** Baja.
- **Criterio de éxito:** Ref verificada agregada o justificación editorial actualizada en CLAUDE.md.

#### Pendiente 4: Essex2025 — Verificar N en texto completo
- **Descripción:** Entrada bibliográfica con nota "N verificar en texto completo". Verificar el tamaño muestral real.
- **Tipo:** Deuda técnica / Bibliografía.
- **Complejidad:** Baja.

### 11.2 Evaluación de deuda técnica

- **Validación de esquema bib al insertar:** El pre-flight de esta sesión detectó types inválidos y group faltante antes de insertar. Considerar agregar un assert que valide types/groups contra metadata al correr el assert principal.
- **DIM_BLOCKS vs. metadata.dimensions:** El reorden manual revela que estos dos artefactos pueden desincronizarse. Considerar un assert que verifique que el orden de DIM_BLOCKS coincide con el orden de bloque en metadata.dimensions.

### 11.3 Auditoría de cierre

- ¿Cada bloque de transformación tiene un check de validación? (C.8) → **Sí** — assert post-no_ref-review, pre-flight de esquema bib, conteo no_ref.
- ¿Los outputs son reproducibles e idempotentes? (C.2, C.3) → **Sí** — `./00_build.sh` reproduce `index.html`; escáner ahora idempotente.
- ¿Hay decisiones metodológicas documentadas? (C.11) → **Sí** — sección 8 de este traspaso + política no_ref en CLAUDE.md.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **og-image** — único pendiente visual significativo; la matriz tiene 15×5 en vivo pero la imagen de preview dice 10×5.
2. **Pendiente 2** (ref multitarea) — búsqueda de 15 min; cierra el calce flojo de Ra2018 en cognicion-preadolescencia[0].
3. **Pendiente 3** (salud-mental-preescolar[1] ref) — búsqueda corta; cierra el último no_ref con candidato disponible.
4. **Pendiente 4** (Essex2025) — trivial.

**Diferir:** Phase 6 (adolescencia), glosario mejoras, P-ESTRUCTURA.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **ANTES** de editar `app.js`, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar `2` y `0`.
- ⚠️ **NO** editar `metadata.json` con `json.dump`. Siempre str_replace quirúrgico sobre texto crudo.
- ⚠️ **NO** usar campo `flags` en claims hasta que `app.js` lo soporte.
- ⚠️ **NO** agregar entradas bib sin verificar que `type` esté en `metadata.biblioTypes` y `group` en `metadata.biblioGroups`. El campo `year` no existe en el esquema.
- ⚠️ **NO** usar `HernandezMartinez2025` sin confirmar que el rename se propagó correctamente (ya hecho, solo verificar si hay duda).
- ⚠️ **NO** citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
- ⚠️ **NO** usar umbral de "86 min" en claims COT20s.
- ⚠️ **NO** editar `index.html` directamente. Shell HTML va en `template.html`.
- ⚠️ **ANTES** de integrar batch nuevo, verificar que cada celda tenga `summary`/`intro`/`certainty`. El assert no detecta campos editoriales vacíos.
- ⚠️ **ANTES** de push, confirmar assert: 0 huérfanos, 0 duplicados.
- ⚠️ Al agregar nueva dimensión, verificar inmediatamente que su posición en `metadata.dimensions` coincide con su bloque en `DIM_BLOCKS`.
- 🔒 15 claims `no_ref: true` — política documentada en CLAUDE.md; no reducir sin revisión editorial.
- 🔒 3 celdas cyberbullying × 0–5 son vacías intencionales.
- 🔒 `DIM_DESCRIPTIONS` en `app.js` — definiciones embebidas; `definiciones_dimensiones.md` es el documento-fuente.
- 🔒 El topbar tiene 3 hijos flex: `.topbar-left`, `nav.tabs`, `.topbar-right`. No meter `nav.tabs` dentro de `.topbar-left`.
- 🔒 `activeDim` y `activeCell` son mutuamente excluyentes.

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

**Pre-flight de esquema antes de insertar entradas bib:**
```python
import json
meta = json.load(open("10_fuentes/data/metadata.json"))
valid_types = set(meta["biblioTypes"].keys())
valid_groups = {g["id"] for g in meta["biblioGroups"]}
# Verificar entradas candidatas antes de insertar:
candidatas = [
    {"id": "Ejemplo2025", "type": "meta", "group": "recent", ...}
]
for e in candidatas:
    if e.get("type") not in valid_types:
        print(f"⚠ type inválido en {e['id']}: {e.get('type')}")
    if e.get("group") not in valid_groups:
        print(f"⚠ group inválido en {e['id']}: {e.get('group')}")
    if "year" in e:
        print(f"⚠ campo 'year' no existe en el esquema: {e['id']}")
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 18 (Sonnet)`
(Reemplazar "Sonnet" por el modelo que vayas a usar.)

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
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos a adjuntar

**Documentos de protocolo (knowledge base del Project — no adjuntar):**
- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`

**Documento de traspaso (adjuntar al nuevo chat):**
- `traspaso-cierre-v17.md` (este documento)

**Output del escáner (adjuntar al nuevo chat):**
- `30_documentacion/estructura/estructura_actual.md`

**Archivos del proyecto críticos para retomar:**
- `10_fuentes/app.js` — si la sesión incluye og-image u otro trabajo en UI
- `assets/og-image.png` — si la sesión incluye rediseño de og-image
- `10_fuentes/data/claims.json` — si la sesión incluye Pendientes 2 o 3

**Documentos opcionales según foco:**
- Si la sesión incluye og-image: adjuntar `assets/og-image.png` y `10_fuentes/styles.css`.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
