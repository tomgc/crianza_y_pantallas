# Traspaso de Cierre — Crianza y Pantallas
- **Versión de traspaso:** v15
- **Fecha:** 2026-06-01
- **Sesión:** 15 — Verificación D-hover, P7 IDs, fix 15×5 textual, mejoras topbar (Certeza label, tabs sibling, brand-desc 680px)
- **Modelo utilizado:** Opus 4.8
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)
- **Archivos principales modificados:**
  - `10_fuentes/app.js`
  - `10_fuentes/styles.css`
  - `10_fuentes/template.html`
  - `30_documentacion/activa/prompts_busqueda/01_prompt_creatividad.md` … `16_prompt_alimentacion.md` (16 archivos, P7)
  - `README.md`

---

## 2. Resumen ejecutivo

La sesión 15 fue una sesión de consolidación y polish. Se verificó D-hover en vivo (15/15 tooltips con texto y links, 0 errores de consola). Se ejecutó P7: los 16 prompts de búsqueda (01–16) ahora listan los 250 IDs vigentes del corpus (antes: 36 en prompts 01–11, 189 en prompts 12–16). Se corrigió el texto "10×5" a "15×5" en README, meta description y ayuda de la matriz. Se realizaron tres mejoras al topbar: (1) brand-desc ampliada de 480px a 680px para reducir el quiebre de línea de la bajada, (2) label "Certeza" agregado antes de los puntos de la leyenda, (3) nav.tabs movido fuera de .topbar-left como sibling del topbar para alinear verticalmente tabs y leyenda. Todo commiteado en 3 commits y pusheado a origin/main. Al cierre: origin sincronizado, working tree limpio. GitHub Pages sirve la versión actualizada.

---

## 3. Estado del proyecto al cierre

**Qué funciona:**
- Sitio en vivo con D-hover operativo: 15 tooltips de definición en columna izquierda, verificados en navegador real.
- Matriz 15×5 completa: 240 claims / 250 refs / 0 huérfanos / 0 duplicados / campos editoriales completos en todas las celdas con contenido.
- Topbar: bajada más ancha (680px), label "Certeza" visible, tabs y leyenda alineados verticalmente.
- 16 prompts de búsqueda actualizados a los 250 IDs vigentes.
- README y meta description reflejan "15×5".
- Build reproducible: `./00_build.sh` → `index.html` 8423 líneas.

**Qué no funciona / deuda conocida:**
- D-hover → D-click pendiente (Pendiente 1).
- og-image decorativa muestra rejilla 10×5 (cosmético, diferido).
- 19 claims `no_ref: true` sin revisión editorial formal.
- `HernandezMosqueira2025` y `Ma2025`: DOIs sin verificar.
- Escáner cuenta sus propios snapshots en el total (~80 trackeados por git es el número real estable).
- Leyenda "Certeza" queda abajo-izquierda en viewports donde el topbar envuelve; para moverla a abajo-derecha bastaría `margin-left: auto` en `.topbar-right`.

**Qué cambió respecto a v14:**
- `app.js`: tabs movidos como sibling del topbar, label "Certeza" agregado en leyenda.
- `styles.css`: `brand-desc` 480→680px, `align-self: flex-end` en `.topbar-right`, `.legend-label` style.
- 16 prompts de búsqueda: bloque "ya integrado" actualizado a 250 IDs.
- `README.md`: "10×5" → "15×5", 72 celdas con evidencia, 250 entradas bibliográficas.
- `index.html`: rebuild (8423 líneas).
- 3 commits pusheados: `1b93a09` (15×5), `0f1bc7e` (P7), `ef3433c` (topbar).

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Verificación D-hover en vivo
- **Archivo(s) afectado(s):** ninguno (verificación)
- **Categoría temática:** Verificación
- **Qué se hizo:** Confirmación en navegador real de que los 15 tooltips disparan con texto (499–593 chars) y 1–3 links "Leer más". 0 errores de consola.
- **Cómo se verificó:** Screenshot en navegador + inspección programática.

#### Cambio 2: P7 — Actualización de IDs en 16 prompts de búsqueda
- **Archivo(s) afectado(s):** `30_documentacion/activa/prompts_busqueda/01_prompt_creatividad.md` … `16_prompt_alimentacion.md`
- **Categoría temática:** Documentación / Herramientas de búsqueda
- **Qué se hizo:** Bloque "ya integrado" reemplazado en los 16 archivos. Prompts 01–11 tenían 36 IDs; prompts 12–16 tenían 189 IDs. Todos ahora listan los 250 IDs vigentes, ordenados, 6/línea.
- **Cómo se verificó:** Set verificado == corpus en los 16 archivos post-edición.

