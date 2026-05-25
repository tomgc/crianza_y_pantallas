# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v03
- **Fecha:** 2026-05-25
- **Sesión:** 3 — Migración del flujo de trabajo a Claude Code en modo local, refactor mayor de arquitectura del sitio para modularizar fuentes (template + styles + data + app), elección del wireframe B como diseño visual definitivo, y extracción completa de la data del HTML hardcodeado a 4 archivos JSON estructurados.
- **Modelo utilizado:** Claude Opus 4.7 (sesión web como asesor estratégico) + Claude Code (ejecución local sobre filesystem)
- **Entorno:** Desarrollo Web — HTML/CSS/JS estático servido por GitHub Pages, working directory en macOS local (`/Users/tomgc/Projects/crianza_y_pantallas`)
- **Rama de trabajo:** `refactor/modular-build` (11 commits adelante de `main`, sin mergear)
- **Archivos principales modificados:**
  - `00_build.sh` (nuevo — orquestador del build)
  - `10_fuentes/template.html` (nuevo)
  - `10_fuentes/styles.css` (nuevo)
  - `10_fuentes/data/metadata.json` (nuevo)
  - `10_fuentes/data/bibliografia.json` (nuevo)
  - `10_fuentes/data/andamiaje.json` (nuevo)
  - `10_fuentes/data/claims.json` (nuevo)
  - `30_documentacion/activa/CLAUDE.md` (movido y actualizado)
  - `30_documentacion/activa/flujo_incorporacion_evidencia.md` (nuevo)
  - `30_documentacion/activa/prompt_busqueda_bibliografia.md` (nuevo)
  - `30_documentacion/andamios/wireframe-b-standalone.html` (nuevo, andamio histórico)
  - `30_documentacion/andamios/extraer_claims.py` (nuevo, andamio histórico)
  - `30_documentacion/traspasos/traspaso-cierre-v03.md` (este archivo)
  - `index.html` (regenerado por build, 2967 → 3055 líneas)
  - `.gitignore` (actualizado con rutas nuevas)
  - `CLAUDE.md` (raíz, ahora stub puntero a `30_documentacion/activa/CLAUDE.md`)

---

## 2. Resumen ejecutivo

Sesión transformadora con tres ejes simultáneos. Primero, se cerraron pendientes operativos heredados de la sesión 2: validación manual de las 7 URLs bibliográficas agregadas en v02 (todas operativas, con un caso de URL bloqueada por captcha que se reemplazó por URL canónica), acotación del claim de Carter2024 al alcance real del paper, y confirmación de que el push del repo y GitHub Pages estaban operativos. Segundo, se migró el flujo de trabajo de "Claude entrega archivo → usuario pega → commit manual" a un modelo asesor-ejecutor donde este chat planifica y valida mientras Claude Code edita archivos directamente sobre el repo local. Tercero, y de mayor profundidad, se ejecutó un refactor arquitectónico mayor motivado por la detección correcta del usuario de que el HTML único estaba creciendo exponencialmente; se separó el proyecto en fuentes editables (`10_fuentes/`), output publicado (`index.html` en raíz), y documentación viva (`30_documentacion/`), con un script de build en Bash + Python embebido que ensambla el HTML final desde template + styles + 4 JSON de datos. En paralelo se eligió el wireframe B "Datos como objeto" como dirección visual definitiva, con la decisión de reescribirlo a vanilla JS para honrar la restricción "sin dependencias externas" del proyecto. Estado al cierre: Fases 0-3 del refactor completas, 4 JSON de datos producidos y validados cruzadamente (refs, cellIds, groups, types: 0 huérfanos en las 4 validaciones), 11 commits limpios en rama feature, pendiente la implementación del wireframe B en vanilla JS (Fase 4), secciones secundarias (Fase 5) y merge a main con validación end-to-end (Fase 6).

---

## 3. Estado del proyecto al cierre

### Qué funciona

- **Estructura modular del repo** activa con numeración 00/10/20/30 conforme a `regla_estructura_proyectos.md`.
- **Build trivial reproducible:** `./00_build.sh` lee fuentes desde `10_fuentes/` y produce `index.html` en raíz. Última ejecución exitosa: commit `661b46d` (3055 líneas generadas).
- **4 archivos JSON de datos** validados internamente:
  - `metadata.json`: 5 tramos etarios, 10 dimensiones, 10 biblio types, 11 biblio groups, 7 filter types, secciones de Método (5) y Limitaciones (3).
  - `bibliografia.json`: 52 entradas, 52/52 IDs únicos, 100% group y type referencian metadata.
  - `andamiaje.json`: 6 cascadas, 15 claims totales, 16 cellIds referenciados en chains.
  - `claims.json`: 50 celdas (10 dim × 5 edades), 120 claims, 5 celdas con definitions (6 totales), 5 celdas con featured_studies (6 totales), 96 enlaces upstream/downstream entre celdas.
- **Validaciones cruzadas pasaron al cierre de Sub-fase 3.6:**
  - Refs en claims → existen en bibliografía (18/18 únicos, 0 huérfanos).
  - upstream/downstream.to → existen como key en claims.json (96 enlaces a 46 celdas, 0 huérfanos).
  - cellIds del andamiaje.chain → existen como key en claims.json (16 referenciados, 0 huérfanos).
  - Refs en featured_studies → existen en bibliografía (5/5 únicos, 0 huérfanos).
- **GitHub Pages activo** sirviendo el estado de `main` en `https://tomgc.github.io/crianza_y_pantallas/`. La rama `refactor/modular-build` aún no está mergeada, por lo que el sitio público sigue mostrando el HTML viejo.
- **Working tree limpio** al cierre, sin archivos pendientes ni untracked.
- **Convención de build documentada** en `CLAUDE.md`: todo commit que modifique `10_fuentes/` debe ejecutar el build e incluir el `index.html` regenerado.

### Qué no funciona

- **El sitio generado por el refactor (`refactor/modular-build`) NO tiene render visible**. El `index.html` actual de la rama feature contiene los 4 JSON inyectados en `window.__DATA__`, los estilos del wireframe B cargados, pero NO hay `app.js` que renderice. Síntoma observable: abrir el `index.html` muestra página en blanco con la tipografía del sistema cargada. Esto es estado intermedio esperado del refactor, NO un bug. Se resuelve en Fase 4.
- **CLAUDE.md tiene paleta y tipografía desactualizadas.** La sección "Convenciones del proyecto" sigue listando los colores y tamaños del sitio viejo (`#042f4d` con `#b07a4a` cálido, 15px base, line-height 1.65), no los del wireframe B (`#042f4d`/`#5c728e`/`#d6dfe8` sin cálido, 13px base, line-height 1.55). Síntoma: si un agente IA lee CLAUDE.md como contexto, recibe información obsoleta sobre el sistema visual vigente. Se corrige en Fase 6 cuando el wireframe esté implementado y los valores finales sean estables.
- **No hay validación automática pre-build.** Hoy las validaciones cruzadas (refs huérfanos, cellIds huérfanos, etc.) se ejecutan a mano cuando se sospecha de drift. Si un usuario edita JSON manualmente y comete error de IDs, el build no lo detecta. Síntoma observable: build exitoso con datos inconsistentes que solo se detectan al renderizar.

### Qué cambió respecto al traspaso v02

Cambio masivo de arquitectura. v02 cerró con HTML único de 2967 líneas con todo el código y la data hardcodeada; v03 cierra con repo modular separando fuentes, datos en JSON, build reproducible, y la mitad del refactor implementado. Detalle de deltas:

| Aspecto | v02 | v03 |
|---|---|---|
| Estructura raíz | Plana (`50_documentacion/`, `recursos/`) | Numerada `00/10/20/30` |
| HTML | Único 2967 líneas editable | Generado por build, 3055 líneas, no editable a mano |
| Datos | Hardcoded en `<script>` del HTML | 4 JSON en `10_fuentes/data/` |
| Estilos | Inline en `<style>` del HTML | `10_fuentes/styles.css` (CSS del wireframe B, no del sitio viejo) |
| Lógica de render | Mezclada con datos en el `<script>` | Pendiente, sale en Fase 4 a `10_fuentes/app.js` |
| Diseño visual | Sobrio, azul marino + cálido terracota | Wireframe B "Datos como objeto" (matriz + panel lateral + popovers + marca CL) |
| Flujo de trabajo | Web chat con copy-paste de archivos | Asesor-ejecutor: este chat planifica, Claude Code ejecuta sobre filesystem |
| Documentación de proceso | Solo traspasos | `CLAUDE.md` activo, `flujo_incorporacion_evidencia.md`, `prompt_busqueda_bibliografia.md` |
| Andamios históricos | No existía la carpeta | `wireframe-b-standalone.html` y `extraer_claims.py` preservados |
| Rama | Todo en `main` | Refactor en `refactor/modular-build`, `main` intocado |

---

## 4. Registro detallado de cambios realizados

#### Cambio 44: Validación manual de las 7 URLs bibliográficas agregadas en sesión 2 (P2)
- **Archivos afectados:** Ninguno. Tarea de verificación externa.
- **Categoría temática:** Validación bibliográfica
- **Qué se hizo:** Se accedió a cada URL (Sundqvist2021, Bal2024, Dutra2025, Jourdren2023, Russell2019, Pearson2018, Carter2024) verificando que el paper apuntado existe, que la URL carga, y que el alcance del paper calza con el claim al que se asoció en el HTML.
- **Por qué se hizo:** Pendiente P2 del traspaso v02. Las URLs habían sido validadas por búsqueda web sin verificar acceso ni concordancia conceptual con los claims que respaldan.
- **Cómo se verificó:** Acceso directo a cada URL desde el navegador de la sesión web. 6 de 7 URLs válidas y accesibles. Sundqvist2021 (PMC) bloqueado por captcha reCAPTCHA, no por error de URL. Carter2024 detectada como cita que excede el alcance del paper (paper trata smartphones problemáticos en adolescentes UK; claim hablaba de problemas conductuales y desempeño académico).
- **Líneas/secciones:** No aplica.
- **Dependencias afectadas:** Disparó los cambios 45 y 46.
- **Tensiones entre principios:** Ninguna.

#### Cambio 45: Acotar claim de Carter2024 al alcance real del paper
- **Archivos afectados:** `index.html` (en `main`, antes del refactor)
- **Categoría temática:** Precisión bibliográfica
- **Qué se hizo:** En L1706 del HTML viejo, cambio de "Uso problemático de pantalla se asocia con problemas conductuales, peor desempeño académico y problemas de salud mental (Carter et al., 2024)" a "Uso problemático de smartphone se asocia con mayor ansiedad y depresión en adolescentes (Carter et al., 2024)".
- **Por qué se hizo:** El paper Carter2024 (Acta Paediatrica 113(10):2240-2248) mide específicamente ansiedad y depresión en adolescentes UK 13-16 años con uso problemático de smartphone. No mide problemas conductuales ni desempeño académico. Aplicación de C.11 (transparencia del cambio): el claim debe reflejar lo que el paper sostiene, no afirmaciones extrapoladas.
- **Cómo se verificó:** Revisión del abstract del paper. Lectura cruzada del DOI 10.1111/apa.17317.
- **Líneas/secciones:** L1706 del `index.html` previo al refactor.
- **Dependencias afectadas:** Ninguna; cita aislada.
- **Tensiones entre principios:** Ninguna.

