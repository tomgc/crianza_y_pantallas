# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v05
- **Fecha:** 2026-05-29
- **Sesión:** 5 — Infraestructura y limpieza editorial: escáner de proyecto, resolución de deuda estructural (P10), corrección de citas huérfanas (P1), contador de referencias por dimensión (P-nuevo-A), y eliminación de citas inline del corpus (P-nuevo-B).
- **Modelo utilizado:** Sonnet 4.6
- **Entorno:** Web (HTML/JSON/JS estático). Asistente-ejecutor: sesión web + Claude Code.
- **Archivos principales modificados:**
  - `00_escanear_proyecto.R` (nuevo)
  - `30_documentacion/activa/CLAUDE.md` (actualizado)
  - `README.md` (actualizado)
  - `.gitignore` (actualizado)
  - `10_fuentes/data/bibliografia.json` (74 entradas, +1 BrauneKrickau2021)
  - `10_fuentes/data/claims.json` (54 textos editados, 3 refs poblados)
  - `10_fuentes/app.js` (contador "N referencias")
  - `index.html` (rebuild)

---

## 2. Resumen ejecutivo

La sesión 5 fue de infraestructura y limpieza editorial sobre la rama `refactor/modular-build`. Se creó el escáner de proyecto `00_escanear_proyecto.R` (adaptado al proyecto web, anclado por `.git`, destino `30_documentacion/estructura/`). Se resolvió la deuda estructural P10 documentando explícitamente en `CLAUDE.md`, `README.md` y `.gitignore` que el proyecto usa `30_documentacion/` en lugar de `50_documentacion/` y carece de `40_salidas/`. Se corrigió P1: se agregó `BrauneKrickau2021` a `bibliografia.json`, se poblaron los refs huérfanos en `socioemocional-lactante[0]` y `comportamiento-lactante[0]`, y se eliminó la cita sin verificar de Crescenzi Lanna de `fisica-preescolar[0]`. Se implementó P-nuevo-A (contador de referencias únicas por dimensión en la matriz, con etiqueta "N referencias"). Se ejecutó P-nuevo-B: eliminación de las 54 citas inline de autor del corpus, preservando datos metodológicos (N=, tamaños muestrales), con la convención de citas actualizada en `CLAUDE.md`. La rama queda 16 commits adelante de origin sin push; el sitio público sigue mostrando la versión anterior hasta el merge de Fase 6.

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Pipeline modular completo (Fase 1-4): build reproducible, JSONs validados, `app.js` operativo.
- Escáner de proyecto `00_escanear_proyecto.R`: genera snapshots en `30_documentacion/estructura/`, alias `estructura_actual.*` siempre apuntan al más reciente. Snapshots timestamped ignorados por git.
- Matriz con contador de referencias únicas por dimensión ("N referencias" bajo cada label).
- Corpus editorial limpio: 54 claims sin citas inline de autor; chips `[ref]` son la única forma de referencia.
- `CLAUDE.md` y `README.md` actualizados y alineados con la estructura real del proyecto.
- Validación cruzada pre-commit operativa.
- `bibliografia.json`: 74 entradas. `claims.json`: 133 claims en 50 celdas.

### Qué no funciona

- Push a remoto pendiente: 16 commits sin pushear. `main` sirve sitio viejo via GitHub Pages.
- Responsive del panel lateral (P2): no abordado. Sitio no usable en mobile.
- 5 casos críticos de integridad bibliográfica pendientes (ver sección 11):
  - 3 huérfanas puras (SMART Schools, Skalická/Liu, sueno-primera-infancia múltiple).
  - 2 mismatches cita↔ref (Wass→AAP2024, Xu&Qiao→Mallawaarachchi2024).
- Claims donde el sujeto del texto es el nombre del autor/institución (baja urgencia, ver P-nuevo-C).

### Qué cambió respecto al traspaso v04

