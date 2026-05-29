# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v06
- **Fecha:** 2026-05-29
- **Sesión:** 6 — Integridad bibliográfica (huérfanas y mismatches), limpieza editorial de citas institucionales, mejora del glosario, push y merge a main: sitio publicado en vivo.
- **Modelo utilizado:** Sonnet 4.6
- **Entorno:** Web (HTML/JSON/JS estático). Asistente-ejecutor: sesión web + Claude Code.
- **Archivos principales modificados:**
  - `10_fuentes/data/claims.json` (múltiples correcciones de refs)
  - `10_fuentes/app.js` (glosario migrado, tabs reordenados, 5 Cs corregidas, EYSTAG/AAP expandidos)
  - `10_fuentes/styles.css` (no modificado directamente)
  - `30_documentacion/activa/CLAUDE.md` (excepción citas institucionales, v04→v05, certeza actualizada)
  - `30_documentacion/andamios/` (kit prototipo glosario React agregado)
  - `index.html` (output del build, múltiples rebuilds)

---

## 2. Resumen ejecutivo

La sesión 6 se centró en resolver la deuda de integridad bibliográfica pendiente desde v05 (Bug 5 huérfanas y Bug 6 mismatches), completar la limpieza editorial de citas institucionales, mejorar el glosario con contenido del prototipo React producido con Claude Design, y finalmente publicar el sitio en vivo mediante push + merge a `main`. Se resolvieron 9 correcciones de refs en `claims.json` (huérfanas de sueño y salud mental, mismatches EYSTAG/AAP, chips vacíos en citas institucionales). Se expandió la sigla EYSTAG al nombre completo del Grupo Asesor en 4 claims, y AAP a nombre completo en 1 claim. El glosario fue migrado con contenido mejorado (3 secciones, 22 términos, definiciones revisadas) y los tabs reordenados. El prototipo React del glosario (3 archivos) quedó archivado en andamios como referencia para una futura integración interactiva. Al cierre, `main` está publicada en `https://tomgc.github.io/crianza_y_pantallas/` con 30 commits de la rama `refactor/modular-build` integrados.

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Sitio en vivo en `https://tomgc.github.io/crianza_y_pantallas/` — versión refactorizada (Fases 1-5) publicada.
- Pipeline modular completo: build reproducible desde JSONs vía `./00_build.sh`.
- Matriz con 50 celdas, 133 claims, chips `[ref]` navegables, popovers bibliográficos.
- Glosario con 22 términos en 3 secciones ("Conceptos del campo", "Para leer la evidencia", "Desarrollo infantil").
- Tabs en orden: Matriz, Glosario, Bibliografía, Metodología, Limitaciones.
- `CLAUDE.md` actualizado con convención de citas institucionales como sujeto.
- Escáner `00_escanear_proyecto.R` operativo.
- `bibliografia.json`: 74 entradas. `claims.json`: 133 claims en 50 celdas.

### Qué no funciona / deuda conocida

- Glosario interactivo (índice por dimensión, fichas con "Por qué importa", papers linkados) NO integrado — el prototipo React está en andamios. El glosario publicado es la versión simple (lista de términos con definición y link).
- Responsive del panel lateral (P1) no abordado — viewport <768px no usable.
- 3 claims siguen sin ref limpio: `sueno-primera-infancia[2]`, `cognicion-ninez-media[1]`, `cognicion-ninez-media[2]`.
- Bug 5 parcialmente resuelto: `sueno-primera-infancia[2]` volvió a `refs=[]` tras corregir mismatch de edad de He2025.
- Prompts de búsqueda bibliográfica (`prompts_busqueda/`) tienen listas de "papers ya integrados" que no se actualizaron en esta sesión.

### Qué cambió respecto al traspaso v05

| Aspecto | v05 | v06 |
|---|---|---|
| Sitio público | Versión vieja en `main` | Versión refactorizada publicada |
| Bug 5 (huérfanas sueño) | `refs=[]` en 4 claims | Janssen2020, Carter2016, Gomes2024, WHO2019 asignados; He2025 corregido |
| Bug 5 (salud mental) | `refs=[]` | Vasconcellos2025 + SotoRamirez2025 asignados |
| Bug 6 (mismatches) | Wass/Xu como problema abierto | Cerrado: textos sin autor inline, chips semánticamente correctos |
| Refs institucionales | 2 mismatches + 2 vacíos | 4 corregidos (EYSTAG2026/AAP2026) |
| EYSTAG en claims | Sigla en 4 claims | Nombre completo del Grupo Asesor |
| AAP en claims | Sigla en 1 claim | "La Academia Americana de Pediatría" |
| Glosario | 3 secciones genéricas | 3 secciones mejoradas con 22 términos del prototipo Claude Design |
| Tabs | Matriz, Bibliografía, Glosario... | Matriz, Glosario, Bibliografía... |
| 5 Cs AAP | "Child, Content, Context, Caregiver, Crown" (incorrecto) | "Child, Content, Calm, Crowding-out, Communication" (oficial) |
| CLAUDE.md | Sin regla sobre sujeto institucional | Excepción documentada: guías institucionales pueden ser sujeto |
| Commits adelante de origin | 16 | 0 (todo mergeado a main) |
| Kit glosario React | Inexistente en repo | En `30_documentacion/andamios/` |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Poblar refs huérfanos en sueño primera infancia (4 claims)
- **Archivo:** `10_fuentes/data/claims.json`, `index.html`
- **Categoría:** Corrección de integridad bibliográfica
- **Qué se hizo:** `sueno-primera-infancia[0]` → `[Janssen2020, He2025]`; `[1]` → `[Carter2016, Gomes2024]`; `[2]` → `[He2025]`; `[3]` → `[WHO2019]`. Script con asserts de baseline y post-cambio.
- **Por qué:** Bug 5 heredado de v05: 4 claims sin chip navegable.
- **Cómo se verificó:** Asserts Python + build OK.
- **Commit:** `dd7ad0a`

