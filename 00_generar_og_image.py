#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# =============================================================================
# 00_generar_og_image.py
# -----------------------------------------------------------------------------
# Genera la og-image (1200x630) de Crianza y Pantallas.
# Lee metadata.json (dimensiones + tramos) y claims.json (certeza por celda),
# construye assets/og-image.html (panel de marca + mini-matriz 15x5 con las 4
# bandas de bloque de D-visual y la certeza REAL de cada celda) y la renderiza
# a assets/og-image.png con Chrome headless.
#
# Uso:  python3 00_generar_og_image.py
# Re-ejecutar tras cambios en la matriz (dimensiones, tramos o certezas).
# El og:image del template ya apunta a assets/og-image.png; es asset estatico
# (no pasa por ./00_build.sh).
# =============================================================================
import json, os, subprocess, sys
from pathlib import Path

ROOT   = Path(__file__).resolve().parent
META   = ROOT / "10_fuentes/data/metadata.json"
CLAIMS = ROOT / "10_fuentes/data/claims.json"
HTML   = ROOT / "assets/og-image.html"
PNG    = ROOT / "assets/og-image.png"

# dim -> bloque tematico (replica DIM_BLOCKS de app.js)
BLOCK = {
    "lenguaje": "cog", "cognicion": "cog", "creatividad": "cog",
    "socioemocional": "soc", "comportamiento": "soc", "vinculo": "soc", "co-regulacion": "soc",
    "alfabetizacion": "dig", "privacidad": "dig", "cyberbullying": "dig",
    "salud-mental": "bie", "sueno": "bie", "fisica": "bie", "alimentacion": "bie", "vision": "bie",
}

CSS = """*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{display:flex;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#fff;overflow:hidden}
.left{width:728px;height:630px;padding:0 0 0 80px;display:flex;flex-direction:column;justify-content:center;background:#fff}
.rule{width:50px;height:6px;background:#042f4d;border-radius:3px;margin-bottom:30px}
.title{font-size:92px;line-height:1.0;font-weight:800;color:#042f4d;letter-spacing:-1.5px}
.subtitle{font-size:29px;color:#6a7280;margin-top:26px}
.spacer{height:44px}
.cert{font-size:15px;color:#6a7280;font-weight:700;letter-spacing:2px}
.legend{display:flex;gap:36px;align-items:center;margin-top:18px;font-size:24px;color:#1a1d24}
.legend span{display:flex;align-items:center;gap:11px}
.url{font-size:19px;color:#6a7280;margin-top:36px}
.dot{width:22px;height:22px;border-radius:50%;display:inline-block;box-sizing:border-box}
.high{background:#042f4d}
.medium{background:linear-gradient(90deg,#5c728e 50%,transparent 50%);border:2px solid #5c728e}
.low{background:#d6dfe8;border:1.5px solid #5c728e}
.right{width:472px;height:630px;background:#f0f2f5;display:flex;align-items:center;justify-content:center}
.grid{border:1px solid #042f4d;background:#fff}
.row{display:grid;grid-template-columns:repeat(5,1fr)}
.cog{background:#eef4fb}.soc{background:#f0f7f0}.dig{background:#f5f0fb}.bie{background:#fdf4ee}
.cell{width:66px;height:29px;display:flex;align-items:center;justify-content:center;border-right:1px solid #d4dce4;border-bottom:1px solid #d4dce4}
.cell .dot{width:14px;height:14px;border-width:1.5px}"""


def build_html():
    meta = json.loads(META.read_text(encoding="utf-8"))
    claims = json.loads(CLAIMS.read_text(encoding="utf-8"))
    ages = [g["id"] for g in meta["ageGroups"]]
    dims = [d["id"] for d in meta["dimensions"]]
    rows = ""
    for d in dims:
        cells = ""
        for ag in ages:
            cell = claims.get(f"{d}-{ag}", {})
            cert = (cell.get("certainty", "") if cell.get("claims") else "empty") or "empty"
            dot = "" if cert == "empty" else f'<i class="dot {cert}"></i>'
            cells += f'<div class="cell">{dot}</div>'
        rows += f'\n      <div class="row {BLOCK.get(d, "cog")}">{cells}</div>'
    return (
        '<!doctype html><html lang="es"><head><meta charset="utf-8"><style>\n'
        + CSS +
        '\n</style></head><body>\n'
        '  <div class="left">\n'
        '    <div class="rule"></div>\n'
        '    <div class="title">Crianza<br>y Pantallas</div>\n'
        '    <div class="subtitle">Matriz de evidencia sobre crianza y pantallas</div>\n'
        '    <div class="spacer"></div>\n'
        '    <div class="cert">CERTEZA DE LA EVIDENCIA</div>\n'
        '    <div class="legend">\n'
        '      <span><i class="dot high"></i>Alta</span>\n'
        '      <span><i class="dot medium"></i>Media</span>\n'
        '      <span><i class="dot low"></i>Baja</span>\n'
        '    </div>\n'
        '    <div class="url">tomgc.github.io/crianza_y_pantallas</div>\n'
        '  </div>\n'
        '  <div class="right"><div class="grid">' + rows + '\n      </div></div>\n'
        '</body></html>\n'
    )


def find_chrome():
    for c in [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ]:
        if os.path.exists(c):
            return c
    sys.exit("✗ No se encontró Chrome/Chromium/Edge para renderizar la og-image.")


def main():
    HTML.write_text(build_html(), encoding="utf-8")
    print(f"✓ {HTML.relative_to(ROOT)} generado")
    chrome = find_chrome()
    subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=1", "--window-size=1200,630",
         f"--screenshot={PNG}", f"file://{HTML}"],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    print(f"✓ {PNG.relative_to(ROOT)} renderizado (1200x630)")


if __name__ == "__main__":
    main()
