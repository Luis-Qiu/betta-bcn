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
const visorAnterior = document.querySelector("#visor-anterior");
const visorSiguiente = document.querySelector("#visor-siguiente");
const visorMiniaturas = document.querySelector("#visor-miniaturas");
const visorVideo = document.querySelector("#visor-video");
const videoAmpliado = document.querySelector("#video-ampliado");
const pieVideo = document.querySelector("#pie-video");
const cerrarVideo = document.querySelector("#cerrar-video");
const cabecera = document.querySelector(".cabecera");
const heroVisual = document.querySelector(".hero-visual");
const heroImagen = document.querySelector(".hero-visual .video-portada") || document.querySelector(".hero-visual img");

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
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const visorEstado = {
  producto: null,
  fotos: [],
  indice: 0,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  inicioX: 0,
  inicioY: 0,
  arrastrando: false,
  inicioDistancia: 0,
};

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

function numeroOrden(producto) {
  const valor = Number(producto.orden);
  return Number.isFinite(valor) ? valor : null;
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
    document.querySelectorAll('[data-poster-automatico="portada"]').forEach((video) => {
      video.poster = portada;
    });
  }
}

function prepararVideosPortada() {
  const videos = document.querySelectorAll(".video-portada");
  const videosVisibles = new Set();

  const intentarReproducir = (video) => {
    if (document.hidden) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
    video.play().catch(() => {});
  };

  const estaVideoEnViewport = (video) => {
    const caja = video.getBoundingClientRect();
    return caja.bottom > window.innerHeight * 0.15 && caja.top < window.innerHeight * 0.85;
  };

  const actualizarVideosVisibles = () => {
    videos.forEach((video) => {
      if (estaVideoEnViewport(video)) {
        videosVisibles.add(video);
        intentarReproducir(video);
      } else {
        videosVisibles.delete(video);
        video.pause();
      }
    });
  };

  videos.forEach((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
    intentarReproducir(video);
  });

  if (!("IntersectionObserver" in window)) return;

  const observadorVideos = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      const video = entrada.target;
      if (entrada.isIntersecting) {
        videosVisibles.add(video);
        intentarReproducir(video);
      } else {
        videosVisibles.delete(video);
        video.pause();
      }
    });
  }, { threshold: 0.18 });

  videos.forEach((video) => observadorVideos.observe(video));
  window.addEventListener("scroll", actualizarVideosVisibles, { passive: true });
  window.addEventListener("resize", actualizarVideosVisibles, { passive: true });
  actualizarVideosVisibles();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      videos.forEach((video) => video.pause());
      return;
    }
    actualizarVideosVisibles();
  });
}

function actualizarVisor() {
  if (!visorEstado.producto || visorEstado.fotos.length === 0) return;
  const nombre = nombreProducto(visorEstado.producto);
  const foto = visorEstado.fotos[visorEstado.indice];
  const total = visorEstado.fotos.length;
  imagenAmpliada.src = foto;
  imagenAmpliada.alt = `${nombre}, ${visorEstado.producto.codigo}, foto ${visorEstado.indice + 1}`;
  imagenAmpliada.style.transform = `translate3d(${visorEstado.offsetX}px, ${visorEstado.offsetY}px, 0) scale(${visorEstado.zoom})`;
  pieImagen.textContent = `${visorEstado.producto.codigo} · ${nombre} · ${visorEstado.indice + 1}/${total}`;
  const hayGaleria = total > 1;
  visorAnterior.hidden = !hayGaleria;
  visorSiguiente.hidden = !hayGaleria;
  visorMiniaturas.hidden = !hayGaleria;
  visorMiniaturas.innerHTML = hayGaleria
    ? visorEstado.fotos.map((miniatura, indice) => `
        <button class="visor-miniatura ${indice === visorEstado.indice ? "activa" : ""}" type="button" data-visor-indice="${indice}" aria-label="Ver foto ${indice + 1} de ${total}" aria-current="${indice === visorEstado.indice ? "true" : "false"}">
          <img src="${miniatura}" alt="" loading="lazy" onerror="this.hidden=true">
        </button>
      `).join("")
    : "";
}

function moverVisor(direccion) {
  if (visorEstado.fotos.length <= 1) return;
  visorEstado.indice = (visorEstado.indice + direccion + visorEstado.fotos.length) % visorEstado.fotos.length;
  visorEstado.zoom = 1;
  visorEstado.offsetX = 0;
  visorEstado.offsetY = 0;
  actualizarVisor();
}

function abrirVisor(producto, fotos, indice = 0) {
  visorEstado.producto = producto;
  visorEstado.fotos = fotos;
  visorEstado.indice = indice;
  visorEstado.zoom = 1;
  visorEstado.offsetX = 0;
  visorEstado.offsetY = 0;
  actualizarVisor();
  visor.showModal();
  document.body.classList.add("visor-abierto");
}

