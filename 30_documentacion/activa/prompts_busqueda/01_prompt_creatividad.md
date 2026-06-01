# Prompt de búsqueda bibliográfica — Creatividad y juego × pantallas en niños de 0 a 12 años

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

El sitio ya integró los siguientes 250 papers (corpus al cierre de sesión 14). Si te encuentras con uno de estos, **NO lo propongas como nuevo**: márcalo como "ya integrado, propongo nuevas tributaciones si aplica".

```
AAP2016, AAP2024, AAP2026, Aboitiz, Abounoori2022, Adelantado2019,
AguilarFarias2021, Ahmer2025, Akacem2018, AlonsoGarcia2024, Anderson2007, Ashby2025,
Avci2024, Bakht2025, Bal2024, Berg2024, Bernardi2023, BodrozicSelak2025,
Boyland2022, Boyland2025, BrauneKrickau2021, BrightFutures, Bronfenbrenner1979, Brushe2024,
Bukhalenkova2023, Bustamante2023, CarrascoMarin2022, Carter2016, Carter2024, Chamam2024,
Chen2023, Chen2024, Chen2024b, ChenB2020, ChenJ2023, ChenYJ2025,
Cheung2017, ChildrenOf2020s, ChileCrece2017, Cho2025, Christakis2004, CiminoCerniglia2025,
CMO2019, CNTV2023, Colliver2022, Coyne2021, Coyne2022, Coyne2023,
CoyneTantrums2021, Dahlgren2024, deMeloBarreto2025, Descarpentry2024, Dhakal2022, Diamond2013,
DillmanCarpentier2020, DisruptingHarmBrasil2026, Dutra2025, Eirich2022, Eisenberg2004, ElGemayel2025,
Emond2021, Essex2025, Evans2023, EYSTAG2026, Fan2021, Ferguson2024,
Finkelhor2021, Finkelhor2022, Fish2026, Fitzpatrick2024, FlemingMilici2025, Foreman2021,
Foreman2024, Fry2025, GagoGalvagno2025, Garg2025, Gath2025, Gavrilova2024,
Gillioz2025, Giovanelli2025, Godaert2022, Gomes2024, Grama2024, Guedes2024,
Ha2025, Haghjoo2022, Hale2015, Hartstein2025, He2025, HernandezMartinez2025,
Hesketh2026, Hiltunen2021, Hinten2025, Hood2021, Hu2021, Huang2024,
Hysing2015, Janssen2020, Jensen2021, Jia2025, Jing2023, JingLi2025,
Jourdren2023, Jusiene2024, Jusiene2025, Karani2022, Kasturiratna2024, Kenney2024,
Kessafoglu2024, Konok2024, Kou2024, Krantz2026, Lai2025, Lee2026,
Lei2020, Leonova2025, Ley21801, Li2020, Li2024, Li2025,
LiDan2024, LiH2025, LiL2022, Lillard2013, Linder2021, Liu2024,
LiuH2024, LiuSAGE2024, LiX2025, LlanosMerin2024, LopezLopez2025, Loudoun2022,
Madigan2020, Maertens2021, Maertens2025, Mallawaarachchi2024, Malta2024, Mann2014,
Marciano2020, MartinCardaba2024, Martinot2021, Mason2024, Massaroni2023, Masten2010,
Mataftsi2023, Matos2026, Matsumura2022, McCarthy2022, MINEDUC2026, Mona2026,
Moosburner2025, Moreno2024, Mori2023, Mori2026, Mulligan2025, Myruski2018,
Nagata2025a, Nagata2025b, Nagata2025c, NamaziSadeghi2024, NareaMilDias, Neely2026,
Neville2021, Neville2024, NICE, Nieto2023, NSF2024, Nwachukwu2025,
ObsNutricional2025, OECD2023, Ophir2023, PaezHerrera2025, Papadakis2024, Paulich2021,
Pearson2018, Pedersen2022, Pickard2024, Pirnes2022, Plackett2023, Polanin2022,
Putnick2023, QuinonezPech2020, Raj2023, RauDaniel, RayHenry2025, Rega2023,
Rhodes2020, Roche2026, Russell2019, Saleem2024, Sanders2024, Sapounidis2025,
Savva2022, Schittenhelm2024, SchmidtPersson2024, Shannon2022, Shoshani2021, Shou2025,
Sidera2021, Slattery2025, SlatteryRCT2024, Smith2020, Smits2024, Song2026,
Sorrentino2023, SotoRamirez2025, Stockdale2020, Strouse2021, Sugiyama2023, Sundqvist2021,
Sutton2024, TaheryanSong2025, Thorell2024, ThornNCMEC2024, Tidemann2022, Toledo2025,
Tosuntas2024, Ulum2026, Vaiopoulou2025, vandenHeuvel2026, Vanderloo2014, Vanderloo2025,
Vasconcellos2025, Velazquez2025, Ventura2023, VerheijenSpooren2021, Vuorre2021, Vygotsky1978,
Wang2022, Wang2024, WeProtect2023, WHO-HBSC2024, WHO2019, WHO2023,
Wright2024, Xiao2025, Yang2020, Yang2024, Ye2022, Yoshizawa2026,
Yuan2024, Zeissig2024, Zgambo2025, Zhang2023, Zhang2024, Zhang2025,
Zhao2025, Zhou2024, Zhu2026, Zong2024
```

