# Betta BCN

Catálogo web sencillo, sin pagos, carrito, cuentas ni instalaciones.

## 1. Cómo abrir la web

1. Abre la carpeta `betta-bcn`.
2. Haz doble clic en `index.html`.
3. La página se abrirá en tu navegador.

Si no ves los cambios después de editar, pulsa `Ctrl + F5` para recargar.

## Cambiar la imagen de portada

No necesitas modificar código:

1. Abre la carpeta `imagenes`.
2. Elimina la portada anterior.
3. Copia la nueva imagen dentro de esa carpeta.
4. Nómbrala `portada.jpg`, `portada.jpeg`, `portada.png` o `portada.webp`.
5. Vuelve a publicar la carpeta en Netlify.

La web detecta automáticamente el formato y adapta la imagen a ordenador,
tablet y móvil sin deformarla. Si no encuentra ninguna portada válida, muestra
la ilustración original `betta-destacado.svg`.

El logo funciona igual: puedes usar `logo.jpg`, `logo.jpeg`, `logo.png` o
`logo.webp`.

## 2. Configurar tu WhatsApp

1. Abre `datos.js` con el Bloc de notas o Visual Studio Code.
2. Busca esta línea:

```js
whatsapp: "34600000000",
```

3. Sustituye el número por el tuyo, incluyendo el prefijo del país.
4. No escribas `+`, espacios ni guiones.

Ejemplo para el número español 600 111 222:

```js
whatsapp: "34600111222",
```

## 3. Añadir un pez

Abre `datos.js`. Dentro de `const PECES = [` copia una ficha completa y cambia
sus datos:

```js
{
  codigo: "A11",
  tipo: "individual",
  variedad: "Halfmoon Blue",
  estado: "Disponible",
  sexo: "Macho",
  precio: 35,
  precioAnterior: null,
  descripcion: "Azul intenso y aleta amplia.",
  categoria: "Halfmoon",
  video: "",
},
```

Importante:

- Cada ficha termina con `},`.
- El código debe ser distinto para cada pez.
- `tipo` debe ser `"individual"`, `"pareja"` o `"accesorio"`.
- El precio se escribe sin el símbolo de euro.
- Si no hay oferta, escribe `precioAnterior: null`.
- Si hay oferta, escribe el precio antiguo en `precioAnterior`. La web calcula
  el descuento automáticamente.
- Para individuales y parejas, el estado debe ser `"Disponible"` o
  `"Vendido"`. Los vendidos quedan ocultos.
- Para accesorios, utiliza `"Disponible"` o `"Agotado"`. Los agotados siguen
  visibles con una etiqueta roja.
- `categoria` es opcional. Puedes usar `Halfmoon`, `Koi`, `Hell Boy`, `Candy`,
  `Parejas` o `Accesorios`. Si no la escribes, la web intenta reconocerla por
  la variedad y la descripción.
- Guarda el archivo cuando termines.

### Poner una oferta

Sin oferta:

```js
precio: 45,
precioAnterior: null,
```

Con oferta:

```js
precio: 39,
precioAnterior: 45,
```

La web mostrará el precio anterior tachado y calculará automáticamente el
descuento, por ejemplo `-13%`.

### Añadir una pareja

Las parejas aparecen en el catálogo principal y en el filtro `Parejas`:

```js
{
  codigo: "HB-P01",
  tipo: "pareja",
  variedad: "Pareja Hell Boy",
  estado: "Disponible",
  sexo: "Macho y hembra",
  precio: 95,
  precioAnterior: null,
  descripcion: "Pareja seleccionada.",
  video: "",
},
```

### Añadir un accesorio

Los accesorios aparecen automáticamente en la sección `Accesorios
recomendados`. La sección solo permanece oculta cuando no hay accesorios con
estado `Disponible` ni `Agotado`.

```js
{
  codigo: "ACC01",
  tipo: "accesorio",
  nombre: "Hojas de almendro",
  variedad: "Cuidado del agua",
  estado: "Disponible",
  precio: 8,
  precioAnterior: null,
  descripcion: "Hojas naturales para acondicionar el agua.",
  video: "",
},
```

