const lista = document.querySelector("#lista-peces");
const sinResultados = document.querySelector("#sin-resultados");
const sinResultadosTitulo = document.querySelector("#sin-resultados-titulo");
const sinResultadosTexto = document.querySelector("#sin-resultados-texto");
const buscador = document.querySelector("#buscador");
const filtrosCatalogo = document.querySelector("#filtros-catalogo");
const filtrosAccesorios = document.querySelector("#filtros-accesorios");
const whatsappFlotante = document.querySelector("#whatsapp-flotante");
const visor = document.querySelector("#visor");
const imagenAmpliada = document.querySelector("#imagen-ampliada");
const pieImagen = document.querySelector("#pie-imagen");
const cerrarVisor = document.querySelector("#cerrar-visor");
const visorVideo = document.querySelector("#visor-video");
const videoAmpliado = document.querySelector("#video-ampliado");
const pieVideo = document.querySelector("#pie-video");
const cerrarVideo = document.querySelector("#cerrar-video");

const FORMATOS_IMAGEN = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "JPG",
  "JPEG",
  "PNG",
  "WEBP",
];

const FILTROS_PRINCIPALES = [
  ["todos", "Todos"],
  ["bettas", "Bettas"],
  ["parejas", "Parejas"],
  ["accesorios", "Accesorios"],
  ["disponibles", "Disponibles"],
  ["vendidos", "Vendidos"],
];

const FILTROS_ACCESORIOS = [
  ["todos-accesorios", "Todos los accesorios", ""],
  ["acuario", "Acuarios", "acuario"],
  ["filtro", "Filtros", "filtro"],
  ["betta-stick", "Betta Stick", "betta-stick"],
  ["alimentacion", "Alimentacion", "alimentacion"],
  ["decoracion", "Decoracion", "decoracion"],
];

let filtroActivo = "todos";
let filtroAccesorioActivo = "todos-accesorios";
const tarjetasCatalogo = [];

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function categoriaProducto(producto) {
  const categoria = normalizarTexto(producto.categoria);
  if (categoria === "betta" || categoria === "pareja" || categoria === "accesorio") return categoria;
  const tipo = normalizarTexto(producto.tipo);
  if (tipo === "pareja" || tipo === "accesorio") return tipo;
  return "betta";
}

function estadoProducto(producto) {
  return normalizarTexto(producto.estado || "disponible");
}

function tipoAccesorio(producto) {
  return normalizarTexto(producto.tipoAccesorio || "otro") || "otro";
}

function nombreProducto(producto) {
  return String(producto.nombre || producto.variedad || producto.codigo).trim();
}

function todosLosProductos() {
  const bettas = typeof BETTAS !== "undefined" && Array.isArray(BETTAS) ? BETTAS : [];
  const parejas = typeof PAREJAS !== "undefined" && Array.isArray(PAREJAS) ? PAREJAS : [];
  const accesorios = typeof ACCESORIOS !== "undefined" && Array.isArray(ACCESORIOS) ? ACCESORIOS : [];
  const legado = typeof PECES !== "undefined" && Array.isArray(PECES) ? PECES : [];
  return [...bettas, ...parejas, ...accesorios, ...legado];
}

function productoVisible(producto) {
  const categoria = categoriaProducto(producto);
  const estado = estadoProducto(producto);
  if (categoria === "accesorio") return estado === "disponible" || estado === "agotado";
  return estado === "disponible" || estado === "vendido";
}

function pesoOrden(producto) {
  const categoria = categoriaProducto(producto);
  const estado = estadoProducto(producto);
  if ((categoria === "betta" || categoria === "pareja") && estado === "disponible") return 1;
  if ((categoria === "betta" || categoria === "pareja") && estado === "vendido") return 2;
  if (categoria === "accesorio" && estado === "disponible") return 3;
  if (categoria === "accesorio" && estado === "agotado") return 4;
  return 9;
}

function textoBuscable(producto) {
  return normalizarTexto([
    producto.codigo,
    producto.nombre,
    producto.variedad,
    producto.descripcion,
    producto.sexo,
    producto.categoria,
    producto.tipoAccesorio,
    producto.estado,
  ].join(" "));
}

