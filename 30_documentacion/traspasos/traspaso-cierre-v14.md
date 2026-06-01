# Traspaso de Cierre — Crianza y Pantallas
- **Versión de traspaso:** v14
- **Fecha:** 2026-06-01
- **Sesión:** 14 — Diagnóstico y corrección de 5 dimensiones nuevas sin summary/intro/certainty; D-hover con tooltips de definición en columna izquierda de la matriz; prompt 17 de definiciones para búsqueda bibliográfica.
- **Modelo utilizado:** Sonnet 4.6
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)
- **Archivos principales modificados:**
  - `10_fuentes/app.js`
  - `10_fuentes/styles.css`
  - `10_fuentes/data/claims.json`
  - `index.html`
  - `30_documentacion/activa/17_prompt_definiciones_dimensiones.md`
  - `30_documentacion/activa/definiciones_dimensiones.md`

---

## 2. Resumen ejecutivo

La sesión 14 abrió con un diagnóstico correcto del traspaso v13 (5 dimensiones nuevas integradas, todas sin `summary`, `intro` ni `certainty`), lo que explicaba que la matriz mostrara puntos de certeza sin texto en co-regulación, alfabetización, privacidad, cyberbullying y alimentación. Se patchearon las 22 celdas afectadas (3 celdas cyberbullying × 0–5 permanecen vacías intencionales) con campos redactados desde los resultados de los prompts 12–16. En paralelo se acordó e implementó D-hover: un tooltip CSS que aparece al hacer hover sobre los labels de la columna izquierda de la matriz, mostrando una definición de 100–150 palabras centrada en el rol de la dimensión en la infancia y su andamiaje, más 2–4 links a recursos verificados. Las definiciones fueron generadas por el prompt 17 en una sesión paralela y se embebieron en `app.js`. Se generó también el prompt 17 como archivo reutilizable. Todo fue commiteado en 2 commits (`ea3174a`, `caa6043`) sobre `main`; al cierre de sesión están sin pushear junto con el escáner de cierre. Queda pendiente el push, P7 (actualizar IDs en prompts 01–10), D-visual (colores por bloque) y no_ref-review.

---

## 3. Estado del proyecto al cierre

**Qué funciona:**
- Sitio local en estado limpio: build OK, `index.html` 8421 líneas, assert 0 huérfanos / 0 duplicados / 240 claims / 250 refs.
- Matriz 15×5 completa con summary, intro y certainty en todas las celdas con contenido (72 celdas pobladas, 3 vacías intencionales en cyberbullying × 0–5).
- D-hover operativo: hover sobre cualquiera de los 15 labels de dimensión muestra tooltip con definición + links. Tooltip oculto en móvil (`max-width: 600px`). Cierre con Escape, clic fuera y mouseleave.
- Build reproducible: `./00_build.sh` desde la terminal integrada de Positron o con `system()` desde R.
- Assert de integridad pasa post-reemplazo de claims.json.

**Qué no funciona / deuda conocida:**
- 2 commits sin pushear a origin/main (`ea3174a` D-hover + `caa6043` docs). GitHub Pages aún sirve `ff8f560` (expansión 15×5 sin tooltips ni summaries).
- P7: prompts 01–10 listan ~91 IDs; corpus tiene 250. Batches futuros de dimensiones originales tendrán falsos positivos.
- no_ref-review: 19 claims `no_ref: true` sin revisión editorial formal.
- D-visual: colores por bloque en labels de dimensión acordados pero no implementados.
- `HernandezMosqueira2025` y `Ma2025`: DOIs sin verificar (deuda de v12).
- README y og-image describen el sitio como "10×5" (desactualizado).

