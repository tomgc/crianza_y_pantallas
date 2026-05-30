# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v08
- **Fecha:** 2026-05-30
- **Sesión:** 8 — Estandarización visual de anchos y acumulación de backlog UI
- **Modelo utilizado:** Claude Sonnet 4.6
- **Entorno:** Web estático (HTML/CSS/JS, GitHub Pages)
- **Archivos principales modificados:** `10_fuentes/styles.css`, `index.html`

---

## 2. Resumen ejecutivo

La sesión 8 tuvo dos focos: implementar la estandarización visual de anchos entre vistas (único cambio de código efectivo) y acumular un backlog estructurado de mejoras UI identificadas durante la revisión del sitio en producción. El cambio técnico fue quirúrgico: se introdujeron tres variables CSS (`--content-width: 700px`, `--page-pad-x: 32px`, `--page-pad-y: 28px`) en `:root` que unificaron el ancho y padding de Bibliografía, Metodología, Limitaciones y Glosario-ficha, que antes tenían valores hardcodeados distintos (920px, 560px, doble max-width anidado). La Matriz quedó intacta. La rama `refactor/modular-build` fue eliminada tras verificar que todos sus commits estaban en `main`. El repo quedó con un solo branch sincronizado en `ed11ea2`. No se tocaron datos, lógica de negocio ni archivos JS. Los pendientes P1–P8 del traspaso anterior siguen abiertos y se amplían con ocho nuevos ítems de UI identificados en esta sesión. Se estableció también la regla permanente de que los traspasos se generan en el chat web, no en Claude Code (Claude Code no puede acceder a la knowledge base del Project).

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Sitio en vivo en `https://tomgc.github.io/crianza_y_pantallas/` — `main` en `ed11ea2`.
- Pipeline modular completo: build reproducible desde JSONs vía `./00_build.sh`.
- Matriz 10×5: 50 celdas, 133 claims, chips `[ref]` navegables, popovers bibliográficos.
- Glosario interactivo modo matriz: 22 términos, 10 dimensiones, ficha con definición, "Por qué importa", celdas, papers, relacionados.
- Bibliografía filtrable: 74 entradas, búsqueda por autor/título/revista, filtros por tipo.
- Vistas secundarias (Bibliografía, Metodología, Limitaciones, Glosario-ficha) con ancho unificado 700px.
- Responsive: scroll horizontal en grilla móvil; ficha en columna única bajo 960px.

### Qué no funciona / deuda conocida

- **Override de padding en glosario móvil:** `.gl-ficha-pane` en `@media (max-width: 960px)` tiene `padding-bottom: 32px` hardcodeado vs. `40px` del sistema de variables. Solo afecta móvil, no desktop.
- **66 claims con `refs=[]`:** sin política `"no_ref": true`, cualquier validación reporta falsos positivos.
- **Dos fuentes bibliográficas paralelas:** `window.GLOSARIO.BIBLIO` (9 entradas) vs. `window.__DATA__.bibliografia` (74 entradas). No bloqueante pero puede divergir.

### Qué cambió respecto al traspaso v07

| Aspecto | v07 | v08 |
|---|---|---|
| Ancho vistas secundarias | Valores hardcodeados distintos (920px biblio, 560px glosario-ficha) | Variable `--content-width: 700px` unificada |
| `.page-body` | Segundo max-width anidado (680px) en Metodología/Limitaciones | Eliminado |
| `.text-section-title` | 14.5px | 14px (igualado a `.biblio-group-title`) |
| Sistema de padding | Valores hardcodeados por componente | Variables `--page-pad-x` / `--page-pad-y` |
| Responsive padding | `.page-pane { padding: 18px 16px 32px }` | Override de variables en `:root` dentro de media 960px |
| Rama `refactor/modular-build` | Activa (local + remota, en `3a35358`) | Eliminada (ancestro completo de `main` verificado) |
| Traspaso v07 | Untracked | Commiteado (`ed11ea2`) |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Variables CSS de layout unificadas

