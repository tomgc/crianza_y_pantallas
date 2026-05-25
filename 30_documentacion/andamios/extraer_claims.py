#!/usr/bin/env python3
"""
Extrae el objeto JS `cells` desde /tmp/index_viejo.html (commit 130d637)
y genera 10_fuentes/data/claims.json estructurado.

Andamio de Sub-fase 3.6 del refactor. Se conserva como registro histórico
pero NO se vuelve a ejecutar después de la migración inicial: a partir de
Fase 3 los claims viven en claims.json y se editan ahí directamente.

Schema por celda:
    {
      "summary": str,
      "certainty": "high" | "medium" | "low",
      "intro": str,                     # markdown ligero
      "claims": [
        { "certainty": str, "text": str, "refs": [str] }
      ],
      "definitions": [                  # opcional, solo si la celda tiene <div class="def">
        { "term": str, "body": str }
      ],
      "featured_studies": [             # opcional, solo si la celda tiene <div class="study">
        { "title": str, "meta": str, "body": str, "refs": [str] }
      ],
      "chile_note": str,                # opcional, solo si la celda tiene <div class="chile-note">
      "andamiaje": {
        "upstream":   [ { "to": str, "certainty": str, "text": str } ],
        "downstream": [ { "to": str, "certainty": str, "text": str } ]
      }
    }

Uso:
    python3 30_documentacion/andamios/extraer_claims.py

Lee:   /tmp/index_viejo.html
Escribe: 10_fuentes/data/claims.json
"""

import json
import re
import sys
from pathlib import Path

SOURCE = "/tmp/index_viejo.html"
OUTPUT = "10_fuentes/data/claims.json"

# Rango de líneas del objeto `cells` en el HTML viejo (Sub-fase 3.1 reconnaissance)
CELLS_START_LINE = 1021  # `const cells = {`
CELLS_END_LINE = 1882    # línea anterior a `function el`


# ===========================================================================
# Splitter de celdas
# ===========================================================================

CELL_HEADER_RE = re.compile(r"^  '([\w-]+)': \{\s*$", re.MULTILINE)
CELL_CLOSER_RE = re.compile(r"^  \},?\s*$", re.MULTILINE)


def read_cells_block(path):
    with open(path, encoding="utf-8") as f:
        lines = f.readlines()
    return "".join(lines[CELLS_START_LINE - 1:CELLS_END_LINE])


def split_cells(block):
    cells = {}
    headers = list(CELL_HEADER_RE.finditer(block))
    for h in headers:
        cell_id = h.group(1)
        body_start = h.end()
        closer = CELL_CLOSER_RE.search(block, body_start)
        if not closer:
            raise ValueError(f"No se encontró closer para celda {cell_id}")
        cells[cell_id] = block[body_start:closer.start()]
    return cells


# ===========================================================================
# Extracción de campos top-level de cada celda
# ===========================================================================

SUMMARY_RE = re.compile(r"^\s*summary:\s*'((?:[^'\\]|\\.)*)'", re.MULTILINE)
CERTAINTY_RE = re.compile(r"^\s*certainty:\s*'(\w+)'", re.MULTILINE)
CONTENT_RE = re.compile(r"content:\s*`([^`]*)`", re.DOTALL)
UPSTREAM_RE = re.compile(r"upstream:\s*(\[[^\]]*?\])", re.DOTALL)
DOWNSTREAM_RE = re.compile(r"downstream:\s*(\[[^\]]*?\])", re.DOTALL)


def unescape_js_string(s):
    return (s.replace("\\'", "'")
             .replace('\\"', '"')
             .replace("\\n", "\n")
             .replace("\\t", "\t")
             .replace("\\\\", "\\"))


ARRAY_ITEM_RE = re.compile(
    r"\{\s*"
    r"to:\s*'((?:[^'\\]|\\.)*)',\s*"
    r"certainty:\s*'(\w+)',\s*"
    r"text:\s*'((?:[^'\\]|\\.)*)'\s*"
    r"\}",
    re.DOTALL
)


