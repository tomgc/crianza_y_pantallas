# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v12
- **Fecha:** 2026-05-31
- **Sesión:** 12 — Batch bibliográfico masivo (8 dimensiones) + unificación de fuentes bibliográficas (P4) + actualización de documentación de prompts.
- **Modelo utilizado:** Claude Sonnet 4.6
- **Entorno:** Web estático (HTML/CSS/JS, GitHub Pages)
- **Archivos principales modificados:** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`, `10_fuentes/glosario-data.js`, `10_fuentes/app.js`, `index.html`, `30_documentacion/activa/prompts_busqueda/` (24 archivos), `30_documentacion/activa/arquitectura_crianza_pantallas.html`, `30_documentacion/activa/README.md` (prompts)

---

## 2. Resumen ejecutivo

La sesión 12 fue la más productiva del proyecto en términos de incorporación de evidencia: se completó el batch bibliográfico para las 8 dimensiones que carecían de búsqueda dedicada (creatividad, vínculo, salud mental, socioemocional, comportamiento, actividad física, sueño y visión), procesando los resultados de búsqueda uno a uno en cadena dentro del chat web y generando los patches directamente sobre los JSONs sin pasar por Claude Code. El corpus pasó de 139 a 174 claims (+35), de 91 a 189 entradas bibliográficas (+98) y los `no_ref: true` bajaron de 54 a 19, cerrando con 0 pendientes reales. Adicionalmente se resolvió P4 (unificación de las dos fuentes bibliográficas paralelas: `window.GLOSARIO.BIBLIO` absorbida por `window.__DATA__.bibliografia`), se corrigió la autoría errónea de `Foreman2024` (paper de Zong et al.), se actualizó el README de prompts de búsqueda y se commitearon los 24 archivos de prompts y resultados. Al cierre el repo está en commit `3dbde98` (batch bibliográfico), el sitio está desplegado en `main` con assert de integridad en 0 y working tree limpio salvo el traspaso mismo y el escáner más reciente.

---

## 3. Estado del proyecto al cierre

### Qué funciona

- Sitio en vivo en `https://tomgc.github.io/crianza_y_pantallas/` — `main` en `3dbde98`.
- Pipeline modular completo: build reproducible desde JSONs vía `./00_build.sh`.
- Matriz 10×5: 50 celdas, 174 claims, chips `[ref]` navegables, popovers bibliográficos.
- 4 tabs en header (Matriz, Glosario, Bibliografía, Metodología).
- Footer de contacto en todas las vistas.
- Bibliografía: 189 entradas, filtros + buscador sticky en móvil (≤960px).
- 19 claims interpretativos con `"no_ref": true`. 0 pendientes reales.
- **Fuente bibliográfica unificada:** glosario resuelve sus 9 refs desde `window.__DATA__.bibliografia` (P4). `window.GLOSARIO.BIBLIO` eliminado.
- SEO completo: meta tags, canonical, Open Graph, og:image 200 OK.
- Glosario interactivo modo matriz: 22 términos.
- Responsive: scroll horizontal en grilla móvil; ficha en columna única bajo 960px.
- 10 prompts de búsqueda bibliográfica + resultados trackeados en `30_documentacion/activa/prompts_busqueda/`.

### Qué no funciona / deuda conocida

- **Glosario móvil:** índice compacto pendiente (D).
- **Texto del subtítulo hardcodeado** en `renderTopBar()` de `app.js`, no en `metadata.json`.
- **Archivos en `10_fuentes/` sin prefijos numéricos** — deuda estructural no urgente.
- **`estructura_actual.md` desactualizada:** el alias apunta al escáner de apertura de sesión (12:59:50), no al de cierre (19:37:54). Requiere un commit de docs con el escáner final.

### Qué cambió respecto al traspaso v11

| Aspecto | v11 | v12 |
|---|---|---|
| Claims totales | 139 | **174** (+35) |
| Claims `no_ref: true` | 54 | **19** (−35) |
| Bibliografía | 91 entradas | **189** (+98) |
| Pendientes reales (assert) | 0 | **0** |
| Fuente bibliográfica glosario | Paralela (`GLOSARIO.BIBLIO`) | **Unificada** (`__DATA__.bibliografia`) |
| Autoría `Foreman2024` | Foreman J. (incorrecto) | **Zong Z. et al.** (corregido) |
| Prompts de búsqueda trackeados | 06 (cognición, lenguaje) | **Todos (01–10 + README)** |
| Commit HEAD | `d6de594` | **`3dbde98`** |

---

## 4. Registro detallado de cambios realizados

#### Cambio 1: P4 — Unificación de fuentes bibliográficas

- **Archivo(s) afectado(s):** `10_fuentes/glosario-data.js`, `10_fuentes/app.js`, `10_fuentes/data/bibliografia.json`, `index.html`
- **Categoría temática:** Deuda técnica / limpieza de código
- **Qué se hizo:** Eliminado bloque `const BIBLIO = {...}` de `glosario-data.js` (−2744 chars). Los 9 IDs en `refs` de los términos del glosario actualizados a CamelCase (27 ocurrencias). `window.GLOSARIO` exporta sin `BIBLIO`. En `app.js` L599: `G.BIBLIO[k]` → `biblioById[k]`. 4 entradas nuevas en `bibliografia.json` para los IDs que solo existían en la fuente paralela: `Anderson2007`, `Christakis2004`, `Coyne2021`, `ChildrenOf2020s`.
- **Por qué se hizo:** Dos fuentes bibliográficas paralelas con riesgo de divergencia creciente (91 vs. 9 entradas). Con la bibliografía en 91 el riesgo era mayor que cuando arrancó.
- **Cómo se verificó:** Validación cruzada Python: 9 refs únicos del glosario, todos resueltos en bib.json; 0 IDs lowercase persistentes; `G.BIBLIO` ausente en app.js; `biblioById` en scope L27.
- **Commit:** `f4294f9`

