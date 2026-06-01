# Traspaso de Cierre — Crianza y Pantallas
- **Versión de traspaso:** v13
- **Fecha:** 2026-06-01
- **Sesión:** 13 — Expansión de la matriz de 10×5 a 15×5: definición, diseño e integración de 5 dimensiones nuevas (co-regulación, alfabetización digital, privacidad y seguridad, cyberbullying, alimentación y pantallas).
- **Modelo utilizado:** Sonnet 4.6
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)
- **Archivos principales modificados:**
  - `10_fuentes/data/metadata.json`
  - `10_fuentes/data/claims.json`
  - `10_fuentes/data/bibliografia.json`
  - `10_fuentes/app.js`
  - `index.html`

---

## 2. Resumen ejecutivo

La sesión 13 se propuso analizar el `prompt 11` (dimensiones nuevas) y tomar una decisión arquitectónica sobre la expansión de la matriz. Se acordó agregar 5 dimensiones (co-regulación parental, alfabetización digital, privacidad y seguridad, cyberbullying y alimentación y pantallas) y reordenar las 10 existentes en un esquema temático de 4 bloques. Se ejecutaron los cambios en tres fases: esqueleto estructural (metadata + celdas vacías + guards de render), generación de 5 prompts de búsqueda bibliográfica (12–16) e integración de los 5 batches de resultados. El proyecto pasó de 174 claims y 189 referencias a 240 claims y 250 referencias, con 72 celdas pobladas (3 vacías intencionales en cyberbullying para los tramos 0–5). Todo fue validado con assert de integridad (0 huérfanos, 0 duplicados) y verificación visual en preview local y en el deploy de GitHub Pages. Quedan pendientes P7 (actualización de IDs en los 10 prompts de búsqueda originales), la revisión de los 19 claims `no_ref`, y la mejora visual de agrupamiento por bloques en la matriz (opción B, acordada esta sesión).

---

## 3. Estado del proyecto al cierre

**Qué funciona:**
- Sitio publicado en `main` @ `ff8f560`, GitHub Pages propagado y verificado con curl.
- Matriz 15×5 completa: 240 claims, 250 refs, 72 celdas con contenido, 3 vacías intencionales (cyberbullying × lactante/primera-infancia/preescolar).
- Celdas vacías renderizan "—" limpio (no punto de certeza baja) gracias a los 2 guards en `app.js`.
- Bibliografía: 16 biblioGroups válidos (se agregaron `mental`, `language`, `classic`, `fisica`, `vision`); type `report` disponible para reportes institucionales.
- Assert de integridad: 0 huérfanos, 0 duplicados, 0 pendientes reales.
- Build reproducible: `./00_build.sh` genera `index.html` desde fuentes sin intervención manual.

**Qué no funciona / deuda conocida:**
- Los 10 prompts de búsqueda originales (01–10) listan ~91 IDs en su sección "ya integrado"; ahora el corpus tiene 250 entradas. Cualquier nueva búsqueda con esos prompts riesga proponer papers ya integrados (P7).
- Los 19 claims con `no_ref: true` no han sido revisados editorialmente (no_ref-review).
- El agrupamiento visual por bloques temáticos en la matriz (colores por bloque en los labels de dimensión) está acordado pero no implementado (opción B, pendiente D-visual).
- `HernandezMosqueira2025` y `Ma2025`: DOIs sin verificar (deuda de v12, no resuelta).

**Qué cambió respecto a v12:**
- Matriz: 10 dimensiones → 15, con reordenamiento temático completo.
- Claims: 174 → 240 (+66).
- Referencias: 189 → 250 (+61).
- `metadata.json`: array `dimensions` reescrito (15 entradas, nuevo orden); `biblioGroups` +5 grupos; `biblioTypes` +1 tipo (`report`).
- `claims.json`: 25 celdas vacías de esqueleto → 22 pobladas + 3 vacías intencionales.
- `app.js`: 2 guards de celda vacía (L199 grilla, L225 ficha).
- Documentación: prompts 12–16 (inputs + resultados) versionados en `30_documentacion/activa/prompts_busqueda/`.

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Decisión arquitectónica — expansión de la matriz a 15×5
- **Archivo(s) afectado(s):** ninguno (decisión editorial)
- **Categoría temática:** Arquitectura de contenido
- **Qué se hizo:** Se analizó el `prompt 11` (análisis de dimensiones candidatas). Se decidió agregar 5 dimensiones (co-regulación, alfabetización, privacidad, cyberbullying, alimentación) y reordenar las 10 existentes en 4 bloques temáticos: desarrollo cognitivo (lenguaje, cognición, creatividad), desarrollo socioemocional (socioemocional, comportamiento, vínculo, co-regulación), salud mental y riesgos digitales (salud mental, alfabetización, privacidad, cyberbullying), salud física (sueño, física, alimentación, visión).
- **Por qué se hizo:** El `prompt 11` identificó evidencia sólida con anchors verificados para estas 5 dimensiones. El reordenamiento temático mejora la coherencia narrativa del sitio.
- **Cómo se verificó:** Confirmación editorial explícita del usuario antes de ejecutar cualquier cambio.