| Aspecto | v04 | v05 |
|---|---|---|
| Escáner | Inexistente | `00_escanear_proyecto.R` creado y operativo |
| Deuda P10 | Documentada como bug | Resuelta: excepción en CLAUDE.md, README, .gitignore |
| `bibliografia.json` | 73 entradas | 74 entradas (+BrauneKrickau2021) |
| Refs huérfanos | socioemocional/comportamiento-lactante sin ref | Poblados con BrauneKrickau2021 |
| Crescenzi Lanna | Cita inline sin entrada | Eliminada del texto |
| Contador matriz | Código presente, no visible (caché) | Activo con etiqueta "N referencias" |
| Citas inline corpus | 54 claims con `(Autor, año)` inline | Eliminadas; solo chips `[ref]` |
| Convención CLAUDE.md | `(Autor et al., año) [ref]` | Solo `[ref]`, sin autor inline |
| Commits adelante de origin | 4 | 16 |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Creación de `00_escanear_proyecto.R`

- **Archivo:** `00_escanear_proyecto.R` (raíz)
- **Categoría:** Infraestructura / herramientas operativas
- **Qué se hizo:** Script R adaptado del template del usuario. Ancla root por `is_git_root` (no hay `.Rproj`). Genera 4 archivos en `30_documentacion/estructura/`: snapshot timestamped `.txt` y `.md` + alias `estructura_actual.*`. Excluye `.git`, `.claude`, `node_modules`. Usa `useBytes = TRUE` para evitar warnings de encoding en macOS.
- **Por qué:** El proyecto carecía de escáner. Sin él, cada sesión nueva requería deducir rutas o pedirle al usuario que listara el directorio manualmente.
- **Verificación:** Ejecutado con `Rscript 00_escanear_proyecto.R`; generó 4 archivos sin errores.
- **Commit:** `442da47` (junto con P10).

#### Cambio 2: Documentar excepción estructural P10 en `CLAUDE.md` y `README.md`

- **Archivos:** `30_documentacion/activa/CLAUDE.md`, `README.md`
- **Categoría:** Documentación / gobernanza
- **Qué se hizo:** Agregada sección de excepción estructural en `CLAUDE.md` explicando que el proyecto usa `30_documentacion/` (no `50_` como dice POLITICA_PROYECTO.md) y carece de `40_salidas/`. Actualizadas secciones "Estructura del repo", "Preferencias de trabajo" y "Estado actual" en `CLAUDE.md`. `README.md` reescrito: rango etario corregido (0-12, no 0-18), rutas actualizadas, conteo bibliográfico actualizado, build modular documentado.
- **Por qué:** Bug 4 del v04: cada instancia nueva asumía la política canónica y generaba rutas incorrectas. La excepción debe estar documentada donde el agente la lee primero.
- **Verificación:** Revisión manual del contenido actualizado.
- **Commit:** `442da47`.

#### Cambio 3: Configurar `.gitignore` para snapshots timestamped del escáner

- **Archivo:** `.gitignore`
- **Categoría:** Infraestructura / gobernanza
- **Qué se hizo:** Agregadas dos líneas para ignorar `30_documentacion/estructura/2*_estructura.txt` y `30_documentacion/estructura/2*_estructura.md`. Los alias `estructura_actual.*` se mantienen trackeados. Los timestamped ya commiteados en `442da47` fueron removidos del índice con `git rm --cached`.
- **Por qué:** Sin esta configuración, cada ejecución del escáner generaría un archivo nuevo trackeado, haciendo crecer el historial git sin valor.
- **Verificación:** `git check-ignore` confirmó que el patrón matchea correctamente. Working tree limpio post-remoción.
- **Commit:** `743ea3b`.

#### Cambio 4: Agregar `BrauneKrickau2021` y poblar refs huérfanos (P1)

- **Archivos:** `10_fuentes/data/bibliografia.json`, `10_fuentes/data/claims.json`, `index.html`
- **Categoría:** Corrección de integridad bibliográfica
- **Qué se hizo:** Nueva entrada `BrauneKrickau2021` (group: `regulation`, type: `review`, DOI: `10.1002/imhj.21908`). Refs poblados en `socioemocional-lactante[0]` y `comportamiento-lactante[0]`. Cita inline de Crescenzi Lanna eliminada de `fisica-preescolar[0]` (paper no verificado); texto reformulado con acentos correctos.
- **Por qué:** Dos claims citaban a Braune-Krickau sin entrada en biblio ni chip navegable. La cita de Crescenzi Lanna no pudo verificarse contra el claim de motricidad fina.
- **Verificación:** Asserts: `len(biblio) == 74`, refs correctos, sin Crescenzi en texto. Build OK.
- **Commit:** `f8891cc`.