#### Cambio 46: Reemplazar URL de Sundqvist2021 por URL canónica de Frontiers
- **Archivos afectados:** `index.html` (en `main`, antes del refactor)
- **Categoría temática:** Precisión bibliográfica
- **Qué se hizo:** En L2678 del HTML viejo, cambio de `https://pmc.ncbi.nlm.nih.gov/articles/PMC7886794/` a `https://www.frontiersin.org/articles/10.3389/fpsyg.2021.569920/full`.
- **Por qué se hizo:** PMC bloquea acceso automatizado con captcha; la URL canónica de Frontiers da acceso directo al paper sin fricción.
- **Cómo se verificó:** Acceso exitoso a la nueva URL.
- **Líneas/secciones:** L2678 del `index.html` previo al refactor.
- **Dependencias afectadas:** Ninguna.
- **Tensiones entre principios:** Ninguna.

#### Cambio 47: Migrar flujo de trabajo a Claude Code en modo local
- **Archivos afectados:** Configuración del entorno; ningún archivo del repo cambia por esto.
- **Categoría temática:** Flujo de trabajo
- **Qué se hizo:** Configurar Claude Code (app macOS) en modo Local apuntando a `/Users/tomgc/Projects/crianza_y_pantallas`. Diagnóstico previo: se intentó modo cloud y se detectó que la sesión se ejecutaba en VM Linux remota, no en el Mac local. Se descartó y se configuró modo local con git branch tracking en `main`.
- **Por qué se hizo:** Para eliminar el ciclo "Claude entrega archivo → usuario descarga → usuario pega → usuario hace commit" que era costoso, propenso a error de copy-paste, y lento. El modo local permite que Claude Code edite archivos directamente sobre el filesystem y ejecute git commands.
- **Cómo se verificó:** `pwd` desde Claude Code devolvió `/Users/tomgc/Projects/crianza_y_pantallas`. `git status` mostró el repo correctamente trackeado.
- **Líneas/secciones:** No aplica.
- **Dependencias afectadas:** Habilita todos los cambios siguientes (48-72).
- **Tensiones entre principios:** Ninguna.

#### Cambio 48: Crear rama feature `refactor/modular-build` para aislar el refactor mayor
- **Archivos afectados:** Git branch
- **Categoría temática:** Gestión de versiones
- **Qué se hizo:** `git checkout -b refactor/modular-build` desde `main`.
- **Por qué se hizo:** El refactor toca toda la arquitectura del repo. Si algo sale mal, descartar la rama es trivial. Si sale bien, merge a main de una. Aplicación de B.2 (Simplicidad) en la gestión de cambios: una rama feature por trabajo mayor.
- **Cómo se verificó:** `git branch` mostró `* refactor/modular-build`.
- **Líneas/secciones:** No aplica.
- **Dependencias afectadas:** Todos los commits subsiguientes (47 commits hasta el cierre).
- **Tensiones entre principios:** Ninguna.

#### Cambio 49: Reorganizar estructura del repo de plana a numerada 00/10/20/30 (Fase 0)
- **Archivos afectados:** Toda la estructura. `recursos/` → `20_recursos/`, `50_documentacion/` → `30_documentacion/`, `CLAUDE.md` → `30_documentacion/activa/CLAUDE.md` + stub puntero en raíz. `.gitignore` actualizado con rutas nuevas. `.gitkeep` agregados en carpetas vacías.
- **Categoría temática:** Reorganización estructural
- **Qué se hizo:** `git mv` de todos los archivos a su nueva ubicación preservando historial. Eliminación de `.DS_Store` con `rm -f`. Mover `50_documentacion/versiones/` con `mv` regular (no estaba trackeado).
- **Por qué se hizo:** El repo viejo tenía numeración con saltos (`50_documentacion/`) y carpetas sin numerar (`recursos/`), violando los principios 2 y 3 de `regla_estructura_proyectos.md` ("El número refleja orden de ejecución" y "Sin saltos"). El refactor es el momento exacto para corregir.
- **Cómo se verificó:** `git status` mostró 5 renames detectados al 100% por git. `tree` confirmó la estructura nueva.
- **Líneas/secciones:** No aplica.
- **Dependencias afectadas:** Las rutas en CLAUDE.md (corregidas en cambio 56).
- **Tensiones entre principios:** Ninguna.

#### Cambio 50: Crear stub `CLAUDE.md` en raíz apuntando a `30_documentacion/activa/CLAUDE.md`
- **Archivos afectados:** `CLAUDE.md` (raíz, nuevo)
- **Categoría temática:** Documentación de proyecto
- **Qué se hizo:** Crear archivo `CLAUDE.md` en raíz con una línea: "Ver 30_documentacion/activa/CLAUDE.md".
- **Por qué se hizo:** Claude Code lee `CLAUDE.md` desde la raíz por convención. El archivo real vive en `30_documentacion/activa/` para mantener la raíz limpia, pero el stub permite que Claude Code lo encuentre.
- **Cómo se verificó:** Existencia del archivo verificada con `ls`.
- **Líneas/secciones:** Una línea.
- **Dependencias afectadas:** Claude Code en sesiones futuras lee este archivo primero.
- **Tensiones entre principios:** Mínima — duplica el archivo conceptualmente, pero es la solución más simple sin saber si `.claude/settings.json` soporta redirección.

#### Cambio 51: Crear `00_build.sh` orquestador en versión trivial (Fase 1)
- **Archivos afectados:** `00_build.sh` (nuevo)
- **Categoría temática:** Sistema de build
- **Qué se hizo:** Script bash que copia `10_fuentes/template.html` (que en esta fase era una copia exacta de `index.html`) a `index.html` en raíz. Sin transformaciones.
- **Por qué se hizo:** Validar que el flujo build → publicar funciona antes de meter complejidad. Idempotencia (C.3): correr el script múltiples veces produce el mismo `index.html` resultado.
- **Cómo se verificó:** `./00_build.sh` ejecutado, `diff <(git show HEAD:index.html) index.html` sin output (idénticos).
- **Líneas/secciones:** Script completo.
- **Dependencias afectadas:** Versión iterada en cambios 52, 58.
- **Tensiones entre principios:** Ninguna.

#### Cambio 52: Reescribir `00_build.sh` con Python embebido y marcadores INJECT_* (Fase 2)
- **Archivos afectados:** `00_build.sh`
- **Categoría temática:** Sistema de build
- **Qué se hizo:** Reemplazar la versión trivial por una que usa Python embebido vía heredoc. El script ahora reemplaza tres marcadores en `template.html`: `<!--INJECT_STYLES-->`, `<!--INJECT_DATA-->`, `<!--INJECT_APP-->`. Inyecta el contenido de `styles.css`, los JSON de `data/` como `window.__DATA__ = {...}`, y el contenido de `app.js` si existe.
- **Por qué se hizo:** El build tenía que evolucionar para soportar las fases siguientes (estilos separados, datos en JSON, app.js separado). Python embebido elegido sobre Node por ausencia de dependencias instalables (Python viene con macOS) y mejor manejo de JSON y caracteres especiales.
- **Cómo se verificó:** Build ejecutado, `index.html` generado con estilos del wireframe inyectados, marcadores INJECT_ removidos, HTML parseado correctamente con `html.parser`.
- **Líneas/secciones:** Script completo, ~70 líneas.
- **Dependencias afectadas:** Iterado en cambio 58 (json.dumps).
- **Tensiones entre principios:** Ninguna.

#### Cambio 53: Extraer CSS del wireframe B a `10_fuentes/styles.css` (Fase 2)
- **Archivos afectados:** `10_fuentes/styles.css` (nuevo), `30_documentacion/andamios/wireframe-b-standalone.html` (nuevo)
- **Categoría temática:** Migración de estilos
- **Qué se hizo:** Mover `wireframe-b-standalone.html` desde `~/Downloads` a `30_documentacion/andamios/` como registro histórico. Extraer su bloque `<style>` (líneas 9-211) a `10_fuentes/styles.css`. Reescribir `10_fuentes/template.html` como esqueleto mínimo con marcadores.
- **Por qué se hizo:** El wireframe B "Datos como objeto" elegido como diseño visual definitivo. Sus estilos reemplazan los del HTML viejo. El wireframe original como andamio histórico cumple principio 7 de `regla_estructura_proyectos.md` (preservar registro histórico).
- **Cómo se verificó:** Selector distintivo `.cdot.high` presente en CSS extraído. Build ejecutado, index.html generado correctamente. HTML parseado sin error.
- **Líneas/secciones:** 5929 bytes de CSS.
- **Dependencias afectadas:** El `app.js` de Fase 4 dependerá de estas clases CSS.
- **Tensiones entre principios:** Ninguna.

#### Cambio 54: Crear `.claude/launch.json` para preview server (Fase 2)
- **Archivos afectados:** `.claude/launch.json` (nuevo)
- **Categoría temática:** Tooling de desarrollo
- **Qué se hizo:** Configurar Claude Preview con un static server Python en localhost:8765 para validación visual de los outputs del build.
- **Por qué se hizo:** Necesario para abrir `index.html` y validar visualmente sin instalar otra herramienta de servidor estático. Aplicación de C.7 (Portabilidad): Python ya disponible.
- **Cómo se verificó:** Server arrancó en :8765, página servida correctamente.
- **Líneas/secciones:** ~10 líneas JSON.
- **Dependencias afectadas:** Útil para Fase 4-5 cuando haya UI visible.
- **Tensiones entre principios:** Ninguna.

#### Cambio 55: Documentar convención de build en CLAUDE.md
- **Archivos afectados:** `30_documentacion/activa/CLAUDE.md`
- **Categoría temática:** Documentación de proyecto
- **Qué se hizo:** Agregar sección "## Convención de build" explicando que todo commit que modifique `10_fuentes/` debe ejecutar `./00_build.sh` y commitear `index.html` regenerado junto.
- **Por qué se hizo:** Sin esta convención explícita, hay riesgo de desincronización entre fuentes y output en commits intermedios, lo que rompería GitHub Pages temporalmente. Aplicación de C.11 (transparencia del cambio): la regla debe estar documentada para futuros agentes.
- **Cómo se verificó:** Sección agregada al archivo, leída como contenido correcto.
- **Líneas/secciones:** ~12 líneas agregadas.
- **Dependencias afectadas:** Regla aplica a todos los commits que toquen `10_fuentes/`.
- **Tensiones entre principios:** Ninguna.

#### Cambio 56: Actualizar rutas obsoletas en CLAUDE.md
- **Archivos afectados:** `30_documentacion/activa/CLAUDE.md`
- **Categoría temática:** Documentación de proyecto
- **Qué se hizo:** Reemplazar `50_documentacion/` → `30_documentacion/`, `recursos/` → `20_recursos/`. Agregar entradas nuevas en sección "Estructura del repo" para CLAUDE.md raíz stub, `00_build.sh`, `10_fuentes/`, `30_documentacion/activa/`, `30_documentacion/andamios/`. Marcar explícitamente que `index.html` es output del build.
- **Por qué se hizo:** El cambio 49 reorganizó la estructura del repo pero CLAUDE.md aún referenciaba las rutas viejas. C.11 (transparencia): documentación debe reflejar estado real.
- **Cómo se verificó:** Lectura completa del archivo final, todas las rutas consistentes con la estructura nueva.
- **Líneas/secciones:** Múltiples cambios en bloque "Estructura del repo".
- **Dependencias afectadas:** Documentación al día.
- **Tensiones entre principios:** Ninguna.

