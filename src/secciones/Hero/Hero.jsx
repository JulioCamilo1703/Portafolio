import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import DinoJuego from "../../secciones/Hero/DInoJuego/Dinojuego";
import "./Hero.css";

// Fuera del componente para que no se recree en cada render

const LINEAS = [
  { texto: "bienvenido", clase: "hero__titulo", prompt: true },
  { texto: "mi nombre es Julio Camilo", clase: "hero__sub" },
  { texto: "y este es mi portafolio", clase: "hero__sub" },
  { texto: "Soy desarrollador web Full Stack.", clase: "hero__rol" },
  { texto: "Trabajo tanto en frontend como en backend, creando sitios y aplicaciones de principio a fin.", clase: "hero__desc" },
  { texto: "Me gusta entender cómo funcionan las cosas, probar ideas y aprender mientras las construyo.", clase: "hero__desc" },
];


const reducirMovimiento =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useMecanografia(lineas, velocidad = 25) {
  const [linea, setLinea] = useState(reducirMovimiento ? lineas.length : 0);
  const [car, setCar] = useState(0);

  useEffect(() => {
    if (linea >= lineas.length) return;
    const actual = lineas[linea].texto;

    if (car < actual.length) {
      const t = setTimeout(() => setCar((c) => c + 1), velocidad);
      return () => clearTimeout(t);
    }
    // termino la linea: pausa corta y pasa a la siguiente
    const t = setTimeout(() => {
      setLinea((l) => l + 1);
      setCar(0);
    }, 350);
    return () => clearTimeout(t);
  }, [linea, car, lineas, velocidad]);

  return { linea, car };
}

export default function Hero() {
  const { linea, car } = useMecanografia(LINEAS);
  const terminado = linea >= LINEAS.length; // ya se escribio todo el texto

  return (
    <section className="seccion hero" id="inicio">
      <DinoJuego />
      <div className="hero__grid">

        <div className="hero__texto">
          {LINEAS.map((l, i) => {
            const escrito =
              i < linea ? l.texto : i === linea ? l.texto.slice(0, car) : "";
            const pendiente = l.texto.slice(escrito.length);
            const Etiqueta = i === 0 ? "h1" : "p";

            return (
              <Etiqueta key={i} className={l.clase}>
                {l.prompt && <span className="hero__prompt">$ </span>}
                <span>{escrito}</span>
                {i === Math.min(linea, LINEAS.length - 1) && (
                  <span className="hero__cursor" aria-hidden="true" />
                )}
                {/* texto invisible: reserva el espacio y evita que todo "salte" */}
                <span className="hero__oculto" aria-hidden="true">{pendiente}</span>
              </Etiqueta>
            );
          })}

          {/* Aparece cuando termina de escribirse; el espacio ya esta reservado */}
          <a
            href="#sobre-mi"
            className={terminado ? "hero__boton hero__boton--listo" : "hero__boton"}
          >
            Más sobre mí
            <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}