#### Cambio 5: Contador "N referencias" por dimensión en matriz (P-nuevo-A)

- **Archivo:** `10_fuentes/app.js` (línea 196), `index.html`
- **Categoría:** Funcionalidad nueva / UX
- **Qué se hizo:** El código `paperCountByDim` ya existía en `app.js` pero el label decía solo `(N)`. Cambiado a `(N referencia)` / `(N referencias)` con singular/plural correcto. CSS `.dim-paper-count` ya tenía estilos.
- **Por qué:** El usuario no veía el contador porque visitaba el sitio en GitHub Pages (versión vieja). El ajuste de etiqueta también mejoró la legibilidad.
- **Verificación:** Validado abriendo `index.html` local; contador visible bajo cada dimensión con valores correctos (lenguaje: 14, cognición: 8, etc.).
- **Commit:** `63a49d1`.

#### Cambio 6: Eliminar citas inline de 54 claims (P-nuevo-B)

- **Archivos:** `10_fuentes/data/claims.json`, `index.html`
- **Categoría:** Limpieza editorial / cambio de convención
- **Qué se hizo:** Edición hand-curated de 54 claims: eliminación de `(Autor et al., año)` inline preservando datos metodológicos (N=, tamaños muestrales, detalles de diseño). Cada texto propuesto revisado y aprobado por el usuario antes de ejecutar. `refs[]` no modificados.
- **Por qué:** Nueva convención: las referencias van solo como chips `[ref]` navegables. Las citas inline interrumpían la lectura y duplicaban información ya disponible en el chip.
- **Verificación:** 54 ediciones aplicadas, 0 errores de baseline, 0 refs huérfanos nuevos, total claims = 133. Build OK (+108/−108 líneas simétricas).
- **Commit:** `4126a2a` (mensaje corregido con `--amend` desde `9c788ae`).

#### Cambio 7: Actualizar convención de citas en `CLAUDE.md`

- **Archivo:** `30_documentacion/activa/CLAUDE.md`
- **Categoría:** Documentación / gobernanza
- **Qué se hizo:** Línea de convención de citas actualizada de `(Autor et al., año) [ref]` a descripción de la nueva convención: solo chips, sin autor inline, datos metodológicos preservados. Referencia explícita a la decisión de sesión 5 (P-nuevo-B).
- **Por qué:** Sin esta actualización, el próximo agente reintroduciría citas inline creyendo que sigue la convención documentada.
- **Verificación:** Revisión manual.
- **Commit:** `426ead8`.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020-2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON via `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1-4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación. La sesión 5 consolidó la categoría "Infraestructura / herramientas operativas" con el escáner, y agregó "Limpieza editorial" como categoría nueva para los cambios de P-nuevo-B.*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~20% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~16% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Limpieza editorial | ~16 | ~13% | Sesión 5: eliminación de 54 citas inline, corrección de refs huérfanos, ajuste de textos |
| Incorporación de evidencia | 13 | ~10% | Sesión 4: 13 papers + 27 ediciones + 1 corrección epistémica |
| Diseño visual y UX | ~15 | ~12% | Wireframe B, paleta, estados vacíos, placeholders, contador referencias |
| Implementación de motor JS | ~8 | ~6% | Fase 4: `app.js`, render, panel lateral, popovers, deep linking |
| Bibliografía y popovers | ~7 | ~6% | Diseño del popover, navegación, filtros |
| Infraestructura / herramientas operativas | ~6 | ~5% | Escáner, flujo de incorporación, prompts modulares (sesiones 4-5) |
| Documentación / gobernanza | ~6 | ~5% | CLAUDE.md, README, convenciones, excepciones estructurales |
| Andamiaje entre celdas | ~5 | ~4% | Cascadas entre celdas |
| Corrección de bugs | ~5 | ~4% | Wang→Ha, duplicado Madigan2020, BrauneKrickau2021, Crescenzi |
| Mejoras menores | ~3 | ~2% | Ajustes cosméticos distribuidos |

**Total estimado: ~129**

### 5.4 Resumen estadístico por sesión

| Sesión | Traspaso | N° cambios | Modelo | Foco principal |
|---|---|---|---|---|
| 1 | v01 | ~30 | Sonnet/Opus | Wireframe inicial React standalone |
| 2 | v02 | ~35 | Opus | Migración a estructura modular |
| 3 | v03 | ~35 | Opus | Build reproducible, JSONs validados, Fase 0-3 |
| entre 3-4 | — | ~3 | Sonnet | Fase 4 app.js, UX fix |
| 4 | v04 | 6 (con 27 sub-ediciones) | Opus | Bibliografía + prompts modulares |
| 5 | v05 | ~20 | Sonnet 4.6 | Infraestructura, limpieza editorial, integridad bibliográfica |

**Total acumulado: ~129 cambios.**

### 5.5 Detalle cronológico de cambios por sesión

### Sesiones 1-4 — ver traspaso v04 (ítems 1-11)

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v04.md`, sección 5.5. No se reproduce aquí para no inflar el documento; el backlog acumulativo completo está en ese traspaso.)*

