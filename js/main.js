/* ==========================================================================
   CARREXO — plantilla de demostración (negocio ficticio)
   Concepto «Inventario». HTML + CSS + este archivo. GSAP, ScrollTrigger y
   Lenis por CDN. Sin ellos la página se lee entera: el camión aparece ya
   cargado, que es su estado legible, y la calculadora de volumen funciona.
   ========================================================================== */

(function () {
  "use strict";

  var raiz = document.documentElement;
  var mqReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducido = mqReducido.matches;
  var gsapListo = !!(window.gsap && window.ScrollTrigger);
  var movimiento = gsapListo && !reducido;

  if (gsapListo) { window.gsap.registerPlugin(window.ScrollTrigger); }
  if (movimiento) { raiz.classList.add("has-motion"); }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ======================================================================
     1. CONTENIDO — con o sin movimiento
     ====================================================================== */

  (function menu() {
    var boton = $("#hamburguesa"), nav = $("#nav");
    if (!boton || !nav) { return; }
    function cerrar() {
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir menú");
      nav.classList.remove("esta-abierto");
    }
    boton.addEventListener("click", function () {
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", abierto ? "false" : "true");
      boton.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
      nav.classList.toggle("esta-abierto", !abierto);
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", cerrar); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("esta-abierto")) { cerrar(); boton.focus(); }
    });
  })();

  (function cookies() {
    var banner = $("#cookie-banner"), ok = $("#cookie-ok");
    if (!banner || !ok) { return; }
    var CLAVE = "carrexo-cookies";
    var aceptado = false;
    try { aceptado = localStorage.getItem(CLAVE) === "1"; } catch (e) {}
    if (!aceptado) { banner.hidden = false; }
    ok.addEventListener("click", function () {
      banner.hidden = true;
      try { localStorage.setItem(CLAVE, "1"); } catch (e) {}
    });
  })();

  (function mapa() {
    var boton = $("#mapa-boton"), caja = $("#mapa");
    if (!boton || !caja) { return; }
    boton.addEventListener("click", function () {
      var marco = document.createElement("iframe");
      /* la localidad, nunca una calle concreta: la dirección es inventada */
      marco.src = "https://www.google.com/maps?q=Ordes+A+Coruna&output=embed";
      marco.title = "Mapa de Ordes, A Coruña (la dirección de la nave es ficticia)";
      marco.loading = "lazy";
      marco.referrerPolicy = "no-referrer-when-downgrade";
      marco.setAttribute("width", "600");
      marco.setAttribute("height", "320");
      caja.insertBefore(marco, boton.nextSibling);
      boton.remove();
    });
  })();

  (function formulario() {
    var form = $("#formulario"), salida = $("#formulario-respuesta");
    if (!form || !salida) { return; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = $("#f-nombre").value.trim();
      var tel = $("#f-tel").value.trim();
      if (!nombre || !tel || !$("#f-ok").checked) {
        salida.textContent = "Faltan el nombre, el teléfono o el aviso legal.";
        return;
      }
      salida.textContent = "Demostración: no se envía nada. Te llamaríamos, " + nombre + ".";
      form.reset();
      calcular();
    });
  })();

  /* --- Calculadora de volumen: es contenido, funciona siempre -------------- */
  var calcular = (function () {
    var form = $("#calculadora");
    var salidaM3 = $("#salida-m3");
    var salidaCamion = $("#salida-camion");
    if (!form || !salidaM3) { return function () {}; }
    var campos = $$("input[data-m3]", form);

    function frase(m3) {
      if (m3 === 0) { return "Pon cuántas habitaciones tienes y te decimos por dónde anda."; }
      if (m3 < 10) { return "Es un porte, no una mudanza: con la furgoneta grande sobra."; }
      if (m3 < 26) { return "Entra de sobra en el camión de 40 m³ y se hace en un viaje."; }
      if (m3 <= 40) { return "Un viaje del camión de 40 m³, bien cargado y con el día completo."; }
      return "Pasa de 40 m³: son dos viajes o un camión más grande. Eso se cierra en la visita.";
    }

    function hacer() {
      var total = 0;
      campos.forEach(function (c) {
        var n = parseInt(c.value, 10);
        if (isNaN(n) || n < 0) { n = 0; }
        total += n * (parseFloat(c.dataset.m3) || 0);
      });
      total = Math.round(total);
      salidaM3.textContent = total;
      if (salidaCamion) { salidaCamion.textContent = frase(total); }
    }

    form.addEventListener("input", hacer);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    hacer();
    return hacer;
  })();

  /* --- Caja activa del camión: dice por dónde va la explicación ------------ */
  var marcarCaja = (function () {
    var cajas = $$(".caja");
    var grupos = $$(".carga-caja");
    var aviso = $("#camion-aviso");
    if (!cajas.length) { return function () {}; }

    function marcar(i) {
      cajas.forEach(function (c, j) { c.classList.toggle("esta-activa", j === i); });
      var nombre = cajas[i] ? cajas[i].dataset.caja : null;
      grupos.forEach(function (g) {
        g.classList.toggle("esta-apagada", !!nombre && g.dataset.caja !== nombre);
      });
      if (aviso && cajas[i]) {
        aviso.textContent = $(".caja-ref", cajas[i]).textContent + " · " + $("h3", cajas[i]).textContent;
      }
    }
    marcar(0);

    if ("IntersectionObserver" in window && !movimiento) {
      var io = new IntersectionObserver(function (ent) {
        ent.forEach(function (e) { if (e.isIntersecting) { marcar(cajas.indexOf(e.target)); } });
      }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });
      cajas.forEach(function (c) { io.observe(c); });
    }
    return marcar;
  })();

  /* ======================================================================
     2. MOVIMIENTO
     ====================================================================== */
  if (!movimiento) { return; }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.17, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var destino = document.querySelector(a.getAttribute("href"));
        if (!destino) { return; }
        e.preventDefault();
        lenis.scrollTo(destino, { offset: -80 });
      });
    });
  }

  /* Un ScrollTrigger con `once` no dispara si el elemento ya está en pantalla
     al crearse: lo de una sola vez, con IntersectionObserver. */
  function alEntrar(el, hacer) {
    if (!("IntersectionObserver" in window)) { hacer(); return; }
    var io = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); hacer(); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    io.observe(el);
  }

  function titulares() {
    $$("[data-revelar]").forEach(function (el) {
      var texto = (el.textContent || "").replace(/\s+/g, " ").trim();
      el.setAttribute("aria-label", texto);
      el.textContent = "";
      var frag = document.createDocumentFragment();
      var partes = [];
      texto.split(" ").forEach(function (palabra) {
        var caja = document.createElement("span");
        caja.className = "palabra";
        caja.setAttribute("aria-hidden", "true");
        var dentro = document.createElement("i");
        dentro.textContent = palabra;
        caja.appendChild(dentro);
        frag.appendChild(caja);
        frag.appendChild(document.createTextNode(" "));
        partes.push(dentro);
      });
      el.appendChild(frag);
      /* y:0 explícito: GSAP lee el translate3d del CSS como `y` en píxeles */
      gsap.set(partes, { y: 0, yPercent: 112 });
      alEntrar(el, function () {
        gsap.to(partes, { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.045 });
      });
    });
  }

  function apariciones() {
    $$("[data-aparecer]").forEach(function (el, i) {
      alEntrar(el, function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: (i % 4) * 0.07 });
      });
    });
  }

  /* --- La pila del hero se monta caja a caja ------------------------------- */
  function pilaHero() {
    var svg = $("#pila-hero");
    if (!svg) { return; }
    var cajas = $$(".pila-caja", svg).sort(function (a, b) {
      return parseInt(a.dataset.n, 10) - parseInt(b.dataset.n, 10);
    });
    gsap.set(cajas, { y: 60, opacity: 0 });
    alEntrar(svg, function () {
      gsap.to(cajas, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.4)", stagger: 0.09 });
    });
  }

  function franja() {
    var pista = $("#franja-pista");
    if (!pista) { return; }
    var bucle = gsap.to(pista, { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
    var vuelta;
    ScrollTrigger.create({
      onUpdate: function (self) {
        bucle.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 700, 5));
        clearTimeout(vuelta);
        vuelta = setTimeout(function () { gsap.to(bucle, { timeScale: 1, duration: 0.8 }); }, 140);
      }
    });
  }

  /* --- EL CAMIÓN: la escena se ancla y las cajas entran una a una ----------
     GSAP escribe el transform de un <g> de SVG en el atributo, así que el CSS
     no toca el transform de `.carga-caja`: el estado por defecto (cargado) es
     el legible sin JS, y solo JS lo descarga para volver a montarlo. */
  function camion() {
    var escena = $("#camion-escena");
    var furgon = $("#furgon");
    if (!escena || !furgon || window.innerWidth < 980) { return; }

    var grupos = $$(".carga-caja", furgon);
    /* cada caja entra desde fuera del camión, por la derecha y desde abajo */
    grupos.forEach(function (g, i) {
      gsap.set(g, { x: 520 + i * 40, y: 90, opacity: 0 });
    });

    var ultima = -1;
    var linea = gsap.timeline({
      scrollTrigger: {
        trigger: escena,
        start: "top top",
        end: "+=" + Math.round(window.innerHeight * 2.6),
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var i = Math.min(Math.floor(self.progress * grupos.length), grupos.length - 1);
          if (i !== ultima) { ultima = i; marcarCaja(i); }
        }
      }
    });

    grupos.forEach(function (g, i) {
      linea.to(g, {
        x: 0, y: 0, opacity: 1, duration: 0.7, ease: "power2.out"
      }, i * 0.75);
    });
  }

  function contadores() {
    $$(".contador").forEach(function (el) {
      var hasta = parseFloat(el.dataset.hasta || el.textContent) || 0;
      var estado = { v: 0 };
      el.textContent = "0";
      alEntrar(el, function () {
        gsap.to(estado, {
          v: hasta, duration: 1.3, ease: "power2.out",
          onUpdate: function () { el.textContent = Math.round(estado.v); }
        });
      });
    });
  }

  function imanes() {
    if (!window.matchMedia("(hover:hover)").matches) { return; }
    $$("[data-iman]").forEach(function (el) {
      var aX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      var aY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      el.addEventListener("mousemove", function (e) {
        var c = el.getBoundingClientRect();
        aX((e.clientX - (c.left + c.width / 2)) * 0.3);
        aY((e.clientY - (c.top + c.height / 2)) * 0.42);
      });
      el.addEventListener("mouseleave", function () { aX(0); aY(0); });
    });
  }

  function cursor() {
    var caja = $("#cursor"), texto = $("#cursor-texto");
    if (!caja || !window.matchMedia("(hover:hover)").matches) { return; }
    var aX = gsap.quickTo(caja, "x", { duration: 0.2, ease: "power3.out" });
    var aY = gsap.quickTo(caja, "y", { duration: 0.2, ease: "power3.out" });
    window.addEventListener("mousemove", function (e) { aX(e.clientX); aY(e.clientY); }, { passive: true });

    [
      { sel: "#furgon", txt: "el camión" },
      { sel: ".caja", txt: "servicio" },
      { sel: ".contenedor", txt: "guardamuebles" },
      { sel: ".equipo img", txt: "ilustración" }
    ].forEach(function (g) {
      $$(g.sel).forEach(function (el) {
        el.addEventListener("mouseenter", function () { caja.classList.add("es-grande"); texto.textContent = g.txt; });
        el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); texto.textContent = ""; });
      });
    });
    $$("a, button").forEach(function (el) {
      el.addEventListener("mouseenter", function () { caja.classList.add("es-grande"); });
      el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); });
    });
  }

  function arrancar() {
    titulares();
    apariciones();
    pilaHero();
    franja();
    camion();
    contadores();
    imanes();
    cursor();
    ScrollTrigger.refresh();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(arrancar);
  } else {
    window.addEventListener("load", arrancar);
  }

  if (mqReducido.addEventListener) {
    mqReducido.addEventListener("change", function () { window.location.reload(); });
  }
})();
