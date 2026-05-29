# Prompt de búsqueda bibliográfica — Evaluación de dimensiones nuevas

## CONTEXTO

Estoy construyendo una síntesis crítica de evidencia científica sobre crianza y pantallas en niños de 0 a 12 años, con anclaje en evidencia 2020-2026. El sitio organiza los hallazgos en una matriz de 10 dimensiones del desarrollo × 5 tramos etarios:

- Tramos etarios: `lactante` (0-12 meses), `primera-infancia` (1-3 años), `preescolar` (3-5 años), `ninez-media` (6-8 años), `preadolescencia` (9-12 años).

Necesito que actúes como agente especializado en revisión bibliográfica. Tu output será procesado posteriormente para integrar al corpus existente del sitio, así que la calidad y rastreabilidad de las referencias es lo más importante.

## VENTANA TEMPORAL

- Rango principal: **2020 a 2026 inclusive**.
- Excepción declarada: documentos institucionales fundacionales (AAP, OMS, OECD, UNICEF, ministerios) anteriores a 2020 son aceptables solo si funcionan como anchor normativo aún citado en la literatura actual. Marcarlos explícitamente como "anchor pre-2020".

## CALIDAD DE EVIDENCIA — JERARQUÍA

Prioriza en este orden:

1. Meta-análisis y revisiones sistemáticas de alta calidad (PRISMA-compliant, idealmente Cochrane).
2. Cohortes longitudinales prospectivas con N > 1.000.
3. Ensayos controlados aleatorizados (raros en este campo).
4. Estudios transversales grandes (N > 5.000) con análisis multivariado y control de confusores.
5. Documentos institucionales recientes (AAP 2024-2026, OMS post-2019, ministerios).
6. Revisiones de alcance (scoping reviews) — incluir solo si no hay revisión sistemática equivalente.

**Descarta** estudios pequeños transversales (N < 500) sin justificación metodológica especial. **Descarta** opiniones, comentarios editoriales, notas de prensa.

## REGLAS ANTI-ALUCINACIÓN (críticas)

Tres bugs específicos detectados en agentes anteriores que NO debes reproducir:

1. **NO inventes autoría.** Si no puedes verificar el primer autor directamente desde PubMed, DOI o el journal, **omite el paper**. Es preferible un output de 7 papers verificados que 15 con autoría posiblemente alucinada.

2. **NO infieras DOIs.** Cada paper debe traer un DOI o PMID que resuelva a la página correcta. Si no encuentras el identificador, declara `URL: NO VERIFICABLE` y márcalo como bandera.

3. **NO reescribas hallazgos.** Si vas a citar un dato cuantitativo (N, effect size, OR, %), debe venir literal del abstract o del paper. Si parafraseas, declara que es paráfrasis. No inventes cifras que "suenan plausibles".

## CONOCIMIENTO DEL CORPUS EXISTENTE

El sitio ya integró los siguientes papers en sesiones anteriores. Si te encuentras con uno de estos, **NO lo propongas como nuevo**: márcalo como "ya integrado, propongo nuevas tributaciones si aplica".

Papers ya integrados (al cierre de sesión 4 / commit `baee3ed`):

```
AAP2016, AAP2024, AAP2026, AguilarFarias2021, Bakht2025, Bal2024,
Bustamante2023, Dutra2025, Eirich2022, EYSTAG2026, Fitzpatrick2024,
Foreman2021, Foreman2024, Gath2025, Gomes2024, Ha2025, He2025,
Jusiene2024, Karani2022, LlanosMerin2024, Madigan2020,
Mallawaarachchi2024, MINEDUC2026, Mori2026, NSF2024,
ObservatorioNutricional2025, PaezHerrera2025, Pearson2018,
SanchezMiguel2024, Sanders2024, SotoRamirez2025, Sticca2025,
ToledoVargas2025, UNICEF2024, Vasconcellos2025, WHO2019
```

(Esta lista puede no estar al día; cuando dudes, márcalo.)

## TAREA: EVALUACIÓN DE DIMENSIONES NUEVAS PARA EL SITIO

