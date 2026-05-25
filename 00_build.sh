#!/usr/bin/env bash
# Build del sitio: ensambla index.html desde 10_fuentes/
# Uso: ./00_build.sh

set -euo pipefail

FUENTES="10_fuentes"
OUTPUT="index.html"
TEMPLATE="${FUENTES}/template.html"

# Validar que existan las fuentes mínimas
if [[ ! -f "${TEMPLATE}" ]]; then
  echo "ERROR: ${TEMPLATE} no existe" >&2
  exit 1
fi

# Fase 1: build trivial — copiar template tal cual.
# Fases 2+ van a inyectar styles, data y app aquí.
cp "${TEMPLATE}" "${OUTPUT}"

echo "Build OK: ${OUTPUT} ($(wc -l < ${OUTPUT}) líneas)"
