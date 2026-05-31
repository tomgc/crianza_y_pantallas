# Prompt para Claude Code — Batch bibliográfico: dimensión cognición

Ejecuta los cambios exactos descritos abajo sobre `10_fuentes/data/bibliografia.json`
y `10_fuentes/data/claims.json`. Luego valida, construye y commitea.

Estás en la raíz del proyecto `crianza_y_pantallas`, rama `main`.

---

## Decisiones de integración

- **Ma2025**: excluido — DOI no verificable. No integrar hasta resolver la bandera.
- **Mona2026**: incluido con certeza baja y bandera explícita de transferencia limitada
  (muestra 11–31 años dominada por adolescentes/adultos jóvenes).
- **TaheryanSong2025**: incluido con bandera de rango etario no verificado en texto primario.
  Certeza baja en `primera-infancia`, media en `preescolar` y `ninez-media`.
- **9 papers integrados**, **6 claims nuevos**, **5 ediciones de claims existentes**.

---

## PARTE 1 — Agregar 9 entradas a `bibliografia.json`

Agrega las siguientes entradas al array. Insértalas manteniendo orden alfabético por `id`
(o al final; el orden no afecta el build).

```json
{
  "id": "ChenJ2023",
  "group": "recent",
  "type": "meta",
  "featured": true,
  "authors": "Chen J., Zhou X., Wu X., Gao Z., Ye S. 2023",
  "title": "Effects of exergaming on executive functions of children: a systematic review and meta-analysis from 2010 to 2023",
  "journal": "Archives of Public Health 81:199",
  "url": "https://doi.org/10.1186/s13690-023-01195-z"
},
{
  "id": "Hinten2025",
  "group": "recent",
  "type": "meta",
  "featured": true,
  "authors": "Hinten A.E., Scarf D., Imuta K. 2025",
  "title": "Meta-Analytic Review of the Short-Term Effects of Media Exposure on Children's Attention and Executive Functions",
  "journal": "Developmental Science 28(6):e70069",
  "url": "https://doi.org/10.1111/desc.70069"
},
{
  "id": "LiuH2024",
  "group": "recent",
  "type": "meta",
  "authors": "Liu H., Chen X., Huang M., Yu X., Gan Y., Wang J., Chen Q., Nie Z., Ge H. 2024",
  "title": "Screen time and childhood attention deficit hyperactivity disorder: a meta-analysis",
  "journal": "Reviews on Environmental Health 39(4):643–650",
  "url": "https://doi.org/10.1515/reveh-2022-0262"
},
{
  "id": "LiX2025",
  "group": "school",
  "type": "longitudinal",
  "featured": true,
  "authors": "Li X., Keown-Stoneman C.D., Omand J.A., Cost K.T., Gallagher-Mackay K., Hove J., Janus M., Korczak D.J., Pullenayegum E.M., et al. 2025",
  "title": "Screen Time and Standardized Academic Achievement Tests in Elementary School",
  "journal": "JAMA Network Open 8(10):e2537092",
  "url": "https://doi.org/10.1001/jamanetworkopen.2025.37092"
},
{
  "id": "Mona2026",
  "group": "school",
  "type": "review",
  "authors": "Mona A.E., Roshith V., Peter R., Roy P., Hassan A., Devika M., Trishala M. 2026",
  "title": "Short video addiction and its impact on cognitive functioning in adolescents and youth: a systematic review",
  "journal": "International Journal of Adolescence and Youth 31(1):2623337",
  "url": "https://doi.org/10.1080/02673843.2026.2623337"
},
{
  "id": "Paulich2021",
  "group": "school",
  "type": "transversal",
  "featured": true,
  "authors": "Paulich K.N., Ross J.M., Lessem J.M., Hewitt J.K. 2021",
  "title": "Screen time and early adolescent mental health, academic, and social outcomes in 9- and 10- year old children: Utilizing the Adolescent Brain Cognitive Development (ABCD) Study",
  "journal": "PLoS ONE 16(9):e0256591",
  "url": "https://doi.org/10.1371/journal.pone.0256591"
},
{
  "id": "Shou2025",
  "group": "school",
  "type": "longitudinal",
  "authors": "Shou Q., Yamashita M., Mizuno Y. 2025",
  "title": "Association of screen time with attention-deficit/hyperactivity disorder symptoms and their development: the mediating role of brain structure",
  "journal": "Translational Psychiatry 15 (2025-10-31)",
  "url": "https://doi.org/10.1038/s41398-025-03672-1"
},
{
  "id": "TaheryanSong2025",
  "group": "recent",
  "type": "meta",
  "authors": "Taheryan A., Song K.M. 2025",
  "title": "The Impact of Touchscreens on Early Learning: A Meta-Analysis",
  "journal": "Journal of Research in Childhood Education 40(2):303–326",
  "url": "https://doi.org/10.1080/02568543.2025.2455634"
},
{
  "id": "Thorell2024",
  "group": "school",
  "type": "review",
  "authors": "Thorell L.B., Burén J., Ström Wiman J., Sandberg D., Nutley S.B. 2024",
  "title": "Longitudinal associations between digital media use and ADHD symptoms in children and adolescents: a systematic literature review",
  "journal": "European Child & Adolescent Psychiatry 33(8):2503–2526",
  "url": "https://doi.org/10.1007/s00787-022-02130-3"
}
```