#### Cambio 2: `metadata.json` — 15 dimensiones con nuevo orden
- **Archivo(s) afectado(s):** `10_fuentes/data/metadata.json`
- **Categoría temática:** Arquitectura de datos
- **Qué se hizo:** Reescritura quirúrgica del array `dimensions` (10 → 15 entradas, nuevo orden). Se usó Edit de Claude Code (no `json.dump`) para preservar el formato compacto del archivo (~156 líneas, no 308).
- **Por qué se hizo:** `json.dump(indent=2)` habría reformateado todo el archivo, generando un diff de ~300 líneas que oscurece el cambio real. Lección aprendida en esta sesión.
- **Cómo se verificó:** `python3 -c "import json; m=json.load(...); print(len(m['dimensions']))"` → 15. Formato preservado confirmado por conteo de líneas.

#### Cambio 3: `claims.json` — 25 celdas vacías de esqueleto
- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`
- **Categoría temática:** Arquitectura de datos
- **Qué se hizo:** Se agregaron 25 celdas `{"claims": []}` para las 5 dimensiones nuevas × 5 tramos. Script Python con skip-duplicados y assert inline.
- **Por qué se hizo:** Necesario para que el render no busque claves inexistentes. Las celdas vacías se renderizan como "—" limpio gracias al guard del cambio 4.
- **Cómo se verificó:** Assert de integridad: 0 huérfanos, conteo de celdas = 75.

#### Cambio 4: `app.js` — guards de celda vacía
- **Archivo(s) afectado(s):** `10_fuentes/app.js`
- **Categoría temática:** Corrección de render
- **Qué se hizo:** Fix 1 (L199): `if (!cell)` → `if (!cell || !(cell.claims && cell.claims.length))`. Fix 2 (L225): `if (!cellId || !claims[cellId])` → `if (!cellId || !claims[cellId] || !claims[cellId].claims?.length)`. Se aplicó con script Python con asserts de unicidad (1 ocurrencia cada uno). Fix 2 tenía indentación de 4 espacios (no 8); Claude Code lo detectó y corrigió antes de ejecutar.
- **Por qué se hizo:** Sin este fix, una celda presente-pero-vacía `{"claims": []}` no caía en el bloque `cell-empty` sino que intentaba renderizar con `certainty: undefined` → punto de "certeza baja" engañoso.
- **Cómo se verificó:** `node --check 10_fuentes/app.js` + validación visual en preview.

#### Cambio 5: Generación de prompts de búsqueda 12–16
- **Archivo(s) afectado(s):** `30_documentacion/activa/prompts_busqueda/12_prompt_co_regulacion.md`, `13_prompt_alfabetizacion.md`, `14_prompt_privacidad.md`, `15_prompt_cyberbullying.md`, `16_prompt_alimentacion.md`
- **Categoría temática:** Documentación / Herramientas de búsqueda
- **Qué se hizo:** Se generaron 5 prompts de búsqueda siguiendo el formato de los prompts 01–10 (referencia: `08_prompt_lenguaje.md`), con los 189 IDs del corpus como lista "ya integrado", anchors verificados del prompt 11, sub-temas específicos y sección de foco de novedad.
- **Por qué se hizo:** Prerequisito para ejecutar las búsquedas bibliográficas de cada dimensión nueva. Los prompts se depositaron como archivos descargables (no en el chat).
- **Cómo se verificó:** Entregados como archivos `.md` y commiteados en el repo.

#### Cambio 6: Integración batch co-regulación
- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Integración de evidencia
- **Qué se hizo:** +8 entradas bibliográficas (Jing2023 saltado — ya existía), +11 claims en 5 celdas de co-regulación. Entradas en esquema A (group/journal-embebido/url). Grupos: `recent`, `school`, `intl`.
- **Cómo se verificó:** Assert: 0 huérfanos, bib 197, claims 185.

#### Cambio 7: Integración batch alfabetización digital
- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Integración de evidencia
- **Qué se hizo:** +13 entradas (Liu2024 renombrado a LiuSAGE2024 por colisión), +15 claims en 5 celdas. Advertencias de extrapolación a adultos incorporadas al texto de los claims (no como campo `flags` — `app.js` no lo renderiza).
- **Cómo se verificó:** Assert: 0 huérfanos, bib 210, claims 200.

#### Cambio 8: `metadata.json` — type `report` y 5 biblioGroups nuevos
- **Categoría temática:** Arquitectura de datos
- **Qué se hizo:** Edit quirúrgico para agregar `"report": {"label": "Reporte institucional", "cls": ""}` a `biblioTypes` y 5 grupos (`mental`, `language`, `classic`, `fisica`, `vision`) a `biblioGroups`. Motivación: los 3 reportes institucionales de privacidad (WeProtect, Thorn/NCMEC, Disrupting Harm) mostraban chip "Encuesta nacional" (`type: survey`). Además, 13 entradas de batches anteriores tenían grupos inválidos (`mental`, `language`, `classic`, `fisica`, `vision`) y no aparecían en la pestaña Bibliografía.
- **Cómo se verificó:** Auditoría de grupos: 0 entradas con grupo inválido tras el cambio.

#### Cambio 9: Integración batch privacidad y seguridad
- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Integración de evidencia
- **Qué se hizo:** +14 entradas (3 con `type: report`), +14 claims en 5 celdas. Campo `flags` eliminado (app.js no lo renderiza; advertencias incorporadas al texto de los claims).
- **Cómo se verificó:** Assert: 0 huérfanos, bib 224, claims 214.

#### Cambio 10: Integración batch cyberbullying
- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Integración de evidencia
- **Qué se hizo:** +12 entradas (Lee2026 saltado — ya existía; Li2024 faltaba en nuevas_bib — detectado y corregido antes de ejecutar), +10 claims en 2 celdas (niñez-media + preadolescencia). Lactante, primera-infancia y preescolar vacías intencionales: el cyberbullying emerge con la propiedad de dispositivos propios (~10 años).
- **Cómo se verificó:** Assert: 0 huérfanos, bib 236, claims 224.

#### Cambio 11: Integración batch alimentación y pantallas
- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Integración de evidencia
- **Qué se hizo:** +13 entradas nuevas (Mason2024 saltado — ya existía), +16 claims en 5 celdas. Cubre dos mecanismos: marketing digital de alimentos y alimentación distraída. Incluye evidencia chilena (Jensen2021, DillmanCarpentier2020) y latinoamericana (Nieto2023).
- **Cómo se verificó:** Assert: 0 huérfanos, bib 250, claims 240.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

Crianza y Pantallas es un sitio web estático que sintetiza evidencia científica revisada por pares sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz de dimensiones del desarrollo × tramos etarios. El sitio está dirigido a padres y cuidadores en Chile. La tecnología es HTML/CSS/JS vanilla con datos en JSON. El proyecto se inició en 2025 y se desarrolla en sesiones de trabajo con Claude, cada una documentada con un traspaso versionado.

### 5.2 Nota metodológica

Cada ítem del backlog representa una solicitud o decisión conceptualmente distinguible del usuario. Los errores introducidos por el asistente y corregidos inmediatamente en el mismo turno no se contabilizan; sí se cuentan los bugs reportados por el usuario o detectados por Claude Code en validación previa. La clasificación temática es por intención primaria. Las fuentes son los documentos de traspaso y el historial de conversaciones.

### 5.3 Clasificación temática

## Clasificación temática de los ~290 cambios

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Integración de evidencia | ~85 | 29% | Agregar claims, referencias bibliográficas, batches de papers, correcciones de citas |
| Arquitectura de datos | ~45 | 16% | Cambios en estructura de JSON (claims, bib, metadata), esquemas, IDs, tipos |
| UI / Render | ~40 | 14% | Cambios en app.js, styles.css, lógica de render de matriz, ficha, glosario |
| Documentación | ~35 | 12% | Traspasos, prompts de búsqueda, CLAUDE.md, README, diagramas de arquitectura |
| Corrección de bugs | ~30 | 10% | Bugs detectados y corregidos: render, datos, build, referencias huérfanas |
| Arquitectura de contenido | ~25 | 9% | Decisiones editoriales: dimensiones, tramos, certeza, política no_ref |
| SEO / Metadatos | ~15 | 5% | Open Graph, meta tags, og-image, título, descripción |
| Build / Infraestructura | ~15 | 5% | 00_build.sh, template.html, escáner, git workflow |

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
| — | — | ~5 | — | Refinamientos menores distribuidos |

**Total de cambios solicitados: ~270**

### 5.5 Detalle cronológico — Sesión 13

**Sesión 13 (Sonnet 4.6) — 2026-06-01**

Expansión arquitectónica de la matriz de 10 a 15 dimensiones, con integración de 5 batches bibliográficos nuevos.

245. Análisis del prompt 11 (dimensiones candidatas) y decisión de expandir la matriz.
246. Definición de 5 dimensiones nuevas: co-regulación, alfabetización, privacidad, cyberbullying, alimentación.
247. Reordenamiento de las 15 dimensiones en 4 bloques temáticos.
248. Reescritura quirúrgica del array `dimensions` en `metadata.json` (10 → 15, nuevo orden).
249. Verificación de render defensivo en `app.js` (celdas vacías → "—" con fix de guard).
250. Fix L199 `app.js`: celda vacía en grilla renderiza "—" no punto de certeza baja.
251. Fix L225 `app.js`: ficha lateral con celda vacía muestra mensaje "vacío".
252. Creación de 25 celdas vacías de esqueleto en `claims.json`.
253. Build local + validación visual de matriz 15×5 con 25 "—".
254. Commit esqueleto `c220a7e` (metadata + claims + app.js + index.html).
255. Generación de prompt 12 (`co-regulacion`) como archivo descargable.
256. Generación de prompts 13–16 (`alfabetizacion`, `privacidad`, `cyberbullying`, `alimentacion`) como archivos descargables.
257. Detección y resolución de colisión de esquema JSON (esquema A vs. esquema con year/volume/doi separados).
258. Integración batch co-regulación: +8 bib, +11 claims, Jing2023 saltado (ya existía).
259. Detección de campo `flags` no renderizado por app.js; incorporación de advertencias al texto de los claims.
260. Integración batch alfabetización: +13 bib (LiuSAGE2024 por colisión con Liu2024), +15 claims.
261. Adición de `type: report` a `biblioTypes` en metadata (Edit quirúrgico, no json.dump).
262. Detección de 13 entradas con grupos inválidos (language, mental, classic, fisica, vision) invisibles en pestaña Bibliografía.
263. Adición de 5 biblioGroups nuevos a metadata (Edit quirúrgico).
264. Integración batch privacidad: +14 bib (3 con type report), +14 claims.
265. Integración batch cyberbullying: +12 bib (Li2024 faltante detectado antes de ejecutar; Lee2026 saltado), +10 claims, 3 celdas vacías intencionales (0–5 años).
266. Integración batch alimentación: +13 bib (Mason2024 saltado), +16 claims, evidencia chilena (Jensen2021, DillmanCarpentier2020).
267. Build final (index.html 8154 líneas).
268. Commit bloque expansión `a2f37a0`.
269. Commit docs resultados 12–16 + escáner `4609c6f`.
270. Commit docs prompts 12–16 `ff8f560`.
271. Push de 5 commits locales; GitHub Pages propagado.
272. Validación deploy en vivo (curl confirma 15 dimensiones publicadas).

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron los cambios 245–272 correspondientes a la sesión 13.
- La categoría "Arquitectura de contenido" se amplió para incluir decisiones de expansión de la matriz.
- Total actualizado: ~270 cambios.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: Colisión de esquema JSON en entradas bibliográficas nuevas
- **Síntoma:** Las entradas generadas con campos `year/volume/issue/pages/doi/pmid` no se renderizarían en la pestaña Bibliografía (sin `group`, sin `url`, `journal` sin vol/páginas embebidas).
- **Causa raíz:** El formato generado por el asistente no coincidía con el esquema A del proyecto (`group`, `featured`, `journal` con vol/páginas embebidas, `url`). `app.js` consume `b.group`, `b.url`, `b.journal` directamente; los campos separados quedan ignorados.
- **Solución:** Mapeo manual al esquema A antes de escribir. El assert de huérfanos no detecta este bug (los IDs existen); solo el análisis de `app.js` lo revela.
- **Regla aprendida:** Antes de integrar entradas bibliográficas nuevas, verificar que el esquema coincida con el que consume `app.js`. Los campos `year`, `volume`, `issue`, `pages`, `doi`, `pmid` son informativos para el humano pero no se renderizan.
- **Estado:** Resuelto.

#### Bug 2: `json.dump` reformatea todo el archivo
- **Síntoma:** Scripts Python que modifican `metadata.json` con `json.dump(indent=2)` convierten el archivo de ~156 líneas a ~308, generando diffs masivos que oscurecen el cambio real y rompen el formato compacto (alineación manual en `biblioTypes`).
- **Causa raíz:** `json.dump` serializa todo el objeto desde cero; no preserva formato preexistente.
- **Solución:** Para `metadata.json`, usar Edit quirúrgico de Claude Code (str_replace) en lugar de `json.dump`. Para `claims.json` y `bibliografia.json` (que ya usan `indent=2`), `json.dump` es seguro.
- **Regla aprendida:** Nunca usar `json.dump` sobre `metadata.json`. Siempre Edit quirúrgico para ese archivo.
- **Estado:** Resuelto.

#### Bug 3: Campo `flags` en claims no renderizado por `app.js`
- **Síntoma:** Claims con campo `"flags": ["⚠️ ..."]` almacenan advertencias metodológicas que nunca aparecen en el sitio; el campo queda como dato muerto.
- **Causa raíz:** `app.js` no tiene lógica para renderizar el campo `flags`; lo ignora silenciosamente.
- **Solución:** Incorporar las advertencias al texto del claim directamente (opción B). La opción A (agregar soporte de `flags` en el render) queda diferida como mejora futura.
- **Regla aprendida:** No usar campo `flags` en claims hasta que `app.js` lo soporte. Las advertencias metodológicas van en el texto del claim.
- **Estado:** Resuelto (convención establecida).

#### Bug 4: Huérfano `Li2024` en cyberbullying
- **Síntoma:** El claim `cyberbullying-preadolescencia[0]` referenciaba `Li2024` pero la entrada no estaba en `nuevas_bib` ni en el corpus. El assert habría abortado después de escribir los archivos, dejándolos en estado inconsistente.
- **Causa raíz:** `Li2024` fue designado anchor desde el prompt 11 pero no incluido en el script de integración.
- **Solución:** Claude Code detectó el huérfano en verificación previa (sin escribir nada). Se agregó la entrada antes de ejecutar.
- **Regla aprendida:** Siempre correr verificación de huérfanos en dry-run antes de escribir. El assert inline al final del script no protege si el archivo ya fue escrito con error.
- **Estado:** Resuelto.

#### Bug 5: 13 entradas bibliográficas con grupos inválidos (deuda de sesiones anteriores)
- **Síntoma:** 13 entradas de batches anteriores (grupos `language`, `mental`, `classic`, `fisica`, `vision`) no aparecían en la pestaña Bibliografía. `app.js` solo itera los grupos definidos en `metadata.biblioGroups`.
- **Causa raíz:** Los batches anteriores crearon entradas con grupos semánticamente correctos pero no declarados en metadata.
- **Solución:** Se declararon los 5 grupos faltantes en `biblioGroups` de metadata mediante Edit quirúrgico.
- **Regla aprendida:** Al agregar entradas con un `group` nuevo, verificar que ese grupo exista en `metadata.biblioGroups` antes de commitear.
- **Estado:** Resuelto.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Nunca usar `json.dump` sobre `metadata.json`; siempre Edit quirúrgico.
  - **Principio:** C.3 (idempotencia) + B.3 (cambios quirúrgicos).
  - **Contexto:** `metadata.json` tiene formato compacto con alineación manual. `json.dump` lo destruye en cada escritura.

- **Regla:** El campo `flags` en claims no se renderiza. Las advertencias metodológicas van en el texto del claim.
  - **Principio:** C.11 (transparencia del cambio).
  - **Contexto:** `app.js` no tiene lógica para `flags`. Agregar un campo que no se renderiza genera deuda silenciosa.

- **Regla:** Antes de ejecutar cualquier script que escriba JSON, correr verificación de huérfanos en dry-run.
  - **Principio:** C.8 (validación de integridad), B.4 (criterio de éxito antes de ejecutar).
  - **Contexto:** El assert inline al final del script no es suficiente si el archivo ya fue escrito con error.

- **Regla:** Al agregar entradas bibliográficas con un `group` nuevo, verificar que ese grupo exista en `metadata.biblioGroups`.
  - **Principio:** C.8 (validación de integridad).
  - **Contexto:** Grupos inexistentes en metadata hacen que las entradas sean invisibles en la pestaña Bibliografía sin error visible.

- **Regla:** ⚠️ NO usar `HernandezMosqueira2025` sin DOI verificado. ⚠️ NO citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo. (Deuda de v12, sigue vigente.)

- **Regla:** ⚠️ NO usar umbral de "86 min" en claims COT20s. (Deuda de v11, sigue vigente.)

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: Expandir la matriz de 10×5 a 15×5
- **Decisión:** Agregar 5 dimensiones nuevas en lugar de mantener la matriz en 10.
- **Alternativas consideradas:** (a) Mantener 10 dimensiones y agregar sub-secciones dentro de las existentes. (b) Crear una sección separada para "riesgos digitales".
- **Justificación:** Las 5 dimensiones nuevas tienen evidencia sólida y anchors verificados. Son conceptualmente distintas de las existentes (co-regulación no es vínculo; alimentación no es actividad física). La arquitectura del sitio (matriz dinámica) escala sin costo adicional.
- **Implicancia:** La descripción del proyecto como "10×5" queda obsoleta. Actualizar en README, CLAUDE.md y og-image si se hace una actualización visual futura.

#### Decisión 2: Bloques temáticos como orden lógico, no como separadores visuales
- **Decisión:** El orden de las 15 dimensiones refleja 4 bloques temáticos, pero estos bloques no se renderizan como separadores en la matriz todavía.
- **Alternativas consideradas:** (a) Separadores de fila entre bloques (descartado: saturado en desktop, peor en móvil). (b) Color de fondo por bloque en labels de dimensión (opción B, acordada para implementar después).
- **Justificación:** La implementación visual se difiere para una sesión dedicada junto con el glosario móvil. El orden ya comunica el agrupamiento sin intervención de UI.
- **Implicancia:** Pendiente nuevo **D-visual** (opción B: colores por bloque en labels).

#### Decisión 3: Celdas vacías intencionales en cyberbullying (0–5 años)
- **Decisión:** Las celdas cyberbullying × lactante, primera-infancia y preescolar quedan permanentemente vacías ("—").
- **Justificación:** El cyberbullying emerge empíricamente con la propiedad de dispositivos propios (~10 años). No existe evidencia de cyberbullying entre pares en menores de 5 años. Fabricar claims para estas celdas sería espurio.
- **Implicancia:** El sitio mostrará 3 "—" permanentes en esa fila. Es editorialmente correcto.

#### Decisión 4: Advertencias metodológicas van en el texto del claim, no en campo `flags`
- **Decisión:** El campo `flags` no se usa mientras `app.js` no lo renderice.
- **Justificación:** Un campo invisible es peor que texto explícito en el claim. Las advertencias de extrapolación (ej. "evidencia de muestras adultas") son parte de la afirmación, no metadatos opcionales.
- **Implicancia:** Los claims de alfabetización y cyberbullying con muestras adultas llevan la advertencia en su texto.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| Dimensiones | 15 | `metadata.json` | Antes: 10 |
| Tramos etarios | 5 | `metadata.json` | Sin cambio |
| Total claims | 240 | `claims.json` | Antes: 174 |
| Total referencias | 250 | `bibliografia.json` | Antes: 189 |
| Claims `no_ref: true` | 19 | `claims.json` | Sin cambio |
| Celdas vacías intencionales | 3 | `claims.json` | cyberbullying × 0–5 |
| biblioGroups | 16 | `metadata.json` | Antes: 11 |
| biblioTypes | 11 | `metadata.json` | +report |
| Commit actual `main` | `ff8f560` | git | Push sesión 13 |

---

## 10. Arquitectura de archivos relevante

El escáner de cierre de sesión 13 vive en `30_documentacion/estructura/` (commiteado en `4609c6f`). La estructura del proyecto no cambió en sus carpetas raíz; solo se agregaron archivos dentro de `30_documentacion/activa/prompts_busqueda/` (prompts 12–16 inputs y resultados).

**Nota:** La descripción "10×5" en README y en el og-image es técnicamente obsoleta. Se puede actualizar en una sesión futura junto con la mejora visual de bloques (D-visual).

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: P7 — Actualizar IDs integrados en los 10 prompts de búsqueda originales
- **Descripción:** Los prompts 01–10 listan ~91 IDs en su sección "ya integrado en el corpus". El corpus ahora tiene 250 entradas. Cualquier nueva búsqueda con esos prompts riesga proponer papers ya integrados.
- **Tipo:** Deuda técnica / Documentación.
- **Impacto:** Batches futuros de las 10 dimensiones originales tendrán falsos positivos de "papers nuevos".
- **Complejidad:** Baja (~15 min). Script que extrae los 250 IDs y los inserta en los 10 archivos.
- **Criterio de éxito:** Los 10 prompts listan los 250 IDs actuales.

#### Pendiente 2: no_ref-review — Revisión editorial de los 19 claims `no_ref: true`
- **Descripción:** Revisar los 19 claims interpretativos/mecanísticos que tienen `no_ref: true` para confirmar que su justificación editorial es sólida y documentarla formalmente.
- **Tipo:** Deuda técnica / Gobernanza de contenido.
- **Impacto:** Sin revisión, el corpus tiene 19 afirmaciones sin anclaje verificado que podrían debilitar la credibilidad del sitio.
- **Complejidad:** Media (~1 sesión).
- **Criterio de éxito:** Cada uno de los 19 claims tiene una justificación documentada en CLAUDE.md o en el traspaso.

#### Pendiente 3: D-visual — Colores por bloque en labels de dimensión (opción B)
- **Descripción:** Implementar color de fondo por bloque temático en los 4 grupos de la columna izquierda de la matriz: desarrollo cognitivo (lenguaje/cognición/creatividad), desarrollo socioemocional (socioemocional/comportamiento/vínculo/co-regulación), salud mental y riesgos digitales (salud-mental/alfabetización/privacidad/cyberbullying), salud física (sueño/física/alimentación/visión).
- **Tipo:** Mejora visual / UX.
- **Impacto:** Comunica el agrupamiento temático sin saturar la matriz.
- **Complejidad:** Media. Requiere `app.js` (mapeo dimensión→bloque→color) y `styles.css` (variables de color por bloque).
- **Criterio de éxito:** La columna izquierda de la matriz muestra 4 tonos distintos según bloque, visibles en desktop y móvil.

#### Pendiente 4: D — Glosario móvil (índice compacto)
- **Descripción:** Rediseño del índice del glosario para pantallas pequeñas.
- **Tipo:** Mejora visual / UX.
- **Complejidad:** Media-alta. Requiere `app.js` + `styles.css`.

#### Pendiente 5: P5 — Modos alpha/relevancia en glosario
- **Descripción:** Permitir ordenar el glosario alfabéticamente o por relevancia.
- **Tipo:** Funcionalidad nueva.
- **Complejidad:** Media.

#### Pendiente 6: P6 — Fase adolescencia (13–17 años)
- **Descripción:** Agregar tramo adolescencia a la matriz (actualmente 0–12 años).
- **Tipo:** Funcionalidad nueva / Expansión de contenido.
- **Complejidad:** Alta. Requiere decisión arquitectónica + batches bibliográficos para 15 dimensiones × 1 tramo nuevo.

#### Pendiente 7: P-ESTRUCTURA — Prefijos numéricos en `10_fuentes/`
- **Descripción:** Los archivos en `10_fuentes/` no siguen la convención de prefijos numéricos de la política del proyecto.
- **Tipo:** Deuda técnica / Estructura.
- **Complejidad:** Media. Requiere protocolo de migración.

#### Pendiente 8: HernandezMosqueira2025 y Ma2025 — DOIs sin verificar
- **Descripción:** Dos entradas bibliográficas tienen DOI pendiente de verificación.
- **Tipo:** Deuda técnica / Bibliografía.
- **Complejidad:** Baja.

### 11.2 Evaluación de deuda técnica

- **`metadata.json`:** Archivo frágil ante `json.dump`. Regla establecida: siempre Edit quirúrgico. Sin cambio de código requerido.
- **Grupos bibliográficos:** Saldada en esta sesión (5 grupos declarados). Riesgo residual: batches futuros con grupos nuevos no declarados.
- **Descripción "10×5":** README y og-image desactualizados. Bajo impacto inmediato; corregir en próxima sesión de UI.

### 11.3 Auditoría de cierre

- ¿Cada bloque de transformación tiene un check de validación? (C.8) → **Sí** — assert inline en todos los scripts de integración.
- ¿Los outputs son reproducibles e idempotentes? (C.2, C.3) → **Sí** — `./00_build.sh` reproduce `index.html` desde fuentes.
- ¿Hay decisiones metodológicas documentadas? (C.11) → **Sí** — secciones 7 y 8 de este traspaso.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **P7 — Actualizar IDs en prompts 01–10** (15 min, inicio de sesión) — prerequisito para cualquier batch futuro de las 10 dimensiones originales.
2. **no_ref-review — Revisión de los 19 claims interpretativos** — corpus maduro, momento natural para consolidar antes de agregar más volumen.
3. **D-visual — Colores por bloque en matriz** (si hay tiempo) — mejora de UX acordada esta sesión; requiere `app.js` + `styles.css`.

**Diferir:** D (glosario móvil), P5, P6, P-ESTRUCTURA.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** editar `metadata.json` con `json.dump`. Siempre Edit quirúrgico (str_replace).
- ⚠️ **NO** usar campo `flags` en claims hasta que `app.js` lo soporte. Advertencias van en el texto.
- ⚠️ **NO** agregar entradas bibliográficas con `group` nuevo sin verificar que ese grupo exista en `metadata.biblioGroups`.
- ⚠️ **NO** usar `HernandezMosqueira2025` sin DOI verificado.
- ⚠️ **NO** citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
- ⚠️ **NO** usar umbral de "86 min" en claims COT20s.
- ⚠️ **NO** editar `index.html` directamente. Shell HTML va en `template.html`.
- ✅ **ANTES** de cualquier batch bibliográfico, verificar huérfanos en dry-run antes de escribir.
- ✅ **ANTES** de push, confirmar assert: 0 huérfanos, 0 duplicados.
- 🔒 El corpus tiene 19 claims `no_ref: true` — no reducir ese número sin revisión editorial explícita.
- 🔒 Las 3 celdas cyberbullying × 0–5 son vacías intencionales — no poblar sin evidencia directa.

---

## 13. Fragmentos de código de referencia

**Verificación de grupos bibliográficos (detecta entradas invisibles en Bibliografía):**
```python
import json
bib = json.load(open("10_fuentes/data/bibliografia.json"))
meta = json.load(open("10_fuentes/data/metadata.json"))
grupos_validos = {g["id"] for g in meta["biblioGroups"]}
invalidos = [b for b in bib if b.get("group") not in grupos_validos]
print(f"Entradas con grupo inválido: {len(invalidos)}")
for e in invalidos:
    print(f"  {e['id']}: group='{e.get('group')}'")
