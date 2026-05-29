# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v04 (actualizada post-cierre operativo)
- **Fecha:** 2026-05-28
- **Sesión:** 4 — Incorporación bibliográfica en dos batches, corrección de bug heredado de autoría, generación de prompts de búsqueda como herramienta de trabajo, y modularización de la herramienta en 11 archivos individuales.
- **Modelo utilizado:** Opus
- **Entorno:** Web (HTML/JSON/JS estático) con asistente-ejecutor: sesión web (este chat) + Claude Code para ejecución sobre el filesystem + acciones manuales del usuario en Finder para el commit final.
- **Archivos principales modificados:**
  - `10_fuentes/data/bibliografia.json` (52 → 65 entradas, +13 papers netos)
  - `10_fuentes/data/claims.json` (50 celdas, 120 → 132 claims, 27 ediciones en 16 celdas)
  - `index.html` (regenerado por `00_build.sh` en cada commit)
  - `30_documentacion/activa/prompts_busqueda/` (carpeta nueva, 12 archivos)
  - `30_documentacion/traspasos/traspaso-cierre-v04.md` (este documento)

---

## 2. Resumen ejecutivo

La sesión 4 abordó la incorporación sistemática de evidencia bibliográfica al corpus del sitio en la rama `refactor/modular-build`. Se integraron 13 referencias nuevas distribuidas en dos batches (8 primero, 5 después tras descartes y deduplicación), con 27 ediciones celda por celda en `claims.json`. En el medio se corrigió un bug epistémico heredado: la entrada `Wang2025` tenía autoría alucinada por una IA previa; tras verificación contra PubMed se renombró a `Ha2025` con autores coreanos correctos. Se descartaron 4 referencias del deep research de Gemini por filtrado de calidad. Como entregable operativo, se generó la carpeta `prompts_busqueda/` con 11 prompts modulares + README, diseñados para futuras búsquedas bibliográficas vía agentes externos. El cierre operativo enfrentó fricción al mover los entregables al repo (descarga, mover en Finder, eliminar duplicados), pero terminó limpio. Se detectó al final una discrepancia entre `POLITICA_PROYECTO.md` (que dice `50_documentacion/`) y la estructura real del proyecto (que usa `30_documentacion/`), documentada como Bug 4. La rama `refactor/modular-build` queda 4 commits adelante de origin con working tree limpio; no se pushó nada.

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Pipeline modular completo (Fase 1-4): estructura numerada, build script, JSONs validados, `app.js` operativo desde commit `5f5dde8`.
- Sitio renderiza correctamente. Validación visual hecha el 2026-05-28 sobre commit `baee3ed`.
- Build reproducible: `./00_build.sh` regenera `index.html` desde los JSON sin estado intermedio.
- Flujo de incorporación bibliográfica operativo: ejecutado dos veces con éxito en esta sesión.
- Validación cruzada automatizada detecta refs huérfanos, duplicados, y conteos por celda.
- Herramienta de búsqueda bibliográfica modularizada: 11 prompts autocontenidos + README en `30_documentacion/activa/prompts_busqueda/`.

### Qué no funciona

- Push a remoto pendiente: 4 commits sin pushear. Push diferido a Fase 6.
- `main` sirve HTML viejo via GitHub Pages. Cambios de la sesión no son públicos.
- Cita huérfana en `fisica-preescolar` claim 0 (Crescenzi Lanna & Grané Oro 2019) sin entrada en `bibliografia.json`. Deuda heredada.
- Responsive del panel lateral no abordado. Compromiso pendiente para Fase 5.
- Discrepancia estructural política-proyecto: política dice `50_documentacion/`, proyecto usa `30_documentacion/`. Ver Bug 4.

### Qué cambió respecto al traspaso v03

| Aspecto | v03 (cierre) | v04 (cierre) |
|---|---|---|
| Estado de Fase 4 | Pendiente bloqueante absoluto | Implementada entre sesiones, sitio renderiza |
| `bibliografia.json` | 52 entradas | 65 entradas |
| `claims.json` | 120 claims | 132 claims |
| Refs huérfanos | Sin tracking sistemático | Validación cruzada pre-commit |
| Bug epistémico Wang2025 | Presente sin detectar | Detectado y corregido |
| Herramienta de búsqueda bibliográfica | Inexistente | 11 prompts modulares + README |
| Discrepancia política-estructura | No registrada | Detectada y documentada como Bug 4 |
| Commits adelante de origin | 0 | 4 |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: Primer batch bibliográfico — 8 entradas + 14 ediciones

- **Archivos:** `bibliografia.json`, `claims.json`, `index.html`
- **Categoría:** Incorporación de evidencia
- **Qué se hizo:** 8 entradas nuevas (Karani2022, AAP2024, AAP2016, Foreman2024, Wang2025, LlanosMerin2024, Gomes2024, NSF2024) + 14 ediciones en 11 celdas (12 Caso A + 2 Caso B en visión). Cambio de certainty medium→high en las dos celdas de visión.
- **Por qué:** Aprovechar tributaciones pendientes de papers previos y agregar evidencia robusta sobre visión y sueño que el corpus tenía sub-cubierta.
- **Verificación:** Script de validación cruzada con 6 secciones, pasó al primer intento.
- **Commit:** `376c3de`. Diff: +268 / -34 líneas.
- **Tensiones:** B.2 vs. inflación de refs. Se descartaron 8 tributaciones marginales del adjunto.

