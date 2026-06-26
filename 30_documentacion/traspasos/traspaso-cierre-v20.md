# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v20
- **Fecha:** 2026-06-26
- **Sesión:** 20 — CLAUDE.md consolidado; residuos v18 corregidos; 4 prompts de búsqueda no_ref; tipografía unificada y responsividad ampliada.
- **Modelo utilizado:** Claude Sonnet 4.6
- **Entorno:** Web (HTML/CSS/JS estático, GitHub Pages)

---

## 1. Resumen ejecutivo

La sesión 20 abordó cuatro bloques. Primero, consolidación del CLAUDE.md: el stub de la raíz (de otro proyecto) fue reemplazado por un CLAUDE.md unificado y actualizado para Crianza y Pantallas, y el `30_documentacion/activa/CLAUDE.md` fue eliminado. Segundo, cierre de deuda documental: los residuos stale del traspaso v18 (typeLabels listado como deuda abierta y delta incompleto) fueron corregidos con str_replace quirúrgico. Tercero, avance en el no_ref-review: los 14 claims `no_ref: true` fueron auditados; 10 confirmados sin observación y 4 identificados como candidatos a búsqueda bibliográfica — se generaron 4 prompts de búsqueda autocontenidos listos para usar. Cuarto, mejora UI: escala tipográfica racionalizada de 11 a 6 niveles (+1–1.5px en promedio) y `--content-width` ampliado de 700 a 860px, con panel ficha aumentado a 420px y nuevo breakpoint a 1100px. Todo publicado en `origin/main` (`a11b717`).

---

## 2. Estado al cierre

**Funciona:**
- Sitio publicado en https://tomgc.github.io/crianza_y_pantallas/ (commit `a11b717`).
- Corpus: 255 bib / 240 claims / 14 no_ref / 0 huérfanos / 0 duplicados.
- CLAUDE.md unificado en raíz (7573363), `30_documentacion/activa/CLAUDE.md` eliminado.
- Traspaso v18 corregido (commit `94c2032` → amendeado a `7573363`).
- Tipografía: 6 niveles estandarizados, body 14px, celdas 11.5px, ficha-title 18px.
- `--content-width`: 860px; panel ficha: 420px.

**Pendiente / deuda conocida:**
- `10_fuentes/styles.css.bak` sin commitear (dejar o borrar manualmente).
- 4 claims no_ref con búsqueda bibliográfica pendiente (prompts generados, no ejecutados aún).
- `comportamiento-ninez-media[2]`: claim posiblemente reformulable según resultado de búsqueda.
- `creatividad-preadolescencia[1]`: dirección del claim a confirmar con evidencia.
- CNTV2023: entrada bib huérfana, decisión de integración diferida.
- Spot-check bib grupos `school`, `chile`, `intl`: diferido desde v19.
- Bug `typeLabels` en `app.js` (~L771): resuelto (11/11 tipos). Deuda cerrada.

**Delta respecto a v19:**
- `CLAUDE.md` (raíz): reemplazado completamente (+195 líneas).
- `30_documentacion/activa/CLAUDE.md`: eliminado (−86 líneas).
- `30_documentacion/traspasos/traspaso-cierre-v18.md`: 2 correcciones quirúrgicas.
- `10_fuentes/styles.css`: 194 cambios de valores tipográficos y de layout.
- `index.html`: regenerado por build.

---

## 3. Registro detallado de cambios

### Cambio 1 — Corrección de residuos stale en traspaso v18
- **Archivos:** `30_documentacion/traspasos/traspaso-cierre-v18.md`
- **Categoría:** Documentación / deuda documental
- **Qué:** Dos str_replace quirúrgicos: (1) typeLabels listado como deuda abierta → marcado como resuelto en sesión 18 (commit `ee3e575`); (2) delta vs v17 incompleto → agregados Baumgartner2014 y typeLabels al listado de cambios.
- **Por qué:** El v18 fue escrito con información parcial; los residuos creaban inconsistencia entre el resumen ejecutivo y el delta.
- **Verificación:** Ambos patrones confirmados únicos antes del replace; resultado verificado post-replace.
- **Commit:** `7573363` (amendeado junto con CLAUDE.md).