---

### Sesión 5 (Sonnet 4.6) — 2026-05-29

Infraestructura, limpieza editorial y corrección de integridad bibliográfica sobre `refactor/modular-build`.

12. Creación de `00_escanear_proyecto.R`: script de escaneo adaptado al proyecto web (ancla por `.git`, destino `30_documentacion/estructura/`).
13. Configuración de `.gitignore` para ignorar snapshots timestamped del escáner; solo `estructura_actual.*` trackeados.
14. Remoción de snapshots timestamped ya commiteados del índice git (`git rm --cached`).
15. Documentación de excepción estructural P10 en `30_documentacion/activa/CLAUDE.md`: `30_documentacion/` como variante legítima, ausencia de `40_salidas/` explicada.
16. Actualización de `README.md`: rango etario corregido (0-12), rutas actualizadas, conteo bibliográfico actualizado, build modular documentado.
17. Agregado `BrauneKrickau2021` a `bibliografia.json` (group: regulation, type: review, DOI verificado en PubMed PMID 33452702).
18. Poblados refs huérfanos en `socioemocional-lactante[0]` y `comportamiento-lactante[0]` con `BrauneKrickau2021`.
19. Eliminada cita inline de Crescenzi Lanna & Grané Oro 2019 de `fisica-preescolar[0]` (paper no verificado contra claim de motricidad fina).
20. Contador de referencias únicas por dimensión: etiqueta cambiada de `(N)` a `(N referencias)` con singular/plural correcto.
21. Eliminación hand-curated de citas inline `(Autor et al., año)` de 54 claims, preservando datos metodológicos (N=, tamaños muestrales, detalles de diseño). Aprobación claim por claim por el usuario.
22. Actualización de convención de citas en `CLAUDE.md`: de `(Autor et al., año) [ref]` a solo chips `[ref]`.

---

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron 11 cambios correlativos (ítems 12-22) correspondientes a la sesión 5.
- Categoría nueva: "Limpieza editorial" (~13% del total) para P-nuevo-B y correcciones de integridad.
- Categoría "Infraestructura / herramientas operativas" reforzada con el escáner.
- Categoría "Documentación / gobernanza" separada de "Documentación operativa" del v04 para mayor claridad.

---

## 6. Bugs encontrados y su resolución

No se encontraron bugs nuevos en esta sesión. Los hallazgos de integridad bibliográfica (huérfanas, mismatches) son deuda heredada documentada en pendientes, no bugs introducidos en sesión 5.

**Bugs pendientes sin resolver (heredados):**

- **Bug 5 — Huérfanas puras (3 claims):**
  - `cognicion-ninez-media[2]`: cita "SMART Schools, Lancet 2025", `refs=[]`, sin entrada en biblio.
  - `salud-mental-preescolar[0]`: citas Skalická 2019 y Liu 2024, `refs=[]`, sin entradas.
  - `sueno-primera-infancia[0]`: citas Janssen 2020, Li 2020, Belmon 2019; solo Janssen2020 existe en biblio pero no está enlazado.

