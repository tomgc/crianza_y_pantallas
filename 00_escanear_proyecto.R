# =============================================================================
# 00_escanear_proyecto.R
# -----------------------------------------------------------------------------
# Propósito: Generar snapshot de la estructura del proyecto.
#            Output dual: .txt para histórico local, .md para adjuntar a chat.
# Disparadores:
#   1. Al abrir sesión nueva.
#   2. Después de reorganizar estructura.
#   3. Antes de cerrar sesión.
#   4. Cuando un agente pierde referencia de dónde están los archivos.
# Output:
#   - 30_documentacion/estructura/YYYYMMDD_HHMMSS_estructura.txt
#   - 30_documentacion/estructura/YYYYMMDD_HHMMSS_estructura.md
#   - 30_documentacion/estructura/estructura_actual.txt   (alias al más reciente)
#   - 30_documentacion/estructura/estructura_actual.md    (alias al más reciente)
# Nota: Este proyecto usa 30_documentacion/ (no 50_documentacion/ como dice
#       POLITICA_PROYECTO.md). Ver Bug 4 del traspaso v04.
# =============================================================================

# ---- Auto-instalación -------------------------------------------------------
paquetes_requeridos <- c("fs", "rprojroot")
paquetes_faltantes <- paquetes_requeridos[
  !sapply(paquetes_requeridos, requireNamespace, quietly = TRUE)
]
if (length(paquetes_faltantes) > 0) install.packages(paquetes_faltantes)

library(fs)

# ---- Anclaje del root -------------------------------------------------------
ROOT <- rprojroot::find_root(
  criterion = rprojroot::is_git_root
)

# ---- Configuración ----------------------------------------------------------
EXCLUIR        <- c(".git", ".claude", "node_modules", ".Rproj.user", ".quarto")
INCLUIR_ARCHIVO <- FALSE  # Cambiar a TRUE para incluir _archivo/ en el escaneo.

# ---- Función: formatear tamaño legible --------------------------------------
formato_tamano <- function(bytes) {
  if (is.na(bytes) || bytes == 0) return("0B")
  unidades <- c("B", "K", "M", "G")
  exp <- min(floor(log(bytes, 1024)), length(unidades) - 1)
  sprintf("%.2f%s", bytes / (1024 ^ exp), unidades[exp + 1])
}

# ---- Función: construir árbol recursivo -------------------------------------
construir_arbol <- function(ruta_base, prefijo = "") {
  items <- dir_ls(ruta_base, all = FALSE)
  items <- items[!basename(items) %in% EXCLUIR]
  if (!INCLUIR_ARCHIVO) items <- items[basename(items) != "_archivo"]

  # Carpetas primero, luego archivos; alfabéticamente dentro de cada grupo.
  es_dir <- is_dir(items)
  items  <- c(sort(items[es_dir]), sort(items[!es_dir]))

  lineas <- character()
  for (item in items) {
    es_carpeta <- is_dir(item)
    nombre     <- basename(item)
    if (es_carpeta) nombre <- paste0(nombre, "/")

    if (es_carpeta) {
      lineas <- c(lineas, paste0(prefijo, "├── ", nombre))
      sub_lineas <- construir_arbol(item, paste0(prefijo, "│   "))
      lineas <- c(lineas, sub_lineas)
    } else {
      tamano <- formato_tamano(file_info(item)$size)
      lineas <- c(lineas, sprintf("%s├── %s    [%s]", prefijo, nombre, tamano))
    }
  }
  lineas
}

# ---- Función: conteo por extensión ------------------------------------------
conteo_extensiones <- function(ruta_base) {
  todos <- dir_ls(ruta_base, recurse = TRUE, type = "file", all = FALSE)
  todos <- todos[!grepl(paste(EXCLUIR, collapse = "|"), todos)]
  if (!INCLUIR_ARCHIVO) todos <- todos[!grepl("_archivo/", todos)]

  exts            <- tools::file_ext(todos)
  exts[exts == ""] <- "(sin extension)"
  sort(table(exts), decreasing = TRUE)
}

# ---- Función: generar contenido en formato dado -----------------------------
generar_contenido <- function(ruta_base, formato = "txt") {
  fecha      <- format(Sys.time(), "%Y-%m-%d %H:%M:%S")
  arbol      <- construir_arbol(ruta_base)
  extensiones <- conteo_extensiones(ruta_base)

  todos_archivos  <- dir_ls(ruta_base, recurse = TRUE, type = "file",      all = FALSE)
  todas_carpetas  <- dir_ls(ruta_base, recurse = TRUE, type = "directory", all = FALSE)
  todos_archivos  <- todos_archivos[!grepl(paste(EXCLUIR, collapse = "|"), todos_archivos)]
  todas_carpetas  <- todas_carpetas[!grepl(paste(EXCLUIR, collapse = "|"), todas_carpetas)]
  if (!INCLUIR_ARCHIVO) {
    todos_archivos <- todos_archivos[!grepl("_archivo/", todos_archivos)]
    todas_carpetas <- todas_carpetas[!grepl("_archivo",  todas_carpetas)]
  }

  if (formato == "md") {
    out <- c(
      "# Estructura del proyecto",
      "",
      paste0("- **Raiz:** `", ruta_base, "`"),
      paste0("- **Fecha:** ", fecha),
      paste0("- **Total:** ", length(todas_carpetas), " carpetas, ",
             length(todos_archivos), " archivos"),
      "",
      "## Arbol",
      "",
      "```",
      arbol,
      "```",
      "",
      "## Conteo por extension",
      "",
      "| Extension | Cantidad |",
      "|-----------|----------|"
    )
    for (i in seq_along(extensiones)) {
      out <- c(out, sprintf("| `.%s` | %d |", names(extensiones)[i], extensiones[i]))
    }
  } else {
    out <- c(
      strrep("=", 60),
      " ESTRUCTURA DEL PROYECTO",
      paste0(" Raiz: ", ruta_base),
      paste0(" Fecha: ", fecha),
      paste0(" Total: ", length(todas_carpetas), " carpetas, ",
             length(todos_archivos), " archivos"),
      strrep("=", 60),
      "",
      arbol,
      "",
      strrep("=", 60),
      " CONTEO POR EXTENSION",
      strrep("=", 60),
      ""
    )
    for (i in seq_along(extensiones)) {
      out <- c(out, sprintf("  .%-15s %3d", names(extensiones)[i], extensiones[i]))
    }
  }
  out
}

# ---- Ejecución principal ----------------------------------------------------
ejecutar_escaneo <- function() {
  carpeta_destino <- path(ROOT, "30_documentacion", "estructura")
  dir_create(carpeta_destino)

  ts <- format(Sys.time(), "%Y%m%d_%H%M%S")

  for (fmt in c("txt", "md")) {
    contenido <- generar_contenido(ROOT, formato = fmt)

    archivo_snapshot <- path(carpeta_destino,
                             sprintf("%s_estructura.%s", ts, fmt))
    writeLines(contenido, archivo_snapshot, useBytes = TRUE)

    archivo_actual <- path(carpeta_destino,
                           sprintf("estructura_actual.%s", fmt))
    writeLines(contenido, archivo_actual, useBytes = TRUE)

    cat(sprintf("  Generado: %s\n", archivo_snapshot))
    cat(sprintf("  Generado: %s\n", archivo_actual))
  }

  invisible(TRUE)
}

# Ejecutar al hacer source().
ejecutar_escaneo()