#### Cambio 2: Corrección bug epistémico Wang2025 → Ha2025

- **Archivos:** `bibliografia.json`, `claims.json`, `index.html`
- **Categoría:** Corrección de bug epistémico heredado
- **Qué se hizo:** Rename de id `Wang2025` a `Ha2025` con autoría corregida (de "Wang X." inventada a "Ha A., Lee Y.J., Lee M., Shim S.R., Kim Y.K."). Find-and-replace en `claims.json` (2 ocurrencias) y texto inline.
- **Por qué:** Verificación en PubMed reveló autoría coreana real (DOI 10.1001/jamanetworkopen.2024.60026, PMID 39982728). Tener autoría falsa contamina credibilidad epistémica.
- **Verificación:** Script específico de 6 condiciones, pasó.
- **Commit:** `df17dbf`. Diff simétrico: +14 / -14 líneas.
- **Tensiones:** C.11 (trazabilidad) vs. B.3 (cambios quirúrgicos). Resuelto: corrección quirúrgica de strings.

#### Cambio 3: Filtrado del deep research de Gemini

- **Archivos:** Ninguno directamente; entrada al Cambio 4.
- **Categoría:** Análisis bibliográfico (decisión epistémica sin código)
- **Qué se hizo:** Análisis de documento de Gemini con 10 referencias. Verificación una por una en PubMed/DOI. Resultados: 5 integradas (He2025, Bakht2025, Gath2025, Bustamante2023, AguilarFarias2021), 4 descartadas o pre-existentes, 1 confirmación crítica que gatilló el Cambio 2 (Ha=Wang).
- **Por qué:** Documento de Gemini mezclaba papers reales con prosa generada de calidad heterogénea. Sin filtrado, hubiéramos integrado alucinaciones.
- **Verificación:** Cada paper verificado contra PubMed/journal.
- **Tensiones:** B.1 vs. tentación de tomar el documento como bloque. Resuelto con verificación uno por uno.

#### Cambio 4: Segundo batch bibliográfico — 5 entradas + 13 ediciones

- **Archivos:** `bibliografia.json`, `claims.json`, `index.html`
- **Categoría:** Incorporación de evidencia
- **Qué se hizo:** 5 entradas nuevas (He2025, Bakht2025, Gath2025, Bustamante2023, AguilarFarias2021) + 13 ediciones en 9 celdas (3 Caso A + 10 claims nuevos). Detección de duplicado de Madigan2020 en validación cruzada; recovery con `git reset --soft HEAD~1`, dedup, re-commit.
- **Por qué:** Cubrir vacíos: motricidad, evidencia chilena pandemia, null finding función ejecutiva, cohorte longitudinal grande, meta-análisis prospectivo sueño.
- **Verificación:** Script con conteos por celda. Detectó el duplicado, se corrigió, re-ejecución limpia.
- **Commit final:** `baee3ed`.
- **Tensiones:** B.2 vs. C.11. En `cognicion-preescolar` conviven Gath2025 (asociación negativa) y Bustamante2023 (null). Resuelto declarando divergencia explícita en el texto del claim de Bustamante2023.

#### Cambio 5: Generación inicial de prompts de búsqueda (versión monolítica)

- **Categoría:** Documentación de herramientas operativas
- **Qué se hizo:** Archivo único monolítico de 883 líneas con 11 prompts + preámbulo común externo (entregado al usuario; no commiteado en el repo).
- **Por qué:** Petición explícita del usuario; el flujo bibliográfico necesitaba herramienta sistemática para futuras búsquedas.
- **Resultado:** Descartado luego en favor del Cambio 6 tras feedback del usuario.

#### Cambio 6: Modularización a 11 archivos individuales + README

