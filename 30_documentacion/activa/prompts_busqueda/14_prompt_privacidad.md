# Prompt de búsqueda bibliográfica — Privacidad y seguridad digital × pantallas en niños de 0 a 12 años

## CONTEXTO

Estoy construyendo una síntesis crítica de evidencia científica sobre crianza y pantallas en niños de 0 a 12 años, con anclaje en evidencia 2020-2026. El sitio organiza los hallazgos en una matriz de 15 dimensiones del desarrollo × 5 tramos etarios:

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

El sitio ya integró los siguientes 189 papers. Si te encuentras con uno de estos, **NO lo propongas como nuevo**: márcalo como "ya integrado, propongo nuevas tributaciones si aplica".

```
Abounoori2022, Akacem2018, Ahmer2025, Anderson2007, Ashby2025,
Avci2024, Bakht2025, Bal2024, Berg2024, BodrozicSelak2025,
Boyland2022, Bukhalenkova2023, Bustamante2023, CarrascoMarin2022,
Carter2016, Chamam2024, Chen2024, ChenB2020, ChenYJ2025,
Cheung2017, ChildrenOf2020s, Christakis2004, CiminoCerniglia2025,
CoyneTantrums2021, Coyne2021, Coyne2022, Dahlgren2024,
Descarpentry2024, Dhakal2022, Dutra2025, Eirich2022,
Emond2021, Essex2025, EYSTAG2026, Fan2021, Ferguson2024,
Fitzpatrick2024, Foreman2021, Foreman2024, Gath2025,
Gillioz2025, Gomes2024, Guedes2024, Ha2025, Haghjoo2022,
Hartstein2025, He2025, HernandezMosqueira2025, Hesketh2026,
Hiltunen2021, Hood2021, Hu2021, Janssen2020, Jia2025,
JingLi2025, Jusiene2024, Karani2022, Kessafoglu2024,
Konok2024, Kou2024, Lai2025, Leonova2025, LiDan2024,
LiH2025, LiL2022, Li2020, Li2025, Linder2021,
Liu2024, LlanosMerin2024, Loudoun2022, Madigan2020,
Mallawaarachchi2024, Mason2024, Mataftsi2023, Matsumura2022,
MINEDUC2026, Mori2026, Myruski2018, Nagata2025a, Nagata2025b,
NamaziSadeghi2024, Neely2026, Neville2021, Neville2024,
NSF2024, ObservatorioNutricional2025, Ophir2023, PaezHerrera2025,
Papadakis2024, Pearson2018, Pedersen2022, Pickard2024,
Pirnes2022, Plackett2023, Putnick2023, Rega2023, Rhodes2020,
Roche2026, SanchezMiguel2024, Sanders2024, Sapounidis2025,
SchmidtPersson2024, Shoshani2021, Slattery2025, SlatteryRCT2024,
Song2026, SotoRamirez2025, Sticca2025, Stockdale2020,
Sugiyama2023, Tidemann2022, ToledoVargas2025, UNICEF2024,
vandenHeuvel2026, Vanderloo2025, Vasconcellos2025, Velazquez2025,
Vuorre2021, Wang2024, WHO2019, Wright2024, Xiao2025,
Yang2020, Yoshizawa2026, Yuan2024, Zeissig2024, Zhang2023,
Zhang2024, Zhang2025, Zhao2025, Zhou2024, Zhu2026, Zong2024
```

(Esta lista puede no estar al día; cuando dudes, márcalo.)

## DIMENSIÓN ESPECÍFICA: PRIVACIDAD Y SEGURIDAD DIGITAL (`privacidad`)

Buscar evidencia científica reciente (2020-2026) sobre los riesgos de seguridad y privacidad que enfrentan los niños de 0 a 12 años en entornos digitales: explotación sexual online, grooming, sextorsión, exposición a contenido inapropiado, y factores de riesgo y protección asociados.