function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${CONFIGURACION.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

function enlaceTikTokValido(valor) {
  if (typeof valor !== "string" || valor.trim() === "") return null;
  try {
    const url = new URL(valor.trim());
    const dominio = url.hostname.toLowerCase();
    return url.protocol === "https:" && (dominio === "tiktok.com" || dominio.endsWith(".tiktok.com"))
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function numeroPrecio(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

function formatoPrecio(valor) {
  const numero = numeroPrecio(valor);
  if (numero === null) return String(valor || "");
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(numero);
}

function htmlPrecio(producto) {
  const precio = numeroPrecio(producto.precio);
  const precioAnterior = numeroPrecio(producto.precioAnterior);
  const tieneOferta = precio !== null && precioAnterior !== null && precioAnterior > precio;
  if (!tieneOferta) return `<span class="precio">${formatoPrecio(producto.precio)} €</span>`;
  const descuento = Math.round(((precioAnterior - precio) / precioAnterior) * 100);
  return `
    <div class="bloque-precio precio-oferta">
      <span class="precio-anterior">${formatoPrecio(precioAnterior)} €</span>
      <span class="precio">${formatoPrecio(precio)} €</span>
      <span class="etiqueta-oferta">-${descuento}%</span>
    </div>
  `;
}

function comprobarImagen(ruta) {
  return new Promise((resolver) => {
    const imagen = new Image();
    const terminar = (resultado) => {
      imagen.onload = null;
      imagen.onerror = null;
      resolver(resultado);
    };

    imagen.onload = () => {
      if (typeof imagen.decode !== "function") {
        terminar(ruta);
        return;
      }

      imagen.decode()
        .then(() => terminar(ruta))
        .catch(() => terminar(null));
    };
    imagen.onerror = () => terminar(null);
    imagen.src = ruta;
  });
}

async function detectarPrimerFormato(nombreBase) {
  for (const formato of FORMATOS_IMAGEN) {
    const ruta = `imagenes/${nombreBase}.${formato}`;
    const encontrada = await comprobarImagen(ruta);
    if (encontrada) return encontrada;
  }
  return null;
}

async function detectarFotos(codigo) {
  const codigoSeguro = String(codigo).trim();
  const fotos = [];

  for (let numeroFoto = 1; numeroFoto <= 5; numeroFoto += 1) {
    const encontrada = await detectarPrimerFormato(`${codigoSeguro}-${numeroFoto}`);
    if (encontrada) fotos.push(encontrada);
  }

  return fotos;
}

async function cargarImagenesPrincipales() {
  const [logo, portada] = await Promise.all([detectarPrimerFormato("logo"), detectarPrimerFormato("portada")]);
  if (logo) {
    document.querySelectorAll('[data-imagen-automatica="logo"]').forEach((imagen) => {
      imagen.src = logo;
    });
    const favicon = document.querySelector("#favicon");
    if (favicon) {
      const extension = logo.split(".").pop();
      favicon.href = logo;
      favicon.type = `image/${extension === "jpg" ? "jpeg" : extension}`;
    }
  }
  if (portada) {
    document.querySelectorAll('[data-imagen-automatica="portada"]').forEach((imagen) => {
      imagen.src = portada;
    });
  }
}

function abrirVisor(producto, foto) {
  const nombre = nombreProducto(producto);
  imagenAmpliada.src = foto;
  imagenAmpliada.alt = `${nombre}, ${producto.codigo}`;
  pieImagen.textContent = `${producto.codigo} · ${nombre}`;
  visor.showModal();
  document.body.classList.add("visor-abierto");
}

function cerrarImagen() {
  visor.close();
  document.body.classList.remove("visor-abierto");
  imagenAmpliada.src = "";
}

function abrirVideo(producto, ruta) {
  videoAmpliado.src = ruta;
  videoAmpliado.load();
  pieVideo.textContent = `${producto.codigo} · ${nombreProducto(producto)}`;
  visorVideo.showModal();
  document.body.classList.add("visor-abierto");
}

function cerrarVideoLocal() {
  videoAmpliado.pause();
  videoAmpliado.currentTime = 0;
  videoAmpliado.removeAttribute("src");
  videoAmpliado.load();
  visorVideo.close();
  document.body.classList.remove("visor-abierto");
}

function estadoVisual(producto) {
  const categoria = categoriaProducto(producto);
  const estado = estadoProducto(producto);
  if (categoria === "accesorio" && estado === "agotado") return ["AGOTADO", "estado-agotado"];
  if ((categoria === "betta" || categoria === "pareja") && estado === "vendido") return ["SOLD OUT", "estado-vendido"];
  return ["Disponible", "estado-disponible"];
}

function mensajeWhatsApp(producto) {
  const categoria = categoriaProducto(producto);
  const estado = estadoProducto(producto);
  const nombre = nombreProducto(producto);
  if ((categoria === "betta" || categoria === "pareja") && estado === "vendido") {
    return `Hola, he visto el ejemplar ${producto.codigo}, que ya esta vendido. ¿Teneis algun ejemplar similar disponible?`;
  }
  if (categoria === "accesorio") return `Hola, quiero consultar la disponibilidad del accesorio ${nombre} (${producto.codigo}).`;
  if (categoria === "pareja") return `Hola, estoy interesado en la pareja ${producto.codigo}. ¿Sigue disponible?`;
  return `Hola, estoy interesado en el Betta ${producto.codigo}. ¿Sigue disponible?`;
}

function textoBoton(producto) {
  const categoria = categoriaProducto(producto);
  const estado = estadoProducto(producto);
  if ((categoria === "betta" || categoria === "pareja") && estado === "vendido") return "Consultar ejemplares similares";
  if (categoria === "accesorio") return "Consultar disponibilidad";
  return "Consultar por WhatsApp";
}

async function crearTarjeta(producto) {
  const articulo = document.createElement("article");
  const categoria = categoriaProducto(producto);
  const estado = estadoProducto(producto);
  const vendido = (categoria === "betta" || categoria === "pareja") && estado === "vendido";
  const agotado = categoria === "accesorio" && estado === "agotado";
  const nombre = nombreProducto(producto);
  const descripcion = String(producto.descripcion || "").trim() || (categoria === "accesorio" ? "Producto recomendado para el cuidado de bettas." : "Coloracion segun fotografias.");
  const videoLocal = typeof producto.videoLocal === "string" && producto.videoLocal.trim() ? producto.videoLocal.trim() : "";
  const videoTikTok = enlaceTikTokValido(producto.videoTikTok || producto.video);
  const fotosDetectadas = await detectarFotos(producto.codigo);
  const fotos = fotosDetectadas.length > 0 ? fotosDetectadas : ["imagenes/betta-destacado.svg"];
  const tieneGaleria = fotos.length > 1;
  const [textoEstado, claseEstado] = estadoVisual(producto);
  let fotoActual = 0;
  let inicioDeslizamiento = 0;
  let fueDeslizamiento = false;
  let gestoTactilActivo = false;

  articulo.className = `tarjeta tarjeta-${categoria}${vendido ? " tarjeta-vendida" : ""}${agotado ? " tarjeta-agotada" : ""}`;
  articulo.dataset.codigo = producto.codigo;
  articulo.dataset.categoria = categoria;
  articulo.dataset.estado = estado;

  articulo.innerHTML = `
    <div class="galeria ${tieneGaleria ? "galeria-multiple" : "galeria-unica"}">
      <button class="foto-contenedor" type="button" aria-label="Ampliar imagen 1 de ${fotos.length} de ${nombre}" title="Ampliar imagen">
        <img src="${fotos[0]}" alt="${nombre}, foto 1" loading="lazy" draggable="false" onerror="this.hidden=true">
        <span class="codigo">${producto.codigo}</span>
        <span class="ampliar-icono" aria-hidden="true">＋</span>
        ${tieneGaleria ? `<span class="contador-fotos">1 / ${fotos.length}</span>` : ""}
      </button>
      ${tieneGaleria ? `
        <button class="galeria-flecha galeria-anterior" type="button" aria-label="Foto anterior">‹</button>
        <button class="galeria-flecha galeria-siguiente" type="button" aria-label="Foto siguiente">›</button>
        <div class="miniaturas" aria-label="Fotografias de ${nombre}">
          ${fotos.map((foto, indice) => `
            <button class="miniatura ${indice === 0 ? "activa" : ""}" type="button" data-indice="${indice}" aria-label="Mostrar foto ${indice + 1} de ${fotos.length}" aria-current="${indice === 0 ? "true" : "false"}">
              <img src="${foto}" alt="" loading="lazy" onerror="this.hidden=true">
            </button>
          `).join("")}
        </div>
      ` : ""}
    </div>
    <div class="tarjeta-cuerpo">
      <div class="tarjeta-etiquetas">
        <span class="variedad-etiqueta">${categoria === "accesorio" ? "Accesorio" : categoria === "pareja" ? "Pareja" : producto.variedad}</span>
        <span class="estado ${claseEstado}"><span aria-hidden="true"></span> ${textoEstado}</span>
      </div>
      <div class="tarjeta-cabecera">
        <h3>${nombre}</h3>
        ${htmlPrecio(producto)}
      </div>
      <dl class="ficha-datos">
        <div><dt>Codigo</dt><dd>${producto.codigo}</dd></div>
        ${categoria === "accesorio"
          ? `<div><dt>Tipo</dt><dd>${tipoAccesorio(producto).replace("-", " ")}</dd></div>`
          : `<div><dt>${categoria === "pareja" ? "Composicion" : "Sexo"}</dt><dd>${producto.sexo || (categoria === "pareja" ? "Macho + Hembra" : "Macho")}</dd></div>`
        }
        <div class="dato-descripcion"><dt>${categoria === "accesorio" ? "Descripcion" : "Color / descripcion"}</dt><dd>${descripcion}</dd></div>
      </dl>
      <div class="entrega-info">
        <span>📦 Disponible para envio.</span>
        <span>📍 Recogida en Barcelona.</span>
      </div>
      <div class="acciones-tarjeta">
        ${videoLocal ? `<button class="boton boton-video boton-video-local" type="button">Ver video</button>` : ""}
        ${videoTikTok ? `<a class="boton boton-video" href="${videoTikTok}" target="_blank" rel="noopener noreferrer" aria-label="Ver video en TikTok de ${nombre}">Ver video en TikTok</a>` : ""}
        ${
          vendido
            ? `<button class="boton boton-deshabilitado" type="button" disabled>Vendido</button>`
            : `<a class="boton boton-tarjeta" href="${enlaceWhatsApp(mensajeWhatsApp(producto))}" target="_blank" rel="noopener noreferrer">${textoBoton(producto)}</a>`
        }
      </div>
    </div>
  `;

  const fotoPrincipal = articulo.querySelector(".foto-contenedor");
  const imagenPrincipal = fotoPrincipal.querySelector("img");

  function mostrarFoto(indice) {
    fotoActual = (indice + fotos.length) % fotos.length;
    imagenPrincipal.src = fotos[fotoActual];
    imagenPrincipal.alt = `${nombre}, foto ${fotoActual + 1}`;
    fotoPrincipal.setAttribute("aria-label", `Ampliar imagen ${fotoActual + 1} de ${fotos.length} de ${nombre}`);
    const contadorFotos = articulo.querySelector(".contador-fotos");
    if (contadorFotos) contadorFotos.textContent = `${fotoActual + 1} / ${fotos.length}`;
    articulo.querySelectorAll(".miniatura").forEach((miniatura, indiceMiniatura) => {
      const activa = indiceMiniatura === fotoActual;
      miniatura.classList.toggle("activa", activa);
      miniatura.setAttribute("aria-current", activa ? "true" : "false");
    });
  }

  fotoPrincipal.addEventListener("click", () => {
    if (fueDeslizamiento) {
      fueDeslizamiento = false;
      return;
    }
    abrirVisor(producto, fotos[fotoActual]);
  });

  articulo.querySelector(".boton-video-local")?.addEventListener("click", () => abrirVideo(producto, videoLocal));

  if (tieneGaleria) {
    articulo.querySelector(".galeria-anterior").addEventListener("click", () => mostrarFoto(fotoActual - 1));
    articulo.querySelector(".galeria-siguiente").addEventListener("click", () => mostrarFoto(fotoActual + 1));
    articulo.querySelectorAll(".miniatura").forEach((miniatura) => {
      miniatura.addEventListener("click", () => mostrarFoto(Number(miniatura.dataset.indice)));
    });
    fotoPrincipal.addEventListener("pointerdown", (evento) => {
      if (evento.pointerType === "touch") return;
      inicioDeslizamiento = evento.clientX;
      fueDeslizamiento = false;
      if (fotoPrincipal.setPointerCapture) fotoPrincipal.setPointerCapture(evento.pointerId);
    });
    fotoPrincipal.addEventListener("pointermove", (evento) => {
      if (evento.pointerType === "touch") return;
      if (Math.abs(evento.clientX - inicioDeslizamiento) > 12) fueDeslizamiento = true;
    });
    fotoPrincipal.addEventListener("pointerup", (evento) => {
      if (evento.pointerType === "touch") return;
      const distancia = evento.clientX - inicioDeslizamiento;
      if (fotoPrincipal.hasPointerCapture?.(evento.pointerId)) fotoPrincipal.releasePointerCapture(evento.pointerId);
      if (Math.abs(distancia) >= 45) {
        fueDeslizamiento = true;
        mostrarFoto(distancia < 0 ? fotoActual + 1 : fotoActual - 1);
      }
    });
    fotoPrincipal.addEventListener("pointercancel", () => {
      inicioDeslizamiento = 0;
      fueDeslizamiento = false;
    });
    fotoPrincipal.addEventListener("touchstart", (evento) => {
      inicioDeslizamiento = evento.changedTouches[0].clientX;
      gestoTactilActivo = true;
      fueDeslizamiento = false;
    }, { passive: true });
    fotoPrincipal.addEventListener("touchend", (evento) => {
      if (!gestoTactilActivo) return;
      gestoTactilActivo = false;
      const distancia = evento.changedTouches[0].clientX - inicioDeslizamiento;
      if (Math.abs(distancia) < 45) return;
      fueDeslizamiento = true;
      mostrarFoto(distancia < 0 ? fotoActual + 1 : fotoActual - 1);
    }, { passive: true });
  }

  return articulo;
}

const productosOrdenados = todosLosProductos().filter(productoVisible).sort((a, b) => {
  const diferencia = pesoOrden(a) - pesoOrden(b);
  if (diferencia !== 0) return diferencia;
  return String(a.codigo).localeCompare(String(b.codigo), "es");
});

function coincideFiltro(producto) {
  const categoria = categoriaProducto(producto);
  const estado = estadoProducto(producto);
  if (filtroActivo === "todos") return true;
  if (filtroActivo === "bettas") return categoria === "betta";
  if (filtroActivo === "parejas") return categoria === "pareja";
  if (filtroActivo === "accesorios") return categoria === "accesorio";
  if (filtroActivo === "disponibles") return estado === "disponible";
  if (filtroActivo === "vendidos") return (categoria === "betta" || categoria === "pareja") && estado === "vendido";
  return true;
}

function coincideAccesorio(producto) {
  if (filtroActivo !== "accesorios") return true;
  if (filtroAccesorioActivo === "todos-accesorios") return true;
  return categoriaProducto(producto) === "accesorio" && tipoAccesorio(producto) === filtroAccesorioActivo;
}

function aplicarFiltros() {
  const consulta = normalizarTexto(buscador.value);
  let visibles = 0;
  tarjetasCatalogo.forEach(({ tarjeta, producto, busqueda }) => {
    const visible = (consulta === "" || busqueda.includes(consulta)) && coincideFiltro(producto) && coincideAccesorio(producto);
    tarjeta.hidden = !visible;
    if (visible) visibles += 1;
  });
  filtrosAccesorios.hidden = filtroActivo !== "accesorios";
  if (visibles === 0) {
    sinResultados.hidden = false;
    sinResultadosTitulo.textContent = "No encontramos coincidencias";
    sinResultadosTexto.textContent = "Prueba con otro codigo, categoria, estado o tipo de accesorio.";
  } else {
    sinResultados.hidden = true;
  }
}

function crearFiltros() {
  filtrosCatalogo.innerHTML = FILTROS_PRINCIPALES.map(([id, nombre]) => `
    <button class="filtro-catalogo ${id === "todos" ? "activo" : ""}" type="button" data-filtro="${id}" aria-pressed="${id === "todos" ? "true" : "false"}">${nombre}</button>
  `).join("");
  const tipos = new Set(productosOrdenados.filter((p) => categoriaProducto(p) === "accesorio").map(tipoAccesorio));
  filtrosAccesorios.innerHTML = FILTROS_ACCESORIOS
    .filter(([id, , tipo]) => id === "todos-accesorios" || tipos.has(tipo))
    .map(([id, nombre]) => `
      <button class="filtro-catalogo filtro-secundario ${id === "todos-accesorios" ? "activo" : ""}" type="button" data-filtro-accesorio="${id}" aria-pressed="${id === "todos-accesorios" ? "true" : "false"}">${nombre}</button>
    `).join("");
  filtrosAccesorios.hidden = true;
  filtrosCatalogo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-filtro]");
    if (!boton) return;
    filtroActivo = boton.dataset.filtro;
    if (filtroActivo !== "accesorios") filtroAccesorioActivo = "todos-accesorios";
    filtrosCatalogo.querySelectorAll("[data-filtro]").forEach((filtro) => {
      const activo = filtro === boton;
      filtro.classList.toggle("activo", activo);
      filtro.setAttribute("aria-pressed", activo ? "true" : "false");
    });
    filtrosAccesorios.querySelectorAll("[data-filtro-accesorio]").forEach((filtro) => {
      const activo = filtro.dataset.filtroAccesorio === filtroAccesorioActivo;
      filtro.classList.toggle("activo", activo);
      filtro.setAttribute("aria-pressed", activo ? "true" : "false");
    });
    aplicarFiltros();
  });
  filtrosAccesorios.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-filtro-accesorio]");
    if (!boton) return;
    filtroAccesorioActivo = boton.dataset.filtroAccesorio;
    filtrosAccesorios.querySelectorAll("[data-filtro-accesorio]").forEach((filtro) => {
      const activo = filtro === boton;
      filtro.classList.toggle("activo", activo);
      filtro.setAttribute("aria-pressed", activo ? "true" : "false");
    });
    aplicarFiltros();
  });
}

