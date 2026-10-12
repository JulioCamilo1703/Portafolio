import { useState } from "react";
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaPhp, FaLaravel,
  FaGitAlt, FaGithub, FaFigma, FaFileExcel, FaFileWord,
  FaPython, FaLanguage, FaRobot,
} from "react-icons/fa";
import { SiTailwindcss, SiMysql, SiVite, SiPostman, SiTypescript } from "react-icons/si";
import "./SobreMi.css";

/* ---------- Datos ---------- */

const PESTANAS = [
  { id: "habilidades", texto: "habilidades" },
  { id: "aprendiendo", texto: "aprendiendo" },
  { id: "trayectoria", texto: "trayectoria" },
];

const HABILIDADES = [
  {
    grupo: "frontend",
    items: [
      { nombre: "HTML", Icono: FaHtml5 },
      { nombre: "CSS", Icono: FaCss3Alt },
      { nombre: "JavaScript", Icono: FaJs },
      { nombre: "React", Icono: FaReact },
      { nombre: "Tailwind", Icono: SiTailwindcss },
    ],
  },
  {
    grupo: "backend",
    items: [
      { nombre: "PHP", Icono: FaPhp },
      { nombre: "Laravel", Icono: FaLaravel },
      { nombre: "MySQL", Icono: SiMysql },
    ],
  },
  {
    grupo: "herramientas",
    items: [
      { nombre: "Vite", Icono: SiVite },
      { nombre: "Git", Icono: FaGitAlt },
      { nombre: "GitHub", Icono: FaGithub },
      { nombre: "Figma", Icono: FaFigma },
      { nombre: "Postman", Icono: SiPostman },
      { nombre: "Excel", Icono: FaFileExcel },
      { nombre: "Word", Icono: FaFileWord },
    ],
  },
];

const APRENDIENDO = [
  { nombre: "Inglés", Icono: FaLanguage, detalle: "Para leer documentación sin traductor y comunicarme con cualquier equipo." },
  { nombre: "Python", Icono: FaPython, detalle: "Scripts y automatización de tareas repetitivas." },
  { nombre: "TypeScript", Icono: SiTypescript, detalle: "Código más seguro en mis proyectos de React." },
  { nombre: "Automatización con IA", Icono: FaRobot, detalle: "Flujos que ahorran trabajo manual usando modelos de IA." },
];

const TRAYECTORIA = [
  { etiqueta: "2022", titulo: "SENATI", texto: "Inicio de mi formación en desarrollo web." },
  { etiqueta: "Por mi cuenta", titulo: "Autodidacta", items: ["JavaScript", "React", "PHP / Laravel", "MySQL / APIs"] },
  { etiqueta: "Práctica", titulo: "Proyectos", items: ["Landing pages", "Aplicaciones web", "Sistemas administrativos", "APIs"] },
  { etiqueta: "Ahora", titulo: "En movimiento", items: ["Construyendo", "Aprendiendo", "Experimentando"], actual: true },
];

export default function SobreMi() {
  const [pestana, setPestana] = useState("habilidades");

  // Flechas izquierda/derecha cambian de pestaña (lo esperado en un role="tablist")
  function alTeclear(e) {
    const i = PESTANAS.findIndex((p) => p.id === pestana);
    let n;
    if (e.key === "ArrowRight") n = (i + 1) % PESTANAS.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + PESTANAS.length) % PESTANAS.length;
    else return;
    e.preventDefault();
    setPestana(PESTANAS[n].id);
    document.getElementById(`tab-${PESTANAS[n].id}`)?.focus();
  }

  return (
    <section className="seccion sobre" id="sobre-mi">
      <div className="sobre__grid">
        <div className="sobre__texto">
          <h2 className="sobre__titulo">
            <span className="sobre__prompt" aria-hidden="true">$ </span>
            sobre mí
          </h2>
          <p>
            Soy Julio, desarrollador web. Empecé por curiosidad y me quedé porque
            me gusta ver funcionando en pantalla algo que hace un rato era solo
            una idea.
          </p>
          <p>
            Trabajo tanto en frontend como en backend, y lo que más disfruto es
            ver el proyecto completo: desde la base de datos hasta el botón que
            aprieta el usuario.
          </p>
          <p>
            Busco mi primera oportunidad para seguir aprendiendo dentro de un
            equipo. Si tienes algo en mente, <a href="#contacto">contactame</a>.
          </p>
        </div>

        <div className="sobre__derecha">
          {/* Botones de navegación */}
          <div
            className="sobre__pestanas"
            role="tablist"
            aria-label="Ver información"
            onKeyDown={alTeclear}
          >
            {PESTANAS.map(({ id, texto }) => (
              <button
                key={id}
                role="tab"
                id={`tab-${id}`}
                className={pestana === id ? "pestana pestana--activa" : "pestana"}
                aria-selected={pestana === id}
                aria-controls={`panel-${id}`}
                tabIndex={pestana === id ? 0 : -1}
                onClick={() => setPestana(id)}
              >
                {texto}
              </button>
            ))}
          </div>

          {/* Contenedor de paneles con cambio dinámico */}
          <div className="sobre__paneles">
            {pestana === "habilidades" && (
              <div
                className="panel panel--habilidades"
                id="panel-habilidades"
                role="tabpanel"
                aria-labelledby="tab-habilidades"
              >
                {HABILIDADES.map(({ grupo, items }) => (
                  <div key={grupo} className="grupo">
                    <h3 className="grupo__titulo">{grupo}</h3>
                    <ul className="grupo__lista">
                      {items.map(({ nombre, Icono }) => (
                        <li key={nombre} className="tecnologia">
                          <Icono size={24} aria-hidden="true" />
                          <span>{nombre}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {pestana === "aprendiendo" && (
              <div
                className="panel"
                id="panel-aprendiendo"
                role="tabpanel"
                aria-labelledby="tab-aprendiendo"
              >
                <ul className="aprendo">
                  {APRENDIENDO.map(({ nombre, Icono, detalle }) => (
                    <li key={nombre} className="aprendo__fila">
                      <Icono size={26} aria-hidden="true" />
                      <div>
                        <p className="aprendo__nombre">{nombre}</p>
                        <p className="aprendo__detalle">{detalle}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pestana === "trayectoria" && (
              <div
                className="panel"
                id="panel-trayectoria"
                role="tabpanel"
                aria-labelledby="tab-trayectoria"
              >
                <ol className="camino">
                  {TRAYECTORIA.map(({ etiqueta, titulo, texto, items, actual }) => (
                    <li key={titulo} className={actual ? "paso paso--actual" : "paso"}>
                      <p className="paso__etiqueta">{etiqueta}</p>
                      <p className="paso__titulo">{titulo}</p>
                      {texto && <p className="paso__texto">{texto}</p>}
                      {items && (
                        <ul className="paso__items">
                          {items.map((it) => (
                            <li key={it}>{it}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}