**Qué cambió respecto a v13:**
- `claims.json`: 22 celdas de las 5 dimensiones nuevas ahora tienen `summary`, `intro` y `certainty`. Conteo de claims sin cambio (240).
- `app.js`: +162 líneas. Objeto `DIM_DESCRIPTIONS` con definiciones y links para las 15 dimensiones; funciones `showDimTooltip`/`closeDimTooltip`/`positionDimTooltip`; eventos hover/Escape/clic delegados.
- `styles.css`: +43 líneas. Bloque `.dim-tooltip` con diseño oscuro, sección "Leer más" y responsive off en móvil.
- `30_documentacion/activa/`: 2 archivos nuevos (prompt 17 input + resultado).

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Diagnóstico de celdas sin summary/intro/certainty en las 5 dimensiones nuevas
- **Archivo(s) afectado(s):** ninguno (diagnóstico)
- **Categoría temática:** Corrección de bugs
- **Qué se hizo:** Script Python que auditó las 25 celdas de las 5 dimensiones nuevas. Resultado: 22 celdas con claims pero sin `summary`, `intro` ni `certainty`; 3 vacías intencionales (cyberbullying × 0–5).
- **Por qué se hizo:** La imagen de la matriz mostraba puntos de certeza sin texto en 5 dimensiones. El traspaso v13 documentaba los batches como integrados, pero no incluía los campos de render.
- **Cómo se verificó:** Output del script: `summary=VACÍO` en los 22 casos.

