import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, FileText, Copy, Check, ExternalLink } from "lucide-react";
import "./Contacto.css";

/* ---------- Datos: edita aqui ---------- */

// Va partido en dos: el correo completo no aparece en el HTML hasta que alguien pulsa "mostrar".
const CORREO = { usuario: "juliocamilo1703", dominio: "gmail.com" };

// El PDF vive en la carpeta public/ (en la raiz del proyecto, junto a src/).
// Los archivos de public/ NO se importan: se enlazan por su ruta.
// BASE_URL hace que funcione igual en dev, en build y si publicas en una subruta.
const CV = `${import.meta.env.BASE_URL}CV_JulioCamiloVera.pdf`;

// Las URLs de las redes deben empezar con https:// (si no, el navegador las toma como ruta interna)
const REDES = [
  {
    nombre: "LinkedIn",
    detalle: "Mi perfil profesional",
    url: "https://www.linkedin.com/in/julio-c%C3%A9sar-camilo-vera-9114a3298",
    Icono: FaLinkedin,
  },
  {
    nombre: "GitHub",
    detalle: "Mi código y mis proyectos",
    url: "https://github.com/JulioCamilo1703",
    Icono: FaGithub,
  },
];

/* ---------- Correo oculto hasta pulsar ---------- */

function CorreoOculto() {
  const [visible, setVisible] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const direccion = `${CORREO.usuario}@${CORREO.dominio}`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(direccion);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* si el navegador no deja copiar, igual queda el enlace mailto */
    }
  }

  return (
    <li>
      <div className="contacto__fila">
        <Mail size={22} aria-hidden="true" />
        <div className="contacto__info">
          <p className="contacto__nombre">Correo</p>
          {visible ? (
            <a className="contacto__valor" href={`mailto:${direccion}`}>{direccion}</a>
          ) : (
            <p className="contacto__detalle">Oculto para evitar spam</p>
          )}
        </div>

        {visible ? (
          <button className="contacto__accion" onClick={copiar} aria-label="Copiar correo">
            {copiado ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          </button>
        ) : (
          <button className="contacto__accion" onClick={() => setVisible(true)}>
            mostrar
          </button>
        )}
        <span className="solo-lectores" aria-live="polite">{copiado ? "Correo copiado" : ""}</span>
      </div>
    </li>
  );
}

/* ---------- Seccion ---------- */

export default function Contacto() {
  return (
    <section className="seccion contacto" id="contacto">
      <div className="contacto__grid">
        <div className="contacto__texto">
          <h2 className="contacto__titulo">
            <span className="contacto__prompt" aria-hidden="true">$ </span>
            contacto
          </h2>
          <p>
            ¿Tienes un proyecto en marcha o estás buscando a alguien para sumarse a tu equipo? 
            Me interesa conocer nuevas oportunidades, aportar con mis conocimientos en desarrollo web y seguir creciendo con cada proyecto.
          </p>
        </div>

        <ul className="contacto__lista">
          <CorreoOculto />

          {REDES.map(({ nombre, detalle, url, Icono }) => (
            <li key={nombre}>
              <a className="contacto__fila" href={url} target="_blank" rel="noopener noreferrer">
                <Icono size={22} aria-hidden="true" />
                <div className="contacto__info">
                  <p className="contacto__nombre">{nombre}</p>
                  <p className="contacto__detalle">{detalle}</p>
                </div>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            </li>
          ))}

          <li>
            <a className="contacto__fila" href={CV} target="_blank" rel="noopener noreferrer">
              <FileText size={22} aria-hidden="true" />
              <div className="contacto__info">
                <p className="contacto__nombre">Currículum (CV)</p>
                <p className="contacto__detalle">Se abre en otra pestaña y ahí puedes descargarlo</p>
              </div>
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>

      <p className="contacto__pie">© {new Date().getFullYear()} Julio</p>
    </section>
  );
}