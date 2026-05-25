# Prompt para agente IA — Búsqueda de bibliografía sobre pantallas e infancia

Copia y pega este prompt en un agente IA con capacidad de búsqueda web
(Claude con web search, Perplexity, ChatGPT con browsing, Gemini con
Deep Research, etc.) para obtener resultados que se integren al proyecto
"Crianza y pantallas".

---

## Inicio del prompt

Necesito que busques bibliografía científica reciente sobre los efectos del
uso de pantallas en niños y niñas de 0 a 12 años. Los resultados se integrarán
a un proyecto que sintetiza evidencia para padres y madres en Chile.

### Criterios de calidad (estrictos)

Incluye solo papers que cumplan TODOS los siguientes criterios:

1. **Fecha:** publicados desde 2020 en adelante. Excepcionalmente acepta
   trabajos previos solo si son citados como anchor en revisiones recientes
   (meta-análisis o revisiones sistemáticas de 2022+).
2. **Peer review:** publicados en revistas con revisión por pares, o reportes
   técnicos de organismos oficiales (UNICEF, AAP, OMS, ministerios de salud
   o educación, centros académicos universitarios reconocidos).
3. **Tipo de estudio:** prioriza en este orden:
   - Meta-análisis o revisiones sistemáticas.
   - Estudios longitudinales con n ≥ 500.
   - ECA o cuasi-experimentos.
   - Estudios transversales solo si n ≥ 1000 o si son de contexto chileno
     o latinoamericano (donde la evidencia local escasea).
4. **Población:** la muestra debe incluir niños o niñas en el rango 0–12
   años. Si el paper cubre adolescentes, solo es aceptable si el rango
   incluye 12 años o si los hallazgos son extrapolables con justificación.
5. **Idioma:** español o inglés.

### Temáticas de interés

Busca evidencia sobre el efecto de pantallas (TV, smartphone, tablet,
computador, videojuegos, redes sociales) en estas dimensiones del desarrollo:

1. **Lenguaje y comunicación** (vocabulario, gramática, habla dirigida).
2. **Cognición y función ejecutiva** (atención, memoria de trabajo,
   control inhibitorio, aprendizaje).
3. **Desarrollo socioemocional** (regulación emocional, empatía,
   habilidades sociales, teoría de la mente).
4. **Sueño** (duración, calidad, retraso de inicio, despertares).
5. **Actividad física y salud física** (sedentarismo, obesidad, motor grueso
   y fino).
6. **Visión y salud ocular** (miopía, fatiga visual, postura).
7. **Salud mental** (ansiedad, depresión, autoestima, ideación suicida).
8. **Comportamiento** (problemas conductuales, agresividad, hiperactividad).
9. **Vínculo y apego** (interacción cuidador-niño, sincronía, corregulación).
10. **Creatividad y juego** (juego simbólico, pensamiento divergente).

También me interesan:

- **Mecanismos** (no solo efectos): cómo opera la pantalla sobre el desarrollo.
  Ejemplos: desplazamiento de actividades, exposición a luz azul, contenido
  publicitario, comparación social, multitasking.
- **Moderadores**: contexto de uso, co-visionado con adulto, contenido
  educativo vs entretenimiento, edad de inicio, hora del día.
- **Evidencia chilena o latinoamericana**: aunque sea de menor calidad
  metodológica, vale flaguearla.
- **Recomendaciones de organismos oficiales**: posicionamientos de AAP,
  OMS, UNICEF, sociedades nacionales de pediatría, ministerios.

### Formato de respuesta requerido

Para cada paper que cumpla los criterios, entrega un bloque con esta
estructura EXACTA en markdown:

```
---

### [ID-PROPUESTO]

**Cita:** [Autores, año. Título completo. Journal vol(num):pp-pp.]

**Tipo:** [meta-análisis / revisión sistemática / longitudinal / transversal / ECA / cuasi-experimental / reporte oficial / otro]

**Muestra:** [n, rango etario, país o región]

**Hallazgo central:** [3-5 líneas en lenguaje neutro]

**Tributa a:**
- [Dimensión específica], tramo etario [lactante / primera-infancia / preescolar / niñez-media / preadolescencia], con certeza [alta / media / baja]. [Justificación breve: por qué tributa ahí y por qué esa certeza.]
- [Segunda dimensión si aplica, mismo formato]
- [Más si aplica]

**Banderas:**
- [Cualquier limitación metodológica, conflicto, generalización dudosa, etc. Si no hay, escribir "Sin banderas relevantes."]

**URL:** [link directo al paper o al DOI]

---
```

### Convenciones para el ID propuesto

Formato: `ApellidoPrimerAutorAño`.
- Ejemplo: `Madigan2020`, `EYSTAG2026`, `Toledo2025`.
- Si esperas que pueda haber colisión: agrega letra al final (`Madigan2020a`).
- Para reportes institucionales: usa sigla del organismo (`AAP2024`,
  `UNICEF2025`, `MINEDUC2026`).

### Convenciones para tramos etarios

Usa exactamente estos identificadores:
- `lactante` (0–12 meses)
- `primera-infancia` (1–3 años)
- `preescolar` (3–5 años)
- `niñez-media` (6–8 años) → escribe `ninez-media` sin tilde para el ID.
- `preadolescencia` (9–12 años)

### Convenciones para dimensiones

Usa exactamente estos identificadores (sin tildes ni ñ):
- `lenguaje`
- `cognicion`
- `socioemocional`
- `sueno`
- `actividad-fisica`
- `vision`
- `salud-mental`
- `comportamiento`
- `vinculo`
- `creatividad`

### Volumen y cobertura

Entrega entre **5 y 15 papers por respuesta**. Prioriza diversidad de
dimensiones y de tramos etarios sobre cantidad.

Si me das menos de 5 porque no encontraste más que cumplan los criterios,
es válido y preferible a forzar inclusiones débiles.

Si me das más de 15, no es útil: prefiero respuestas curadas a listas largas.

### Lo que NO quiero

- Opiniones tuyas sobre las recomendaciones que deberían darse a los padres.
- Resúmenes de noticias o medios de divulgación (solo papers o reportes
  oficiales).
- Listas de papers sin el análisis de tributación.
- Papers que solo describen "uso de pantallas" sin medir efectos en
  desarrollo.
- Estudios sobre adolescentes (≥13 años) sin extensión a edades menores.
- Papers que no estén accesibles públicamente (al menos abstract debe estar
  abierto).

### Idioma

Responde en español. Las citas en su idioma original.

## Fin del prompt