Las fotos siguen el mismo sistema. Por ejemplo: `HB-P01-1.jpg` o
`ACC01-1.png`.

Un accesorio agotado permanece visible para que los clientes puedan
consultarlo por WhatsApp:

```js
estado: "Agotado",
```

## 4. Cambiar o añadir fotos

1. Copia entre 1 y 5 fotos dentro de la carpeta `imagenes`.
2. Usa nombres claros: `A1-1.jpg`, `A1-2.jpeg`, `A1-3.png`.
3. No escribas las fotos en `datos.js`. La web usa automáticamente el código
   del pez para buscarlas.

Para el pez `A1`, estos son los únicos nombres válidos:

```text
A1-1.jpg / A1-1.jpeg / A1-1.png / A1-1.webp
A1-2.jpg / A1-2.jpeg / A1-2.png / A1-2.webp
A1-3.jpg / A1-3.jpeg / A1-3.png / A1-3.webp
A1-4.jpg / A1-4.jpeg / A1-4.png / A1-4.webp
A1-5.jpg / A1-5.jpeg / A1-5.png / A1-5.webp
```

La web acepta `.jpg`, `.jpeg`, `.png`, `.webp` y también sus variantes en
mayúsculas: `.JPG`, `.JPEG`, `.PNG`, `.WEBP`.
Para cada posición utiliza el primer archivo que encuentra. La foto terminada
en `-1` será la principal.

Para eliminar una foto, borra el archivo correspondiente de la carpeta
`imagenes`. No es necesario modificar `datos.js`.

Puedes utilizar `.jpg`, `.jpeg`, `.png` o `.webp`. Para que todas se vean
parecidas, usa fotos horizontales o cuadradas y procura que el pez esté
centrado.

## Añadir un vídeo de TikTok

En la ficha del pez dentro de `datos.js`, pega el enlace:

```js
video: "https://www.tiktok.com/@usuario/video/123456789",
```

La ficha mostrará automáticamente el botón `Ver vídeo en TikTok`. Si no hay
vídeo, deja el campo vacío y el botón no aparecerá:

```js
video: "",
```

## 5. Ocultar un pez vendido

No borres su ficha. Abre `datos.js`, localiza el pez y cambia solamente su
estado:

```js
estado: "Vendido",
```

Solo los individuales y parejas con `estado: "Disponible"` aparecen en el
catálogo. Los vendidos siguen guardados en `datos.js` como biblioteca digital.
Los accesorios utilizan `Disponible` o `Agotado`, y ambos estados se muestran.

## 6. Configurar redes sociales

En la parte superior de `datos.js`, sustituye las direcciones de ejemplo:

```js
tiktok: "https://www.tiktok.com/@tu_usuario",
instagram: "https://www.instagram.com/tu_usuario/",
facebook: "https://www.facebook.com/tu_perfil",
```

## 7. Publicar gratis con Netlify

Esta es la opción más fácil para principiantes:

1. Entra en https://app.netlify.com/drop
2. Crea una cuenta gratuita si te la pide.
3. Arrastra la carpeta completa `betta-bcn` a la página.
4. Netlify publicará la web y te dará una dirección.

Cuando hagas cambios, vuelve a arrastrar la carpeta actualizada para publicar
la nueva versión.

## 8. Otras opciones

- GitHub Pages: gratuito, pero requiere aprender a usar GitHub.
- Cloudflare Pages: gratuito y rápido, algo más técnico.
- Dominio propio: puedes comprar uno como `bettabcn.es` y conectarlo a Netlify.
  Normalmente cuesta entre 8 y 20 euros al año, según el proveedor y la
  extensión.

## Archivos principales

- `index.html`: estructura de la página.
- `estilos.css`: colores y diseño.
- `datos.js`: número de WhatsApp y fichas de peces.
- `app.js`: crea automáticamente las tarjetas.
- `imagenes`: fotos del catálogo.