### Cambio 2 — Consolidación de CLAUDE.md en la raíz
- **Archivos:** `CLAUDE.md` (raíz, modificado), `30_documentacion/activa/CLAUDE.md` (eliminado)
- **Categoría:** Documentación / gobernanza del repo
- **Qué:** Reemplazado el stub de raíz (copiado de otro proyecto, con secciones irrelevantes: datos personales NNA, R, ramas+PR) por un CLAUDE.md unificado específico para Crianza y Pantallas. Eliminado el `activa/CLAUDE.md` redundante.
- **Contenido del nuevo CLAUDE.md:** idioma/estilo, descripción del proyecto, estructura del repo, convención de build, flujo Git, reglas de datos (metadata.json, claims.json, bibliografia.json, app.js, template.html, papers/), assert de integridad copiable, convenciones del sitio, política no_ref actualizada (14 claims, estado 2026-06-02), archivos de referencia.
- **Verificación:** Claude Code lo internalizó correctamente ("8 reglas activas, idioma tuteo, sin voseo").
- **Commit:** `7573363`.

### Cambio 3 — Auditoría no_ref (sin cambios en corpus)
- **Archivos:** ninguno modificado
- **Categoría:** Editorial / bibliografía
- **Qué:** Revisión de los 14 claims `no_ref: true` contra los 4 criterios de la política. 10 confirmados sin observación. 4 identificados como candidatos a búsqueda:
  - `cognicion-preescolar[2]`: co-visionado — posiblemente citable.
  - `cognicion-ninez-media[1]`: tecnología educativa — posiblemente citable.
  - `comportamiento-ninez-media[2]`: videojuegos acción vs. video pasivo — comparación sin soporte directo confirmado.
  - `creatividad-preadolescencia[1]`: redes pasivas y creatividad — dirección a confirmar.
- **Resultado:** 4 prompts de búsqueda generados como archivos temporales (no versionados).

### Cambio 4 — Escala tipográfica y responsividad
- **Archivos:** `10_fuentes/styles.css`, `index.html` (regenerado)
- **Categoría:** UI/UX / tipografía / layout
- **Qué:** Racionalización de 11 tamaños tipográficos a 6 niveles estandarizados. Ampliación del espacio disponible.
- **Escala nueva:**
  - XS: 11–11.5px (chips, rangos, conteos, leyendas)
  - S: 12–12.5px (evidencia, defs, chile-body, popovers, meta-bib)
  - M: 13–13.5px (tabs, select, intro ficha, bib-title, gl-item, search)
  - Base: 14px (body, text-section-content)
  - L: 15px (brand, section-titles, gl-def)
  - XL: 18px / 23px (ficha-title / page-title)
- **Layout:** `--content-width` 700→860px; panel ficha 380→420px; nuevo breakpoint 1100px; móvil `--content-width: 100%`.
- **Verificación:** Build exitoso, revisión visual aprobada por Tomás.
- **Commit:** `a11b717`.

---

## 4. Bugs de la sesión

Ninguno.

---

## 5. Aprendizajes y restricciones descubiertas

### R1 — Mecánica de descarga de archivos
Tomás reemplaza archivos manualmente desde el link de descarga. No generar comandos `cp ~/Downloads/...`. Indicar solo que descargue y reemplace; luego correr el build.

### R2 — Claude Code vosea por defecto
Claude Code revierte a voseo si no se le instruye explícitamente. Incluir la regla en el mensaje de apertura cuando se inicie sesión en Claude Code. (Agregado a memoria del Project.)

---

## 6. Decisiones de diseño

### D1 — 6 niveles tipográficos en lugar de 11
Alternativas consideradas: (a) subir body a 15px con ajustes proporcionales — descartado por riesgo de colapso en celdas de la matriz; (b) escala propuesta de 6 niveles — adoptada. Tensión resuelta: legibilidad vs. densidad de información en la matriz. La celda en 11.5px mantiene la información visible sin fragmentar la grilla.

### D2 — content-width 860px
Alternativas: 800px (conservador) vs. 900px (más amplio). Adoptado 860px como punto medio que aprovecha pantallas medianas sin crear líneas demasiado largas en texto corrido.