#### Cambio 57: Extraer metadata.json desde HTML viejo (Sub-fase 3.3)
- **Archivos afectados:** `10_fuentes/data/metadata.json` (nuevo, 150 líneas)
- **Categoría temática:** Extracción de datos
- **Qué se hizo:** Crear `metadata.json` con 8 keys: ageGroups (5), dimensions (10), certaintyLabels, biblioTypes (10), biblioGroups (11), filterTypes (7), methodology.sections (5), limitations.sections (3). Extracción manual desde objeto JS y desde funciones de render (renderMethodologyPage, renderLimitationsPage). Conversión de HTML embebido a markdown ligero (`<strong>` → `**`, `<em>` → `*`, `<a class="cite">` removido, `<table>` convertido a bullets).
- **Por qué se hizo:** Primer paso de la separación datos/lógica. Empezar por la pieza más simple para validar el shape antes de las grandes.
- **Cómo se verificó:** `python3 -m json.tool` validó parse correcto. Build regeneró `index.html` con `window.__DATA__` poblado con metadata.
- **Líneas/secciones:** 150 líneas JSON.
- **Dependencias afectadas:** bibliografía.json, andamiaje.json, claims.json validan refs cruzados contra metadata.
- **Tensiones entre principios:** Ninguna.

#### Cambio 58: Mejorar indentación del data block en build con json.dumps
- **Archivos afectados:** `00_build.sh`
- **Categoría temática:** Sistema de build
- **Qué se hizo:** Reemplazar la concatenación cruda de strings JSON en el data block por `json.dumps(data_obj, indent=2, ensure_ascii=False)`. Esto valida JSON al leer (json.load) y aplica indentación uniforme desde la raíz.
- **Por qué se hizo:** La indentación irregular del data block (primera línea con espacios extra, internas con su indent original) complicaba debug. Aplicación de C.10 (formatos git-friendly): indent fijo es mejor para diffs limpios.
- **Cómo se verificó:** Build ejecutado, `index.html` regenerado con indentación uniforme. Validación visual del bloque window.__DATA__.
- **Líneas/secciones:** ~10 líneas modificadas en `00_build.sh`.
- **Dependencias afectadas:** Todos los rebuilds subsiguientes usan este formato.
- **Tensiones entre principios:** Tensión menor con B.2 (Simplicidad) — la versión cruda era más corta, pero la nueva versión valida JSON al leer, lo cual es deseable.

#### Cambio 59: Eliminar `.gitkeep` de `10_fuentes/data/` cuando se pobló con metadata.json
- **Archivos afectados:** `10_fuentes/data/.gitkeep` (eliminado)
- **Categoría temática:** Limpieza
- **Qué se hizo:** `git rm` del placeholder ahora que la carpeta tiene contenido real.
- **Por qué se hizo:** El `.gitkeep` existía solo para garantizar que la carpeta se commiteara vacía en Fase 0. Con `metadata.json` adentro ya no hace falta.
- **Cómo se verificó:** `ls` de la carpeta solo muestra archivos JSON.
- **Líneas/secciones:** Archivo de 0 bytes eliminado.
- **Dependencias afectadas:** Ninguna.
- **Tensiones entre principios:** Ninguna.

#### Cambio 60: Extraer bibliografia.json desde HTML viejo (Sub-fase 3.4)
- **Archivos afectados:** `10_fuentes/data/bibliografia.json` (nuevo, 478 líneas)
- **Categoría temática:** Extracción de datos
- **Qué se hizo:** Convertir el array `BIBLIO` del JS (líneas 2382-2717) a JSON. 52 entradas con campos `id, group, type, authors, title, journal, url, featured?`. Conversión de comillas simples a dobles. Escape correcto de comillas internas. Preservación de campos vacíos. Eliminación de comentarios JS de sección.
- **Por qué se hizo:** Bibliografía es la base de las referencias del proyecto. Tiene que estar antes que claims.json para poder validar refs cruzados.
- **Cómo se verificó:** Parse JSON correcto, 52 entradas con 52 IDs únicos (sin duplicados), 100% de groups y types referenciados existen en metadata.json (0 huérfanos).
- **Líneas/secciones:** 478 líneas JSON.
- **Dependencias afectadas:** claims.json, andamiaje.json validan refs contra esta.
- **Tensiones entre principios:** Ninguna.

#### Cambio 61: Extraer andamiaje.json desde renderScaffoldingPage (Sub-fase 3.5)
- **Archivos afectados:** `10_fuentes/data/andamiaje.json` (nuevo, 149 líneas)
- **Categoría temática:** Extracción de datos
- **Qué se hizo:** Convertir el HTML hardcodeado de `renderScaffoldingPage` (líneas 2149-2251) a JSON estructurado. 6 cascadas, 17 nodos de chain (4 cascadas con chain, 1 sin), 15 claims totales. Cada cascada con `{id, title, description, chain[], claims[]}`. Citas `<a class="cite">` removidas del texto y capturadas en arrays `refs`. Conversión de `<strong>` y `<em>` a markdown ligero.
- **Por qué se hizo:** Las cascadas teóricas (regulación emocional, lenguaje, sueño, etc.) son una estructura conceptual del sitio que cruzaba múltiples celdas. Modelarlas en JSON separado permite render flexible y posibilita navegación contextual desde celdas.
- **Cómo se verificó:** Parse correcto, 6 cascadas (esperado: 6 según reconocimiento de Sub-fase 3.2), 15 claims totales (esperado: 15). Refs cruzados contra bibliografía: 3 únicos (Fitzpatrick2024, Jusiene2024, Vasconcellos2025), 0 huérfanos.
- **Líneas/secciones:** 149 líneas JSON.
- **Dependencias afectadas:** 16 cellIds en chains se validarán contra claims.json (cambio 64). Fase 5 renderizará navegación de cascadas.
- **Tensiones entre principios:** Ninguna.

#### Cambio 62: Escribir `extraer_claims.py` para automatizar extracción de claims (Sub-fase 3.6)
- **Archivos afectados:** `30_documentacion/andamios/extraer_claims.py` (nuevo, 305 líneas iniciales)
- **Categoría temática:** Tooling de extracción
- **Qué se hizo:** Script Python parser híbrido para el objeto JS `cells` del HTML viejo. Usa regex para detectar cell headers/closers con indentación predecible, extrae strings con escapes JS, identifica bloques `${C(...)}` para claims, `<p>` para intro, `<div class="chile-note">` para chile_note, y arrays `upstream/downstream`. Convierte HTML embebido a markdown ligero. Reporta cualquier bloque HTML no manejado.
- **Por qué se hizo:** 50 celdas con ~17 líneas cada una = 850 líneas de data hardcodeada. Hacer la extracción manualmente es propenso a error. Un script reproducible es la única opción defendible.
- **Cómo se verificó:** Script ejecutado, reportó 50 celdas extraídas, 120 claims, 5 con chile_note, 18 refs únicos. Detectó 9 celdas con bloques no manejados (`<div class="def">` y `<div class="study">`), lo cual disparó el cambio 63.
- **Líneas/secciones:** Script completo, 305 líneas en v1.
- **Dependencias afectadas:** Generó `claims.json` en v2 después del cambio 63.
- **Tensiones entre principios:** Ninguna en la versión inicial. Bug encontrado documentado en sección 6.

#### Cambio 63: Actualizar `extraer_claims.py` para manejar `<div class="def">` y `<div class="study">` con extracción depth-aware (Sub-fase 3.6)
- **Archivos afectados:** `30_documentacion/andamios/extraer_claims.py` (de 305 a 436 líneas)
- **Categoría temática:** Tooling de extracción
- **Qué se hizo:** Agregar funciones `extract_blocks` (con conteo de apertura/cierre de divs para nesting correcto), `parse_definition`, `parse_study`. `process_content` ahora remueve estos bloques ANTES de buscar `<p>` para el intro, eliminando contaminación. Modelar campos nuevos en cada celda: `definitions: [{term, body}]` y `featured_studies: [{title, meta, body, refs}]`. Campos opcionales: solo aparecen si la celda tiene contenido relevante.
- **Por qué se hizo:** El script v1 dejaba dos problemas: (1) el `<p>` dentro de `<div class="study">` se aspiraba al campo `intro` contaminándolo silenciosamente; (2) `<div class="def">` se descartaba completamente sin guardarlo. Ambos son contenido relevante con estructura semántica distintiva.
- **Cómo se verificó:** Script v2 ejecutado, 50 celdas correctamente extraídas, 120 claims totales, 5 con definitions (6 totales), 5 con featured_studies (6 totales), 0 estructuras no manejadas. Intro de `socioemocional-primera-infancia` confirmado limpio sin contaminación del Fitzpatrick study.
- **Líneas/secciones:** Script completo en v2.
- **Dependencias afectadas:** Generó `claims.json` final.
- **Tensiones entre principios:** Tensión menor entre B.2 (Simplicidad) y completitud del extract. La opción "más simple" habría sido ignorar def y study, pero eso perdía contenido. C.11 (transparencia): mejor modelar explícitamente que silenciar.

#### Cambio 64: Generar claims.json desde script (Sub-fase 3.6)
- **Archivos afectados:** `10_fuentes/data/claims.json` (nuevo, ~3000 líneas)
- **Categoría temática:** Extracción de datos
- **Qué se hizo:** Ejecutar `extraer_claims.py` v2 produce `claims.json` con 50 celdas. Cada celda con `{summary, certainty, intro, claims[], chile_note?, definitions?, featured_studies?, andamiaje: {upstream, downstream}}`. Validaciones cruzadas pasaron: refs en claims → bibliografía (18 únicos, 0 huérfanos), upstream/downstream.to → celdas (46 referenciados, 0 huérfanos), cellIds del andamiaje → celdas (16 referenciados, 0 huérfanos), refs en featured_studies → bibliografía (5 únicos, 0 huérfanos).
- **Por qué se hizo:** Completar la separación de datos del HTML. Esta era la pieza más grande y la última de Fase 3.
- **Cómo se verificó:** Las 4 validaciones cruzadas pasaron. Inspección manual de 3 celdas representativas confirmó shape correcto: `lenguaje-lactante` (primera celda), `socioemocional-primera-infancia` (con featured_studies), `comportamiento-primera-infancia` (con definitions y featured_studies).
- **Líneas/secciones:** ~3000 líneas JSON.
- **Dependencias afectadas:** Es el archivo de datos más grande del proyecto. Fase 4 leerá desde aquí para renderizar la matriz.
- **Tensiones entre principios:** Ninguna en el resultado final.

#### Cambio 65: Crear `flujo_incorporacion_evidencia.md` (documentación de proceso)
- **Archivos afectados:** `30_documentacion/activa/flujo_incorporacion_evidencia.md` (nuevo, ~200 líneas)
- **Categoría temática:** Documentación de proceso
- **Qué se hizo:** Documento que describe el flujo de 5 pasos para incorporar nueva evidencia bibliográfica al proyecto. Roles del usuario y del asesor IA. Convenciones de IDs y campos. Casos especiales. Validaciones automáticas previstas.
- **Por qué se hizo:** El usuario preguntó cómo se incorporarán papers nuevos en el futuro. Documentar el flujo evita reinventarlo cada vez. Útil para sesiones futuras.
- **Cómo se verificó:** Archivo leído al cierre, contenido coherente con lo discutido.
- **Líneas/secciones:** ~200 líneas Markdown.
- **Dependencias afectadas:** Apuntado desde CLAUDE.md (cambio 67).
- **Tensiones entre principios:** Ninguna.