#### Cambio 2: Poblar refs en salud-mental-preescolar[0]
- **Archivo:** `10_fuentes/data/claims.json`, `index.html`
- **Categoría:** Corrección de integridad bibliográfica
- **Qué se hizo:** `salud-mental-preescolar[0]` → `[Vasconcellos2025, SotoRamirez2025]`.
- **Por qué:** Bug 5 heredado: claim de ansiedad/depresión sin respaldo navegable.
- **Cómo se verificó:** Asserts Python + build OK.
- **Commit:** `dd7ad0a`

#### Cambio 3: Corregir He2025 en sueno-primera-infancia (mismatch de edad)
- **Archivo:** `10_fuentes/data/claims.json`, `index.html`
- **Categoría:** Corrección de integridad bibliográfica
- **Qué se hizo:** `sueno-primera-infancia[0]`: `[Janssen2020, He2025]` → `[Janssen2020]`. `sueno-primera-infancia[2]`: `[He2025]` → `[]`. He2025 tiene mediana de edad 12,76 años (escolares); no calza con tramo 1-3 años.
- **Por qué:** Mismatch de edad detectado por Claude Code post-commit.
- **Cómo se verificó:** Asserts de estado previo + build OK.
- **Commit:** `e15f8e8`

#### Cambio 4: Commitear traspaso v05 y alias de estructura
- **Archivos:** `30_documentacion/traspasos/traspaso-cierre-v05.md`, `30_documentacion/estructura/estructura_actual.*`
- **Categoría:** Documentación / gobernanza
- **Qué se hizo:** Working tree limpio: traspaso v05 y aliases del escáner commiteados.
- **Commit:** `af98b75`

#### Cambio 5: Corregir refs institucionales (2 mismatches + 2 vacíos)
- **Archivo:** `10_fuentes/data/claims.json`, `index.html`
- **Categoría:** Corrección de integridad bibliográfica
- **Qué se hizo:** `sueno-preescolar[0]`: `[AAP2016]` → `[EYSTAG2026]`; `vinculo-preescolar[0]`: `[AAP2026]` → `[EYSTAG2026]`; `socioemocional-preadolescencia[2]`: `[]` → `[AAP2026]`; `vision-lactante[1]`: `[]` → `[EYSTAG2026]`.
- **Por qué:** Texto nombra institución como sujeto pero chip apuntaba a otra. Lector clickeaba esperando EYSTAG y aparecía AAP.
- **Cómo se verificó:** Asserts de estado previo + post-cambio + build OK.
- **Commit:** `458d86e`

#### Cambio 6: Renombrar término del glosario a "Certeza de la evidencia"
- **Archivo:** `10_fuentes/app.js`, `index.html`
- **Categoría:** Limpieza editorial / glosario
- **Qué se hizo:** `renderGlosario()` línea ~423: "Certeza alta / media / baja" → "Certeza de la evidencia: alta / media / baja".
- **Por qué:** El término anterior carecía del "apellido" metodológico. "Certeza de la evidencia" es la nomenclatura GRADE.
- **Cómo se verificó:** grep + build OK.
- **Commit:** `2ca790f`

#### Cambio 7: Actualizar CLAUDE.md (excepción citas institucionales, v04→v05, certeza)
- **Archivo:** `30_documentacion/activa/CLAUDE.md`
- **Categoría:** Documentación / gobernanza
- **Qué se hizo:** (a) Bullet nuevo: guías institucionales pueden ser sujeto del claim si el chip `[ref]` está presente; (b) "Último handoff: v04" → v05; (c) descripción de certeza sin referencia a función obsoleta `C()`.
- **Por qué:** CLAUDE.md desincronizado con realidad del código y convenciones vigentes.
- **Cómo se verificó:** Revisión manual.
- **Commit:** `09436f4`