- **Bug 6 — Mismatches cita↔ref (2 claims):**
  - `cognicion-lactante[0]`: texto menciona Wass & Goldenberg 2025, chip apunta a AAP2024.
  - `vinculo-primera-infancia[1]`: texto menciona Xu & Qiao 2025, chip apunta a Mallawaarachchi2024.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** El contador `paperCountByDim` en la matriz no era visible porque el sitio se visitaba en GitHub Pages (versión vieja). Para validar cambios de JS/CSS, siempre abrir `index.html` local, no el sitio publicado.
  - **Principio:** C.2 (reproducibilidad).
  - **Contexto:** GitHub Pages sirve desde `main`; los cambios en `refactor/modular-build` no son públicos hasta el merge de Fase 6.

- **Regla:** Las ediciones masivas de texto en claims deben ser hand-curated, no por regex. Un regex sobre texto con paréntesis mixtos (citas + datos metodológicos + notas) produce daño colateral inevitable.
  - **Principio:** B.3 (cambios quirúrgicos).
  - **Contexto:** El script regex eliminaba `(N=6.281; Gath et al., 2025)` completo, perdiendo el N=. La edición manual preservó todos los datos metodológicos.

- **Regla:** Antes de ejecutar cualquier script de edición masiva sobre `claims.json`, correr dry-run explícito y revisar los casos límite.
  - **Principio:** C.8 (validación de integridad).
  - **Contexto:** Claude Code detectó el problema antes de escribir; el dry-run mostró el daño potencial.

*(Reglas de sesiones anteriores vigentes: `set -e` obligatorio en cadenas bash, verificar autoría en PubMed, verificar IDs contra estado actual de biblio antes de proponer batch.)*

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: Aceptar `30_documentacion/` como variante legítima (P10, opción b)

- **Decisión:** No migrar a `50_documentacion/`. Documentar la excepción en CLAUDE.md, README y como nota en POLITICA_PROYECTO.md.
- **Alternativas:** (a) migrar a `50_documentacion/` (media complejidad, alto costo por referencias distribuidas); (c) renumerar toda la estructura (alta complejidad).
- **Justificación:** El proyecto lleva 5 sesiones con esta estructura, todos los traspasos y rutas la usan. Migrar solo para alinear con la política no aporta valor funcional.
- **Implicancia:** Cualquier agente nuevo debe leer CLAUDE.md antes de generar rutas.

#### Decisión 2: Eliminar citas inline de autor del corpus (nueva convención)

- **Decisión:** Las referencias van solo como chips `[ref]` navegables. El texto del claim no lleva `(Autor et al., año)`.
- **Alternativas:** Mantener convención anterior `(Autor et al., año) [ref]`.
- **Justificación:** Las citas inline interrumpen la lectura y duplican información disponible en el chip. El usuario quiere que el texto vaya "directo al grano".
- **Tensiones:** C.11 (trazabilidad) vs. legibilidad. Resuelto: la trazabilidad se mantiene vía chips; lo que se elimina es la redundancia.
- **Implicancia:** Todo claim nuevo debe seguir esta convención. Los datos metodológicos entre paréntesis (N=, tamaños muestrales) sí se conservan en el texto.

#### Decisión 3: Snapshots timestamped del escáner no se trackean en git

- **Decisión:** Solo `estructura_actual.md` y `estructura_actual.txt` se trackean. Los `YYYYMMDD_HHMMSS_estructura.*` se ignoran via `.gitignore`.
- **Justificación:** Consistente con cómo se trata `30_documentacion/versiones/` (snapshots locales ignorados). Evita crecimiento del historial git.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante / convención | Valor | Archivo | Nota |
|---|---|---|---|
| Total entradas bibliografia.json | 74 | `10_fuentes/data/bibliografia.json` | +1 BrauneKrickau2021 vs v04 |
| Total claims | 133 | `10_fuentes/data/claims.json` | Sin cambio en cantidad, 54 textos editados |
| Total celdas | 50 | `claims.json` | 10 dimensiones × 5 tramos |
| Rama de trabajo | `refactor/modular-build` | n/a | 16 commits adelante de origin |
| Último commit | `426ead8` | git | Working tree limpio |
| Paleta de colores | `#042f4d`, `#5c728e`, `#d6dfe8` | `styles.css` | Sin cambio |
| Ventana temporal corpus | 2020-2026 | n/a | Excepción: anchors institucionales |
| Build script | `./00_build.sh` | raíz | Regenera `index.html` desde JSON |
| Encadenamiento bash en Claude Code | `set -e` obligatorio | n/a | Regla del Bug 2 (v04) |
| Carpeta documentación | `30_documentacion/` | n/a | Excepción documentada en CLAUDE.md. Ver Decisión 1. |
| Convención de citas en claims | Solo chips `[ref]`, sin autor inline | `CLAUDE.md` | Cambiado en sesión 5. Ver Decisión 2. |
| Datos metodológicos en claims | Se preservan inline (N=, tamaños) | `claims.json` | No se consideran "citas inline" |