#### Cambio 66: Crear `prompt_busqueda_bibliografia.md` (plantilla de prompt)
- **Archivos afectados:** `30_documentacion/activa/prompt_busqueda_bibliografia.md` (nuevo, ~150 líneas)
- **Categoría temática:** Documentación de proceso
- **Qué se hizo:** Plantilla de prompt para usar con agentes IA de búsqueda (Perplexity, ChatGPT con browsing, etc.) que devuelve papers en formato compatible con el flujo de incorporación de evidencia.
- **Por qué se hizo:** Estandarizar la entrada al flujo. Si el agente externo entrega papers en formato libre, hay fricción manual. Si entrega en el formato esperado, el análisis es más rápido.
- **Cómo se verificó:** Archivo coherente con el flujo del cambio 65.
- **Líneas/secciones:** ~150 líneas Markdown.
- **Dependencias afectadas:** Apuntado desde CLAUDE.md (cambio 67).
- **Tensiones entre principios:** Ninguna.

#### Cambio 67: Documentar flujo de incorporación de evidencia en CLAUDE.md
- **Archivos afectados:** `30_documentacion/activa/CLAUDE.md`
- **Categoría temática:** Documentación de proyecto
- **Qué se hizo:** Agregar sección al final de CLAUDE.md apuntando a `flujo_incorporacion_evidencia.md` y `prompt_busqueda_bibliografia.md`. Definir roles: Tomás detecta y aprueba; Claude analiza y entrega código; Claude Code ejecuta.
- **Por qué se hizo:** CLAUDE.md es el punto de entrada de contexto. Sin este apuntador, los archivos del cambio 65 y 66 son invisibles para futuras sesiones.
- **Cómo se verificó:** Sección presente al final del archivo.
- **Líneas/secciones:** 9 líneas agregadas.
- **Dependencias afectadas:** Futuras sesiones leen CLAUDE.md y conocen el flujo.
- **Tensiones entre principios:** Ninguna.

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

El proyecto "Crianza y pantallas" es un sitio web estático autocontenido (HTML/CSS/JS sin dependencias externas, servido por GitHub Pages) que sintetiza evidencia científica peer-reviewed (2022+) sobre el uso de pantallas en niños y niñas de 0 a 12 años. Está dirigido a padres y madres en Chile, con foco en orientación informada para decisiones de crianza sin alarmismo ni prescripciones. La pieza central es una matriz de 10 dimensiones del desarrollo (lenguaje, cognición, socioemocional, sueño, salud física, visión, salud mental, comportamiento, vínculo, creatividad) por 5 tramos etarios (0-12 meses, 1-3 años, 3-5 años, 6-8 años, 9-12 años). Cada una de las 50 celdas resultantes contiene síntesis con sistema de certeza de 3 niveles (alta/media/baja), referencias bibliográficas navegables, contexto chileno cuando aplica, y conexiones (upstream/downstream) hacia otras celdas. Incluye también una sección de cascadas teóricas (andamiaje del desarrollo) que conecta evidencias a través de múltiples celdas, y secciones de bibliografía buscable con filtros, método, limitaciones y leyenda. El desarrollo comenzó el 23 de mayo de 2026 y se publicó en GitHub Pages durante la sesión 2. Vive en `https://tomgc.github.io/crianza_y_pantallas/`.

### 5.2 Nota metodológica

- Cada ítem del backlog representa una solicitud distinguible del usuario o un cambio conceptualmente independiente (no las acciones técnicas para implementarla).
- Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan como ítems separados. Los bugfixes reportados por el usuario sí se cuentan.
- La clasificación temática es aproximada porque muchos cambios tocan más de una categoría. En esos casos, se clasifica por la intención primaria del cambio.
- Las fuentes del conteo son los documentos de traspaso (`traspaso-cierre-vNN.md`) y el historial de conversaciones de cada sesión.
- Refinamientos menores aplicados durante una misma solicitud no se desagregan: cuentan como un ítem único.
- Las modificaciones a la documentación del propio backlog (este archivo) no se cuentan como cambios al proyecto.

### 5.3 Clasificación temática

## Clasificación temática de los 67 cambios

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Contenido y citas bibliográficas | 23 | 34% | Modificaciones al contenido de claims, agregado o ajuste de citas, conversión de citas a formato `[ref]`, estandarización de paréntesis, validación de URLs y precisión bibliográfica. Ejemplos: cambios 1-12 (sesión 1-2), 34-43 (sesión 2), 44-46 (sesión 3). |
| Reorganización estructural | 8 | 12% | Cambios a la estructura de carpetas, archivos, naming, numeración. Ejemplos: cambios 18-22 (sesión 2 setup repo), 47-50 (sesión 3 migración a Claude Code y refactor estructura). |
| Sistema de build | 4 | 6% | Cambios al script de build, manejo de outputs generados, configuración del flujo de generación. Ejemplos: cambios 51, 52, 58, 59. |
| Migración de estilos | 1 | 1% | Extracción de CSS del wireframe B a archivo separado. Ejemplo: cambio 53. |
| Extracción de datos | 4 | 6% | Conversión de datos hardcodeados en HTML/JS a archivos JSON estructurados. Ejemplos: cambios 57, 60, 61, 64. |
| Tooling de extracción | 2 | 3% | Scripts auxiliares para automatizar la extracción de datos. Ejemplos: cambios 62, 63. |
| Andamiaje del desarrollo | 4 | 6% | Modificaciones a la sección de cascadas teóricas y sus claims. Ejemplos: cambios 13 (Cascada del lenguaje), 24-25 (refuerzo Vasconcellos y Jusienė), 42-43 (sesión 2). |
| Documentación de proyecto | 6 | 9% | CLAUDE.md, README, decisiones, convenciones, flujos de proceso. Ejemplos: cambios 19 (README inicial), 21 (recursos README), 50 (stub CLAUDE), 55-56 (convención build + rutas), 65-67 (flujo evidencia). |
| Tooling de desarrollo | 1 | 1% | Configuración de herramientas de desarrollo. Ejemplo: cambio 54 (preview server). |
| Gestión de versiones | 1 | 1% | Operaciones de git: branches, merges, etc. Ejemplo: cambio 48 (creación rama feature). |
| Diseño visual | 1 | 1% | Decisiones e iteraciones sobre la dirección visual del sitio. Ejemplo: elección del wireframe B durante la sesión (no contabilizado como cambio porque no produce artefacto directamente). |
| Flujo de trabajo | 1 | 1% | Cambios en cómo se ejecuta el trabajo. Ejemplo: cambio 47 (migración a Claude Code modo local). |
| Validación bibliográfica | 1 | 1% | Tareas de verificación externa, no de modificación del proyecto. Ejemplo: cambio 44 (validación P2). |
| Precisión bibliográfica | 2 | 3% | Corrección de claims que excedían el alcance del paper citado, o URLs incorrectas. Ejemplos: cambios 45-46. |
| Limpieza | 1 | 1% | Eliminación de archivos placeholder, dead code, etc. Ejemplo: cambio 59 (.gitkeep). |
| Otros (inferidos sesión 1 y 2) | 7 | 10% | Cambios documentados en v01/v02 pero sin categoría clara. Se mantienen para consistencia de conteo. |

### 5.4 Resumen estadístico por sesión

| Sesión | Traspaso | N° de cambios | Modelo | Foco principal |
|---|---|---|---|---|
| 1 | v01 | 17 | Opus | Construcción inicial del HTML, matriz 10×5, bibliografía base, andamiaje |
| 2 | v01-v02 | 26 | Opus | Subida a GitHub, sistema de citas `[ref]`, refuerzos del andamiaje |
| 3 | v02-v03 | 24 | Opus | Migración a Claude Code, refactor modular, separación datos del HTML |
| — | — | — | — | Refinamientos distribuidos: no aplica todavía |

**Total de cambios solicitados: ~67**

### 5.5 Detalle cronológico de cambios por sesión

### Sesión 1 (Opus) — 2026-05-23

Construcción inicial del HTML único con matriz 10×5, bibliografía base, andamiaje del desarrollo y sistema de certeza. Primera aplicación del protocolo de cierre.

1. Crear estructura inicial del HTML único.
2. Definir las 10 dimensiones del desarrollo.
3. Definir los 5 tramos etarios.
4. Implementar sistema de certeza de 3 niveles (alta, media, baja).
5. Crear las 50 celdas iniciales con summary y certainty.
6. Agregar contenido textual a las celdas (intro + claims).
7. Agregar contexto chileno (chile-note) en celdas relevantes.
8. Crear estructura de bibliografía con BIBLIO_TYPES y BIBLIO_GROUPS.
9. Agregar las primeras ~40 entradas bibliográficas.
10. Implementar render de matriz y navegación SPA por hash.
11. Implementar sección de Método.
12. Implementar sección de Limitaciones.
13. Implementar sección de Andamiaje con 5 cascadas iniciales.
14. Implementar sección de Leyenda.
15. Implementar buscador y filtros de bibliografía.
16. Aplicar estilos CSS con paleta azul marino + cálido terracota.
17. Crear primer documento de traspaso v01 (sesión 1).

---

### Sesión 2 (Opus) — 2026-05-24

Subida del proyecto a GitHub con Pages activado. Conversión integral de citas autor-año al formato `[ref]` con paréntesis estandarizados. Refuerzo del andamiaje con Vasconcellos y Jusienė. Prompt para Claude Design entregado.

18. Renombrar `pantallas-infancia-matriz.html` a `index.html` para GitHub Pages.
19. Crear `README.md` del repo.
20. Crear `.gitignore` mínimo.
21. Crear `recursos/README.md` con instrucciones de descarga local de PDFs UNICEF/CJE UC.
22. Subir traspaso-cierre-v01.md al repo como histórico.
23. Generar `prompt-claude-design.md` con 3 direcciones visuales (Editorial cálido, Datos como objeto, Cuaderno de crianza).
24. Agregar 7 entradas bibliográficas nuevas (Sundqvist2021, Bal2024, Dutra2025, Jourdren2023, Russell2019, Pearson2018, Carter2024).
25. Convertir cita Sundqvist 2021 → formato `[ref]` (L1051).
26. Convertir cita Mallawaarachchi 2024 → formato `[ref]` (L1073).
27. Convertir cita Bal 2024 → formato `[ref]` (L1136).
28. Convertir cita Dutra 2025 (cognición) → formato `[ref]` (L1137).
29. Convertir cita Jourdren 2023 → formato `[ref]` (L1156).
30. Convertir cita Dutra 2025 (motor) → formato `[ref]` (L1382).
31. Reemplazar Pearson 2017 (no localizable) por Pearson 2018 + `[ref]` (L1396).
32. Convertir cita Russell 2019 → formato `[ref]` (L1429).
33. Reemplazar Montag 2024 (no localizable) por Carter 2024 + `[ref]` (L1706).
34. Convertir cita Fitzpatrick 2024 (Andamiaje) → formato `[ref]` (L2192).
35. Estandarizar Toledo-Vargas a formato paréntesis (L1230).
36. Estandarizar Vasconcellos a formato paréntesis (L1247).
37. Estandarizar Vasconcellos a formato paréntesis (L1554).
38. Estandarizar Eirich a formato paréntesis (L1585).
39. Estandarizar Toledo-Vargas a formato paréntesis (L1721).
40. Estandarizar Colliver a formato paréntesis (L1818).
41. Estandarizar Colliver a formato paréntesis (L1835).
42. Agregar claim Jusienė 2024 (PDER) en cascada de regulación emocional (L2192+).
43. Agregar claim Vasconcellos 2025 en cascada socioemocional → salud mental (L2234+).