#### Cambio 8: Expandir EYSTAG a nombre completo en 4 claims
- **Archivo:** `10_fuentes/data/claims.json`, `index.html`
- **Categoría:** Limpieza editorial
- **Qué se hizo:** "EYSTAG" → "El Grupo Asesor sobre el Tiempo de Pantalla en la Primera Infancia del Reino Unido" en `sueno-preescolar[0]`, `vision-lactante[1]`, `vinculo-lactante[2]`, `vinculo-preescolar[0]`. Script con assert de prefijo "EYSTAG".
- **Por qué:** Sigla desconocida para el lector general; el nombre completo es más claro e informativo.
- **Cómo se verificó:** Asserts + build OK.
- **Commit:** `af74751`

#### Cambio 9: Expandir AAP a nombre completo en socioemocional-preadolescencia[2]
- **Archivo:** `10_fuentes/data/claims.json`, `index.html`
- **Categoría:** Limpieza editorial
- **Qué se hizo:** "AAP recomienda..." → "La Academia Americana de Pediatría recomienda..." para consistencia con el tratamiento de EYSTAG.
- **Por qué:** Asimetría entre EYSTAG (expandido) y AAP (sigla) en el mismo corpus.
- **Cómo se verificó:** Assert de prefijo "AAP" + build OK.
- **Commit:** `7ebc18e`

#### Cambio 10: Migrar contenido mejorado al glosario (3 secciones, 22 términos)
- **Archivo:** `10_fuentes/app.js`, `index.html`
- **Categoría:** Limpieza editorial / glosario
- **Qué se hizo:** `renderGlosario()` reescrita con datos de `glosario-data.js` (prototipo Claude Design): secciones "Conceptos del campo", "Para leer la evidencia", "Desarrollo infantil". Términos mejorados: "Retraso del desarrollo" (antes "Displasia"), definiciones revisadas.
- **Por qué:** Glosario anterior tenía contenido genérico; el prototipo tenía definiciones más precisas y estructura más clara.
- **Cómo se verificó:** node --check (sintaxis JS), conteo 3 secciones / 22 términos, build OK.
- **Commit:** `33da7db`

#### Cambio 11: Reordenar tabs (Glosario antes de Bibliografía)
- **Archivo:** `10_fuentes/app.js`, `index.html`
- **Categoría:** Diseño visual y UX
- **Qué se hizo:** Array `tabs` en `renderTopBar()`: Matriz, Bibliografía, Glosario → Matriz, Glosario, Bibliografía, Metodología, Limitaciones.
- **Por qué:** Solicitud del usuario — Glosario es más relevante para el lector general que Bibliografía.
- **Commit:** `8661596`

#### Cambio 12: Corregir 5 Cs AAP (versión oficial)
- **Archivo:** `10_fuentes/app.js`, `index.html`
- **Categoría:** Corrección factual / glosario
- **Qué se hizo:** Definición de "Las 5 Cs (AAP 2026)" en `renderGlosario()`: "Child, Content, Context, Caregiver y Crown (tiempo)" → "Child, Content, Calm, Crowding-out y Communication".
- **Por qué:** Error factual introducido en la migración del glosario. Verificado contra fuente oficial AAP (healthychildren.org + aap.org).
- **Cómo se verificó:** Búsqueda web en fuente primaria + grep + build OK.
- **Commit:** `e34237d`

#### Cambio 13: Archivar kit prototipo glosario React en andamios
- **Archivos:** `30_documentacion/andamios/glosario-data.js`, `30_documentacion/andamios/glosario-app.jsx`, `30_documentacion/andamios/Glosario.html`
- **Categoría:** Documentación / gobernanza
- **Qué se hizo:** 3 archivos del prototipo React movidos/agregados a `30_documentacion/andamios/` como referencia para integración futura.
- **Por qué:** Los archivos en `10_fuentes/` eran inertes para el build (no los lee `00_build.sh`). Moverlos a andamios documenta su origen y los preserva como referencia sin confundir las fuentes reales del build.
- **Commits:** `9dba970`, `722a5ed`