#### Cambio 2: Corrección autoría `Foreman2024`

- **Archivo(s) afectado(s):** `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Corrección de integridad bibliográfica
- **Qué se hizo:** La entrada `Foreman2024` tenía autoría incorrecta (Foreman J., Xiong S., Keel S.). El paper en BMC Public Health 24:1625 con PMID 38890613 es de Zong Z., Zhang Y., Qiao J., Tian Y., Xu S. Actualizada la autoría, el título y la URL. Los claims que referenciaban `Foreman2024` no cambian de ID.
- **Por qué se hizo:** Integridad bibliográfica; la autoría incorrecta es un error factual que podría generar confusión editorial.
- **Cómo se verificó:** DOI 10.1186/s12889-024-19113-5 verificado contra PMID 38890613.
- **Commit:** `3dbde98`

#### Cambio 3: Batch bibliográfico — Creatividad

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Incorporación de evidencia
- **Qué se hizo:** 5 ediciones a claims existentes + 6 claims nuevos. 11 entradas nuevas en bibliografía: `Putnick2023`, `Sugiyama2023`, `Bukhalenkova2023`, `Zeissig2024`, `Sapounidis2025`, `Papadakis2024`, `Slattery2025`, `SlatteryRCT2024`, `Zhang2024`, `Loudoun2022`, `Hesketh2026`. Hallazgo clave: no existe meta-análisis directo pantalla→creatividad; la evidencia más robusta es de desplazamiento del juego (Putnick 2023, N=3.894). ECA de Minecraft (SlatteryRCT2024) halló mayor creatividad en el grupo control.
- **Commit:** `3dbde98`

#### Cambio 4: Batch bibliográfico — Vínculo

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Incorporación de evidencia
- **Qué se hizo:** 5 ediciones + 8 claims nuevos. 14 entradas nuevas: `Zhang2025`, `Leonova2025`, `Hood2021`, `Stockdale2020`, `Tidemann2022`, `vandenHeuvel2026`, `Chamam2024`, `Mason2024`, `CiminoCerniglia2025`, `Linder2021`, `Zhao2025`, `BodrozicSelak2025`, `Roche2026`, `Neely2026`. Hallazgo clave (Chamam 2024, N=51): cualquier distracción del cuidador (digital o no) deteriora la sensibilidad parental equivalentemente — el factor de riesgo es la desatención, no la pantalla per se. Primera evidencia neurofisiológica de mecanismo: dual-EEG reduce sincronía cerebro-a-cerebro (vandenHeuvel 2026).
- **Commit:** `3dbde98`

#### Cambio 5: Batch bibliográfico — Salud mental

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Incorporación de evidencia
- **Qué se hizo:** 5 ediciones + 6 claims nuevos. 13 entradas nuevas: `Chen2024`, `Yoshizawa2026`, `LiL2022`, `Zhou2024`, `Ferguson2024`, `Liu2024`, `Xiao2025`, `Nagata2025a`, `Nagata2025b`, `Plackett2023`, `Li2025`, `Vuorre2021`, `Dahlgren2024`. Excluido: `EstudioChile2024` (bandera roja de autoría no verificada). Hallazgo discriminante (Xiao 2025, ABCD, N=4.285): el uso adictivo predice conducta suicida (RR 2,14–2,39); el tiempo total de pantalla basal NO se asoció con ningún desenlace.
- **Commit:** `3dbde98`

#### Cambio 6: Batch bibliográfico — Socioemocional

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Incorporación de evidencia
- **Qué se hizo:** 10 ediciones + 2 claims nuevos. 11 entradas nuevas: `Ahmer2025`, `Jia2025`, `Zhang2023`, `Ophir2023`, `Vanderloo2025`, `Avci2024`, `Berg2024`, `Wright2024`, `Gillioz2025`, `Shoshani2021`, `Myruski2018`. Hallazgo relevante (Ophir 2023, JAMA, N=562.131): la asociación pantalla→autismo no está suficientemente respaldada; causalidad inversa plausible.
- **Commit:** `3dbde98`

#### Cambio 7: Batch bibliográfico — Comportamiento

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Incorporación de evidencia
- **Qué se hizo:** 8 ediciones + 3 claims nuevos. 13 entradas nuevas: `Rega2023`, `NamaziSadeghi2024`, `Neville2021`, `Descarpentry2024`, `Konok2024`, `CoyneTantrums2021`, `Coyne2022`, `SchmidtPersson2024`, `Rhodes2020`, `Fan2021`, `LiH2025`, `Essex2025`, `Kessafoglu2024`. Colisiones de IDs resueltas: `Li2025` → `LiH2025` (fantasía/EF), `Coyne2021` → `CoyneTantrums2021` (tantrums). Hallazgo clave (Kessafoglu 2024): el efecto del contenido fantástico sobre el control inhibitorio desaparece tras 10 minutos — no hay daño sostenido.
- **Commit:** `3dbde98`

#### Cambio 8: Batch bibliográfico — Actividad física

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Incorporación de evidencia
- **Qué se hizo:** 8 ediciones + 6 claims nuevos. 12 entradas nuevas: `Neville2024`, `Boyland2022`, `ChenYJ2025`, `Kou2024`, `HernandezMosqueira2025`, `Haghjoo2022`, `Pedersen2022`, `ChenB2020`, `Pirnes2022`, `Wang2024`, `Yuan2024`, `Velazquez2025`. `Lai2025` ya existía, reutilizada. Bandera: `HernandezMosqueira2025` sin DOI verificado — URL PMC como alternativa. Hallazgo más fuerte (Pedersen 2022, ECA SCREENS, N=181): reducir pantallas 2 semanas → +44,8 min/día no sedentario.
- **Commit:** `3dbde98`

#### Cambio 9: Batch bibliográfico — Sueño

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Incorporación de evidencia
- **Qué se hizo:** 9 ediciones + 1 claim nuevo. 8 entradas nuevas: `Li2020`, `Emond2021`, `Pickard2024`, `Cheung2017`, `Hiltunen2021`, `CarrascoMarin2022`, `Akacem2018`, `Hartstein2025`. `Janssen2020` y `Carter2016` ya existían. Datos cuantitativos ancladosados: cada hora de pantalla → 11–13 min retraso acostarse, ~15 min menos sueño total. Único ECA en toddlers (Pickard 2024): retirar pantallas pre-sueño mejora eficiencia d=0,56.
- **Commit:** `3dbde98`

#### Cambio 10: Batch bibliográfico — Visión

- **Archivo(s) afectado(s):** `10_fuentes/data/claims.json`, `10_fuentes/data/bibliografia.json`
- **Categoría temática:** Incorporación de evidencia
- **Qué se hizo:** 7 ediciones + 3 claims nuevos. 12 entradas nuevas: `Guedes2024`, `LiDan2024`, `Dhakal2022`, `Song2026`, `Mataftsi2023`, `Ashby2025`, `Abounoori2022`, `Hu2021`, `JingLi2025`, `Yang2020`, `Matsumura2022`, `Zhu2026`. `Zong2024` ya existía. Hallazgo relevante: filtros de luz azul no muestran evidencia de prevenir fatiga visual digital (Mataftsi 2023, GRADE). Prevalencia miopía LATAM: 8,61% (Guedes 2024, N=165.721) — sustancialmente menor que Asia oriental.
- **Commit:** `3dbde98`

#### Cambio 11: Documentación — prompts de búsqueda trackeados

- **Archivo(s) afectado(s):** `30_documentacion/activa/prompts_busqueda/` (24 archivos)
- **Categoría temática:** Documentación / gobernanza
- **Qué se hizo:** Commit de todos los prompts (01–10 + 11) y sus archivos de resultados. README actualizado: `50_documentacion/` → `30_documentacion/`, `refactor/modular-build` → `main`. El rename `09→06` detectado por git al 100% (contenido idéntico).
- **Commit:** `d6de594` (README), `3dbde98` (prompts y resultados)

#### Cambio 12: Escáner y diagrama de arquitectura

- **Archivo(s) afectado(s):** `30_documentacion/estructura/`, `30_documentacion/activa/arquitectura_crianza_pantallas.html`
- **Categoría temática:** Documentación / gobernanza
- **Qué se hizo:** Escáner ejecutado al cierre (19:37:54), snapshots versionados. Diagrama de arquitectura HTML generado en sesión 11 finalmente commiteado.
- **Commit:** commit de docs tras el batch (ver Claude Code)

---

## 5. Backlog acumulativo del proyecto

### 5.1 Objetivo del proyecto

*Crianza y Pantallas (`crianza_y_pantallas`) es una síntesis crítica de la evidencia científica disponible (2020–2026) sobre el impacto del uso de pantallas en el desarrollo infantil de 0 a 12 años. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios (50 celdas), con doble codificación de certeza, popovers bibliográficos y andamiaje de cascadas entre celdas. Está construido como sitio web estático (HTML/CSS/JS vanilla, JSON como datos) publicado vía GitHub Pages. La estructura es modular con build reproducible desde JSON vía `./00_build.sh`. El desarrollo comenzó en sesión 1 con un wireframe React standalone y migró en Fase 1–4 a la arquitectura modular actual.*

### 5.2 Nota metodológica

*Cada ítem del backlog representa una solicitud distinguible del usuario, no las acciones técnicas para implementarla. Los errores introducidos por el asistente y corregidos inmediatamente no se contabilizan; sí se cuentan los bugfixes que surgen en sesión y se resuelven dentro de ella. La clasificación temática es aproximada porque muchos cambios tocan más de una categoría; en esos casos se clasifica por la intención primaria. Las fuentes del conteo son los documentos de traspaso de cierre y el historial de conversación.*

### 5.3 Clasificación temática

| Categoría | N° aprox. | % | Descripción |
|---|---|---|---|
| Refactor estructural | ~25 | ~10% | Migración modular del wireframe React a arquitectura por carpetas numeradas |
| Datos y contenido (claims iniciales) | ~20 | ~8% | Llenado inicial de `claims.json` con celdas, claims, andamiaje y citas |
| Limpieza editorial | ~23 | ~9% | Eliminación de citas inline, expansión de siglas, corrección de textos |
| Corrección de integridad bibliográfica | ~23 | ~9% | Huérfanas, mismatches, refs vacíos, `no_ref: true`, P1/P3, P4 unificación |
| Incorporación de evidencia | ~62 | ~25% | Sesiones 4, 9, 11, 12: papers, ediciones de claims, claims nuevos por dimensión |
| Diseño visual y UX | ~31 | ~12% | Wireframe B, paleta, responsive, estilos, footer, sticky móvil |
| Implementación de motor JS | ~14 | ~6% | `app.js`, render, panel lateral, popovers, deep linking; glosario interactivo |
| Bibliografía y popovers | ~7 | ~3% | Diseño del popover, navegación, filtros |
| Infraestructura / herramientas operativas | ~14 | ~6% | Escáner, flujo de incorporación, prompts modulares, publicación, build, SEO, og:image |
| Documentación / gobernanza | ~16 | ~6% | CLAUDE.md, README, convenciones, traspasos, diagrama arquitectura, prompts trackeados |
| Andamiaje entre celdas | ~5 | ~2% | Cascadas entre celdas |
| Corrección factual | ~3 | ~1% | 5 Cs AAP, certeza de la evidencia, autoría Foreman2024 |
| Deuda técnica / limpieza de código | ~4 | ~2% | Código muerto, handlers inertes, CSS obsoleto, P4 unificación BIBLIO |

**Total estimado: ~247**

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
| 9 | v09 | ~11 | Sonnet 4.6 | UI: selectores + fusión vistas + subtítulo; batch cognición |
| 10 | v10 | ~11 | Sonnet 4.6 | Footer contacto, sticky móvil, código muerto, no_ref |
| 11 | v11 | ~8 | Sonnet 4.6 | SEO + og:image (P-QA); 11 refs empíricos (P1/P3); arquitectura |
| 12 | v12 | ~47 | Sonnet 4.6 | P4 unificación bib; batch 8 dimensiones; docs prompts |

**Total acumulado: ~247 cambios.**

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

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v08.md`, sección 5.5, ítems 51–53.)*

