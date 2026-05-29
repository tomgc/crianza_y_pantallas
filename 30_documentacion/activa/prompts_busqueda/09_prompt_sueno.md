# Prompt de búsqueda bibliográfica — Sueño × pantallas en niños de 0 a 12 años

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

## DIMENSIÓN ESPECÍFICA: SUEÑO (`sueno`)

Buscar evidencia científica reciente (2020-2026) sobre el impacto del uso de pantallas en el sueño de niños de 0 a 12 años. Cubrir todos los tramos etarios (lactante a preadolescencia), pero priorizar evidencia con sub-análisis por edad.

### Sub-temas a cubrir

1. **Duración del sueño.** Asociación entre tiempo de pantalla y minutos totales de sueño nocturno. Idealmente con magnitudes cuantificadas.
2. **Latencia de inicio.** Tiempo desde acostarse hasta dormirse.
3. **Calidad y fragmentación.** Despertares nocturnos, eficiencia del sueño.
4. **Cronotipo y fase circadiana.** Retraso de la hora de acostarse, melatonina nocturna.
5. **Pantallas en el dormitorio.** Diferencia entre tener pantalla en la pieza vs. usarla solo en otras áreas de la casa.
6. **Uso pre-sueño específicamente.** Pantalla en la hora previa a acostarse vs. uso diurno.
7. **Mecanismos:** luz azul, supresión melatonérgica, contenido arousing, desplazamiento de rutinas, hiperactividad pre-sueño.

### Lo que ya tenemos integrado (no proponer como nuevos)

- **He2025** (Frontiers Psychiatry): meta-análisis prospectivo N=548k, datos cuantitativos.
- **NSF2024**: consenso National Sleep Foundation basado en 574 manuscritos.
- **Gomes2024** (Canadian Family Physician): síntesis clínica.
- **LlanosMerin2024**: revisión sistemática preescolares.
- **AAP2016**: anchor histórico, regla "1 hora antes de dormir".
- **AguilarFarias2021**: dato chileno pandemia.

Si encuentras estos, márcalos como "ya integrado" y propón **nuevas tributaciones** si aplica (por ejemplo, He2025 podría tributar también a otros tramos etarios). No los repitas como entradas nuevas.

### Foco específico de novedad

Estamos cortos en:

- Evidencia para **lactantes** (0-12 meses) y **primera infancia** (1-3 años) — la mayoría de la literatura cubre escolares en adelante.
- Mecanismos neurobiológicos verificables con citación primaria (los datos "88% supresión melatonina" que circulan en literatura divulgativa requieren rastreo a fuente primaria; si no se encuentra la fuente original, omitir el dato).
- Evidencia latinoamericana o chilena específica.
- Datos sobre tipo de contenido (interactivo vs. pasivo, rápido vs. lento) y su impacto diferencial sobre sueño.

## FORMATO DE RESPUESTA

Para cada paper devuelve este bloque markdown, en este orden estricto. No agregues secciones. No omitas campos. Si un campo no aplica, escribe "No aplica" con justificación de una línea.

```markdown
### [ApellidoPrimerAutorAño]

**Cita completa:** Apellido N., Apellido N., et al. AÑO. Título completo. Journal volumen(número):páginas.

**Tipo:** meta-análisis / revisión sistemática / scoping review / cohorte longitudinal / transversal / ECA / guía oficial / norma jurídica / reporte técnico.

**Muestra:** N=XX.XXX participantes. K estudios incluidos (si aplica). Rango etario X-Y años. País/región.

**Hallazgo central (literal o paráfrasis declarada):** [3-5 líneas. Si hay cifras, son del abstract verbatim. Si parafraseas, declarar "(paráfrasis)".]

**Tributa a la dimensión `sueno`, tramos etarios:**
- `[tramo-etario]` con certeza **alta/media/baja**. Justificación: [una línea sobre por qué encaja en ese tramo].
- [repetir si tributa a más de un tramo etario]

**Banderas metodológicas o de aplicabilidad:**
- [bandera 1: heterogeneidad, sesgo de selección, dependencia de autoreporte, contexto cultural específico, etc.]
- [bandera 2 si aplica]

**¿Probablemente ya integrado en el corpus?** Sí / No / Posible (justificar en una línea).

**URL/DOI:** https://doi.org/... o PubMed PMID.

---
```

## OUTPUT FINAL ESPERADO

10-15 papers de la calidad especificada, cada uno con el bloque markdown completo, ordenados por **calidad de evidencia** (meta-análisis y revisiones primero, luego longitudinales, luego transversales, institucionales al final).

Al cierre, dame una **sección de "vacíos de evidencia detectados"**: 2-4 áreas dentro de la dimensión que están sub-investigadas o que tienen evidencia contradictoria, en 2-3 líneas cada una.