#### Cambio 14: Push de rama + merge a main + publicación
- **Categoría:** Infraestructura / gobernanza
- **Qué se hizo:** `git push origin refactor/modular-build` (29 commits). `git merge refactor/modular-build --no-ff` en main. `git push origin main`. Sitio publicado en vivo.
- **Por qué:** 29 commits de la sesión + sesiones anteriores pendientes de publicación. Fase 6 del plan original.
- **Commit de merge:** `6a32d1b`

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020-2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON via `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1-4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación. La sesión 6 consolidó correcciones de integridad bibliográfica y limpieza editorial como categorías dominantes, y cerró con la publicación del sitio (Fase 6).*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~18% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~14% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Limpieza editorial | ~23 | ~16% | Eliminación de citas inline, expansión de siglas, corrección de textos, glosario mejorado |
| Corrección de integridad bibliográfica | ~14 | ~10% | Sesiones 5-6: huérfanas, mismatches, refs vacíos, mismatch de edad |
| Incorporación de evidencia | 13 | ~9% | Sesión 4: 13 papers + 27 ediciones + 1 corrección epistémica |
| Diseño visual y UX | ~15 | ~11% | Wireframe B, paleta, estados vacíos, placeholders, contador referencias, reorden tabs |
| Implementación de motor JS | ~8 | ~6% | Fase 4: `app.js`, render, panel lateral, popovers, deep linking |
| Bibliografía y popovers | ~7 | ~5% | Diseño del popover, navegación, filtros |
| Infraestructura / herramientas operativas | ~7 | ~5% | Escáner, flujo de incorporación, prompts modulares, publicación a main |
| Documentación / gobernanza | ~7 | ~5% | CLAUDE.md, README, convenciones, excepciones estructurales |
| Andamiaje entre celdas | ~5 | ~4% | Cascadas entre celdas |
| Corrección factual | ~2 | ~1% | 5 Cs AAP, certeza de la evidencia |

**Total estimado: ~146**

### 5.4 Resumen estadístico por sesión

| Sesión | Traspaso | N° cambios | Modelo | Foco principal |
|---|---|---|---|---|
| 1 | v01 | ~30 | Sonnet/Opus | Wireframe inicial React standalone |
| 2 | v02 | ~35 | Opus | Migración a estructura modular |
| 3 | v03 | ~35 | Opus | Build reproducible, JSONs validados, Fase 0-3 |
| entre 3-4 | — | ~3 | Sonnet | Fase 4 app.js, UX fix |
| 4 | v04 | 6 (con 27 sub-ediciones) | Opus | Bibliografía + prompts modulares |
| 5 | v05 | ~20 | Sonnet 4.6 | Infraestructura, limpieza editorial, integridad bibliográfica |
| 6 | v06 | ~17 | Sonnet 4.6 | Integridad bibliográfica, glosario, publicación |

**Total acumulado: ~146 cambios.**

### 5.5 Detalle cronológico de cambios por sesión

### Sesiones 1-5 — ver traspaso v05 (ítems 1-22)

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v05.md`, sección 5.5. No se reproduce aquí para no inflar el documento.)*

---

### Sesión 6 (Sonnet 4.6) — 2026-05-29

Integridad bibliográfica, limpieza editorial de citas institucionales, mejora del glosario y publicación del sitio en vivo.

**Integridad bibliográfica**

23. Poblar refs huérfanos en `sueno-primera-infancia[0-3]`: Janssen2020, He2025, Carter2016, Gomes2024, WHO2019 (resuelve Bug 5 parcialmente).
24. Poblar refs en `salud-mental-preescolar[0]`: Vasconcellos2025 + SotoRamirez2025 (resuelve Bug 5 parcialmente).
25. Corregir He2025 en `sueno-primera-infancia[0]` y `[2]`: mismatch de edad (He2025 es escolares, no lactantes). `[0]` queda con solo Janssen2020; `[2]` vuelve a `refs=[]`.
26. Bug 6 (mismatches Wass/Xu) cerrado como resuelto por efecto colateral de P-nuevo-B (sesión 5).
27. Corregir 4 refs institucionales: `sueno-preescolar[0]` AAP2016→EYSTAG2026, `vinculo-preescolar[0]` AAP2026→EYSTAG2026, `socioemocional-preadolescencia[2]` []→AAP2026, `vision-lactante[1]` []→EYSTAG2026.

**Limpieza editorial**

28. Expandir "EYSTAG" → nombre completo del Grupo Asesor en 4 claims (`sueno-preescolar[0]`, `vision-lactante[1]`, `vinculo-lactante[2]`, `vinculo-preescolar[0]`).
29. Expandir "AAP" → "La Academia Americana de Pediatría" en `socioemocional-preadolescencia[2]`.
30. Documentar excepción en CLAUDE.md: citas institucionales como sujeto son aceptables para guías (con chip `[ref]` obligatorio).
31. Actualizar CLAUDE.md: v04→v05, descripción de certeza sin referencia a función obsoleta `C()`.

**Glosario**

32. Renombrar término "Certeza alta / media / baja" → "Certeza de la evidencia: alta / media / baja" en `renderGlosario()`.
33. Migrar contenido mejorado del prototipo Claude Design a `renderGlosario()`: 3 secciones, 22 términos, definiciones revisadas, "Retraso del desarrollo" en lugar de "Displasia".
34. Reordenar tabs: Glosario pasa a ser el segundo tab (antes Bibliografía).
35. Corregir 5 Cs AAP: "Child, Content, Context, Caregiver, Crown" → "Child, Content, Calm, Crowding-out, Communication" (verificado contra fuente oficial AAP).
36. Archivar kit prototipo glosario React (glosario-data.js, glosario-app.jsx, Glosario.html) en `30_documentacion/andamios/`.

**Publicación**

37. Push de rama `refactor/modular-build` a origin (29 commits).
38. Merge `refactor/modular-build` → `main` con `--no-ff` (33 archivos, sin conflictos).
39. Push de `main` → sitio publicado en `https://tomgc.github.io/crianza_y_pantallas/`.

---

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron 17 cambios correlativos (ítems 23-39) correspondientes a la sesión 6.
- Categoría nueva: "Corrección factual" (~1%) para 5 Cs AAP y renombre de certeza.
- Categoría "Corrección de integridad bibliográfica" separada de "Corrección de bugs" del v05 para mayor precisión.
- Categoría "Limpieza editorial" creció: incorpora expansión de siglas institucionales.