#### Cambio 2: Patch de 22 celdas — summary, intro, certainty
- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`
- **Categoría temática:** Corrección de bugs / Integración de evidencia
- **Qué se hizo:** Script Python que añadió `summary`, `intro` y `certainty` a las 22 celdas afectadas, redactados desde los resultados de los prompts 12–16. Cyberbullying × 0–5 no tocado (vacío intencional).
- **Por qué se hizo:** Sin estos campos, `app.js` no puede renderizar el contenido de la celda: muestra punto de certeza pero no summary ni intro.
- **Cómo se verificó:** Assert post-patch: 240 claims, 0 huérfanos, 0 duplicados. Validación visual de los 22 campos.
- **Certezas asignadas:**
  - Co-regulación: `medium` (5 celdas) — mecanismo establecido, evidencia moderada.
  - Alfabetización: `low` (0–5), `medium` (6–12) — evidencia escasa en tramos bajos.
  - Privacidad: `low` (0–5), `medium` (6–12) — riesgo crece con acceso a dispositivos.
  - Cyberbullying: `medium` (niñez-media), `high` (preadolescencia).
  - Alimentación: `high` (0–5), `medium` (6–12) — mecanismo de distracción sólido.

#### Cambio 3: Prompt 17 — definiciones de 15 dimensiones con recursos
- **Archivo(s) afectado(s):** `30_documentacion/activa/17_prompt_definiciones_dimensiones.md`
- **Categoría temática:** Documentación / Herramientas de búsqueda
- **Qué se hizo:** Generación del prompt 17 para búsqueda bibliográfica de definiciones de las 15 dimensiones orientadas al rol en la infancia y el andamiaje, con 2–4 recursos verificados por dimensión (español prioritario, máximo 4, sin paywall). Incluye definiciones base, contexto del proyecto por dimensión y regla anti-alucinación para URLs.
- **Cómo se verificó:** Ejecutado en sesión paralela; resultado integrado en D-hover.

#### Cambio 4: D-hover — tooltip de definición en columna izquierda de la matriz
- **Archivo(s) afectado(s):** `10_fuentes/app.js`, `10_fuentes/styles.css`
- **Categoría temática:** UI / Render
- **Qué se hizo:**
  - `app.js`: objeto `DIM_DESCRIPTIONS` con texto (100–150 palabras) y array de links para las 15 dimensiones. Atributo `data-dim-id` en cada `row-head`. Funciones `showDimTooltip`, `positionDimTooltip`, `closeDimTooltip`. Eventos: mouseover (muestra), mouseleave (cierra), clic fuera (cierra), Escape (cierra).
  - `styles.css`: bloque `.dim-tooltip` (fondo oscuro `var(--ink)`, border-radius 8px, sección `.dim-tooltip-links` con label "Leer más" y links en blanco). Media query: `display: none` en `max-width: 600px`.
- **Cómo se verificó:** `node --check app.js` ✓. 15/15 IDs presentes en `DIM_DESCRIPTIONS`. Build OK (8421 líneas). Assert integridad OK.
- **Decisión de diseño:** Definiciones embebidas en `app.js` (no en `metadata.json`) para evitar tocar el archivo frágil. `definiciones_dimensiones.md` queda como documento-fuente en `30_documentacion/activa/`.
- **Scope:** solo columna izquierda de la matriz; no se aplica en ficha lateral ni en otros lugares donde aparece el nombre de la dimensión.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

Crianza y Pantallas es un sitio web estático que sintetiza evidencia científica revisada por pares sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz de dimensiones del desarrollo × tramos etarios. El sitio está dirigido a padres y cuidadores en Chile. La tecnología es HTML/CSS/JS vanilla con datos en JSON. El proyecto se inició en 2025 y se desarrolla en sesiones de trabajo con Claude, cada una documentada con un traspaso versionado.

### 5.2 Nota metodológica

Cada ítem del backlog representa una solicitud o decisión conceptualmente distinguible del usuario. Los errores introducidos por el asistente y corregidos inmediatamente en el mismo turno no se contabilizan; sí se cuentan los bugs reportados por el usuario o detectados por Claude Code en validación previa. La clasificación temática es por intención primaria. Las fuentes son los documentos de traspaso y el historial de conversaciones.

### 5.3 Clasificación temática

## Clasificación temática de los ~300 cambios

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Integración de evidencia | ~85 | 28% | Agregar claims, referencias bibliográficas, batches de papers, correcciones de citas |
| Arquitectura de datos | ~45 | 15% | Cambios en estructura de JSON (claims, bib, metadata), esquemas, IDs, tipos |
| UI / Render | ~45 | 15% | Cambios en app.js, styles.css, lógica de render de matriz, ficha, glosario, tooltips |
| Documentación | ~40 | 13% | Traspasos, prompts de búsqueda, CLAUDE.md, README, diagramas de arquitectura |
| Corrección de bugs | ~35 | 12% | Bugs detectados y corregidos: render, datos, build, referencias huérfanas, campos vacíos |
| Arquitectura de contenido | ~25 | 8% | Decisiones editoriales: dimensiones, tramos, certeza, política no_ref |
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
| 12 | v14 | ~12 | Sonnet | Hover tooltips + summaries dimensiones nuevas |
| — | — | ~5 | — | Refinamientos menores distribuidos |

**Total de cambios solicitados: ~282**

### 5.5 Detalle cronológico — Sesión 14

**Sesión 14 (Sonnet 4.6) — 2026-06-01**

Diagnóstico de 5 dimensiones nuevas sin campos de render, corrección de 22 celdas, implementación de D-hover con tooltips de definición.

273. Diagnóstico visual: imagen de la matriz revela 5 dimensiones sin summary (solo puntos de certeza sin texto).
274. Script de auditoría: 22 celdas con claims y sin `summary`/`intro`/`certainty` confirmadas.
275. Redacción de `summary`, `intro` y `certainty` para las 22 celdas desde resultados de prompts 12–16.
276. Patch de `claims.json`: 22 celdas actualizadas; assert OK (240 claims, 0 huérfanos).
277. Build local con claims patcheado: index.html 8220 líneas, sin errores.
278. Decisión de diseño: D-hover aplica solo a columna izquierda de la matriz, no a ficha lateral.
279. Decisión de diseño: definiciones son del rol en la infancia y el andamiaje, no definiciones académicas genéricas; 100–150 palabras; con 2–4 links verificados.
280. Generación del prompt 17 para búsqueda bibliográfica de definiciones de las 15 dimensiones.
281. Ejecución del prompt 17 en sesión paralela; resultado: `definiciones_dimensiones.md` con 15 definiciones y recursos verificados.
282. Implementación D-hover en `app.js`: objeto `DIM_DESCRIPTIONS`, atributo `data-dim-id`, funciones `showDimTooltip`/`positionDimTooltip`/`closeDimTooltip`, eventos mouseover/Escape/clic.
283. Implementación D-hover en `styles.css`: bloque `.dim-tooltip` oscuro con sección "Leer más", responsive off en móvil.
284. Validación: `node --check` ✓, 15/15 IDs ✓, build OK (8421 líneas), assert ✓.
285. Commit `ea3174a`: D-hover + claims (4 archivos, +582/−48).
286. Commit `caa6043`: docs prompt 17 + definiciones (2 archivos, +304).

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron los cambios 273–286 correspondientes a la sesión 14.
- La categoría "UI / Render" subió a ~45 por la incorporación del sistema de tooltips.
- Total actualizado: ~282 cambios.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: 5 dimensiones nuevas sin campos de render
- **Síntoma observable:** La imagen de la matriz mostraba puntos de certeza sin texto en co-regulación, alfabetización, privacidad, cyberbullying y alimentación. Las celdas tenían claims en `claims.json` pero sin `summary`, `intro` ni `certainty`.
- **Causa raíz:** La sesión 13 integró los batches (claims + refs) pero no redactó los campos de encabezado de cada celda. Son campos editoriales que no provienen del paper sino de síntesis del autor.
- **Solución aplicada:** Script Python que patcheó los 22 campos desde los resultados de los prompts 12–16. Cyberbullying × 0–5 no tocado.
- **Criterio de verificación:** Assert 240 claims / 0 huérfanos + validación visual de los 22 campos.
- **Patrón aprendido:** Al integrar un batch bibliográfico nuevo, verificar explícitamente que cada celda tenga `summary`, `intro` y `certainty` además de `claims` y `refs`. El assert de integridad no detecta este bug (valida refs, no campos editoriales).
- **Estado:** Resuelto.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Al integrar un batch nuevo, el assert de integridad (huérfanos/duplicados) no es suficiente. Agregar verificación explícita de `summary`, `intro` y `certainty` en cada celda nueva.
  - **Principio:** C.8 (Validación de integridad).
  - **Contexto:** El assert valida coherencia de IDs entre claims y bib; no valida completitud de campos editoriales. Son dos tipos de validación distintos.

- **Regla:** Las definiciones de `DIM_DESCRIPTIONS` van embebidas en `app.js`, no en `metadata.json`. El archivo `metadata.json` es frágil ante reformateos; `app.js` ya tiene mecanismo de inyección en el build.
  - **Principio:** Bug 2 del traspaso v13 (nunca `json.dump` sobre `metadata.json`).

- **Regla:** El build de este proyecto es `./00_build.sh` desde terminal, no un orquestador R. Desde Positron: terminal integrada (`Ctrl+\``) o `system("./00_build.sh")` desde la consola R.

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: Definiciones en hover son del rol en la infancia, no definiciones académicas
- **Decisión:** El texto del tooltip responde: ¿qué papel juega esta dimensión en el desarrollo 0–12? ¿Qué construye para el futuro?
- **Alternativas consideradas:** (a) Definición académica del concepto. (b) Resumen de la evidencia del sitio.
- **Justificación:** La audiencia es padres; necesitan entender por qué importa la dimensión, no una definición de manual. El tooltip es el punto de entrada a la matriz, no un resumen de evidencia (para eso está la ficha).
- **Implicancia:** Las definiciones deben actualizarse si el enfoque editorial del sitio cambia.