- **Archivo:** `10_fuentes/styles.css`
- **Categoría:** Estandarización visual
- **Qué se hizo:** Se agregaron `--content-width: 700px`, `--page-pad-x: 32px`, `--page-pad-y: 28px` al bloque `:root`. `.page-pane` y `.gl-ficha-pane` usan las variables via `padding: var(--page-pad-y) var(--page-pad-x) 40px`. `.gl-ficha` cambió de `max-width: 560px` a `max-width: var(--content-width)`. `.page-pane` cambió de `max-width: 920px` a `max-width: var(--content-width)`. `.page-body` eliminado (segundo max-width anidado). `.text-section-title` igualado a 14px. Override de variables en `:root { --page-pad-x: 18px; --page-pad-y: 20px; }` dentro de `@media (max-width: 960px)`. Regla redundante `.page-pane { padding: 18px 16px 32px }` eliminada del media query.
- **Por qué:** Las vistas secundarias tenían valores hardcodeados distintos sin sistema compartido. Bibliografía/Metodología/Limitaciones: 920px. Glosario-ficha: 560px. Metodología/Limitaciones además tenían un `.page-body` de 680px anidado, haciéndolas visualmente más angostas que Bibliografía a pesar de usar el mismo `.page-pane`.
- **Cómo se verificó:** Build OK (`index.html` 5456 líneas, exit code 0). Revisión manual del CSS resultante confirmando ausencia de valores viejos.
- **Commit:** `e43cbe5`
- **Dependencias:** Ninguna fuera de `styles.css`. La Matriz no fue tocada.
- **Tensiones:** Ninguna. La Matriz tiene lógica de grilla distinta y no debía adoptar max-width de texto.

#### Cambio 2: Traspaso v07 commiteado

- **Archivo:** `30_documentacion/traspasos/traspaso-cierre-v07.md`
- **Categoría:** Documentación / gobernanza
- **Qué se hizo:** Archivo trackeado y commiteado. Estaba untracked al abrir la sesión.
- **Commit:** `ed11ea2`

#### Cambio 3: Rama refactor/modular-build eliminada

- **Categoría:** Infraestructura / gobernanza
- **Qué se hizo:** `git branch -D refactor/modular-build` (force-delete seguro, verificado que era ancestro completo de `main`) + `git push origin --delete refactor/modular-build`.
- **Por qué:** La rama cumplió su ciclo. Todos sus commits estaban en `main`. Dejarla activa generaba confusión de flujo. El `-d` seguro falló porque el tracking remoto estaba stale; se verificó con `git log main..refactor/modular-build` (vacío) antes de forzar.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020–2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON vía `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1–4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación.*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~16% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~12% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Limpieza editorial | ~23 | ~14% | Eliminación de citas inline, expansión de siglas, corrección de textos |
| Corrección de integridad bibliográfica | ~14 | ~9% | Huérfanas, mismatches, refs vacíos, mismatch de edad |
| Incorporación de evidencia | 13 | ~8% | Sesión 4: 13 papers + 27 ediciones + 1 corrección epistémica |
| Diseño visual y UX | ~21 | ~13% | Wireframe B, paleta, responsive, estilos glosario, estandarización de anchos |
| Implementación de motor JS | ~14 | ~9% | `app.js`, render, panel lateral, popovers, deep linking; glosario interactivo |
| Bibliografía y popovers | ~7 | ~4% | Diseño del popover, navegación, filtros |
| Infraestructura / herramientas operativas | ~9 | ~6% | Escáner, flujo de incorporación, prompts modulares, publicación, build |
| Documentación / gobernanza | ~9 | ~6% | CLAUDE.md, README, convenciones, traspasos, rama eliminada |
| Andamiaje entre celdas | ~5 | ~3% | Cascadas entre celdas |
| Corrección factual | ~2 | ~1% | 5 Cs AAP, certeza de la evidencia |

**Total estimado: ~162**

### 5.4 Resumen estadístico por sesión

| Sesión | Traspaso | N° cambios | Modelo | Foco principal |
|---|---|---|---|---|
| 1 | v01 | ~30 | Sonnet/Opus | Wireframe inicial React standalone |
| 2 | v02 | ~35 | Opus | Migración a estructura modular |
| 3 | v03 | ~35 | Opus | Build reproducible, JSONs validados, Fase 0–3 |
| entre 3–4 | — | ~3 | Sonnet | Fase 4 app.js, UX fix |
| 4 | v04 | 6 (con 27 sub-ediciones) | Opus | Bibliografía + prompts modulares |
| 5 | v05 | ~20 | Sonnet 4.6 | Infraestructura, limpieza editorial, integridad bibliográfica |
| 6 | v06 | ~17 | Sonnet 4.6 | Integridad bibliográfica, glosario, publicación |
| 7 | v07 | ~12 | Sonnet 4.6 | Responsive + glosario interactivo modo matriz |
| 8 | v08 | ~4 | Sonnet 4.6 | Estandarización de anchos + backlog UI |

**Total acumulado: ~162 cambios.**

### 5.5 Detalle cronológico de cambios por sesión

### Sesiones 1–5 — ver traspaso v05 (ítems 1–22)

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v05.md`, sección 5.5.)*