---

## 6. Bugs encontrados y su resolución

#### Bug 7: He2025 asignado a tramo de primera infancia (mismatch de edad)
- **Síntoma:** `sueno-primera-infancia[0]` y `[2]` tenían `He2025` como ref; He2025 tiene mediana de edad 12,76 años (escolares/preadolescentes).
- **Causa raíz:** Al asignar refs de sueño en el script de la sesión, He2025 fue incluido como candidato plausible por título ("association of screen time and sleep outcomes"), sin verificar el tramo etario de la muestra.
- **Solución:** `sueno-primera-infancia[0]`: removido He2025, queda `[Janssen2020]`. `sueno-primera-infancia[2]`: removido He2025, queda `[]`.
- **Criterio de verificación:** Asserts de estado previo + build OK.
- **Patrón aprendido:** Al asignar refs de sueño (o cualquier dimensión), verificar que la muestra del paper corresponda al tramo etario de la celda, no solo el tema.
- **Principios:** C.8 (validación de integridad) — agregar check de edad a la verificación mental antes de proponer candidatos.
- **Estado:** Resuelto (con `sueno-primera-infancia[2]` quedando sin ref).

#### Bug 8: 5 Cs AAP con nomenclatura incorrecta en glosario migrado
- **Síntoma:** Tras la migración del glosario, las 5 Cs decían "Child, Content, Context, Caregiver y Crown (tiempo)" en lugar de la versión oficial.
- **Causa raíz:** El archivo `glosario-data.js` del prototipo Claude Design tenía una versión incorrecta de las 5 Cs que no fue detectada antes de migrar.
- **Solución:** Edición con Edit tool en `app.js` línea 427. Verificado contra fuente primaria AAP (healthychildren.org).
- **Criterio de verificación:** Búsqueda web en fuente oficial + grep + build OK.
- **Patrón aprendido:** Cualquier afirmación sobre un marco con nombre propio (5 Cs, GRADE, DSM) debe verificarse contra la fuente primaria antes de publicar, especialmente cuando proviene de un prototipo generado por IA.
- **Principios:** C.11 (transparencia), C.8 (validación).
- **Estado:** Resuelto.

**Bugs heredados sin resolver:**
- **Bug 5 (parcial):** `sueno-primera-infancia[2]` sin ref (intervenciones → sueño en primera infancia, sin candidato limpio en biblio). `cognicion-ninez-media[1]` y `[2]` sin ref.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Antes de asignar un ref a un claim de un tramo etario específico, verificar que la muestra del paper corresponde a ese tramo, no solo el tema.
  - **Principio:** C.8 (validación de integridad).
  - **Contexto:** He2025 (mediana 12,76 años) fue asignado a `sueno-primera-infancia` (1-3 años) solo por relevancia temática. Requirió corrección.
  - **Ejemplo:** `sueno-primera-infancia[0]`, bug 7 de esta sesión.

- **Regla:** Afirmaciones sobre marcos con nombre propio (5 Cs, GRADE, DSM, etc.) deben verificarse contra la fuente primaria, especialmente si provienen de contenido generado por IA.
  - **Principio:** C.11 (transparencia del cambio), C.8.
  - **Contexto:** El prototipo de Claude Design tenía una versión incorrecta de las 5 Cs. La verificación web tomó 30 segundos y evitó publicar un error factual.

- **Regla:** `sed -i` sin sufijo falla en macOS/BSD. Usar `sed -i ''` o Edit tool para ediciones puntuales sobre archivos del proyecto.
  - **Principio:** C.7 (portabilidad).
  - **Contexto:** Documentado en v05, confirmado de nuevo en esta sesión. El Edit tool es siempre más seguro para ediciones de una línea.

- **Regla:** El build (`00_build.sh`) solo consume `template.html`, `styles.css`, `data/*.json` y `app.js`. Cualquier archivo `.jsx`, `.js` no-data que se copie a `10_fuentes/` queda inerte sin modificar el build script y el template.
  - **Principio:** C.2 (reproducibilidad).
  - **Contexto:** `glosario-data.js` y `glosario-app.jsx` estuvieron en `10_fuentes/` sin efecto hasta ser movidos a andamios.

*(Reglas de sesiones anteriores vigentes: `set -e` obligatorio en cadenas bash, verificar autoría en PubMed, verificar IDs contra estado actual de biblio antes de proponer batch, no usar regex para ediciones masivas de texto.)*

---

## 8. Decisiones de diseño tomadas

#### Decisión 3 (continuación): Glosario interactivo React diferido a sesión futura
- **Decisión:** No integrar el prototipo React al build. Migrar solo el contenido (definiciones, 3 secciones) a la `renderGlosario()` vanilla existente. El kit completo queda en andamios.
- **Alternativas:** (a) Integrar React vía CDN (descartado: viola restricción "sin dependencias externas", revierte decisión de sesión 3); (b) compilar JSX a JS vanilla (descartado: output inerte para el build actual; requeriría modificar `00_build.sh` y `template.html`); (c) portar la lógica interactiva (índice + ficha) a vanilla JS (viable, diferido).
- **Justificación:** Las opciones A y B chocan con decisiones estructurales anteriores. La opción C es trabajo real (~2 horas) que no cabía en esta sesión con el merge pendiente.
- **Implicancia:** El glosario publicado es funcional pero estático. La versión interactiva (índice por dimensión, fichas con "Por qué importa", papers linkados) es Pendiente 10 para una sesión futura.

