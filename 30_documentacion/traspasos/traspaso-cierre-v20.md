# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v20
- **Fecha:** 2026-06-26
- **Sesión:** 20 — CLAUDE.md consolidado; residuos v18 corregidos; 4 prompts de búsqueda no_ref; tipografía unificada; escáner actualizado.
- **Modelo utilizado:** Claude Sonnet 4.6
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)

---

## 1. Resumen ejecutivo

La sesión 20 abordó cinco bloques. Primero, consolidación del CLAUDE.md: el stub de la raíz fue reemplazado por un CLAUDE.md unificado y actualizado, y el `30_documentacion/activa/CLAUDE.md` fue eliminado. Segundo, cierre de deuda documental: residuos stale del traspaso v18 corregidos con str_replace quirúrgico. Tercero, avance en el no_ref-review: los 14 claims auditados; 10 confirmados sin observación, 4 con búsqueda pendiente — 4 prompts generados. Cuarto, mejora UI: escala tipográfica de 11 a 6 niveles (+1–1.5px) y `--content-width` ampliado de 700 a 860px. Quinto, escáner actualizado: reemplazado por versión con escritura atómica, poda automática (retención 2 sellos) y marcadores de raíz adaptados; snapshots históricos limpiados manualmente. Todo publicado en `origin/main` (`baa2d84`).

---

## 2. Estado al cierre

**Funciona:**
- Sitio publicado en https://tomgc.github.io/crianza_y_pantallas/ (commit `baa2d84`).
- Corpus: 255 bib / 240 claims / 14 no_ref / 0 huérfanos / 0 duplicados.
- CLAUDE.md unificado en raíz; `30_documentacion/activa/CLAUDE.md` eliminado.
- Traspaso v18 corregido.
- Tipografía: 6 niveles, body 14px, celdas 11.5px, ficha-title 18px.
- `--content-width`: 860px; panel ficha: 420px.
- Escáner: escritura atómica, poda automática a 2 sellos, funcionando.
- Working tree limpio, `origin/main` sincronizado.

**Pendiente / deuda conocida:**
- 4 claims no_ref con búsqueda bibliográfica pendiente (prompts generados, no ejecutados).
- `comportamiento-ninez-media[2]`: claim posiblemente reformulable según resultado de búsqueda.
- `creatividad-preadolescencia[1]`: dirección del claim a confirmar con evidencia.
- CNTV2023: entrada bib huérfana, decisión de integración diferida.
- Spot-check bib grupos `school`, `chile`, `intl`: diferido desde v19.

**Delta respecto a v19:**
- `CLAUDE.md` (raíz): reemplazado (+195 líneas).
- `30_documentacion/activa/CLAUDE.md`: eliminado (−86 líneas).
- `30_documentacion/traspasos/traspaso-cierre-v18.md`: 2 correcciones quirúrgicas.
- `10_fuentes/styles.css`: 194 cambios de valores tipográficos y de layout.
- `00_escanear_proyecto.R`: reemplazado por versión con escritura atómica y poda.
- `30_documentacion/estructura/`: snapshots históricos limpiados; 2 sellos retenidos.
- `index.html`: regenerado por build.

---

## 3. Registro detallado de cambios

### Cambio 1 — Corrección de residuos stale en traspaso v18
- **Archivos:** `30_documentacion/traspasos/traspaso-cierre-v18.md`
- **Categoría:** Documentación
- **Qué:** typeLabels marcado como resuelto; delta vs v17 completado con Baumgartner2014 y typeLabels.
- **Commit:** `7573363`.

### Cambio 2 — Consolidación de CLAUDE.md en la raíz
- **Archivos:** `CLAUDE.md` (raíz, modificado), `30_documentacion/activa/CLAUDE.md` (eliminado)
- **Categoría:** Documentación / gobernanza del repo
- **Qué:** Stub de otro proyecto reemplazado por CLAUDE.md unificado para Crianza y Pantallas. Contiene: idioma/estilo, descripción, estructura, build, Git, reglas de datos, assert, convenciones, política no_ref (14 claims), archivos de referencia.
- **Verificación:** Claude Code internalizó correctamente ("8 reglas activas, idioma tuteo, sin voseo").
- **Commit:** `7573363`.