def parse_array_of_links(arr_text):
    if arr_text.strip() == "[]":
        return []
    items = []
    for m in ARRAY_ITEM_RE.finditer(arr_text):
        items.append({
            "to": unescape_js_string(m.group(1)),
            "certainty": m.group(2),
            "text": unescape_js_string(m.group(3)),
        })
    return items


# ===========================================================================
# Helpers de HTML/markdown
# ===========================================================================

C_CALL_RE = re.compile(
    r"\$\{\s*C\(\s*'(\w+)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\)\s*\}",
    re.DOTALL
)

P_RE = re.compile(r"<p>(.*?)</p>", re.DOTALL)
CHILE_NOTE_RE = re.compile(r'<div\s+class="chile-note">(.*?)</div>', re.DOTALL)
CHILE_LABEL_RE = re.compile(r"\s*<strong>\s*Contexto chileno\.\s*</strong>\s*")
CITE_RE = re.compile(r'<a\s+class="cite"\s+href="#bib-([\w-]+)">\[ref\]</a>')

# Para detectar bloques no manejados después de remover los conocidos
DIV_CLASS_RE = re.compile(r'<div\s+class="([\w-]+)"')
ANY_TAG_RE = re.compile(r"<(\w+)(?:\s[^>]*)?/?>")
HANDLED_TAGS = {"p", "strong", "em", "a", "br", "span"}  # span sale en def-term


def html_to_md(text):
    text = re.sub(r"<strong>(.*?)</strong>", r"**\1**", text, flags=re.DOTALL)
    text = re.sub(r"<em>(.*?)</em>", r"*\1*", text, flags=re.DOTALL)
    text = text.replace("&amp;", "&")
    return text


def extract_refs_and_clean(text):
    refs = []
    def collect(m):
        refs.append(m.group(1))
        return ""
    cleaned = CITE_RE.sub(collect, text)
    cleaned = re.sub(r" +([.,;:!?])", r"\1", cleaned)
    cleaned = re.sub(r"  +", " ", cleaned)
    return cleaned, refs


# ===========================================================================
# Extracción depth-aware de <div class="X">...</div>
# ===========================================================================

def extract_blocks(text, class_name):
    """
    Encuentra todos los <div class="X">...</div> respetando anidación,
    los remueve del texto y devuelve (texto_sin_bloques, [inner_html, ...]).

    Maneja correctamente el caso de <div class="study"> que contiene
    <div class="study-title"> y <div class="study-meta"> anidados.
    """
    open_pattern = re.compile(r'<div\s+class="' + re.escape(class_name) + r'"\s*>')
    out_parts = []
    extracted = []
    pos = 0
    while pos < len(text):
        m = open_pattern.search(text, pos)
        if not m:
            out_parts.append(text[pos:])
            break
        out_parts.append(text[pos:m.start()])
        # Avanzar hasta el </div> que cierra este open, contando depth
        depth = 1
        i = m.end()
        body_start = i
        while i < len(text) and depth > 0:
            next_open = text.find('<div', i)
            next_close = text.find('</div>', i)
            if next_close == -1:
                # Malformado: aborto, mantengo el resto sin tocar
                out_parts.append(text[m.start():])
                return ''.join(out_parts), extracted
            if next_open != -1 and next_open < next_close:
                depth += 1
                i = next_open + 4
            else:
                depth -= 1
                if depth == 0:
                    extracted.append(text[body_start:next_close])
                    pos = next_close + 6  # len('</div>')
                    break
                i = next_close + 6
    return ''.join(out_parts), extracted


def parse_definition(inner_html):
    """Parse '<span class="def-term">TERM</span>: BODY' a {term, body}."""
    m = re.match(
        r'\s*<span\s+class="def-term">(.*?)</span>\s*:\s*(.*)',
        inner_html,
        re.DOTALL
    )
    if not m:
        return None
    term = html_to_md(m.group(1)).strip()
    body_md = html_to_md(m.group(2))
    body_clean, _ = extract_refs_and_clean(body_md)
    return {"term": term, "body": body_clean.strip()}