- **Archivos:** `30_documentacion/activa/prompts_busqueda/` con 12 archivos (README + 11 prompts numerados 01-11).
- **Categoría:** Documentación de herramientas operativas
- **Qué se hizo:** A pedido del usuario ("muy confuso como lo estructuraste, no me sirve preámbulo general arriba y luego prompts con espacios de 'pega aquí'"), se separaron los 11 prompts en archivos individuales autocontenidos. Cada uno tiene el preámbulo completo escrito íntegramente al inicio, sin placeholders externos. Se generó README con orden de uso, reglas operativas, frecuencia, actualización de listas.
- **Por qué:** El monolítico requería que el usuario armara cada prompt copiando dos secciones. La modularización elimina esa fricción.
- **Verificación:** Validaciones automáticas: sin placeholders externos, todas las 8 secciones obligatorias presentes, dimensión correcta en cada archivo. 85 KB en total, 120-125 líneas por archivo.
- **Commit:** `056a859` (junto con el traspaso v04 y eliminación del archivo viejo monolítico).
- **Tensiones:** B.2 (un archivo es más simple de generar) vs. usabilidad real. Resuelto a favor de usabilidad tras feedback.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020-2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON via `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1-4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación. La sesión 4 introdujo una nueva categoría "Incorporación de evidencia" no presente en sesiones 1-3.*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~23% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~19% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Incorporación de evidencia | 13 | ~12% | Sesión 4: 13 papers + 27 ediciones + 1 corrección epistémica. Categoría nueva. |
| Diseño visual y UX | ~15 | ~14% | Wireframe B, paleta, estados vacíos, placeholders |
| Implementación de motor JS | ~8 | ~7% | Fase 4: `app.js`, render, panel lateral, popovers, deep linking |
| Bibliografía y popovers | ~7 | ~7% | Diseño del popover, navegación, filtros |
| Andamiaje entre celdas | ~5 | ~5% | Cascadas entre celdas |
| Documentación operativa | ~5 | ~5% | Flujo, traspasos, prompts modularizados (sesión 4) |
| Corrección de bugs | ~4 | ~4% | Wang→Ha, duplicado Madigan2020, bugs render previos |
| Mejoras menores | ~5 | ~5% | Ajustes cosméticos distribuidos |

**Total estimado: ~107**

### 5.4 Resumen estadístico por sesión

| Sesión | Traspaso | N° cambios | Modelo | Foco principal |
|---|---|---|---|---|
| 1 | v01 | ~30 | Sonnet/Opus | Wireframe inicial React standalone |
| 2 | v02 | ~35 | Opus | Migración a estructura modular |
| 3 | v03 | ~35 | Opus | Build reproducible, JSONs validados, Fase 0-3 |
| entre 3-4 | — | ~3 | Sonnet | Fase 4 app.js, UX fix |
| 4 | v04 | 6 (con 27 sub-ediciones) | Opus | Bibliografía + prompts modulares |

**Total acumulado: ~107 cambios.**

### 5.5 Detalle cronológico — Sesión 4 (Opus) — 2026-05-28

Incorporación bibliográfica sistemática en dos batches sobre `refactor/modular-build`, con corrección de bug epistémico heredado y generación de prompts modularizados.

1. Primer batch bibliográfico: 8 entradas nuevas + 14 ediciones en 11 celdas. Commit `376c3de`.
2. Detección del bug epistémico Wang2025 durante análisis del segundo lote.
3. Corrección Wang2025 → Ha2025: rename + find-and-replace + texto inline. Commit `df17dbf`.
4. Filtrado del deep research de Gemini: 10 referencias verificadas una por una. 5 integradas, 4 descartadas, 1 confirmación crítica.
5. Segundo batch bibliográfico: 5 entradas + 13 ediciones. Recovery por duplicado Madigan2020 (reset, dedup, re-commit). Commit final `baee3ed`.
6. Validación visual del sitio: render correcto.
7. Generación inicial de prompts como archivo monolítico (descartado).
8. Modularización a 11 archivos individuales + README en carpeta `prompts_busqueda/`.
9. Generación de traspaso v04 (primera versión).
10. Commit de cierre `056a859`: traspaso + carpeta `prompts_busqueda/` + eliminación archivo viejo monolítico. Working tree limpio. 4 commits adelante de origin.
11. Detección al cierre de discrepancia POLITICA_PROYECTO.md (dice `50_documentacion/`) vs. estructura real (`30_documentacion/`). Documentado como Bug 4.

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron 11 cambios correlativos correspondientes a la sesión 4.
- Categoría temática nueva: "Incorporación de evidencia" (~12% del total).
- Se reconoció el avance entre sesiones de Fase 4 fuera de sesión web formal.
- Versión actualizada del traspaso v04 incluye Cambio 6 (modularización), commit final `056a859`, y Bug 4 (discrepancia política-estructura) que no estaban en la versión inicial.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: Duplicado de Madigan2020 en `bibliografia.json` durante segundo batch

- **Síntoma:** Script de validación cruzada arrojó `✗ IDs duplicados en biblio`. Madigan2020 apareció dos veces.
- **Causa raíz:** Error de la sesión web al generar el prompt: propuso Madigan2020 como entrada nueva cuando el paper ya existía desde sesión 3. La verificación se hizo contra estado original, no contra estado actualizado tras primer batch. El propio prompt era internamente inconsistente: commit message decía "el batch cierra el loop" pero el JSON proponía agregar entrada nueva.
- **Solución:** Recovery: `git reset --soft HEAD~1`, eliminación de la segunda ocurrencia, re-validación con conteos ajustados (65 en lugar de 66), re-commit `baee3ed`.
- **Verificación:** `len(biblio) == 65`, sin duplicados, Madigan2020 en refs exactamente 2 veces. Commit defectuoso `46abaa1` no aparece en `git log`.
- **Patrón aprendido:** Verificar el estado actual de `bibliografia.json` contra cada ID propuesto, no el estado de hace varios turnos.
- **Principios:** Violó C.8. Cumplió B.1 al declarar el problema antes de propagarlo.
- **Estado:** Resuelto.

#### Bug 2: Encadenamiento bash en Claude Code permite commit ante fallo de validación

- **Síntoma:** El commit defectuoso `46abaa1` se ejecutó pese a que el script de validación falló con `SystemExit(1)`.
- **Causa raíz:** Prompt encadenaba validación, build y commit en bloques bash separados sin `set -e`. El `SystemExit(1)` de Python no propagó.
- **Solución:** En el recovery, Claude Code encadenó todo en un único bash con `set -e` al inicio. Cualquier exit ≠ 0 aborta antes del commit.
- **Verificación:** Re-ejecución del segundo batch pasó al primer intento.
- **Patrón aprendido:** Todo prompt para Claude Code con validación previa a commit debe usar `set -e` o `&&`. Encadenar con `;` o bloques separados es inseguro.
- **Principios:** Violó C.9. Aprendizaje aplicado.
- **Estado:** Resuelto en flujo. Pendiente codificarlo en documentación operativa permanente (Pendiente 7).

#### Bug 3: Autoría falsa heredada en bibliografia.json (Wang2025)

- **Síntoma:** Verificación en PubMed reveló autores coreanos (Ha A., Lee Y.J., Lee M., Shim S.R., Kim Y.K.), no "Wang X." como decía el corpus.
- **Causa raíz:** El adjunto bibliográfico original (otra IA) alucinó la autoría. La sesión web no verificó autoría primaria antes de proponer la entrada.
- **Solución:** Rename a Ha2025 con autoría correcta. Commit `df17dbf`.
- **Verificación:** PubMed PMID 39982728 confirma autores Ha A. et al. Mismo N=335.524, edad 9.3, hallazgo 21%.
- **Patrón aprendido:** Toda entrada bibliográfica debe verificarse autoría primaria contra PubMed/DOI antes del commit. La autoría se puede alucinar separadamente del paper, datos, y DOI. Regla incorporada en los 11 prompts modularizados como Regla anti-alucinación 1.
- **Principios:** Violó C.11.
- **Estado:** Resuelto. Regla preventiva codificada en `30_documentacion/activa/prompts_busqueda/`.

#### Bug 4: Discrepancia entre POLITICA_PROYECTO.md y estructura real del proyecto

- **Síntoma:** Al cierre, `git status` mostró archivos en `30_documentacion/`, no en `50_documentacion/` como decía la política. El traspaso v04 inicial generó todas las rutas asumiendo política. El usuario tuvo que mover archivos manualmente y se creó por error una carpeta `50_documentacion/` paralela.
- **Causa raíz:** Discrepancia heredada entre POLITICA_PROYECTO.md (que dice `50_documentacion/`) y la estructura real del proyecto `crianza_y_pantallas` (que usa `30_documentacion/`). Probablemente proviene de migración estructural en sesiones 2-3, anterior a la consolidación de POLITICA v4. Nadie corrigió ni la política ni la estructura para alinearlas.
- **Solución:** Detección al cierre, eliminación manual de la carpeta `50_documentacion/` errónea, movimiento manual de la carpeta `prompts_busqueda/` y `traspaso-cierre-v04.md` a `30_documentacion/`. Versión actualizada del traspaso corrige todas las rutas a `30_documentacion/`.
- **Verificación:** Working tree limpio tras commit `056a859`. Sin carpeta `50_documentacion/`. Archivos en `30_documentacion/activa/prompts_busqueda/` y `30_documentacion/traspasos/traspaso-cierre-v04.md`.
- **Patrón aprendido:** El asistente debe verificar la estructura real del proyecto (vía `ls` o escáner) antes de generar rutas en documentos, no asumir que la política aplica uniformemente. Durante apertura, el `prompt-apertura-sesion.md` debe activar la verificación contra estructura real.
- **Principios:** Violó C.7 (portabilidad) y C.11 (trazabilidad).
- **Estado:** Resuelto operativamente. Pendiente decisión arquitectónica más amplia (Pendiente 10): ¿migrar a `50_documentacion/`, aceptar `30_documentacion/` como variante, o renumerar?

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Toda entrada bibliográfica debe verificarse autoría primaria contra PubMed o DOI antes del commit.
  - **Principio:** C.11.
  - **Contexto:** Los agentes pueden alucinar autoría aunque acierten paper, datos y DOI.
  - **Ejemplo:** Bug 3.

- **Regla:** Antes de proponer un batch bibliográfico, verificar el estado actual de `bibliografia.json` contra cada ID propuesto.
  - **Principio:** C.8 + B.3.
  - **Contexto:** Sesiones largas acumulan estados intermedios; verificación contra snapshot viejo introduce duplicados.
  - **Ejemplo:** Bug 1.

- **Regla:** Todo prompt para Claude Code con validación previa a commit debe encadenar con `set -e` o `&&`.
  - **Principio:** C.9.
  - **Contexto:** Bloques bash separados sin `set -e` ignoran códigos de salida.
  - **Ejemplo:** Bug 2.

- **Regla:** Cuando se incorpora un paper que contradice evidencia previa, declarar la divergencia explícitamente, no resolver en silencio.
  - **Principio:** B.1 + C.11.
  - **Contexto:** Integración silenciosa da falsa sensación de consenso.
  - **Ejemplo:** `cognicion-preescolar` con Gath2025 vs. Bustamante2023.

- **Regla:** Filtrado de outputs de deep research externos requiere verificación uno por uno; no aceptar como bloque ni descartar como bloque.
  - **Principio:** B.1 + C.11.
  - **Ejemplo:** Cambio 3 (10 → 5 integradas).

- **Regla:** Herramientas operativas entregadas al usuario deben minimizar fricción de uso. Modular es mejor que monolítico cuando el uso es repetido.
  - **Principio:** B.2 (simplicidad de uso, no de generación).
  - **Ejemplo:** Cambio 6 (refactor monolítico → 11 archivos).

- **Regla:** El asistente debe verificar la estructura real del proyecto antes de generar rutas, no asumir que la política aplica.
  - **Principio:** C.7 + C.11.
  - **Ejemplo:** Bug 4.

- **Restricción:** Sitio se publica desde `main` vía GitHub Pages. Cambios en `refactor/modular-build` no visibles públicamente hasta merge.
- **Restricción:** Build (`./00_build.sh`) regenera `index.html` desde JSON. No editar `index.html` a mano.
- **Restricción estructural:** El proyecto usa `30_documentacion/`. Mientras la discrepancia con POLITICA_PROYECTO.md persista (Pendiente 10), toda nueva documentación va en `30_documentacion/`.

---

## 8. Decisiones de diseño tomadas

#### Decisión 1: Tipo `scoping review` se asimila a `review`

- **Decisión:** No agregar nuevo `biblioType`. Karani2022 (scoping review) entra con `type: "review"`.
- **Alternativas:** (a) agregar `scoping` como tipo nuevo; (b) asimilar a `review`; (c) categoría híbrida.
- **Justificación:** Agregar tipo nuevo afectaría filtros UI. La diferencia metodológica vive en campo de banderas.
- **Tensiones:** B.2 vs. C.11. A favor de B.2.

#### Decisión 2: AAP2016 en `group: "anchor"`

- **Decisión:** AAP2016 clasificado como `anchor` (Documento anclaje 0-5 años).
- **Alternativas:** (a) group nuevo "anchor histórico"; (b) asimilar a `intl`; (c) `anchor`.
- **Justificación:** Cumple rol anchor pese a estar reemplazado por AAP2026. Crear group nuevo solo para una entrada es overengineering.

#### Decisión 3: Cambio de certainty medium → high en celdas de visión

- **Decisión:** `vision-ninez-media` y `vision-preadolescencia` suben a certainty `high`.
- **Justificación:** Conjunción de Ha2025 + Foreman2024 (dos meta-análisis robustos) justifica la subida.
- **Tensiones:** B.2 (no inflar) vs. C.11 (transparencia). A favor de C.11.

#### Decisión 4: Cuatro commits independientes en sesión 4

- **Decisión:** Cada commit corresponde a una intención conceptual distinta. No commit consolidado.
- **Justificación:** Narrativa de la sesión legible en `git log`.

#### Decisión 5: Prompts modulares y autocontenidos

- **Decisión:** 11 archivos individuales con preámbulo completo escrito íntegramente. No un archivo monolítico con placeholders.
- **Justificación:** Usuario reportó fricción de uso con el monolítico. Modularización elimina necesidad de armar el prompt al usarlo.
- **Tensiones:** B.2 (un archivo es más simple de generar) vs. usabilidad efectiva. A favor de usabilidad.

#### Decisión 6: Group de AguilarFarias2021

- **Decisión:** `type: "chilean"` + `group: "chile"`.
- **Justificación:** El valor central del paper para el corpus es ser evidencia chilena específica, no ser transversal. Los tipos `chilean` y `chile` existen precisamente para eso.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante / convención | Valor | Archivo | Nota |
|---|---|---|---|
| Total entradas bibliografia.json | 65 | `10_fuentes/data/bibliografia.json` | Tras commit `baee3ed` |
| Total claims | 132 | `10_fuentes/data/claims.json` | |
| Total celdas | 50 | `claims.json` | 10 dimensiones × 5 tramos |
| Rama de trabajo | `refactor/modular-build` | n/a | 4 commits adelante de origin |
| Último commit | `056a859` | git | Working tree limpio |
| Paleta de colores | `#042f4d`, `#5c728e`, `#d6dfe8` | `styles.css` | Doble codificación con shapes |
| Ventana temporal corpus | 2020-2026 | n/a | Excepción: anchors institucionales (AAP2016) |
| Build script | `./00_build.sh` | raíz | Regenera `index.html` desde JSON |
| Encadenamiento bash en Claude Code | `set -e` obligatorio | n/a | Regla del Bug 2 |
| Carpeta documentación | `30_documentacion/` | n/a | Discrepa de POLITICA (que dice `50_`). Ver Pendiente 10 |
| Prompts modulares | `30_documentacion/activa/prompts_busqueda/` | n/a | 12 archivos: README + 11 prompts |