```

**Assert completo de integridad (ejecutar antes de cualquier commit):**
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

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 14 (Sonnet)`
(Reemplazar "Sonnet" por el modelo que vayas a usar.)

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos de la sesión anterior.
>
> ⚠️ NO editar `metadata.json` con `json.dump` — siempre Edit quirúrgico. Ver Bug 2 del traspaso v13.
> ⚠️ NO usar campo `flags` en claims — las advertencias van en el texto. Ver Bug 3 del traspaso v13.
> ⚠️ NO agregar entradas bib con `group` nuevo sin verificar que exista en `metadata.biblioGroups`. Ver Bug 5 del traspaso v13.
> ⚠️ NO usar `HernandezMosqueira2025` sin DOI verificado. Ver traspaso v12.
> ⚠️ NO citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo. Ver traspaso v12.
> ⚠️ NO usar umbral de "86 min" en claims COT20s. Ver traspaso v11.
> ⚠️ NO editar `index.html` directamente. Shell HTML va en `template.html`. Ver traspaso v10.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos a adjuntar

**Documentos de protocolo (knowledge base del Project — no adjuntar):**
- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`

**Documento de traspaso (adjuntar al nuevo chat):**
- `traspaso-cierre-v13.md` (este documento)

**Output del escáner (adjuntar al nuevo chat):**
- `30_documentacion/estructura/estructura_actual.md`

**Archivos del proyecto críticos para retomar:**
- `10_fuentes/data/claims.json` — 240 claims, 75 celdas (si se aborda P7 o no_ref-review)
- `10_fuentes/data/bibliografia.json` — 250 entradas (si se aborda P7)
- `10_fuentes/data/metadata.json` — 15 dimensiones, 16 biblioGroups (si se toca UI)
- `30_documentacion/activa/prompts_busqueda/01_prompt_creatividad.md` — referencia de formato para P7 (adjuntar uno de los 10 prompts originales)

**Documentos opcionales según foco:**
- Si la sesión incluye D-visual (colores por bloque): adjuntar `10_fuentes/app.js` y `10_fuentes/styles.css`.
- Si la sesión incluye P7: adjuntar los 10 archivos `0N_prompt_*.md` de `30_documentacion/activa/prompts_busqueda/`.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
