# Flujo de incorporación de evidencia bibliográfica

Documento de referencia para futuras sesiones. Describe el flujo acordado para
incorporar papers, meta-análisis, revisiones sistemáticas o cualquier otra
evidencia bibliográfica al proyecto.

---

## Roles

- **Tomás:** detecta, valida y aprueba la integración. Ejecuta los cambios
  finales en Claude Code.
- **Claude (este chat):** analiza el paper, evalúa tributación, propone
  integración técnica, y entrega el código exacto a ejecutar.

---

## Paso 1 — Tomás comparte el paper

Tomás entrega al inicio del intercambio:

- El paper completo (PDF, link, DOI, o texto pegado).
- Una línea de contexto si la tiene: "lo encontré en X", "lo recomendó Y",
  "viene de tal revisión sistemática".
- Opcional: hipótesis previa sobre dónde tributa
  ("creo que sirve para sueno-preadolescencia, ¿lo confirmas?").

Si Tomás quiere procesar varios papers en batch, puede pasar 3-5 juntos.
Claude los procesa secuencialmente con resúmenes individuales.

---

## Paso 2 — Claude entrega análisis preliminar

Claude responde con esta estructura:

### Identificación
- Cita completa formato APA.
- Journal, año, volumen, páginas.
- Tipo de estudio (meta-análisis, revisión sistemática, longitudinal,
  transversal, ECA, etc.).
- Tamaño muestral.
- Rango etario cubierto.
- País o región de la muestra.

### Resumen de hallazgos
3-5 líneas con qué encontró el paper. Lenguaje neutro, sin sobreinterpretar.

### Análisis de tributación

A qué partes del proyecto podría aportar. Para cada candidato:

- **Celda** (`dimensión-edad`) o **cascada** del andamiaje a la que tributa.
- **Tipo de aporte:**
  - Caso A: respalda un claim existente. Claude muestra el claim actual y
    cómo quedaría con la cita nueva agregada.
  - Caso B: agrega un claim nuevo. Claude propone el texto.
  - Caso C: contradice algo existente. Claude lo señala con implicancia
    editorial.
  - Caso D: aporta a una cascada del andamiaje.
- **Certeza propuesta** (high/medium/low), justificada.

### Banderas

Cualquier problema detectado:
- Calidad metodológica débil (n bajo, sin grupo control, etc.).
- Muestra no aplicable al contexto chileno o LatAm.
- Conflicto con consenso científico.
- Conflicto de interés del autor.
- Edad o dimensión fuera del scope del paper.

### Recomendación de integración

Resumen de qué archivos hay que tocar:
- `bibliografia.json` (siempre, si el paper es nuevo).
- `claims.json` (si aporta a una o más celdas).
- `andamiaje.json` (si aporta a una cascada).
- `metadata.json` (raro: solo si necesita un grupo o tipo nuevo).

---

## Paso 3 — Tomás revisa y decide

Tres opciones de respuesta:
- "Aprobado, dame el código."
- "Apruebo con ajuste: cambia X."
- "Lo descarto por Y razón."

---

## Paso 4 — Claude entrega el código para Claude Code

Claude prepara un prompt listo para pegar en Claude Code con:

- Cambios exactos en cada archivo JSON afectado.
- Comando `./00_build.sh` al final.
- Mensaje de commit propuesto.
- Instrucción de NO pushear hasta validación visual.

---

## Paso 5 — Tomás ejecuta y valida

- Pega el prompt en Claude Code.
- Claude Code ejecuta los cambios.
- Tomás valida visualmente abriendo `index.html` en navegador.
- Si está bien: `git push`.
- Si hay problema: reporta a Claude (este chat) y se itera.

---

## Convenciones de IDs y campos

### ID bibliográfico
`ApellidoPrimerAutorAño`. Ejemplo: `Madigan2020`.

Si dos papers del mismo autor en mismo año: `Madigan2020a`, `Madigan2020b`.

### Campos de `bibliografia.json`

| Campo | Obligatorio | Notas |
|-------|-------------|-------|
| `id` | Sí | Único en el array |
| `group` | Sí | Debe existir en `metadata.biblioGroups` |
| `type` | Sí | Debe existir en `metadata.biblioTypes` |
| `authors` | Sí | Formato: "Apellido A., et al. Año" |
| `title` | Sí | Sin punto final |
| `journal` | Sí | Incluir volumen y páginas si están |
| `url` | Sí | Puede ser `""` si no hay URL disponible |
| `featured` | No | Solo si es `true`. Omitir si es false |

### Campos de un claim en `claims.json`

```json
{
  "certainty": "high|medium|low",
  "text": "Texto con markdown ligero permitido: **negrita** y *itálica*.",
  "refs": ["Apellido2026"]
}
```

- `refs` es array de IDs. Vacío `[]` si el claim no tiene cita.
- `text` no incluye HTML. Solo markdown ligero.

---

## Validaciones automáticas (post-Fase 3)

Una vez completo el refactor modular, existe un script de validación que
chequea antes del build:

- Todos los `refs` en claims y andamiaje apuntan a IDs existentes en
  `bibliografia.json`.
- Todos los `cellId` en chains apuntan a celdas existentes en
  `claims.json`.
- Todos los `group` y `type` en bibliografía existen en `metadata.json`.

Si alguna validación falla, el build aborta con mensaje claro.

---

## Casos especiales

### El paper aporta a múltiples celdas

Normal. Se agrega la entrada una vez en `bibliografia.json` y se referencia
desde cada celda relevante en `claims.json`.

### El paper aporta a una cascada Y a celdas

Normal también. Se agrega a `bibliografia.json` una vez, y se referencia
desde los lugares que correspondan en `claims.json` y `andamiaje.json`.

### El paper es muy importante (anchor o featured)

Si Tomás decide que el paper merece destacarse en la sección de bibliografía:
- `featured: true` en la entrada.
- `group: "anchor"` si es referencia central del sitio (uso conservador).

### El paper reemplaza una cita previa

Si una cita anterior se descubre como no válida (paper retractado, mal
identificado, etc.) y el paper nuevo la reemplaza:
- Mantener el `id` viejo en la entrada nueva solo si los autores y año
  coinciden parcialmente y el lector no se confunde.
- Si difiere mucho: agregar entrada nueva, eliminar la vieja, hacer
  find-and-replace de los `refs` en `claims.json` y `andamiaje.json`.

---

## Frecuencia esperada

Baja: incorporación de evidencia es esporádica (algunos papers por mes),
no continua. El flujo está pensado para esa cadencia. No requiere
automatización ni pipeline complejo.