#### Cambio 3: Fix textual 10×5 → 15×5
- **Archivo(s) afectado(s):** `README.md`, `10_fuentes/template.html`, `10_fuentes/app.js`
- **Categoría temática:** Documentación / SEO
- **Qué se hizo:** Reemplazadas ocurrencias de "10×5" / "10 dimensiones" por "15×5" / "15 dimensiones". README actualizado con conteos correctos (72 celdas, 250 entradas).
- **Cómo se verificó:** `grep "10 dimensiones" index.html` → 0 resultados. Verificación visual en vivo.

#### Cambio 4: Topbar — brand-desc 480px → 680px
- **Archivo(s) afectado(s):** `10_fuentes/styles.css`
- **Categoría temática:** UI / Render
- **Qué se hizo:** `max-width` de `.brand-desc` aumentado de 480px a 680px.
- **Cómo se verificó:** Screenshot en navegador: bajada pasa de 4 líneas a 3.

#### Cambio 5: Topbar — label "Certeza" en leyenda
- **Archivo(s) afectado(s):** `10_fuentes/app.js`, `10_fuentes/styles.css`
- **Categoría temática:** UI / Render
- **Qué se hizo:** Agregado `<span class="legend-label">Certeza</span>` antes del primer cdot. Estilo `.legend-label` (11px, color pencil) agregado al CSS.
- **Cómo se verificó:** Screenshot en navegador: leyenda muestra "Certeza ● alta ◐ media ○ baja".

#### Cambio 6: Topbar — tabs como sibling para alineación vertical
- **Archivo(s) afectado(s):** `10_fuentes/app.js`
- **Categoría temática:** UI / Render
- **Qué se hizo:** `nav.tabs` movido fuera de `.topbar-left` como sibling directo en el flex del topbar.
- **Cómo se verificó:** Screenshot en navegador: tabs y leyenda alineados en la misma fila.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

Crianza y Pantallas es un sitio web estático que sintetiza evidencia científica revisada por pares sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz de dimensiones del desarrollo × tramos etarios. El sitio está dirigido a padres y cuidadores en Chile. La tecnología es HTML/CSS/JS vanilla con datos en JSON. El proyecto se inició en 2025 y se desarrolla en sesiones de trabajo con Claude, cada una documentada con un traspaso versionado.

### 5.2 Nota metodológica

Cada ítem del backlog representa una solicitud o decisión conceptualmente distinguible del usuario. Los errores introducidos por el asistente y corregidos inmediatamente en el mismo turno no se contabilizan; sí se cuentan los bugs reportados por el usuario o detectados por Claude Code en validación previa. La clasificación temática es por intención primaria. Las fuentes son los documentos de traspaso y el historial de conversaciones.

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Integración de evidencia | ~85 | 27% | Agregar claims, referencias bibliográficas, batches de papers, correcciones de citas |
| Arquitectura de datos | ~45 | 15% | Cambios en estructura de JSON (claims, bib, metadata), esquemas, IDs, tipos |
| UI / Render | ~50 | 16% | Cambios en app.js, styles.css, lógica de render de matriz, ficha, glosario, tooltips, topbar |
| Documentación | ~45 | 15% | Traspasos, prompts de búsqueda, CLAUDE.md, README, diagramas de arquitectura |
| Corrección de bugs | ~35 | 11% | Bugs detectados y corregidos: render, datos, build, referencias huérfanas, campos vacíos |
| Arquitectura de contenido | ~25 | 8% | Decisiones editoriales: dimensiones, tramos, certeza, política no_ref |
| SEO / Metadatos | ~15 | 5% | Open Graph, meta tags, og-image, título, descripción |
| Build / Infraestructura | ~15 | 5% | 00_build.sh, template.html, escáner, git workflow |

**Total de cambios solicitados: ~292**

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
| — | — | ~5 | — | Refinamientos menores distribuidos |

### 5.5 Detalle cronológico — Sesión 15

**Sesión 15 (Opus 4.8) — 2026-06-01**