---

### Sesión 3 (Opus) — 2026-05-25

Migración del flujo de trabajo a Claude Code en modo local. Refactor mayor de arquitectura para modularizar fuentes. Elección del wireframe B como diseño visual. Extracción completa de la data a 4 archivos JSON.

44. Validar manualmente las 7 URLs bibliográficas agregadas en sesión 2 (resuelve P2 de v02).
45. Acotar claim de Carter2024 al alcance real del paper (L1706, antes del refactor).
46. Reemplazar URL bloqueada de Sundqvist2021 (PMC) por URL canónica de Frontiers (L2678, antes del refactor).
47. Migrar flujo de trabajo de sesiones web copy-paste a Claude Code en modo local sobre filesystem (/Users/tomgc/Projects/crianza_y_pantallas).
48. Crear rama feature `refactor/modular-build` para aislar el refactor mayor.
49. Reorganizar estructura del repo de plana a numerada 00/10/20/30: mover `recursos/` → `20_recursos/`, `50_documentacion/` → `30_documentacion/`, mover CLAUDE.md a `30_documentacion/activa/`.
50. Crear stub `CLAUDE.md` en raíz como puntero a `30_documentacion/activa/CLAUDE.md`.
51. Crear `00_build.sh` orquestador en versión trivial (Fase 1: copia template a index.html).
52. Reescribir `00_build.sh` con Python embebido y marcadores INJECT_* (Fase 2).
53. Extraer CSS del wireframe B a `10_fuentes/styles.css`. Mover wireframe-b-standalone.html a `30_documentacion/andamios/` como registro histórico.
54. Crear `.claude/launch.json` para preview server local.
55. Documentar convención de build en CLAUDE.md (todo commit que toque `10_fuentes/` debe regenerar `index.html`).
56. Actualizar rutas obsoletas en CLAUDE.md (50_ → 30_, recursos/ → 20_recursos/).
57. Extraer metadata.json desde HTML viejo (8 keys, 150 líneas).
58. Mejorar indentación del data block en build con json.dumps(indent=2, ensure_ascii=False).
59. Eliminar `.gitkeep` de `10_fuentes/data/` cuando se pobló con metadata.json.
60. Extraer bibliografia.json desde HTML viejo (52 entradas, 478 líneas).
61. Extraer andamiaje.json desde renderScaffoldingPage (6 cascadas, 15 claims).
62. Escribir `extraer_claims.py` (v1, 305 líneas) para automatizar extracción de claims.
63. Actualizar `extraer_claims.py` (v2, 436 líneas) para manejar `<div class="def">` y `<div class="study">` con extracción depth-aware, resolviendo bug de contaminación silenciosa del intro.
64. Generar `claims.json` desde script (50 celdas, 120 claims, 6 definitions, 6 featured_studies, ~3000 líneas).
65. Crear `flujo_incorporacion_evidencia.md` documentando el proceso de 5 pasos para incorporar evidencia bibliográfica nueva.
66. Crear `prompt_busqueda_bibliografia.md` plantilla para agentes IA de búsqueda.
67. Documentar flujo de incorporación de evidencia en CLAUDE.md con apuntadores a los archivos creados.

---

### 5.6 Cambios respecto a la versión anterior de este backlog

- Se agregaron 24 cambios nuevos correspondientes a la sesión 3 (cambios 44-67).
- Se introdujo la clasificación temática por primera vez (no existía en v01 ni v02).
- Se introdujo el resumen estadístico por sesión y el detalle cronológico por sesión.
- Las descripciones de cambios de sesiones 1 y 2 fueron reconstruidas a partir de los traspasos v01 y v02 disponibles. Es posible que algunos cambios de detalle hayan sido subsumidos en items más amplios.

---

## 6. Bugs encontrados y su resolución

#### Bug 1: Carter2024 cita un alcance que excede el del paper
- **Síntoma observable:** El claim en L1706 del HTML viejo afirmaba que Carter2024 respalda "problemas conductuales, peor desempeño académico y problemas de salud mental", pero el paper solo mide ansiedad y depresión en adolescentes UK con uso problemático de smartphone.
- **Causa raíz:** Carter2024 había sido introducido en sesión 2 como reemplazo de "Montag 2024" (que no era localizable). Al hacer el reemplazo, se mantuvo el texto del claim original que aplicaba a Montag, pero Carter mide cosas diferentes.
- **Solución aplicada:** Reescribir el claim a "Uso problemático de smartphone se asocia con mayor ansiedad y depresión en adolescentes (Carter et al., 2024)". Cambio aplicado en `index.html` viejo antes del refactor.
- **Criterio de verificación:** Lectura del abstract del paper (DOI 10.1111/apa.17317) y comparación con el claim. El claim revisado describe exactamente lo que Carter mide.
- **Patrón general aprendido:** Cuando se reemplaza una cita huérfana, no solo se cambia el ID; se debe verificar que el texto del claim sea consistente con el alcance del paper sustituto. Una cita es un compromiso epistémico, no solo una etiqueta.
- **Principios involucrados:** C.11 (transparencia del cambio): documentar exactamente qué respalda cada cita, sin extrapolar.
- **Estado:** Resuelto.

#### Bug 2: URL de Sundqvist2021 bloqueada por captcha en PMC
- **Síntoma observable:** Acceso a la URL agregada en sesión 2 redirigía a un captcha de reCAPTCHA en lugar del paper.
- **Causa raíz:** PMC (NCBI) bloquea acceso automatizado y a veces acceso humano desde IPs sospechosas. La URL canónica del paper en Frontiers no tiene este problema.
- **Solución aplicada:** Reemplazar `https://pmc.ncbi.nlm.nih.gov/articles/PMC7886794/` por `https://www.frontiersin.org/articles/10.3389/fpsyg.2021.569920/full` en la entrada bibliográfica.
- **Criterio de verificación:** Acceso exitoso a la nueva URL sin captcha.
- **Patrón general aprendido:** Al elegir URL para cita, preferir la URL canónica del journal sobre repositorios secundarios (PMC, ResearchGate). Si el journal tiene paywall, considerar el DOI como alternativa.
- **Principios involucrados:** C.7 (Portabilidad): la URL debe funcionar en cualquier entorno, sin captchas ni autenticación.
- **Estado:** Resuelto.

#### Bug 3: Contaminación silenciosa del campo `intro` en `extraer_claims.py` v1
- **Síntoma observable:** El campo `intro` de las celdas con `<div class="study">` (5 celdas afectadas) incluía el texto del `<p>` interno del study, que no es introducción de la celda sino cuerpo del estudio destacado. Ejemplo: en `socioemocional-primera-infancia`, el intro contenía "Es el período crítico... más uso de tablet a los 3.5 años predijo más expresiones de ira/frustración..." donde la segunda parte era del Fitzpatrick study.
- **Causa raíz:** El parser usaba regex genérico para extraer todos los `<p>` del contenido como intro, sin distinguir entre `<p>` hijo directo del content y `<p>` anidado dentro de un `<div class="study">`.
- **Solución aplicada:** Reescribir el parser con función `extract_blocks` depth-aware (cuenta apertura/cierre de divs) que primero remueve los bloques `<div class="def">` y `<div class="study">` del contenido antes de buscar `<p>` para el intro. Los blocks removidos se procesan por separado y se modelan como campos estructurados (`definitions`, `featured_studies`).
- **Criterio de verificación:** Comparación del intro de `socioemocional-primera-infancia` antes y después: en v1 el intro contenía contenido del study; en v2 solo contenía el `<p>` que efectivamente es introducción.
- **Patrón general aprendido:** Al parsear HTML con regex, los regex que parecen "lo bastante específicos" pueden contaminar cuando hay anidamiento. La regla operativa es: si el HTML tiene divs anidados, no usar regex; usar parser con conciencia de nesting (depth-aware).
- **Principios involucrados:** C.8 (Validación de integridad): el reporte del script v1 detectó que había 9 celdas con "bloques no manejados", lo que disparó la inspección manual que reveló el bug. Sin el check de "estructuras no manejadas" el bug se habría hecho silencioso.
- **Estado:** Resuelto.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Cuando se reemplaza una cita bibliográfica por otra, no basta con sustituir el ID; se debe verificar que el alcance del paper sustituto coincida con lo que el claim afirma. Si no coincide, el claim debe reescribirse.
  - **Principio relacionado:** C.11 (Transparencia del cambio).
  - **Contexto:** Si se ignora, el sitio sostiene afirmaciones que las citas no respaldan, lo cual es un problema epistémico mayor para un sitio que sintetiza evidencia.
  - **Ejemplo:** Bug 1 (Carter2024).

- **Regla:** Al parsear HTML con regex y hay anidamiento de divs, usar siempre un extractor depth-aware (cuenta apertura/cierre). Los regex "lo bastante específicos" contaminan silenciosamente.
  - **Principio relacionado:** C.8 (Validación de integridad).
  - **Contexto:** Cuando un parser falla, lo hace silenciosamente — produce un output que parece correcto pero contiene datos contaminados. La única defensa es validación explícita post-parse.
  - **Ejemplo:** Bug 3 (contaminación del intro).

- **Regla:** En un script de extracción, agregar un check explícito de "estructuras no manejadas" y reportarlas como warning. No silenciar bloques desconocidos.
  - **Principio relacionado:** C.8 (Validación de integridad) y C.13 (Logging y observabilidad).
  - **Contexto:** El parser puede no conocer todos los casos del input. Sin un check, los casos no manejados se pierden sin trazas. Con el check, el operador sabe qué necesita modelar.
  - **Ejemplo:** `extraer_claims.py` reportó 9 celdas con bloques no manejados, lo cual disparó el modelado correcto.

- **Regla:** Para sitios servidos por GitHub Pages, mantener `index.html` en la raíz del repo y considerarlo siempre output del build, nunca editable a mano.
  - **Principio relacionado:** C.2 (Reproducibilidad completa) y C.3 (Idempotencia).
  - **Contexto:** Si se permite edición manual del HTML, la próxima ejecución del build sobrescribe los cambios sin aviso. La regla "no editar a mano" debe estar explícita en la documentación del proyecto.
  - **Ejemplo:** Convención agregada en CLAUDE.md (cambio 55).

- **Regla:** Al separar datos del código, usar JSON con `indent=2` y `ensure_ascii=False`. La indentación uniforme habilita diffs limpios; el control de encoding preserva tildes y eñes.
  - **Principio relacionado:** C.10 (Formatos git-friendly).
  - **Contexto:** Sin indent uniforme, los diffs se llenan de cambios espurios de whitespace. Con `ensure_ascii=True` (default), los caracteres con tilde se escapan a `\uXXXX`, ilegible para humanos.
  - **Ejemplo:** Cambio 58 (mejora del data block en `00_build.sh`).

- **Regla:** Las preferencias del usuario están explícitamente declaradas en `userPreferences`. Cualquier deslizamiento (como usar voseo cuando está prohibido) es un error técnico, no un detalle estilístico.
  - **Principio relacionado:** B.1 (Pensar antes de codificar): explicitar supuestos.
  - **Contexto:** Las preferencias incluyen reglas duras sobre idioma, formato y tono. Violarlas degrada la calidad de la interacción.
  - **Ejemplo:** Durante esta sesión hubo un deslizamiento a voseo al describir el flujo de incorporación de evidencia. Corregido tras observación del usuario.