---

## 10. Arquitectura de archivos relevante

Referencia al output del escáner: `30_documentacion/estructura/estructura_actual.md`.

**Cambios estructurales en esta sesión:**

- Carpeta nueva: `30_documentacion/activa/prompts_busqueda/` con 12 archivos.
- Archivo viejo eliminado: `30_documentacion/activa/prompt_busqueda_bibliografia.md` (versión monolítica).
- Documento de cierre nuevo: `30_documentacion/traspasos/traspaso-cierre-v04.md`.
- Sin cambios en pipeline principal, `metadata.json`, ni naming.

**Verificación contra política:**

- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Discrepancia heredada. Ver Bug 4 y Pendiente 10.
- Naming respeta sección 2.3: snake_case, sin tildes/ñ/espacios.
- La carpeta `prompts_busqueda/` cumple convención "documentación viva que se actualiza in place".

**Recordatorio:** ejecutar escáner al inicio de próxima sesión y validar discrepancia estructural antes de generar rutas.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: Cita huérfana en `fisica-preescolar` claim 0 (Crescenzi Lanna 2019)

- **Descripción:** Cita inline "Crescenzi Lanna & Grané Oro, 2019" en el texto, sin entrada `CrescenziLanna2019` en `bibliografia.json`.
- **Tipo:** Deuda epistémica.
- **Complejidad:** Baja.
- **Enfoque:** Verificar paper en Google Scholar; agregar entrada o eliminar cita inline.
- **Criterio:** Cero refs huérfanos detectados por validación cruzada extendida.

