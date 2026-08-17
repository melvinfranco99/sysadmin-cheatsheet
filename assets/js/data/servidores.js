export const servidoresData = [
  {
    id: "srv-dns-windows",
    title: "Servidor DNS en Windows Server",
    category: "servidores",
    subcategory: "DNS",
    tags: ["dns", "windows server", "zona", "registro"],
    description: "Instalar y configurar el rol DNS en Windows Server, con una zona directa básica.",
    gui: [
      "Administrador del servidor > Agregar roles y características > Servidor DNS.",
      "Herramientas > DNS > botón derecho en 'Zonas de búsqueda directa' > Zona nueva > Zona principal.",
      "Dentro de la zona, botón derecho > Host nuevo (A) para añadir registros de equipos/servicios."
    ],
    cli: [
      {
        os: "Windows Server (PowerShell, como administrador)",
        commands: [
          { cmd: "Install-WindowsFeature -Name DNS -IncludeManagementTools", explain: "Instala el rol de servidor DNS." },
          { cmd: 'Add-DnsServerPrimaryZone -Name "empresa.local" -ZoneFile "empresa.local.dns"', explain: "Crea una zona de búsqueda directa principal." },
          { cmd: 'Add-DnsServerResourceRecordA -ZoneName "empresa.local" -Name "servidor1" -IPv4Address 192.168.1.10', explain: "Añade un registro A (nombre de host)." },
          { cmd: 'Add-DnsServerResourceRecordCName -ZoneName "empresa.local" -Name "web" -HostNameAlias "servidor1.empresa.local"', explain: "Añade un alias (CNAME) apuntando a otro registro." },
          { cmd: "Clear-DnsServerCache", explain: "Limpia la caché del servidor DNS." }
        ]
      }
    ]
  },
  {
    id: "srv-dns-linux-bind",
    title: "Servidor DNS en Linux (BIND9)",
    category: "servidores",
    subcategory: "DNS",
    tags: ["dns", "bind9", "named", "zona"],
    description: "Instalar y configurar un servidor DNS BIND9 con una zona básica.",
    cli: [
      {
        os: "Linux (Debian/Ubuntu)",
        commands: [
          { cmd: "sudo apt install bind9 bind9utils", explain: "Instala el servidor DNS BIND9." },
          { cmd: "sudo nano /etc/bind/named.conf.local", explain: "Define la zona, ej:\nzone \"empresa.local\" {\n  type master;\n  file \"/etc/bind/db.empresa.local\";\n};" },
          { cmd: "sudo cp /etc/bind/db.local /etc/bind/db.empresa.local", explain: "Copia una plantilla de zona como punto de partida y se edita con los registros A/CNAME/MX necesarios." },
          { cmd: "sudo named-checkzone empresa.local /etc/bind/db.empresa.local", explain: "Valida la sintaxis del fichero de zona antes de aplicarlo." },
          { cmd: "sudo systemctl restart bind9", explain: "Aplica los cambios reiniciando el servicio." },
          { cmd: "dig @localhost servidor1.empresa.local", explain: "Comprueba que el servidor resuelve correctamente el registro." }
        ]
      }
    ]
  },
  {
    id: "srv-dhcp-windows",
    title: "Servidor DHCP en Windows Server",
    category: "servidores",
    subcategory: "DHCP",
    tags: ["dhcp", "windows server", "ámbito", "reserva"],
    description: "Instalar el rol DHCP y crear un ámbito (rango de IPs) para la red de usuarios.",
    gui: [
      "Administrador del servidor > Agregar roles y características > Servidor DHCP.",
      "Herramientas > DHCP > botón derecho en IPv4 > Ámbito nuevo > definir rango de IPs, máscara, exclusiones y duración de concesión.",
      "Autorizar el servidor DHCP en el dominio (obligatorio en entorno con Active Directory, si no las peticiones se ignoran)."
    ],
    cli: [
      {
        os: "Windows Server (PowerShell, como administrador)",
        commands: [
          { cmd: "Install-WindowsFeature -Name DHCP -IncludeManagementTools", explain: "Instala el rol de servidor DHCP." },
          { cmd: 'Add-DhcpServerv4Scope -Name "Usuarios" -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0', explain: "Crea un ámbito con el rango de IPs a repartir." },
          { cmd: "Set-DhcpServerv4OptionValue -Router 192.168.1.1 -DnsServer 192.168.1.10", explain: "Configura puerta de enlace y DNS que se entregan a los clientes." },
          { cmd: 'Add-DhcpServerv4Reservation -ScopeId 192.168.1.0 -IPAddress 192.168.1.150 -ClientId "AA-BB-CC-DD-EE-FF"', explain: "Crea una reserva DHCP (IP fija por MAC) para una impresora o servidor." },
          { cmd: "Add-DhcpServerInDC", explain: "Autoriza el servidor DHCP en Active Directory." }
        ]
      }
    ]
  },
  {
    id: "srv-dhcp-linux",
    title: "Servidor DHCP en Linux (isc-dhcp-server)",
    category: "servidores",
    subcategory: "DHCP",
    tags: ["dhcp", "isc-dhcp-server", "linux"],
    description: "Configurar un servidor DHCP en Linux para redes pequeñas o de laboratorio.",
    cli: [
      {
        os: "Linux (Debian/Ubuntu)",
        commands: [
          { cmd: "sudo apt install isc-dhcp-server", explain: "Instala el servidor DHCP." },
          { cmd: "sudo nano /etc/dhcp/dhcpd.conf", explain: "Define la subred y rango, ej:\nsubnet 192.168.1.0 netmask 255.255.255.0 {\n  range 192.168.1.100 192.168.1.200;\n  option routers 192.168.1.1;\n  option domain-name-servers 8.8.8.8;\n}" },
          { cmd: "sudo nano /etc/default/isc-dhcp-server", explain: "Indica en INTERFACESv4 la interfaz de red por la que se debe escuchar (ej. eth0)." },
          { cmd: "sudo systemctl restart isc-dhcp-server", explain: "Aplica la configuración." }
        ]
      }
    ]
  },
  {
    id: "srv-web-apache-nginx",
    title: "Servidor web (Apache / Nginx)",
    category: "servidores",
    subcategory: "Web",
    tags: ["apache", "nginx", "web", "http"],
    description: "Instalación básica de un servidor web en Linux.",
    cli: [
      {
        os: "Linux — Apache",
        commands: [
          { cmd: "sudo apt install apache2", explain: "Instala Apache." },
          { cmd: "sudo systemctl enable --now apache2", explain: "Habilita e inicia el servicio (por defecto sirve en el puerto 80)." },
          { cmd: "sudo nano /etc/apache2/sites-available/misitio.conf", explain: "Crea un VirtualHost para alojar un sitio concreto." },
          { cmd: "sudo a2ensite misitio.conf && sudo systemctl reload apache2", explain: "Activa el sitio y recarga la configuración." }
        ]
      },
      {
        os: "Linux — Nginx",
        commands: [
          { cmd: "sudo apt install nginx", explain: "Instala Nginx." },
          { cmd: "sudo systemctl enable --now nginx", explain: "Habilita e inicia el servicio." },
          { cmd: "sudo nginx -t", explain: "Valida la sintaxis de la configuración antes de recargar." },
          { cmd: "sudo systemctl reload nginx", explain: "Aplica cambios de configuración sin cortar conexiones activas." }
        ]
      }
    ]
  },
  {
    id: "srv-iis-windows",
    title: "Servidor web IIS en Windows Server",
    category: "servidores",
    subcategory: "Web",
    tags: ["iis", "windows server", "web"],
    description: "Instalar y publicar un sitio básico con Internet Information Services.",
    gui: [
      "Administrador del servidor > Agregar roles y características > Servidor web (IIS).",
      "Herramientas > Administrador de Internet Information Services (IIS).",
      "Sitios > Agregar sitio web > indicar ruta física, puerto y binding de host."
    ],
    cli: [
      {
        os: "Windows Server (PowerShell, como administrador)",
        commands: [
          { cmd: "Install-WindowsFeature -Name Web-Server -IncludeManagementTools", explain: "Instala el rol IIS." },
          { cmd: 'New-Website -Name "MiSitio" -Port 8080 -PhysicalPath "C:\\inetpub\\misitio"', explain: "Crea un nuevo sitio web en un puerto concreto." },
          { cmd: "Restart-WebAppPool -Name \"DefaultAppPool\"", explain: "Reinicia el pool de aplicaciones (útil tras desplegar cambios)." }
        ]
      }
    ]
  },
  {
    id: "srv-ssh-hardening",
    title: "Servidor SSH y hardening básico",
    category: "servidores",
    subcategory: "SSH",
    tags: ["ssh", "sshd", "hardening", "acceso remoto"],
    description: "Instalar acceso remoto por SSH y aplicar medidas básicas de seguridad.",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "sudo apt install openssh-server", explain: "Instala el servidor SSH." },
          { cmd: "sudo systemctl enable --now ssh", explain: "Habilita e inicia el servicio." },
          { cmd: "sudo nano /etc/ssh/sshd_config", explain: "Ajustes recomendados: PermitRootLogin no · PasswordAuthentication no (usar solo claves) · Port distinto de 22 opcionalmente." },
          { cmd: "ssh-keygen -t ed25519", explain: "Genera un par de claves SSH (ejecutar en el cliente, no en el servidor)." },
          { cmd: "ssh-copy-id usuario@servidor", explain: "Copia la clave pública al servidor para poder entrar sin contraseña." },
          { cmd: "sudo systemctl restart ssh", explain: "Aplica los cambios de sshd_config." }
        ]
      },
      {
        os: "Windows Server (PowerShell, como administrador)",
        commands: [
          { cmd: "Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0", explain: "Instala el servidor OpenSSH en Windows Server / Windows 11." },
          { cmd: "Start-Service sshd; Set-Service -Name sshd -StartupType Automatic", explain: "Inicia el servicio y lo deja configurado para arrancar automáticamente." }
        ]
      }
    ],
    notes: "Nunca dejar un servidor SSH expuesto a Internet con contraseña y puerto 22 por defecto: usar claves, fail2ban (Linux) y, si es posible, VPN en vez de exponer el puerto directamente."
  }
];