---

## PARTE 2 — Editar claims en `claims.json`

### Ediciones de claims existentes

#### cognicion-primera-infancia[2]
Agrega `"TaheryanSong2025"` a `refs` y actualiza el texto para declarar la bandera de rango etario.
Nuevo estado completo:
```json
{
  "certainty": "low",
  "text": "La hipótesis del \"video deficit\" para el aprendizaje cognitivo está mejor establecida en menores de 3 años; un meta-análisis de touchscreens (K=57, rango ~2–8 años; rango no verificado en texto primario) halla un efecto de aprendizaje moderado (d=0.48), condicionado por el feedback adulto y el dominio de contenido.",
  "refs": ["TaheryanSong2025"]
}
```

#### cognicion-preescolar[0]
Agrega `"Hinten2025"` a `refs`. Resultado:
```json
"refs": ["Mallawaarachchi2024", "Hinten2025"]
```

#### cognicion-preescolar[1]
Agrega `"LiuH2024"` a `refs` y actualiza texto para incluir el OR. Nuevo estado completo:
```json
{
  "certainty": "medium",
  "text": "La asociación con TDAH es moderada pero consistente: meta-análisis (N=81.234; K=9) halla OR 1.51 (IC95% 1.20–1.90) para ≥2 h/día vs. <2 h/día. La asociación es correlacional y vulnerable a confusión (sueño, parentalidad).",
  "refs": ["Jourdren2023", "LiuH2024"]
}
```

#### cognicion-preescolar[3]
Agrega `"Ma2025"` está excluido — no tocar. Agrega `"TaheryanSong2025"` a `refs`. Resultado:
```json
"refs": ["Gath2025", "TaheryanSong2025"]
```

#### cognicion-ninez-media[0]
Agrega `"LiX2025"` y `"Paulich2021"` a `refs`. Resultado:
```json
"refs": ["AAP2026", "LiX2025", "Paulich2021"]
```

---

### Claims nuevos

#### cognicion-primera-infancia — claim nuevo (índice 4, al final de la celda)
```json
{
  "certainty": "medium",
  "text": "El tipo de contenido importa más que el ritmo: meta-análisis (19–16 estudios; 1.431–1.297 niños de 1,5–10 años) muestra que el contenido fantástico deprime atención y función ejecutiva inmediatamente post-visionado (d=−0.24), mientras el ritmo rápido per se no tiene efecto significativo (d=−0.12). Heterogeneidad alta; efectos de corto plazo, no longitudinales.",
  "refs": ["Hinten2025"]
}
```

#### cognicion-ninez-media — claim nuevo (índice 3, al final de la celda)
```json
{
  "certainty": "high",
  "text": "Cohorte longitudinal grande (TARGet Kids!, N=3.322 en grado 3; N=2.084 en grado 6): mayor tiempo de pantalla se asocia con menor logro estandarizado en lectura y matemática. Para videojuegos, el efecto es significativo en lectura de grado 3 (OR 0.77; IC95% 0.62–0.94), con mayor impacto en niñas. El nivel socioeconómico predice más que el tiempo de pantalla.",
  "refs": ["LiX2025", "Paulich2021"]
}
```

#### cognicion-ninez-media — claim nuevo (índice 4, al final de la celda)
```json
{
  "certainty": "medium",
  "text": "Los exergames (videojuegos con actividad física) mejoran flexibilidad cognitiva (SMD=0.34) e inhibición en 4–12 años (meta-análisis de ECA, K=11, n=508). El beneficio no es generalizable a videojuegos recreativos sedentarios: el efecto puede deberse a la actividad física, no al componente digital.",
  "refs": ["ChenJ2023"]
}
```

#### cognicion-preadolescencia — claim nuevo (índice 3, al final de la celda)
```json
{
  "certainty": "high",
  "text": "Cohorte longitudinal con neuroimagen (ABCD, N=10.116 a los 9–10 años): el tiempo de pantalla se asocia con síntomas de TDAH a 2 años de seguimiento; el volumen cortical actúa como mediador parcial. Datos paralelos (ABCD transversal, N=11.875) muestran que el nivel socioeconómico predice más que el tiempo de pantalla en rendimiento académico, salud mental y sueño.",
  "refs": ["Shou2025", "Paulich2021"]
}
```

