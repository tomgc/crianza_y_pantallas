#!/usr/bin/env bash
# Build del sitio: ensambla index.html desde 10_fuentes/
# Uso: ./00_build.sh

set -euo pipefail

FUENTES="10_fuentes"
OUTPUT="index.html"
TEMPLATE="${FUENTES}/template.html"
STYLES="${FUENTES}/styles.css"
APP="${FUENTES}/app.js"
DATA_DIR="${FUENTES}/data"

# Validar fuentes mínimas
if [[ ! -f "${TEMPLATE}" ]]; then
  echo "ERROR: ${TEMPLATE} no existe" >&2
  exit 1
fi
if [[ ! -f "${STYLES}" ]]; then
  echo "ERROR: ${STYLES} no existe (Fase 2 debe haberlo creado)" >&2
  exit 1
fi

python3 <<'PYEOF' > "${OUTPUT}"
import os, json, glob

fuentes = "10_fuentes"
data_dir = os.path.join(fuentes, "data")

with open(os.path.join(fuentes, "template.html"), "r", encoding="utf-8") as f:
    tpl = f.read()

with open(os.path.join(fuentes, "styles.css"), "r", encoding="utf-8") as f:
    styles = f.read()

# Construir bloque DATA si hay archivos JSON
data_files = sorted(glob.glob(os.path.join(data_dir, "*.json")))
if data_files:
    parts = []
    for path in data_files:
        key = os.path.splitext(os.path.basename(path))[0]
        with open(path, "r", encoding="utf-8") as f:
            content = f.read().strip()
        parts.append(f'  "{key}": {content}')
    data_block = "window.__DATA__ = {\n" + ",\n".join(parts) + "\n};"
else:
    data_block = ""

# Construir bloque APP si existe app.js
app_path = os.path.join(fuentes, "app.js")
if os.path.isfile(app_path):
    with open(app_path, "r", encoding="utf-8") as f:
        app_block = f.read()
else:
    app_block = ""

tpl = tpl.replace("<!--INJECT_STYLES-->", styles)
tpl = tpl.replace("<!--INJECT_DATA-->", data_block)
tpl = tpl.replace("<!--INJECT_APP-->", app_block)
print(tpl, end="")
PYEOF

echo "Build OK: ${OUTPUT} ($(wc -l < ${OUTPUT}) líneas)"
