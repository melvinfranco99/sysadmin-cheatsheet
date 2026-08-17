export const ciberseguridadData = [
  {
    id: "ciber-nmap",
    title: "Escaneo de red con Nmap",
    category: "ciberseguridad",
    subcategory: "Auditoría de red",
    tags: ["nmap", "escaneo", "puertos", "pentesting"],
    description: "Descubrir equipos activos y puertos/servicios abiertos en una red (usar solo en redes propias o con autorización).",
    cli: [
      {
        os: "Linux / Windows (con Nmap instalado)",
        commands: [
          { cmd: "nmap -sn 192.168.1.0/24", explain: "Descubre qué hosts están activos en la red (ping scan, sin escanear puertos)." },
          { cmd: "nmap -sV 192.168.1.10", explain: "Escanea puertos abiertos y detecta la versión del servicio en cada uno." },
          { cmd: "nmap -O 192.168.1.10", explain: "Intenta detectar el sistema operativo del host remoto." },
          { cmd: "nmap -A 192.168.1.10", explain: "Escaneo agresivo: versión, SO, script básicos y traceroute." },
          { cmd: "nmap -p 1-1000 192.168.1.10", explain: "Limita el escaneo a un rango concreto de puertos." }
        ]
      }
    ],
    notes: "Herramienta incluida en Kali Linux, Parrot OS y BlackArch. Usar exclusivamente en redes propias o con autorización explícita del propietario."
  },
  {
    id: "ciber-wireshark",
    title: "Captura de tráfico con Wireshark",
    category: "ciberseguridad",
    subcategory: "Auditoría de red",
    tags: ["wireshark", "captura", "tráfico", "paquetes"],
    description: "Capturar y analizar tráfico de red para diagnosticar problemas o incidentes de seguridad.",
    gui: [
      "Abrir Wireshark > seleccionar la interfaz de red > botón de tiburón azul para iniciar captura.",
      "Filtro útil 'ip.addr == 192.168.1.10' para ver solo el tráfico de un host.",
      "Filtro 'http' o 'dns' para aislar un tipo de tráfico concreto.",
      "Botón derecho sobre un paquete > Follow > TCP Stream para reconstruir una conversación completa."
    ],
    cli: [
      {
        os: "Linux / Windows (tshark, versión de consola)",
        commands: [
          { cmd: "tshark -i eth0 -w captura.pcapng", explain: "Captura tráfico de una interfaz y lo guarda en un fichero para analizarlo luego con Wireshark." },
          { cmd: "tshark -r captura.pcapng -Y \"http.request\"", explain: "Filtra peticiones HTTP dentro de una captura ya guardada." }
        ]
      }
    ],
    notes: "Preinstalado en Kali Linux y Parrot OS. Requiere permisos elevados (o pertenecer al grupo wireshark en Linux) para capturar en una interfaz."
  },
  {
    id: "ciber-hashing-integridad",
    title: "Verificar integridad de ficheros (hashes)",
    category: "ciberseguridad",
    subcategory: "Integridad",
    tags: ["hash", "sha256", "md5", "integridad", "checksum"],
    description: "Comprobar que un fichero descargado (una ISO, por ejemplo) no está corrupto ni manipulado.",
    cli: [
      {
        os: "Windows (PowerShell)",
        commands: [
          { cmd: "Get-FileHash archivo.iso -Algorithm SHA256", explain: "Calcula el hash SHA256 de un fichero para compararlo con el publicado por el fabricante." },
          { cmd: "certutil -hashfile archivo.iso MD5", explain: "Alternativa con certutil, disponible por defecto en Windows." }
        ]
      },
      {
        os: "Linux",
        commands: [
          { cmd: "sha256sum archivo.iso", explain: "Calcula el hash SHA256 del fichero." },
          { cmd: "sha256sum -c archivo.iso.sha256", explain: "Verifica automáticamente el fichero contra un checksum publicado." }
        ]
      }
    ],
    notes: "Comprobar siempre el hash de las ISOs de sistemas operativos y herramientas de seguridad antes de grabarlas en el pendrive Ventoy."
  },
  {
    id: "ciber-firewall-windows",
    title: "Firewall de Windows",
    category: "ciberseguridad",
    subcategory: "Firewall",
    tags: ["firewall", "netsh", "reglas", "windows defender"],
    description: "Consultar y crear reglas del Firewall de Windows Defender.",
    gui: [
      "Panel de control > Firewall de Windows Defender > Configuración avanzada.",
      "Reglas de entrada / Reglas de salida > Nueva regla > elegir Programa, Puerto o Predefinida."
    ],
    cli: [
      {
        os: "Windows (PowerShell/CMD, como administrador)",
        commands: [
          { cmd: "netsh advfirewall show allprofiles", explain: "Muestra el estado del firewall en los 3 perfiles (dominio, privado, público)." },
          { cmd: 'netsh advfirewall firewall add rule name="Permitir RDP" dir=in action=allow protocol=TCP localport=3389', explain: "Crea una regla de entrada para permitir un puerto (ejemplo: Escritorio remoto)." },
          { cmd: "New-NetFirewallRule -DisplayName \"Bloquear SMB entrante\" -Direction Inbound -Protocol TCP -LocalPort 445 -Action Block", explain: "Crea una regla con PowerShell (más flexible para scripting)." },
          { cmd: "netsh advfirewall set allprofiles state on", explain: "Activa el firewall en todos los perfiles." }
        ]
      }
    ]
  },
  {
    id: "ciber-firewall-linux",
    title: "Firewall en Linux (ufw / firewalld / iptables)",
    category: "ciberseguridad",
    subcategory: "Firewall",
    tags: ["ufw", "firewalld", "iptables", "firewall"],
    description: "Gestión de firewall según la distribución: ufw (Ubuntu/Mint), firewalld (Fedora/RHEL) o iptables (bajo nivel, universal).",
    cli: [
      {
        os: "Ubuntu / Mint / Debian (ufw)",
        commands: [
          { cmd: "sudo ufw status verbose", explain: "Muestra el estado y las reglas activas." },
          { cmd: "sudo ufw allow 22/tcp", explain: "Permite el tráfico entrante a un puerto (ej. SSH)." },
          { cmd: "sudo ufw deny from 192.168.1.50", explain: "Bloquea todo el tráfico proveniente de una IP concreta." },
          { cmd: "sudo ufw enable", explain: "Activa el firewall." }
        ]
      },
      {
        os: "Fedora / RHEL / CentOS (firewalld)",
        commands: [
          { cmd: "sudo firewall-cmd --state", explain: "Consulta si firewalld está activo." },
          { cmd: "sudo firewall-cmd --add-service=http --permanent", explain: "Permite el servicio HTTP de forma permanente." },
          { cmd: "sudo firewall-cmd --reload", explain: "Aplica los cambios permanentes sin cortar conexiones activas." }
        ]
      },
      {
        os: "Cualquier Linux (iptables, bajo nivel)",
        commands: [
          { cmd: "sudo iptables -L -n -v", explain: "Lista las reglas activas con contadores." },
          { cmd: "sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT", explain: "Añade una regla de entrada para permitir SSH." }
        ]
      }
    ]
  },
  {
    id: "ciber-bitlocker",
    title: "Cifrado de disco: BitLocker (Windows)",
    category: "ciberseguridad",
    subcategory: "Cifrado",
    tags: ["bitlocker", "cifrado", "disco", "manage-bde"],
    description: "Cifrar el disco de un portátil de empresa para proteger los datos en caso de robo o pérdida.",
    gui: [
      "Panel de control > Cifrado de unidad BitLocker > Activar BitLocker en la unidad deseada.",
      "Elegir dónde guardar la clave de recuperación (cuenta Microsoft, archivo, o imprimirla) — guardar siempre una copia según la política de la empresa."
    ],
    cli: [
      {
        os: "Windows (PowerShell/CMD, como administrador)",
        commands: [
          { cmd: "manage-bde -status", explain: "Muestra el estado de cifrado de todas las unidades." },
          { cmd: "manage-bde -on C: -RecoveryPassword", explain: "Activa BitLocker en C: generando una contraseña de recuperación." },
          { cmd: "manage-bde -protectors -get C:", explain: "Muestra los protectores (claves) configurados en la unidad." },
          { cmd: "manage-bde -off C:", explain: "Descifra la unidad (proceso lento, requiere reinicio)." }
        ]
      }
    ]
  },
  {
    id: "ciber-luks",
    title: "Cifrado de disco: LUKS (Linux)",
    category: "ciberseguridad",
    subcategory: "Cifrado",
    tags: ["luks", "cryptsetup", "cifrado", "disco"],
    description: "Cifrar una partición o disco completo en Linux usando LUKS/dm-crypt.",
    gui: [
      "En el instalador de Ubuntu/Mint: marcar 'Cifrar la nueva instalación de Ubuntu' durante la instalación.",
      "GParted no cifra directamente; para discos ya instalados se usa 'Disks' (gnome-disk-utility) > Formatear con opción de cifrado."
    ],
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "sudo cryptsetup luksFormat /dev/sdb1", explain: "Formatea una partición con cifrado LUKS (pide confirmar y establecer una passphrase)." },
          { cmd: "sudo cryptsetup luksOpen /dev/sdb1 datoscifrados", explain: "Desbloquea la partición cifrada y la mapea como /dev/mapper/datoscifrados." },
          { cmd: "sudo mkfs.ext4 /dev/mapper/datoscifrados", explain: "Formatea el volumen ya desbloqueado con un sistema de ficheros normal." },
          { cmd: "sudo cryptsetup luksClose datoscifrados", explain: "Bloquea de nuevo la partición cifrada." }
        ]
      }
    ]
  },
  {
    id: "ciber-actualizaciones",
    title: "Gestión de parches y actualizaciones",
    category: "ciberseguridad",
    subcategory: "Hardening",
    tags: ["parches", "actualizaciones", "vulnerabilidades"],
    description: "Mantener sistemas al día es la medida de seguridad más rentable y básica.",
    cli: [
      {
        os: "Windows (PowerShell)",
        commands: [
          { cmd: "Get-HotFix", explain: "Lista los parches (KB) instalados en el sistema." },
          { cmd: "usoclient StartScan", explain: "Fuerza una búsqueda de actualizaciones de Windows Update." }
        ]
      },
      {
        os: "Linux (Debian/Ubuntu)",
        commands: [
          { cmd: "sudo unattended-upgrade --dry-run", explain: "Simula qué actualizaciones de seguridad se instalarían automáticamente." },
          { cmd: "sudo apt list --upgradable", explain: "Lista los paquetes con actualizaciones pendientes." }
        ]
      }
    ],
    notes: "Política recomendada: actualizaciones de seguridad críticas cuanto antes; actualizaciones de funcionalidad en ventana de mantenimiento planificada."
  },
  {
    id: "ciber-auditoria-eventos",
    title: "Auditoría de accesos y eventos de seguridad",
    category: "ciberseguridad",
    subcategory: "Auditoría",
    tags: ["auditoría", "logs", "seguridad", "eventos", "auditd"],
    description: "Revisar intentos de acceso fallidos y eventos relevantes de seguridad.",
    cli: [
      {
        os: "Windows (PowerShell, como administrador)",
        commands: [
          { cmd: "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 20", explain: "Lista los últimos 20 intentos de inicio de sesión fallidos (Event ID 4625)." },
          { cmd: "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4720} -MaxEvents 10", explain: "Lista las últimas creaciones de cuentas de usuario (Event ID 4720)." }
        ]
      },
      {
        os: "Linux",
        commands: [
          { cmd: "sudo lastb | head -20", explain: "Muestra los últimos intentos de login fallidos." },
          { cmd: "sudo journalctl -u ssh | grep \"Failed password\"", explain: "Filtra intentos fallidos de acceso SSH en el log del servicio." },
          { cmd: "sudo ausearch -m avc -ts recent", explain: "Consulta eventos recientes de auditd (si está instalado y activo)." }
        ]
      }
    ]
  },
  {
    id: "ciber-antivirus-defender",
    title: "Windows Defender por PowerShell",
    category: "ciberseguridad",
    subcategory: "Antivirus",
    tags: ["defender", "antivirus", "malware", "powershell"],
    description: "Gestionar análisis y exclusiones del antivirus integrado de Windows sin abrir la interfaz gráfica.",
    cli: [
      {
        os: "Windows (PowerShell, como administrador)",
        commands: [
          { cmd: "Get-MpComputerStatus", explain: "Muestra el estado del antivirus (protección en tiempo real, última actualización de firmas...)." },
          { cmd: "Update-MpSignature", explain: "Actualiza las firmas de virus manualmente." },
          { cmd: "Start-MpScan -ScanType QuickScan", explain: "Lanza un análisis rápido." },
          { cmd: "Start-MpScan -ScanType FullScan", explain: "Lanza un análisis completo del equipo." },
          { cmd: 'Add-MpPreference -ExclusionPath "C:\\Ruta\\Segura"', explain: "Añade una exclusión de carpeta (usar con criterio, solo para rutas de confianza)." }
        ]
      }
    ]
  },
  {
    id: "ciber-contraseñas-buenas-practicas",
    title: "Políticas de contraseñas y bloqueo de cuentas",
    category: "ciberseguridad",
    subcategory: "Hardening",
    tags: ["contraseñas", "políticas", "gpo", "bloqueo"],
    description: "Configurar requisitos mínimos de contraseña y bloqueo tras intentos fallidos (equipo local o dominio).",
    gui: [
      "Equipo local: secpol.msc > Directivas de cuenta > Directiva de contraseñas / Directiva de bloqueo de cuentas.",
      "En dominio: Directivas de grupo (GPMC) > Default Domain Policy > Configuración de equipo > Directivas de Windows > Configuración de seguridad."
    ],
    cli: [
      {
        os: "Windows (PowerShell/CMD, como administrador)",
        commands: [
          { cmd: "net accounts", explain: "Muestra la política de contraseñas y bloqueo actual del equipo local." },
          { cmd: "net accounts /minpwlen:12 /maxpwage:90 /lockoutthreshold:5", explain: "Establece longitud mínima, caducidad máxima y nº de intentos antes del bloqueo." }
        ]
      }
    ],
    notes: "Recomendación actual (NIST/CIS): priorizar longitud sobre complejidad forzada, y bloqueo tras 5-10 intentos fallidos con desbloqueo automático a los 15-30 minutos."
  }
];