### Cambio 3 — Auditoría no_ref + 4 prompts de búsqueda
- **Archivos:** ninguno modificado en el corpus
- **Categoría:** Editorial / bibliografía
- **Qué:** 14 claims auditados; 10 confirmados. 4 prompts generados como archivos temporales (no versionados):
  - `busqueda_covisionado_preescolar.md` → `cognicion-preescolar[2]`
  - `busqueda_tecnedu_ninez_media.md` → `cognicion-ninez-media[1]`
  - `busqueda_videojuegos_atencion.md` → `comportamiento-ninez-media[2]`
  - `busqueda_redes_creatividad_preadolescencia.md` → `creatividad-preadolescencia[1]`

### Cambio 4 — Escala tipográfica y responsividad
- **Archivos:** `10_fuentes/styles.css`, `index.html`
- **Categoría:** UI/UX
- **Qué:** 11 tamaños → 6 niveles (+1–1.5px). `--content-width` 700→860px, ficha 380→420px, breakpoint 1100px. Build verificado, aprobado visualmente.
- **Commit:** `a11b717`.

### Cambio 5 — Escáner actualizado + limpieza de snapshots
- **Archivos:** `00_escanear_proyecto.R`, `30_documentacion/estructura/`
- **Categoría:** Infraestructura / documentación
- **Qué:** Escáner reemplazado por versión con escritura atómica, poda automática (retención 2 sellos), marcadores de raíz `00_build.sh` + `index.html`, ruta `30_documentacion/estructura`. Snapshots históricos (~30 pares) limpiados manualmente; quedaron 2 sellos. Poda automática verificada en primera corrida post-reemplazo.
- **Commit:** `baa2d84`.

---

## 4. Bugs de la sesión

Ninguno.

---

## 5. Aprendizajes y restricciones descubiertas

### R1 — Archivos: Tomás reemplaza manualmente
No generar comandos `cp ~/Downloads/...`. Indicar que descargue y reemplace; luego ejecutar build o script.

### R2 — `head -n -2` no funciona en macOS/BSD
Usar `tail -r | tail -n +3` para omitir los N últimos en orden inverso.

### R3 — Claude Code vosea por defecto
Incluir la regla de tuteo explícitamente en el mensaje de apertura de cada sesión Claude Code.

---

## 6. Decisiones de diseño

### D1 — 6 niveles tipográficos
body 14px base; celdas 11.5px; ficha-title 18px; page-title 23px. Tensión legibilidad/densidad resuelta manteniendo celdas en 11.5px.

### D2 — content-width 860px
Punto medio entre 800px (conservador) y 900px (líneas muy largas).

### D3 — CLAUDE.md unificado en raíz
`30_documentacion/activa/CLAUDE.md` eliminado para evitar dos fuentes de verdad.

### D4 — Escáner con retención 2 sellos
Suficiente para comparar estado anterior vs. actual. Los traspasos son la fuente histórica real; los snapshots de estructura son desechables.

---

## 7. Constantes y parámetros vigentes

| Constante | Valor | Archivo | Nota |
|---|---|---|---|
| `--content-width` | 860px | styles.css | Ampliado esta sesión |
| Panel ficha | 420px | styles.css | Ampliado esta sesión |
| `body font-size` | 14px | styles.css | Subido esta sesión |
| `RETENER_SNAPSHOTS` | 2 | 00_escanear_proyecto.R | Nuevo esta sesión |
| Corpus bib | 255 | bibliografia.json | Sin cambios |
| Claims totales | 240 | claims.json | Sin cambios |
| no_ref activos | 14 | claims.json / CLAUDE.md | Sin cambios |
| Commit HEAD | baa2d84 | origin/main | Al cierre |

---

## 8. Arquitectura de archivos