STUDY_TITLE_RE = re.compile(r'<div\s+class="study-title">(.*?)</div>', re.DOTALL)
STUDY_META_RE = re.compile(r'<div\s+class="study-meta">(.*?)</div>', re.DOTALL)


def parse_study(inner_html):
    """
    Parse contenido interno de <div class="study">. Estructura típica:
      <div class="study-title">T</div>
      <div class="study-meta">M</div>
      <p>BODY</p>
    Devuelve {title, meta, body, refs}.
    """
    title_m = STUDY_TITLE_RE.search(inner_html)
    meta_m = STUDY_META_RE.search(inner_html)
    title = html_to_md(title_m.group(1)).strip() if title_m else ""
    meta = html_to_md(meta_m.group(1)).strip() if meta_m else ""

    # Body: TODOS los <p> dentro de inner_html (pero NO los que estén dentro de
    # study-title/study-meta, que no usan <p> de todas formas).
    body_parts = []
    all_refs = []
    for m in P_RE.finditer(inner_html):
        raw = m.group(1)
        md = html_to_md(raw)
        clean, refs = extract_refs_and_clean(md)
        body_parts.append(clean.strip())
        all_refs.extend(refs)
    body = "\n\n".join(body_parts)
    return {"title": title, "meta": meta, "body": body, "refs": all_refs}


# ===========================================================================
# Procesado del campo `content` (lógica principal)
# ===========================================================================

def process_content(content, cell_id, unhandled_log):
    """
    Procesa el campo content de una celda y devuelve dict con:
      intro, claims, [definitions], [featured_studies], [chile_note]
    Los campos opcionales solo aparecen si tienen contenido.
    """
    content_after = content

    # 1) Extraer featured_studies primero (los más anidados, pueden contener <p>)
    content_after, study_inners = extract_blocks(content_after, "study")
    featured_studies = [parse_study(inner) for inner in study_inners]

    # 2) Extraer definitions
    content_after, def_inners = extract_blocks(content_after, "def")
    definitions = [parse_definition(inner) for inner in def_inners]
    definitions = [d for d in definitions if d is not None]

    # 3) Extraer chile_note
    chile_note = None
    chile_match = CHILE_NOTE_RE.search(content_after)
    if chile_match:
        raw = chile_match.group(1)
        raw = CHILE_LABEL_RE.sub("", raw, count=1)
        md = html_to_md(raw)
        md, _ = extract_refs_and_clean(md)
        chile_note = md.strip()
        content_after = content_after[:chile_match.start()] + content_after[chile_match.end():]

    # 4) Después de remover todos los bloques conocidos, detectar lo no manejado
    remaining_divs = DIV_CLASS_RE.findall(content_after)
    found_tags = set(ANY_TAG_RE.findall(content_after))
    unexpected_tags = found_tags - HANDLED_TAGS
    if remaining_divs or unexpected_tags:
        unhandled_log.append({
            "cell_id": cell_id,
            "div_classes_extra": sorted(set(remaining_divs)),
            "tags_extra": sorted(unexpected_tags),
        })

    # 5) Localizar ${C(...)} y separar intro / claims
    c_matches = list(C_CALL_RE.finditer(content_after))
    intro_region = content_after[:c_matches[0].start()] if c_matches else content_after

    paragraphs = []
    for m in P_RE.finditer(intro_region):
        para = html_to_md(m.group(1)).strip()
        para, _ = extract_refs_and_clean(para)
        paragraphs.append(para.strip())
    intro = "\n\n".join(paragraphs)

    claims = []
    for m in c_matches:
        certainty = m.group(1)
        raw_text = unescape_js_string(m.group(2))
        md = html_to_md(raw_text)
        clean, refs = extract_refs_and_clean(md)
        claims.append({
            "certainty": certainty,
            "text": clean.strip(),
            "refs": refs,
        })

    # 6) Ensamblar resultado, omitiendo campos opcionales vacíos
    result = {"intro": intro, "claims": claims}
    if definitions:
        result["definitions"] = definitions
    if featured_studies:
        result["featured_studies"] = featured_studies
    if chile_note:
        result["chile_note"] = chile_note
    return result