---

### Sesión 9 (Sonnet 4.6) — 2026-05-30

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v09.md`, sección 5.5, ítems 54–64.)*

---

### Sesión 10 (Sonnet 4.6) — 2026-05-31

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v10.md`, sección 5.5, ítems 65–71.)*

---

### Sesión 11 (Sonnet 4.6) — 2026-05-31

*(Contenido íntegro en `30_documentacion/traspasos/traspaso-cierre-v11.md`, sección 5.5, ítems 72–78.)*

---

### Sesión 12 (Sonnet 4.6) — 2026-05-31

P4 + batch bibliográfico masivo (8 dimensiones) + documentación de prompts.

79. P4 — Bloque `const BIBLIO` eliminado de `glosario-data.js`. 9 IDs de refs actualizados a CamelCase (27 ocurrencias). `window.GLOSARIO` exporta sin `BIBLIO`.
80. P4 — `app.js` L599: `G.BIBLIO[k]` → `biblioById[k]`. Una línea quirúrgica.
81. P4 — 4 entradas nuevas en `bibliografia.json`: `Anderson2007`, `Christakis2004`, `Coyne2021`, `ChildrenOf2020s`.
82. Corrección autoría `Foreman2024` → Zong Z. et al. (BMC Public Health 24:1625, PMID 38890613).
83. Batch creatividad — 5 ediciones a claims existentes + 6 claims nuevos. 11 entradas bibliográficas: `Putnick2023`, `Sugiyama2023`, `Bukhalenkova2023`, `Zeissig2024`, `Sapounidis2025`, `Papadakis2024`, `Slattery2025`, `SlatteryRCT2024`, `Zhang2024`, `Loudoun2022`, `Hesketh2026`.
84. Batch vínculo — 5 ediciones + 8 claims nuevos. 14 entradas: `Zhang2025`, `Leonova2025`, `Hood2021`, `Stockdale2020`, `Tidemann2022`, `vandenHeuvel2026`, `Chamam2024`, `Mason2024`, `CiminoCerniglia2025`, `Linder2021`, `Zhao2025`, `BodrozicSelak2025`, `Roche2026`, `Neely2026`.
85. Batch salud mental — 5 ediciones + 6 claims nuevos. 13 entradas: `Chen2024`, `Yoshizawa2026`, `LiL2022`, `Zhou2024`, `Ferguson2024`, `Liu2024`, `Xiao2025`, `Nagata2025a`, `Nagata2025b`, `Plackett2023`, `Li2025`, `Vuorre2021`, `Dahlgren2024`.
86. Batch socioemocional — 10 ediciones + 2 claims nuevos. 11 entradas: `Ahmer2025`, `Jia2025`, `Zhang2023`, `Ophir2023`, `Vanderloo2025`, `Avci2024`, `Berg2024`, `Wright2024`, `Gillioz2025`, `Shoshani2021`, `Myruski2018`.
87. Batch comportamiento — 8 ediciones + 3 claims nuevos. 13 entradas: `Rega2023`, `NamaziSadeghi2024`, `Neville2021`, `Descarpentry2024`, `Konok2024`, `CoyneTantrums2021`, `Coyne2022`, `SchmidtPersson2024`, `Rhodes2020`, `Fan2021`, `LiH2025`, `Essex2025`, `Kessafoglu2024`.
88. Batch actividad física — 8 ediciones + 6 claims nuevos. 12 entradas: `Neville2024`, `Boyland2022`, `ChenYJ2025`, `Kou2024`, `HernandezMosqueira2025`, `Haghjoo2022`, `Pedersen2022`, `ChenB2020`, `Pirnes2022`, `Wang2024`, `Yuan2024`, `Velazquez2025`.
89. Batch sueño — 9 ediciones + 1 claim nuevo. 8 entradas: `Li2020`, `Emond2021`, `Pickard2024`, `Cheung2017`, `Hiltunen2021`, `CarrascoMarin2022`, `Akacem2018`, `Hartstein2025`.
90. Batch visión — 7 ediciones + 3 claims nuevos. 12 entradas: `Guedes2024`, `LiDan2024`, `Dhakal2022`, `Song2026`, `Mataftsi2023`, `Ashby2025`, `Abounoori2022`, `Hu2021`, `JingLi2025`, `Yang2020`, `Matsumura2022`, `Zhu2026`.
91. README de `prompts_busqueda/` actualizado: rutas `50_documentacion` → `30_documentacion`, rama `refactor/modular-build` → `main`.
92. 24 archivos de `prompts_busqueda/` trackeados y commiteados (prompts 01–11 + resultados 01–10 con rename `09→06`).
93. Diagrama de arquitectura `arquitectura_crianza_pantallas.html` commiteado (generado en sesión 11, pendiente desde entonces).
94. Escáner de cierre sesión 12 (19:37:54) versionado en `30_documentacion/estructura/`.

