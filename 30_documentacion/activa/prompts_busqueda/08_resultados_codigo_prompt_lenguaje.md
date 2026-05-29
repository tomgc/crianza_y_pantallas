# Prompt para Claude Code — Batch bibliográfico: dimensión lenguaje

Ejecuta los cambios exactos descritos abajo sobre `10_fuentes/data/bibliografia.json`
y `10_fuentes/data/claims.json`. Luego valida, construye y commitea.

Estás en la raíz del proyecto `crianza_y_pantallas`, rama `refactor/modular-build`.

---

## PARTE 1 — Agregar 8 entradas a `bibliografia.json`

Agrega las siguientes entradas al array de `bibliografia.json`.
Insértalas en orden alfabético por `id` (o al final del array; el orden
no afecta el build, pero mantén consistencia con el resto del archivo).

```json
{
  "id": "Brushe2024",
  "group": "recent",
  "type": "cohort",
  "authors": "Brushe M.E., Haag D.G., Melhuish E.C., Reilly S., Gregory T. 2024",
  "title": "Screen Time and Parent-Child Talk When Children Are Aged 12 to 36 Months",
  "journal": "JAMA Pediatrics. Mediciones con grabaciones de audio LENA",
  "url": "https://jamanetwork.com/journals/jamapediatrics/fullarticle/2815616"
}
```

⚠️ `Brushe2024` YA EXISTE en `bibliografia.json`. No la agregues. Solo úsala en los refs de claims.

Agrega estas 8 entradas nuevas:

```json
{
  "id": "GagoGalvagno2025",
  "group": "recent",
  "type": "cross-sectional",
  "authors": "Gago-Galvagno L.G., Elgier A.M., Tabullo A.J., Huaire-Inacio E.J., et al. 2025",
  "title": "Use of screens, books and adults' interactions on toddler's language and motor skills: A cross-cultural study among 19 Latin American countries from different SES",
  "journal": "PLOS ONE 20(2):e0314569",
  "url": "https://doi.org/10.1371/journal.pone.0314569"
},
{
  "id": "Jing2023",
  "group": "recent",
  "type": "meta-analysis",
  "featured": true,
  "authors": "Jing M., Ye T., Kirkorian H.L., Mares M.-L. 2023",
  "title": "Screen media exposure and young children's vocabulary learning and development: A meta-analysis",
  "journal": "Child Development 94(5):1398–1418",
  "url": "https://doi.org/10.1111/cdev.13927"
},
{
  "id": "Martinot2021",
  "group": "recent",
  "type": "cohort",
  "authors": "Martinot P., Bernard J.Y., Peyre H., De Agostini M., Forhan A., Charles M.-A., Plancoulaine S., Heude B. 2021",
  "title": "Exposure to screens and children's language development in the EDEN mother–child cohort",
  "journal": "Scientific Reports 11:11863",
  "url": "https://doi.org/10.1038/s41598-021-90867-3"
},
{
  "id": "Massaroni2023",
  "group": "recent",
  "type": "systematic-review",
  "authors": "Massaroni V., Delle Donne V., Marra C., Arcangeli V., Chieffo D.P.R. 2023",
  "title": "The Relationship between Language and Technology: How Screen Time Affects Language Development in Early Life—A Systematic Review",
  "journal": "Brain Sciences 14(1):27",
  "url": "https://doi.org/10.3390/brainsci14010027"
},
{
  "id": "Nwachukwu2025",
  "group": "recent",
  "type": "systematic-review",
  "authors": "Nwachukwu E.C., Nigam A., Sekar Lakshmisai S., Sakarkar P., Bheemaneni R.S., Malasevskaia I.A. 2025",
  "title": "Impact of Screen Time on Language Development and Vocabulary Acquisition in Early Childhood: A Systematic Review",
  "journal": "Cureus 17(11):e97429",
  "url": "https://doi.org/10.7759/cureus.97429"
},
{
  "id": "Strouse2021",
  "group": "recent",
  "type": "meta-analysis",
  "featured": true,
  "authors": "Strouse G.A., Samson J.E. 2021",
  "title": "Learning From Video: A Meta-Analysis of the Video Deficit in Children Ages 0 to 6 Years",
  "journal": "Child Development 92(1):e20–e38",
  "url": "https://doi.org/10.1111/cdev.13429"
},
{
  "id": "VerheijenSpooren2021",
  "group": "recent",
  "type": "experimental",
  "authors": "Verheijen L., Spooren W. 2021",
  "title": "The impact of WhatsApp on Dutch youths' school writing and spelling",
  "journal": "Journal of Writing Research 13(1):155–191",
  "url": "https://doi.org/10.17239/jowr-2021.13.01.05"
},
{
  "id": "Yang2024",
  "group": "recent",
  "type": "cohort",
  "featured": true,
  "authors": "Yang S., Saïd M., Peyre H., Ramus F., Taine M., Law E.C., Dufourg M.-N., Heude B., Charles M.-A., Bernard J.Y. 2024",
  "title": "Associations of screen use with cognitive development in early childhood: the ELFE birth cohort",
  "journal": "Journal of Child Psychology and Psychiatry 65(5):680–693",
  "url": "https://doi.org/10.1111/jcpp.13887"
}
```

