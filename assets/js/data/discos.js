export const discosData = [
  {
    id: "disc-gparted",
    title: "Particionado gráfico con GParted",
    category: "discos",
    subcategory: "Particiones",
    tags: ["gparted", "particiones", "redimensionar", "live"],
    description: "Crear, redimensionar, mover o borrar particiones desde una interfaz gráfica (ver también la ficha de la herramienta GParted Live del pendrive).",
    gui: [
      "Seleccionar el disco arriba a la derecha.",
      "Clic derecho sobre una partición > Redimensionar/Mover, Formatear, Eliminar o Nueva según la operación.",
      "Las operaciones se acumulan como 'pendientes': revisar la lista y pulsar el ✔ verde (Aplicar) para ejecutarlas de verdad."
    ],
    notes: "Para redimensionar una partición de Windows en uso, arrancar siempre desde el pendrive Ventoy con GParted Live (no se puede reducir la partición del sistema mientras está montada)."
  },
  {
    id: "disc-raid-mdadm",
    title: "RAID por software en Linux (mdadm)",
    category: "discos",
    subcategory: "RAID",
    tags: ["raid", "mdadm", "redundancia", "servidor"],
    description: "Crear y gestionar arrays RAID por software (útil en servidores sin controladora RAID hardware).",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "sudo apt install mdadm", explain: "Instala la herramienta de gestión de RAID software." },
          { cmd: "sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1", explain: "Crea un RAID 1 (espejo) con dos discos." },
          { cmd: "cat /proc/mdstat", explain: "Muestra el estado de sincronización de los arrays RAID." },
          { cmd: "sudo mdadm --detail /dev/md0", explain: "Muestra el detalle completo del array (discos activos, fallidos, etc.)." },
          { cmd: "sudo mdadm /dev/md0 --fail /dev/sdc1 --remove /dev/sdc1", explain: "Marca un disco como fallido y lo extrae del array para sustituirlo." }
        ]
      }
    ],
    notes: "RAID 1 = espejo (tolera fallo de 1 disco, capacidad = 1 disco). RAID 5 = paridad distribuida (tolera 1 disco, capacidad = n-1 discos, mínimo 3 discos). RAID no sustituye a las copias de seguridad."
  },
  {
    id: "disc-clonado-dd",
    title: "Clonado de disco a bajo nivel (dd)",
    category: "discos",
    subcategory: "Clonado",
    tags: ["dd", "clonar", "imagen", "disco"],
    description: "Crear una imagen exacta bit a bit de un disco o partición (alternativa de bajo nivel a Clonezilla).",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "sudo dd if=/dev/sda of=/mnt/backup/disco.img bs=4M status=progress", explain: "Crea una imagen completa del disco /dev/sda con progreso visible." },
          { cmd: "sudo dd if=/mnt/backup/disco.img of=/dev/sda bs=4M status=progress", explain: "Restaura una imagen previamente creada sobre un disco (¡sobrescribe todo el destino!)." }
        ]
      }
    ],
    notes: "MUY peligroso si se invierten if= (origen) y of= (destino): se borra el disco equivocado sin ninguna confirmación. Para clonado con interfaz y compresión/verificación, usar mejor Clonezilla."
  },
  {
    id: "disc-espacio-analisis",
    title: "Analizar qué ocupa el espacio en disco",
    category: "discos",
    subcategory: "Mantenimiento",
    tags: ["espacio", "windirstat", "du", "ncdu", "limpieza"],
    description: "Encontrar rápidamente qué carpetas/archivos están llenando un disco.",
    gui: [
      "Windows: WinDirStat o TreeSize Free representan el uso de disco en un mapa visual por tamaño.",
      "Linux (escritorio): 'Analizador de uso de discos' (Baobab) viene preinstalado en GNOME/Ubuntu/Mint."
    ],
    cli: [
      {
        os: "Windows (PowerShell)",
        commands: [
          { cmd: "Get-ChildItem C:\\ -Recurse -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 20 FullName,Length", explain: "Lista los 20 archivos más grandes de la unidad." }
        ]
      },
      {
        os: "Linux",
        commands: [
          { cmd: "du -sh /* 2>/dev/null | sort -rh | head -20", explain: "Lista las 20 carpetas de primer nivel que más espacio ocupan." },
          { cmd: "ncdu /", explain: "Explorador interactivo de uso de disco en terminal (requiere instalar el paquete ncdu)." }
        ]
      }
    ]
  },
  {
    id: "disc-espacio-liberar",
    title: "Liberar espacio en disco",
    category: "discos",
    subcategory: "Mantenimiento",
    tags: ["limpieza", "temporales", "cleanmgr", "apt clean"],
    description: "Eliminar archivos temporales y cachés para recuperar espacio de forma segura.",
    gui: [
      "Windows: Configuración > Sistema > Almacenamiento > Liberar espacio ahora / Sensor de almacenamiento.",
      "Windows: cleanmgr.exe (Liberador de espacio en disco clásico), marcar archivos temporales, papelera, actualizaciones antiguas."
    ],
    cli: [
      {
        os: "Windows (PowerShell, como administrador)",
        commands: [
          { cmd: "cleanmgr /sagerun:1", explain: "Ejecuta el liberador de espacio con un perfil preconfigurado." },
          { cmd: "Dism.exe /online /Cleanup-Image /StartComponentCleanup", explain: "Limpia componentes de Windows Update antiguos que ya no se pueden desinstalar." }
        ]
      },
      {
        os: "Linux",
        commands: [
          { cmd: "sudo apt clean && sudo apt autoremove", explain: "Limpia la caché de paquetes descargados y elimina dependencias huérfanas." },
          { cmd: "sudo journalctl --vacuum-time=7d", explain: "Reduce el tamaño de los logs de systemd conservando solo los últimos 7 días." }
        ]
      }
    ]
  },
  {
    id: "disc-smart",
    title: "Comprobar la salud del disco (S.M.A.R.T.)",
    category: "discos",
    subcategory: "Mantenimiento",
    tags: ["smart", "salud disco", "fallo", "crystaldiskinfo"],
    description: "Detectar signos de fallo inminente de un disco antes de que se pierdan datos.",
    gui: [
      "Windows: CrystalDiskInfo (herramienta de terceros muy usada) muestra el estado SMART con semáforo de colores.",
      "Linux (escritorio): GNOME Disks (gnome-disk-utility) incluye un test SMART integrado."
    ],
    cli: [
      {
        os: "Windows (PowerShell)",
        commands: [
          { cmd: "Get-PhysicalDisk | Select-Object DeviceId,FriendlyName,HealthStatus,OperationalStatus", explain: "Muestra el estado de salud general de los discos." },
          { cmd: "wmic diskdrive get status", explain: "Comprobación rápida del estado (OK/Pred Fail) por WMI (método clásico)." }
        ]
      },
      {
        os: "Linux",
        commands: [
          { cmd: "sudo apt install smartmontools", explain: "Instala las herramientas SMART." },
          { cmd: "sudo smartctl -a /dev/sda", explain: "Muestra todos los atributos SMART del disco." },
          { cmd: "sudo smartctl -t short /dev/sda", explain: "Lanza un test de autodiagnóstico rápido del disco." }
        ]
      }
    ],
    notes: "Atributos SMART críticos a vigilar: Reallocated_Sector_Ct, Current_Pending_Sector y Uncorrectable_Error_Cnt. Cualquier valor distinto de 0 y creciente es señal de alarma."
  }
];