### D3 — CLAUDE.md unificado en raíz
El `30_documentacion/activa/CLAUDE.md` fue eliminado en lugar de mantenerlo como alias. Razón: dos fuentes de verdad crean confusión sobre cuál está actualizado. La raíz es el lugar canónico que Claude Code lee automáticamente.

---

## 7. Constantes y parámetros vigentes

| Constante | Valor | Archivo | Nota |
|---|---|---|---|
| `--content-width` | 860px | styles.css | Ampliado en esta sesión (era 700px) |
| Panel ficha | 420px | styles.css | Ampliado en esta sesión (era 380px) |
| `body font-size` | 14px | styles.css | Subido en esta sesión (era 13px) |
| Corpus bib | 255 entradas | bibliografia.json | Sin cambios esta sesión |
| Claims totales | 240 | claims.json | Sin cambios esta sesión |
| no_ref activos | 14 | claims.json / CLAUDE.md | Sin cambios esta sesión |
| Commit HEAD | a11b717 | origin/main | Al cierre |

---

## 8. Arquitectura de archivos

Referencia: escáner `20260626_172418_estructura.md`. Sin cambios estructurales respecto a v19. Adiciones:
- `10_fuentes/styles.css.bak` — backup local, no versionado, puede borrarse.

---

## 9. Pendientes y ruta sugerida

### P1 — Ejecutar 4 búsquedas bibliográficas no_ref (Media)
- **Qué:** Correr los 4 prompts generados en esta sesión en chats dedicados y traer resultados.
- **Prompts:** `busqueda_covisionado_preescolar.md`, `busqueda_tecnedu_ninez_media.md`, `busqueda_videojuegos_atencion.md`, `busqueda_redes_creatividad_preadolescencia.md`.
- **Tipo:** Bibliografía / editorial
- **Impacto:** Hasta 4 claims podrían pasar de `no_ref: true` a referenciados, o ser reformulados.
- **Dependencias:** Ninguna técnica; requiere tiempo de búsqueda en chats externos.
- **Complejidad:** Media (búsqueda) + Baja (integración si hay resultados claros).
- **Precauciones:** Aplicar assert de integridad antes de cualquier commit con cambios en bib/claims. Verificar collision de IDs antes de insertar entradas nuevas.
- **Criterio de éxito:** Cada claim tiene veredicto documentado (mantener no_ref / referenciar / reformular).

### P2 — Integrar resultados de búsquedas (Baja-Media, depende de P1)
- **Qué:** Según veredictos de P1, actualizar claims.json y/o bibliografia.json.
- **Tipo:** Bibliografía
- **Precauciones:** Si `comportamiento-ninez-media[2]` debe reformularse (comparación sin soporte), redactar nuevo texto antes de commitear.

### P3 — CNTV2023 huérfana (Baja)
- **Qué:** Decidir si integrar a algún claim de contexto Chile o eliminar del corpus.
- **Tipo:** Editorial
- **Complejidad:** Baja.

### P4 — Spot-check bib grupos restantes (Baja)
- **Qué:** Revisión manual sistemática de grupos `school`, `chile`, `intl`.
- **Tipo:** Calidad bibliográfica
- **Diferido desde:** v19.

### P5 — Borrar styles.css.bak (Trivial)
- **Qué:** `rm /Users/tomgc/Projects/crianza_y_pantallas/10_fuentes/styles.css.bak`
- **Tipo:** Limpieza
- **Criterio:** Confirmar que el sitio se ve bien en producción antes de borrar.

---

## 10. Instrucciones específicas para la próxima sesión

⚠️ NO editar `metadata.json` con `json.dump` — siempre str_replace quirúrgico sobre texto crudo.
⚠️ NO usar campo `flags` en claims — las advertencias van en el texto.
⚠️ NO agregar entradas bib sin verificar `type` en `biblioTypes` y `group` en `biblioGroups`. El campo `year` no existe en el esquema.
⚠️ NO citar cuantitativo de `Chen2024`/`Xiao2025` sin texto completo.
⚠️ NO usar umbral de "86 min" en claims COT20s.
⚠️ NO editar `index.html` directamente. Shell HTML va en `template.html`.
⚠️ ANTES de integrar batch nuevo, verificar `summary`/`intro`/`certainty` en cada celda nueva.
⚠️ ANTES de editar `app.js`, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar `2` y `0`.
⚠️ ANTES de commit con cambios en bib o claims, correr el assert de integridad.
✅ ANTES de pushear, mostrar `git status` y esperar confirmación explícita.
🔒 Commits directos a `main` (sin ramas de feature).
🔒 Build (`./00_build.sh`) obligatorio antes de cualquier commit que toque `10_fuentes/`.
🔒 Claude Code: responder en español latinoamericano con tuteo. Si vosea, recordarle la regla.