- **Regla:** En cierres de sesión con protocolo formal documentado (`prompt-cierre-sesion.md`), seguir el protocolo completo en lugar de improvisar un cierre informal. El protocolo existe para que sesiones futuras retomen sin pérdida.
  - **Principio relacionado:** B.1 y B.4 (Ejecución dirigida por objetivos).
  - **Contexto:** Un cierre informal funciona pero acumula deuda: el backlog formal del proyecto deja de existir, los aprendizajes se pierden, la próxima apertura debe reconstruir contexto.
  - **Ejemplo:** El traspaso v03 inicial fue informal; este traspaso lo reemplaza siguiendo el protocolo.

---

## 8. Decisiones de diseño tomadas

### Decisión 1: Refactor modular del HTML único antes de continuar con contenido
- **Alternativas consideradas:** (A) Seguir con P1 (sección recomendaciones UNICEF/CJE UC) sobre HTML único; (B) Refactor primero, P1 después.
- **Justificación:** El HTML único de 2967 líneas mezclaba datos, lógica y presentación. Agregar 6 documentos de contenido (P1) sobre esa arquitectura habría crecido el archivo a >4000 líneas, agravando el problema. Refactorizar primero permite que P1 se haga sobre arquitectura limpia.
- **Tensiones entre principios:** B.2 (Simplicidad) tensionó con C.5 (Modularidad). Se priorizó modularidad porque el reuso real existe (datos para múltiples renders, separación necesaria para iteración visual con Claude Design).
- **Implicancia:** Toda Fase 4 y posteriores trabajan sobre arquitectura modular. P1 se posterga hasta después de Fase 6.

### Decisión 2: Wireframe B "Datos como objeto" como dirección visual definitiva
- **Alternativas consideradas:** Wireframe A "Editorial cálido" (revista de divulgación), Wireframe C "Cuaderno de crianza" (estética artesanal moderna), mantener diseño actual sobrio.
- **Justificación:** Elección del usuario tras evaluación de propuestas de Claude Design.
- **Tensiones entre principios:** Ninguna técnica. Decisión estética.
- **Implicancia:** Toda la presentación visual del sitio se reescribe siguiendo wireframe B (paleta navy, doble codificación de certeza, marca CL, matriz central + panel lateral + popovers).

### Decisión 3: Reescribir el wireframe B de React a vanilla JS
- **Alternativas consideradas:** (A) Mantener React + Babel via unpkg CDN (como vino el wireframe); (B) Adoptar React con build local (npm install, bundling); (C) Reescribir a vanilla JS.
- **Justificación:** Restricción explícita del proyecto: "sin dependencias externas, sin librerías JS". Mantener React via CDN rompía esa restricción y agregaba ~200KB de dependencias en runtime. Adoptar React con build local agregaba `npm install` y `node_modules/` al flujo. Vanilla JS preserva la restricción y la lógica del wireframe es simple (un useState, render de grilla, render de ficha).
- **Tensiones entre principios:** Ninguna; reescribir alinea con todos los principios del proyecto.
- **Implicancia:** Fase 4 escribe `app.js` en vanilla JS. Más trabajo inicial pero produce HTML estático autocontenido real.

### Decisión 4: Estructura del repo numerada 00/10/20/30 conforme a `regla_estructura_proyectos.md`
- **Alternativas consideradas:** (A) Mantener estructura plana del repo viejo; (B) Adoptar la numeración pero con salto 00/10/20/50 (heredado de v02); (C) Compactar a 00/10/20/30.
- **Justificación:** Principios 2 y 3 de `regla_estructura_proyectos.md` exigen "el número refleja orden de ejecución" y "sin saltos". El repo viejo tenía deuda heredada. El refactor era el momento exacto para corregir.
- **Tensiones entre principios:** Ninguna; corrección de deuda.
- **Implicancia:** Trabajo de migración (renames con git mv preservando historial). Beneficio: consistencia con política de proyectos en otros repos del usuario.

### Decisión 5: `index.html` permanece en raíz del repo (no en `30_publicado/` o `docs/`)
- **Alternativas consideradas:** (A) Pages desde `gh-pages` con GitHub Action; (B) Pages desde `/docs`; (C) `index.html` en raíz, build escribe ahí directamente.
- **Justificación:** Opción C es la más simple operativamente: cero configuración de Pages, cero GitHub Action, cero pasos extra. El `index.html` queda marcado como "no editable a mano" en CLAUDE.md.
- **Tensiones entre principios:** B.2 (Simplicidad) vs separación lógica fuentes/publicado. Se priorizó simplicidad.
- **Implicancia:** Si el proyecto crece y necesita preview/staging, se migra a Opción A. Hoy no hay justificación.

### Decisión 6: Build con Bash + Python embebido vía heredoc, no Node
- **Alternativas consideradas:** (A) Bash puro con sed/awk; (B) Node con npm dependencies; (C) Bash + Python embebido.
- **Justificación:** Python viene con macOS sin instalar nada (cero dependencias instalables). Bash + sed/awk se rompe con caracteres especiales y JSON. Node requiere `npm install`. Python embebido elegido por balance entre simplicidad y robustez.
- **Tensiones entre principios:** Ninguna.
- **Implicancia:** El build requiere Python 3 instalado, lo cual es razonable asumir en macOS y servidores Linux.

### Decisión 7: Modelar `definitions` y `featured_studies` como campos estructurados, no como markdown inline
- **Alternativas consideradas:** (A) Convertir def y study a markdown inline en `intro` o `claims`; (B) Ignorar def y study; (C) Modelarlos como campos JSON estructurados separados.
- **Justificación:** Def tiene estructura semántica distintiva (term/body), study tiene title/meta/body. Aplastar a markdown plano pierde la separación de roles que el render visualizará diferente. Ignorar pierde contenido relevante.
- **Tensiones entre principios:** B.2 (Simplicidad) vs C.5 (Modularidad). Se priorizó modularidad porque hay roles distintos genuinos.
- **Implicancia:** El `app.js` de Fase 4 debe renderizar def y study con su propio tratamiento visual.

### Decisión 8: Campos opcionales en JSON se omiten cuando vacíos (no se agregan como arrays vacíos)
- **Alternativas consideradas:** (A) Agregar campos como `"definitions": []` cuando no aplican; (B) Omitir el campo cuando no aplica.
- **Justificación:** JSON más limpio. El render decide qué mostrar según presencia del campo.
- **Tensiones entre principios:** Ninguna.
- **Implicancia:** El código de render debe usar checks `if (cell.definitions)` antes de iterar.

### Decisión 9: Flujo de incorporación de evidencia formal con prompt de búsqueda
- **Alternativas consideradas:** (A) Improvisar cada vez que llegue un paper nuevo; (B) Documentar flujo formal con plantilla.
- **Justificación:** La incorporación de evidencia será regular pero esporádica. Improvisar cada vez agrega fricción. Documentar el flujo + plantilla acelera futuras sesiones.
- **Tensiones entre principios:** Ninguna.
- **Implicancia:** Próximos papers se incorporan siguiendo el flujo de 5 pasos en `flujo_incorporacion_evidencia.md`.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante / Configuración | Valor actual | Archivo | Nota |
|---|---|---|---|
| `FUENTES` (carpeta de fuentes) | `10_fuentes` | `00_build.sh` | Path relativo a la raíz del repo |
| `OUTPUT` (archivo generado) | `index.html` | `00_build.sh` | Generado en raíz para GitHub Pages |
| `DATA_DIR` (carpeta de JSON) | `10_fuentes/data` | `00_build.sh` | Contiene los 4 JSON |
| Indentación de data block | `indent=2` | `00_build.sh` (Python embebido) | Habilita diffs git limpios |
| Encoding de data block | `ensure_ascii=False` | `00_build.sh` (Python embebido) | Preserva tildes y eñes |
| Paleta de certeza (definitiva) | `#042f4d` alta / `#5c728e` media / `#d6dfe8` baja | `10_fuentes/styles.css` | Del wireframe B |
| Paleta Chile | `#1f5b3d` (chile-mark), `#e8efe9` (chile-soft) | `10_fuentes/styles.css` | Del wireframe B |
| Fondo | `#ffffff` | `10_fuentes/styles.css` | Del wireframe B |
| Tipografía base | -apple-system stack, 13px, line-height 1.55 | `10_fuentes/styles.css` | Del wireframe B (CLAUDE.md aún dice 15px/1.65, pendiente de actualizar en Fase 6) |
| URL del sitio publicado | `https://tomgc.github.io/crianza_y_pantallas/` | `README.md`, `CLAUDE.md` | GitHub Pages activo |
| Cantidad de dimensiones | 10 | `metadata.json` | lenguaje, cognición, socioemocional, sueño, salud-fisica, vision, salud-mental, comportamiento, vinculo, creatividad |
| Cantidad de tramos etarios | 5 | `metadata.json` | lactante, primera-infancia, preescolar, ninez-media, preadolescencia |
| Cantidad de celdas | 50 | `claims.json` | 10 × 5 |
| Cantidad de entradas bibliográficas | 52 | `bibliografia.json` | — |
| Cantidad de cascadas en andamiaje | 6 | `andamiaje.json` | — |
| Niveles de certeza | 3 (high, medium, low) | `metadata.json` y todos los datos | — |
| Cantidad de biblio types | 10 | `metadata.json` | — |
| Cantidad de biblio groups | 11 | `metadata.json` | — |
| Cantidad de filter types | 7 | `metadata.json` | Para buscador de bibliografía |
| Refs únicos usados activamente | 22 | (cálculo de validación) | Sobre 52 totales en biblio |

---

## 10. Arquitectura de archivos relevante

```
crianza_y_pantallas/
├── 00_build.sh                                       # Orquestador, Bash + Python embebido
├── 10_fuentes/
│   ├── template.html                                 # Esqueleto con marcadores INJECT_*
│   ├── styles.css                                    # CSS del wireframe B (paleta navy)
│   ├── data/
│   │   ├── andamiaje.json                            # 6 cascadas, 15 claims
│   │   ├── bibliografia.json                         # 52 entradas
│   │   ├── claims.json                               # 50 celdas, 120 claims
│   │   └── metadata.json                             # Dimensiones, edades, types, etc.
│   └── (app.js pendiente Fase 4)                     # Vanilla JS para render del wireframe B
├── 20_recursos/
│   └── README.md                                     # Instrucciones de descarga local de PDFs
├── 30_documentacion/
│   ├── activa/
│   │   ├── CLAUDE.md                                 # Contexto persistente del proyecto
│   │   ├── flujo_incorporacion_evidencia.md          # Proceso para agregar papers
│   │   └── prompt_busqueda_bibliografia.md           # Plantilla para agentes IA
│   ├── traspasos/
│   │   ├── traspaso-cierre-v01.md                    # Sesión 1
│   │   ├── traspaso-cierre-v02.md                    # Sesión 2
│   │   └── traspaso-cierre-v03.md                    # Este archivo
│   └── andamios/
│       ├── extraer_claims.py                         # Script de extracción (sub-fase 3.6)
│       └── wireframe-b-standalone.html               # Wireframe original de Claude Design
├── CLAUDE.md                                         # Stub puntero a 30_documentacion/activa/CLAUDE.md
├── README.md                                         # Documentación pública del repo
├── .claude/
│   └── launch.json                                   # Config de preview server local
├── .gitignore                                        # Incluye 30_documentacion/versiones/ (snapshots)
└── index.html                                        # GENERADO por build, no editar a mano
```

