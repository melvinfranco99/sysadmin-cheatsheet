export const redesData = [
  {
    id: "red-modelo-basico",
    title: "Conceptos rápidos: IP, máscara, gateway, DNS",
    category: "redes",
    subcategory: "Fundamentos",
    tags: ["ip", "mascara", "cidr", "gateway", "dns", "fundamentos"],
    description: "Chuleta rápida de direccionamiento IPv4 para no perder tiempo calculando en el sitio del cliente.",
    notes: "/24 = 255.255.255.0 (254 hosts) · /25 = 255.255.255.128 (126 hosts) · /26 = 255.255.255.192 (62 hosts) · /27 = 255.255.255.224 (30 hosts) · /28 = 255.255.255.240 (14 hosts) · /30 = 255.255.255.252 (2 hosts, típico enlace punto a punto). Rangos privados: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16."
  },
  {
    id: "red-cableado-switch-basico",
    title: "Comprobar conectividad física y enlaces",
    category: "redes",
    subcategory: "Cableado",
    tags: ["cable", "rj45", "enlace", "luces", "switch"],
    description: "Checklist rápido cuando un puesto 'no tiene red'.",
    notes: "1) Comprobar luces del switch en el puerto (link/actividad). 2) Probar el cable con otro dispositivo o un tester de cable. 3) Comprobar que el puerto del switch no esté en una VLAN incorrecta o shutdown. 4) Revisar en el PC: ipconfig/ip a para ver si hay IP (si es APIPA 169.254.x.x, no hay respuesta DHCP). 5) Probar el mismo cable/puerto con un portátil de pruebas para aislar si el problema es el equipo, el cable o el switch."
  },
  {
    id: "red-wifi-diagnostico",
    title: "Diagnóstico Wifi: cobertura e interferencias",
    category: "redes",
    subcategory: "Wifi",
    tags: ["wifi", "cobertura", "canal", "interferencia", "señal"],
    description: "Pasos para diagnosticar problemas de cobertura o velocidad Wifi en oficina.",
    gui: [
      "Usar una app de análisis Wifi (ej. WiFi Analyzer en Android, o el propio panel del router) para ver qué canal usan las redes vecinas.",
      "En routers/AP con 2.4GHz y 5GHz: usar 5GHz para equipos cercanos con buena señal (más velocidad, menos alcance) y 2.4GHz para cobertura a más distancia.",
      "Cambiar el canal 2.4GHz a 1, 6 u 11 (los únicos que no se solapan) si hay muchas redes vecinas."
    ],
    notes: "Los micrhoondas, teléfonos DECT y dispositivos Bluetooth interfieren en 2.4GHz. Paredes de hormigón y metal atenúan mucho la señal 5GHz."
  },
  {
    id: "red-dhcp-vs-estatica",
    title: "Cuándo usar IP dinámica (DHCP) vs estática",
    category: "redes",
    subcategory: "Fundamentos",
    tags: ["dhcp", "ip estática", "servidores", "impresoras"],
    description: "Criterio práctico para decidir el direccionamiento de cada equipo.",
    notes: "IP estática para: servidores, impresoras de red, NAS, cámaras IP, puntos de acceso, y cualquier equipo al que otros se conecten por IP. DHCP para el resto de puestos de usuario. Alternativa recomendada: usar reservas DHCP (IP fija asignada por MAC desde el propio servidor DHCP) para tener lo mejor de ambos mundos: gestión centralizada e IP siempre igual."
  },
  {
    id: "red-vlan-concepto",
    title: "VLANs: para qué sirven y cuándo usarlas",
    category: "redes",
    subcategory: "Fundamentos",
    tags: ["vlan", "segmentación", "switch", "trunk"],
    description: "Segmentación lógica de una red física en varias redes independientes.",
    notes: "Casos típicos en empresa: VLAN de datos (usuarios), VLAN de voz IP, VLAN de invitados (Wifi visitas, sin acceso a la LAN interna), VLAN de gestión de equipos de red, VLAN de servidores. Un puerto 'access' pertenece a una sola VLAN (para PCs); un puerto 'trunk' transporta varias VLANs etiquetadas 802.1Q (para enlaces entre switches o hacia el router/firewall)."
  },
  {
    id: "red-firewall-perimetral-concepto",
    title: "Firewall perimetral: NAT, reglas y DMZ",
    category: "redes",
    subcategory: "Fundamentos",
    tags: ["firewall", "nat", "dmz", "puertos", "reglas"],
    description: "Conceptos clave al configurar un firewall/router perimetral (ver también la ficha de OPNsense).",
    notes: "NAT (Network Address Translation) traduce IPs privadas a la IP pública para salir a Internet. El Port Forwarding (DNAT) publica un servicio interno hacia fuera abriendo un puerto concreto. La DMZ aísla servidores expuestos a Internet (web, correo) del resto de la LAN para que, si se comprometen, no den acceso directo a la red interna. Regla de oro: bloquear todo por defecto y abrir solo lo estrictamente necesario (whitelist, no blacklist)."
  },
  {
    id: "red-velocidad-tests",
    title: "Comprobar velocidad y saturación de red",
    category: "redes",
    subcategory: "Diagnóstico",
    tags: ["velocidad", "ancho de banda", "iperf", "latencia"],
    description: "Herramientas para medir rendimiento real entre dos puntos de la red (no solo Internet).",
    cli: [
      {
        os: "Windows / Linux",
        commands: [
          { cmd: "iperf3 -s", explain: "Levanta un servidor de pruebas de ancho de banda en un equipo (Linux o Windows con iperf3 instalado)." },
          { cmd: "iperf3 -c 192.168.1.10", explain: "Lanza una prueba de velocidad contra el servidor iperf3 desde otro equipo." }
        ]
      }
    ],
    notes: "Un test a velocidad.eu o speedtest.net mide solo la salida a Internet; iperf3 mide el enlace interno real entre dos puntos de la LAN, mucho más útil para diagnosticar el cableado o el switch."
  },
  {
    id: "red-dns-publicos",
    title: "Servidores DNS públicos de referencia",
    category: "redes",
    subcategory: "Fundamentos",
    tags: ["dns", "google dns", "cloudflare"],
    description: "DNS públicos habituales para pruebas o como secundarios.",
    notes: "Google: 8.8.8.8 / 8.8.4.4 · Cloudflare (rápido y centrado en privacidad): 1.1.1.1 / 1.0.0.1 · Quad9 (con filtrado de seguridad): 9.9.9.9. Útil para descartar si un problema de 'no carga ninguna web' es el DNS del ISP: cambiar temporalmente a 1.1.1.1 y volver a probar."
  }
];
