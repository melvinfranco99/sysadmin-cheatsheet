export const routerSwitchData = [
  {
    id: "rs-router-soho-inicial",
    title: "Configuración inicial de un router nuevo (SOHO/empresa pequeña)",
    category: "router",
    subcategory: "Router",
    tags: ["router", "configuración inicial", "wifi", "wan"],
    description: "Pasos estándar al desplegar un router nuevo de oficina, válidos para la mayoría de marcas (TP-Link, Asus, Netgear, D-Link...).",
    gui: [
      "1. Conectar un PC al router por cable a un puerto LAN (evitar Wifi durante la configuración inicial).",
      "2. Acceder a la IP de gestión del router (suele venir en una pegatina: 192.168.0.1, 192.168.1.1 o 192.168.0.254) desde el navegador.",
      "3. Cambiar la contraseña de administrador por defecto (paso crítico, muchos ataques automatizados prueban las contraseñas de fábrica).",
      "4. Configurar el acceso WAN según el proveedor: IP dinámica (DHCP), PPPoE (con usuario/contraseña del ISP) o IP estática.",
      "5. Configurar la LAN: rango de IPs interno (ej. 192.168.1.0/24), rango del servidor DHCP y DNS a repartir.",
      "6. Configurar Wifi: SSID propio (evitar el nombre por defecto), seguridad WPA2/WPA3, contraseña robusta, desactivar WPS si no se usa.",
      "7. Si el router lo soporta, separar Wifi de invitados (aislado de la LAN interna) del Wifi corporativo.",
      "8. Actualizar el firmware a la última versión estable antes de darlo por finalizado.",
      "9. Guardar una copia de la configuración (backup) tras dejarlo todo listo.",
      "10. Documentar: IP de gestión, usuario/contraseña admin, SSID y claves, en el gestor de contraseñas de la empresa (nunca en texto plano sin cifrar)."
    ],
    notes: "El orden importa: cambiar la contraseña de admin siempre antes de exponer el router a la red o a Internet."
  },
  {
    id: "rs-switch-gestionable-inicial",
    title: "Configuración inicial de un switch gestionable",
    category: "router",
    subcategory: "Switch",
    tags: ["switch", "gestionable", "vlan", "configuración inicial"],
    description: "Primeros pasos al desplegar un switch gestionable nuevo (Cisco, HP/Aruba, TP-Link Omada, Ubiquiti...).",
    gui: [
      "1. Conectar por cable al puerto de gestión o a cualquier puerto (según el modelo) y acceder a la IP de gestión por defecto (consultar manual, suele ser 192.168.0.1 o 192.168.1.1, o vía app/controller en modelos cloud-managed).",
      "2. Cambiar la contraseña de administrador por defecto.",
      "3. Asignar una IP de gestión fija dentro del rango de la VLAN de administración de la empresa.",
      "4. Crear las VLANs necesarias (datos, voz, invitados, gestión...).",
      "5. Configurar cada puerto: 'access' con la VLAN correspondiente para puestos de usuario, 'trunk' para enlaces a otros switches, router o AP que necesiten varias VLANs.",
      "6. Si hay teléfonos IP, configurar la VLAN de voz (voice VLAN) en los puertos de usuario.",
      "7. Activar STP (Spanning Tree) para evitar bucles si hay redundancia de cableado entre switches.",
      "8. Guardar la configuración (en switches Cisco: 'write memory' o 'copy running-config startup-config', para que sobreviva a un reinicio)."
    ]
  },
  {
    id: "rs-cisco-ios-basico",
    title: "Comandos básicos Cisco IOS (switch/router)",
    category: "router",
    subcategory: "Switch",
    tags: ["cisco", "ios", "cli", "vlan", "trunk"],
    description: "Referencia rápida de la CLI de Cisco IOS, la más habitual en material docente de ASIR y en entornos empresariales.",
    cli: [
      {
        os: "Cisco IOS",
        commands: [
          { cmd: "enable", explain: "Pasa a modo privilegiado (EXEC privilegiado)." },
          { cmd: "configure terminal", explain: "Entra en modo de configuración global." },
          { cmd: "hostname SW-Planta1", explain: "Asigna un nombre identificativo al equipo." },
          { cmd: "enable secret ClaveSegura123", explain: "Establece la contraseña cifrada de modo privilegiado." },
          { cmd: "vlan 10\n name Datos", explain: "Crea la VLAN 10 y le asigna un nombre descriptivo." },
          { cmd: "interface FastEthernet0/1\n switchport mode access\n switchport access vlan 10", explain: "Configura un puerto como access en la VLAN 10 (para un PC)." },
          { cmd: "interface GigabitEthernet0/1\n switchport mode trunk\n switchport trunk allowed vlan 10,20,30", explain: "Configura un puerto como trunk permitiendo varias VLANs (enlace entre switches)." },
          { cmd: "interface vlan 10\n ip address 192.168.10.1 255.255.255.0\n no shutdown", explain: "Crea una interfaz virtual (SVI) con IP de gestión/gateway para esa VLAN (en switches de nivel 3)." },
          { cmd: "show vlan brief", explain: "Lista las VLANs configuradas y qué puertos pertenecen a cada una." },
          { cmd: "show interfaces status", explain: "Muestra el estado (up/down), VLAN y velocidad de cada puerto." },
          { cmd: "show running-config", explain: "Muestra la configuración actualmente activa en memoria." },
          { cmd: "copy running-config startup-config", explain: "Guarda la configuración activa como configuración de arranque (imprescindible o se pierde al reiniciar)." },
          { cmd: "show ip route", explain: "Muestra la tabla de enrutamiento (en un router o switch de nivel 3)." }
        ]
      }
    ]
  },
  {
    id: "rs-backup-firmware",
    title: "Backup de configuración y actualización de firmware",
    category: "router",
    subcategory: "Mantenimiento",
    tags: ["backup", "firmware", "configuración", "actualización"],
    description: "Buenas prácticas de mantenimiento para router y switch, antes y después de cualquier cambio importante.",
    gui: [
      "La mayoría de routers/switches tienen en su panel web una sección de Sistema/Herramientas > Backup y restauración de configuración, que exporta un fichero (a menudo .cfg o .bin).",
      "Hacer backup SIEMPRE antes de: actualizar firmware, hacer un reset, o aplicar cambios grandes de configuración.",
      "Tras actualizar el firmware, verificar que la configuración y la conectividad siguen correctas antes de dar el trabajo por terminado."
    ],
    cli: [
      {
        os: "Cisco IOS",
        commands: [
          { cmd: "copy running-config tftp:", explain: "Copia la configuración activa a un servidor TFTP como backup externo." },
          { cmd: "copy tftp: running-config", explain: "Restaura una configuración previamente guardada desde un servidor TFTP." }
        ]
      }
    ],
    notes: "Nunca actualizar firmware de un equipo de red en producción en horario laboral: programar ventana de mantenimiento fuera de horario por si hay que hacer rollback."
  },
  {
    id: "rs-wifi-empresarial",
    title: "Wifi empresarial: SSID, seguridad y redes de invitados",
    category: "router",
    subcategory: "Wifi",
    tags: ["wifi", "wpa2", "wpa3", "radius", "invitados"],
    description: "Buenas prácticas al desplegar Wifi en un entorno de oficina.",
    notes: "Seguridad mínima recomendada: WPA2-PSK (AES), preferir WPA3 si todos los dispositivos lo soportan. En empresas medianas/grandes usar WPA2/3-Enterprise con servidor RADIUS (autenticación por usuario de dominio, no una clave compartida por todos). Separar siempre el SSID de invitados en su propia VLAN, sin acceso a la LAN interna ni a los recursos compartidos. Desactivar WPS (vulnerable a ataques de fuerza bruta del PIN). Cambiar el SSID por defecto para no revelar marca/modelo del equipo."
  }
];
