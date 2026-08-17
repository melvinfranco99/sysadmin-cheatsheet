# Sysadmin Cheatsheet

Web de referencia rápida para técnico informático (ASIR): comandos Windows y Linux, redes y wifi, ciberseguridad, discos y archivos, compartición de datos, servidores, Active Directory, configuración estándar de router/switch, y guías de uso de las herramientas del pendrive Ventoy (Clonezilla, CAINE, Kali, Linux Mint, Parrot OS, Tails, Ubuntu, Windows 11, OPNsense, SystemRescue, GParted, BlackArch, HBCD PE...).

Sitio estático sin dependencias externas, con buscador y filtros por categoría. Publicado con GitHub Pages.

## Estructura

```
index.html
assets/css/style.css      # estilos
assets/js/app.js          # buscador y render de la interfaz
assets/js/data/*.js       # contenido, un fichero por categoría
```

## Añadir o editar contenido

Cada entrada vive en `assets/js/data/<categoria>.js` con esta forma:

```js
{
  id: "identificador-unico",
  title: "Título de la entrada",
  category: "windows", // debe coincidir con una categoría de app.js
  subcategory: "Redes",
  tags: ["palabra", "clave"],
  description: "Descripción breve.",
  gui: ["Paso 1...", "Paso 2..."],          // opcional
  cli: [{ os: "Windows (CMD)", commands: [{ cmd: "...", explain: "..." }] }], // opcional
  notes: "Aviso o aclaración adicional."     // opcional
}
```

## Desarrollo local

Al usar módulos ES (`type="module"`), abrir `index.html` directamente con `file://` no funciona en todos los navegadores. Levantar un servidor estático simple:

```bash
python -m http.server 8000
```

y abrir `http://localhost:8000`.