#### Pendiente 2: Responsive del panel lateral

- **Descripción:** Definir comportamiento mobile del panel lateral de 360px fijo (bottom sheet / colapsable / página dedicada).
- **Tipo:** Funcionalidad nueva.
- **Impacto:** Sitio no usable en mobile.
- **Complejidad:** Media.
- **Enfoque:** Decisión arquitectónica primero (con el usuario), luego implementación CSS+JS.
- **Criterio:** Viewport <768px funcional.

#### Pendiente 3: Fase 5 — Secciones secundarias

- **Descripción:** Bibliografía buscable con filtros, andamiaje navegable, método, limitaciones, leyenda.
- **Tipo:** Funcionalidad nueva.
- **Dependencias:** Fase 4 implementada (cumplida).
- **Complejidad:** Alta. 2-3 sesiones dedicadas.
- **Precaución:** No empezar sin haber resuelto responsive (Pendiente 2).

#### Pendiente 4: Fase 6 — Validación pre-build, audit, PR, merge a main

- **Descripción:** Pre-commit hook, audit de paridad, CLAUDE.md actualizado, PR, merge.
- **Tipo:** Bloqueante para publicación pública.
- **Dependencias:** Fase 5.
- **Complejidad:** Media.
- **Criterio:** Sitio nuevo en `https://tomgc.github.io/crianza_y_pantallas/`.