#### Decisión 2: Tooltip solo en columna izquierda
- **Decisión:** El hover aplica únicamente a los labels de la columna izquierda de la matriz (`row-head`).
- **Alternativas consideradas:** También en ficha lateral y en otros elementos con el nombre de la dimensión.
- **Justificación:** La columna izquierda es el punto de entrada natural para entender qué es cada dimensión. Duplicar el tooltip en otros lugares satura la interfaz.

#### Decisión 3: Links de recursos en el tooltip, no como página separada
- **Decisión:** El tooltip incluye sección "Leer más" con 2–4 links directamente en el bubble.
- **Alternativas consideradas:** (a) Sin links (solo texto). (b) Link a una página de recursos separada.
- **Justificación:** El usuario que quiere profundizar tiene el acceso inmediato sin salir de la pantalla. Una página separada requeriría arquitectura nueva.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| Dimensiones | 15 | `metadata.json` | Sin cambio |
| Tramos etarios | 5 | `metadata.json` | Sin cambio |
| Total claims | 240 | `claims.json` | Sin cambio en conteo |
| Total referencias | 250 | `bibliografia.json` | Sin cambio |
| Claims `no_ref: true` | 19 | `claims.json` | Sin cambio |
| Celdas vacías intencionales | 3 | `claims.json` | cyberbullying × 0–5 |
| biblioGroups | 16 | `metadata.json` | Sin cambio |
| biblioTypes | 11 | `metadata.json` | Sin cambio |
| Commits sin pushear | 2 | git | `ea3174a` + `caa6043` |
| Commit actual `main` local | `caa6043` | git | Push pendiente |
| Commit actual `origin/main` | `ff8f560` | git | Pre-sesión 14 |