El sitio actualmente cubre 10 dimensiones del desarrollo infantil (0-12 años) y su relación con el uso de pantallas:

1. Lenguaje
2. Cognición y atención
3. Socio-emocional (competencias relacionales)
4. Sueño
5. Actividad física y motricidad
6. Visión
7. Salud mental (clínica)
8. Comportamiento y autorregulación
9. Vínculo y apego
10. Creatividad y juego

Necesito que evalúes si existen **otras dimensiones del desarrollo infantil** que tengan evidencia científica robusta (2020-2026) sobre su relación con el uso de pantallas, y que **no estén cubiertas** por las 10 anteriores. El objetivo es decidir si el sitio debería expandirse incorporando nuevas dimensiones, o si todo lo relevante ya tiene casa en las 10 existentes.

### Candidatas a evaluar (lista no exhaustiva)

Evalúa cada una de las siguientes con el formato indicado abajo. Para cada una, determina: (a) si hay evidencia 2020+ robusta y específica sobre pantallas, (b) si la dimensión amerita estar separada o si su contenido encaja dentro de las 10 existentes.

1. **Alimentación y hábitos nutricionales.** Marketing dirigido a niños, snacking distraído frente a pantallas, asociación con obesidad (overlap con `fisica`).
2. **Postura, columna y musculoesquelético.** "Text neck", síndrome de uso de dispositivos, alteraciones biomecánicas (overlap con `fisica`).
3. **Audición.** Uso prolongado de audífonos, hipoacusia inducida por ruido en niños.
4. **Habilidades digitales y alfabetización mediática.** Capacidad de navegar, evaluar críticamente, distinguir información de desinformación. Es una dimensión positiva, no de daño.
5. **Privacidad y seguridad digital.** Exposición a grooming, abuso sexual online, sextorsión en preadolescentes.
6. **Identidad y autoconcepto digital.** Distinta de salud mental clínica; cómo el niño construye su identidad mediada por la experiencia digital.
7. **Habilidades parentales y co-regulación digital.** Dimensión sobre los adultos, no los niños; pero crítica.
8. **Sedentarismo metabólico** (más allá de obesidad: marcadores inflamatorios, salud cardiovascular pediátrica).
9. **Sueño-cronotipo desfasado y rendimiento escolar** (interfaz entre `sueno` y `cognicion`).
10. **Bienestar subjetivo y satisfacción vital** infantil (distinta de salud mental clínica; más positiva/eudaimónica).

### Pregunta abierta al cierre

Después de evaluar las 10 candidatas anteriores, dime:

- ¿Hay alguna dimensión adicional que no aparezca en la lista de 10 candidatas, que tenga literatura 2020+ robusta y un encuadre diferenciable, y que el sitio debería considerar incorporar?
- Si propones alguna, justifica con al menos un paper meta-analítico o revisión sistemática reciente que sea su anchor.

## FORMATO DE RESPUESTA

Para cada dimensión candidata, devolver:

```markdown
### Dimensión candidata: [NOMBRE]

**¿Encaja en alguna de las 10 existentes?** Sí (¿cuál?) / Parcialmente (¿qué se cubre y qué no?) / No.

**Volumen de evidencia 2020+:** Alto / Medio / Bajo / Muy bajo.

**Calidad de evidencia disponible:** Meta-análisis disponibles / Solo revisiones sistemáticas / Solo estudios primarios / Sin literatura sustantiva.

**Anchor sugerido (si recomiendas incorporar):** Cita del mejor paper disponible con DOI verificable.

**Recomendación al sitio:** Incorporar como dimensión nueva / Incorporar como sub-tema dentro de [dimensión existente] / Esperar acumulación de evidencia / Descartar.

**Justificación** (3-4 líneas).

---
```

Al final, sección separada con la respuesta a la **pregunta abierta** sobre dimensiones no listadas, con su respuesta justificada.

## OUTPUT FINAL ESPERADO

10 bloques de evaluación (uno por cada dimensión candidata listada) + 1 sección final con la pregunta abierta. Cada bloque sigue el formato exacto especificado arriba.
