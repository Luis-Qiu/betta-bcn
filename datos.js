/*
  ESTE ES EL ARCHIVO QUE EDITARÁS NORMALMENTE.

  1. Cambia el número de WhatsApp por el tuyo.
  2. Añade o modifica peces dentro de la lista "PECES".
  3. Guarda las fotos dentro de la carpeta "imagenes".
  4. Para individuales y parejas usa "Disponible" o "Vendido".
     Los vendidos quedan guardados, pero no aparecen en la web.
     Para accesorios usa "Disponible" o "Agotado".
     Los accesorios agotados siguen apareciendo con una etiqueta roja.
  5. Nombra las fotos con el código: A1-1.jpg, A1-2.jpg, etc.
     No necesitas escribir las rutas aquí.
  6. Para añadir un vídeo, pega su enlace de TikTok en "video".
     Si no hay vídeo, deja el valor vacío: video: "".
  7. Usa tipo: "individual", "pareja" o "accesorio".
     Las fichas antiguas sin tipo se consideran individuales.
  8. Para ofertas usa precioAnterior. Si no hay oferta, deja:
     precioAnterior: null,
*/

const CONFIGURACION = {
  // Formato: código de país + número, sin espacios ni símbolos.
  // Ejemplo de España: 34600111222
  whatsapp: "34603715888",

  // Redes sociales. Puedes cambiar estas direcciones cuando quieras.
  tiktok: "https://www.tiktok.com/@betta_tailandia_en_bcn",
  instagram: "https://www.instagram.com/bettabcn",
  facebook: "https://www.facebook.com/profile.php?id=61590687530711",
};