---

## 10. Arquitectura de archivos relevante

El escáner de cierre de sesión 14 debe correrse antes del commit final. La estructura de carpetas no cambió; se agregaron 2 archivos en `30_documentacion/activa/` y se modificaron 4 archivos existentes.

**Nota:** `30_documentacion/` (no `50_documentacion/`) es la carpeta de documentación de este proyecto — convención establecida en sesiones anteriores, diferente a la política canónica. No migrar sin protocolo de migración completo.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: Push de 2 commits a origin/main
- **Descripción:** `ea3174a` (D-hover) + `caa6043` (docs) + escáner de cierre están listos para push.
- **Tipo:** Build / Infraestructura.
- **Impacto:** GitHub Pages no refleja D-hover ni summaries hasta el push.
- **Complejidad:** Trivial.
- **Criterio de éxito:** `git push` sin errores; sitio en vivo muestra tooltips.

#### Pendiente 2: P7 — Actualizar IDs en prompts 01–10
- **Descripción:** Los prompts 01–10 listan ~91 IDs en "ya integrado"; el corpus tiene 250. Batches futuros de las 10 dimensiones originales propondrán papers ya integrados.
- **Tipo:** Deuda técnica / Documentación.
- **Complejidad:** Baja (~15 min). Script que extrae los 250 IDs y los inserta en los 10 archivos.
- **Criterio de éxito:** Los 10 prompts listan los 250 IDs actuales.

#### Pendiente 3: no_ref-review — Revisión editorial de 19 claims `no_ref: true`
- **Descripción:** 19 claims interpretativos/mecanísticos sin referencia. Revisar y documentar justificación editorial en CLAUDE.md.
- **Tipo:** Deuda técnica / Gobernanza de contenido.
- **Complejidad:** Media (~1 sesión).
- **Criterio de éxito:** Cada claim tiene justificación documentada.

#### Pendiente 4: D-visual — Colores por bloque en labels de dimensión
- **Descripción:** Implementar color de fondo por bloque temático en los 4 grupos de la columna izquierda. Acordado en sesión 13, no implementado.
- **Tipo:** Mejora visual / UX.
- **Complejidad:** Media. Requiere `app.js` + `styles.css`.
- **Criterio de éxito:** 4 tonos distintos por bloque, visibles en desktop y móvil.

#### Pendiente 5: D-hover — Verificación visual en navegador
- **Descripción:** Abrir `index.html` en navegador y confirmar que los tooltips se muestran correctamente en todas las dimensiones, incluidas las nuevas.
- **Tipo:** Verificación.
- **Complejidad:** Trivial.
- **Criterio de éxito:** Hover en cada uno de los 15 labels muestra tooltip con texto y links.

#### Pendiente 6: HernandezMosqueira2025 y Ma2025 — DOIs sin verificar
- **Descripción:** Dos entradas bibliográficas con DOI pendiente de verificación (deuda de v12).
- **Tipo:** Deuda técnica / Bibliografía.
- **Complejidad:** Baja.

#### Pendiente 7: README y og-image — Actualizar "10×5" a "15×5"
- **Descripción:** README y og-image describen el sitio como "10×5". Desactualizado desde sesión 13.
- **Tipo:** Documentación / SEO.
- **Complejidad:** Baja.

### 11.2 Evaluación de deuda técnica

- **`DIM_DESCRIPTIONS` en `app.js`:** Las definiciones están embebidas en el JS. Si se quieren editar en el futuro sin tocar código, habría que moverlas a un JSON separado. Por ahora es aceptable dado el tamaño del proyecto.
- **Validación de campos editoriales:** El assert actual no verifica `summary`/`intro`/`certainty`. Considerar agregar ese check al script de assert para batches futuros.
- **Links del tooltip:** No se valida que las URLs sean accesibles. Programar verificación manual cada 6–12 meses (recomendación del prompt 17).

### 11.3 Auditoría de cierre

