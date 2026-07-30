const lista = document.querySelector("#lista-peces");
const sinResultados = document.querySelector("#sin-resultados");
const sinResultadosTitulo = document.querySelector("#sin-resultados-titulo");
const sinResultadosTexto = document.querySelector("#sin-resultados-texto");
const buscador = document.querySelector("#buscador");
const filtrosCatalogo = document.querySelector("#filtros-catalogo");
const seccionAccesorios = document.querySelector("#seccion-accesorios");
const listaAccesorios = document.querySelector("#lista-accesorios");
const whatsappFlotante = document.querySelector("#whatsapp-flotante");
const visor = document.querySelector("#visor");
const imagenAmpliada = document.querySelector("#imagen-ampliada");
const pieImagen = document.querySelector("#pie-imagen");
const cerrarVisor = document.querySelector("#cerrar-visor");
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
const CATEGORIAS = [
  { id: "halfmoon", nombre: "Halfmoon", terminos: ["halfmoon"] },
  { id: "koi", nombre: "Koi", terminos: ["koi"] },
  { id: "hell-boy", nombre: "Hell Boy", terminos: ["hell boy", "hellboy"] },
  { id: "candy", nombre: "Candy", terminos: ["candy"] },
  { id: "parejas", nombre: "Parejas", terminos: ["pareja", "parejas"] },
  { id: "accesorios", nombre: "Accesorios", terminos: ["accesorio", "accesorios"] },
];

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function textoBuscable(pez) {
  return normalizarTexto(
    [
      pez.codigo,
      pez.variedad,
      pez.nombre,
      pez.color,
      pez.descripcion,
      pez.categoria,
      pez.tipo,
    ].join(" "),
  );
}

function tipoDelProducto(producto) {
  const tipo = normalizarTexto(producto.tipo);
  return ["individual", "pareja", "accesorio"].includes(tipo)
    ? tipo
    : "individual";
}

function categoriasDelProducto(pez) {
  const texto = textoBuscable(pez);
  const categorias = CATEGORIAS.filter((categoria) =>
    categoria.terminos.some((termino) => texto.includes(termino)),
  ).map((categoria) => categoria.id);
  const tipo = tipoDelProducto(pez);

  if (tipo === "pareja" && !categorias.includes("parejas")) {
    categorias.push("parejas");
  }
  if (tipo === "accesorio" && !categorias.includes("accesorios")) {
    categorias.push("accesorios");
  }

  return categorias;
}

function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${CONFIGURACION.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

function enlaceTikTokValido(valor) {
  if (typeof valor !== "string" || valor.trim() === "") return null;

  try {
    const url = new URL(valor.trim());
    const dominio = url.hostname.toLowerCase();
    const esTikTok =
      dominio === "tiktok.com" ||
      dominio.endsWith(".tiktok.com");
    return url.protocol === "https:" && esTikTok ? url.href : null;
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

  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2,
  }).format(numero);
}

function datosPrecio(producto) {
  const precio = numeroPrecio(producto.precio);
  const precioAnterior = numeroPrecio(producto.precioAnterior);
  const tieneOferta =
    precio !== null &&
    precioAnterior !== null &&
    precioAnterior > precio;
  const descuento = tieneOferta
    ? Math.round(((precioAnterior - precio) / precioAnterior) * 100)
    : null;

  return {
    precio,
    precioAnterior,
    tieneOferta,
    descuento,
  };
}

function htmlPrecio(producto) {
  const precio = datosPrecio(producto);

  if (!precio.tieneOferta) {
    return `<span class="precio">${formatoPrecio(producto.precio)} €</span>`;
  }

  return `
    <div class="bloque-precio precio-oferta">
      <span class="precio-anterior">${formatoPrecio(precio.precioAnterior)} €</span>
      <span class="precio">${formatoPrecio(precio.precio)} €</span>
      <span class="etiqueta-oferta">-${precio.descuento}%</span>
    </div>
  `;
}

function abrirVisor(pez, foto) {
  imagenAmpliada.src = foto;
  imagenAmpliada.alt = `Betta ${pez.codigo}, ${pez.variedad}`;
  pieImagen.textContent = `${pez.codigo} · ${pez.variedad}`;
  visor.showModal();
  document.body.classList.add("visor-abierto");
}

function cerrarImagen() {
  visor.close();
  document.body.classList.remove("visor-abierto");
  imagenAmpliada.src = "";
}