Referencia: escáner `20260626_173825_estructura.md`. Sin cambios estructurales respecto a v19. Cambios de contenido: `00_escanear_proyecto.R` reemplazado; `30_documentacion/activa/CLAUDE.md` eliminado.

---

## 9. Pendientes y ruta sugerida

### P1 — Ejecutar 4 búsquedas bibliográficas no_ref (Media)
- **Qué:** Correr los 4 prompts en chats dedicados y traer resultados.
- **Targets:** `cognicion-preescolar[2]`, `cognicion-ninez-media[1]`, `comportamiento-ninez-media[2]`, `creatividad-preadolescencia[1]`.
- **Tipo:** Bibliografía / editorial
- **Precauciones:** Assert de integridad antes de commit. Verificar colisión de IDs antes de insertar entradas nuevas.
- **Criterio de éxito:** Cada claim tiene veredicto (mantener no_ref / referenciar / reformular).

### P2 — Integrar resultados de búsquedas (depende de P1)
- **Qué:** Actualizar claims.json y/o bibliografia.json según veredictos.
- **Precauciones:** Si `comportamiento-ninez-media[2]` debe reformularse, redactar nuevo texto antes de commitear.

### P3 — CNTV2023 huérfana (Baja)
- **Qué:** Decidir integración a algún claim de contexto Chile o eliminar del corpus.

### P4 — Spot-check bib grupos restantes (Baja)
- **Qué:** Revisión manual de grupos `school`, `chile`, `intl`. Diferido desde v19.

---

## 10. Instrucciones específicas para la próxima sesión

⚠️ NO editar `metadata.json` con `json.dump` — siempre str_replace quirúrgico.
⚠️ NO usar campo `flags` en claims — las advertencias van en el texto.
⚠️ NO agregar entradas bib sin verificar `type` en `biblioTypes` y `group` en `biblioGroups`. El campo `year` no existe.
⚠️ NO citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
⚠️ NO usar umbral de "86 min" en claims COT20s.
⚠️ NO editar `index.html` directamente. Shell HTML va en `template.html`.
⚠️ ANTES de integrar batch nuevo, verificar `summary`/`intro`/`certainty` en cada celda nueva.
⚠️ ANTES de editar `app.js`, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar `2` y `0`.
⚠️ ANTES de commit con cambios en bib o claims, correr el assert de integridad.
✅ ANTES de pushear, mostrar `git status` y esperar confirmación explícita.
🔒 Commits directos a `main` (sin ramas de feature).
🔒 Build (`./00_build.sh`) obligatorio antes de cualquier commit que toque `10_fuentes/`.
🔒 Claude Code: responder en español latinoamericano con tuteo. Incluir la regla en el mensaje de apertura.
🔒 Tomás reemplaza archivos manualmente — no generar comandos `cp ~/Downloads/...`.

---

## 11. Backlog acumulativo

### Objetivo del proyecto
Sitio web estático (HTML/CSS/JS vanilla + JSON) que sintetiza evidencia científica peer-reviewed sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz 15×5 (dimensiones × tramos etarios). Público objetivo: padres y madres en Chile. Publicado en GitHub Pages. Desarrollado desde 2025 por Tomás, con Claude como par de análisis y generación, y Claude Code como ejecutor.

### Nota metodológica
Un "cambio" es una solicitud distinguible del usuario, no las acciones técnicas que la implementan. No cuentan: errores del asistente corregidos de inmediato. Sí cuentan: bugfixes reportados por el usuario. Clasificación por intención primaria.

### Clasificación temática

| Categoría | N° | % | Descripción |
|---|---|---|---|
| Bibliografía | 72 | 27% | Integración, corrección y gestión del corpus de referencias |
| UI/UX | 49 | 19% | Diseño visual, layout, interacciones, responsive |
| Claims / contenido | 42 | 16% | Redacción, reformulación y auditoría de claims |
| Infraestructura JS | 35 | 13% | app.js, glosario, funcionalidades del sitio |
| Documentación | 30 | 11% | Traspasos, CLAUDE.md, prompts, flujos, escáner |
| Build / deploy | 18 | 7% | Pipeline de build, GitHub Pages, og-image |
| Datos / esquema | 12 | 5% | metadata.json, estructura de JSON, esquema |
| Infraestructura R | 2 | 1% | Escáner, herramientas del repo |

