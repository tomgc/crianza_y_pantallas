# Traspaso de Cierre — Crianza y Pantallas

- **Versión de traspaso:** v03
- **Fecha:** 2026-05-25
- **Sesión:** 3 — Migración a Claude Code en modo local, refactor mayor de arquitectura (modularización), elección de diseño visual (wireframe B Datos como objeto), extracción completa de datos a JSON.
- **Modelo utilizado:** Claude Opus 4.7 (sesión web) + Claude Code (ejecución local)
- **Entorno:** macOS local con Claude Code app + sesión web como asesor estratégico
- **Rama de trabajo:** `refactor/modular-build` (no mergeada a main todavía)

---

## Resumen ejecutivo

Sesión transformadora. Tres ejes simultáneos: (1) cierre de pendientes operativos (P5 push validado, P2 validación de URLs bibliográficas, Carter2024 acotado, Sundqvist2021 URL actualizada); (2) migración del flujo de trabajo desde sesiones web con copy-paste a un modelo asesor-ejecutor con Claude Code en modo local; (3) refactor mayor de arquitectura del sitio para separar fuentes (template + styles + data + app) del output publicado (index.html), motivado por el crecimiento exponencial del HTML único. En paralelo se eligió el diseño visual definitivo (wireframe B Datos como objeto entregado por Claude Design, ajustes para vanilla JS) y se diseñó un flujo formal de incorporación de evidencia bibliográfica con plantilla de prompt para agentes IA de búsqueda.

Fases 0-3 del refactor completadas. Fases 4-6 pendientes (reescribir wireframe a vanilla JS + secciones secundarias + validación end-to-end y merge a main).

---

## Estado del proyecto al cierre

### Arquitectura nueva implementada

```
crianza_y_pantallas/
├── 00_build.sh                  ← orquestador (Python embebido)
├── 10_fuentes/
│   ├── template.html            ← esqueleto con marcadores INJECT_*
│   ├── styles.css               ← CSS del wireframe B
│   ├── data/
│   │   ├── andamiaje.json       ← 6 cascadas, 15 claims
│   │   ├── bibliografia.json    ← 52 entradas
│   │   ├── claims.json          ← 50 celdas, 120 claims, 6 def, 6 study
│   │   └── metadata.json        ← dimensiones, edades, types, etc.
│   └── (app.js — pendiente Fase 4)
├── 20_recursos/
│   └── README.md
├── 30_documentacion/
│   ├── activa/
│   │   ├── CLAUDE.md
│   │   ├── flujo_incorporacion_evidencia.md
│   │   └── prompt_busqueda_bibliografia.md
│   ├── traspasos/
│   │   ├── traspaso-cierre-v01.md
│   │   ├── traspaso-cierre-v02.md
│   │   └── traspaso-cierre-v03.md   ← este archivo
│   └── andamios/
│       ├── extraer_claims.py        ← script de extracción usado en 3.6
│       └── wireframe-b-standalone.html
├── CLAUDE.md                    ← stub puntero
├── README.md
├── .gitignore
└── index.html                   ← generado por build (3055 líneas actualmente)
```

### Decisión de diseño visual

Wireframe B "Datos como objeto" elegido como dirección definitiva:

- Paleta navy: `#042f4d` (alta), `#5c728e` (media), `#d6dfe8` (baja).
- Doble codificación de certeza: color + figura (lleno / mitad / contorno).
- Sans del sistema, sentence case, 13 px base, line-height 1.55.
- Patrón matriz central + panel lateral 360px + popovers + marca CL.
- Selector "Elegir tramo etario" con atenuación de columnas no enfocadas.
- Sin dependencias externas (vanilla JS, no React/Babel via CDN).

### Convención de build

`./00_build.sh` lee fuentes desde `10_fuentes/` y escribe `index.html` en raíz (servido por GitHub Pages). Documentado en CLAUDE.md. Todo commit que toque fuentes debe ejecutar el build e incluir el `index.html` regenerado.

---

## Commits de esta sesión en `refactor/modular-build`