- ¿Cada bloque de transformación tiene un check de validación? (C.8) → **Sí** — assert post-patch.
- ¿Los outputs son reproducibles e idempotentes? (C.2, C.3) → **Sí** — `./00_build.sh` reproduce `index.html` desde fuentes.
- ¿Hay decisiones metodológicas documentadas? (C.11) → **Sí** — sección 8 de este traspaso.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Push** — un comando, desbloquea GitHub Pages con D-hover y summaries.
2. **D-hover verificación visual** — abrir en navegador, confirmar 15/15 tooltips.
3. **P7** — script de actualización de IDs (15 min); prerequisito para cualquier batch futuro.
4. **D-visual** — colores por bloque; tienes `app.js` y `styles.css` recién modificados, momento natural para continuar.
5. **no_ref-review** — sesión dedicada de gobernanza de contenido.

**Diferir:** D (glosario móvil), P5, P6 (adolescencia), P-ESTRUCTURA.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** editar `metadata.json` con `json.dump`. Siempre Edit quirúrgico (str_replace).
- ⚠️ **NO** usar campo `flags` en claims hasta que `app.js` lo soporte. Advertencias van en el texto.
- ⚠️ **NO** agregar entradas bibliográficas con `group` nuevo sin verificar que ese grupo exista en `metadata.biblioGroups`.
- ⚠️ **NO** usar `HernandezMosqueira2025` sin DOI verificado.
- ⚠️ **NO** citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
- ⚠️ **NO** usar umbral de "86 min" en claims COT20s.
- ⚠️ **NO** editar `index.html` directamente. Shell HTML va en `template.html`.
- ✅ **ANTES** de integrar un batch nuevo, verificar que cada celda nueva tenga `summary`, `intro` y `certainty` además de `claims` y `refs`. El assert de integridad no detecta campos editoriales vacíos.
- ✅ **ANTES** de cualquier batch bibliográfico, verificar huérfanos en dry-run antes de escribir.
- ✅ **ANTES** de push, confirmar assert: 0 huérfanos, 0 duplicados.
- 🔒 El corpus tiene 19 claims `no_ref: true` — no reducir ese número sin revisión editorial explícita.
- 🔒 Las 3 celdas cyberbullying × 0–5 son vacías intencionales — no poblar sin evidencia directa.
- 🔒 `DIM_DESCRIPTIONS` en `app.js` — las definiciones del tooltip están embebidas ahí; `definiciones_dimensiones.md` es el documento-fuente.

---

## 13. Fragmentos de código de referencia

**Verificación de campos editoriales en celdas (agregar al assert estándar):**
```python
import json
claims = json.load(open("10_fuentes/data/claims.json"))
vacias_editorial = []
for key, cell in claims.items():
    if cell.get("claims") and len(cell["claims"]) > 0:
        if not cell.get("summary") or not cell.get("intro") or not cell.get("certainty"):
            vacias_editorial.append(key)
if vacias_editorial:
    print(f"⚠ Celdas con claims pero sin campos editoriales: {len(vacias_editorial)}")
    for k in vacias_editorial: print(f"  {k}")
else:
    print("✓ Todas las celdas con claims tienen summary, intro y certainty")
```

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

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 15 (Sonnet)`
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
> ⚠️ ANTES de integrar batch nuevo, verificar que cada celda tenga summary/intro/certainty. Ver Bug 1 del traspaso v14.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos a adjuntar

**Documentos de protocolo (knowledge base del Project — no adjuntar):**
- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`

**Documento de traspaso (adjuntar al nuevo chat):**
- `traspaso-cierre-v14.md` (este documento)

**Output del escáner (adjuntar al nuevo chat):**
- `30_documentacion/estructura/estructura_actual.md`

**Archivos del proyecto críticos para retomar:**
- `10_fuentes/app.js` — si la sesión incluye D-visual o ajustes al tooltip
- `10_fuentes/styles.css` — si la sesión incluye D-visual o ajustes al tooltip
- `10_fuentes/data/claims.json` — si la sesión incluye no_ref-review o nuevos batches
- `10_fuentes/data/metadata.json` — si la sesión incluye D-visual (mapeo dimensión→bloque)

**Documentos opcionales según foco:**
- Si la sesión incluye P7: adjuntar los 10 archivos `0N_prompt_*.md` de `30_documentacion/activa/prompts_busqueda/`.
- Si la sesión incluye D-visual: adjuntar `10_fuentes/app.js` y `10_fuentes/styles.css`.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
