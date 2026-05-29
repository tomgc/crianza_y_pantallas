# Prompts de búsqueda bibliográfica — `crianza_y_pantallas`

Carpeta con 11 prompts autosuficientes para búsqueda bibliográfica sobre
crianza y pantallas en niños de 0 a 12 años. Cada archivo contiene un
prompt completo listo para pegarse en un agente externo (deep research
de Gemini, ChatGPT browsing, Perplexity, Claude con web_search, etc.).

## Cómo usar

1. Abre el archivo del prompt que vas a usar.
2. Copia el contenido completo del archivo.
3. Pégalo en una sesión nueva del agente externo (una sesión por prompt;
   ver "Reglas operativas" abajo).
4. Recibe el output en markdown narrativo.
5. Lleva el output a una sesión web del proyecto para análisis celda por
   celda y eventual integración al corpus, siguiendo el protocolo de
   `flujo_incorporacion_evidencia.md`.

## Listado de prompts

Numeración refleja el orden sugerido de ejecución (dimensiones con mayor
sed de evidencia primero, dimensiones bien cubiertas al final):

| # | Archivo | Dimensión |
|---|---|---|
| 01 | `01_prompt_creatividad.md` | Creatividad y juego |
| 02 | `02_prompt_vinculo.md` | Vínculo y apego |
| 03 | `03_prompt_salud_mental.md` | Salud mental (clínica) |
| 04 | `04_prompt_socioemocional.md` | Desarrollo socio-emocional |
| 05 | `05_prompt_comportamiento.md` | Comportamiento y autorregulación |
| 06 | `06_prompt_cognicion.md` | Cognición y atención |
| 07 | `07_prompt_fisica.md` | Actividad física y motricidad |
| 08 | `08_prompt_lenguaje.md` | Lenguaje |
| 09 | `09_prompt_sueno.md` | Sueño |
| 10 | `10_prompt_vision.md` | Visión |
| 11 | `11_prompt_dimensiones_nuevas.md` | Evaluación de dimensiones nuevas |

## Reglas operativas

### Una sesión por prompt

No pegues varios prompts en una misma sesión del agente externo. La
calidad del output cae cuando el contexto se carga con varias dimensiones
a la vez (mezcla papers, duplica recomendaciones, alucina con más
frecuencia). Una sesión por dimensión es la regla.

### Verificación obligatoria del output

Antes de traer un output a la sesión web del proyecto, verifica al menos
2-3 papers al azar contra PubMed/DOI para confirmar que el agente no
inventó autoría. Esta es la regla más importante: la sesión 4 detectó un
caso documentado (autoría "Wang X." atribuida a un paper de autores
coreanos reales), y los prompts incluyen tres reglas anti-alucinación
explícitas para prevenirlo. Si encuentras un paper alucinado en el
output, descarta el output completo y vuelve a correr el prompt en otra
sesión del agente; no intentes "limpiar" parcialmente.

### Actualización de la lista "papers ya integrados"

Cada prompt incluye una sección "Lo que ya tenemos integrado en el corpus"
con los IDs de papers ya presentes en `bibliografia.json`. Esta lista
**debe actualizarse después de cada batch integrado** en el repo. El
flujo:

1. Después de commitear un batch nuevo en `refactor/modular-build`, abrir
   cada uno de los 11 archivos de prompt.
2. Refrescar la sección "Lo que ya tenemos integrado en el corpus" con
   los IDs vigentes.
3. Commitear los cambios en los prompts como parte del mismo commit del
   batch o en commit separado de documentación.

Cómo obtener la lista vigente:

```bash
python3 -c "import json; print(sorted([b['id'] for b in json.load(open('10_fuentes/data/bibliografia.json'))]))"
```

Si esta lista queda desactualizada, los agentes externos propondrán papers
ya integrados como si fueran nuevos, y la sesión web tendrá que descartarlos
manualmente (caso ya ocurrido con Madigan2020 en sesión 4).

### Frecuencia esperada

Ejecutar los 11 prompts es trabajo de varias sesiones, no de una sola
tarde. Espaciar permite verificar integraciones intermedias en el sitio
antes de seguir agregando. Cadencia razonable: un prompt cada 1-2
semanas, según disponibilidad y tamaño del batch resultante.

### Cuándo NO ejecutar un prompt

- Cuando el corpus en su dimensión correspondiente ya tiene cobertura
  satisfactoria y el aporte marginal de un batch nuevo sería bajo.
- Cuando hay deuda técnica pendiente en la dimensión (refs huérfanos,
  claims sin citar) que conviene resolver antes de agregar más volumen.
- Cuando una sesión reciente ya integró un batch grande en esa dimensión
  y todavía no se ha hecho validación visual completa.

## Documentos relacionados del proyecto

- `50_documentacion/activa/flujo_incorporacion_evidencia.md` — protocolo
  del proceso completo (qué hace Tomás, qué hace la sesión web, qué hace
  Claude Code).
- `10_fuentes/data/bibliografia.json` — corpus bibliográfico actual.
- `10_fuentes/data/claims.json` — corpus de claims actual.
- `10_fuentes/data/metadata.json` — taxonomías (dimensiones, tramos,
  groups, types).
- `50_documentacion/traspasos/traspaso-cierre-v04.md` — primer cierre de
  sesión que usó estos prompts como entregable.