Verificación D-hover, P7 IDs en 16 prompts, fix textual 15×5, mejoras topbar.

287. Verificación D-hover en navegador real: 15/15 tooltips con texto y links, 0 errores de consola.
288. P7: bloque "ya integrado" reemplazado en 16 prompts de búsqueda (01–16) con los 250 IDs vigentes.
289. Fix textual: README, meta description y ayuda de matriz actualizados de "10×5" a "15×5".
290. Topbar: `brand-desc` ampliada de 480px a 680px (bajada de 4 líneas a 3 en desktop).
291. Topbar: label "Certeza" agregado antes de los puntos de la leyenda.
292. Topbar: `nav.tabs` movido como sibling del topbar para alineación vertical con la leyenda.
293. Assert de integridad pre-push: 250 bib / 240 claims / 0 huérfanos / campos editoriales completos.
294. Push de 3 commits a origin/main: `1b93a09`, `0f1bc7e`, `ef3433c`.

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron los cambios 287–294 correspondientes a la sesión 15.
- La categoría "UI / Render" subió a ~50 por las mejoras del topbar.
- La categoría "Documentación" subió a ~45 por P7 (16 prompts actualizados).
- Total actualizado: ~292 cambios.

---

## 6. Bugs encontrados y su resolución

No aplica en esta sesión. Assert de integridad pre-push pasó limpio (250 bib / 240 claims / 0 huérfanos).

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** El escáner cuenta sus propios snapshots timestamped en el total de archivos. El número real estable es el de `git ls-files` (~80 trackeados). No comparar totales de escáner entre sesiones para medir crecimiento del proyecto.
  - **Principio:** C.8 (Validación de integridad).
  - **Contexto:** Cada corrida agrega 2 archivos en `30_documentacion/estructura/`. Son gitignored pero el walk del escáner los cuenta. Pendiente parchear el escáner para excluirlos (Pendiente 6).

- **Regla:** Los scripts Python con `str.replace` hardcodeado fallan silenciosamente si la indentación no coincide byte a byte. Usar la herramienta str_replace de Claude Code (con lectura previa del archivo) en vez de scripts con strings multi-línea.
  - **Principio:** C.8, B.4 (criterio de éxito verificable).

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: Tabs como sibling del topbar (no hijo de topbar-left)
- **Decisión:** `nav.tabs` es ahora hijo directo del `.topbar` flex container.
- **Alternativas consideradas:** (a) Mantener tabs en topbar-left con align-items. (b) CSS Grid para el topbar.
- **Justificación:** Cuando `.brand-desc` hace crecer la altura de `.topbar-left`, los tabs dentro de ese bloque no pueden alinearse con la leyenda que está fuera. Moverlos al nivel del flex container es la solución estructuralmente correcta.
- **Implicancia:** El topbar tiene 3 hijos flex: `.topbar-left` (marca + bajada), `nav.tabs`, `.topbar-right` (leyenda).

#### Decisión 2: Leyenda abajo-izquierda sin margin-left: auto
- **Decisión:** No se agregó `margin-left: auto` a `.topbar-right`.
- **Justificación:** El estado visual en desktop es correcto. En cualquier viewport donde el topbar envuelva a dos líneas la leyenda queda abajo-izquierda; verificar antes de tocar.
- **Implicancia:** Si se quiere abajo-derecha en wrapping, agregar `margin-left: auto` a `.topbar-right` en `styles.css`.

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
| brand-desc max-width | 680px | `styles.css` | Antes: 480px |
| Commit HEAD origin/main | ef3433c | git | Working tree limpio |
| Archivos trackeados por git | ~80 | git ls-files | Total del escáner (~109) incluye snapshots gitignored |

---

## 10. Arquitectura de archivos relevante

Escáner de cierre corrido el 2026-06-01 13:37:18. Estructura de carpetas sin cambios respecto a v14. Total del escáner (~109) incluye 32 snapshots timestamped gitignored; número real estable: ~80 archivos trackeados por git.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: D-hover → D-click (definición en panel ficha activa)
- **Descripción:** Reemplazar el tooltip hover por click/tap que carga la definición de la dimensión en el panel de ficha activa. La fila seleccionada muestra el borde azul de celda activa. Los links quedan accesibles sin que el panel desaparezca. Click en celda cierra/reemplaza normalmente.
- **Tipo:** Funcionalidad nueva / UX.
- **Impacto:** Mejora significativa de usabilidad en desktop y móvil (hover no existe en touch).
- **Complejidad:** Media. Requiere modificar `app.js` (lógica de click en row-head, render en ficha) y `styles.css` (estado activo en row-head). El tooltip CSS puede eliminarse.
- **Precauciones:** Definir comportamiento cuando hay celda activa y se hace click en la dimensión: ¿reemplaza o convive?
- **Criterio de éxito:** Click en label carga definición en ficha; fila muestra borde azul; links clicables; tap en móvil funciona.