---

## PARTE 2 — Editar claims en `claims.json`

### lenguaje-lactante[0]
Agrega `"Brushe2024"` y `"Massaroni2023"` a `refs`. Resultado:
```json
"refs": ["Brushe2024", "Massaroni2023"]
```

### lenguaje-lactante[2]
Agrega `"Strouse2021"` a `refs`. Resultado:
```json
"refs": ["Strouse2021"]
```

### lenguaje-primera-infancia[0]
Reemplaza el texto completo y agrega refs. Nuevo estado:
```json
{
  "certainty": "high",
  "text": "Meta-análisis de Madigan et al. (2020, JAMA Pediatrics, N=18.905): mayor tiempo de pantalla se asocia con menores habilidades lingüísticas (r=−.14). Sin embargo, cohortes grandes con control de confusores (ELFE, N=13.763; EDEN, N=1.562) muestran que el efecto del tiempo de pantalla per se es débil; lo que predice peores resultados es el contexto, como la TV encendida durante las comidas.",
  "refs": ["Madigan2020", "Yang2024", "Martinot2021", "Brushe2024", "Massaroni2023"]
}
```

### lenguaje-primera-infancia[2]
Agrega `"Jing2023"` y `"GagoGalvagno2025"` a `refs`. Resultado:
```json
"refs": ["Karani2022", "Jing2023", "GagoGalvagno2025"]
```

### lenguaje-primera-infancia[3]
Agrega `"GagoGalvagno2025"` a `refs`. Resultado:
```json
"refs": ["Sundqvist2021", "GagoGalvagno2025"]
```

### lenguaje-primera-infancia — claim nuevo (índice 5, al final de la celda)
Agrega este claim nuevo al array `claims` de `lenguaje-primera-infancia`:
```json
{
  "certainty": "high",
  "text": "Cohortes grandes con control de confusores (EDEN, N=1.562; ELFE, N=13.763) muestran que el tiempo de pantalla per se tiene asociaciones débiles o nulas con el lenguaje; lo que predice peores resultados es el contexto: TV encendida durante las comidas a los 2 años se asocia con peor desarrollo lingüístico a los 3,5 años.",
  "refs": ["Martinot2021", "Yang2024"]
}
```

### lenguaje-preescolar[0]
Agrega `"Jing2023"` y `"Nwachukwu2025"` a `refs`. Resultado:
```json
"refs": ["Madigan2020", "Jing2023", "Nwachukwu2025"]
```

### lenguaje-preescolar[1]
Agrega `"Nwachukwu2025"` y `"Yang2024"` a `refs`. Resultado:
```json
"refs": ["Mallawaarachchi2024", "Nwachukwu2025", "Yang2024"]
```