function cerrarImagen() {
  visor.close();
  document.body.classList.remove("visor-abierto");
  imagenAmpliada.src = "";
  imagenAmpliada.style.transform = "";
  visorEstado.producto = null;
  visorEstado.fotos = [];
  visorEstado.indice = 0;
  visorEstado.zoom = 1;
  visorEstado.offsetX = 0;
  visorEstado.offsetY = 0;
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
  if (categoria === "accesorio") return "WhatsApp";
  return "WhatsApp";
}

async function crearTarjeta(producto) {
  const articulo = document.createElement("article");
  const categoria = categoriaProducto(producto);
  const estado = estadoProducto(producto);
  const vendido = (categoria === "betta" || categoria === "pareja") && estado === "vendido";
  const agotado = categoria === "accesorio" && estado === "agotado";
  const nombre = nombreProducto(producto);
  const descripcion = String(producto.descripcion || "").trim();
  const videoLocal = typeof producto.videoLocal === "string" && producto.videoLocal.trim() ? producto.videoLocal.trim() : "";
  const videoTikTok = enlaceTikTokValido(producto.videoTikTok || producto.video);
  const fotosDetectadas = await detectarFotos(producto.codigo);
  const fotos = fotosDetectadas.length > 0 ? fotosDetectadas : ["imagenes/betta-destacado.svg"];
  const tieneGaleria = fotos.length > 1;
  const [textoEstado, claseEstado] = estadoVisual(producto);
  const etiquetaSuperior = categoria === "accesorio" ? "Accesorio" : categoria === "pareja" ? "Pareja" : String(producto.tipo || "").trim() || "BETTA";
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
        <span class="variedad-etiqueta">${etiquetaSuperior}</span>
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
        ${descripcion ? `<div class="dato-descripcion"><dt>${categoria === "accesorio" ? "Descripcion" : "Color / descripcion"}</dt><dd>${descripcion}</dd></div>` : ""}
      </dl>
      <div class="entrega-info">
        <span>📦 Disponible para envio.</span>
        <span>📍 Recogida en Barcelona.</span>
      </div>
      <div class="acciones-tarjeta">
        ${videoLocal ? `<button class="boton boton-video boton-video-local" type="button">Ver video</button>` : ""}
        ${videoTikTok ? `<a class="boton boton-video" href="${videoTikTok}" target="_blank" rel="noopener noreferrer" aria-label="Ver video en TikTok de ${nombre}">Ver video</a>` : ""}
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
    abrirVisor(producto, fotos, fotoActual);
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

const productosOrdenados = todosLosProductos()
  .map((producto, indiceOriginal) => ({ producto, indiceOriginal }))
  .filter(({ producto }) => productoVisible(producto))
  .sort((a, b) => {
    const ordenA = numeroOrden(a.producto);
    const ordenB = numeroOrden(b.producto);
    const tieneOrdenA = ordenA !== null;
    const tieneOrdenB = ordenB !== null;

    if (tieneOrdenA && tieneOrdenB && ordenA !== ordenB) return ordenA - ordenB;
    if (tieneOrdenA !== tieneOrdenB) return tieneOrdenA ? -1 : 1;
    return a.indiceOriginal - b.indiceOriginal;
  })
  .map(({ producto }) => producto);

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

function iniciarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const destino = document.querySelector(enlace.getAttribute("href"));
      if (!destino) return;
      evento.preventDefault();
      destino.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
}

function iniciarHeaderDinamico() {
  let rafPendiente = false;
  const actualizarHeader = () => {
    rafPendiente = false;
    cabecera.classList.toggle("cabecera-scroll", window.scrollY > 24);
    if (reduceMotion) return;
    const avance = Math.min(window.scrollY / 620, 1);
    document.documentElement.style.setProperty("--hero-scroll", avance.toFixed(3));

    if (heroImagen) {
      const scrollY = `${avance * 42}px`;
      const scrollScale = String(1 + avance * 0.055);
      heroImagen.style.setProperty("--scroll-y", scrollY);
      heroImagen.style.setProperty("--scroll-scale", scrollScale);
      heroVisual.style.setProperty("--scroll-y", scrollY);
      heroVisual.style.setProperty("--scroll-scale", scrollScale);
    }

  };
  const solicitarActualizacion = () => {
    if (rafPendiente) return;
    rafPendiente = true;
    requestAnimationFrame(actualizarHeader);
  };
  actualizarHeader();
  window.addEventListener("scroll", solicitarActualizacion, { passive: true });
  window.addEventListener("resize", solicitarActualizacion, { passive: true });
}

