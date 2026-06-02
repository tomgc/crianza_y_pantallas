# Traspaso de Cierre — Crianza y Pantallas
- **Versión de traspaso:** v19
- **Fecha:** 2026-06-02
- **Sesión:** 19 — Spot-check bibliográfico completo (P3); corrección de traspasos v17+v18; infraestructura de papers PDF; Baumgartner2014 y typeLabels fix.
- **Modelo utilizado:** Opus 4.8
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)
- **Archivos principales modificados:**
  - `10_fuentes/data/bibliografia.json`
  - `10_fuentes/app.js`
  - `30_documentacion/traspasos/traspaso-cierre-v17.md`
  - `30_documentacion/traspasos/traspaso-cierre-v18.md`
  - `20_recursos/papers/README.md`
  - `20_recursos/.gitignore`
  - `index.html`

---

## 2. Resumen ejecutivo

La sesión 19 completó el spot-check bibliográfico (Pendiente 3 de v18), saneando 8 entradas con notas de trabajo, journals incompletos o URLs genéricas: Slattery2025, Wang2024 (PMID 39203923 verificado), Myruski2018, Akacem2018, Hysing2015 (vol/issue completado), CNTV2023 (journal con descripción del estudio + URL al PDF específico). Se revisaron además 9 entradas con `type: longitudinal` para estudios experimentales (política confirmada: `longitudinal` por convención, diseño real en `journal`), Maertens2021 (verificado con full text — calce directo con claim de inoculación), Sanders2024, WHO2019 y BrightFutures (aceptables). Se completaron también los pendientes de apertura: Baumgartner2014 insertado en bib y asignado a `cognicion-preadolescencia[0]` (Ra2018 removido — calce flojo), typeLabels completado de 6 a 11 tipos. Se corrigieron los traspasos v17 y v18 (modelo, conteos, pendientes stale). Se creó `20_recursos/papers/` para versionar PDFs de papers referenciados, con Maertens2021.pdf como primera entrada. Al cierre: 255 bib, 240 claims, 14 no_ref, 0 huérfanos, origin sincronizado, working tree limpio.

---

## 3. Estado del proyecto al cierre

**Qué funciona:**
- Sitio en vivo (GitHub Pages, commit `80faabb`): build OK, `index.html` 8486 líneas, assert 0 huérfanos / 0 duplicados / 240 claims / 255 refs / 14 no_ref.
- Matriz 15×5 con 4 bandas D-visual; D-click operativo.
- Corpus bibliográfico saneado: sin notas de trabajo en campos `journal`, sin URLs genéricas en entradas con PDF específico disponible.
- `20_recursos/papers/` con Maertens2021.pdf versionado en Git.
- typeLabels completo (11/11 tipos).

**Qué no funciona / deuda conocida:**
- `Essex2025`: `type: longitudinal` para un experimento intra-sujetos. Decisión documentada — no agregar `experimental` por una sola entrada.
- CNTV2023: referencia huérfana (no respaldada en ningún claim). Disponible para uso futuro en contenido de contexto Chile.
- 2 residuos stale menores en v18 (L36-37 y L40-45 no alcanzaron a corregirse en esta sesión — ver sección 7).