# ===========================================================================
# Main
# ===========================================================================

def main():
    block = read_cells_block(SOURCE)
    cells_raw = split_cells(block)

    print(f"Celdas detectadas en el bloque: {len(cells_raw)}", file=sys.stderr)

    claims_data = {}
    unhandled_log = []

    for cell_id, body in cells_raw.items():
        summary_m = SUMMARY_RE.search(body)
        certainty_m = CERTAINTY_RE.search(body)
        content_m = CONTENT_RE.search(body)

        if not (summary_m and certainty_m and content_m):
            print(f"WARN: celda {cell_id} sin campos básicos completos", file=sys.stderr)
            continue

        summary = unescape_js_string(summary_m.group(1))
        certainty = certainty_m.group(1)
        content = content_m.group(1)

        processed = process_content(content, cell_id, unhandled_log)

        upstream_m = UPSTREAM_RE.search(body)
        downstream_m = DOWNSTREAM_RE.search(body)
        upstream = parse_array_of_links(upstream_m.group(1)) if upstream_m else []
        downstream = parse_array_of_links(downstream_m.group(1)) if downstream_m else []

        # Ensamblar la celda final preservando orden de campos
        cell_data = {
            "summary": summary,
            "certainty": certainty,
            "intro": processed["intro"],
            "claims": processed["claims"],
        }
        if "definitions" in processed:
            cell_data["definitions"] = processed["definitions"]
        if "featured_studies" in processed:
            cell_data["featured_studies"] = processed["featured_studies"]
        if "chile_note" in processed:
            cell_data["chile_note"] = processed["chile_note"]
        cell_data["andamiaje"] = {
            "upstream": upstream,
            "downstream": downstream,
        }
        claims_data[cell_id] = cell_data

    out_path = Path(OUTPUT)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(claims_data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )

    # Reporte
    total = len(claims_data)
    with_chile = sum(1 for c in claims_data.values() if "chile_note" in c)
    with_defs = sum(1 for c in claims_data.values() if "definitions" in c)
    with_studies = sum(1 for c in claims_data.values() if "featured_studies" in c)
    total_claims = sum(len(c["claims"]) for c in claims_data.values())
    total_defs = sum(len(c.get("definitions", [])) for c in claims_data.values())
    total_studies = sum(len(c.get("featured_studies", [])) for c in claims_data.values())

    refs_claims = set()
    refs_studies = set()
    for c in claims_data.values():
        for cl in c["claims"]:
            refs_claims.update(cl["refs"])
        for s in c.get("featured_studies", []):
            refs_studies.update(s["refs"])

    all_refs = refs_claims | refs_studies

    print()
    print("=" * 60)
    print("REPORTE DE EXTRACCIÓN")
    print("=" * 60)
    print(f"Total celdas: {total}")
    print(f"  con chile_note:       {with_chile}")
    print(f"  con definitions:      {with_defs}")
    print(f"  con featured_studies: {with_studies}")
    print(f"Total claims: {total_claims}")
    print(f"Total definitions extraídos: {total_defs}")
    print(f"Total featured_studies extraídos: {total_studies}")
    print(f"Refs únicas en claims: {len(refs_claims)}")
    print(f"Refs únicas en featured_studies: {len(refs_studies)}")
    print(f"Refs únicas totales (unión): {len(all_refs)}")
    print(f"Refs (claims): {sorted(refs_claims)}")
    print(f"Refs (studies): {sorted(refs_studies)}")
    print()
    if unhandled_log:
        print("ESTRUCTURAS NO MANEJADAS (revisar):")
        for entry in unhandled_log:
            print(f"  {entry['cell_id']}:")
            if entry["div_classes_extra"]:
                print(f"    divs extra: {entry['div_classes_extra']}")
            if entry["tags_extra"]:
                print(f"    tags extra: {entry['tags_extra']}")
    else:
        print("Sin estructuras no manejadas.")
    print(f"\nOutput escrito en: {OUTPUT}")


if __name__ == "__main__":
    main()