#### Decisión 4: Bug 6 cerrado como resuelto por efecto colateral
- **Decisión:** Los mismatches `cognicion-lactante[0]` (Wass→AAP2024) y `vinculo-primera-infancia[1]` (Xu→Mallawaarachchi2024) se declaran resueltos: la limpieza P-nuevo-B de sesión 5 eliminó las menciones de autor del texto, y los chips son semánticamente correctos.
- **Justificación:** Sin texto de autor que contradiga el chip, no hay mismatch visible para el lector. AAP2024 sobre "content fast-paced / atención sostenida" y Mallawaarachchi2024 sobre "calidad de relación parento-filial como mediador" son matches semánticos plausibles.

#### Decisión 5: Excepción de citas institucionales como sujeto
- **Decisión:** Cuando la fuente es una guía o recomendación institucional (EYSTAG, AAP, OMS, MINEDUC), es aceptable nombrarla como sujeto del claim. El chip `[ref]` sigue siendo obligatorio. Documentado en CLAUDE.md.
- **Alternativa considerada:** Reformular todos los claims para que la institución no sea sujeto.
- **Justificación:** "El Grupo Asesor... recomienda X" es más informativo que "Se recomienda X [chip]": la atribución a un organismo es relevante para el lector. La excepción NO aplica a estudios empíricos individuales.

---

## 9. Constantes, configuraciones y parámetros vigentes

No aplica directamente — este es un proyecto de contenido estático (JSON + HTML/JS), no un pipeline analítico con constantes numéricas. Las configuraciones relevantes son:

| Parámetro | Valor | Archivo | Nota |
|---|---|---|---|
| Tramos etarios | 0-12m, 1-3a, 3-5a, 6-8a, 9-12a | `10_fuentes/data/metadata.json` | No modificar sin actualizar todos los claims |
| Dimensiones | 10 (Lenguaje, Cognición, ...) | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Certeza levels | h / m / l | `10_fuentes/data/metadata.json` + `app.js` | Alta/Media/Baja |
| Rama de trabajo | `refactor/modular-build` | Git | Mergeada a main al cierre de sesión 6 |
| URL publicada | `https://tomgc.github.io/crianza_y_pantallas/` | GitHub Pages desde `main` | Activa desde cierre sesión 6 |

---

## 10. Arquitectura de archivos relevante

Referencia: `30_documentacion/estructura/estructura_actual.md` (generado 2026-05-29 12:34:15, 10 carpetas, 46 archivos antes de los cambios de esta sesión).

**Cambios estructurales en esta sesión:**
- `30_documentacion/andamios/` recibió 3 archivos nuevos: `glosario-data.js`, `glosario-app.jsx`, `Glosario.html`.
- `10_fuentes/` recuperó su estado canónico (solo fuentes del build).
- `main` y `refactor/modular-build` ahora apuntan al mismo árbol (`6a32d1b`).

**Verificación contra política:**
- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Excepción documentada y aceptada (Decisión 1, v05). Ver CLAUDE.md.
- Sin `40_salidas/`: excepción documentada (output es `index.html` en raíz).
- Naming respeta sección 2.3: snake_case, sin tildes/ñ/espacios.

**Nota:** El escáner debe correrse al inicio de la próxima sesión para reflejar los cambios de esta sesión (andamios nuevos, estructura actualizada).

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: Responsive del panel lateral (P2)
- **Descripción:** Panel lateral de 360px fijo no usable en viewport <768px. Definir comportamiento (bottom sheet / colapsable) e implementar CSS+JS.
- **Tipo:** Funcionalidad nueva.
- **Impacto:** Sitio no usable en mobile. Audiencia relevante (padres, educadores) probablemente accede desde móvil.
- **Dependencias:** Ninguna bloqueante.
- **Complejidad estimada:** Media.
- **Principios relevantes:** B.1 (decisión arquitectónica primero), B.4 (criterio de éxito: viewport <768px funcional).
- **Precauciones:** Requiere decisión sobre el patrón de UI antes de implementar.
- **Criterio de éxito:** Ficha de celda accesible en viewport <768px.

#### Pendiente 2: Resolver claims sin ref limpio (3 casos)
- **Descripción:** `sueno-primera-infancia[2]` ("intervenciones reducen pantalla → mejoran sueño"), `cognicion-ninez-media[1]` ("pantalla educativa puede ser beneficiosa"), `cognicion-ninez-media[2]` ("restricción celulares en aula no mejora resultados"). Los 3 requieren verificación externa de papers.
- **Tipo:** Deuda epistémica / integridad bibliográfica.
- **Impacto:** Claims sin respaldo navegable — lector no puede verificar la afirmación.
- **Complejidad estimada:** Baja-media (requiere verificación en PubMed).
- **Precauciones:** No asignar refs sin verificar que la muestra corresponde al tramo etario. Ver Bug 7.
- **Criterio de éxito:** Validación cruzada sin huérfanas.