#### Pendiente 5: Sección recomendaciones UNICEF/CJE UC (P1 traspaso v03)

- **Descripción:** Contenido adicional con recomendaciones de UNICEF y CJE UC.
- **Tipo:** Contenido.
- **Dependencias:** Fase 6 mergeada.
- **Complejidad:** Media.

#### Pendiente 6: Descargar 6 PDFs UNICEF/CJE UC localmente (P5 traspaso v03)

- **Tipo:** Documentación.
- **Complejidad:** Baja (10 minutos).

#### Pendiente 7: Codificar regla de `set -e` en `flujo_incorporacion_evidencia.md`

- **Descripción:** Agregar sección "Reglas operativas para prompts a Claude Code" con la regla del `set -e` aprendida del Bug 2.
- **Tipo:** Documentación.
- **Complejidad:** Baja.
- **Criterio:** Sección presente en el flujo, commit registrado.

#### Pendiente 8: Ejecución de los 11 prompts de búsqueda bibliográfica

- **Descripción:** Pegar cada prompt en agente externo, traer output a sesión web, integrar al corpus.
- **Tipo:** Funcionalidad nueva (incorporación de evidencia).
- **Dependencias:** Ninguna.
- **Complejidad:** Una sesión web por dimensión = ~11 sesiones futuras.
- **Precauciones:** Verificar cada paper contra PubMed/DOI. Actualizar lista "papers ya integrados" en los 11 archivos (Pendiente 9).
- **Sugerencia de orden:** Empezar por creatividad (01), vínculo (02), salud-mental (03), socioemocional (04). Dejar sueño/visión/lenguaje para después (ya bien cubiertos).

#### Pendiente 9: Actualización de lista "papers ya integrados" después de cada batch

- **Descripción:** Cada uno de los 11 archivos de prompts contiene una sección con lista fija de IDs ya integrados. Debe refrescarse después de cada batch nuevo.
- **Tipo:** Mantenimiento de herramienta.
- **Impacto:** Si no se actualiza, agentes externos proponen duplicados.
- **Complejidad:** Baja (5-10 min por actualización).
- **Precaución:** Actualizar todos los 11 archivos, no solo el de la dimensión recién tocada.

#### Pendiente 10: Discrepancia POLITICA_PROYECTO.md ↔ estructura real

- **Descripción:** Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Detectado en Bug 4.
- **Tipo:** Deuda arquitectónica / documentación.
- **Impacto:** Cada asistente nuevo asume erróneamente la política hasta verificar la estructura.
- **Complejidad variable según opción:**
  - (a) Migrar `30_documentacion/` → `50_documentacion/`: media; requiere actualizar referencias.
  - (b) Aceptar `30_documentacion/` como variante legítima y documentarlo: baja.
  - (c) Renumerar toda la estructura: alta.
- **Sugerencia:** Mi inclinación inicial es (b), aceptar variante y documentar excepción. Migrar tiene costos altos.
- **Criterio:** Política y estructura alineadas, o discrepancia explícitamente documentada.

### 11.2 Evaluación de deuda técnica

- **Zona frágil:** Proposición de batches bibliográficos depende de verificación manual contra estado actual del corpus.
- **Oportunidad:** Helper `verificar_ids_propuestos.py` ejecutable antes de generar prompt.

- **Zona frágil:** Citas inline en `claims.json` no atadas a entradas formales de `bibliografia.json` (ejemplo Crescenzi Lanna).
- **Oportunidad:** Extender validación cruzada con regex sobre campo `text` que detecte patrones `(Apellido et al., AÑO)`.