**Cambios estructurales respecto a v02:**

- Estructura de raíz pasó de plana (`recursos/`, `50_documentacion/`) a numerada (`20_recursos/`, `30_documentacion/`) con orquestador `00_build.sh` y carpeta de fuentes `10_fuentes/`.
- Numeración compactada a 00/10/20/30 (sin saltos), cumpliendo principios 2 y 3 de `regla_estructura_proyectos.md`.
- Nuevo concepto: `index.html` es output del build, no fuente editable. Las fuentes viven en `10_fuentes/`.
- Nueva carpeta `30_documentacion/activa/` para documentación viva del proyecto.
- Nueva carpeta `30_documentacion/andamios/` para preservar scripts de refactor históricos (cumple principio 7 de la regla).

**Verificación contra POLITICA_PROYECTO.md y regla_estructura_proyectos.md:**

- Numeración respeta principios 1, 2, 3 (decenas, orden de ejecución, sin saltos): ✓
- Separación input/procesamiento/output (principio 5): parcial — input son los JSON de `10_fuentes/data/`, procesamiento es `00_build.sh`, output es `index.html`. No hay capa de datos crudos en `20_insumos/` porque el proyecto no tiene pipeline de datos externos (los PDFs UNICEF/CJE UC en `20_recursos/` son referencia, no insumo procesado).
- Documentación bifurcada activa/histórica (principio 7): ✓ via `30_documentacion/activa/` y `30_documentacion/traspasos/` + `30_documentacion/andamios/`.
- Naming sin tildes ni espacios (D.convenciones generales): ✓.

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente 1: Fase 4 del refactor — reescribir wireframe B a vanilla JS
- **Descripción:** Crear `10_fuentes/app.js` con la lógica del wireframe B sin React/Babel. Implementar: render del top bar (título + selector de tramo + leyenda), render de la matriz 10×5 con doble codificación de certeza + marca CL, lógica del selector (atenuar columnas no seleccionadas), clic en celda (marcar activa + cargar ficha en panel derecho), render de la ficha activa (título + intro + claims + chile_note + definitions + featured_studies + andamiaje contextual), popovers de bibliografía al hover sobre `.ref`, footer con microdecisiones, deep linking (actualizar `window.location.hash` con `#dimension/tramo`). El JS lee todo desde `window.__DATA__` poblado por el build.
- **Contexto:** Hasta que esta fase no esté completa, el sitio no tiene render visible (página en blanco). Es la pieza más esperada del refactor.
- **Tipo:** Funcionalidad nueva (bloqueante).
- **Impacto:** Sin esto, todo el trabajo del refactor (Fases 0-3) está invisible para el usuario final.
- **Dependencias:** Depende de tener los 4 JSON listos (✓ completado).
- **Complejidad estimada:** Alta. El wireframe B usa React con `useState`. Reescribir a vanilla JS requiere implementar un mini-state-manager simple (variable módulo + función setState que re-renderiza), funciones de render para cada sección, event delegation para clics en celda, hover para popovers. Estimación: 2-4 sesiones.
- **Principios relevantes:** C.5 (Modularidad) — separar funciones por sección. C.7 (Portabilidad) — sin dependencias externas. B.4 (Ejecución dirigida por objetivos) — definir criterios de verificación por subfase.
- **Precauciones:** El wireframe original tiene tamaños fijos (panel lateral 360px). Si Fase 5 agrega responsive, hay que decidir si el panel lateral colapsa en móvil o desaparece. Definir esto antes de empezar para no rehacer.
- **Sugerencia de enfoque:** Implementar en orden: (1) render estático de la matriz con datos reales pero sin interactividad; (2) selector de tramo con atenuación; (3) clic en celda con render de ficha en panel; (4) popovers de bibliografía; (5) deep linking. Cada paso es un commit con validación visual.
- **Criterio de éxito sugerido:** Abrir `index.html` en navegador, ver matriz con datos reales, clic en celda carga ficha correcta, selector de tramo atenúa columnas correctas, hash de URL se actualiza, refresh con hash carga estado correcto.

#### Pendiente 2: Fase 5 del refactor — secciones secundarias
- **Descripción:** Implementar Bibliografía con buscador en vivo + filtros (7 filterTypes + 11 biblioGroups), Método (textos en metadata.json), Limitaciones (textos en metadata.json), Leyenda expandida, Andamiaje navegable (las 6 cascadas con chains clickeables que cargan celdas en el panel).
- **Contexto:** Decisión arquitectónica F del wireframe: secciones secundarias debajo de la matriz con anclas. Andamiaje vive contextual en el panel lateral.
- **Tipo:** Funcionalidad nueva.
- **Impacto:** Sin esto, el sitio tiene matriz funcional pero pierde la funcionalidad de bibliografía buscable y otras secciones del sitio actual.
- **Dependencias:** Depende de Pendiente 1 (Fase 4 completa).
- **Complejidad estimada:** Media-alta. La bibliografía con buscador en vivo y filtros es el componente más complejo. Estimación: 1-2 sesiones.
- **Principios relevantes:** C.5 (Modularidad), C.8 (Validación de integridad) — el buscador debe manejar caracteres especiales y diacríticos.
- **Precauciones:** El buscador del HTML viejo tenía features específicos (filtros combinables, búsqueda en autores y títulos). Verificar paridad funcional con el HTML viejo antes de mergear.
- **Sugerencia de enfoque:** Implementar bibliografía primero (es la más compleja), luego andamiaje navegable (puede reutilizar funciones de render de celdas), luego método y limitaciones (son texto puro).
- **Criterio de éxito sugerido:** Buscar "Madigan" filtra correctamente. Filtros combinados funcionan. Clic en chain del andamiaje carga celda correcta en panel. Anclas internas funcionan.

#### Pendiente 3: Fase 6 del refactor — validación end-to-end, actualización docs, merge a main
- **Descripción:** Comparar HTML viejo (main) vs HTML nuevo (refactor) lado a lado verificando paridad de contenido. Script de validación automática pre-build (refs huérfanos, cellIds huérfanos, groups/types huérfanos). Actualizar CLAUDE.md con paleta y tipografía finales del wireframe B. Integrar `flujo_incorporacion_evidencia.md` al apuntado oficial. Abrir PR de refactor/modular-build → main. Merge. Verificar GitHub Pages sirviendo la versión nueva. Traspaso v04.
- **Contexto:** Cierre del refactor. La rama feature debe mergearse para que el sitio público refleje los cambios.
- **Tipo:** Bloqueante para todo lo posterior (incluido P1 original).
- **Impacto:** Sin merge, todo el trabajo del refactor sigue invisible al público.
- **Dependencias:** Depende de Pendientes 1 y 2.
- **Complejidad estimada:** Media. Mucha verificación, poco código nuevo. Script de validación pre-build es lo más "nuevo".
- **Principios relevantes:** C.2 (Reproducibilidad), C.8 (Validación de integridad), F (Auditoría del proyecto al cierre).
- **Precauciones:** Antes del merge, verificar que TODO el contenido del HTML viejo está en el nuevo. Hacer audit cell por cell, ref por ref.
- **Sugerencia de enfoque:** (1) Implementar validación automática pre-build. (2) Audit de paridad de contenido (script o manual). (3) Actualizar CLAUDE.md. (4) Crear PR con descripción detallada del refactor. (5) Merge.
- **Criterio de éxito sugerido:** `git diff main..refactor/modular-build -- index.html` muestra cambios solo de presentación, no de contenido. Sitio público en GitHub Pages se actualiza tras merge. CLAUDE.md actualizado.

#### Pendiente 4: P1 — Sección de recomendaciones UNICEF/CJE UC
- **Descripción:** Crear sección nueva con recomendaciones organizadas por temáticas/edades, basada en 6 documentos UNICEF/CJE UC. Encaja como nuevo `recomendaciones.json` + render correspondiente.
- **Contexto:** Pendiente heredado de v01 y v02. Postergado hasta tener arquitectura modular estable.
- **Tipo:** Funcionalidad nueva.
- **Impacto:** Aporta valor concreto al usuario final con recomendaciones aplicables (no solo evidencia descriptiva).
- **Dependencias:** Depende de Pendiente 3 (merge a main).
- **Complejidad estimada:** Alta. Requiere leer los 6 documentos, sintetizar recomendaciones por temática y edad, validar con el usuario, y luego integrar al sitio.
- **Principios relevantes:** C.11 (Transparencia del cambio) — cada recomendación debe ser trazable a su fuente. C.7 (Portabilidad) — el sitio debe seguir funcionando offline sin requerir descarga de los PDFs.
- **Precauciones:** El traspaso v02 menciona que UNICEF y CJE UC bloquearon descarga automatizada. Resolver eso antes (Pendiente 5).
- **Sugerencia de enfoque:** Leer los 6 documentos primero (manualmente o vía descarga local), sintetizar recomendaciones por temática+edad en un draft, validar con el usuario, luego integrar al `recomendaciones.json`.
- **Criterio de éxito sugerido:** Sección Recomendaciones visible en el sitio. Recomendaciones agrupadas por edad y por temática. Cada recomendación cita su fuente.

#### Pendiente 5: P4 — Descargar PDFs UNICEF/CJE UC localmente
- **Descripción:** Ejecutar comandos `curl` documentados en `20_recursos/README.md` para tener copia local de los 6 PDFs.
- **Contexto:** Pendiente desde sesión 2. Bloqueado porque algunos dominios bloquearon descarga automatizada en sesión web.
- **Tipo:** Tarea de preparación.
- **Impacto:** Sin esto, P1 no puede leer los documentos.
- **Dependencias:** Bloqueante para Pendiente 4.
- **Complejidad estimada:** Baja. Es ejecutar 6 comandos curl en terminal.
- **Principios relevantes:** Ninguno crítico.
- **Precauciones:** Verificar que las URLs siguen activas. Si alguna cambió, actualizar `20_recursos/README.md`.
- **Sugerencia de enfoque:** Ejecutar los 6 comandos en terminal. Si alguno falla, buscar URL alternativa.
- **Criterio de éxito sugerido:** 6 PDFs presentes en `20_recursos/` (no commiteados al repo por `.gitignore`).

#### Pendiente 6: Actualizar paleta y tipografía en CLAUDE.md
- **Descripción:** Reemplazar la documentación obsoleta de paleta y tipografía en CLAUDE.md por los valores del wireframe B.
- **Contexto:** CLAUDE.md sigue diciendo paleta `#f7f8fa`/`#1a1d24`/`#042f4d`/`#b07a4a` y tipografía 15px/1.65. El wireframe B usa `#ffffff`/`#042f4d`/`#5c728e`/`#d6dfe8` sin cálido, y 13px/1.55.
- **Tipo:** Documentación.
- **Impacto:** Bajo en el corto plazo; medio en el mediano (sesiones futuras reciben info obsoleta).
- **Dependencias:** Ninguna estricta, pero conviene hacerlo cuando el wireframe B esté implementado completo (Fase 4-5) para asegurar que los valores finales son estables.
- **Complejidad estimada:** Baja. 10 minutos.
- **Principios relevantes:** C.11 (Transparencia).
- **Sugerencia de enfoque:** Junto con Pendiente 3 (Fase 6).
- **Criterio de éxito sugerido:** CLAUDE.md refleja paleta y tipografía actuales.

### 11.2 Evaluación de deuda técnica

