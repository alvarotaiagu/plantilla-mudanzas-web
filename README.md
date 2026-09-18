# CARREXO — plantilla de empresa de mudanzas y guardamuebles

> **Sitio de demostración. CARREXO es un negocio ficticio.** Nombre, dirección,
> teléfono, horarios, tarifas, capacidades y equipo son datos de muestra
> inventados para enseñar la plantilla. No corresponden a ninguna empresa real.
> La página lleva `noindex, nofollow` y no publica valoraciones en sus datos
> estructurados.

**Demo:** https://alvarotaiagu.github.io/plantilla-mudanzas-web/

Web estática: HTML + CSS + un `main.js`. Sin framework, sin build, sin backend y
sin npm. GSAP, ScrollTrigger y Lenis por CDN; con el CDN caído la página se lee
entera, el camión aparece ya cargado y la calculadora de volumen sigue
funcionando.

---

## El concepto: «Inventario»

En una mudanza, lo único que evita una discusión es una lista. Todo lo que
importa está numerado —cada caja, cada servicio, cada hora— y la web es esa hoja
de inventario:

- **Cada caja lleva su referencia** (`CRX-014`) y esa referencia es el sistema
  gráfico: rótulos en monoespaciada, precinto amarillo y casillas.
- **La sección central ancla la página y carga el camión caja a caja**: cinco
  cajas numeradas que son los cinco trabajos que van en el presupuesto aunque no
  se vean (embalaje, carga, transporte, montaje y guardamuebles).
- **El día de la mudanza se cuenta hora a hora**, no con adjetivos.
- **La calculadora de volumen** dice metros cúbicos, no precio, y avisa de que no
  es una oferta. Es la pieza que un cliente quiere tocar antes de llamar.

## Registro visual

| | |
|---|---|
| **Paleta** | fondo `#0B0B0C`, panel `#141518`, línea `#24262A`, acero `#4E535A`, humo `#A8AEB6`, hueso `#EFF1F3` y un único acento: amarillo señal `#FFD11A` |
| **Tipografía** | Bebas Neue (titulares y cifras), Roboto Mono (referencias y rótulos), Work Sans (texto) |
| **Movimiento protagonista** | el camión anclado que se carga caja a caja con scrub |
| **Tono** | nave, precinto y cinta de peligro; honesto con los precios y con lo que no se transporta |

## Mapa de secciones

1. **Hero** — la pila de cajas referenciadas y la promesa: sin hoja no hay precio.
2. **Franja** — marquesina de servicios con cinta de peligro, ligada al scroll.
3. **01 · Qué incluye** — el camión anclado y sus cinco cajas (protagonista).
4. **02 · Calcular volumen** — estimación de m³ en vivo, con sus avisos.
5. **03 · Guardamuebles** — tres tamaños de contenedor y cuatro contadores.
6. **04 · El día** — seis hitos, de las 08:00 a las 18:00.
7. **05 · Tarifas** — ocho líneas de precios de muestra.
8. **06 · El equipo** — tres personas presentadas por su herramienta.
9. **07 · Preguntas** — acordeón nativo, incluida «qué no transportamos».
10. **08 · Presupuesto** — formulario de muestra y mapa solo bajo clic.
11. **Pie** — sello de demostración y enlaces legales.

## Recursos de movimiento

| Recurso | Dónde |
|---|---|
| Lenis como único motor de scroll | toda la página (`lerp: 0.17`) |
| Escena anclada con scrub | el camión cargándose (protagonista) |
| Revelado palabra a palabra | todos los titulares con `data-revelar` |
| Montaje escalonado de la pila | cajas del hero, al entrar |
| Marquesina ligada a la velocidad del scroll | franja de servicios |
| Contadores | cifras de la nave |
| Botones magnéticos | todos los `[data-iman]` |
| Cursor contextual en forma de caja | sobre el camión, los servicios y los contenedores |
| Calculadora de volumen en vivo | contenido: funciona sin GSAP |
| Caja activa con observador de intersección | cuando no hay anclaje (móvil, sin GSAP) |

## Qué tocar para reskinear a un cliente real