---

### 5.6 Cambios respecto a la versión anterior del backlog

- Se agregaron 16 ítems nuevos (79–94) correspondientes a la sesión 12.
- "Incorporación de evidencia" creció de ~24 a ~62 (batches de 8 dimensiones).
- "Corrección de integridad bibliográfica" creció de ~21 a ~23 (P4, corrección Foreman2024).
- "Documentación / gobernanza" creció de ~12 a ~16 (prompts trackeados, README, escáner).
- "Deuda técnica / limpieza de código" creció de ~3 a ~4 (P4 unificación BIBLIO).
- "Corrección factual" creció de ~2 a ~3 (autoría Foreman2024).
- Total estimado pasó de ~200 a ~247.

---

## 6. Bugs encontrados y su resolución

No aplica en esta sesión. No se encontraron bugs durante la implementación. Las únicas correcciones fueron la autoría de `Foreman2024` (error factual de atribución) y la gestión de colisiones de IDs al procesar comportamiento (`Li2025` → `LiH2025`, `Coyne2021` → `CoyneTantrums2021`), ambas detectadas y resueltas preventivamente antes de escribir código.

---

## 7. Aprendizajes y restricciones técnicas descubiertas

- **Regla:** Al procesar batches bibliográficos en cadena, verificar colisiones de IDs antes de codificar, no durante. La dimensión comportamiento tuvo dos: `Li2025` (ya existía para salud mental) y `Coyne2021` (ya existía por P4).
  - **Principio:** B.1 (no asumir el estado del entorno).
  - **Contexto:** Con 189 entradas en bib.json, la probabilidad de colisión crece. El script de verificación al inicio de cada batch es obligatorio.

