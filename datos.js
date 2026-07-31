/*
  ESTE ES EL ARCHIVO QUE EDITARAS NORMALMENTE.

  La web esta organizada en tres listas:
  1. BETTAS: bettas individuales.
  2. PAREJAS: parejas seleccionadas.
  3. ACCESORIOS: acuarios, filtros, betta stick, alimentacion, decoracion, etc.

  Fotos:
  - Guarda las imagenes dentro de la carpeta imagenes.
  - Usa el codigo del producto: HM002-1.jpg, HM002-2.jpeg, ACC001-1.png...
  - La web detecta automaticamente .jpg, .jpeg, .png, .webp y mayusculas.

  Videos:
  - Video local: guarda el archivo en videos y escribe videoLocal: "videos/HM002.mp4".
  - TikTok: pega el enlace en videoTikTok.
  - Si no hay video, deja videoLocal: "" y videoTikTok: "".

  Estados:
  - Bettas y parejas: "disponible" o "vendido".
  - Accesorios: "disponible" o "agotado".

  Precios:
  - Sin oferta: precioAnterior: null.
  - Con oferta: precioAnterior con el precio antiguo. El descuento se calcula solo.
*/

const CONFIGURACION = {
  // Formato: codigo de pais + numero, sin espacios ni simbolos.
  // Ejemplo de Espana: 34600111222
  whatsapp: "34603715888",

  // Redes sociales. Puedes cambiar estas direcciones cuando quieras.
  tiktok: "https://www.tiktok.com/@betta_tailandia_en_bcn",
  instagram: "https://www.instagram.com/bettabcn",
  facebook: "https://www.facebook.com/profile.php?id=61590687530711",
};

const BETTAS = [
  {
    codigo: "HM002",
    categoria: "betta",
    variedad: "Halfmoon",
    estado: "disponible",
    sexo: "Macho",
    precio: 40,
    precioAnterior: 45,
    descripcion: "Coloracion segun fotografias.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "KOI001",
    categoria: "betta",
    variedad: "KOI Metalico",
    estado: "disponible",
    sexo: "Macho",
    precio: 39,
    precioAnterior: 42,
    descripcion: "Blanco",
    videoLocal: "",
    videoTikTok: "https://vm.tiktok.com/ZNRcghhvK/",
  },
  {
    codigo: "KOI002",
    categoria: "betta",
    variedad: "KOI Metalico",
    estado: "disponible",
    sexo: "Macho",
    precio: 38,
    precioAnterior: 42,
    descripcion: "Amarillo",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "HB001",
    categoria: "betta",
    variedad: "Hell Boy",
    estado: "vendido",
    sexo: "Macho",
    precio: 39,
    precioAnterior: 45,
    descripcion: "Coloracion segun fotografias.",
    videoLocal: "",
    videoTikTok: "https://vm.tiktok.com/ZNRc72upt/",
  },
  {
    codigo: "HB002",
    categoria: "betta",
    variedad: "Hell Boy",
    estado: "vendido",
    sexo: "Macho",
    precio: 39,
    precioAnterior: 45,
    descripcion: "Coloracion segun fotografias.",
    videoLocal: "",
    videoTikTok: "https://vm.tiktok.com/ZNRc72upt/",
  },
  {
    codigo: "CN001",
    categoria: "betta",
    variedad: "Candy Metalico",
    estado: "vendido",
    sexo: "Macho",
    precio: 39,
    precioAnterior: 42,
    descripcion: "Coloracion segun fotografias.",
    videoLocal: "",
    videoTikTok: "https://vm.tiktok.com/ZNRcWETmK/",
  },
  {
    codigo: "CT001",
    categoria: "betta",
    variedad: "Crowntail",
    estado: "vendido",
    sexo: "Macho",
    precio: 38,
    precioAnterior: 45,
    descripcion: "Coloracion segun fotografias.",
    videoLocal: "",
    videoTikTok: "",
  },
];