- **Zona frágil:** Flujo asesor-ejecutor con sistema de archivos remoto generó fricción en el cierre (descarga, mover en Finder, eliminar duplicados).
- **Oportunidad:** Entregar archivos en estructura idéntica a la del repo para que el `mv` desde Descargas sea trivial.

### 11.3 Auditoría de cierre (sección F)

- **¿Cada bloque de transformación tiene check de validación? (C.8) →** Sí. Cada commit bibliográfico ejecutó validación cruzada antes de commitear.
- **¿Outputs reproducibles e idempotentes? (C.2, C.3) →** Sí. `./00_build.sh` regenera `index.html` desde JSON sin estado intermedio.
- **¿Decisiones metodológicas documentadas como constantes con nombre? (C.11) →** Parcialmente. Las decisiones epistémicas viven en commit messages y este traspaso. No aplica patrón clásico de constantes (proyecto es contenido + JSON, no pipeline).

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

Criterios: (1) deuda crítica que bloquea a otros (Pendiente 10 primero), (2) compromisos heredados, (3) bloqueantes para publicación, (4) funcionalidad nueva, (5) contenido.

#### Ruta sugerida

1. **Pendiente 10: Resolver discrepancia política-estructura.** Justificación: bloquea coherencia de todo asistente nuevo. **Debe ir primero.** Criterio: estructura y política alineadas, o discrepancia explícitamente documentada.

2. **Pendiente 7: Codificar regla `set -e` en `flujo_incorporacion_evidencia.md`.** Justificación: aprendizaje del Bug 2 vive solo en este traspaso. Criterio: sección presente en flujo permanente.

3. **Pendiente 2: Responsive del panel lateral.** Justificación: compromiso pendiente, bloqueante para mobile. Criterio: viewport <768px funcional.

4. **Pendiente 1: Cita huérfana Crescenzi Lanna 2019.** Justificación: deuda epistémica, complejidad baja. Criterio: cero refs huérfanos.

5. **Pendiente 8 (parcial): Una ronda de prompt bibliográfico nuevo.** Justificación: ejercitar la herramienta recién creada. Empezar por `01_prompt_creatividad.md` (dimensión más vacía). Criterio: batch integrado, validación pasada, lista "papers ya integrados" actualizada en los 11 archivos (Pendiente 9).

**Diferir:** Pendientes 3, 4, 5, 6 a sesiones dedicadas.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** integrar entradas bibliográficas sin verificar autoría primaria contra PubMed o DOI. Ver Bug 3.

- ⚠️ **NO** generar prompts para Claude Code con bloques bash separados sin `set -e`. Ver Bug 2.

- ⚠️ **NO** proponer entradas bibliográficas como nuevas sin verificar el estado actual de `bibliografia.json`. Ver Bug 1. Obtener IDs vigentes con:

  ```bash
  python3 -c "import json; print(sorted([b['id'] for b in json.load(open('10_fuentes/data/bibliografia.json'))]))"
  ```

- ⚠️ **NO** asumir que `POLITICA_PROYECTO.md` describe la estructura real del proyecto. El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Bug 4 y Pendiente 10. Verificar con `ls` antes de generar rutas.

- ✅ **ANTES** de generar cualquier prompt de Claude Code, ejecutar el escáner del proyecto.

- ✅ **ANTES** de cada batch bibliográfico, refrescar la lista "Lo que ya tenemos integrado" en los 11 archivos de `30_documentacion/activa/prompts_busqueda/`.

- ✅ **ANTES** de empezar Fase 5, resolver responsive del panel lateral (Pendiente 2).

- ✅ **PRIMERO** abordar la discrepancia política-estructura (Pendiente 10) en la próxima sesión.

- 🔒 **NO MERGEAR** `refactor/modular-build` a `main` hasta Fase 6 completa.

- 🔒 **NO EDITAR** `index.html` a mano. Output regenerado por `./00_build.sh`.

- 🔒 **NO RENOMBRAR** IDs de celdas, bibliografía ni cascadas del andamiaje.

- 🔒 **PALETA DE COLORES FIJA:** `#042f4d`, `#5c728e`, `#d6dfe8`.

---

## 13. Fragmentos de código de referencia

### Validación cruzada estándar para batches bibliográficos

Ejecutar dentro de bash con `set -e` al inicio para que `SystemExit(1)` aborte antes del commit.