### lenguaje-preescolar[2]
Agrega `"Strouse2021"` y `"Jing2023"` a `refs`. Resultado:
```json
"refs": ["Strouse2021", "Jing2023"]
```

### lenguaje-preadolescencia[1]
Reemplaza texto completo, sube certeza a `medium` y agrega ref. Nuevo estado:
```json
{
  "certainty": "medium",
  "text": "La mensajería instantánea no perjudica la escritura formal escolar; estudios experimentales hallan un leve efecto positivo en ortografía, posiblemente porque el uso frecuente incrementa la conciencia ortográfica.",
  "refs": ["VerheijenSpooren2021"]
}
```

---

## PARTE 3 — Validación, build y commit

Ejecuta todo en un solo bloque bash con `set -e`:

```bash
set -e

# Validación cruzada
python3 - << 'PYEOF'
import json, sys

bib = json.load(open("10_fuentes/data/bibliografia.json"))
claims = json.load(open("10_fuentes/data/claims.json"))

errors = []

# 1. Sin IDs duplicados en biblio
ids = [b["id"] for b in bib]
if len(ids) != len(set(ids)):
    errors.append("IDs duplicados en biblio")

# 2. Todos los refs en claims apuntan a IDs existentes
id_set = set(ids)
for cid, cell in claims.items():
    for c in cell.get("claims", []):
        for r in c.get("refs", []):
            if r not in id_set:
                errors.append(f"Ref huérfano: {r} en {cid}")

# 3. Total bibliografia
EXPECTED_BIB = 73
if len(bib) != EXPECTED_BIB:
    errors.append(f"Biblio esperada {EXPECTED_BIB}, hay {len(bib)}")

# 4. Total claims
EXPECTED_CLAIMS = 133
total = sum(len(c.get("claims", [])) for c in claims.values())
if total != EXPECTED_CLAIMS:
    errors.append(f"Claims esperados {EXPECTED_CLAIMS}, hay {total}")

# 5. Celdas lenguaje con refs correctos
EXPECTED_REFS = {
    "lenguaje-lactante":       {"Brushe2024", "Massaroni2023", "Strouse2021"},
    "lenguaje-preescolar":     {"Madigan2020", "Jing2023", "Nwachukwu2025",
                                "Mallawaarachchi2024", "Yang2024", "Strouse2021"},
    "lenguaje-primera-infancia": {"Madigan2020", "Yang2024", "Martinot2021",
                                  "Brushe2024", "Massaroni2023", "Karani2022",
                                  "Jing2023", "GagoGalvagno2025", "Sundqvist2021",
                                  "Gath2025"},
    "lenguaje-preadolescencia": {"VerheijenSpooren2021"},
}
for cid, expected in EXPECTED_REFS.items():
    actual = set()
    for c in claims[cid].get("claims", []):
        actual.update(c.get("refs", []))
    missing = expected - actual
    if missing:
        errors.append(f"{cid} falta refs: {missing}")

if errors:
    print("\n".join(f"  ✗ {e}" for e in errors))
    sys.exit(1)

print("✓ Validaciones OK")
PYEOF

# Build
./00_build.sh

# Commit
git add 10_fuentes/data/bibliografia.json 10_fuentes/data/claims.json index.html
git commit -m "Batch lenguaje: 8 entradas + 11 ediciones refs + 1 claim nuevo

- Jing2023, Strouse2021, Massaroni2023, Nwachukwu2025, Yang2024,
  Martinot2021, GagoGalvagno2025, VerheijenSpooren2021
- Brushe2024 ya existía: solo agregada a refs
- Cobertura: lactante (2 celdas), primera-infancia (4+1 nuevo),
  preescolar (3 celdas), preadolescencia (1 reescritura)
- Divergencia explícita: claim nuevo en primera-infancia declara
  efecto nulo tras control de confusores (EDEN+ELFE)
- Preadolescencia[1]: reescritura Caso C (evidencia positiva ortografía)"
```

**NO pushear hasta validación visual del sitio.**