async function cargarCatalogo() {
  const tarjetas = await Promise.all(productosOrdenados.map(crearTarjeta));
  tarjetas.forEach((tarjeta, indice) => {
    const producto = productosOrdenados[indice];
    tarjetasCatalogo.push({ tarjeta, producto, busqueda: textoBuscable(producto) });
    lista.appendChild(tarjeta);
  });
  aplicarFiltros();
}

cargarImagenesPrincipales();
crearFiltros();
cargarCatalogo();
buscador.addEventListener("input", aplicarFiltros);

const mensajeGeneral = "Hola, quiero informacion sobre los bettas disponibles en Barcelona.";
const enlaceGeneral = enlaceWhatsApp(mensajeGeneral);
whatsappFlotante.href = enlaceGeneral;

const enlacesRedes = {
  tiktok: CONFIGURACION.tiktok,
  instagram: CONFIGURACION.instagram,
  facebook: CONFIGURACION.facebook,
  whatsapp: enlaceGeneral,
};

document.querySelectorAll("[data-red]").forEach((enlace) => {
  enlace.href = enlacesRedes[enlace.dataset.red];
});
document.querySelector("#anio").textContent = new Date().getFullYear();

cerrarVisor.addEventListener("click", cerrarImagen);
visor.addEventListener("click", (evento) => {
  if (evento.target === visor) cerrarImagen();
});
visor.addEventListener("close", () => {
  document.body.classList.remove("visor-abierto");
  imagenAmpliada.src = "";
});

cerrarVideo.addEventListener("click", cerrarVideoLocal);
visorVideo.addEventListener("click", (evento) => {
  if (evento.target === visorVideo) cerrarVideoLocal();
});
visorVideo.addEventListener("close", () => {
  if (videoAmpliado.src) {
    videoAmpliado.pause();
    videoAmpliado.currentTime = 0;
    videoAmpliado.removeAttribute("src");
    videoAmpliado.load();
  }
  document.body.classList.remove("visor-abierto");
});