```bash
set -e

python3 << 'PYEOF'
import json
from pathlib import Path

DATA = Path("10_fuentes/data")
biblio = json.loads((DATA / "bibliografia.json").read_text())
claims = json.loads((DATA / "claims.json").read_text())
metadata = json.loads((DATA / "metadata.json").read_text())

biblio_ids = {b["id"] for b in biblio}
biblio_groups = {g["id"] for g in metadata["biblioGroups"]}
biblio_types = set(metadata["biblioTypes"].keys())

errors = []

# 1. Total y unicidad
if len(biblio) != EXPECTED_TOTAL:
    errors.append(f"Biblio esperado {EXPECTED_TOTAL}, hay {len(biblio)}")
if len(biblio_ids) != len(biblio):
    errors.append("IDs duplicados en biblio")

# 2. Entradas nuevas válidas
for nid in NUEVAS_IDS:
    entry = next((b for b in biblio if b["id"] == nid), None)
    if entry is None:
        errors.append(f"Falta entrada {nid}")
        continue
    if entry["group"] not in biblio_groups:
        errors.append(f"{nid}: group '{entry['group']}' no existe")
    if entry["type"] not in biblio_types:
        errors.append(f"{nid}: type '{entry['type']}' no existe")

# 3. Refs huérfanos
huerfanos = set()
for cid, cell in claims.items():
    for c in cell.get("claims", []):
        for r in c.get("refs", []):
            if r not in biblio_ids:
                huerfanos.add((cid, r))
if huerfanos:
    errors.append(f"Refs huérfanos: {huerfanos}")

# 4. Conteo de menciones por ID
for ref, expected in EXPECTED_COUNTS.items():
    count = sum(
        1
        for cell in claims.values()
        for c in cell.get("claims", [])
        if ref in c.get("refs", [])
    )
    if count != expected:
        errors.append(f"{ref}: esperado {expected}, hay {count}")

# 5. Total claims
total_claims = sum(len(c.get("claims", [])) for c in claims.values())
if total_claims != EXPECTED_CLAIMS_TOTAL:
    errors.append(f"Claims esperado {EXPECTED_CLAIMS_TOTAL}, hay {total_claims}")

# 6. Conteo por celda
for cid, expected in EXPECTED_CELL_COUNTS.items():
    actual = len(claims[cid].get("claims", []))
    if actual != expected:
        errors.append(f"{cid}: esperado {expected}, hay {actual}")

if errors:
    print("\n".join(f"  ✗ {e}" for e in errors))
    raise SystemExit(1)

print("✓ Validaciones OK")
PYEOF

./00_build.sh
git add 10_fuentes/data/bibliografia.json 10_fuentes/data/claims.json index.html
git commit -m "..."
```

### Shape de entrada bibliográfica

```json
{
  "id": "ApellidoPrimerAutorAÑO",
  "group": "uno_de_metadata.biblioGroups",
  "featured": true,
  "type": "uno_de_metadata.biblioTypes",
  "authors": "Apellido N., Apellido N., et al. AÑO",
  "title": "Título completo sin punto final",
  "journal": "Journal volumen(número):páginas. Notas opcionales",
  "url": "https://doi.org/... o pubmed PMID"
}
```

`featured` solo cuando es true. `url` puede ser `""` pero la regla del proyecto es URL verificable.

### Shape de claim

```json
{
  "certainty": "high|medium|low",
  "text": "Texto del claim. Permite markdown ligero: **negrita**.",
  "refs": ["Id1", "Id2"]
}
```

`refs` array de IDs que deben existir en `bibliografia.json`. Vacío `[]` si no tiene cita.

### Snippet para refrescar lista "papers ya integrados" en los 11 prompts

```bash
# Obtener IDs vigentes
IDS=$(python3 -c "import json; print(', '.join(sorted([b['id'] for b in json.load(open('10_fuentes/data/bibliografia.json'))])))")
echo "IDs vigentes: $IDS"
# Luego actualizar manualmente o con sed la sección "Papers ya integrados"
# en cada uno de los 11 archivos de 30_documentacion/activa/prompts_busqueda/
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido:** `Crianza y Pantallas, sesión 5 (Opus)`

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos.
>
> ⚠️ Nota crítica: el proyecto usa `30_documentacion/`, no `50_documentacion/` como dice POLITICA_PROYECTO.md. Verifica con `ls` antes de generar rutas. Ver Bug 4 y Pendiente 10 del traspaso v04.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos para la próxima sesión

**Documentos de protocolo (knowledge base del Project)**

NO requieren ser adjuntados. Verifica que estén disponibles:

- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md` (⚠️ con discrepancia respecto al proyecto real, ver Pendiente 10)
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md` (versión vigente: v3)
- `prompt-cierre-sesion.md`

Si trabajas fuera de un Project, adjunta los cinco al nuevo chat.

**Opcionales según foco**

- `asistente_claude_code_seguro.md` — la próxima sesión probablemente usa Claude Code (Pendientes 7, 8).

**Documento de traspaso (adjuntar)**

- `30_documentacion/traspasos/traspaso-cierre-v04.md` (este documento)

**Output del escáner (adjuntar)**

- `30_documentacion/estructura/estructura_actual.md` (ejecutar escáner antes de abrir)

**Archivos del proyecto críticos (adjuntar)**

- `10_fuentes/data/bibliografia.json` — corpus, 65 entradas tras `056a859`.
- `10_fuentes/data/claims.json` — corpus, 50 celdas / 132 claims (voluminoso pero necesario).
- `10_fuentes/data/metadata.json` — taxonomías.
- `30_documentacion/activa/flujo_incorporacion_evidencia.md` — protocolo del flujo.
- `30_documentacion/activa/prompts_busqueda/README.md` — instrucciones de uso de los 11 prompts.
- `10_fuentes/css/styles.css` — solo si toca responsive (Pendiente 2).
- `10_fuentes/app.js` — solo si toca responsive o Fase 5.

**Datos o referencias externas**

No aplica.

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo cambió después de este cierre, adjunta la versión más actualizada al abrir y avísalo en el mensaje de apertura.

---

*Fin del traspaso de cierre v04 (versión actualizada post-cierre operativo).*