#### cognicion-preadolescencia — claim nuevo (índice 4, al final de la celda)
```json
{
  "certainty": "medium",
  "text": "Revisión sistemática de 28 estudios longitudinales (0–17 años) halla relaciones recíprocas entre uso de medios digitales y síntomas de TDAH; las asociaciones son más consistentes para uso problemático que para tiempo de pantalla total. Limitación: el rango incluye adolescentes mayores y los efectos pueden estar dominados por ese grupo.",
  "refs": ["Thorell2024"]
}
```

#### cognicion-preadolescencia — claim nuevo (índice 5, al final de la celda)
```json
{
  "certainty": "low",
  "text": "El uso adictivo de video corto (TikTok/Reels) se asocia con déficits atencionales y de control ejecutivo en revisión sistemática (K=23; N=22.122; rango 11–31 años). Transferencia muy limitada a 9–12 años: la muestra está dominada por adolescentes mayores y adultos jóvenes, con predominio de diseños transversales y muestras chinas.",
  "refs": ["Mona2026"]
}
```

---

## PARTE 3 — Validación, build y commit

```bash
set -e

python3 - << 'PYEOF'
import json, sys

bib = json.load(open("10_fuentes/data/bibliografia.json"))
claims = json.load(open("10_fuentes/data/claims.json"))

errors = []

# 1. Sin IDs duplicados en biblio
ids = [b["id"] for b in bib]
if len(ids) != len(set(ids)):
    dupes = [x for x in ids if ids.count(x) > 1]
    errors.append(f"IDs duplicados en biblio: {set(dupes)}")

# 2. Refs huérfanos
id_set = set(ids)
for cid, cell in claims.items():
    for c in cell.get("claims", []):
        for r in c.get("refs", []):
            if r not in id_set:
                errors.append(f"Ref huérfano: {r} en {cid}")

# 3. Total bibliografía
EXPECTED_BIB = 83
if len(bib) != EXPECTED_BIB:
    errors.append(f"Biblio esperada {EXPECTED_BIB}, hay {len(bib)}")

# 4. Total claims
EXPECTED_CLAIMS = 139
total = sum(len(c.get("claims", [])) for c in claims.values())
if total != EXPECTED_CLAIMS:
    errors.append(f"Claims esperados {EXPECTED_CLAIMS}, hay {total}")

# 5. Celdas cognición con refs correctos
EXPECTED_REFS = {
    "cognicion-primera-infancia": {"TaheryanSong2025", "Hinten2025"},
    "cognicion-preescolar":       {"Mallawaarachchi2024", "Hinten2025",
                                   "Jourdren2023", "LiuH2024",
                                   "Gath2025", "TaheryanSong2025"},
    "cognicion-ninez-media":      {"AAP2026", "LiX2025", "Paulich2021", "ChenJ2023"},
    "cognicion-preadolescencia":  {"Shou2025", "Paulich2021", "Thorell2024", "Mona2026"},
}
for cid, expected in EXPECTED_REFS.items():
    actual = set()
    for c in claims[cid].get("claims", []):
        actual.update(c.get("refs", []))
    missing = expected - actual
    if missing:
        errors.append(f"{cid} falta refs: {missing}")

# 6. Ma2025 no debe estar integrado
for cid, cell in claims.items():
    for c in cell.get("claims", []):
        if "Ma2025" in c.get("refs", []):
            errors.append(f"Ma2025 integrado en {cid} — bandera DOI sin resolver")

if errors:
    print("\n".join(f"  ✗ {e}" for e in errors))
    sys.exit(1)

print("✓ Validaciones OK")
PYEOF

./00_build.sh

git add 10_fuentes/data/bibliografia.json 10_fuentes/data/claims.json index.html
git commit -m "Batch cognición: 9 entradas biblio + 5 ediciones + 6 claims nuevos

Papers integrados: Hinten2025, LiuH2024, Thorell2024, TaheryanSong2025,
ChenJ2023, Mona2026, LiX2025, Shou2025, Paulich2021

Cobertura por tramo:
- primera-infancia: contenido fantástico vs. ritmo (Hinten2025); touchscreens (TaheryanSong2025)
- preescolar: Hinten2025 a fast-paced[0]; OR 1.51 TDAH (LiuH2024); TaheryanSong2025 a Gath2025[3]
- ninez-media: logro académico TARGet Kids! (LiX2025+Paulich2021); exergames EF (ChenJ2023)
- preadolescencia: ABCD neuroimagen (Shou2025+Paulich2021); TDAH longitudinal (Thorell2024); video corto (Mona2026)

Excluido: Ma2025 (DOI no verificable — bandera Etapa 2 pendiente)
Banderas declaradas: TaheryanSong2025 (rango etario); Mona2026 (muestra 11–31 años)"
```

**NO pushear hasta validación visual del sitio.**
