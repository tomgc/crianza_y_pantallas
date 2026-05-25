# Crianza y Pantallas — Contexto del proyecto

Sitio único autocontenido (HTML + CSS + JS inline, sin dependencias) que sintetiza evidencia científica sobre uso de pantallas en infancia 0–12 años. Público objetivo: padres y madres en Chile. Publicado en https://tomgc.github.io/crianza_y_pantallas/.

## Estructura del repo

- `index.html` — output del build, sitio publicado por GitHub Pages. NO se edita a mano.
- `CLAUDE.md` (raíz) — stub que apunta a este archivo.
- `00_build.sh` — script que ensambla `index.html` desde `10_fuentes/`.
- `README.md` — documentación pública.
- `10_fuentes/` — fuentes del sitio: `template.html`, `styles.css`, `data/` (JSON), `app.js` (cuando exista).
- `20_recursos/` — instrucciones para descarga local de PDFs UNICEF/CJE UC (PDFs ignorados por git).
- `30_documentacion/activa/` — documentación viva del proyecto (este `CLAUDE.md` y otros).
- `30_documentacion/traspasos/` — handoffs de sesión (`traspaso-cierre-vNN.md`).
- `30_documentacion/andamios/` — wireframes y refactors ya ejecutados, conservados como registro histórico.
- `30_documentacion/versiones/` — snapshots locales (ignorados por git).

## Convenciones del proyecto

- **Citas en claims:** formato `(Autor et al., año) [ref]` con `[ref]` como enlace navegable a la entrada bibliográfica. Toda cita va entre paréntesis, nunca como sujeto del párrafo.
- **Sistema de certeza:** 3 niveles (alta/media/baja), aplicados via función `C(certainty, text)` en el JS.
- **Paleta actual:** fondo `#f7f8fa`, texto `#1a1d24`, acento `#042f4d` (azul marino), cálido secundario `#b07a4a`. Tres tonos del azul marino para los niveles de certeza.
- **Tipografía:** stack del sistema, 15 px base, line-height 1.65.
- **Sin dependencias externas:** ni Google Fonts, ni CDN, ni librerías JS, ni imágenes externas. SVG inline si hay íconos.

## Estado actual

Último handoff: `30_documentacion/traspasos/traspaso-cierre-v02.md`. Revisar siempre el handoff más reciente al inicio de cada sesión.

## Preferencias de trabajo (Tomás)

- Idioma: español latinoamericano neutro (RAE estándar, no chilenismos en contextos formales). Sin voseo.
- Tono: directo, ágil, preciso. Sin openers tipo "claro" o "por supuesto". Sin resúmenes de cierre salvo respuestas largas.
- Código: ediciones siempre como archivo completo actualizado, nunca fragmentos sueltos. Una línea por cambio realizado antes del archivo.
- Alternativas: cuando se presentan opciones, declarar siempre una recomendación concreta con razón en una frase, salvo equivalencia técnica genuina.
- Estructura de proyectos: convenciones `10_utils / 20_insumos / 30_procesamiento / 40_salidas / 50_documentacion` cuando aplica (este sitio no las usa todas porque no es un pipeline de análisis).
- Decisiones de diseño visual: paletas y convenciones por proyecto son distintas; no mezclar.

## Convención de build

El sitio se ensambla con `./00_build.sh`. Este script lee fuentes desde `10_fuentes/` (template, styles, data/, app) y escribe `index.html` en la raíz, que es lo que GitHub Pages publica.

**Regla obligatoria:** todo commit que modifique archivos en `10_fuentes/` debe:
1. Ejecutar `./00_build.sh` antes de stagear.
2. Incluir el `index.html` regenerado en el mismo commit que las fuentes.

Razón: GitHub Pages sirve `index.html` directamente. Si las fuentes y el output se desincronizan en un commit, el sitio público queda inconsistente con su fuente. Mantenerlos juntos garantiza que `git checkout <commit>` siempre dé un estado coherente.

`index.html` NO se edita a mano nunca. Cualquier cambio se hace en las fuentes y se regenera con el build.

## Flujo de incorporación de evidencia

El proceso para incorporar papers, meta-análisis o cualquier evidencia bibliográfica al proyecto está documentado en:

- `30_documentacion/activa/flujo_incorporacion_evidencia.md` — describe los 5 pasos del flujo, las convenciones de IDs y campos, y los casos especiales.
- `30_documentacion/activa/prompt_busqueda_bibliografia.md` — prompt listo para usar con agentes IA de búsqueda (Perplexity, ChatGPT con browsing, etc.) que devuelve resultados en el formato esperado por el flujo.

Roles: Tomás detecta y aprueba; Claude analiza y entrega código; Claude Code ejecuta cambios.