**Qué cambió respecto a v18:**
- `bibliografia.json`: 8 entradas saneadas (journals limpios, PMID Wang2024, URL CNTV2023, Hysing2015 completado, Baumgartner2014 agregado).
- `claims.json`: `cognicion-preadolescencia[0]` → `refs: ["Baumgartner2014"]` (Ra2018 removido).
- `app.js`: typeLabels L771 completado a 11 tipos.
- `30_documentacion/traspasos/traspaso-cierre-v17.md`: modelo corregido a Opus 4.8.
- `30_documentacion/traspasos/traspaso-cierre-v18.md`: modelo, conteos, pendientes stale corregidos.
- `20_recursos/papers/`: carpeta nueva con README + Maertens2021.pdf + excepción `!papers/*.pdf` en `.gitignore`.

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Baumgartner2014 — insertar en bib y actualizar cognicion-preadolescencia[0]
- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`, `10_fuentes/data/claims.json`, `index.html`
- **Categoría temática:** Integración de evidencia
- **Qué se hizo:** Baumgartner2014 insertado en `bibliografia.json` (`type: transversal`, `group: recent`, DOI `10.1177/0272431614523133`, N=523 adolescentes 11–15 años). `cognicion-preadolescencia[0]`: `refs: ["Ra2018"]` → `refs: ["Baumgartner2014"]`. Ra2018 permanece en `cognicion-preadolescencia[1]`.
- **Cómo se verificó:** Assert OK — 255 bib, 240 claims, 0 huérfanos. Build OK (8486 líneas).
- **Commit:** `ee3e575`

#### Cambio 2: typeLabels — completar 5 tipos faltantes en app.js
- **Archivo(s) afectado(s):** `10_fuentes/app.js`, `index.html`
- **Categoría temática:** Corrección de bugs / UI / Render
- **Qué se hizo:** `typeLabels` en app.js L771 ampliado de 6 a 11 tipos. Agregados: `transversal: "Transversal"`, `cohort: "Cohorte"`, `theory: "Marco teórico"`, `survey: "Encuesta"`, `report: "Reporte"`. Los 5 tipos que se mostraban en crudo en la vista de bib ahora tienen etiqueta en español.
- **Cómo se verificó:** `node --check` ✓. Build OK. Assert ✓.
- **Commit:** `ee3e575` (junto con Cambio 1)

#### Cambio 3: Corrección de traspasos v17 y v18
- **Archivo(s) afectado(s):** `30_documentacion/traspasos/traspaso-cierre-v17.md`, `30_documentacion/traspasos/traspaso-cierre-v18.md`
- **Categoría temática:** Documentación
- **Qué se hizo:** v17: modelo `Sonnet 4.6` → `Opus 4.8` (3×). v18: modelo (4×), conteos 254→255 bib, 3→4 commits, Baumgartner2014 y typeLabels marcados como resueltos, pendientes stale removidos, D-hover corregido, README corregido.
- **Commit:** `de6c571`

#### Cambio 4: 20_recursos/papers/ — infraestructura de PDFs versionados
- **Archivo(s) afectado(s):** `20_recursos/papers/README.md`, `20_recursos/.gitignore`, `20_recursos/papers/Maertens2021.pdf`
- **Categoría temática:** Build / Infraestructura / Documentación
- **Qué se hizo:** Creada carpeta `20_recursos/papers/` para versionar PDFs de papers referenciados en la matriz. Convención: `{ID_bibliografia}.pdf`. `20_recursos/.gitignore` actualizado con `!papers/*.pdf` para re-incluir esa subcarpeta (el `.gitignore` existente tenía `*.pdf` global). Maertens2021.pdf (3.2 MB, acceso abierto APA) como primera entrada.
- **Decisión:** PDFs versionados en Git (no en `.gitignore`) para acceso público en GitHub y uso por Claude Code en sesiones futuras.
- **Commit:** `34515d9`

#### Cambio 5: Spot-check bib — limpiar notas de trabajo (tanda 1)
- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`, `index.html`
- **Categoría temática:** Corrección de bugs / Gobernanza de contenido
- **Qué se hizo:** 4 entradas con notas de trabajo removidas del campo `journal`:
  - `Myruski2018`: removida "Pre-2020, incluido por valor mecanístico"
  - `Akacem2018`: removida "Ancla pre-2020 por trazabilidad del dato"
  - `Slattery2025`: removida "riesgo de sesgo medio/alto en todos"
  - `Wang2024`: "PMID pendiente verificación" → "PMID: 39203923" (verificado en PubMed por usuario)
- **Commit:** `80685d8`

#### Cambio 6: Spot-check bib — completar entradas incompletas (tanda 2)
- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`, `index.html`
- **Categoría temática:** Corrección de bugs / Gobernanza de contenido
- **Qué se hizo:**
  - `Hysing2015`: journal "BMJ Open" → "BMJ Open 5(1):e006748" (volumen y número completados)
  - `CNTV2023`: journal vacío → "CNTV, septiembre 2023. N=806 padres/madres, niños 0–17 años, Chile."; URL genérica `cntv.cl/` → PDF específico `cntv.cl/wp-content/uploads/2023/09/Informe-Dia-de-la-ninez-2023-1.pdf`
- **Commit:** `80faabb`

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

Crianza y Pantallas es un sitio web estático que sintetiza evidencia científica revisada por pares sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz de dimensiones del desarrollo × tramos etarios. El sitio está dirigido a padres y cuidadores en Chile. La tecnología es HTML/CSS/JS vanilla con datos en JSON. El proyecto se inició en 2025 y se desarrolla en sesiones de trabajo con Claude, cada una documentada con un traspaso versionado.

### 5.2 Nota metodológica

Cada ítem del backlog representa una solicitud o decisión conceptualmente distinguible del usuario. Los errores introducidos por el asistente y corregidos inmediatamente en el mismo turno no se contabilizan; sí se cuentan los bugs reportados por el usuario o detectados en validación. La clasificación temática es por intención primaria. Las fuentes son los documentos de traspaso y el historial de conversaciones.

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Integración de evidencia | ~93 | 26% | Agregar claims, referencias bibliográficas, batches, correcciones de citas, no_ref-review, Baumgartner2014 |
| UI / Render | ~61 | 17% | app.js, styles.css, matriz, ficha, glosario, tooltips, D-click, D-visual, typeLabels fix |
| Arquitectura de datos | ~46 | 13% | JSON (claims, bib, metadata), esquemas, IDs, tipos |
| Documentación | ~52 | 15% | Traspasos, prompts, CLAUDE.md, README, diagramas, corrección v17/v18, papers/ README |
| Corrección de bugs | ~52 | 15% | Render, datos, build, refs huérfanas, autoría errónea, escáner, journals stale, notas de trabajo |
| Arquitectura de contenido | ~27 | 8% | Dimensiones, tramos, certeza, política no_ref, bloques, orden |
| SEO / Metadatos | ~17 | 5% | Open Graph, og-image 10×5→15×5, generador, título |
| Build / Infraestructura | ~18 | 5% | 00_build.sh, template.html, escáner, git, 00_generar_og_image.py, papers/ |

**Total de cambios solicitados: ~366**

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
| 16 | v18 | ~11 | Opus 4.8 | Christakis2013, Essex fix, og-image 15×5, Baumgartner2014, typeLabels |
| 17 | v19 | ~13 | Opus 4.8 | Spot-check bib completo, papers/, traspasos v17+v18 |
| — | — | ~5 | — | Refinamientos menores distribuidos |

**Total de cambios solicitados: ~366**

### 5.5 Detalle cronológico — Sesión 19

**Sesión 19 (Opus 4.8) — 2026-06-02**

Spot-check bibliográfico completo (P3 de v18): diagnóstico automático, verificación de 17 entries candidatas, saneamiento de 8, verificación de 9 experimentales y política confirmada. Baumgartner2014 y typeLabels completados. Infraestructura papers/. Corrección de traspasos v17+v18.

371. Diagnóstico automático de bib: 17 issues en 4 categorías (`posible_rct_as_longitudinal`, `pendiente`, `journal_vacio`, `posible_meta_mismatch`).
372. Política confirmada para 9 experimentales con `type: longitudinal`: mantener por convención (igual que Essex2025); diseño real documentado en `journal`.
373. Maertens2021 verificado con full text (PDF adjunto por usuario): calce directo con claim de inoculación en `alfabetizacion-preadolescencia[1]`. Sin cambios.
374. Sanders2024, WHO2019, BrightFutures revisados — aceptables como están.
375. Slattery2025: removida nota "riesgo de sesgo medio/alto en todos" del journal.
376. Wang2024: PMID 39203923 verificado por usuario (captura PubMed); nota "pendiente verificación" → PMID insertado.
377. Myruski2018: removida justificación "Pre-2020, incluido por valor mecanístico" del journal.
378. Akacem2018: removida justificación "Ancla pre-2020 por trazabilidad del dato" del journal.
379. Assert + build OK. Commit `80685d8` (4 journals limpios).
380. Push `80685d8`.
381. Hysing2015: journal "BMJ Open" → "BMJ Open 5(1):e006748".
382. CNTV2023: diagnosticada como huérfana (sin claims). URL genérica → PDF específico; journal vacío → descripción del estudio con N y año.
383. Assert + build OK. Commit `80faabb`. Push.
384. Infraestructura `20_recursos/papers/`: carpeta creada, convención `{ID_bibliografia}.pdf`, README redactado, `!papers/*.pdf` en `.gitignore` local para re-incluir subcarpeta.
385. Maertens2021.pdf (3.2 MB, acceso abierto) como primera entrada en `papers/`.
386. Commit `34515d9` + push (papers/ + .gitignore + README).
387. Baumgartner2014 insertado en bib (`type: transversal`, `group: recent`, DOI verificado). `cognicion-preadolescencia[0]`: Ra2018 removido → Baumgartner2014.
388. typeLabels L771: 6→11 tipos (agregados transversal, cohort, theory, survey, report).
389. Assert + build OK. Commit `ee3e575`.
390. Corrección traspasos v17 (modelo Opus 4.8 ×3) y v18 (modelo ×4, conteos, pendientes stale, D-hover, README). Escáner. Commit `de6c571`. Push.
391. Escáner adicional commiteado en `ca975da`. Push.

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron los cambios 371–391 correspondientes a la sesión 19.
- Categoría "Integración de evidencia" subió a ~93 (Baumgartner2014).
- Categoría "Corrección de bugs" subió a ~52 (8 journals saneados, typeLabels).
- Categoría "Documentación" subió a ~52 (corrección v17+v18, papers README).
- Categoría "Build / Infraestructura" subió a ~18 (papers/).
- Total actualizado: ~366 cambios.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: typeLabels incompleto — 5 tipos se mostraban en crudo
- **Síntoma:** `transversal`, `cohort`, `theory`, `survey`, `report` aparecían sin traducir en la vista de bib.
- **Causa raíz:** El objeto `typeLabels` hardcodeado en app.js (~L771) no se actualizó cuando se agregaron esos tipos al corpus.
- **Solución:** str_replace en app.js L771 — 6→11 tipos. `node --check` ✓.
- **Estado:** Resuelto (`ee3e575`).

#### Bug 2: 8 journals con notas de trabajo o datos incompletos
- **Síntoma:** Campos `journal` con texto como "PMID pendiente verificación", "Pre-2020, incluido por valor mecanístico", journal vacío o sin vol/issue.
- **Causa raíz:** Notas de sesión de trabajo quedaron embebidas en campos de datos permanentes durante la integración original.
- **Solución:** Diagnóstico automático + verificación manual + limpieza quirúrgica entry por entry.
- **Patrón aprendido:** Al integrar un batch, revisar que los campos `journal` no contengan marcadores de pendiente ni justificaciones internas. Son campos de datos, no notas.
- **Estado:** Resuelto.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** El campo `journal` es un campo de datos públicos — no debe contener notas de trabajo, justificaciones editoriales ni marcadores "pendiente". Esas notas van en CLAUDE.md o en el traspaso.
  - **Principio:** C.11 (Transparencia del cambio).

- **Regla:** Para verificar papers sin acceso completo: PMC → DOI directo → PsyArXiv/OSF → abstract PubMed (en ese orden). El abstract es suficiente para verificar diseño, N y outcome cuando el claim no cita cuantitativo específico.

- **Regla:** `20_recursos/papers/` almacena PDFs de acceso abierto con nombrado `{ID_bibliografia}.pdf`. El `20_recursos/.gitignore` tiene `!papers/*.pdf` para re-incluir esa subcarpeta (sin esa excepción, el `*.pdf` global los ignora).
  - **Principio:** C.2 (Reproducibilidad) — Claude Code puede leer PDFs en sesiones futuras.

- **Regla:** Los traspasos v17 y v18 tenían residuos stale menores en v18 (L36-37: deuda `typeLabels` ya resuelta; L40-45: "Qué cambió vs v17" incompleto). No son bloqueantes pero conviene corregirlos en v20 si se reedita v18.

- **Regla:** `json.dump` es seguro en `bibliografia.json` (round-trip idéntico, formato nativo). La prohibición de `json.dump` aplica específicamente a `metadata.json` (Bug 2 v13).
  - **Contexto:** Verificado con `redump == raw` (Δ=0) en esta sesión.

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: `type: longitudinal` para todos los estudios experimentales
- **Decisión:** Mantener `longitudinal` como convención para estudios experimentales (still-face, ECA, intra-sujetos, cruzados). El diseño real se documenta en el campo `journal`.
- **Alternativas:** Agregar `type: experimental` (requiere `metadata.biblioTypes` + `typeLabels`).
- **Justificación:** Costo desproporcionado para las entradas existentes. Consistente con la decisión de Essex2025 (v18). Si se acumulan más entradas experimentales, unificar en sesión dedicada.

#### Decisión 2: PDFs versionados en Git (no ignorados)
- **Decisión:** `20_recursos/papers/*.pdf` se versiona en Git con excepción en `.gitignore`.
- **Alternativas:** (a) Ignorar PDFs (solo en disco local). (b) Git LFS.
- **Justificación:** Acceso público en GitHub, uso por Claude Code en sesiones futuras, corpus acotado a papers referenciados en la matriz (límite de tamaño razonable). Si el repo crece significativamente por PDFs, migrar a Git LFS.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| Dimensiones | 15 | `metadata.json` | Sin cambio |
| Tramos etarios | 5 | `metadata.json` | Sin cambio |
| Total claims | 240 | `claims.json` | Sin cambio |
| Total referencias | 255 | `bibliografia.json` | Sin cambio |
| Claims `no_ref: true` | 14 | `claims.json` | Sin cambio |
| Celdas vacías intencionales | 3 | `claims.json` | cyberbullying × 0–5 |
| typeLabels | 11/11 tipos | `app.js` L771 | Completo desde esta sesión |
| Papers versionados | 1 | `20_recursos/papers/` | Maertens2021.pdf |
| Commit actual `main` | `80faabb` | git | Pusheado y sincronizado |

---

## 10. Arquitectura de archivos relevante

La estructura de carpetas no cambió salvo la adición de `20_recursos/papers/`. El escáner de cierre refleja 84 archivos (+1 por Maertens2021.pdf).

**Nota permanente:** `30_documentacion/` (no `50_documentacion/`) es la carpeta de documentación de este proyecto. No migrar sin protocolo completo.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: no_ref-review — 14 claims restantes
- **Descripción:** 14 claims con `no_ref: true`. Revisión editorial + justificación documentada en CLAUDE.md para cada uno.
- **Tipo:** Deuda técnica / Gobernanza de contenido.
- **Complejidad:** Media (~1 sesión).
- **Criterio de éxito:** Cada claim tiene justificación documentada en CLAUDE.md.

#### Pendiente 2: Spot-check bib — grupos no revisados
- **Descripción:** El spot-check de esta sesión cubrió los issues detectados automáticamente. No se revisó el corpus completo entrada por entrada — quedan grupos como `school`, `chile`, `intl` sin revisión manual sistemática.
- **Tipo:** Deuda técnica / Gobernanza de contenido.
- **Complejidad:** Media.
- **Criterio de éxito:** Lista de entradas revisadas documentada.

#### Pendiente 3: Residuos stale menores en v18
- **Descripción:** L36-37 (deuda `typeLabels` ya resuelta) y L40-45 ("Qué cambió vs v17" incompleto) en `traspaso-cierre-v18.md`.
- **Tipo:** Documentación.
- **Complejidad:** Trivial.
- **Criterio de éxito:** v18 sin contradicciones internas.

#### Pendiente 4: CNTV2023 — huérfana en corpus
- **Descripción:** CNTV2023 está en bib pero no respaldada en ningún claim. URL y journal ahora correctos; disponible para uso futuro en contenido de contexto Chile.
- **Tipo:** Arquitectura de contenido.
- **Complejidad:** Baja (decidir si integrar a un claim existente o crear uno nuevo).

### 11.2 Evaluación de deuda técnica

- **Essex2025 `type` incorrecto:** `longitudinal` para experimento intra-sujetos. Documentado; aceptable hasta que se agreguen más entradas experimentales.
- **Dos fuentes de verdad para biblioTypes:** `metadata.biblioTypes` y `typeLabels` en app.js. Ahora alineados (11/11). Mantener coordinación al agregar tipos nuevos.
- **`20_recursos/papers/` con 1 PDF:** la carpeta está lista pero subpoblada. Agregar PDFs de papers clave a medida que se verifiquen.

### 11.3 Auditoría de cierre

- ¿Cada bloque de transformación tiene un check de validación? (C.8) → **Sí** — assert post-cambio en cada modificación de bib.
- ¿Los outputs son reproducibles e idempotentes? (C.2, C.3) → **Sí** — `./00_build.sh` reproduce `index.html`.
- ¿Hay decisiones metodológicas documentadas? (C.11) → **Sí** — secciones 7 y 8 de este traspaso.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Pendiente 1: no_ref-review** — 14 claims; sesión dedicada de gobernanza.
2. **Pendiente 3: residuos v18** — trivial; hacerlo al abrir antes de cualquier otra cosa.
3. **Pendiente 2: spot-check bib grupos restantes** — si hay tiempo tras no_ref-review.
4. **Pendiente 4: CNTV2023** — decidir integración al abrir un batch de contexto Chile.

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
- ⚠️ Al agregar nueva dimensión, verificar que su posición en `metadata.dimensions` coincide con su bloque en `DIM_BLOCKS`.
- ⚠️ El campo `journal` es de datos públicos — no dejar notas de trabajo, justificaciones internas ni marcadores "pendiente".
- ⚠️ Al agregar PDF a `20_recursos/papers/`, usar exactamente el ID del corpus como nombre (`{ID_bibliografia}.pdf`).
- 🔒 14 claims `no_ref: true` — política documentada en CLAUDE.md; no reducir sin revisión editorial.
- 🔒 3 celdas cyberbullying × 0–5 son vacías intencionales.
- 🔒 `DIM_DESCRIPTIONS` en `app.js` — definiciones embebidas; `definiciones_dimensiones.md` es el documento-fuente.
- 🔒 `activeDim` y `activeCell` son mutuamente excluyentes.
- 🔒 `typeLabels` en app.js (~L771) cubre 11/11 tipos. Si se agrega tipo nuevo (e.g. `experimental`), actualizar también `metadata.biblioTypes`.
- 🔒 `json.dump` es seguro en `bibliografia.json` (round-trip idéntico verificado). La prohibición aplica específicamente a `metadata.json`.

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

**Diagnóstico de journals sospechosos en bib:**
```python
import json, re
bib = json.load(open("10_fuentes/data/bibliografia.json"))
for b in bib:
    j = b.get("journal", "")
    markers = ["verificar", "pendiente", "TODO", "sin datos", "por confirmar", "incluido por", "ancla"]
    if any(m.lower() in j.lower() for m in markers):
        print(f"  [{b['id']}] journal: {j[:100]}")
```

**Verificar estado de app.js al abrir sesión:**
```bash
grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js
# Esperado: 2 (openDimFicha) y 0 (showDimTooltip)
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

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 20 (Opus)`
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
> ⚠️ El campo `journal` es de datos públicos — no dejar notas de trabajo ni marcadores "pendiente".
> ⚠️ Al agregar PDF a `20_recursos/papers/`, usar exactamente el ID del corpus como nombre.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos a adjuntar

**Documentos de protocolo (knowledge base del Project — no adjuntar):**
- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`

**Documento de traspaso (adjuntar al nuevo chat):**
- `traspaso-cierre-v19.md` (este documento)

**Output del escáner (adjuntar al nuevo chat):**
- `30_documentacion/estructura/estructura_actual.md`

**Archivos del proyecto críticos para retomar:**
- `10_fuentes/data/claims.json` — para no_ref-review (Pendiente 1)
- `30_documentacion/activa/CLAUDE.md` — para no_ref-review (contiene lista actual)

**Documentos opcionales según foco:**
- Si la sesión incluye spot-check bib adicional: adjuntar `10_fuentes/data/bibliografia.json`.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
