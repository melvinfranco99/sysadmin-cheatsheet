export const windowsData = [
  {
    id: "win-ipconfig",
    title: "Ver y renovar configuración IP",
    category: "windows",
    subcategory: "Redes",
    tags: ["ip", "red", "dns", "dhcp", "gateway", "adaptador"],
    description: "Consultar la configuración de red actual, renovar IP por DHCP y limpiar la caché DNS.",
    cli: [
      {
        os: "Windows (CMD)",
        commands: [
          { cmd: "ipconfig /all", explain: "Muestra IP, máscara, puerta de enlace, DNS y MAC de todos los adaptadores." },
          { cmd: "ipconfig /release", explain: "Libera la IP asignada por DHCP." },
          { cmd: "ipconfig /renew", explain: "Solicita una nueva IP al servidor DHCP." },
          { cmd: "ipconfig /flushdns", explain: "Vacía la caché de resolución DNS local." },
          { cmd: "ipconfig /displaydns", explain: "Muestra el contenido actual de la caché DNS." }
        ]
      }
    ],
    notes: "Si no hay conectividad tras un cambio de red, el combo release + renew + flushdns resuelve la mayoría de los casos."
  },
  {
    id: "win-ip-estatica",
    title: "Asignar IP estática",
    category: "windows",
    subcategory: "Redes",
    tags: ["ip estática", "red", "netsh", "adaptador"],
    description: "Configurar una IP fija, máscara, puerta de enlace y DNS en un adaptador de red.",
    gui: [
      "Panel de control > Centro de redes y recursos compartidos > Cambiar configuración del adaptador.",
      "Clic derecho sobre el adaptador > Propiedades > Protocolo de Internet versión 4 (TCP/IPv4) > Propiedades.",
      "Marcar 'Usar la siguiente dirección IP' e introducir IP, máscara, puerta de enlace y DNS."
    ],
    cli: [
      {
        os: "Windows (PowerShell)",
        commands: [
          { cmd: 'New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.50 -PrefixLength 24 -DefaultGateway 192.168.1.1', explain: "Asigna IP estática y puerta de enlace al adaptador 'Ethernet'." },
          { cmd: 'Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("8.8.8.8","1.1.1.1")', explain: "Configura los servidores DNS del adaptador." },
          { cmd: 'Set-NetIPInterface -InterfaceAlias "Ethernet" -Dhcp Enabled', explain: "Vuelve a activar DHCP en el adaptador (revertir a IP dinámica)." }
        ]
      },
      {
        os: "Windows (CMD)",
        commands: [
          { cmd: 'netsh interface ip set address name="Ethernet" static 192.168.1.50 255.255.255.0 192.168.1.1', explain: "Equivalente en CMD para IP estática." },
          { cmd: 'netsh interface ip set dns name="Ethernet" static 8.8.8.8', explain: "Fija el DNS primario del adaptador." }
        ]
      }
    ]
  },
  {
    id: "win-conectividad",
    title: "Diagnóstico de conectividad (ping, tracert, pathping)",
    category: "windows",
    subcategory: "Redes",
    tags: ["ping", "tracert", "pathping", "red", "diagnóstico"],
    description: "Comandos básicos para comprobar alcance, ruta y latencia hacia un host.",
    cli: [
      {
        os: "Windows (CMD/PowerShell)",
        commands: [
          { cmd: "ping 8.8.8.8 -t", explain: "Ping continuo hasta cancelar con Ctrl+C." },
          { cmd: "tracert dominio.com", explain: "Muestra los saltos (routers) hasta el destino." },
          { cmd: "pathping dominio.com", explain: "Combina ping y tracert, útil para detectar pérdida de paquetes en un salto concreto." },
          { cmd: "Test-NetConnection dominio.com -Port 443", explain: "Comprueba si un puerto TCP concreto está accesible (PowerShell)." },
          { cmd: "nslookup dominio.com", explain: "Resuelve el nombre a IP usando el DNS configurado." }
        ]
      }
    ]
  },
  {
    id: "win-puertos-conexiones",
    title: "Ver conexiones y puertos abiertos",
    category: "windows",
    subcategory: "Redes",
    tags: ["netstat", "puertos", "conexiones", "procesos"],
    description: "Listar conexiones de red activas y qué proceso las usa.",
    cli: [
      {
        os: "Windows (CMD/PowerShell)",
        commands: [
          { cmd: "netstat -ano", explain: "Lista conexiones/puertos con el PID del proceso asociado." },
          { cmd: "Get-NetTCPConnection | Where-Object State -eq Listen", explain: "Muestra los puertos TCP en escucha (PowerShell)." },
          { cmd: "tasklist /svc | findstr <PID>", explain: "Averigua qué servicio corresponde a un PID." },
          { cmd: "taskkill /PID <PID> /F", explain: "Fuerza el cierre de un proceso por su PID." }
        ]
      }
    ]
  },
  {
    id: "win-wifi",
    title: "Gestión de redes Wifi",
    category: "windows",
    subcategory: "Wifi",
    tags: ["wifi", "wlan", "contraseña", "netsh"],
    description: "Ver redes disponibles, recuperar contraseñas guardadas y exportar/importar perfiles Wifi.",
    gui: [
      "Icono de red en la barra de tareas > seleccionar red > Conectar.",
      "Configuración > Red e Internet > Wifi > Administrar redes conocidas (para olvidar/editar perfiles)."
    ],
    cli: [
      {
        os: "Windows (CMD, como administrador)",
        commands: [
          { cmd: "netsh wlan show networks", explain: "Lista las redes Wifi visibles." },
          { cmd: "netsh wlan show profiles", explain: "Lista los perfiles Wifi guardados en el equipo." },
          { cmd: 'netsh wlan show profile name="MiWifi" key=clear', explain: "Muestra la contraseña en claro de una red guardada (campo 'Contenido de la clave')." },
          { cmd: 'netsh wlan connect name="MiWifi"', explain: "Conecta a un perfil Wifi ya guardado." },
          { cmd: 'netsh wlan export profile name="MiWifi" folder=C:\\backup key=clear', explain: "Exporta el perfil Wifi (con contraseña) a un XML, útil para clonar configuración." },
          { cmd: 'netsh wlan add profile filename="C:\\backup\\Wifi-MiWifi.xml"', explain: "Importa un perfil Wifi desde un XML exportado." },
          { cmd: 'netsh wlan delete profile name="MiWifi"', explain: "Elimina (olvida) un perfil Wifi guardado." }
        ]
      }
    ],
    notes: "Muy útil al migrar un portátil de usuario: exportar todos los perfiles Wifi conocidos e importarlos en el equipo nuevo."
  },
  {
    id: "win-permisos-archivos",
    title: "Permisos NTFS de archivos y carpetas",
    category: "windows",
    subcategory: "Archivos",
    tags: ["permisos", "ntfs", "icacls", "seguridad"],
    description: "Consultar y modificar permisos NTFS desde consola o desde el explorador.",
    gui: [
      "Clic derecho en el archivo/carpeta > Propiedades > pestaña Seguridad > Editar.",
      "Para permisos avanzados/herencia: botón Opciones avanzadas."
    ],
    cli: [
      {
        os: "Windows (CMD, como administrador)",
        commands: [
          { cmd: "icacls C:\\Datos", explain: "Muestra los permisos NTFS actuales de la carpeta." },
          { cmd: 'icacls C:\\Datos /grant Usuario:(OI)(CI)F', explain: "Concede control total a un usuario, con herencia a subcarpetas y archivos." },
          { cmd: "icacls C:\\Datos /remove Usuario", explain: "Elimina los permisos explícitos de un usuario." },
          { cmd: "icacls C:\\Datos /reset /T", explain: "Restaura los permisos heredados por defecto de forma recursiva." },
          { cmd: "takeown /F C:\\Datos /R /D S", explain: "Toma posesión de una carpeta y su contenido cuando se ha perdido el acceso." }
        ]
      }
    ]
  },
  {
    id: "win-robocopy",
    title: "Copias y sincronización con Robocopy",
    category: "windows",
    subcategory: "Archivos",
    tags: ["copia", "backup", "sincronizar", "robocopy"],
    description: "Copiar/sincronizar carpetas de forma robusta, con reintentos y registro, ideal para migraciones y backups.",
    cli: [
      {
        os: "Windows (CMD)",
        commands: [
          { cmd: "robocopy C:\\Origen D:\\Destino /MIR /R:3 /W:5 /LOG:copia.log", explain: "Espeja Origen en Destino (borra en destino lo que ya no está en origen), 3 reintentos, log a fichero." },
          { cmd: "robocopy C:\\Origen D:\\Destino /E", explain: "Copia todas las subcarpetas incluidas las vacías, sin borrar nada en destino." },
          { cmd: "robocopy C:\\Origen D:\\Destino /MIR /XD Temp /XF *.tmp", explain: "Igual que /MIR pero excluyendo la carpeta Temp y los ficheros .tmp." }
        ]
      }
    ],
    notes: "/MIR es destructivo (borra en destino), usar con cuidado y probar antes con /L (modo simulación, no copia nada)."
  },
  {
    id: "win-discos-diskpart",
    title: "Gestión de discos con DiskPart",
    category: "windows",
    subcategory: "Discos",
    tags: ["diskpart", "particiones", "disco", "formatear"],
    description: "Crear, formatear y gestionar particiones y discos desde consola.",
    gui: [
      "Botón derecho en el menú Inicio > Administración de discos.",
      "Clic derecho sobre el disco/partición para crear volumen, formatear, cambiar letra o extender/reducir."
    ],
    cli: [
      {
        os: "Windows (diskpart, como administrador)",
        commands: [
          { cmd: "diskpart", explain: "Entra en la consola interactiva de DiskPart." },
          { cmd: "list disk", explain: "Lista los discos físicos del equipo." },
          { cmd: "select disk 1", explain: "Selecciona el disco 1 para operar sobre él." },
          { cmd: "clean", explain: "Borra la tabla de particiones del disco seleccionado (irreversible)." },
          { cmd: "create partition primary", explain: "Crea una partición primaria con el espacio libre." },
          { cmd: "format fs=ntfs quick label=Datos", explain: "Formatea rápido la partición seleccionada en NTFS." },
          { cmd: "assign letter=D", explain: "Asigna la letra D: a la partición." },
          { cmd: "list volume", explain: "Lista todos los volúmenes del sistema." }
        ]
      }
    ],
    notes: "'clean' borra TODO el disco seleccionado sin confirmación adicional: comprobar siempre 'list disk' y 'select disk' antes."
  },
  {
    id: "win-chkdsk-sfc-dism",
    title: "Reparar disco y sistema (chkdsk, sfc, DISM)",
    category: "windows",
    subcategory: "Discos",
    tags: ["reparar", "chkdsk", "sfc", "dism", "sistema"],
    description: "Comprobar errores de disco y reparar archivos de sistema corruptos.",
    cli: [
      {
        os: "Windows (CMD, como administrador)",
        commands: [
          { cmd: "chkdsk C: /f /r", explain: "Comprueba y repara errores del disco y sectores dañados (pide reinicio si C: está en uso)." },
          { cmd: "sfc /scannow", explain: "Verifica y repara archivos de sistema protegidos de Windows." },
          { cmd: "DISM /Online /Cleanup-Image /CheckHealth", explain: "Comprueba si la imagen del sistema tiene corrupción." },
          { cmd: "DISM /Online /Cleanup-Image /RestoreHealth", explain: "Repara la imagen de Windows usando Windows Update como fuente." }
        ]
      }
    ],
    notes: "Orden recomendado ante un Windows inestable: DISM RestoreHealth primero y luego sfc /scannow."
  },
  {
    id: "win-usuarios-servicios",
    title: "Usuarios locales, grupos y servicios",
    category: "windows",
    subcategory: "Administración",
    tags: ["usuarios", "grupos", "servicios", "net user"],
    description: "Gestión básica de cuentas locales, grupos y servicios de Windows.",
    gui: [
      "lusrmgr.msc para usuarios y grupos locales (no disponible en Home).",
      "services.msc para administrar servicios (iniciar, detener, tipo de inicio)."
    ],
    cli: [
      {
        os: "Windows (CMD/PowerShell, como administrador)",
        commands: [
          { cmd: "net user", explain: "Lista los usuarios locales del equipo." },
          { cmd: "net user Nuevo Passw0rd! /add", explain: "Crea un usuario local con contraseña." },
          { cmd: "net localgroup administradores Nuevo /add", explain: "Añade el usuario al grupo de administradores." },
          { cmd: "net user Nuevo /active:no", explain: "Deshabilita una cuenta local." },
          { cmd: "Get-Service | Where-Object Status -eq Running", explain: "Lista los servicios en ejecución (PowerShell)." },
          { cmd: "Restart-Service -Name Spooler", explain: "Reinicia un servicio (ej. cola de impresión) por nombre." }
        ]
      }
    ]
  },
  {
    id: "win-eventos-info-sistema",
    title: "Información del sistema y visor de eventos",
    category: "windows",
    subcategory: "Administración",
    tags: ["eventos", "systeminfo", "logs", "diagnóstico"],
    description: "Consultar información de hardware/software y revisar el registro de eventos para diagnosticar incidencias.",
    gui: [
      "eventvwr.msc para el Visor de eventos (Sistema, Aplicación, Seguridad).",
      "msinfo32 para un resumen completo de hardware y software instalado."
    ],
    cli: [
      {
        os: "Windows (CMD/PowerShell)",
        commands: [
          { cmd: "systeminfo", explain: "Vuelca información completa del sistema (SO, memoria, parches, dominio...)." },
          { cmd: "Get-EventLog -LogName System -Newest 20", explain: "Muestra los 20 últimos eventos del log del sistema." },
          { cmd: "Get-WinEvent -LogName Application -MaxEvents 20", explain: "Alternativa moderna a Get-EventLog, más rápida y completa." },
          { cmd: "wmic product get name,version", explain: "Lista el software instalado (método clásico, deprecado en builds recientes)." }
        ]
      }
    ]
  },
  {
    id: "win-activacion-updates",
    title: "Activación y actualizaciones de Windows",
    category: "windows",
    subcategory: "Administración",
    tags: ["activación", "windows update", "licencia", "slmgr"],
    description: "Comprobar el estado de activación y forzar la búsqueda de actualizaciones.",
    cli: [
      {
        os: "Windows (CMD/PowerShell, como administrador)",
        commands: [
          { cmd: "slmgr /xpr", explain: "Muestra el estado de activación de Windows." },
          { cmd: "slmgr /dli", explain: "Muestra información detallada de la licencia instalada." },
          { cmd: "slmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX", explain: "Introduce una clave de producto." },
          { cmd: "Get-WindowsUpdateLog", explain: "Genera un log legible de Windows Update en el escritorio (PowerShell)." },
          { cmd: "UsoClient StartScan", explain: "Fuerza una búsqueda inmediata de actualizaciones." }
        ]
      }
    ]
  }
];
