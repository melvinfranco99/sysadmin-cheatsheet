export const adData = [
  {
    id: "ad-instalar-addsforest",
    title: "Instalar AD DS y promover a controlador de dominio",
    category: "ad",
    subcategory: "Instalación",
    tags: ["active directory", "addsforest", "controlador de dominio", "bosque"],
    description: "Primer paso para crear un dominio nuevo desde cero en Windows Server.",
    gui: [
      "Administrador del servidor > Agregar roles y características > Servicios de dominio de Active Directory (AD DS).",
      "Tras instalar el rol, aparece una notificación (bandera amarilla) > 'Promover este servidor a controlador de dominio'.",
      "Elegir 'Agregar un nuevo bosque', indicar el nombre de dominio raíz (ej. empresa.local), establecer contraseña DSRM y completar el asistente (reinicia el servidor al finalizar)."
    ],
    cli: [
      {
        os: "Windows Server (PowerShell, como administrador)",
        commands: [
          { cmd: "Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools", explain: "Instala el rol de Servicios de dominio de Active Directory." },
          { cmd: 'Install-ADDSForest -DomainName "empresa.local" -DomainNetbiosName "EMPRESA" -InstallDns', explain: "Crea un bosque y dominio nuevos, instalando también el rol DNS integrado. Pide la contraseña DSRM y reinicia al terminar." }
        ]
      }
    ],
    notes: "Usar siempre un dominio con sufijo no público (.local, .lan, .internal o un subdominio dedicado) para evitar conflictos con DNS de Internet."
  },
  {
    id: "ad-ou-usuarios-grupos",
    title: "Crear Unidades Organizativas, usuarios y grupos",
    category: "ad",
    subcategory: "Objetos",
    tags: ["ou", "usuarios", "grupos", "aduc"],
    description: "Organizar el dominio en Unidades Organizativas (OU) y dar de alta usuarios y grupos.",
    gui: [
      "Herramientas > Usuarios y equipos de Active Directory (ADUC).",
      "Clic derecho sobre el dominio > Nuevo > Unidad organizativa (marcar 'Proteger contra eliminación accidental').",
      "Dentro de la OU: clic derecho > Nuevo > Usuario / Grupo, y rellenar el asistente."
    ],
    cli: [
      {
        os: "Windows Server (PowerShell, como administrador)",
        commands: [
          { cmd: 'New-ADOrganizationalUnit -Name "Administracion" -Path "DC=empresa,DC=local"', explain: "Crea una nueva Unidad Organizativa en la raíz del dominio." },
          { cmd: 'New-ADUser -Name "Juan Perez" -SamAccountName jperez -UserPrincipalName jperez@empresa.local -Path "OU=Administracion,DC=empresa,DC=local" -AccountPassword (Read-Host -AsSecureString "Contraseña") -Enabled $true', explain: "Crea un usuario en una OU concreta con contraseña y cuenta activada." },
          { cmd: 'New-ADGroup -Name "GG_Administracion" -GroupScope Global -GroupCategory Security -Path "OU=Administracion,DC=empresa,DC=local"', explain: "Crea un grupo de seguridad de ámbito global." },
          { cmd: 'Add-ADGroupMember -Identity "GG_Administracion" -Members jperez', explain: "Añade un usuario a un grupo." },
          { cmd: "Get-ADUser -Filter * -SearchBase \"OU=Administracion,DC=empresa,DC=local\"", explain: "Lista los usuarios existentes dentro de una OU." }
        ]
      }
    ],
    notes: "Convención habitual: OUs por departamento/ubicación, grupos globales (GG_) para agrupar usuarios y grupos de dominio local (DL_) para asignar permisos sobre recursos (modelo AGDLP)."
  },
  {
    id: "ad-unir-equipo-dominio",
    title: "Unir un equipo Windows al dominio",
    category: "ad",
    subcategory: "Equipos",
    tags: ["unir dominio", "add-computer", "equipo cliente"],
    description: "Incorporar un PC/portátil Windows al dominio de Active Directory.",
    gui: [
      "Configuración > Sistema > Acerca de > Configuración avanzada del sistema > pestaña Nombre de equipo > Cambiar.",
      "Marcar 'Dominio', escribir el nombre del dominio (ej. empresa.local) e introducir credenciales de un usuario con permiso para unir equipos.",
      "Reiniciar el equipo para que el cambio surta efecto."
    ],
    cli: [
      {
        os: "Windows (PowerShell, como administrador, en el equipo cliente)",
        commands: [
          { cmd: 'Add-Computer -DomainName "empresa.local" -Credential (Get-Credential) -Restart', explain: "Une el equipo al dominio pidiendo credenciales y reinicia automáticamente." },
          { cmd: "Test-ComputerSecureChannel", explain: "Comprueba si la relación de confianza del equipo con el dominio es correcta (útil cuando un PC 'pierde' el dominio)." },
          { cmd: "Test-ComputerSecureChannel -Repair", explain: "Repara la relación de confianza sin necesidad de sacar y volver a meter el equipo del dominio." }
        ]
      }
    ]
  },
  {
    id: "ad-gpo",
    title: "Directivas de grupo (GPO) básicas",
    category: "ad",
    subcategory: "GPO",
    tags: ["gpo", "gpmc", "directivas de grupo", "gpupdate"],
    description: "Crear y aplicar una GPO para centralizar configuración en los equipos del dominio.",
    gui: [
      "Herramientas > Administración de directivas de grupo (GPMC).",
      "Clic derecho sobre la OU deseada > Crear un GPO en este dominio y vincularlo aquí.",
      "Clic derecho sobre la GPO > Editar, y navegar por Configuración de equipo / Configuración de usuario > Directivas / Preferencias.",
      "Casos típicos: fondo de pantalla corporativo, mapeo de unidades de red, restricción de USB, política de contraseñas, instalación de software."
    ],
    cli: [
      {
        os: "Windows (equipo cliente o servidor, CMD/PowerShell)",
        commands: [
          { cmd: "gpupdate /force", explain: "Fuerza la aplicación inmediata de las GPOs sin esperar al ciclo automático." },
          { cmd: "gpresult /r", explain: "Muestra qué GPOs se están aplicando (o no) al usuario/equipo actual." },
          { cmd: "gpresult /h informe.html", explain: "Genera un informe HTML detallado de aplicación de directivas, útil para depurar." },
          { cmd: "rsop.msc", explain: "Abre una consola gráfica con el resultado de directivas aplicadas (Resultant Set of Policy)." }
        ]
      }
    ]
  },
  {
    id: "ad-dns-dhcp-integrado",
    title: "DNS y DHCP integrados en el dominio",
    category: "ad",
    subcategory: "Infraestructura",
    tags: ["dns", "dhcp", "active directory", "integrado"],
    description: "Consideraciones al usar los roles DNS/DHCP junto con Active Directory.",
    notes: "El DNS debe estar integrado en AD (zona 'Integrada en Active Directory') para que la replicación entre controladores de dominio sea automática. El servidor DHCP debe estar autorizado en AD (Add-DhcpServerInDC) o los clientes de dominio ignorarán sus ofertas. Ver también las fichas de [[srv-dns-windows]] y [[srv-dhcp-windows]] en la sección Servidores."
  },
  {
    id: "ad-papelera-reciclaje",
    title: "Papelera de reciclaje de Active Directory",
    category: "ad",
    subcategory: "Recuperación",
    tags: ["papelera", "recuperar objeto", "usuario eliminado"],
    description: "Recuperar un usuario, grupo o equipo eliminado por error sin restaurar backup completo.",
    gui: [
      "Debe activarse antes de necesitarla: Centro de administración de Active Directory > clic derecho en el dominio > Habilitar la Papelera de reciclaje (irreversible, sube el nivel funcional del bosque).",
      "Una vez activada: Centro de administración de Active Directory > contenedor 'Deleted Objects' > clic derecho sobre el objeto > Restaurar."
    ],
    cli: [
      {
        os: "Windows Server (PowerShell, como administrador)",
        commands: [
          { cmd: 'Enable-ADOptionalFeature -Identity "Recycle Bin Feature" -Scope ForestOrConfigurationSet -Target "empresa.local"', explain: "Activa la papelera de reciclaje del bosque (una sola vez, no se puede desactivar después)." },
          { cmd: "Get-ADObject -Filter 'isDeleted -eq $true' -IncludeDeletedObjects", explain: "Lista los objetos eliminados recuperables." },
          { cmd: "Get-ADObject -Filter {displayName -eq \"Juan Perez\"} -IncludeDeletedObjects | Restore-ADObject", explain: "Restaura un objeto eliminado concreto." }
        ]
      }
    ],
    notes: "Sin la papelera activada, recuperar un objeto eliminado requiere restaurar un backup del sistema (System State) del controlador de dominio: mucho más lento y arriesgado."
  },
  {
    id: "ad-diagnostico",
    title: "Diagnóstico de Active Directory (dcdiag, repadmin, nltest)",
    category: "ad",
    subcategory: "Diagnóstico",
    tags: ["dcdiag", "repadmin", "nltest", "replicación"],
    description: "Comandos para comprobar la salud de un controlador de dominio y la replicación entre varios.",
    cli: [
      {
        os: "Windows Server (CMD/PowerShell, como administrador)",
        commands: [
          { cmd: "dcdiag /v", explain: "Ejecuta un diagnóstico completo del controlador de dominio (DNS, replicación, servicios, permisos...)." },
          { cmd: "repadmin /replsummary", explain: "Resumen del estado de replicación entre todos los controladores de dominio." },
          { cmd: "repadmin /showrepl", explain: "Muestra el detalle de la última replicación entrante/saliente del DC actual." },
          { cmd: "nltest /dsgetdc:empresa.local", explain: "Comprueba qué controlador de dominio está sirviendo al equipo actual." },
          { cmd: "nltest /sc_query:empresa.local", explain: "Comprueba el estado del canal seguro del equipo con el dominio." },
          { cmd: "whoami /all", explain: "Muestra el usuario actual, sus grupos y privilegios (útil para verificar pertenencia a grupos tras un cambio)." }
        ]
      }
    ]
  }
];