---

### Sesión 6 (Sonnet 4.6) — 2026-05-29

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v06.md`, sección 5.5, ítems 23–39.)*

---

### Sesión 7 (Sonnet 4.6) — 2026-05-29

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v07.md`, sección 5.5, ítems 40–50.)*

---

### Sesión 8 (Sonnet 4.6) — 2026-05-30

Estandarización visual de anchos y acumulación de backlog UI.

51. Variables CSS `--content-width: 700px`, `--page-pad-x: 32px`, `--page-pad-y: 28px` introducidas en `:root`. `.page-pane` y `.gl-ficha-pane` usan las variables. `.gl-ficha` cambió de 560px a `var(--content-width)`. `.page-pane` cambió de 920px a `var(--content-width)`. `.page-body` eliminado. `.text-section-title` igualado a 14px. Override de variables en media query 960px.
52. Traspaso v07 commiteado (`ed11ea2`).
53. Rama `refactor/modular-build` eliminada local y remota (verificado ancestro completo de `main`).

---

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron 3 cambios nuevos correspondientes a la sesión 8 (ítems 51–53).
- "Diseño visual y UX" creció de ~18 a ~21 por la estandarización de anchos.
- "Documentación / gobernanza" creció de ~8 a ~9 por la eliminación de la rama.
- Se estableció regla operativa nueva: los traspasos se generan en el chat web, no en Claude Code.

---

## 6. Bugs encontrados y su resolución

No se encontraron bugs nuevos en esta sesión. El override de padding del glosario en móvil (`.gl-ficha-pane` en media 960px con `padding-bottom: 32px` hardcodeado) fue identificado pero no corregido — queda como deuda menor.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Los traspasos de sesión se generan en el chat web, no en Claude Code.
  - **Principio:** C.11 (trazabilidad / documentación accesible).
  - **Contexto:** Claude Code no puede acceder a la knowledge base del Project. Los traspasos generados allí no pueden referenciar ni leer los documentos de protocolo canónicos. El chat web tiene acceso completo a la KB y puede producir el `.md` como artefacto descargable.
  - **Ejemplo:** En esta sesión se intentó generar el v08 desde Claude Code y no fue posible completarlo correctamente.

- **Regla:** Las variables CSS redefinidas en `@media` deben vivir dentro de un selector (`:root { }`) dentro del bloque, no como declaraciones sueltas.
  - **Principio:** C.7 (portabilidad / CSS válido).
  - **Contexto:** `--page-pad-x: 18px;` suelto dentro de un `@media` es CSS inválido. La forma correcta es `@media (...) { :root { --page-pad-x: 18px; } }`.

---

## 8. Decisiones de diseño tomadas

No hubo nuevas decisiones arquitectónicas en esta sesión. Se acumularon pendientes de UI que serán decisiones en la próxima sesión.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|---|---|---|---|
| `--content-width` | 700px | `10_fuentes/styles.css` | Nuevo en v08. Aplica a vistas secundarias; Matriz no usa esta variable |
| `--page-pad-x` | 32px (desktop) / 18px (≤960px) | `10_fuentes/styles.css` | Nuevo en v08 |
| `--page-pad-y` | 28px (desktop) / 20px (≤960px) | `10_fuentes/styles.css` | Nuevo en v08 |
| Tramos etarios | 5 (lactante, primera infancia, preescolar, niñez media, preadolescencia) | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Dimensiones | 10 | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Certeza levels | h / m / l | `10_fuentes/data/metadata.json` + `app.js` | Alta/Media/Baja |
| Términos glosario | 22 | `10_fuentes/glosario-data.js` | `window.GLOSARIO` |
| Refs bibliografía principal | 74 | `10_fuentes/data/bibliografia.json` | |
| Refs bibliografía glosario | 9 | `10_fuentes/glosario-data.js` | Fuente paralela — ver deuda técnica |
| URL publicada | `https://tomgc.github.io/crianza_y_pantallas/` | GitHub Pages desde `main` | Activa, en `ed11ea2` |
| Rama de trabajo | `main` directo | Git | Sin rama feature activa al cierre |

---

## 10. Arquitectura de archivos relevante

Referencia: ejecutar `Rscript 00_escanear_proyecto.R` al abrir la próxima sesión.