---

## 10. Arquitectura de archivos relevante

Referencia al output del escáner: `30_documentacion/estructura/estructura_actual.md` (generado 2026-05-29 12:14:40, 10 carpetas, 43 archivos).

**Cambios estructurales en esta sesión:**

- Archivo nuevo: `00_escanear_proyecto.R` en raíz.
- Carpeta nueva: `30_documentacion/estructura/` con `estructura_actual.md`, `estructura_actual.txt` y snapshots timestamped (ignorados por git).
- Archivos modificados: `30_documentacion/activa/CLAUDE.md`, `README.md`, `.gitignore`.
- Sin cambios en la estructura de carpetas numeradas.

**Verificación contra política:**

- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Excepción documentada y aceptada (Decisión 1). Ver CLAUDE.md.
- Sin `40_salidas/`: excepción documentada (output es `index.html` en raíz).
- Naming respeta sección 2.3: snake_case, sin tildes/ñ/espacios.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: Responsive del panel lateral (P2)

- **Descripción:** El panel lateral de 360px fijo no es usable en mobile. Definir comportamiento (bottom sheet / colapsable / página dedicada) e implementar CSS+JS.
- **Tipo:** Funcionalidad nueva.
- **Impacto:** Sitio no usable en viewport <768px.
- **Complejidad:** Media.
- **Dependencias:** Ninguna bloqueante.
- **Principios relevantes:** B.1 (decisión arquitectónica primero), B.4 (criterio de éxito: viewport <768px funcional).
- **Precauciones:** Requiere decisión del usuario sobre el patrón de UI antes de implementar.
- **Criterio de éxito:** Viewport <768px funcional; ficha de celda accesible en mobile.

#### Pendiente 2: Resolver huérfanas puras (Bug 5, 3 claims)

- **Descripción:** 3 claims con citas de autor sin entrada en biblio ni chip navegable:
  - `cognicion-ninez-media[2]`: SMART Schools 2025.
  - `salud-mental-preescolar[0]`: Skalická 2019, Liu 2024.
  - `sueno-primera-infancia[0]`: Janssen 2020 (existe en biblio, falta enlazar), Li 2020, Belmon 2019.
- **Tipo:** Deuda epistémica / integridad bibliográfica.
- **Complejidad:** Baja-media (requiere verificación en PubMed y agregar entradas).
- **Criterio de éxito:** Validación cruzada sin huérfanas.

#### Pendiente 3: Resolver mismatches cita↔ref (Bug 6, 2 claims)

- **Descripción:** 2 claims donde el chip apunta a un autor distinto del mencionado en el texto:
  - `cognicion-lactante[0]`: Wass & Goldenberg 2025 → chip AAP2024.
  - `vinculo-primera-infancia[1]`: Xu & Qiao 2025 → chip Mallawaarachchi2024.
- **Tipo:** Deuda epistémica / integridad bibliográfica.
- **Complejidad:** Baja (requiere decisión: ¿el ref es el correcto o el texto es el correcto?).
- **Criterio de éxito:** Texto y chip apuntan al mismo paper.

#### Pendiente 4: Fase 5 — Secciones secundarias

- **Descripción:** Bibliografía buscable con filtros, andamiaje navegable, método, limitaciones, leyenda.
- **Tipo:** Funcionalidad nueva.
- **Dependencias:** Fase 4 implementada (cumplida). Recomendado resolver P2 (responsive) antes.
- **Complejidad:** Alta. 2-3 sesiones dedicadas.

#### Pendiente 5: Fase 6 — Validación pre-build, audit, PR, merge a main