(Esta lista puede no estar al día; cuando dudes, márcalo.)

## DIMENSIÓN ESPECÍFICA: CREATIVIDAD Y JUEGO (`creatividad`)

Buscar evidencia científica reciente (2020-2026) sobre el impacto del uso de pantallas en la creatividad y el juego infantil en niños de 0 a 12 años.

### Sub-temas a cubrir

1. **Pensamiento divergente y fluidez creativa.** Tests estandarizados (Torrance, Wallach-Kogan) y su asociación con uso de pantallas.
2. **Juego simbólico libre.** Capacidad de inventar, transformar objetos, crear escenarios; tiempo dedicado vs. tiempo en pantalla.
3. **Aburrimiento como precursor de creatividad.** El rol del aburrimiento no medicado por pantalla.
4. **Imaginación narrativa.** Cuentos inventados, juego de roles, construcción de mundos.
5. **Pantalla creativa vs. pantalla consumo.** Diferencia entre apps de creación (Minecraft modo creativo, ScratchJr, apps de dibujo) y consumo pasivo.
6. **Maker culture y educación STEAM digital** (programación, robótica educativa) en niñez media.
7. **Juego al aire libre estructurado vs. no estructurado** como alternativa a pantallas.
8. **Producción creativa propia** (videos hechos por los niños, no consumidos) y su impacto en habilidades.

### Lo que ya tenemos integrado (no proponer como nuevos)

Esta dimensión está poco poblada en el corpus actual; cualquier hallazgo robusto es bienvenido.

### Foco específico de novedad

Esta es una dimensión con **alta sed de evidencia**:

- La literatura sobre creatividad y pantallas es comparativamente escasa frente a sueño, cognición o salud mental.
- Necesitamos meta-análisis o revisiones sistemáticas si existen; si no, las mejores cohortes longitudinales disponibles.
- Estudios sobre **juego libre y desarrollo creativo** post-pandemia (donde se observó disminución de juego al aire libre).
- Evidencia sobre apps de creación específicas (no genéricas): ¿Minecraft, Scratch, Roblox creativo, generan creatividad real transferible?
- Distinción rigurosa entre **consumo de contenido creativo** (ver a alguien dibujar) y **producción propia** (dibujar).
- Estudios sobre **aburrimiento y creatividad infantil** con métricas conductuales, no solo autorreporte.
- Evidencia latinoamericana, si existe, sobre juego infantil y pantallas.

## FORMATO DE RESPUESTA

Para cada paper devuelve este bloque markdown, en este orden estricto. No agregues secciones. No omitas campos. Si un campo no aplica, escribe "No aplica" con justificación de una línea.

```markdown
### [ApellidoPrimerAutorAño]

**Cita completa:** Apellido N., Apellido N., et al. AÑO. Título completo. Journal volumen(número):páginas.

**Tipo:** meta-análisis / revisión sistemática / scoping review / cohorte longitudinal / transversal / ECA / guía oficial / norma jurídica / reporte técnico.

**Muestra:** N=XX.XXX participantes. K estudios incluidos (si aplica). Rango etario X-Y años. País/región.

**Hallazgo central (literal o paráfrasis declarada):** [3-5 líneas. Si hay cifras, son del abstract verbatim. Si parafraseas, declarar "(paráfrasis)".]

**Tributa a la dimensión `creatividad`, tramos etarios:**
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