- **Regla:** Los batches pueden procesarse en cadena en el chat web sin pasar por Claude Code entre dimensión y dimensión. Los JSONs se acumulan en memoria de sesión y Claude Code solo interviene al final para copiar, validar y commitear.
  - **Principio:** E (flujo de trabajo: construir incrementalmente).
  - **Contexto:** Esta sesión procesó 8 dimensiones consecutivas sin degradación de calidad ni confusión de estados.

- **Regla:** `Foreman2024` en bib.json tenía autoría incorrecta (Foreman en lugar de Zong et al.). El verdadero Foreman 2021 es el meta-análisis de Lancet Digital Health. Verificar siempre la autoría contra PMID antes de usar una entrada existente como base de un claim nuevo.
  - **Principio:** C.11 (trazabilidad).

*(Reglas anteriores vigentes: ver secciones 7 de traspasos v06–v11.)*

---

## 8. Decisiones de diseño tomadas

#### Decisión 1 (v12): Batches bibliográficos procesados en chat web, no en Claude Code

- **Decisión:** Los patches a `claims.json` y `bibliografia.json` se generan en el chat web y Claude Code solo copia los JSONs finales.
- **Alternativas consideradas:** (a) Enviar cada batch a Claude Code como instrucciones paso a paso (como se hizo con cognición y lenguaje); (b) procesamiento mixto.
- **Justificación:** El chat web permite inspección visual inmediata del mapeo paper→celda antes de codificar, y la validación cruzada Python se puede correr aquí. Para batches de 10+ papers por dimensión, el flujo es más ágil que generar un prompt para Claude Code por cada uno.
- **Implicancia:** Los prompts `01_resultados_*.md` son la fuente de verdad del razonamiento editorial; los JSONs son el output. Esta asimetría debe mantenerse documentada.

#### Decisión 2 (v12): `no_ref: true` como categoría permanente, no deuda

- **Decisión:** Los 19 claims restantes con `no_ref: true` se mantienen como categoría editorial legítima (claims interpretativos o de síntesis), no como deuda pendiente.
- **Alternativas consideradas:** Intentar buscar refs para todos.
- **Justificación:** Son afirmaciones de encuadre ("la evidencia en este tramo es escasa", "el mecanismo plausible es X") que no tienen paper directo por diseño. Forzar una ref los distorsionaría editorialmente.
- **Implicancia:** Una sesión futura puede revisar los 19 uno a uno para decidir si alguno puede respaldarse o debe eliminarse, pero no es deuda urgente.