#### Pendiente 3: Glosario interactivo (integración vanilla JS)
- **Descripción:** Portar la lógica del prototipo React (índice por dimensión, ficha con "Por qué importa", papers linkados, términos relacionados, filtro por tramo) a vanilla JS dentro de `renderGlosario()`. El kit de referencia está en `30_documentacion/andamios/`.
- **Tipo:** Funcionalidad nueva.
- **Impacto:** El glosario actual es estático; la versión interactiva es significativamente más rica para el lector.
- **Dependencias:** Ninguna bloqueante. Conviene tener el responsive resuelto primero.
- **Complejidad estimada:** Alta (~2 horas de sesión dedicada).
- **Precauciones:** Respetar restricción "sin dependencias externas" — vanilla JS únicamente. Ver Decisión 3.
- **Criterio de éxito:** Glosario con índice clickeable, ficha lateral con "Por qué importa" y papers linkados.

#### Pendiente 4: Fase 5 — Secciones secundarias
- **Descripción:** Bibliografía buscable con filtros, andamiaje navegable, método, limitaciones, leyenda completa.
- **Tipo:** Funcionalidad nueva.
- **Dependencias:** Recomendado resolver responsive (P1) primero.
- **Complejidad estimada:** Alta. 2-3 sesiones dedicadas.

#### Pendiente 5: Ejecución de prompts de búsqueda bibliográfica (P8/P9)
- **Descripción:** Usar los 11 prompts modulares con agentes externos. Empezar por `01_creatividad.md`. Actualizar lista "papers ya integrados" en los 11 archivos después de cada batch.
- **Tipo:** Incorporación de evidencia.
- **Complejidad estimada:** Una sesión web por dimensión (~11 sesiones futuras).

#### Pendiente 6: Extender validación cruzada para detectar huérfanas inline
- **Descripción:** Agregar check al validador pre-build que detecte patrones `(Apellido, año)` en texto de claims sin correspondencia en `refs[]`.
- **Tipo:** Mejora de infraestructura.
- **Complejidad estimada:** Baja.
- **Criterio de éxito:** Script detecta casos actuales como warnings.

#### Pendiente 7: Reformular claims con sujeto = nombre de autor/institución (residual)
- **Descripción:** Revisar si quedan claims donde el sujeto es el nombre de un estudio o institución en forma no expandida o incompleta. La excepción de CLAUDE.md cubre guías institucionales con nombre completo; esta tarea es para casos que se hubieran escapado.
- **Tipo:** Limpieza editorial.
- **Urgencia:** Baja.
- **Complejidad estimada:** Baja.

#### Pendiente 8: Descargar 6 PDFs UNICEF/CJE UC localmente
- **Tipo:** Documentación.
- **Complejidad:** Baja (10 minutos).

#### Pendiente 9: Actualizar lista "papers ya integrados" en prompts de búsqueda
- **Descripción:** Los 11 archivos en `30_documentacion/activa/prompts_busqueda/` tienen listas de papers ya integrados que no se actualizaron tras las incorporaciones de sesiones 4-6.
- **Tipo:** Documentación / gobernanza.
- **Complejidad:** Baja.
- **Criterio de éxito:** Cada prompt lista los 74 papers actuales de `bibliografia.json`.

### 11.2 Evaluación de deuda técnica

- **Zona frágil:** 3 claims sin ref (`sueno-primera-infancia[2]`, `cognicion-ninez-media[1]`, `[2]`). Requieren verificación externa; mientras no se resuelvan, son afirmaciones sin respaldo navegable en el sitio público.
- **Zona frágil:** Los 11 prompts de `prompts_busqueda/` tienen listas de "papers ya integrados" desactualizadas. Si se usan con agentes externos, pueden proponer duplicados.
- **Oportunidad:** Extender el validador cruzado (Pendiente 6) para detectar automáticamente estos casos en el futuro.

### 11.3 Auditoría de cierre

- **¿Cada bloque de transformación tiene check de validación? (C.8)** → Sí. Cada cambio a JSONs ejecutó asserts antes de escribir.
- **¿Los outputs son reproducibles e idempotentes? (C.2, C.3)** → Sí. `./00_build.sh` regenera `index.html` desde JSON sin estado intermedio.
- **¿Hay decisiones metodológicas documentadas como constantes con nombre? (C.11)** → Parcialmente. Las decisiones epistémicas viven en commit messages y este traspaso. No aplica patrón clásico de constantes (proyecto es contenido + JSON, no pipeline de análisis).

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

## Ruta sugerida para la próxima sesión