const PECES = [
  {
    codigo: "AV001",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Varita para betta",
    //estado: "Disponible" o "Agotado"
    estado: "Disponible",
    precio: 10,
    precioAnterior: null,
    descripcion: "Longitud total de 19cm(aprox.)",
    video: "",
  },
  {
    codigo: "AV002",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Varita para betta",
    //estado: "Disponible" o "Agotado"
    estado: "Disponible",
    precio: 6,
    precioAnterior: null,
    descripcion: "Rojo",
    video: "",
  },
  {
    codigo: "APack001",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Aquarios 20*20*25 Kit Completo",
    //estado: "Disponible" o "Agotado"
    estado: "Disponible",
    precio: 70,
    precioAnterior: null,
    descripcion: "Aquarios 20cm*20cm*25cm + 1 Luz + 1 Filto + 1 Bolsa de Arena color negro + 2 Decoración + 1 Red + 1 Tapa de acuario + 1 Sifón de limpieza",
    video: "",
  },
  {
    codigo: "A202025F",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Aquarios 20*20*25 + Filtro",
    //estado: "Disponible" o "Agotado"
    estado: "Agotado",
    precio: 29,
    precioAnterior: null,
    descripcion: "Aquarios 20cm*20cm*25cm + Filtro de 5W",
    video: "",
  },
  {
    codigo: "A202025",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Aquarios 20*20*25",
    //estado: "Disponible" o "Agotado"
    estado: "Agotado",
    precio: 20,
    precioAnterior: null,
    descripcion: "Aquarios 20cm*20cm*25cm",
    video: "",
  },
  {
    codigo: "A252530F",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Aquarios 25*25*30 + Filtro",
    //estado: "Disponible" o "Agotado"
    estado: "Agotado",
    precio: 33,
    precioAnterior: null,
    descripcion: "Aquarios 25cm*25cm*30cm + Filtro de 5W",
    video: "",
  },
  {
    codigo: "A252530",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Aquarios 25*25*30",
    //estado: "Disponible" o "Agotado"
    estado: "Agotado",
    precio: 24,
    precioAnterior: null,
    descripcion: "Aquarios 25cm*25cm*30cm",
    video: "",
  },
  {
    codigo: "A303035F",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Aquarios 30*30*35 + Filtro",
    //estado: "Disponible" o "Agotado"
    estado: "Agotado",
    precio: 37,
    precioAnterior: null,
    descripcion: "Aquarios 30cm*30cm*35cm + Filtro de 5W",
    video: "",
  },
  {
    codigo: "A303035",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Aquarios 30*30*35",
    //estado: "Disponible" o "Agotado"
    estado: "Agotado",
    precio: 28,
    precioAnterior: null,
    descripcion: "Aquarios 30cm*30cm*35cm",
    video: "",
  },
  {
    codigo: "A5wF",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Filtro de 5w",
    //estado: "Disponible" o "Agotado"
    estado: "Agotado",
    precio: 12,
    precioAnterior: null,
    descripcion: "Filtro de 5w",
    video: "",
  },
  {
    codigo: "A8wF",
    //tipo: "individual", "pareja" o "accesorio"
    tipo: "accesorio",
    variedad: "Filtro de 8w",
    //estado: "Disponible" o "Agotado"
    estado: "Agotado",
    precio: 15,
    precioAnterior: null,
    descripcion: "Filtro de 8w",
    video: "",
  },
  {
    codigo: "HM002",
    tipo: "individual",
    variedad: "Halfmoon",
    //estado: "Disponible" o "Vendido"
    estado: "Disponible",
    sexo: "Macho",
    precio: 40,
    precioAnterior: 45,
    descripcion: "",
    video: "",
  },
  {
    codigo: "KOI001",
    tipo: "individual",
    variedad: "KOI Metalico",
    estado: "Disponible",
    sexo: "Macho",
    precio: 39,
    precioAnterior: 42,
    descripcion: "Blanco",
    video: "https://vm.tiktok.com/ZNRcghhvK/",
  },
  {
    codigo: "KOI002",
    tipo: "individual",
    variedad: "KOI Metalico",
    estado: "Disponible",
    sexo: "Macho",
    precio: 38,
    precioAnterior: 42,
    descripcion: "Amarillo",
    video: "",
  },
  {
    codigo: "HB001",
    tipo: "individual",
    variedad: "Hell Boy",
    estado: "Disponible",
    sexo: "Macho",
    precio: 39,
    precioAnterior: 45,
    descripcion: "",
    video: "https://vm.tiktok.com/ZNRc72upt/",
  },
  {
    codigo: "HB002",
    tipo: "individual",
    variedad: "Hell Boy",
    estado: "Disponible",
    sexo: "Macho",
    precio: 39,
    precioAnterior: 45,
    descripcion: "",
    video: "https://vm.tiktok.com/ZNRc72upt/",
  },
  {
    codigo: "CN001",
    tipo: "individual",
    variedad: "Candy Metálico",
    estado: "Disponible",
    sexo: "Macho",
    precio: 39,
    precioAnterior: 42,
    descripcion: "",
    video: "https://vm.tiktok.com/ZNRcWETmK/",
  },
  //{
  // codigo: "CK001",
  //  tipo: "individual",
  //variedad: "Glow Dumbo",
  //  estado: "Disponible",
  //  sexo: "Macho",
  //  precio: 38,
  //  precioAnterior: 42,
  //  descripcion: "",
  //  video: "https://vm.tiktok.com/ZNRc4RB6A/",
  //},
  //{
  //  codigo: "CK002",
  //  tipo: "individual",
  //  variedad: "Glow Dumbo",
  //  estado: "Disponible",
  //  sexo: "Macho",
  //  precio: 38,
  //  precioAnterior: 42,
  //  descripcion: "",
  //  video: "https://vm.tiktok.com/ZNRc7JgT5/",
  //},
  {
    codigo: "CT001",
    tipo: "individual",
    variedad: "Crowntail",
    estado: "Disponible",
    sexo: "Macho",
    precio: 38,
    precioAnterior: 45,
    descripcion: "",
    video: "",
  },
];