function comprobarImagen(ruta) {
  return new Promise((resolver) => {
    const imagen = new Image();
    imagen.onload = () => resolver(ruta);
    imagen.onerror = () => resolver(null);
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
  const posiciones = Array.from(
    { length: 5 },
    (_, indice) => `${codigoSeguro}-${indice + 1}`,
  );
  const resultados = await Promise.all(
    posiciones.map(detectarPrimerFormato),
  );
  return resultados.filter(Boolean);
}

async function cargarImagenesPrincipales() {
  const [logo, portada] = await Promise.all([
    detectarPrimerFormato("logo"),
    detectarPrimerFormato("portada"),
  ]);

  if (logo) {
    document.querySelectorAll('[data-imagen-automatica="logo"]').forEach((imagen) => {
      imagen.src = logo;
    });

    const favicon = document.querySelector("#favicon");
    if (favicon) {
      favicon.href = logo;
      favicon.type = `image/${logo.split(".").pop() === "jpg" ? "jpeg" : logo.split(".").pop()}`;
    }
  }

  if (portada) {
    document.querySelectorAll('[data-imagen-automatica="portada"]').forEach((imagen) => {
      imagen.src = portada;
    });
  }
}

async function crearTarjeta(pez) {
  const articulo = document.createElement("article");
  const tipo = tipoDelProducto(pez);
  const esAccesorio = tipo === "accesorio";
  const esPareja = tipo === "pareja";
  const estaAgotado =
    esAccesorio && normalizarTexto(pez.estado) === "agotado";
  const nombreProducto = String(pez.nombre || pez.variedad || pez.codigo).trim();
  const claseTipo = `tarjeta-${tipo}`;
  articulo.className = `tarjeta ${claseTipo}`;
  articulo.dataset.codigo = pez.codigo;
  articulo.dataset.tipo = tipo;

  const mensaje = esAccesorio
    ? estaAgotado
      ? `Hola, quiero consultar el accesorio ${nombreProducto} (${pez.codigo}). ¿Cuándo volverá a estar disponible?`
      : `Hola, estoy interesado en el accesorio ${nombreProducto} (${pez.codigo}). ¿Sigue disponible?`
    : `Hola, estoy interesado en ${esPareja ? "la pareja" : "el Betta"} ${pez.codigo}. ¿Sigue disponible?`;
  const descripcion =
    String(pez.descripcion || "").trim() ||
    (esAccesorio
      ? "Producto recomendado para el cuidado de bettas."
      : "Coloración según fotografías.");
  const videoTikTok = enlaceTikTokValido(pez.video);
  const fotosDetectadas = await detectarFotos(pez.codigo);
  const fotos =
    fotosDetectadas.length > 0
      ? fotosDetectadas
      : ["imagenes/betta-destacado.svg"];
  const tieneGaleria = fotos.length > 1;
  let fotoActual = 0;
  let inicioDeslizamiento = 0;
  let fueDeslizamiento = false;
  let gestoTactilActivo = false;

  articulo.innerHTML = `
    <div class="galeria ${tieneGaleria ? "galeria-multiple" : "galeria-unica"}">
      <button
        class="foto-contenedor"
        type="button"
        aria-label="Ampliar imagen 1 de ${fotos.length} de ${nombreProducto}"
        title="Ampliar imagen"
      >
        <img src="${fotos[0]}" alt="${nombreProducto}, foto 1" loading="lazy" draggable="false">
        <span class="codigo">${pez.codigo}</span>
        <span class="ampliar-icono" aria-hidden="true">＋</span>
        ${tieneGaleria ? `<span class="contador-fotos">1 / ${fotos.length}</span>` : ""}
      </button>
      ${
        tieneGaleria
          ? `
            <button class="galeria-flecha galeria-anterior" type="button" aria-label="Foto anterior">‹</button>
            <button class="galeria-flecha galeria-siguiente" type="button" aria-label="Foto siguiente">›</button>
            <div class="miniaturas" aria-label="Fotografías de ${nombreProducto}">
              ${fotos
                .map(
                  (foto, indice) => `
                    <button
                      class="miniatura ${indice === 0 ? "activa" : ""}"
                      type="button"
                      data-indice="${indice}"
                      aria-label="Mostrar foto ${indice + 1} de ${fotos.length}"
                      aria-current="${indice === 0 ? "true" : "false"}"
                    >
                      <img src="${foto}" alt="" loading="lazy">
                    </button>
                  `,
                )
                .join("")}
            </div>
          `
          : ""
      }
    </div>
    <div class="tarjeta-cuerpo">
      <div class="tarjeta-etiquetas">
        <span class="variedad-etiqueta">${esAccesorio ? "Accesorio" : esPareja ? "Pareja" : pez.variedad}</span>
        <span class="estado ${estaAgotado ? "estado-agotado" : "estado-disponible"}">
          <span aria-hidden="true"></span> ${estaAgotado ? "Agotado" : "Disponible"}
        </span>
      </div>
      <div class="tarjeta-cabecera">
        <h3>${nombreProducto}</h3>
        ${htmlPrecio(pez)}
      </div>
      <dl class="ficha-datos">
        <div>
          <dt>Código</dt>
          <dd>${pez.codigo}</dd>
        </div>
        ${
          esAccesorio
            ? `
              <div>
                <dt>Tipo</dt>
                <dd>Accesorio</dd>
              </div>
            `
            : `
              <div>
                <dt>${esPareja ? "Composición" : "Sexo"}</dt>
                <dd>${esPareja ? pez.sexo || "Macho y hembra" : pez.sexo}</dd>
              </div>
            `
        }
        <div class="dato-descripcion">
          <dt>${esAccesorio ? "Descripción" : "Color / descripción"}</dt>
          <dd>${descripcion}</dd>
        </div>
      </dl>
      <div class="entrega-info">
        <span>📦 Disponible para envío.</span>
        <span>📍 Recogida en Barcelona.</span>
      </div>
      <div class="acciones-tarjeta">
        ${
          videoTikTok
            ? `
              <a
                class="boton boton-video"
                href="${videoTikTok}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver vídeo en TikTok de ${nombreProducto}"
              >
                Ver vídeo en TikTok
              </a>
            `
            : ""
        }
        <a
          class="boton boton-tarjeta"
          href="${enlaceWhatsApp(mensaje)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Consultar por WhatsApp ${nombreProducto}"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  `;

  const fotoPrincipal = articulo.querySelector(".foto-contenedor");
  const imagenPrincipal = fotoPrincipal.querySelector("img");

  function mostrarFoto(indice) {
    fotoActual = (indice + fotos.length) % fotos.length;
    imagenPrincipal.src = fotos[fotoActual];
    imagenPrincipal.alt = `${nombreProducto}, foto ${fotoActual + 1}`;
    fotoPrincipal.setAttribute(
      "aria-label",
      `Ampliar imagen ${fotoActual + 1} de ${fotos.length} de ${nombreProducto}`,
    );

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
    abrirVisor(pez, fotos[fotoActual]);
  });

  if (tieneGaleria) {
    articulo
      .querySelector(".galeria-anterior")
      .addEventListener("click", () => mostrarFoto(fotoActual - 1));
    articulo
      .querySelector(".galeria-siguiente")
      .addEventListener("click", () => mostrarFoto(fotoActual + 1));

    articulo.querySelectorAll(".miniatura").forEach((miniatura) => {
      miniatura.addEventListener("click", () => {
        mostrarFoto(Number(miniatura.dataset.indice));
      });
    });

    fotoPrincipal.addEventListener("pointerdown", (evento) => {
      if (evento.pointerType === "touch") return;
      inicioDeslizamiento = evento.clientX;
      fueDeslizamiento = false;
      if (fotoPrincipal.setPointerCapture) {
        fotoPrincipal.setPointerCapture(evento.pointerId);
      }
    });

    fotoPrincipal.addEventListener("pointermove", (evento) => {
      if (evento.pointerType === "touch") return;
      if (Math.abs(evento.clientX - inicioDeslizamiento) > 12) {
        fueDeslizamiento = true;
      }
    });

    fotoPrincipal.addEventListener("pointerup", (evento) => {
      if (evento.pointerType === "touch") return;
      const distancia = evento.clientX - inicioDeslizamiento;
      if (fotoPrincipal.hasPointerCapture?.(evento.pointerId)) {
        fotoPrincipal.releasePointerCapture(evento.pointerId);
      }
      if (Math.abs(distancia) >= 45) {
        fueDeslizamiento = true;
        mostrarFoto(distancia < 0 ? fotoActual + 1 : fotoActual - 1);
      }
    });

    fotoPrincipal.addEventListener("pointercancel", () => {
      inicioDeslizamiento = 0;
      fueDeslizamiento = false;
    });

    fotoPrincipal.addEventListener(
      "touchstart",
      (evento) => {
        inicioDeslizamiento = evento.changedTouches[0].clientX;
        gestoTactilActivo = true;
        fueDeslizamiento = false;
      },
      { passive: true },
    );

    fotoPrincipal.addEventListener(
      "touchend",
      (evento) => {
        if (!gestoTactilActivo) return;
        gestoTactilActivo = false;
        const distancia = evento.changedTouches[0].clientX - inicioDeslizamiento;
        if (Math.abs(distancia) < 45) return;
        fueDeslizamiento = true;
        mostrarFoto(distancia < 0 ? fotoActual + 1 : fotoActual - 1);
      },
      { passive: true },
    );
  }

  return articulo;
}

const productosVisibles = PECES.filter((producto) => {
  const estado = normalizarTexto(producto.estado);
  const tipo = tipoDelProducto(producto);

  if (tipo === "accesorio") {
    return estado === "disponible" || estado === "agotado";
  }

  return estado === "disponible";
});
const pecesDisponibles = productosVisibles.filter(
  (producto) => tipoDelProducto(producto) !== "accesorio",
);
const accesoriosVisibles = productosVisibles.filter(
  (producto) => tipoDelProducto(producto) === "accesorio",
);
let categoriaActiva = "todos";
const catalogoRenderizado = [];

function mostrarEstadoVacio(hayBusqueda) {
  sinResultados.hidden = false;

  if (hayBusqueda) {
    sinResultadosTitulo.textContent = "No encontramos coincidencias";
    sinResultadosTexto.textContent =
      "Prueba con otro código, variedad, color o categoría.";
    return;
  }

  sinResultadosTitulo.textContent = "Próximamente habrá nuevos bettas";
  sinResultadosTexto.textContent =
    "Escríbeme por WhatsApp para consultar las próximas novedades.";
}

function aplicarFiltros() {
  const consulta = normalizarTexto(buscador.value);
  let visibles = 0;
  let cantidadAccesoriosVisibles = 0;

  catalogoRenderizado.forEach(({ tarjeta, busqueda, categorias, tipo }) => {
    const coincideBusqueda = consulta === "" || busqueda.includes(consulta);
    const coincideCategoria =
      categoriaActiva === "todos" || categorias.includes(categoriaActiva);
    const visible = coincideBusqueda && coincideCategoria;

    tarjeta.hidden = !visible;
    if (visible) {
      visibles += 1;
      if (tipo === "accesorio") cantidadAccesoriosVisibles += 1;
    }
  });

  seccionAccesorios.hidden = cantidadAccesoriosVisibles === 0;

  if (visibles === 0) {
    mostrarEstadoVacio(consulta !== "" || categoriaActiva !== "todos");
  } else {
    sinResultados.hidden = true;
  }
}

function crearFiltros() {
  const categoriasDisponibles = CATEGORIAS.filter((categoria) =>
    productosVisibles.some((pez) =>
      categoriasDelProducto(pez).includes(categoria.id),
    ),
  );
  const opciones = [
    { id: "todos", nombre: "Todos" },
    ...categoriasDisponibles,
  ];

  filtrosCatalogo.innerHTML = opciones
    .map(
      (opcion) => `
        <button
          class="filtro-catalogo ${opcion.id === "todos" ? "activo" : ""}"
          type="button"
          data-categoria="${opcion.id}"
          aria-pressed="${opcion.id === "todos" ? "true" : "false"}"
        >
          ${opcion.nombre}
        </button>
      `,
    )
    .join("");

  filtrosCatalogo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-categoria]");
    if (!boton) return;

    categoriaActiva = boton.dataset.categoria;
    filtrosCatalogo.querySelectorAll("[data-categoria]").forEach((filtro) => {
      const activo = filtro === boton;
      filtro.classList.toggle("activo", activo);
      filtro.setAttribute("aria-pressed", activo ? "true" : "false");
    });
    aplicarFiltros();
  });
}

async function cargarCatalogo() {
  const tarjetasPeces = await Promise.all(pecesDisponibles.map(crearTarjeta));
  const tarjetasAccesorios = await Promise.all(
    accesoriosVisibles.map(crearTarjeta),
  );

  tarjetasPeces.forEach((tarjeta, indice) => {
    const producto = pecesDisponibles[indice];
    catalogoRenderizado.push({
      tarjeta,
      busqueda: textoBuscable(producto),
      categorias: categoriasDelProducto(producto),
      tipo: tipoDelProducto(producto),
    });
    lista.appendChild(tarjeta);
  });

  tarjetasAccesorios.forEach((tarjeta, indice) => {
    const producto = accesoriosVisibles[indice];
    catalogoRenderizado.push({
      tarjeta,
      busqueda: textoBuscable(producto),
      categorias: categoriasDelProducto(producto),
      tipo: tipoDelProducto(producto),
    });
    listaAccesorios.appendChild(tarjeta);
  });

  aplicarFiltros();
}

cargarImagenesPrincipales();
crearFiltros();
cargarCatalogo();
buscador.addEventListener("input", aplicarFiltros);

const mensajeGeneral =
  "Hola, quiero información sobre los bettas disponibles en Barcelona.";
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
