export const linuxData = [
  {
    id: "lin-ip-red",
    title: "Ver y configurar IP (ip, nmcli)",
    category: "linux",
    subcategory: "Redes",
    tags: ["ip", "red", "nmcli", "interfaz"],
    description: "Comandos modernos para consultar y configurar la red en Linux (sustituyen a ifconfig/route).",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "ip a", explain: "Muestra las interfaces de red y sus IPs (equivalente a ifconfig)." },
          { cmd: "ip route", explain: "Muestra la tabla de rutas y la puerta de enlace por defecto." },
          { cmd: "sudo ip addr add 192.168.1.50/24 dev eth0", explain: "Asigna una IP temporal a una interfaz (no persiste al reiniciar)." },
          { cmd: "nmcli device status", explain: "Muestra el estado de todas las interfaces gestionadas por NetworkManager." },
          { cmd: "nmcli con show", explain: "Lista las conexiones (perfiles) guardadas." },
          { cmd: 'nmcli con mod "Cableada 1" ipv4.addresses 192.168.1.50/24 ipv4.gateway 192.168.1.1 ipv4.dns 8.8.8.8 ipv4.method manual', explain: "Configura IP estática de forma persistente sobre una conexión existente." },
          { cmd: 'nmcli con up "Cableada 1"', explain: "Aplica/activa la conexión tras modificarla." }
        ]
      }
    ]
  },
  {
    id: "lin-wifi",
    title: "Conectar a redes Wifi (nmcli / iwconfig)",
    category: "linux",
    subcategory: "Wifi",
    tags: ["wifi", "wlan", "nmcli", "iwlist"],
    description: "Escanear y conectar a redes inalámbricas desde terminal.",
    gui: [
      "Icono de red en el panel superior/inferior del escritorio > seleccionar SSID > introducir contraseña.",
      "Configuración > Wifi (GNOME/KDE) para ver detalles, olvidar redes o cambiar prioridad."
    ],
    cli: [
      {
        os: "Linux (NetworkManager)",
        commands: [
          { cmd: "nmcli device wifi list", explain: "Escanea y lista las redes Wifi visibles." },
          { cmd: 'nmcli device wifi connect "MiWifi" password "MiClave123"', explain: "Conecta a una red Wifi indicando la contraseña." },
          { cmd: "nmcli con show --active", explain: "Muestra la conexión Wifi actualmente activa." },
          { cmd: 'nmcli con delete "MiWifi"', explain: "Elimina (olvida) un perfil Wifi guardado." },
          { cmd: "sudo iwlist wlan0 scan | grep ESSID", explain: "Alternativa de bajo nivel para escanear redes visibles (sin NetworkManager)." }
        ]
      }
    ]
  },
  {
    id: "lin-diagnostico-red",
    title: "Diagnóstico de red (ping, traceroute, ss, dig)",
    category: "linux",
    subcategory: "Redes",
    tags: ["ping", "traceroute", "ss", "dig", "diagnóstico"],
    description: "Herramientas de diagnóstico de conectividad, puertos y resolución DNS.",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "ping -c 4 8.8.8.8", explain: "Envía 4 paquetes ICMP y termina (a diferencia de Windows, por defecto es infinito sin -c)." },
          { cmd: "traceroute dominio.com", explain: "Muestra la ruta de saltos hasta el destino (mtr da una versión interactiva y continua)." },
          { cmd: "ss -tulnp", explain: "Lista puertos TCP/UDP en escucha con el proceso asociado (sustituye a netstat)." },
          { cmd: "dig dominio.com", explain: "Consulta DNS detallada (mejor que nslookup para diagnóstico)." },
          { cmd: "curl -I https://dominio.com", explain: "Comprueba cabeceras HTTP y disponibilidad de un sitio web." }
        ]
      }
    ]
  },
  {
    id: "lin-permisos",
    title: "Permisos, propietarios y ACLs",
    category: "linux",
    subcategory: "Archivos",
    tags: ["chmod", "chown", "permisos", "acl", "setfacl"],
    description: "Gestión de permisos clásicos (rwx) y listas de control de acceso avanzadas (ACL).",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "chmod 755 script.sh", explain: "Permisos rwx para el propietario, r-x para grupo y otros." },
          { cmd: "chmod -R u+rwX,go+rX,go-w /var/www", explain: "Ajusta permisos recursivamente de forma segura (X solo afecta a directorios)." },
          { cmd: "chown usuario:grupo archivo", explain: "Cambia propietario y grupo de un archivo." },
          { cmd: "chown -R www-data:www-data /var/www", explain: "Cambia propietario recursivamente, típico para servidores web." },
          { cmd: "getfacl archivo", explain: "Muestra las ACLs extendidas de un archivo." },
          { cmd: "setfacl -m u:usuario:rwx carpeta", explain: "Da permisos concretos a un usuario sin cambiar el propietario." }
        ]
      }
    ]
  },
  {
    id: "lin-discos-particiones",
    title: "Discos y particiones (fdisk, parted, mkfs, mount)",
    category: "linux",
    subcategory: "Discos",
    tags: ["fdisk", "parted", "mkfs", "mount", "fstab"],
    description: "Crear particiones, formatear y montar discos, incluido montaje persistente.",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "lsblk", explain: "Lista discos y particiones en forma de árbol, con puntos de montaje." },
          { cmd: "sudo fdisk -l", explain: "Lista información detallada de discos y particiones (MBR/GPT)." },
          { cmd: "sudo fdisk /dev/sdb", explain: "Abre el editor interactivo de particiones para /dev/sdb (n=nueva, d=borrar, w=guardar)." },
          { cmd: "sudo parted /dev/sdb --script mklabel gpt mkpart primary ext4 0% 100%", explain: "Crea tabla GPT y una partición ocupando todo el disco, en modo no interactivo." },
          { cmd: "sudo mkfs.ext4 /dev/sdb1", explain: "Formatea la partición en ext4." },
          { cmd: "sudo mount /dev/sdb1 /mnt/datos", explain: "Monta la partición en un punto de montaje existente." },
          { cmd: "echo '/dev/sdb1 /mnt/datos ext4 defaults 0 2' | sudo tee -a /etc/fstab", explain: "Hace el montaje persistente entre reinicios." },
          { cmd: "df -h", explain: "Muestra el espacio usado/libre de cada sistema de archivos montado." }
        ]
      }
    ],
    notes: "Antes de editar /etc/fstab a mano, probar con 'sudo mount -a' para validar la sintaxis sin reiniciar."
  },
  {
    id: "lin-gestion-paquetes",
    title: "Gestión de paquetes (apt, dnf/yum, pacman)",
    category: "linux",
    subcategory: "Administración",
    tags: ["apt", "dnf", "yum", "pacman", "paquetes"],
    description: "Instalar, actualizar y eliminar software según la familia de distribución.",
    cli: [
      {
        os: "Debian / Ubuntu / Mint / Kali / Parrot (apt)",
        commands: [
          { cmd: "sudo apt update && sudo apt upgrade -y", explain: "Actualiza la lista de paquetes y luego instala las actualizaciones disponibles." },
          { cmd: "sudo apt install <paquete>", explain: "Instala un paquete." },
          { cmd: "sudo apt remove --purge <paquete>", explain: "Desinstala un paquete junto con sus ficheros de configuración." },
          { cmd: "sudo apt autoremove", explain: "Elimina dependencias que ya no usa ningún paquete." }
        ]
      },
      {
        os: "Fedora / RHEL / CentOS (dnf/yum)",
        commands: [
          { cmd: "sudo dnf update -y", explain: "Actualiza el sistema completo." },
          { cmd: "sudo dnf install <paquete>", explain: "Instala un paquete." },
          { cmd: "sudo dnf remove <paquete>", explain: "Desinstala un paquete." }
        ]
      },
      {
        os: "Arch / BlackArch (pacman)",
        commands: [
          { cmd: "sudo pacman -Syu", explain: "Sincroniza repositorios y actualiza todo el sistema." },
          { cmd: "sudo pacman -S <paquete>", explain: "Instala un paquete." },
          { cmd: "sudo pacman -Rns <paquete>", explain: "Desinstala un paquete junto con dependencias huérfanas y configuración." }
        ]
      }
    ]
  },
  {
    id: "lin-servicios-systemd",
    title: "Gestión de servicios con systemd",
    category: "linux",
    subcategory: "Administración",
    tags: ["systemctl", "systemd", "servicios", "journalctl"],
    description: "Arrancar, parar, habilitar y depurar servicios del sistema.",
    cli: [
      {
        os: "Linux (systemd)",
        commands: [
          { cmd: "systemctl status ssh", explain: "Muestra el estado de un servicio." },
          { cmd: "sudo systemctl start ssh", explain: "Inicia el servicio." },
          { cmd: "sudo systemctl enable --now ssh", explain: "Habilita el servicio en el arranque y lo inicia ahora mismo." },
          { cmd: "sudo systemctl restart ssh", explain: "Reinicia el servicio." },
          { cmd: "sudo systemctl disable ssh", explain: "Evita que el servicio arranque automáticamente." },
          { cmd: "journalctl -u ssh -f", explain: "Sigue en tiempo real el log de un servicio concreto." },
          { cmd: "journalctl -xe", explain: "Muestra los últimos errores del sistema con explicación extendida." }
        ]
      }
    ]
  },
  {
    id: "lin-usuarios-grupos",
    title: "Usuarios, grupos y sudo",
    category: "linux",
    subcategory: "Administración",
    tags: ["usuarios", "grupos", "sudo", "passwd"],
    description: "Gestión de cuentas locales y permisos de administración.",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "sudo adduser nuevo", explain: "Crea un usuario nuevo de forma interactiva (recomendado sobre useradd)." },
          { cmd: "sudo usermod -aG sudo nuevo", explain: "Añade el usuario al grupo sudo (administradores) en Debian/Ubuntu." },
          { cmd: "sudo passwd nuevo", explain: "Establece o cambia la contraseña de un usuario." },
          { cmd: "sudo deluser nuevo --remove-home", explain: "Elimina un usuario junto con su carpeta personal." },
          { cmd: "groups nuevo", explain: "Muestra a qué grupos pertenece un usuario." },
          { cmd: "id nuevo", explain: "Muestra UID, GID y grupos de un usuario." }
        ]
      }
    ]
  },
  {
    id: "lin-procesos-recursos",
    title: "Procesos y uso de recursos",
    category: "linux",
    subcategory: "Administración",
    tags: ["top", "htop", "ps", "kill", "recursos"],
    description: "Monitorizar procesos y liberar recursos cuando algo se cuelga.",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "top", explain: "Monitor de procesos en tiempo real (uso de CPU/RAM)." },
          { cmd: "htop", explain: "Alternativa a top más visual e interactiva (requiere instalación en algunas distros)." },
          { cmd: "ps aux | grep nombre", explain: "Busca un proceso concreto por nombre." },
          { cmd: "kill -9 <PID>", explain: "Fuerza el cierre de un proceso por su PID." },
          { cmd: "free -h", explain: "Muestra memoria RAM y swap usada/libre en formato legible." },
          { cmd: "du -sh /var/log", explain: "Muestra el tamaño total ocupado por una carpeta." }
        ]
      }
    ]
  },
  {
    id: "lin-logs",
    title: "Registros del sistema (logs)",
    category: "linux",
    subcategory: "Administración",
    tags: ["logs", "journalctl", "syslog", "dmesg"],
    description: "Consultar el histórico del sistema para diagnosticar arranques, fallos de hardware o servicios.",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "journalctl -b", explain: "Muestra todo el log desde el último arranque." },
          { cmd: "journalctl --since \"1 hour ago\"", explain: "Filtra el log por rango de tiempo." },
          { cmd: "dmesg | tail -50", explain: "Muestra los últimos mensajes del kernel (útil para detectar problemas de hardware/USB)." },
          { cmd: "tail -f /var/log/syslog", explain: "Sigue en vivo el log general del sistema (Debian/Ubuntu)." }
        ]
      }
    ]
  }
];
