import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../themetoggle/themetoggle";
import "./Navbar.css";

const ENLACES_INICIO = [
  { id: "sobre-mi", texto: "sobre mí", icono: "👤" },
  { id: "proyectos", texto: "proyectos", icono: "🗂️" },
  { id: "contacto", texto: "contacto", icono: "✉️" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const enInicio = pathname === "/" || pathname === "";
  const [activa, setActiva] = useState("");

  useEffect(() => {
    if (!enInicio) {
      setActiva("");
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setActiva(e.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    ["inicio", ...ENLACES_INICIO.map((e) => e.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    });
    return () => observador.disconnect();
  }, [enInicio]);

  return (
    <>
      {/* ── Navbar de escritorio (top) ── */}
      <header className="nav">
        <nav className="nav__contenido" aria-label="Principal">
          <Link to="/" className="nav__logo">~/julio</Link>

          <ul className="nav__lista">
            <li>
              <Link
                to="/servicios"
                className={!enInicio ? "nav__link nav__link--activo" : "nav__link"}
              >
                servicios
              </Link>
            </li>
            {ENLACES_INICIO.map(({ id, texto }) => (
              <li key={id}>
                {enInicio ? (
                  <a
                    href={`#${id}`}
                    className={activa === id ? "nav__link nav__link--activo" : "nav__link"}
                    aria-current={activa === id ? "true" : undefined}
                  >
                    {texto}
                  </a>
                ) : (
                  <Link to={`/#${id}`} className="nav__link">
                    {texto}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <ThemeToggle />
        </nav>
      </header>

      {/* ── Barra inferior móvil ── */}
      <nav className="nav-bottom" aria-label="Navegación móvil">
        <Link
          to="/"
          className={enInicio && activa === "" ? "nav-bottom__item nav-bottom__item--activo" : "nav-bottom__item"}
        >
          <span className="nav-bottom__icono">🏠</span>
          <span className="nav-bottom__texto">inicio</span>
        </Link>

        {ENLACES_INICIO.map(({ id, texto, icono }) => (
          <a
            key={id}
            href={enInicio ? `#${id}` : `/#${id}`}
            className={enInicio && activa === id ? "nav-bottom__item nav-bottom__item--activo" : "nav-bottom__item"}
            aria-current={enInicio && activa === id ? "true" : undefined}
          >
            <span className="nav-bottom__icono">{icono}</span>
            <span className="nav-bottom__texto">{texto}</span>
          </a>
        ))}

        <Link
          to="/servicios"
          className={!enInicio ? "nav-bottom__item nav-bottom__item--activo" : "nav-bottom__item"}
        >
          <span className="nav-bottom__icono">💼</span>
          <span className="nav-bottom__texto">servicios</span>
        </Link>
      </nav>
    </>
  );
}