**Cambios estructurales en esta sesión:**
- `10_fuentes/styles.css` — variables CSS agregadas, valores hardcodeados reemplazados.
- `30_documentacion/traspasos/traspaso-cierre-v07.md` — trackeado.
- Rama `refactor/modular-build` eliminada local y remota.

**Verificación contra política:**
- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Excepción documentada y aceptada (Decisión 1, v05). Ver CLAUDE.md.
- Sin `40_salidas/`: excepción documentada (output es `index.html` en raíz).
- Naming respeta sección 2.3: snake_case, sin tildes/ñ/espacios.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente A: Override de padding glosario móvil
- **Descripción:** `.gl-ficha-pane` en `@media (max-width: 960px)` tiene `padding-bottom: 32px` hardcodeado en lugar de usar la variable. Desajuste menor vs. 40px del resto.
- **Tipo:** Deuda técnica / bug menor.
- **Impacto:** Solo visible en móvil. No afecta layout ni legibilidad.
- **Complejidad:** Baja. Una línea en `styles.css`.
- **Criterio de éxito:** Eliminar la línea `padding: 20px 18px 32px` del override del glosario en media 960px; el sistema de variables cubre el caso.

#### Pendiente B: Subtítulo del sitio debajo del título
- **Descripción:** Agregar debajo del título "Crianza y pantallas" el texto: *"Esta página busca servir como mapa de la evidencia sobre la exposición a pantallas en niños y niñas de 0 a 12 años. Sin prescribir ni alarmar, distingue lo bien establecido de lo que es hipótesis o creencia popular, para acompañar con evidencia las decisiones de padres y madres a lo largo de la infancia."*
- **Tipo:** UI / contenido.
- **Complejidad:** Baja. Requiere `app.js` para ubicar el render del header.
- **Criterio de éxito:** Subtítulo visible en todas las vistas, con tipografía coherente con el sistema.

#### Pendiente C: Bibliografía móvil — filtros sticky
- **Descripción:** En la vista Bibliografía en móvil, los filtros (chips de tipo + buscador) deben quedar fijos al hacer scroll para no perderlos al navegar la lista.
- **Tipo:** UI / UX móvil.
- **Complejidad:** Media. Requiere `styles.css` y posiblemente ajuste en el render de `app.js`.
- **Criterio de éxito:** En viewport móvil, los filtros permanecen visibles al scrollear la lista de referencias.

#### Pendiente D: Glosario móvil — rediseño de índice
- **Descripción:** En móvil, el índice del glosario ocupa demasiado espacio vertical antes de llegar a la ficha. Se necesita una presentación más compacta (colapso de grupos, acordeón, o cambio a vista de lista densa).
- **Tipo:** UI / UX móvil.
- **Complejidad:** Media. Requiere `app.js` (render del índice) + `styles.css`.
- **Criterio de éxito:** En móvil, el usuario llega a la ficha de un término con scroll mínimo.

#### Pendiente E: Fusionar Limitaciones dentro de Metodología
- **Descripción:** Eliminar la pestaña "Limitaciones" como sección independiente. Su contenido pasa a ser una sección dentro de Metodología.
- **Tipo:** UI / arquitectura de contenido.
- **Complejidad:** Media. Requiere `app.js` (render de vistas, navegación por tabs) + `styles.css`.
- **Criterio de éxito:** Solo 5 tabs en el header (sin Limitaciones). El contenido de Limitaciones aparece dentro de Metodología.

#### Pendiente F: Título y bajada de Metodología
- **Descripción:** Reemplazar "Método / Cómo se construyó este documento" por "Cómo leemos la evidencia / Criterios, tramos etarios y niveles de certeza que organizan esta síntesis."
- **Tipo:** UI / contenido.
- **Dependencia:** Conveniente hacer junto con Pendiente E.
- **Complejidad:** Baja.
- **Criterio de éxito:** Nuevo título y bajada visibles en la vista.

#### Pendiente G: Eliminar subsección "Decisiones editoriales" de Metodología
- **Descripción:** La subsección "Decisiones editoriales" es documentación interna y no debe estar en el sitio publicado.
- **Tipo:** UI / contenido.
- **Complejidad:** Baja. Requiere identificar dónde se renderiza en `app.js`.
- **Criterio de éxito:** La subsección no aparece en el sitio publicado.

