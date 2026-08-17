export const herramientasData = [
  {
    id: "tool-ventoy",
    title: "Ventoy (el propio pendrive multiarranque)",
    category: "herramientas",
    subcategory: "Pendrive",
    tags: ["ventoy", "pendrive", "multiboot", "iso"],
    description: "Herramienta que convierte un pendrive en un menú de arranque múltiple: basta con copiar archivos .iso a la unidad, sin necesidad de volver a grabar nada.",
    gui: [
      "Al arrancar desde el pendrive aparece un menú con todas las ISOs presentes en la unidad: seleccionar con las flechas y Enter.",
      "Para añadir una herramienta nueva: montar el pendrive en un PC ya arrancado con Windows/Linux y simplemente copiar el fichero .iso a la raíz (o subcarpetas) de la partición Ventoy.",
      "Para actualizar Ventoy: ejecutar el instalador de la nueva versión sobre el mismo pendrive (mantiene las ISOs existentes)."
    ],
    notes: "Ventoy no borra las ISOs al usarlas: se puede tener decenas de sistemas distintos en el mismo pendrive. Comprobar siempre el hash SHA256 de cada ISO descargada antes de copiarla (ver ficha 'Verificar integridad de ficheros')."
  },
  {
    id: "tool-clonezilla",
    title: "Clonezilla — Clonado y backup de discos",
    category: "herramientas",
    subcategory: "Backup / Clonado",
    tags: ["clonezilla", "clonar", "backup", "imagen de disco"],
    description: "Herramienta de referencia para clonar un disco a otro o crear/restaurar imágenes completas de un equipo. Uso típico: preparar equipos idénticos en serie, o hacer backup completo antes de una intervención de riesgo.",
    gui: [
      "1. Arrancar desde el pendrive Ventoy y elegir Clonezilla > modo 'Clonezilla live'.",
      "2. Elegir idioma y teclado, y 'Start Clonezilla'.",
      "3. Elegir 'device-image' (disco ↔ fichero de imagen, lo más habitual) o 'device-device' (clonar directamente disco a disco).",
      "4. Para device-image: indicar dónde guardar/leer la imagen (disco USB externo, recurso de red SSH/Samba/NFS).",
      "5. Elegir 'savedisk' (crear imagen del disco de origen) o 'restoredisk' (restaurar una imagen sobre un disco).",
      "6. Seleccionar el disco origen/destino según el modo, confirmar y esperar (usa compresión y solo copia bloques usados, por lo que suele ser más rápido que 'dd')."
    ],
    notes: "Muy usado para dejar 'imágenes maestras' de un equipo tipo (ej. el PC estándar de un departamento) y desplegarlas rápido en varios equipos nuevos."
  },
  {
    id: "tool-caine",
    title: "CAINE — Informática forense",
    category: "herramientas",
    subcategory: "Forense / Seguridad",
    tags: ["caine", "forense", "peritaje", "evidencias"],
    description: "Distribución Linux orientada a análisis forense digital: permite examinar discos y sistemas sin alterar la evidencia (modo de solo lectura por defecto en los discos conectados).",
    gui: [
      "Al arrancar, CAINE monta los discos internos en modo solo lectura por defecto (protección de la evidencia): comprobar el icono de 'Read Only' antes de tocar nada.",
      "Incluye herramientas gráficas como Autopsy (análisis de imágenes forenses) y PhotoRec (recuperación de archivos borrados)."
    ],
    notes: "Usar SIEMPRE en modo solo lectura cuando se analiza un disco que pueda ser evidencia (incidente de seguridad, despido conflictivo, etc.), y trabajar sobre una copia/imagen del disco, nunca sobre el original directamente."
  },
  {
    id: "tool-kali",
    title: "Kali Linux — Auditoría y pentesting",
    category: "herramientas",
    subcategory: "Forense / Seguridad",
    tags: ["kali", "pentesting", "auditoría", "seguridad ofensiva"],
    description: "Distribución especializada en auditoría de seguridad y pentesting, con cientos de herramientas preinstaladas (Nmap, Wireshark, Metasploit, Burp Suite, Aircrack-ng...). Usar exclusivamente en redes/sistemas propios o con autorización explícita.",
    gui: [
      "Menú de aplicaciones organizado por categorías (Information Gathering, Vulnerability Analysis, Exploitation Tools, etc.).",
      "Terminal preconfigurada con las rutas de las herramientas ya en el PATH."
    ],
    cli: [
      {
        os: "Kali Linux",
        commands: [
          { cmd: "sudo nmap -sV 192.168.1.0/24", explain: "Descubre equipos y servicios en la red (ver también la ficha de Ciberseguridad > Nmap)." },
          { cmd: "sudo apt update && sudo apt full-upgrade -y", explain: "Mantener Kali actualizado, especialmente antes de una auditoría, para tener las últimas firmas/exploits." }
        ]
      }
    ],
    notes: "Documentar siempre el alcance autorizado por escrito antes de cualquier prueba de intrusión, incluso en redes propias de la empresa."
  },
  {
    id: "tool-blackarch",
    title: "BlackArch — Seguridad ofensiva (basado en Arch)",
    category: "herramientas",
    subcategory: "Forense / Seguridad",
    tags: ["blackarch", "pentesting", "arch linux", "seguridad ofensiva"],
    description: "Distribución de seguridad basada en Arch Linux, con un repositorio muy extenso de herramientas de pentesting (alternativa a Kali, más minimalista y personalizable). Igualmente, uso restringido a entornos autorizados.",
    cli: [
      {
        os: "BlackArch (pacman)",
        commands: [
          { cmd: "sudo pacman -Syu", explain: "Actualiza el sistema completo (Arch es rolling release, conviene actualizar a menudo)." },
          { cmd: "sudo pacman -S blackarch-scanner", explain: "Instala un grupo completo de herramientas de escaneo (los paquetes están agrupados por categoría, ej. blackarch-webapp, blackarch-wireless...)." }
        ]
      }
    ],
    notes: "Requiere más conocimiento previo de Arch/pacman que Kali; recomendable para quien ya se sienta cómodo en Arch Linux."
  },
  {
    id: "tool-tails",
    title: "Tails — Sistema amnésico centrado en privacidad",
    category: "herramientas",
    subcategory: "Forense / Seguridad",
    tags: ["tails", "privacidad", "anonimato", "tor"],
    description: "Sistema live que no deja ningún rastro en el equipo (no usa el disco duro salvo que se le indique expresamente) y enruta todo el tráfico de red a través de Tor. Útil para navegación/investigación sensible sin dejar huella en el equipo anfitrión.",
    gui: [
      "Al arrancar, elegir si se usa 'Persistent Storage' (almacenamiento persistente cifrado, opcional, se configura la primera vez) o sesión completamente amnésica.",
      "Todo el tráfico de red pasa automáticamente por Tor; hay un indicador en la parte superior que muestra el estado de la conexión Tor.",
      "Al apagar el equipo, Tails borra de forma segura la RAM para no dejar rastros."
    ],
    notes: "No instalar software adicional de forma persistente salvo que sea imprescindible: cuanto menos se modifique, más se preserva el objetivo de anonimato del sistema."
  },
  {
    id: "tool-mint",
    title: "Linux Mint — Escritorio de uso general",
    category: "herramientas",
    subcategory: "Sistemas operativos",
    tags: ["linux mint", "escritorio", "cinnamon", "usuario final"],
    description: "Distribución basada en Ubuntu orientada a uso de escritorio, muy amigable para migrar usuarios desde Windows (menú Inicio clásico con Cinnamon).",
    gui: [
      "Modo live (sin instalar) disponible directamente desde el menú de arranque para probar hardware o rescatar archivos.",
      "Icono 'Install Linux Mint' en el escritorio live para lanzar el instalador gráfico completo.",
      "Gestor de actualizaciones y Gestor de software (Software Manager) con interfaz simplificada, ideal para usuarios no técnicos."
    ],
    notes: "Buena opción cuando hay que dar una segunda vida a equipos antiguos con Windows no soportado, o para usuarios que solo necesitan navegador, ofimática y correo."
  },
  {
    id: "tool-ubuntu",
    title: "Ubuntu — Servidor y escritorio de referencia",
    category: "herramientas",
    subcategory: "Sistemas operativos",
    tags: ["ubuntu", "servidor", "escritorio", "lts"],
    description: "Distribución Linux más extendida en entornos profesionales, tanto para escritorio como para servidor (ver también las fichas de Linux, Servidores y Compartir datos para comandos concretos).",
    gui: [
      "Modo live para probar el sistema o rescatar datos antes de instalar.",
      "Instalador Ubivity/Subiquity: elegir instalación normal o mínima, y si se cifra el disco con LVM+LUKS."
    ],
    notes: "Priorizar siempre las versiones LTS (Long Term Support, con soporte de 5 años) para servidores y equipos de producción, frente a las versiones intermedias de 9 meses."
  },
  {
    id: "tool-parrot",
    title: "Parrot OS — Seguridad y privacidad",
    category: "herramientas",
    subcategory: "Forense / Seguridad",
    tags: ["parrot", "pentesting", "privacidad", "seguridad"],
    description: "Distribución similar a Kali (comparte gran parte del catálogo de herramientas de seguridad) pero con un enfoque adicional en privacidad y menor consumo de recursos, con un modo 'Home' para uso general y un modo 'Security' con las herramientas de auditoría.",
    gui: [
      "Al arrancar puede elegirse entre el modo Security (herramientas de pentesting) y un escritorio más ligero para uso general.",
      "Incluye AnonSurf para enrutar el tráfico del sistema a través de Tor de forma sencilla."
    ]
  },
  {
    id: "tool-win11",
    title: "Windows 11 — Instalación y reparación",
    category: "herramientas",
    subcategory: "Sistemas operativos",
    tags: ["windows 11", "instalación", "reparación", "reset"],
    description: "Medio de instalación/reparación de Windows 11 para reinstalaciones limpias, reparaciones o actualizaciones in situ.",
    gui: [
      "Instalación limpia: arrancar desde el pendrive, elegir idioma/teclado, 'Instalar ahora', introducir clave (o 'No tengo clave de producto' para activar después) y elegir 'Personalizada' para particionar el disco a mano.",
      "Reparación sin perder datos: desde un Windows ya arrancado, montar la ISO y ejecutar setup.exe eligiendo 'Conservar archivos y aplicaciones' (actualización in situ, repara instalaciones corruptas)."
    ],
    cli: [
      {
        os: "Símbolo del sistema de recuperación (WinRE, tras arrancar desde el pendrive > Reparar el equipo)",
        commands: [
          { cmd: "bootrec /fixmbr", explain: "Repara el registro de arranque maestro (MBR) cuando el equipo no arranca." },
          { cmd: "bootrec /fixboot", explain: "Repara el sector de arranque de la partición del sistema." },
          { cmd: "bootrec /rebuildbcd", explain: "Reconstruye la base de datos de arranque (BCD) escaneando instalaciones de Windows existentes." },
          { cmd: "sfc /scannow", explain: "Se puede lanzar también desde el entorno de recuperación offline apuntando a la unidad correcta con /offbootdir y /offwindir." }
        ]
      }
    ],
    notes: "Requisito TPM 2.0 y Secure Boot: si el equipo antiguo no cumple requisitos, existe la opción de saltarlos editando el registro durante la instalación (bypass no soportado oficialmente por Microsoft, usar con criterio)."
  },
  {
    id: "tool-opnsense",
    title: "OPNsense — Firewall / router avanzado",
    category: "herramientas",
    subcategory: "Redes / Firewall",
    tags: ["opnsense", "firewall", "router", "pfsense"],
    description: "Sistema operativo de firewall/router de nivel profesional (basado en FreeBSD), útil para montar un firewall perimetral avanzado, VPN, balanceo de líneas o laboratorio de pruebas de red.",
    gui: [
      "Tras la instalación, la gestión se hace por navegador web (https://IP-del-equipo) desde otro PC en la misma red.",
      "Asistente inicial: configurar interfaz WAN (hacia Internet/ISP) y LAN (hacia la red interna) desde la consola del propio equipo la primera vez.",
      "Panel web: Interfaces para asignar interfaces físicas, Firewall > Rules para las reglas de tráfico, VPN para IPsec/OpenWireGuard, Services para DHCP/DNS integrados."
    ],
    cli: [
      {
        os: "Consola OPNsense (menú de texto en el propio equipo)",
        commands: [
          { cmd: "Opción 1) Assign interfaces", explain: "Asigna qué interfaz de red física hace de WAN y cuál de LAN." },
          { cmd: "Opción 2) Set interface IP address", explain: "Configura la IP de gestión de la LAN si no es accesible por defecto." },
          { cmd: "Opción 8) Shell", explain: "Abre una shell FreeBSD para diagnóstico avanzado (pfctl, tcpdump, etc.)." }
        ]
      }
    ],
    notes: "Ideal para levantar un laboratorio de firewall/VPN en una máquina virtual o un equipo dedicado con varias tarjetas de red, replicando lo que sería un firewall perimetral real de empresa."
  },
  {
    id: "tool-systemrescue",
    title: "SystemRescue — Rescate y mantenimiento de sistemas",
    category: "herramientas",
    subcategory: "Rescate / Mantenimiento",
    tags: ["systemrescue", "rescate", "recuperación", "particiones"],
    description: "Live Linux orientado a tareas de rescate: reparar arranques, recuperar datos, editar particiones, resetear contraseñas, o rescatar archivos de un sistema que no arranca.",
    gui: [
      "Incluye GParted para particionado gráfico y un explorador de archivos para copiar datos a un disco externo.",
      "Escritorio ligero (Xfce) con terminal a mano para tareas más avanzadas."
    ],
    cli: [
      {
        os: "SystemRescue (terminal)",
        commands: [
          { cmd: "lsblk -f", explain: "Lista discos, particiones y sistemas de archivos detectados, punto de partida de cualquier rescate." },
          { cmd: "mount /dev/sda2 /mnt", explain: "Monta la partición del sistema a rescatar para poder acceder a sus archivos." },
          { cmd: "chroot /mnt", explain: "Entra en el sistema montado como si estuviera arrancado, útil para reparar el gestor de arranque (grub-install, update-grub) de un Linux que no arranca." },
          { cmd: "testdisk", explain: "Herramienta incluida para recuperar particiones perdidas o borradas por error." },
          { cmd: "photorec", explain: "Herramienta incluida para recuperar archivos borrados a partir de su firma, aunque el sistema de archivos esté dañado." }
        ]
      }
    ]
  },
  {
    id: "tool-gparted-live",
    title: "GParted Live — Particionado independiente",
    category: "herramientas",
    subcategory: "Rescate / Mantenimiento",
    tags: ["gparted", "particiones", "live", "redimensionar"],
    description: "Versión live (arranca directamente en GParted) para particionar discos sin depender de otro sistema operativo, imprescindible para redimensionar la partición de un Windows en uso (ver también la ficha 'Particionado gráfico con GParted' en Discos).",
    gui: [
      "Arranca directamente en el entorno gráfico de GParted (tras elegir idioma/teclado/resolución en modo texto).",
      "Seleccionar el disco, hacer las operaciones necesarias (redimensionar, mover, crear, formatear, cambiar tipo de partición) y pulsar Aplicar (✔) para ejecutarlas realmente."
    ],
    notes: "Es la vía recomendada para reducir la partición de Windows y crear espacio libre antes de instalar un segundo sistema operativo (dual boot)."
  },
  {
    id: "tool-hbcdpe",
    title: "HBCD PE (Hiren's BootCD PE) — Kit de rescate Windows",
    category: "herramientas",
    subcategory: "Rescate / Mantenimiento",
    tags: ["hbcd", "hiren", "rescate windows", "winpe"],
    description: "Entorno basado en Windows PE con decenas de utilidades de rescate y diagnóstico: recuperación de contraseñas, antivirus offline, gestión de particiones, backup, herramientas de hardware.",
    gui: [
      "Al arrancar presenta un menú/escritorio tipo Windows con accesos directos a las herramientas incluidas, agrupadas por categoría (Antivirus, Backup, Disk, Password Tools, System, etc.).",
      "Incluye un explorador de archivos completo para copiar datos de un disco que no arranca a un USB externo antes de reinstalar.",
      "Herramientas destacadas: Mini Windows con navegador para descargar drivers/herramientas adicionales in situ, editor de registro offline, y utilidades de reseteo de contraseña local de Windows."
    ],
    notes: "Muy útil como 'primera respuesta' ante un Windows que no arranca: permite rescatar datos y diagnosticar (RAM, disco) antes de decidir si reinstalar o reparar."
  },
  {
    id: "tool-generico-particionado",
    title: "Herramienta de particionado/recuperación adicional (genérica)",
    category: "herramientas",
    subcategory: "Rescate / Mantenimiento",
    tags: ["particionado", "recuperación", "genérico"],
    description: "Entrada genérica para la herramienta de particionado/recuperación de disco adicional del pendrive (ajustar el nombre exacto cuando se confirme: p.ej. MiniTool Partition Wizard u otra similar).",
    gui: [
      "El flujo habitual de este tipo de herramientas es: seleccionar el disco > elegir la operación (crear, redimensionar, mover, copiar, convertir MBR/GPT) > aplicar los cambios pendientes.",
      "Para clonar un disco completo a otro de distinto tamaño suelen incluir un asistente 'Copy Disk' que ajusta las particiones automáticamente."
    ],
    notes: "Editar esta ficha con el nombre y pasos exactos de la herramienta una vez confirmado cuál es (buscar el ejecutable dentro de la ISO correspondiente del pendrive)."
  },
  {
    id: "tool-generico-servidor-todoenuno",
    title: "Distribución de servidor todo-en-uno (genérica)",
    category: "herramientas",
    subcategory: "Sistemas operativos",
    tags: ["servidor", "todo en uno", "genérico"],
    description: "Entrada genérica para la distribución tipo servidor todo-en-uno del pendrive (ajustar el nombre exacto cuando se confirme: p.ej. ClearOS u otra similar). Suelen ofrecer gestión web centralizada de: firewall, DHCP/DNS, VPN, proxy, antivirus de correo/web y compartición de ficheros.",
    gui: [
      "Instalación asistida por texto (idioma, red, disco) y, tras el primer arranque, toda la gestión posterior se realiza desde un panel web (https://IP-del-servidor:puerto-de-gestión).",
      "Desde el panel web se activan/desactivan 'módulos' o 'apps' según los servicios que se necesiten (red, servidor de ficheros, correo, VPN...)."
    ],
    notes: "Editar esta ficha con el nombre y pasos exactos una vez confirmada la distribución concreta incluida en el pendrive."
  }
];