const PAREJAS = [
  // Ejemplo para copiar cuando tengas una pareja:
  // {
  //   codigo: "PAR001",
  //   categoria: "pareja",
  //   variedad: "Pareja Hell Boy",
  //   estado: "disponible",
  //   sexo: "Macho + Hembra",
  //   precio: 75,
  //   precioAnterior: null,
  //   descripcion: "Pareja seleccionada para cria.",
  //   videoLocal: "videos/PAR001.mp4",
  //   videoTikTok: "",
  // },
];

const ACCESORIOS = [
  {
    codigo: "AV001",
    categoria: "accesorio",
    tipoAccesorio: "betta-stick",
    nombre: "Varita para betta",
    estado: "disponible",
    precio: 10,
    precioAnterior: null,
    descripcion: "Longitud total de 19cm aprox.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "AV002",
    categoria: "accesorio",
    tipoAccesorio: "betta-stick",
    nombre: "Varita para betta roja",
    estado: "disponible",
    precio: 6,
    precioAnterior: null,
    descripcion: "Rojo.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "APack001",
    categoria: "accesorio",
    tipoAccesorio: "acuario",
    nombre: "Acuario 20 x 20 x 25 kit completo",
    estado: "disponible",
    precio: 70,
    precioAnterior: null,
    descripcion: "Acuario 20cm x 20cm x 25cm + luz + filtro + arena negra + decoracion + red + tapa + sifon de limpieza.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "A202025F",
    categoria: "accesorio",
    tipoAccesorio: "acuario",
    nombre: "Acuario 20 x 20 x 25 + filtro",
    estado: "agotado",
    precio: 29,
    precioAnterior: null,
    descripcion: "Acuario 20cm x 20cm x 25cm + filtro de 5W.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "A202025",
    categoria: "accesorio",
    tipoAccesorio: "acuario",
    nombre: "Acuario 20 x 20 x 25",
    estado: "agotado",
    precio: 20,
    precioAnterior: null,
    descripcion: "Acuario 20cm x 20cm x 25cm.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "A252530F",
    categoria: "accesorio",
    tipoAccesorio: "acuario",
    nombre: "Acuario 25 x 25 x 30 + filtro",
    estado: "agotado",
    precio: 33,
    precioAnterior: null,
    descripcion: "Acuario 25cm x 25cm x 30cm + filtro de 5W.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "A252530",
    categoria: "accesorio",
    tipoAccesorio: "acuario",
    nombre: "Acuario 25 x 25 x 30",
    estado: "agotado",
    precio: 24,
    precioAnterior: null,
    descripcion: "Acuario 25cm x 25cm x 30cm.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "A303035F",
    categoria: "accesorio",
    tipoAccesorio: "acuario",
    nombre: "Acuario 30 x 30 x 35 + filtro",
    estado: "agotado",
    precio: 37,
    precioAnterior: null,
    descripcion: "Acuario 30cm x 30cm x 35cm + filtro de 5W.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "A303035",
    categoria: "accesorio",
    tipoAccesorio: "acuario",
    nombre: "Acuario 30 x 30 x 35",
    estado: "agotado",
    precio: 28,
    precioAnterior: null,
    descripcion: "Acuario 30cm x 30cm x 35cm.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "A5wF",
    categoria: "accesorio",
    tipoAccesorio: "filtro",
    nombre: "Filtro de 5W",
    estado: "agotado",
    precio: 12,
    precioAnterior: null,
    descripcion: "Filtro de 5W.",
    videoLocal: "",
    videoTikTok: "",
  },
  {
    codigo: "A8wF",
    categoria: "accesorio",
    tipoAccesorio: "filtro",
    nombre: "Filtro de 8W",
    estado: "agotado",
    precio: 15,
    precioAnterior: null,
    descripcion: "Filtro de 8W.",
    videoLocal: "",
    videoTikTok: "",
  },
];