### Resumen estadístico por sesión

| Sesión | Traspaso | Cambios | Modelo | Foco |
|---|---|---|---|---|
| 1–14 | v01–v14 | ~195 | Sonnet 4.6 / Opus 4.6 | Construcción del sitio, corpus inicial, UI base |
| 15 | v15 | 12 | Opus 4.8 | D-click, D-visual, og-image 15×5, topbar |
| 16 | v16 | 9 | Opus 4.8 | Limpieza bib (HernandezMartinez, Essex, Christakis2013) |
| 17 | v17 | 7 | Opus 4.8 | Spot-check bib, P7, escáner, 15×5 en docs |
| 18 | v18 | 8 | Opus 4.8 | Baumgartner2014, typeLabels fix, og-image update |
| 19 | v19 | 6 | Opus 4.8 | Spot-check journals, papers/, Hysing2015, CNTV2023 |
| 20 | v20 | 5 | Sonnet 4.6 | CLAUDE.md, residuos v18, prompts no_ref, tipografía, escáner |
| **Total** | | **~242** | | |

### Detalle cronológico — Sesión 20

**C238 — Corrección residuos stale traspaso v18**
Dos str_replace: typeLabels marcado resuelto; delta completado con Baumgartner2014. Commit `7573363`.

**C239 — Consolidación CLAUDE.md en raíz**
Stub reemplazado por CLAUDE.md unificado. `30_documentacion/activa/CLAUDE.md` eliminado. Commit `7573363`.

**C240 — Auditoría no_ref + 4 prompts de búsqueda**
14 claims auditados: 10 confirmados, 4 con búsqueda pendiente. Prompts generados para los 4 claims. No genera commit.

**C241 — Escala tipográfica y responsividad**
11 tamaños → 6 niveles (+1–1.5px). `--content-width` 700→860px, ficha 380→420px. Commit `a11b717`.

**C242 — Escáner actualizado + limpieza de snapshots**
Escáner reemplazado (escritura atómica, poda 2 sellos, marcadores adaptados). ~30 pares históricos limpiados. Commit `baa2d84`.

---

## 12. Reapertura

**Nombre del chat:** `Crianza y Pantallas, sesión 21 (Sonnet 4.6)`

**Mensaje de apertura:**
> Continuación de sesión sobre el proyecto Crianza y Pantallas.
> Tipo: CONTINUATION. Los documentos de protocolo (POLITICA_PROYECTO.md, SETTINGS_Y_PROMPTS_OPERACIONALES.md) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso v20 y el escáner actual.
> ⚠️ ANTES de editar `app.js`, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar 2 y 0.
> ⚠️ NO editar `metadata.json` con `json.dump` — siempre str_replace quirúrgico.
> ⚠️ NO usar campo `flags` en claims.
> ⚠️ NO agregar entradas bib sin verificar type en biblioTypes y group en biblioGroups. El campo `year` no existe.
> ⚠️ NO citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
> ⚠️ NO usar umbral de "86 min" en claims COT20s.
> ⚠️ NO editar `index.html` directamente.
> ⚠️ ANTES de integrar batch nuevo, verificar summary/intro/certainty en cada celda nueva.
> ⚠️ Claude Code debe responder en español latinoamericano con tuteo (sin voseo).

**Documentos para la próxima sesión:**

1. *Protocolo en knowledge base (no adjuntar):* `POLITICA_PROYECTO.md`, `SETTINGS_Y_PROMPTS_OPERACIONALES.md`.

2. *Opcionales según foco:* `CLAUDE.md` si la sesión corre en Claude Code.

3. *Específicos (adjuntar):*
   - `traspaso-cierre-v20.md` (este archivo)
   - `30_documentacion/estructura/estructura_actual.md` (escáner al cierre)
   - Si hay resultados de búsquedas no_ref: los archivos de resultados correspondientes.
