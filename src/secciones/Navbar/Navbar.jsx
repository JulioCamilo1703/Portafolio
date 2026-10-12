import { useEffect, useState } from "react";
import ThemeToggle from "../themetoggle/themetoggle";
import "./Navbar.css";

const ENLACES = [
  { id: "sobre-mi", texto: "sobre mí" },
  { id: "proyectos", texto: "proyectos" },
  { id: "contacto", texto: "contacto" },
];

export default function Navbar() {
  const [activa, setActiva] = useState("");

  // Marca como activo el enlace de la seccion que esta en pantalla
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setActiva(e.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" } // la seccion que cruza el centro
    );
    ["inicio", ...ENLACES.map((e) => e.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    });
    return () => observador.disconnect();
  }, []);

  return (
    <header className="nav">
      <nav className="nav__contenido" aria-label="Principal">
        <a href="/" className="nav__logo">~/julio</a>

        <ul className="nav__lista">
          {ENLACES.map(({ id, texto }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activa === id ? "nav__link nav__link--activo" : "nav__link"}
                aria-current={activa === id ? "true" : undefined}
              >
                {texto}
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle />
      </nav>
    </header>
  );
}