---

## 9. Constantes, configuraciones y parámetros vigentes

| Constante | Valor actual | Archivo | Nota |
|-----------|-------------|---------|------|
| `--content-width` | 700px | `10_fuentes/styles.css` | Aplica a vistas secundarias |
| `--page-pad-x` | 32px (desktop) / 18px (≤960px) | `10_fuentes/styles.css` | |
| `--page-pad-y` | 28px (desktop) / 20px (≤960px) | `10_fuentes/styles.css` | |
| Tabs en header | 4 (Matriz, Glosario, Bibliografía, Metodología) | `10_fuentes/app.js` | |
| Tramos etarios | 5 | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Dimensiones | 10 | `10_fuentes/data/metadata.json` | Orden canónico fijo |
| Certeza levels | h / m / l | `10_fuentes/data/metadata.json` + `app.js` | Alta/Media/Baja |
| Términos glosario | 22 | `10_fuentes/glosario-data.js` | `window.GLOSARIO` |
| Refs bibliografía principal | **189** | `10_fuentes/data/bibliografia.json` | +98 desde v11 |
| Total claims | **174** | `10_fuentes/data/claims.json` | +35 desde v11 |
| Claims con `no_ref: true` | **19** | `10_fuentes/data/claims.json` | −35 desde v11 |
| Claims pendientes reales | **0** | `10_fuentes/data/claims.json` | Assert limpio |
| URL publicada | `https://tomgc.github.io/crianza_y_pantallas/` | GitHub Pages desde `main` | Activa en `3dbde98` |
| Rama de trabajo | `main` directo | Git | Sin rama feature activa |
| Email de contacto | `tgonzalez@gmail.com` | `template.html`, `app.js` | Codificado en entidades HTML |

---

## 10. Arquitectura de archivos relevante

Referencia: `30_documentacion/estructura/estructura_actual.md` (escáner ejecutado al cierre sesión 12, 2026-05-31 19:37:54).

**Cambios estructurales en esta sesión:**
- `10_fuentes/glosario-data.js` — bloque `const BIBLIO` eliminado (−2744 chars).
- `10_fuentes/app.js` — L599 quirúrgica: `G.BIBLIO[k]` → `biblioById[k]`.
- `10_fuentes/data/claims.json` — 139→174 claims (+35).
- `10_fuentes/data/bibliografia.json` — 91→189 entradas (+98); autoría `Foreman2024` corregida.
- `30_documentacion/activa/prompts_busqueda/` — 24 archivos trackeados (prompts 01–11, resultados 01–10, README).
- `30_documentacion/activa/arquitectura_crianza_pantallas.html` — commiteado.
- `index.html` — regenerado (+/− miles de líneas por nuevo contenido de claims y bibliografía).

**Verificación contra política:**
- ⚠️ Proyecto usa `30_documentacion/`, política dice `50_documentacion/`. Excepción documentada (Decisión 1, v05).
- ⚠️ Archivos en `10_fuentes/` sin prefijos numéricos (P-ESTRUCTURA, diferido).
- Sin `40_salidas/`: excepción documentada (output es `index.html` en raíz).

---

## 11. Tareas pendientes, próximos pasos y ruta sugerida

### 11.1 Inventario de pendientes

#### Pendiente D: Glosario móvil — rediseño de índice

- **Descripción:** En móvil el índice ocupa demasiado espacio antes de la ficha. Necesita presentación más compacta (índice colapsable o chips compactos).
- **Tipo:** UI / UX móvil.
- **Complejidad:** Media-alta. Sesión dedicada. Requiere `app.js` + `styles.css`.
- **Criterio de éxito:** Usuario llega a ficha de término con scroll mínimo en móvil.

#### Pendiente P5: Glosario modos alpha y relevancia

- **Tipo:** Funcionalidad nueva.
- **Complejidad:** Media (~1 sesión).
- **Criterio de éxito:** Toggle alpha/relevancia funcional en la vista glosario.

#### Pendiente P6: Fase 6 — adolescencia

- **Tipo:** Contenido / funcionalidad nueva (nuevo tramo etario).
- **Complejidad:** Alta. Sesión dedicada.

#### Pendiente P7: Actualizar prompts de búsqueda bibliográfica

- **Descripción:** La sección "Lo que ya tenemos integrado" en cada prompt apunta al corpus anterior (91 entradas). Debe actualizarse a 189 entradas con el script del README.
- **Tipo:** Documentación.
- **Complejidad:** Baja. Entre sesiones o inicio de próxima sesión.
- **Criterio de éxito:** Todos los prompts tienen la lista de IDs vigente para evitar que agentes externos propongan papers ya integrados.

#### Pendiente P8: PDFs UNICEF/CJE UC

- **Tipo:** Documentación. ~10 minutos. Entre sesiones.

#### Pendiente P-ESTRUCTURA: Prefijos numéricos en `10_fuentes/`

- **Descripción:** `app.js`, `styles.css`, `template.html`, `glosario-data.js` y JSONs en `10_fuentes/data/` sin prefijo numérico.
- **Tipo:** Deuda estructural.
- **Complejidad:** Media. Requiere `prompt_migrar_estructura.md` y DRY_RUN.
- **Precaución:** No combinar con otras ediciones. Sesión dedicada con commit limpio previo.
- **Criterio de éxito:** Build OK después de renombrar; 0 referencias a nombres antiguos.