#### Pendiente H: Eliminar selector de tramo etario del Glosario
- **Descripción:** El selector de tramo etario en el índice del glosario no es necesario — las definiciones son independientes de tramo. Eliminarlo simplifica la interfaz.
- **Tipo:** UI.
- **Complejidad:** Baja. Requiere `app.js` (render del índice) + `styles.css`.
- **Criterio de éxito:** El índice del glosario no tiene selector de tramo. Los términos se muestran sin filtro etario.

#### Pendiente I: Eliminar selector de tramo etario de la Matriz
- **Descripción:** El selector de tramo en la Matriz principal solo "ilumina" una columna y ocupa espacio. Eliminarlo.
- **Tipo:** UI.
- **Complejidad:** Baja-media. Requiere `app.js` y `styles.css`.
- **Criterio de éxito:** El header de la Matriz no tiene selector de tramo. El filtro de certeza (alta/media/baja) se mantiene.

#### Pendiente J: Contacto — footer + nota en Metodología
- **Descripción:** Agregar información de contacto en dos lugares: (a) footer discreto en todas las páginas con email y/o LinkedIn; (b) nota al final de Metodología del tipo "Si encuentras un error o quieres sugerir una fuente...". Datos de contacto: pendiente de confirmar con el usuario (email y/o LinkedIn).
- **Tipo:** UI / contenido.
- **Complejidad:** Baja-media. Requiere `app.js` + `styles.css`.
- **Criterio de éxito:** Footer visible en todas las vistas; nota en Metodología. Los datos de contacto son los confirmados por el usuario.
- **Precaución:** Confirmar el email/LinkedIn antes de implementar.

#### Pendiente P1: Resolver 3 claims sin ref conocidos
- **Descripción:** `sueno-primera-infancia[2]`, `cognicion-ninez-media[1]`, `cognicion-ninez-media[2]`. Requieren búsqueda en PubMed.
- **Tipo:** Deuda epistémica / integridad bibliográfica.
- **Complejidad:** Baja-media.
- **Criterio de éxito:** `refs=[]` solo en claims con `"no_ref": true` explícito.

#### Pendiente P2: Política `"no_ref": true` para ~46 claims interpretativos
- **Descripción:** Definir e implementar `"no_ref": true` en los ~46 claims interpretativos aceptables sin cita.
- **Tipo:** Deuda técnica / política de datos.
- **Complejidad:** Media (revisión claim por claim).
- **Criterio de éxito:** Assert limpio distingue intencionales vs. pendientes.

#### Pendiente P3: Resolver ~10 claims empíricos sin ref
- **Dependencia:** Conveniente después de P2.
- **Tipo:** Deuda epistémica.
- **Complejidad:** Media-alta.

#### Pendiente P4: Unificar fuentes bibliográficas
- **Descripción:** `window.GLOSARIO.BIBLIO` (9) vs. `window.__DATA__.bibliografia` (74).
- **Tipo:** Deuda técnica.
- **Complejidad:** Media.

#### Pendiente P5: Glosario modos alpha y relevancia
- **Tipo:** Funcionalidad nueva.
- **Complejidad:** Media (~1 sesión).

#### Pendiente P6: Fase 6 — adolescencia
- **Tipo:** Contenido / funcionalidad nueva.
- **Complejidad:** Alta. Sesión dedicada.

#### Pendiente P7: Actualizar prompts de búsqueda bibliográfica
- **Tipo:** Documentación. Baja complejidad.

#### Pendiente P8: PDFs UNICEF/CJE UC
- **Tipo:** Documentación. ~10 minutos. Entre sesiones.

### 11.2 Evaluación de deuda técnica

- **Override hardcodeado en glosario móvil:** una línea que escapa al sistema de variables. Trivial.
- **66 claims con `refs=[]`:** sin política `"no_ref": true`, cualquier validación futura reporta falsos positivos. Conveniente resolver antes de agregar más contenido.
- **Dos fuentes bibliográficas paralelas:** riesgo de divergencia a medida que crezca la bibliografía.

### 11.3 Auditoría de cierre