#### Pendiente 2: D-visual — Colores por bloque en labels de dimensión
- **Tipo:** Mejora visual / UX.
- **Complejidad:** Media. Requiere `app.js` (mapeo dimensión→bloque) + `styles.css` (4 tonos).
- **Criterio de éxito:** 4 tonos distintos por bloque, visibles en desktop y móvil.

#### Pendiente 3: no_ref-review — 19 claims `no_ref: true`
- **Tipo:** Deuda técnica / Gobernanza de contenido.
- **Complejidad:** Media (~1 sesión).
- **Criterio de éxito:** Justificación documentada en CLAUDE.md para cada claim.

#### Pendiente 4: DOIs sin verificar
- **Descripción:** `HernandezMosqueira2025` y `Ma2025`.
- **Tipo:** Deuda técnica / Bibliografía.
- **Complejidad:** Baja.

#### Pendiente 5: og-image — Rejilla decorativa 10×5 → 15×5
- **Tipo:** Mejora visual / SEO.
- **Complejidad:** Media (diseño, no hay generador en el repo).

#### Pendiente 6: Escáner — Excluir snapshots propios del conteo
- **Descripción:** Parchear `00_escanear_proyecto.R` para excluir `2*_estructura.{md,txt}` del árbol y del conteo.
- **Tipo:** Deuda técnica / Build.
- **Complejidad:** Baja (~10 min).
- **Criterio de éxito:** Dos corridas consecutivas producen el mismo total de archivos.

### 11.2 Evaluación de deuda técnica

- **Tooltip hover en móvil:** D-hover actual tiene `display: none` en ≤600px. En móvil no existe la funcionalidad de definiciones. D-click (Pendiente 1) resuelve esto estructuralmente.
- **Scripts Python con str.replace hardcodeado:** Patrón frágil demostrado en esta sesión. Preferir herramienta str_replace de Claude Code.

### 11.3 Auditoría de cierre

- ¿Cada bloque de transformación tiene un check de validación? (C.8) → **Sí** — assert pre-push limpio.
- ¿Los outputs son reproducibles e idempotentes? (C.2, C.3) → **Sí** — `./00_build.sh` reproduce `index.html` desde fuentes.
- ¿Hay decisiones metodológicas documentadas? (C.11) → **Sí** — sección 8 de este traspaso.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **D-click** (Pendiente 1) — mayor impacto UX; `app.js` y `styles.css` recién modificados, momento natural.
2. **D-visual** (Pendiente 2) — continúa el mismo pase visual; mismos archivos.
3. **Escáner fix** (Pendiente 6) — trivial, limpia el ruido del conteo.
4. **DOIs** (Pendiente 4) — baja complejidad, cierra deuda de v12.

**Diferir:** no_ref-review (sesión dedicada), og-image (pase de diseño).

---

## 12. Instrucciones específicas para la próxima sesión

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
- 🔒 `DIM_DESCRIPTIONS` en `app.js` — definiciones embebidas ahí; `definiciones_dimensiones.md` es el documento-fuente.
- 🔒 El topbar tiene ahora 3 hijos flex: `.topbar-left`, `nav.tabs`, `.topbar-right`. No volver a meter `nav.tabs` dentro de `.topbar-left`.

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

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 16 (Sonnet)`

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos de la sesión anterior.
>
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
- `traspaso-cierre-v15.md`

**Output del escáner (adjuntar al nuevo chat):**
- `30_documentacion/estructura/estructura_actual.md`

**Archivos del proyecto críticos para retomar:**
- `10_fuentes/app.js` — foco de la próxima sesión (D-click, D-visual)
- `10_fuentes/styles.css` — foco de la próxima sesión (D-click, D-visual)
- `10_fuentes/data/metadata.json` — si la sesión incluye D-visual (mapeo dimensión→bloque)

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