| # | SHA | Mensaje | Cambios |
|---|---|---|---|
| 1 | 6f68c78 | Refactor Fase 0: reorganizar estructura a 00/10/20/30, mover CLAUDE.md a activa/ | 9 archivos |
| 2 | 269e01d | Refactor Fase 1: build trivial funcionando (template = index.html) | 2 archivos |
| 3 | 883bc52 | Refactor Fase 2: estilos del wireframe B, template con marcadores INJECT_*, build con Python, preview server config | 6 archivos |
| 4 | 60c4bea | Agregar convención de build a CLAUDE.md y actualizar rutas a estructura nueva | 1 archivo |
| 5 | 78076c4 | Refactor Sub-fase 3.3: extraer metadata.json y mejorar indentación del data block en build | 4 archivos |
| 6 | 8259d6b | Refactor Sub-fase 3.4: extraer bibliografia.json (52 entradas) | 2 archivos |
| 7 | 39a27b0 | Refactor Sub-fase 3.5: extraer andamiaje.json (6 cascadas, 15 claims) | 2 archivos |
| 8 | 661b46d | Refactor Sub-fase 3.6: extraer claims.json (50 celdas, 120 claims, 6 definitions, 6 featured_studies) | 3 archivos |
| 9 | (commit nuevo) | Agregar flujo de incorporación de evidencia y prompt de búsqueda bibliográfica | 2 archivos |
| 10 | (commit nuevo) | Documentar flujo de incorporación de evidencia en CLAUDE.md | 1 archivo |
| 11 | (este traspaso) | Traspaso de cierre de sesión 3 | 1 archivo |

Antes de esta sesión, en `main`: commits `130d637` (versión inicial) y `fa91176` (Carter2024 + Sundqvist2021), `c606709` (limpieza pre-refactor).

---

## Métricas del proyecto

| Métrica | Antes de refactor | Después de Fase 3 |
|---|---|---|
| `index.html` (líneas) | 2967 | 3055 (generado) |
| Datos en JS hardcodeado | ~1800 líneas | 0 |
| Datos en JSON estructurado | 0 | 4 archivos |
| Celdas con definitions explícitas | 0 | 5 (modeladas) |
| Celdas con featured_studies | 0 | 5 (modeladas) |
| Refs únicas usadas activamente | ~39 inline | 22 (claims + featured_studies) |
| Entradas biblio totales | 52 | 52 |
| Estructuras HTML aprisionadas en strings | Muchas | 0 |

---

## Pendientes priorizados

### Pendiente 1 — Fase 4 del refactor: reescribir wireframe B a vanilla JS
**Scope:** mayor. **Prioridad:** alta (bloqueante para todo lo demás).

Crear `10_fuentes/app.js` con:
- Render del top bar (título + selector de tramo + leyenda).
- Render de la matriz 10×5 con doble codificación de certeza + marca CL.
- Lógica del selector: atenuar columnas no seleccionadas.
- Clic en celda: marcar activa + cargar ficha en panel derecho.
- Render de la ficha: title + intro + claims + chile_note + definitions + featured_studies + andamiaje contextual.
- Popovers de bibliografía al hover sobre `.ref`.
- Footer con microdecisiones del wireframe.
- Deep linking: actualizar `window.location.hash` con `#dimension/tramo` al cambiar estado.

El JS debe leer todo desde `window.__DATA__` (poblado por el build con los 4 JSON).

### Pendiente 2 — Fase 5 del refactor: secciones secundarias
**Scope:** medio-mayor. **Prioridad:** alta (después de Fase 4).

- Sección Bibliografía con buscador en vivo + filtros (los 7 filterTypes + 11 biblioGroups).
- Sección Método (textos en metadata.json).
- Sección Limitaciones (textos en metadata.json).
- Sección Leyenda expandida.
- Sección Andamiaje navegable (las 6 cascadas con chains clickeables que cargan celdas en el panel).

Decisión arquitectónica F del wireframe: secciones secundarias debajo de la matriz con anclas; andamiaje vive contextual en el panel lateral.

### Pendiente 3 — Fase 6 del refactor: validación, merge, traspaso final
**Scope:** menor. **Prioridad:** alta (cierre).

- Comparar HTML viejo (en main) vs nuevo (en refactor/modular-build) lado a lado para verificar paridad de contenido.
- Script de validación automática pre-build (refs huérfanos, cellIds huérfanos, groups/types huérfanos).
- Actualizar CLAUDE.md con paleta y tipografía finales del wireframe B.
- Abrir PR de refactor/modular-build → main.
- Merge.
- Verificar GitHub Pages sirviendo la versión nueva.
- Traspaso v04.

### Pendiente 4 — P1 original: sección de recomendaciones UNICEF/CJE UC
**Scope:** mayor. **Prioridad:** media (después del merge).