- **¿Cada bloque de transformación tiene check de validación? (C.8)** → Sí. Build verificado con exit code 0 y revisión manual del CSS.
- **¿Los outputs son reproducibles e idempotentes? (C.2, C.3)** → Sí. `./00_build.sh` regenera `index.html` desde fuentes sin estado intermedio.
- **¿Hay decisiones metodológicas documentadas como constantes con nombre? (C.11)** → Sí. Las tres variables CSS nuevas tienen nombres semánticos explícitos.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Pendientes H + I — Eliminar selectores de tramo (Glosario y Matriz)** — Quirúrgicos, bajo riesgo, simplifican la interfaz sin dependencias. Requieren `app.js`. Criterio: ningún selector de tramo visible en ninguna vista.
2. **Pendientes E + F + G — Fusionar Limitaciones en Metodología + nuevo título/bajada + eliminar "Decisiones editoriales"** — Tres cambios relacionados que conviene hacer juntos. Criterio: 5 tabs en header; contenido de Limitaciones dentro de Metodología; "Decisiones editoriales" ausente.
3. **Pendiente B — Subtítulo del sitio** — Bajo, una vez que el header esté estabilizado por los cambios anteriores.
4. **Pendiente J — Contacto (footer + Metodología)** — Confirmar datos de contacto con el usuario antes de implementar.
5. **Pendiente C — Bibliografía móvil sticky** — Si la sesión alcanza.

**Diferir:**
- Pendiente D (glosario móvil rediseño) — más complejo, sesión dedicada.
- Pendiente A (override padding móvil) — trivial, agrupar con cualquier otra edición a `styles.css`.
- P1–P8 — sesión dedicada a datos/contenido.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** modificar `window.GLOSARIO.BIBLIO` (en `glosario-data.js`) sin verificar si el cambio debe replicarse en `bibliografia.json`, y viceversa. Son dos fuentes paralelas.
- ⚠️ **NO** asumir que un archivo JS nuevo en `10_fuentes/` entra al build automáticamente. Requiere marcador en `template.html` y lógica en `00_build.sh`. Ver Bug 8 (v07).
- ⚠️ **NO** asumir que `POLITICA_PROYECTO.md` describe la estructura real. El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1 (v05).
- ⚠️ **NO** agregar citas inline `(Autor et al., año)`. Solo chips `[ref]`. Ver Decisión 2 (v05).
- ⚠️ **NO** usar `sed -i` sin sufijo en macOS. Usar `sed -i ''` o Edit tool.
- ✅ **ANTES** de cualquier edición de UI: pedir `app.js` y `styles.css`. No modificar sin leer el estado real.
- ✅ **ANTES** de implementar Pendiente J (contacto): confirmar con el usuario qué datos mostrar (email, LinkedIn, ambos).
- ✅ **ANTES** de abrir sesión: ejecutar `Rscript 00_escanear_proyecto.R` y adjuntar `estructura_actual.md`.
- 🔒 Sin dependencias externas JS — vanilla JS únicamente. Ver Decisión 3 (v06).
- 🔒 Flujo de trabajo: commit directo a `main` + push (sin rama feature activa al cierre de esta sesión).
- 🔒 Los traspasos se generan en el chat web, no en Claude Code.

---

## 13. Fragmentos de código de referencia

### Verificar claims sin refs (clasificación)

```python
import json

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

### Ejecutar escáner

```bash
Rscript 00_escanear_proyecto.R
# Output en 30_documentacion/estructura/estructura_actual.md
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 9 (Sonnet)`
(Reemplazar "Sonnet" por el modelo que vayas a usar.)

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
> ⚠️ Traspasos: se generan en el chat web, no en Claude Code. Ver regla nueva del traspaso v08.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos para la próxima sesión

**Documentos de protocolo (knowledge base del Project)**

No requieren ser adjuntados. Verifica que estén disponibles:

- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md` (⚠️ con discrepancia respecto al proyecto real, ver Decisión 1)
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`
- `prompt-cierre-sesion.md`

**Opcionales según foco**

- `asistente_claude_code_seguro.md` — la próxima sesión probablemente usa Claude Code para editar `app.js`.

**Documento de traspaso (adjuntar)**

- `30_documentacion/traspasos/traspaso-cierre-v08.md` (este documento)

**Output del escáner (adjuntar)**

- `30_documentacion/estructura/estructura_actual.md` (ejecutar `Rscript 00_escanear_proyecto.R` antes de abrir)

**Archivos del proyecto críticos (adjuntar)**

- `10_fuentes/app.js` — necesario para todos los pendientes de UI de la ruta sugerida (H, I, E, F, G, B, J).
- `10_fuentes/styles.css` — necesario para ajustes de estilos asociados a los cambios de UI.
- `10_fuentes/template.html` — si la sesión toca el layout base o agrega marcadores.
- `30_documentacion/activa/CLAUDE.md` — convenciones actualizadas del proyecto.

**Datos o referencias externas**

- No aplica para la ruta sugerida (UI). Si se aborda P1–P3, adjuntar `10_fuentes/data/claims.json` y `10_fuentes/data/bibliografia.json`.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