**Nota conceptual importante:** esta dimensión cubre riesgos de origen externo (adultos que buscan contacto con menores, algoritmos que exponen contenido dañino, recolección de datos sin consentimiento). Es distinta de `cyberbullying` (agresión entre pares) y de `salud-mental` (desenlaces internalizantes). Los claims deben ser epidemiológicos y factoriales: prevalencia, factores de riesgo, factores protectores, eficacia de intervenciones preventivas.

### Sub-temas a cubrir

1. **Prevalencia de explotación sexual online (OCSEA/CSAM).** Estimaciones globales y regionales; tendencias post-pandemia; desglose por edad y género dentro de 0-12.
2. **Grooming online por adultos.** Prevalencia, tácticas documentadas, factores de riesgo en el niño y en el entorno familiar; señales de alerta.
3. **Sextorsión en preadolescentes.** Prevalencia emergente; mecanismos; desenlaces en salud mental; eficacia de respuesta institucional.
4. **Exposición a contenido inapropiado.** Pornografía, violencia, contenido de odio: prevalencia de exposición accidental y buscada en 6-12 años; efectos documentados.
5. **Factores de riesgo y protección.** Variables del niño (edad, género, habilidades digitales), del cuidador (supervisión, comunicación) y del entorno (tipo de plataforma, configuración de privacidad).
6. **Privacidad de datos y sharenting.** Recolección de datos de niños por plataformas; prácticas de sharenting de cuidadores y sus implicancias para la privacidad futura del niño.
7. **Eficacia de intervenciones preventivas.** Programas de seguridad online en escuelas; campañas de concienciación; eficacia de controles parentales técnicos.

### Lo que ya tenemos integrado (no proponer como nuevos)

No hay papers del corpus actual que tributen directamente a esta dimensión. Es un área nueva para el corpus.

### Anchors verificados del prompt 11 (semillas de búsqueda)

Estos papers tienen DOI/PMID verificado y deben incluirse si no están ya en el corpus:

- **Fry et al. 2025** — revisión sistemática y meta-análisis, Lancet Child & Adolescent Health. Prevalencia media de OCSEA último año: 8,1% (IC95% 4,9–13,0). DOI: 10.1016/S2352-4642(24)00329-8 (PMID 39855238).
- **Finkelhor, Turner & Colburn 2022** — JAMA Network Open. Grooming online por adultos 5,4%; sextorsión 3,5%. DOI: 10.1001/jamanetworkopen.2022.34471.

### Foco específico de novedad

Estamos particularmente cortos en:

- Evidencia para **tramos tempranos** (0-5 años): riesgos específicos de privacidad para niños que aún no tienen agencia digital propia (sharenting, datos recolectados sin consentimiento).
- **Evidencia latinoamericana** sobre prevalencia de OCSEA y grooming (la mayoría de los estudios son de Europa, Norteamérica y Asia-Pacífico).
- **Eficacia de intervenciones preventivas** con seguimiento longitudinal: ¿los programas de seguridad online en primaria reducen la victimización real, o solo el conocimiento declarado?
- Distinción entre **exposición accidental** (algoritmos que recomiendan contenido inapropiado) y **búsqueda activa** en preadolescentes: factores de riesgo diferenciales.

## FORMATO DE RESPUESTA

Para cada paper devuelve este bloque markdown, en este orden estricto. No agregues secciones. No omitas campos. Si un campo no aplica, escribe "No aplica" con justificación de una línea.

```markdown
### [ApellidoPrimerAutorAño]

**Cita completa:** Apellido N., Apellido N., et al. AÑO. Título completo. Journal volumen(número):páginas.

**Tipo:** meta-análisis / revisión sistemática / scoping review / cohorte longitudinal / transversal / ECA / guía oficial / norma jurídica / reporte técnico.

**Muestra:** N=XX.XXX participantes. K estudios incluidos (si aplica). Rango etario X-Y años. País/región.

**Hallazgo central (literal o paráfrasis declarada):** [3-5 líneas. Si hay cifras, son del abstract verbatim. Si parafraseas, declarar "(paráfrasis)".]

**Tributa a la dimensión `privacidad`, tramos etarios:**
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
