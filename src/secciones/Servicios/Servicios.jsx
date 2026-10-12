import "./Servicios.css";

const LINK_COTIZACION =
  "https://docs.google.com/forms/d/e/1FAIpQLSfG55wWlSkQnspqfBAg20APvgtPwyyCqxdlw9282ahXNYtP3Q/viewform?usp=publish-editor";

const SERVICIOS = [
  {
    id: "presencia",
    emoji: "🌐",
    titulo: "Página Web Informativa",
    descripcion:
      "Una página web para presentar tu negocio o servicios, mostrar información importante y facilitar que tus clientes te contacten.",
    incluye: [
      "Una página con secciones acordadas",
      "Diseño adaptable a celulares y computadoras",
      "Botón de WhatsApp y enlaces a redes sociales",
      "Integración de textos, logo e imágenes proporcionados por el cliente",
      "Pruebas básicas antes de la entrega",
    ],
    destacado: false,
  },
  {
    id: "multipagina",
    emoji: "📄",
    titulo: "Sitio Web Multipágina",
    descripcion:
      "Para negocios que necesitan organizar más información en páginas separadas, como inicio, servicios, nosotros, galería y contacto.",
    incluye: [
      "Hasta 5 páginas informativas acordadas",
      "Diseño adaptable a celulares y computadoras",
      "Menú de navegación entre páginas",
      "Botón de WhatsApp y enlaces a redes sociales",
      "Integración del contenido proporcionado por el cliente",
    ],
    destacado: true,
  },
  {
    id: "tienda",
    emoji: "🛒",
    titulo: "Tienda Virtual",
    descripcion:
      "Una web para mostrar productos y recibir pedidos. Las funciones de compra, pagos en línea y gestión de inventario se definen según las necesidades del negocio.",
    incluye: [
      "Catálogo de productos",
      "Presentación de productos con imágenes e información proporcionadas",
      "Proceso de pedidos definido antes de comenzar",
      "Opciones de carrito y pagos en línea según el alcance acordado",
      "Revisión de las funcionalidades antes de la entrega",
    ],
    destacado: false,
  },
];

export default function Servicios() {
  return (
    <div className="servicios-page">
      {/* Hero de la página */}
      <section className="servicios-hero">
        <span className="servicios-hero__tag">lo que ofrezco</span>
        <h1 className="servicios-hero__titulo">
          Servicios de <span className="servicios-hero__acento">desarrollo web</span>
        </h1>
        <p className="servicios-hero__subtitulo">
          Desarrollo páginas web para presentar negocios, mostrar servicios
          o vender productos. Definimos contigo el alcance, el precio y el
          plazo de entrega antes de comenzar cada proyecto.
        </p>
      </section>

      {/* Cards de servicios */}
      <section className="servicios-cards" aria-label="Planes disponibles">
        {SERVICIOS.map((s) => (
          <article
            key={s.id}
            className={`servicio-card ${s.destacado ? "servicio-card--destacado" : ""}`}
          >
            {s.destacado && (
              <div className="servicio-card__badge">Más páginas</div>
            )}
            <div className="servicio-card__emoji" aria-hidden="true">
              {s.emoji}
            </div>
            <h2 className="servicio-card__titulo">{s.titulo}</h2>
            <p className="servicio-card__descripcion">{s.descripcion}</p>
            <ul className="servicio-card__lista">
              {s.incluye.map((item) => (
                <li key={item} className="servicio-card__item">
                  <span className="servicio-card__check" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* CTA principal fuera de las cards */}
      <section className="servicios-cta">
        <p className="servicios-cta__texto">
          ¿Listo para empezar? Cuéntame tu proyecto y te preparo una
          propuesta con alcance, precio y plazo antes de comenzar.
        </p>
        <a
          href={LINK_COTIZACION}
          target="_blank"
          rel="noopener noreferrer"
          className="servicios-cta__btn"
        >
          Solicitar cotización
        </a>
        <p className="servicios-cta__nota">
          ¿Tienes algo diferente en mente?{" "}
          <a
            href={LINK_COTIZACION}
            target="_blank"
            rel="noopener noreferrer"
            className="servicios-cta__link"
          >
            Cuéntame tu idea
          </a>{" "}
          igual, lo evaluamos juntos.
        </p>
      </section>
    </div>
  );
}