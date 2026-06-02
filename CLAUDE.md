# CLAUDE.md — Crianza y Pantallas

Instrucciones para Claude Code en este repositorio.
Estas reglas tienen precedencia sobre cualquier preferencia global.

---

## Idioma y estilo

- Responde siempre en español latinoamericano neutro (RAE estándar).
- **Sin voseo.** Usa tuteo: "puedes", "tienes", "haces". Nunca "podés", "tenés", "hacés".
- Sin aperturas vacías ("Claro", "Por supuesto", "Great question").
- Respuestas concisas. Techo por defecto: 200 palabras de prosa (bloques de código no cuentan).
- Cuando presentes opciones, declara cuál recomiendas y por qué al final de la lista:
  > **Recomendación:** [opción] — [razón concreta en una oración].
  Si son equivalentes: "Sin recomendación: ambas opciones son equivalentes en este contexto."

---

## Qué es este proyecto

Sitio web estático que sintetiza evidencia científica sobre uso de pantallas en infancia 0–12 años. Público objetivo: padres y madres en Chile. Publicado en https://tomgc.github.io/crianza_y_pantallas/.

Stack: HTML/CSS/JS vanilla, datos en JSON, sin dependencias externas.

---

## Estructura del repo

```
crianza_y_pantallas/
├── 00_build.sh              ← ensambla index.html desde 10_fuentes/
├── 00_escanear_proyecto.R   ← genera snapshot de estructura
├── index.html               ← OUTPUT del build. NO editar a mano.
├── 10_fuentes/
│   ├── template.html        ← shell HTML del sitio
│   ├── styles.css
│   ├── app.js
│   ├── glosario-data.js
│   └── data/
│       ├── claims.json      ← evidencia por celda (dimensión × tramo)
│       ├── bibliografia.json
│       ├── metadata.json    ← dimensiones, tramos, biblioTypes, biblioGroups
│       └── andamiaje.json
├── 20_recursos/
│   └── papers/              ← PDFs versionados. Convención: {ID_bibliografia}.pdf
├── 30_documentacion/
│   ├── activa/              ← documentación viva (CLAUDE.md, prompts, flujos)
│   ├── estructura/          ← snapshots del escáner (estructura_actual.md)
│   ├── traspasos/           ← handoffs de sesión (traspaso-cierre-vNN.md)
│   └── andamios/            ← wireframes y refactors históricos (no editar)
└── assets/                  ← og-image.png y generador
```

> **Excepción estructural:** este proyecto usa `30_documentacion/` (no `50_documentacion/`). No migrar sin protocolo completo. No existe `40_salidas/` — el output del pipeline es `index.html` en la raíz.

---

## Convención de build — obligatoria

El sitio se ensambla con `./00_build.sh`. Lee fuentes desde `10_fuentes/` y escribe `index.html` en la raíz.

**Regla:** todo commit que modifique archivos en `10_fuentes/` debe:
1. Ejecutar `./00_build.sh` antes de stagear.
2. Incluir el `index.html` regenerado en el **mismo commit** que las fuentes.

`index.html` NO se edita a mano nunca. Cualquier cambio va en las fuentes y se regenera con el build.

---

## Flujo de trabajo Git

- Commits directos a `main` (este proyecto no usa ramas de feature).
- **Antes de `git push`**, mostrar `git status` y esperar confirmación explícita.
- No hacer force push. No borrar ramas remotas sin confirmación.
- Assert de integridad **antes** de cada commit que modifique `claims.json` o `bibliografia.json`.

---

## Edición de archivos

- Nunca entregar fragmentos para pegar. Siempre el archivo completo actualizado.
- Antes del archivo: una línea por cambio realizado (`L47: ...`).
- Después del archivo: una línea de justificación solo si no es obvia.
- Si no tienes el archivo, pedirlo antes de escribir código.

---

## Reglas de datos — no negociables

### metadata.json
- **Nunca** editar con `json.dump`. Siempre str_replace quirúrgico sobre texto crudo.
- Antes de agregar un `group` nuevo en `bibliografia.json`, verificar que exista en `metadata.biblioGroups`.
- Antes de agregar un `type` nuevo, verificar que exista en `metadata.biblioTypes` **y** agregar la etiqueta en `typeLabels` (~L771 de `app.js`).

### claims.json
- No usar campo `flags` — las advertencias van en el texto del claim.
- Antes de integrar un batch nuevo, verificar que cada celda tenga `summary`, `intro` y `certainty`. El assert no detecta campos editoriales vacíos.
- 14 claims con `no_ref: true` — política documentada en sección "Política no_ref" más abajo. No reducir ese número sin revisión editorial explícita.
- 3 celdas vacías intencionales: `cyberbullying × 0–5`. No poblar sin evidencia directa.

### bibliografia.json
- El campo `year` no existe en el esquema — no agregarlo.
- El campo `journal` es dato público: no dejar notas de trabajo, justificaciones internas ni marcadores "pendiente".
- `json.dump` es seguro en este archivo (round-trip idéntico verificado). La prohibición aplica solo a `metadata.json`.