- **Descripción:** Pre-commit hook, audit de paridad, CLAUDE.md actualizado, PR, merge.
- **Tipo:** Bloqueante para publicación pública.
- **Dependencias:** Fase 5.
- **Complejidad:** Media.
- **Criterio de éxito:** Sitio nuevo en `https://tomgc.github.io/crianza_y_pantallas/`.

#### Pendiente 6: Ejecución de prompts de búsqueda bibliográfica (P8/P9)

- **Descripción:** Usar los 11 prompts modulares con agentes externos. Empezar por `01_creatividad.md`. Actualizar lista "papers ya integrados" en los 11 archivos después de cada batch (P9).
- **Tipo:** Incorporación de evidencia.
- **Complejidad:** Una sesión web por dimensión (~11 sesiones futuras).

#### Pendiente 7: Reformular claims con sujeto = nombre de autor/institución (P-nuevo-C)

- **Descripción:** Claims que empiezan con el nombre del estudio o institución como sujeto (ej. "EYSTAG identifica..."). Reformular para ir directo al hallazgo.
- **Tipo:** Limpieza editorial.
- **Urgencia:** Baja.
- **Complejidad:** Baja-media (requiere diagnóstico + aprobación editorial).
- **Criterio de éxito:** Ningún claim empieza con nombre de autor, institución o estudio como sujeto.

#### Pendiente 8: Extender validación cruzada para detectar huérfanas inline

- **Descripción:** Agregar check al validador pre-build que detecte patrones `(Apellido, año)` en texto de claims sin correspondencia en `refs[]`. Actualmente el validador solo chequea que los IDs en `refs[]` existan en biblio.
- **Tipo:** Mejora de infraestructura.
- **Complejidad:** Baja.
- **Criterio de éxito:** Script de validación detecta los casos actuales (Bug 5 y 6) como warnings.

#### Pendiente 9: Descargar 6 PDFs UNICEF/CJE UC localmente

- **Tipo:** Documentación.
- **Complejidad:** Baja (10 minutos).

### 11.2 Evaluación de deuda técnica

- **Zona frágil:** 5 casos de integridad bibliográfica pendientes (Bug 5 y 6). El validador cruzado no los detecta porque chequea `refs[]` → biblio, no texto inline → biblio.
- **Oportunidad:** Extender el validador con regex sobre campo `text` (Pendiente 8).

- **Zona frágil:** Los 11 prompts de `prompts_busqueda/` tienen listas de "papers ya integrados" que deben actualizarse después de cada batch. Si no se actualizan, agentes externos proponen duplicados.
- **Oportunidad:** Script helper `actualizar_lista_integrados.sh` que lea `bibliografia.json` y actualice los 11 archivos.

### 11.3 Auditoría de cierre (sección F)

- **¿Cada bloque de transformación tiene check de validación? (C.8)** → Sí. Cada cambio a JSONs ejecutó validación con asserts antes de escribir.
- **¿Outputs reproducibles e idempotentes? (C.2, C.3)** → Sí. `./00_build.sh` regenera `index.html` desde JSON sin estado intermedio.
- **¿Decisiones metodológicas documentadas como constantes con nombre? (C.11)** → Parcialmente. Las decisiones epistémicas viven en commit messages y este traspaso. No aplica patrón clásico de constantes (proyecto es contenido + JSON, no pipeline de análisis).

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **Pendiente 2 + 3: Resolver huérfanas y mismatches** — Complejidad baja, integridad del corpus. Requiere verificar papers en PubMed. Criterio: validación cruzada sin huérfanas ni mismatches.
2. **Pendiente 7: Reformular claims con sujeto = autor/institución** — Complejidad baja, limpieza editorial. Diagnóstico + aprobación por el usuario.
3. **Pendiente 1: Responsive del panel lateral** — Decisión arquitectónica primero, luego implementación. Criterio: viewport <768px funcional.
4. **Pendiente 8: Extender validador cruzado** — Complejidad baja, mejora de infraestructura que previene regresiones futuras.

