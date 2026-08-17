export const compartirData = [
  {
    id: "comp-smb-windows",
    title: "Compartir carpetas en red (Windows)",
    category: "compartir",
    subcategory: "SMB",
    tags: ["smb", "compartir", "carpeta", "red"],
    description: "Compartir una carpeta desde Windows para que otros equipos accedan a ella por red.",
    gui: [
      "Clic derecho en la carpeta > Propiedades > pestaña Compartir > Uso compartido avanzado.",
      "Marcar 'Compartir esta carpeta', poner nombre de recurso y pulsar Permisos para dar acceso a usuarios/grupos.",
      "En la pestaña Seguridad, ajustar también los permisos NTFS (los más restrictivos entre Compartir y NTFS son los que aplican)."
    ],
    cli: [
      {
        os: "Windows (PowerShell, como administrador)",
        commands: [
          { cmd: 'New-SmbShare -Name "Datos" -Path "C:\\Datos" -FullAccess "Everyone"', explain: "Comparte una carpeta con acceso total (ajustar el grupo/usuario según necesidad real)." },
          { cmd: "Get-SmbShare", explain: "Lista los recursos compartidos actuales del equipo." },
          { cmd: 'Grant-SmbShareAccess -Name "Datos" -AccountName "DOMINIO\\Usuario" -AccessRight Change', explain: "Concede permiso de modificación a un usuario/grupo concreto sobre el recurso." },
          { cmd: 'Remove-SmbShare -Name "Datos"', explain: "Deja de compartir el recurso." }
        ]
      }
    ]
  },
  {
    id: "comp-acceder-recurso-windows",
    title: "Acceder a un recurso compartido desde Windows",
    category: "compartir",
    subcategory: "SMB",
    tags: ["net use", "unidad de red", "smb"],
    description: "Mapear una unidad de red o acceder puntualmente a un recurso compartido.",
    gui: [
      "Explorador de archivos > Este equipo > Conectar a unidad de red > introducir \\\\servidor\\recurso."
    ],
    cli: [
      {
        os: "Windows (CMD/PowerShell)",
        commands: [
          { cmd: "net use Z: \\\\servidor\\Datos /persistent:yes", explain: "Mapea la unidad Z: a un recurso compartido, persistente entre reinicios." },
          { cmd: 'net use Z: \\\\servidor\\Datos /user:DOMINIO\\usuario', explain: "Mapea especificando credenciales distintas a las de la sesión actual." },
          { cmd: "net use Z: /delete", explain: "Desconecta una unidad de red mapeada." },
          { cmd: "net view \\\\servidor", explain: "Lista los recursos compartidos disponibles en un servidor." }
        ]
      }
    ]
  },
  {
    id: "comp-samba-linux",
    title: "Servidor Samba en Linux (compartir con Windows)",
    category: "compartir",
    subcategory: "SMB",
    tags: ["samba", "smb.conf", "compartir", "linux"],
    description: "Configurar un servidor Linux para compartir carpetas visibles desde equipos Windows.",
    cli: [
      {
        os: "Linux (Debian/Ubuntu)",
        commands: [
          { cmd: "sudo apt install samba", explain: "Instala el servidor Samba." },
          { cmd: "sudo nano /etc/samba/smb.conf", explain: "Edita la configuración; al final añadir un bloque de recurso, ej:\n[Datos]\n   path = /srv/datos\n   browseable = yes\n   read only = no\n   valid users = usuario" },
          { cmd: "sudo smbpasswd -a usuario", explain: "Crea la contraseña Samba para un usuario del sistema (necesaria además de la del propio Linux)." },
          { cmd: "sudo systemctl restart smbd", explain: "Aplica los cambios reiniciando el servicio." },
          { cmd: "testparm", explain: "Valida la sintaxis de smb.conf antes de reiniciar el servicio." }
        ]
      }
    ]
  },
  {
    id: "comp-montar-smb-linux",
    title: "Montar un recurso SMB de Windows en Linux",
    category: "compartir",
    subcategory: "SMB",
    tags: ["mount", "cifs", "smbclient", "montar"],
    description: "Acceder desde Linux a una carpeta compartida por un servidor o PC Windows.",
    cli: [
      {
        os: "Linux",
        commands: [
          { cmd: "smbclient -L //servidor -U usuario", explain: "Lista los recursos compartidos disponibles en un servidor Windows/Samba." },
          { cmd: "sudo mount -t cifs //servidor/Datos /mnt/datos -o username=usuario,password=clave,vers=3.0", explain: "Monta el recurso compartido en un punto de montaje local." },
          { cmd: "//servidor/Datos /mnt/datos cifs credentials=/root/.smbcred,vers=3.0 0 0", explain: "Línea a añadir en /etc/fstab para montaje persistente (usar fichero de credenciales en vez de contraseña en claro)." }
        ]
      }
    ]
  },
  {
    id: "comp-nfs",
    title: "Compartir con NFS (entornos Linux/Unix)",
    category: "compartir",
    subcategory: "NFS",
    tags: ["nfs", "linux", "unix", "exportfs"],
    description: "Compartir carpetas entre sistemas Linux/Unix con NFS, más ligero que Samba en entornos homogéneos.",
    cli: [
      {
        os: "Linux — Servidor",
        commands: [
          { cmd: "sudo apt install nfs-kernel-server", explain: "Instala el servidor NFS." },
          { cmd: 'echo "/srv/datos 192.168.1.0/24(rw,sync,no_subtree_check)" | sudo tee -a /etc/exports', explain: "Define qué carpeta se comparte y con qué permisos/red." },
          { cmd: "sudo exportfs -ra", explain: "Recarga la configuración de recursos exportados." }
        ]
      },
      {
        os: "Linux — Cliente",
        commands: [
          { cmd: "sudo apt install nfs-common", explain: "Instala las utilidades cliente NFS." },
          { cmd: "sudo mount 192.168.1.10:/srv/datos /mnt/datos", explain: "Monta el recurso NFS remoto." }
        ]
      }
    ]
  },
  {
    id: "comp-ftp-sftp",
    title: "FTP y SFTP",
    category: "compartir",
    subcategory: "FTP",
    tags: ["ftp", "sftp", "vsftpd", "transferencia"],
    description: "Transferencia de ficheros con FTP (sin cifrar, evitar en redes no confiables) o SFTP (sobre SSH, cifrado).",
    cli: [
      {
        os: "Linux — Servidor FTP",
        commands: [
          { cmd: "sudo apt install vsftpd", explain: "Instala un servidor FTP ligero y seguro." },
          { cmd: "sudo systemctl enable --now vsftpd", explain: "Habilita e inicia el servicio." }
        ]
      },
      {
        os: "Cliente (Windows/Linux)",
        commands: [
          { cmd: "sftp usuario@servidor", explain: "Conecta por SFTP (usa el puerto 22 de SSH, cifrado)." },
          { cmd: "get fichero.txt", explain: "Dentro de una sesión sftp: descarga un fichero del servidor." },
          { cmd: "put fichero.txt", explain: "Dentro de una sesión sftp: sube un fichero al servidor." }
        ]
      }
    ],
    notes: "Para uso gráfico, FileZilla (multiplataforma) soporta FTP, FTPS y SFTP con arrastrar y soltar."
  },
  {
    id: "comp-scp-rsync",
    title: "Copiar entre equipos: scp y rsync",
    category: "compartir",
    subcategory: "Transferencia",
    tags: ["scp", "rsync", "copiar", "ssh"],
    description: "Transferencia de archivos por SSH, ideal para servidores Linux sin recurso compartido montado.",
    cli: [
      {
        os: "Linux / macOS / Windows (con OpenSSH)",
        commands: [
          { cmd: "scp archivo.txt usuario@servidor:/home/usuario/", explain: "Copia un archivo local a un servidor remoto por SSH." },
          { cmd: "scp -r carpeta/ usuario@servidor:/home/usuario/", explain: "Copia una carpeta completa de forma recursiva." },
          { cmd: "rsync -avz --progress carpeta/ usuario@servidor:/destino/", explain: "Sincroniza una carpeta de forma eficiente (solo transfiere lo que ha cambiado), con compresión y barra de progreso." },
          { cmd: "rsync -avz --delete carpeta/ usuario@servidor:/destino/", explain: "Sincroniza en modo espejo, borrando en destino lo que ya no existe en origen." }
        ]
      }
    ],
    notes: "rsync es la herramienta recomendada frente a scp para backups periódicos: es incremental y mucho más rápida en sincronizaciones repetidas."
  }
];