### app.js
- Antes de editar, verificar: `grep -c "openDimFicha\|showDimTooltip" 10_fuentes/app.js` → debe dar `2` y `0`.
- `DIM_DESCRIPTIONS` (definiciones del tooltip) está embebido en `app.js`. El documento-fuente es `30_documentacion/activa/definiciones_dimensiones.md`.
- `activeDim` y `activeCell` son mutuamente excluyentes — no romper esa invariante.
- `typeLabels` (~L771) cubre 11/11 tipos vigentes. Si se agrega tipo nuevo, actualizar también `metadata.biblioTypes`.

### template.html / index.html
- `index.html` NO se edita directamente. El shell HTML va en `template.html`.

### papers/
- Al agregar un PDF a `20_recursos/papers/`, usar exactamente el ID del corpus como nombre: `{ID_bibliografia}.pdf`.

---

## Assert de integridad (ejecutar antes de cada commit con cambios en bib o claims)

```python
import json, re, sys
bib = json.load(open("10_fuentes/data/bibliografia.json"))
claims = json.load(open("10_fuentes/data/claims.json"))
glosario_src = open("10_fuentes/glosario-data.js").read()
bib_ids = {b["id"] for b in bib}
errors = []
if len([b["id"] for b in bib]) != len(bib_ids):
    errors.append("IDs duplicados en bib.json")
for cell_id, cell in claims.items():
    for i, c in enumerate(cell.get("claims", [])):
        for r in c.get("refs", []):
            if r not in bib_ids:
                errors.append(f"Huérfano: {r} en {cell_id}[{i}]")
refs_raw = re.findall(r'refs:\s*\[([^\]]*)\]', glosario_src, re.DOTALL)
for r in {r for m in refs_raw for r in re.findall(r'"([^"]+)"', m)}:
    if r not in bib_ids:
        errors.append(f"Huérfano glosario: {r}")
no_ref_count = sum(1 for cell in claims.values() for c in cell.get("claims",[]) if c.get("no_ref"))
if errors:
    for e in errors: print(f"  ✗ {e}"); sys.exit(1)
print(f"✓ Assert OK — {len(bib)} bib, {sum(len(c.get('claims',[])) for c in claims.values())} claims, {no_ref_count} no_ref")
```

---

## Convenciones del sitio

- **Citas en claims:** solo chips `[ref]` navegables. El texto NO lleva `(Autor et al., año)` inline. Datos metodológicos (N=, tamaños de muestra) sí se conservan en el texto.
- **Citas institucionales como sujeto:** aceptable nombrar como sujeto a organismos (EYSTAG, AAP, OMS, MINEDUC). Siempre con chip `[ref]`. NO aplica a estudios empíricos individuales.
- **Sistema de certeza:** 3 niveles (`alta`/`media`/`baja`), campo `certainty` en `claims.json`.
- **Sin dependencias externas:** ni Google Fonts, ni CDN, ni librerías JS. SVG inline si hay íconos.
- **No usar umbral "86 min"** en claims COT20s (eliminado en sesión 11).
- **No citar cuantitativo de `Chen2024`/`Xiao2025`** sin texto completo.

---

## Política no_ref

Claims con `"no_ref": true` son aceptables cuando:
1. **Mecanísticos/interpretativos:** explican un mecanismo plausible sin ser hallazgo empírico citable.
2. **Ausencia de evidencia:** documentan que la evidencia directa no existe o es escasa.
3. **Remisión entre dimensiones:** redirigen al lector a otra dimensión.
4. **Gap en la literatura:** señalan vacíos teóricos o empíricos reconocidos.

Claims con `no_ref` justificados (estado al 2026-06-02, 14 en total):
- `lenguaje-ninez-media[2]`: mecanismo de desplazamiento
- `lenguaje-preadolescencia[0]`: asociación no bien cuantificada
- `cognicion-lactante[1]`: hipótesis no demostrada en lactantes
- `cognicion-preescolar[2]`: co-visionado beneficioso — consenso implícito
- `cognicion-ninez-media[1]`: dependencia del propósito/diseño
- `fisica-lactante[0]`: mecanismo indirecto motor
- `salud-mental-lactante[0]`: remisión a dimensión socioemocional
- `comportamiento-ninez-media[2]`: videojuegos pace vs pasivo
- `vinculo-preescolar[1]`: gap — escasez de estudios reconocida
- `vinculo-preadolescencia[1]`: gap teórico
- `creatividad-lactante[0]`: ausencia de evidencia robusta
- `creatividad-lactante[1]`: mecanismo de desplazamiento
- `creatividad-ninez-media[0]`: mecanismo de desplazamiento
- `creatividad-preadolescencia[1]`: asociación correlacional sin paper específico

---

## Archivos de referencia del proyecto

Consultar al inicio de cada sesión o antes de tareas de diseño/refactorización:

- `30_documentacion/activa/CLAUDE.md` — (reemplazado por este archivo)
- `30_documentacion/activa/flujo_incorporacion_evidencia.md` — 5 pasos del flujo de evidencia
- `30_documentacion/activa/prompts_busqueda/` — prompts modulares por dimensión
- `30_documentacion/estructura/estructura_actual.md` — estado actual del repo (fuente autoritativa de paths)
- `30_documentacion/traspasos/traspaso-cierre-vNN.md` — handoff más reciente