1. **Datos del negocio.** `index.html` (bloque `ld+json`, sección `#presupuesto`
   y pie), `aviso-legal.html`, `manifest.json` y este README. Busca `carrexo`,
   `981 00 00 00`, `Rúa da Grúa` y `Ordes`.
2. **Quitar el sello de demostración**: el comentario HTML de la primera línea de
   cada página, el párrafo `.sello` del pie, el `<meta name="robots">` y los
   avisos de este README.
3. **Tarifas.** Una sola `<table class="tabla">` en `#tarifas`, más los precios de
   los contenedores en `#guardamuebles`. Hay que quitar las marcas «precio de
   muestra» al poner los de verdad.
4. **La calculadora.** Los metros cúbicos por habitación están en el HTML, en el
   atributo `data-m3` de cada `<input>`; los tramos del mensaje, en la función
   `frase()` de `js/main.js`. Cambiar el tamaño del camión es cambiar esos dos
   sitios.
5. **Los cinco servicios.** Cada `<li class="caja">` y cada `<g class="carga-caja">`
   comparten el atributo `data-caja`. Para añadir un sexto servicio se copia la
   pareja; la animación reparte el recorrido sola entre las cajas que haya.
6. **Paleta.** Las variables de `:root` en `css/style.css`; el acento vive en
   `--amarillo` y se propaga a la cinta de peligro, las cifras y el cursor.
7. **Tipografía.** El `<link>` de Google Fonts en las tres páginas y las
   variables `--display`, `--mono` y `--texto`.

## Decisiones tomadas

- **Cero fotografía y cero operarios de archivo.** Es la imagen típica del sector
  y es justo la que no se puede usar: una foto de archivo presentada como parte
  del equipo convierte a una persona real en personaje inventado. El equipo se
  presenta con su herramienta, dibujada.
- **Nada de precio por teléfono.** La web entera defiende que el precio sale de
  la visita, y la calculadora dice metros cúbicos, no euros. Es honesto y además
  es lo que hace una empresa seria.
- **Se dice qué NO se transporta** (dinero, joyas, documentación, materias
  peligrosas, animales) y qué pasa con lo que embala el cliente. Es la pregunta
  que más disgustos da y casi ninguna web la contesta.
- **El transform de las cajas del camión no está en CSS.** GSAP escribe el
  transform de un `<g>` de SVG en el atributo y una regla de CSS lo pisaría: el
  estado por defecto (camión cargado) es el legible sin JS, y solo el JS lo
  descarga para volver a montarlo.
- **El mapa apunta a la localidad**, nunca a una calle: la dirección es inventada.
- **Sin `aggregateRating` ni `review`** en `schema.org`.
- **Movimiento reducido**: se apaga el movimiento, no el contenido. La caja activa
  se sigue marcando, la calculadora sigue calculando y los contadores muestran su
  cifra final.

## Verificación

Ver `screenshots/`: capturas a 1440×900 y 390×844, más las pasadas con GSAP
bloqueado y con `prefers-reduced-motion: reduce`. Consola limpia, sin peticiones
fallidas y sin imágenes rotas; probados el botón de cookies, el menú móvil, el
botón del mapa, el formulario y la calculadora.

## Licencia de uso

Plantilla de muestra propiedad de su autor. El contenido es ficticio y no puede
presentarse como un negocio real.

---

## La cortina de entrada

Obligatoria en toda la biblioteca, y **el gesto sale del concepto de esta
plantilla**, no es la misma cortina repintada: aquí se pasa la **cinta de precintar** de un lado a otro, se sella el lote, y la caja se abre por el medio: las dos solapas de cartón se van con el canto redondeado.

La mecánica es la de siempre: línea de tiempo encadenada, `expo.inOut`, borde
curvo y **entrega limpia al hero** —el revelado del titular arranca mientras la
cortina todavía se está yendo, no después—.

**Se retira siempre.** Sin GSAP y con `prefers-reduced-motion` la hoja de estilos
ni la pinta (`html:not(.has-motion) .cortina{display:none}`), y con movimiento hay
una red de seguridad por tiempo en `main.js` que la quita y lanza el arranque
pase lo que pase, para que la página no pueda quedarse tapada si una animación se
atasca o las tipografías no resuelven.
