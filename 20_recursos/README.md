# Recursos — Descarga local de PDFs

Esta carpeta queda intencionalmente vacía en el repo. Los PDFs deben descargarse localmente porque algunos dominios bloquean acceso automatizado.

## Documentos a descargar

Desde la raíz del repo, ejecutar:

```bash
cd recursos

# CJE UC — Prácticas n°19 (pantallas en menores de 5 años)
curl -L -o cje_practicas_19_pantallas_menores_5.pdf \
  "https://centrojusticiaeducacional.uc.cl/wp-content/uploads/2023/04/PRACTICAS-n%C2%B019-linea-5.pdf"

# UNICEF Chile — Elementos socioculturales respecto al cuidado
curl -L -o unicef_chile_elementos_socioculturales.pdf \
  "https://www.unicef.org/chile/media/6436/file/Informe%20final%20Elementos%20socioculturales.pdf"

# CJE UC — Informe Ola 4 Mil Primeros Días
curl -L -o cje_informe_ola4_mil_primeros_dias.pdf \
  "https://centrojusticiaeducacional.uc.cl/wp-content/uploads/2024/07/Informe-Ola-4-jueves-06-junio-comprimido.pdf"
```

Los PDFs descargados quedan ignorados por git (ver `.gitignore` de esta carpeta).