1. **Resolver claims sin ref (Pendiente 2)** — Baja-media complejidad, integridad del corpus ya publicado. Verificar papers en PubMed. Criterio: validación cruzada sin huérfanas.
2. **Responsive del panel lateral (Pendiente 1)** — Decisión arquitectónica primero (bottom sheet vs. colapsable), luego implementación. Criterio: viewport <768px funcional.
3. **Extender validador cruzado (Pendiente 6)** — Complejidad baja, previene regresiones. Criterio: script detecta patrones `(Apellido, año)` en texto de claims.
4. **Actualizar lista "papers integrados" en prompts (Pendiente 9)** — Complejidad baja, preparatorio para P5.

**Diferir para sesiones dedicadas:**
- Pendiente 3 (glosario interactivo) — alta complejidad, sesión propia.
- Pendientes 4 y 5 (Fase 5 + búsqueda bibliográfica) — sesiones dedicadas.
- Pendiente 8 (PDFs) — tarea manual de 10 minutos, hacerla entre sesiones.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** integrar entradas bibliográficas sin verificar autoría primaria Y tramo etario de la muestra contra PubMed o DOI. Ver Bug 7 (sesión 6) y Bug 3 (v04).
- ⚠️ **NO** asumir que `POLITICA_PROYECTO.md` describe la estructura real del proyecto. El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1 (v05). Verificar con `ls` antes de generar rutas.
- ⚠️ **NO** agregar citas inline `(Autor et al., año)` al texto de claims. Solo chips `[ref]`. Ver Decisión 2 (v05).
- ⚠️ **NO** usar regex ciego para ediciones masivas de texto en claims. Siempre hand-curated con aprobación claim por claim.
- ⚠️ **NO** usar `sed -i` sin sufijo en macOS — falla silenciosamente. Usar `sed -i ''` o Edit tool.
- ⚠️ **NO** asumir que archivos `.js` o `.jsx` copiados a `10_fuentes/` entran al build. El build solo consume `template.html`, `styles.css`, `data/*.json` y `app.js`. Ver sección 7.
- ✅ **ANTES** de cualquier sesión: ejecutar `Rscript 00_escanear_proyecto.R` y adjuntar `estructura_actual.md`.
- ✅ **ANTES** de asignar un ref a un claim, verificar que el tramo etario de la muestra del paper corresponde al tramo de la celda.
- 🔒 El sitio se publica desde `main` vía GitHub Pages. Cambios van en `refactor/modular-build` (u otra rama) hasta validación visual completa.
- 🔒 La restricción "sin dependencias externas JS" es invariante de arquitectura — ver Decisión 3. No integrar React, Vue ni ningún framework JS sin una sesión de decisión explícita.

---

## 13. Fragmentos de código de referencia

### Flujo canónico de incorporación bibliográfica (con `set -e` y verificación de tramo)

```bash
set -e

python3 -c "
import json

biblio = json.load(open('10_fuentes/data/bibliografia.json'))
claims = json.load(open('10_fuentes/data/claims.json'))

ids_existentes = {b['id'] for b in biblio}

# 1. Verificar baseline
assert 'NuevoId2025' not in ids_existentes, 'ID ya existe'
assert len(biblio) == 74, f'Esperado 74, hay {len(biblio)}'

# 2. Agregar entrada (verificar tramo etario de la muestra antes de asignar a celdas)
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

### Snippet para obtener IDs vigentes en biblio

```bash
python3 -c "import json; print(sorted([b['id'] for b in json.load(open('10_fuentes/data/bibliografia.json'))]))"
```

### Ejecutar escáner

```bash
Rscript 00_escanear_proyecto.R
# Output en 30_documentacion/estructura/estructura_actual.md
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 7 (Opus)`
(Reemplazar "Opus" por el modelo que vayas a usar.)

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
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos para la próxima sesión

**Documentos de protocolo (knowledge base del Project)**

NO requieren ser adjuntados. Verifica que estén disponibles:

- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md` (⚠️ con discrepancia respecto al proyecto real, ver Decisión 1)
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md` (versión vigente: v3)
- `prompt-cierre-sesion.md`

**Opcionales según foco**

- `asistente_claude_code_seguro.md` — la próxima sesión probablemente usa Claude Code (responsive, validador, fixes bibliográficos).

**Documento de traspaso (adjuntar)**

- `30_documentacion/traspasos/traspaso-cierre-v06.md` (este documento)

**Output del escáner (adjuntar)**

- `30_documentacion/estructura/estructura_actual.md` (ejecutar `Rscript 00_escanear_proyecto.R` antes de abrir)

**Archivos del proyecto críticos (adjuntar)**

- `10_fuentes/data/bibliografia.json` — 74 entradas. Necesario para verificar IDs antes de cualquier batch.
- `10_fuentes/data/claims.json` — 50 celdas / 133 claims. Necesario para Pendiente 2 (claims sin ref).
- `10_fuentes/app.js` — necesario si la sesión toca responsive (Pendiente 1) o glosario interactivo (Pendiente 3).
- `10_fuentes/styles.css` — solo si toca responsive.
- `30_documentacion/activa/CLAUDE.md` — convenciones actualizadas del proyecto.

**Datos o referencias externas**

No aplica.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