#### Pendiente Ma2025: Verificar DOI y completar autores

- **Tipo:** Deuda epistémica. Entre sesiones.
- **Criterio de éxito:** DOI verificado, autores completos, entrada integrada al corpus.

#### Pendiente HernandezMosqueira2025: Verificar DOI

- **Descripción:** La entrada usa URL de PMC como proxy. DOI exacto no verificado al cierre de sesión.
- **Tipo:** Deuda epistémica. Entre sesiones.
- **Criterio de éxito:** DOI resuelto y actualizado en `bibliografia.json`.

#### Pendiente no_ref-review: Revisión de los 19 claims interpretativos

- **Descripción:** Con el corpus maduro (189 entradas), revisar los 19 `no_ref: true` celda por celda para decidir si alguno puede respaldarse, debe reescribirse o puede eliminarse.
- **Tipo:** Revisión editorial.
- **Complejidad:** Media. ~1 sesión.
- **Criterio de éxito:** Cada `no_ref: true` restante tiene justificación editorial explícita.

### 11.2 Evaluación de deuda técnica

- **Prompts de búsqueda desactualizados:** la lista de IDs integrados en cada prompt es la mayor fuente de ruido para la próxima ronda de batches bibliográficos. Priorizar actualización antes de ejecutar nuevos prompts.
- **`HernandezMosqueira2025` sin DOI:** riesgo bajo pero documentado; resolver entre sesiones.
- **Archivos sin prefijos en `10_fuentes/`:** deuda estructural no urgente. Sesión dedicada.

### 11.3 Auditoría de cierre

- **¿Cada bloque de transformación tiene check de validación? (C.8)** → Sí. Validación cruzada Python antes de cada commit: total, no_ref, pendientes, huérfanos (claims y glosario), duplicados.
- **¿Los outputs son reproducibles e idempotentes? (C.2, C.3)** → Sí. `./00_build.sh` regenera `index.html` desde fuentes sin estado intermedio.
- **¿Hay decisiones metodológicas documentadas como constantes con nombre? (C.11)** → Sí. Variables CSS con nombres semánticos. Email y LinkedIn documentados en sección 9.

### 11.4 Ruta de desarrollo sugerida para la próxima sesión

1. **P7 — Actualizar lista de IDs en prompts de búsqueda** — 10 min, entre sesiones o inicio de sesión. Necesario antes de ejecutar más batches bibliográficos.
2. **no_ref-review — Revisión editorial de los 19 claims** — consolidar el corpus antes de agregar más volumen.
3. **D — Glosario móvil rediseño** — sesión dedicada cuando haya energía para UI compleja.
4. **P5 — Modos alpha/relevancia en glosario** — funcionalidad nueva, después de resolver deuda.

**Diferir:**
- P-ESTRUCTURA — sesión dedicada con protocolo de migración.
- P6 (adolescencia) — sesión dedicada, alta complejidad.

---

## 12. Instrucciones específicas para la próxima sesión

- ⚠️ **NO** usar el umbral de "86 minutos" en ningún claim relacionado con COT20s/Fish 2026. El efecto es continuo. Ver Decisión 2 (v11).
- ⚠️ **NO** citar cifras de efecto cuantitativas de `Chen2024` ni los RR de ideación suicida de `Xiao2025` sin acceder a los textos completos — no figuran en los abstracts.
- ⚠️ **NO** integrar `Ma2025` hasta verificar el DOI en la versión final del journal.
- ⚠️ **NO** integrar `EstudioChile2024` (Frontiers in Education 9:1407021) hasta verificar la autoría completa contra PubMed.
- ⚠️ **NO** citar el dato "88% supresión melatonina" (Akacem 2018) sin sus banderas: n=10, 1000 lux, estudio pre-2020. No citar desde notas de prensa.
- ⚠️ **NO** usar `HernandezMosqueira2025` como referencia citada hasta verificar el DOI exacto (actualmente solo tiene URL PMC).
- ✅ **ANTES** de ejecutar nuevos prompts de búsqueda bibliográfica: actualizar la sección "Lo que ya tenemos integrado" en cada prompt con los 189 IDs vigentes (ver script en README de prompts_busqueda).
- ✅ **ANTES** de cualquier edición de UI: pedir `app.js` y `styles.css`. No modificar sin leer el estado real.
- ✅ **ANTES** de abrir sesión: ejecutar `Rscript 00_escanear_proyecto.R` y adjuntar `estructura_actual.md`.
- ✅ **RECUERDA** que los adjuntos del chat web no llegan automáticamente al filesystem de Claude Code.
- 🔒 Sin dependencias externas JS — vanilla JS únicamente.
- 🔒 Flujo de trabajo: commit directo a `main` + push.
- 🔒 Los traspasos se generan en el chat web como archivo descargable, no en Claude Code.
- 🔒 El email de contacto está codificado en entidades HTML en `template.html` y `app.js`.

---

## 13. Fragmentos de código de referencia

### Validación cruzada completa (claims + glosario)

