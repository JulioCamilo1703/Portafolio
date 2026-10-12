import {
  FaGithub, FaReact, FaCss3Alt, FaJs, FaHtml5, FaPhp, FaLaravel,
  FaPython, FaPaintBrush,
} from "react-icons/fa";
import { SiVite, SiMysql, SiTailwindcss, SiTypescript } from "react-icons/si";
import { ExternalLink } from "lucide-react";
import "./Proyectos.css";
import portafolioImg from "../../assets/portafolio.png";
import dinosaurioImg from "../../assets/dinosaurio.png";

/* Nombre de la tecnologia -> icono.
   Si escribes una que no esta aqui, se muestra como texto. */
const ICONOS = {
  React: FaReact,
  Vite: SiVite,
  CSS: FaCss3Alt,
  HTML: FaHtml5,
  JavaScript: FaJs,
  TypeScript: SiTypescript,
  Tailwind: SiTailwindcss,
  PHP: FaPhp,
  Laravel: FaLaravel,
  MySQL: SiMysql,
  Python: FaPython,
  Canvas: FaPaintBrush, // canvas no tiene logo oficial
};

/* ---------- Datos: edita aqui ----------
   repo, demo e imagen son opcionales: si los dejas vacios no aparecen.
   imagen: captura del proyecto. Guardala en public/proyectos/ y usa
   la ruta asi: "/proyectos/mi-captura.png" (y describe lo que se ve en "alt"). */

const PROYECTOS = [
  {
    titulo: "Portafolio personal",
    descripcion:
      "Esta misma página: secciones con navegación por anclas, tema claro y oscuro, y un Hero que se escribe como una terminal.",
    tecnologias: ["React", "Vite", "CSS"],
    repo: "",
    demo: "",
    imagen: portafolioImg,
    alt: "Portafolio personal",
  },
  {
    titulo: "Juego del dinosaurio",
    descripcion:
      "Un juego de correr y saltar cactus hecho desde cero con canvas, sin librerías de juegos. Dibujé el dinosaurio en pixel art.",
    tecnologias: ["React", "Canvas", "JavaScript"],
    repo: "",
    demo: "",
    imagen: dinosaurioImg,
    alt: "Juego del dinosaurio",
  },
];

export default function Proyectos() {
  return (
    <section className="seccion proyectos" id="proyectos">
      <div className="proyectos__contenido">
        <h2 className="proyectos__titulo">
          <span className="proyectos__prompt" aria-hidden="true">$ </span>
          proyectos
        </h2>
        <p className="proyectos__intro">
          Proyectos que construyo para practicar y mostrar cómo trabajo.
        </p>

        <ul className="proyectos__lista">
          {PROYECTOS.map(({ titulo, descripcion, tecnologias, repo, demo, imagen, alt }) => (
            <li key={titulo} className="proyecto">
              {imagen && (
                <img className="proyecto__imagen" src={imagen} alt={alt} loading="lazy" />
              )}

              <h3 className="proyecto__titulo">{titulo}</h3>
              <p className="proyecto__descripcion">{descripcion}</p>

              <ul className="proyecto__tecnologias" aria-label="Tecnologías usadas">
                {tecnologias.map((t) => {
                  const Icono = ICONOS[t];
                  return Icono ? (
                    <li key={t} className="tec tec--icono" title={t}>
                      <Icono size={20} aria-hidden="true" />
                      <span className="solo-lectores">{t}</span>
                    </li>
                  ) : (
                    <li key={t} className="tec">{t}</li>
                  );
                })}
              </ul>

              {(repo || demo) && (
                <div className="proyecto__enlaces">
                  {repo && (
                    <a href={repo} target="_blank" rel="noopener noreferrer">
                      <FaGithub size={16} aria-hidden="true" /> código
                    </a>
                  )}
                  {demo && (
                    <a href={demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} aria-hidden="true" /> ver demo
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}

          <li className="proyecto proyecto--siguiente">
            <h3 className="proyecto__titulo">Siguiente proyecto</h3>
            <p className="proyecto__descripcion">
              En construcción. Aquí va lo próximo que termine.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}