Crear sección nueva con recomendaciones organizadas por temáticas/edades, basada en 6 documentos UNICEF/CJE UC. Encaja como nuevo `recomendaciones.json` + render correspondiente. Posponer hasta tener arquitectura modular estable.

### Pendiente 5 — P4 original: descargar PDFs UNICEF/CJE UC localmente
**Scope:** menor. **Prioridad:** baja (bloqueado por P1).

Ejecutar comandos `curl` documentados en `20_recursos/README.md`.

### Pendiente 6 — Decisiones diferidas
- Actualizar el `featured` de bibliografía si en Fase 4 algunas entradas merecen destacarse más.
- Decidir si el `featured_studies` debería inferir refs desde el campo `title` cuando este menciona explícitamente al autor (decisión técnica que dejamos para cuando se vea en render).
- ~30 entradas bibliográficas existen en `bibliografia.json` sin estar referenciadas activamente desde claims/studies. Es diseño intencional (la sección Biblio es meta-índice del campo, no solo de citas), pero vale documentarlo en CLAUDE.md.

---

## Decisiones de diseño tomadas en esta sesión

| # | Decisión | Razón |
|---|---|---|
| 1 | Migrar a Claude Code modo local | Elimina ciclo "Claude entrega → user pega → commit"; archivos se editan directo en `/Users/tomgc/Projects/crianza_y_pantallas` |
| 2 | Wireframe B "Datos como objeto" como dirección visual definitiva | Elegido por el usuario sobre A (Editorial cálido) y C (Cuaderno de crianza) |
| 3 | Reescribir wireframe a vanilla JS | El wireframe original usaba React + Babel via unpkg CDN, violaba restricción "sin dependencias externas" |
| 4 | Refactor modular antes que P1 | P1 introduce ~6 documentos de contenido nuevo; integrarlo a JSON limpio es mucho más barato que a HTML hardcodeado |
| 5 | Estructura `00/10/20/30` corrigiendo numeración del repo viejo | Política de proyectos exige "sin saltos en numeración"; oportunidad de corrección durante el refactor |
| 6 | `index.html` en raíz (no en `30_publicado/`) | Simplicidad operativa con GitHub Pages: sin GitHub Action ni configuración extra |
| 7 | Build con Python embebido (no Node ni puro bash) | Cero dependencias instalables; Python viene con macOS; mejor manejo de JSON y caracteres especiales |
| 8 | JSON con `indent=2` y `ensure_ascii=False` | Legibilidad del output generado + preservación de tildes y eñes |
| 9 | Modelar `definitions` y `featured_studies` como campos estructurados, no como markdown inline | Tienen semántica distintiva (term/body, title/meta/body) que el render visualizará diferente |
| 10 | Campos opcionales se omiten cuando vacíos | JSON más limpio; el render decide qué mostrar según presencia |
| 11 | Script de extracción (`extraer_claims.py`) preservado como andamio histórico | Política de proyectos: scripts de refactor congelados como registro |
| 12 | Flujo formal de incorporación de evidencia documentado | Anticipa cómo agregar papers sin reabrir esta decisión cada vez |
| 13 | Prompt para agente IA de búsqueda diseñado con criterios de calidad estrictos y output estructurado | Reduce ruido y prepara resultados para el flujo |
| 14 | Dos commits separados (no uno) para tareas combinadas | Atomicidad y bisectabilidad; el costo de splittear es menor que el costo de mezclar |

---

## Tensiones identificadas no resueltas

1. **Paleta documentada en CLAUDE.md no coincide con paleta del wireframe.** La sección "Convenciones del proyecto" sigue listando colores del sitio viejo. Se actualiza en Fase 6.
2. **Tipografía documentada (15 px base, line-height 1.65) no coincide con wireframe (13 px, 1.55).** Mismo tratamiento, Fase 6.
3. **No hay validación automática pre-build.** Hoy las validaciones cruzadas se ejecutan a mano cuando se sospecha de drift. Fase 6 las automatiza.

---

## Para abrir próxima sesión

Adjuntar:
- Este traspaso (`traspaso-cierre-v03.md`).
- Prompt de apertura de sesión.
- Recordar al asesor (este chat) que la rama de trabajo es `refactor/modular-build` y los siguientes pasos son Fase 4 del refactor.

Próximo paso concreto: arrancar Fase 4 → reescribir wireframe B a vanilla JS en `10_fuentes/app.js`, leyendo desde `window.__DATA__`.