```bash
python3 - << 'PYEOF'
import json, re, sys

bib = json.load(open("10_fuentes/data/bibliografia.json"))
claims = json.load(open("10_fuentes/data/claims.json"))
glosario_src = open("10_fuentes/glosario-data.js").read()

bib_ids = {b["id"] for b in bib}
ids_list = [b["id"] for b in bib]
errors = []

if len(ids_list) != len(set(ids_list)):
    errors.append("IDs duplicados en bib.json")

all_claims = [c for cell in claims.values() for c in cell.get("claims", [])]
for cell_id, cell in claims.items():
    for i, c in enumerate(cell.get("claims", [])):
        for r in c.get("refs", []):
            if r not in bib_ids:
                errors.append(f"Huérfano claims: {r} en {cell_id}[{i}]")

# Glosario
refs_raw = re.findall(r'refs:\s*\[([^\]]*)\]', glosario_src, re.DOTALL)
glosario_refs = [r for m in refs_raw for r in re.findall(r'"([^"]+)"', m)]
for r in set(glosario_refs):
    if r not in bib_ids:
        errors.append(f"Huérfano glosario: {r}")

no_ref_true = sum(1 for c in all_claims if c.get("no_ref"))
empty = [(k,i) for k,cell in claims.items()
         for i,c in enumerate(cell["claims"])
         if not c.get("refs") and not c.get("no_ref")]

print(f"Total claims:      {len(all_claims)}")
print(f"no_ref=True:       {no_ref_true}")
print(f"Pendientes reales: {len(empty)}")
print(f"Bibliografía:      {len(bib)}")
print(f"Refs glosario:     {len(set(glosario_refs))} únicos")

if errors:
    for e in errors: print(f"  ✗ {e}")
    sys.exit(1)
print("✓ Assert OK — 0 huérfanos (claims + glosario)")
PYEOF
```

### Script para actualizar IDs en prompts de búsqueda

```bash
python3 -c "
import json
ids = sorted([b['id'] for b in json.load(open('10_fuentes/data/bibliografia.json'))])
print(f'Total: {len(ids)} entradas')
print('\n'.join(ids))
"
```

---

## 14. Reapertura de la sesión

### 14.1 Nombre sugerido del chat

**Nombre sugerido del chat:** `Crianza y Pantallas, sesión 13 (Opus)`
(Reemplazar "Opus" por el modelo que vayas a usar.)

### 14.2 Mensaje de apertura listo para copiar

> Continuación de sesión sobre el proyecto **Crianza y Pantallas**.
>
> Tipo: CONTINUATION. Los documentos de protocolo (apertura, POLITICA, regla de estructura y principios de desarrollo) viven en la knowledge base de este Project; léelos desde ahí. Adjunto el traspaso, el escáner actual y los archivos críticos de la sesión anterior.
>
> ⚠️ El proyecto usa `30_documentacion/`, no `50_documentacion/`. Ver Decisión 1 del traspaso v05. ⚠️ Claims: solo chips `[ref]`, sin citas inline. Ver Decisión 2 del traspaso v05. ⚠️ Sin dependencias externas JS. Ver Decisión 3 del traspaso v06. ⚠️ Archivos JS nuevos requieren marcador en `template.html` + lógica en `00_build.sh`. Ver Bug 8 del traspaso v07. ⚠️ Traspasos: chat web como archivo descargable, no Claude Code. Ver traspaso v08. ⚠️ NO copiar `app.js`/`styles.css` del chat si hay commits recientes. Delta sobre HEAD. Ver Bug 1 del traspaso v09. ⚠️ NO editar `index.html` directamente. Shell HTML va en `template.html`. Ver traspaso v10. ⚠️ NO usar umbral de "86 min" en claims COT20s. Ver traspaso v11. ⚠️ NO citar cuantitativo de Chen2024/Xiao2025 sin texto completo. NO usar HernandezMosqueira2025 sin DOI verificado. Ver traspaso v12.
>
> Por favor sigue el protocolo de apertura definido en mis userPreferences y entrega el plan de trabajo en el formato estándar (Estado al cierre / Pendientes / Ruta propuesta / Decisiones que necesitas), basado en el handoff adjunto.

### 14.3 Documentos a adjuntar

**Documentos para la próxima sesión:**

#### Documentos de protocolo (knowledge base del Project)

No requieren adjuntarse. Verificar que estén disponibles:

- `prompt-apertura-sesion.md`
- `POLITICA_PROYECTO.md`
- `regla_estructura_proyectos.md`
- `principios_desarrollo_v3.md`

#### Documentos opcionales según el foco de la próxima sesión

- `asistente_claude_code_seguro.md` — si la próxima sesión se ejecuta en Claude Code.
- `prompt_migrar_estructura.md` — solo si se aborda P-ESTRUCTURA.

#### Documento de traspaso de esta sesión (adjuntar al nuevo chat)

- `30_documentacion/traspasos/traspaso-cierre-v12.md`

#### Output del escáner del proyecto (adjuntar al nuevo chat)

- `30_documentacion/estructura/estructura_actual.md` (ejecutar `Rscript 00_escanear_proyecto.R` antes de abrir)

#### Archivos del proyecto críticos para retomar (adjuntar al nuevo chat)

- `10_fuentes/data/claims.json` — si la sesión incluye edición de claims o batch bibliográfico (109 KB, voluminoso)
- `10_fuentes/data/bibliografia.json` — si la sesión incluye batch bibliográfico (80 KB)
- `10_fuentes/app.js` — si la sesión incluye edición de UI o lógica (44 KB)
- `10_fuentes/styles.css` — si la sesión incluye edición de estilos

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.

#### 14.4 Nota sobre archivos modificados entre sesiones

> **Nota:** si algún archivo de los listados cambió después de este cierre (entre sesiones), adjunta la versión más actualizada al abrir y avísalo explícitamente en el mensaje de apertura.