function iniciarHeroPremium() {
  if (!heroVisual || !heroImagen || reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
  heroVisual.addEventListener("pointermove", (evento) => {
    const caja = heroVisual.getBoundingClientRect();
    const x = ((evento.clientX - caja.left) / caja.width - 0.5) * 16;
    const y = ((evento.clientY - caja.top) / caja.height - 0.5) * 14;
    heroImagen.style.setProperty("--parallax-x", `${x}px`);
    heroImagen.style.setProperty("--parallax-y", `${y}px`);
    heroVisual.style.setProperty("--parallax-x", `${x}px`);
    heroVisual.style.setProperty("--parallax-y", `${y}px`);
  });
  heroVisual.addEventListener("pointerleave", () => {
    heroImagen.style.setProperty("--parallax-x", "0px");
    heroImagen.style.setProperty("--parallax-y", "0px");
    heroVisual.style.setProperty("--parallax-x", "0px");
    heroVisual.style.setProperty("--parallax-y", "0px");
  });
}

function iniciarScrollReveal() {
  const elementos = document.querySelectorAll(`
    .contacto-intro,
    .red-social,
    .confianza-cabecera,
    .confianza-lista li,
    .aviso-envio,
    .titulo-seccion,
    .tarjeta,
    .sin-resultados,
    .footer-marca,
    .footer-redes
  `);

  elementos.forEach((elemento, indice) => {
    elemento.classList.add("scroll-reveal");
    elemento.style.setProperty("--reveal-delay", `${Math.min(indice % 8, 5) * 55}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visible"));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("visible");
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  elementos.forEach((elemento) => observador.observe(elemento));
}

async function cargarCatalogo() {
  const tarjetas = await Promise.all(productosOrdenados.map(crearTarjeta));
  tarjetas.forEach((tarjeta, indice) => {
    const producto = productosOrdenados[indice];
    tarjetasCatalogo.push({ tarjeta, producto, busqueda: textoBuscable(producto) });
    lista.appendChild(tarjeta);
  });
  iniciarScrollReveal();
  aplicarFiltros();
}

iniciarScrollSuave();
iniciarHeaderDinamico();
iniciarHeroPremium();
prepararVideosPortada();
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
visorAnterior.addEventListener("click", () => moverVisor(-1));
visorSiguiente.addEventListener("click", () => moverVisor(1));
visorMiniaturas.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-visor-indice]");
  if (!boton) return;
  visorEstado.indice = Number(boton.dataset.visorIndice);
  visorEstado.zoom = 1;
  visorEstado.offsetX = 0;
  visorEstado.offsetY = 0;
  actualizarVisor();
});
visor.addEventListener("click", (evento) => {
  if (evento.target === visor) cerrarImagen();
});
visor.addEventListener("wheel", (evento) => {
  if (!visor.open) return;
  evento.preventDefault();
  const cambio = evento.deltaY < 0 ? 0.12 : -0.12;
  visorEstado.zoom = Math.min(Math.max(visorEstado.zoom + cambio, 1), 2.4);
  if (visorEstado.zoom === 1) {
    visorEstado.offsetX = 0;
    visorEstado.offsetY = 0;
  }
  actualizarVisor();
}, { passive: false });
visor.addEventListener("pointerdown", (evento) => {
  visorEstado.inicioX = evento.clientX;
  visorEstado.inicioY = evento.clientY;
  visorEstado.arrastrando = visorEstado.zoom > 1;
  if (visorEstado.arrastrando && visor.setPointerCapture) visor.setPointerCapture(evento.pointerId);
});
visor.addEventListener("pointermove", (evento) => {
  if (!visorEstado.arrastrando) return;
  const deltaX = evento.clientX - visorEstado.inicioX;
  const deltaY = evento.clientY - visorEstado.inicioY;
  visorEstado.inicioX = evento.clientX;
  visorEstado.inicioY = evento.clientY;
  visorEstado.offsetX += deltaX;
  visorEstado.offsetY += deltaY;
  actualizarVisor();
});
visor.addEventListener("pointerup", (evento) => {
  const distancia = evento.clientX - visorEstado.inicioX;
  if (visor.hasPointerCapture?.(evento.pointerId)) visor.releasePointerCapture(evento.pointerId);
  if (visorEstado.arrastrando) {
    visorEstado.arrastrando = false;
    return;
  }
  if (Math.abs(distancia) >= 55) moverVisor(distancia < 0 ? 1 : -1);
});
visor.addEventListener("touchstart", (evento) => {
  if (evento.touches.length === 2) {
    const [a, b] = evento.touches;
    visorEstado.inicioDistancia = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }
}, { passive: true });
visor.addEventListener("touchmove", (evento) => {
  if (evento.touches.length !== 2 || visorEstado.inicioDistancia === 0) return;
  const [a, b] = evento.touches;
  const distancia = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  const escala = distancia / visorEstado.inicioDistancia;
  visorEstado.zoom = Math.min(Math.max(escala, 1), 2.4);
  actualizarVisor();
}, { passive: true });
visor.addEventListener("close", () => {
  document.body.classList.remove("visor-abierto");
  imagenAmpliada.src = "";
  imagenAmpliada.style.transform = "";
  visorEstado.producto = null;
  visorEstado.fotos = [];
  visorEstado.indice = 0;
  visorEstado.zoom = 1;
});

document.addEventListener("keydown", (evento) => {
  if (!visor.open) return;
  if (evento.key === "Escape") cerrarImagen();
  if (evento.key === "ArrowLeft") moverVisor(-1);
  if (evento.key === "ArrowRight") moverVisor(1);
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