- **Zona frágil:** Ausencia de validación automática pre-build. Hoy si alguien edita JSON manualmente y comete error de IDs (ref a paper inexistente, cellId a celda inexistente), el build no lo detecta. Solo se detecta al renderizar o por validación manual. — Violación de C.8 (Validación de integridad).
  - **Oportunidad de mejora:** Agregar al `00_build.sh` un check pre-build que valide: (a) todos los refs en claims, featured_studies y andamiaje.claims existen en bibliografia.json; (b) todos los upstream/downstream.to existen como key en claims.json; (c) todos los cellIds en andamiaje.chains existen como key en claims.json; (d) todos los groups y types en bibliografia.json existen en metadata.json. Si alguno falla, abortar el build con mensaje claro. Trabajo previsto para Pendiente 3 (Fase 6).

- **Zona frágil:** CLAUDE.md tiene tres ediciones acumuladas sin auditoría unificada. Información de paleta y tipografía desactualizada (Pendiente 6).
  - **Oportunidad de mejora:** Reescritura completa de CLAUDE.md en Pendiente 3 (Fase 6) con el estado real al cierre del refactor.

- **Zona frágil:** `extraer_claims.py` está preservado como andamio pero no está documentado cómo correrlo ni qué requiere. Si en el futuro hay que re-ejecutarlo (caso improbable pero posible), se debería poder hacer sin reinventar el flujo.
  - **Oportunidad de mejora:** Agregar un header al script con "Cómo se usó este script y cuándo se ejecutó". Trabajo de poca prioridad.

### 11.3 Auditoría de cierre (sección F de los principios)

- **¿Cada bloque de transformación tiene un check de validación? (C.8) → Parcial.** Las validaciones cruzadas se ejecutaron al cierre de Sub-fase 3.6 (refs huérfanos, cellIds huérfanos, etc.) y pasaron. Sin embargo, no hay validación automática pre-build que se ejecute siempre. Añadido como deuda técnica en 11.2 y como tarea de Fase 6 en Pendiente 3.

- **¿Los outputs son reproducibles e idempotentes? (C.2, C.3) → Sí.** El `00_build.sh` produce el mismo `index.html` byte-a-byte cada vez que se ejecuta con las mismas fuentes. Verificado durante Fase 1 con `diff` contra `HEAD:index.html`. La indentación uniforme via `json.dumps(indent=2)` garantiza determinismo.

- **¿Hay decisiones metodológicas documentadas como constantes con nombre? (C.11) → Sí.** Las constantes vigentes están listadas en sección 9 de este traspaso. Los IDs de dimensiones, tramos etarios, tipos y grupos bibliográficos viven en `metadata.json` y son la fuente de verdad. No hay números mágicos embebidos en el flujo de build.

- **¿Los datos crudos están aislados y son inmutables? (C.1) → No aplica directamente.** Este proyecto no tiene pipeline de datos crudos (los PDFs UNICEF/CJE UC en `20_recursos/` son referencia, no insumo procesado). El HTML viejo (`/tmp/index_viejo.html`) que se usó como fuente para la extracción fue copiado del commit `130d637` para preservar el original; el index.html actual (en `main` o `refactor/modular-build`) ya no es fuente sino output.

- **¿El script corre de cero sin intervención manual? (C.2 + reproducibilidad) → Sí.** `./00_build.sh` desde el repo limpio produce `index.html` completo. Único requisito: Python 3 instalado (estándar en macOS).

- **¿Paquetes, rutas y constantes están declarados al inicio? (D.R) → Sí en el script bash (todas las constantes al inicio).** No aplica directamente a JS/CSS porque no es contexto R.

- **¿Los nombres de archivos y carpetas cumplen la regla de naming? (D.convenciones generales) → Sí.** Todos sin tildes, sin ñ, sin espacios. `30_documentacion/` (no `documentación/`), `traspaso-cierre-v03.md` (no `traspaso cierre v3.md`).

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

Aplicando los criterios de priorización del protocolo (bugs activos > bloqueantes > deuda técnica crítica > hallazgos de auditoría > alta complejidad > funcionalidad nueva > cosmética):

1. **Pendiente 1 — Fase 4 del refactor (reescribir wireframe B a vanilla JS)** — Bloqueante absoluto: sin render, todo el refactor es invisible. Alta complejidad, mejor abordar al inicio de la sesión con contexto fresco. Criterio de éxito: matriz visible con datos reales, selector funcional, ficha del panel funcional.

2. **Pendiente 2 — Fase 5 del refactor (secciones secundarias)** — Bloqueante para merge. Depende de Pendiente 1. Complejidad media-alta. Criterio de éxito: buscador de bibliografía funcional, andamiaje navegable, todas las anclas internas operativas.

3. **Pendiente 3 — Fase 6 del refactor (validación, docs, merge)** — Bloqueante para todo lo posterior. Incluye el script de validación automática pre-build (hallazgo de auditoría). Criterio de éxito: PR mergeado, GitHub Pages servido, CLAUDE.md actualizado.

**Diferir para sesión posterior:**

- **Pendiente 4 — P1 (sección de recomendaciones UNICEF/CJE UC)** — Importante para el valor del producto pero depende del merge del refactor. Mejor sesión dedicada cuando la arquitectura nueva esté estable.
- **Pendiente 5 — P4 (descargar PDFs)** — Tarea de 10 minutos, no requiere sesión propia. Hacerlo antes de Pendiente 4.
- **Pendiente 6 — Actualizar paleta en CLAUDE.md** — Incorporado en Fase 6.

**Cantidad esperada de sesiones para completar el refactor:** 2-3 sesiones. La Fase 4 sola probablemente toma una sesión completa por su complejidad.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** editar `index.html` directamente bajo ninguna circunstancia. Es output del build. Cualquier cambio se hace en `10_fuentes/` y se regenera con `./00_build.sh`. La convención está documentada en CLAUDE.md.
- ⚠️ **NO** modificar `extraer_claims.py` sin antes leer la sección 6, Bug 3 de este traspaso. El parser usa lógica depth-aware específica que es fácil romper.
- ✅ **ANTES** de empezar Fase 4, leer el wireframe B original en `30_documentacion/andamios/wireframe-b-standalone.html` para entender el comportamiento esperado de la interfaz (selector con atenuación, popovers, panel lateral).
- ✅ **ANTES** de cada commit que toque `10_fuentes/`, ejecutar `./00_build.sh` e incluir el `index.html` regenerado en el mismo commit. Convención documentada en CLAUDE.md.
- ✅ **ANTES** del merge a main (Fase 6), implementar la validación automática pre-build en `00_build.sh` que chequea refs huérfanos, cellIds huérfanos, groups/types huérfanos. Es deuda técnica crítica.
- 🔒 La paleta de certeza (`#042f4d`/`#5c728e`/`#d6dfe8`) y la doble codificación (color + figura) son invariantes del diseño visual. No alterar.
- 🔒 Los IDs de celdas (`dimension-edad`), bibliografía (`ApellidoAño`), y cascadas son invariantes para no romper deep linking y refs cruzados. No renombrar.
- 🔒 La rama de trabajo es `refactor/modular-build`. NO hacer commits directamente a `main` hasta el merge formal de Fase 6.

---

## 13. Fragmentos de código de referencia

### Patrón 1: Función render con datos desde `window.__DATA__`

Patrón canónico que usará `app.js` en Fase 4:

```javascript
// Lectura de datos
const { metadata, bibliografia, andamiaje, claims } = window.__DATA__;

// Render de la matriz: itera dimensiones × edades
function renderMatrix() {
  const matrix = document.querySelector('.matrix');
  metadata.dimensions.forEach(dim => {
    metadata.ageGroups.forEach(age => {
      const cellId = `${dim.id}-${age.id}`;
      const cell = claims[cellId];
      if (!cell) return;
      // Render de cada celda...
    });
  });
}
```

### Patrón 2: Conversión de markdown ligero a HTML

Para renderizar `**negrita**` y `*itálica*` en textos de claims:

```javascript
function mdToHtml(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
```

### Patrón 3: Render de cita inline con ref

```javascript
function renderRefs(refs) {
  return refs.map(refId => {
    const entry = bibliografia.find(b => b.id === refId);
    if (!entry) return '';
    return `<a class="ref" href="#bib-${refId}" data-ref-id="${refId}">${refId}</a>`;
  }).join(' ');
}
```

### Patrón 4: Deep linking con hashchange

```javascript
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1); // remove '#'
  const [dimension, age] = hash.split('/');
  if (dimension && age) loadCell(`${dimension}-${age}`);
});
```

### Patrón 5: Bloque de build con validación pre-build (pendiente Fase 6)

Esqueleto para agregar a `00_build.sh`:

```python
# Validación pre-build (a agregar en Fase 6)
all_biblio_ids = {b['id'] for b in data_obj['bibliografia']}
all_cell_ids = set(data_obj['claims'].keys())
all_groups = {g['id'] for g in data_obj['metadata']['biblioGroups']}
all_types = set(data_obj['metadata']['biblioTypes'].keys())

errors = []
# Check 1: refs en claims existen en bibliografía
for cell_id, cell in data_obj['claims'].items():
    for i, claim in enumerate(cell['claims']):
        for ref in claim.get('refs', []):
            if ref not in all_biblio_ids:
                errors.append(f"Ref huérfano '{ref}' en claims.{cell_id}.claims[{i}]")
# Check 2, 3, 4: similar para featured_studies, andamiaje, upstream/downstream, etc.

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y pantallas, sesión 4 (Opus)`
(Reemplazar "Opus" por el modelo que vayas a usar.)

### 14.2 Mensaje de apertura listo para copiar

**Mensaje de apertura:**

> Continuación de sesión sobre el proyecto **Crianza y pantallas**.
>
> Tipo: CONTINUATION. Adjunto los documentos listados a continuación
> para que sigas el protocolo de apertura definido en mis userPreferences.
>
> Por favor entrega el plan de trabajo en el formato estándar (Estado al
> cierre / Pendientes / Ruta propuesta / Decisiones que necesitas),
> basado en el handoff adjunto.

### 14.3 Documentos a adjuntar al nuevo chat

### Documentos de protocolo (siempre)
- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md` (versión vigente)

### Documento de traspaso de esta sesión
- `30_documentacion/traspasos/traspaso-cierre-v03.md` (este documento)

### Archivos del proyecto críticos para retomar Fase 4
- `30_documentacion/activa/CLAUDE.md` — contexto persistente del proyecto, lectura obligatoria al abrir.
- `30_documentacion/andamios/wireframe-b-standalone.html` — wireframe original con la lógica React a portar a vanilla JS. Voluminoso pero necesario.
- `10_fuentes/styles.css` — CSS del wireframe B ya extraído; las clases que `app.js` debe usar.
- `10_fuentes/template.html` — esqueleto con marcadores INJECT_*.
- `10_fuentes/data/claims.json` — datos de las 50 celdas. Voluminoso (~3000 líneas) pero necesario para entender el shape que `app.js` consumirá.
- `10_fuentes/data/metadata.json` — dimensiones, edades, types, groups.
- `10_fuentes/data/bibliografia.json` — referencias.
- `10_fuentes/data/andamiaje.json` — cascadas.
- `00_build.sh` — para entender cómo se inyectan los datos en `window.__DATA__`.

### Archivos de proceso (referencia)
- `30_documentacion/activa/flujo_incorporacion_evidencia.md` — proceso para incorporar nueva evidencia (relevante si surge en medio de Fase 4).
- `30_documentacion/activa/prompt_busqueda_bibliografia.md` — plantilla para agentes de búsqueda (referencia).

### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