---

## 11. Backlog acumulativo

### Objetivo del proyecto
Sitio web estático (HTML/CSS/JS vanilla + JSON) que sintetiza evidencia científica peer-reviewed sobre el impacto del uso de pantallas en el desarrollo infantil (0–12 años), organizada en una matriz 15×5 (dimensiones × tramos etarios). Público objetivo: padres y madres en Chile. Publicado en GitHub Pages. Desarrollado desde 2025 por Tomás, con Claude como par de análisis y generación, y Claude Code como ejecutor.

### Nota metodológica
Un "cambio" es una solicitud distinguible del usuario, no las acciones técnicas que la implementan. No cuentan: errores del asistente corregidos de inmediato. Sí cuentan: bugfixes reportados por el usuario. Clasificación por intención primaria.

### Clasificación temática

| Categoría | N° | % | Descripción |
|---|---|---|---|
| Bibliografía | 72 | 28% | Integración, corrección y gestión del corpus de referencias |
| UI/UX | 48 | 19% | Diseño visual, layout, interacciones, responsive |
| Claims / contenido | 42 | 16% | Redacción, reformulación y auditoría de claims |
| Infraestructura JS | 35 | 14% | app.js, glosario, funcionalidades del sitio |
| Documentación | 28 | 11% | Traspasos, CLAUDE.md, prompts, flujos |
| Build / deploy | 18 | 7% | Pipeline de build, GitHub Pages, og-image |
| Datos / esquema | 12 | 5% | metadata.json, estructura de JSON, esquema |

### Resumen estadístico por sesión

| Sesión | Traspaso | Cambios | Modelo | Foco |
|---|---|---|---|---|
| 1–14 | v01–v14 | ~195 | Sonnet 4.6 / Opus 4.6 | Construcción del sitio, corpus inicial, UI base |
| 15 | v15 | 12 | Opus 4.8 | D-click, D-visual, og-image 15×5, topbar |
| 16 | v16 | 9 | Opus 4.8 | Limpieza bib (HernandezMartinez, Essex, Christakis2013) |
| 17 | v17 | 7 | Opus 4.8 | Spot-check bib, P7, escáner, 15×5 en docs |
| 18 | v18 | 8 | Opus 4.8 | Baumgartner2014, typeLabels fix, og-image update |
| 19 | v19 | 6 | Opus 4.8 | Spot-check journals, papers/, Hysing2015, CNTV2023 |
| 20 | v20 | 4 | Sonnet 4.6 | CLAUDE.md, residuos v18, prompts no_ref, tipografía |
| **Total** | | **~241** | | |

### Detalle cronológico — Sesión 20

**C238 — Corrección residuos stale traspaso v18**
Dos str_replace quirúrgicos: typeLabels marcado como resuelto; delta vs v17 completado con Baumgartner2014 y typeLabels. Commit `7573363`.

**C239 — Consolidación CLAUDE.md en raíz**
Stub de otro proyecto reemplazado por CLAUDE.md unificado para Crianza y Pantallas. `30_documentacion/activa/CLAUDE.md` eliminado. Commit `7573363`.

**C240 — Auditoría no_ref + 4 prompts de búsqueda**
14 claims auditados: 10 confirmados, 4 con búsqueda pendiente. Prompts generados para `cognicion-preescolar[2]`, `cognicion-ninez-media[1]`, `comportamiento-ninez-media[2]`, `creatividad-preadolescencia[1]`. No genera commit (archivos temporales).

**C241 — Escala tipográfica y responsividad**
11 tamaños → 6 niveles (+1–1.5px). `--content-width` 700→860px, ficha 380→420px, breakpoint 1100px. Build + commit `a11b717` + push.

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
   - Si hay resultados de búsquedas: los archivos de resultados correspondientes.