**Diferir:** Pendientes 4, 5, 6, 9 a sesiones dedicadas.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** integrar entradas bibliográficas sin verificar autoría primaria contra PubMed o DOI. Ver Bug 3 (v04).
- ⚠️ **NO** generar prompts para Claude Code con bloques bash separados sin `set -e`. Ver Bug 2 (v04).
- ⚠️ **NO** proponer entradas bibliográficas como nuevas sin verificar el estado actual de `bibliografia.json`. Ver Bug 1 (v04). Obtener IDs vigentes con:
  ```bash
  python3 -c "import json; print(sorted([b['id'] for b in json.load(open('10_fuentes/data/bibliografia.json'))]))"
  ```
- ⚠️ **NO** asumir que `POLITICA_PROYECTO.md` describe la estructura real del proyecto. El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1. Verificar con `ls` antes de generar rutas.
- ⚠️ **NO** agregar citas inline `(Autor et al., año)` al texto de claims. La convención desde sesión 5 es solo chips `[ref]`. Ver Decisión 2.
- ⚠️ **NO** usar regex ciego para ediciones masivas de texto en claims. Siempre hand-curated con aprobación claim por claim.
- ✅ **ANTES** de cualquier sesión: ejecutar `Rscript 00_escanear_proyecto.R` y adjuntar `estructura_actual.md`.
- ✅ **ANTES** de generar cualquier prompt de Claude Code, ejecutar el escáner del proyecto.
- 🔒 El sitio se publica desde `main` vía GitHub Pages. Cambios en `refactor/modular-build` no son públicos hasta el merge de Fase 6. Para validar cambios de JS/CSS, siempre abrir `index.html` local.

---

## 13. Fragmentos de código de referencia

### Flujo canónico de incorporación bibliográfica (con `set -e`)

```bash
set -e

python3 -c "
import json

# Cargar
biblio = json.load(open('10_fuentes/data/bibliografia.json'))
claims = json.load(open('10_fuentes/data/claims.json'))

# Verificar baseline
ids_existentes = {b['id'] for b in biblio}
assert 'NuevoId2025' not in ids_existentes, 'ID ya existe'
assert len(biblio) == 74, f'Esperado 74, hay {len(biblio)}'

# Agregar entrada
biblio.append({
    'id': 'NuevoId2025',
    'group': 'recent',      # debe existir en metadata.biblioGroups
    'type': 'review',       # debe existir en metadata.biblioTypes
    'authors': 'Apellido A., et al. 2025',
    'title': 'Titulo sin punto final',
    'journal': 'Journal Vol(N):pp',
    'url': 'https://doi.org/...'
})

# Verificar post-cambio
assert len(biblio) == 75

# Escribir
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

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 6 (Opus)`
(Reemplazar "Opus" por el modelo que vayas a usar.)

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos.
>
> ⚠️ Nota crítica: el proyecto usa `30_documentacion/`, no `50_documentacion/` como dice POLITICA_PROYECTO.md. Verificar con `ls` antes de generar rutas. Ver Decisión 1 del traspaso v05.
>
> ⚠️ Nueva convención desde sesión 5: los claims NO llevan citas inline `(Autor et al., año)`. Solo chips `[ref]`. Ver Decisión 2 del traspaso v05.
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

Si trabajas fuera de un Project, adjunta los cinco al nuevo chat.

**Opcionales según foco**

- `asistente_claude_code_seguro.md` — la próxima sesión probablemente usa Claude Code (responsive, validador, fixes bibliográficos).

**Documento de traspaso (adjuntar)**

- `30_documentacion/traspasos/traspaso-cierre-v05.md` (este documento)

**Output del escáner (adjuntar)**

- `30_documentacion/estructura/estructura_actual.md` (ejecutar `Rscript 00_escanear_proyecto.R` antes de abrir)

**Archivos del proyecto críticos (adjuntar)**

- `10_fuentes/data/bibliografia.json` — corpus, 74 entradas. Necesario para verificar IDs antes de cualquier batch.
- `10_fuentes/data/claims.json` — corpus, 50 celdas / 133 claims. Voluminoso pero necesario para fixes de Pendientes 2, 3 y 7.
- `10_fuentes/app.js` — necesario si la sesión toca responsive (Pendiente 1) o validador (Pendiente 8).
- `10_fuentes/css/styles.css` — solo si toca responsive.
- `30_documentacion/activa/CLAUDE.md` — convenciones actualizadas del proyecto.

**Datos o referencias externas**

No aplica.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
