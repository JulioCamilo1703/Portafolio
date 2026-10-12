import { useEffect, useRef, useState } from "react";
import "./Dinojuego.css";

const ANCHO = 1200;
const ALTO = 700;
const SUELO = 560;

const DINO_X = 130;
const DINO_X_HERO = 760;
const PX = 6;

const GRAVEDAD = 2000;
const SALTO = 900;

const CUERPO = [
  "..........######",
  "..........##.###",
  "..........######",
  "..........######",
  "..........###...",
  "#........####...",
  "#.......#####...",
  "##.....######...",
  ".###..#######...",
  "..##########....",
  "...########.....",
  "....######......",
];

const PIERNAS = [
  [
    ".....##..##.....",
    ".....##.........",
    ".....###........",
  ],
  [
    ".....##..##.....",
    ".........##.....",
    ".........###....",
  ],
];

const ALTO_DINO = (CUERPO.length + 3) * PX;
const ANCHO_DINO = 16 * PX;

const TEXTOS = {
  idle: "sin internet, pero él sigue corriendo",
  jugando: "espacio, flecha arriba o toca para saltar",
  fin: "chocaste, ¿otra vez?",
};

function estadoInicial(mejor = 0) {
  return {
    fase: "idle",
    alt: 0,
    vy: 0,
    dist: 0,
    vel: 320,
    obst: [],
    sig: 520,
    mejor,
    nubes: [
      { x: 80, y: 100, escala: 1 },
      { x: 430, y: 170, escala: 0.7 },
      { x: 830, y: 90, escala: 1.15 },
      { x: 1200, y: 210, escala: 0.55 },
    ],
    pajaros: [
      { x: 700, y: 190, escala: 0.9 },
      { x: 1100, y: 280, escala: 0.65 },
    ],
  };
}

function crearSvgDino(color, pierna = 0) {
  const filas = [...CUERPO, ...PIERNAS[pierna]];

  let rects = "";

  filas.forEach((fila, y) => {
    [...fila].forEach((pixel, x) => {
      if (pixel === "#") {
        rects += `
          <rect
            x="${x * PX}"
            y="${y * PX}"
            width="${PX}"
            height="${PX}"
          />
        `;
      }
    });
  });

  const ancho = 16 * PX;
  const alto = filas.length * PX;

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${ancho}"
      height="${alto}"
      viewBox="0 0 ${ancho} ${alto}"
    >
      <g fill="${color}">
        ${rects}
      </g>
    </svg>
  `;
}

function crearSvgCactus(color) {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="120"
      viewBox="0 0 70 120"
    >
      <g fill="${color}">
        <rect x="25" y="10" width="20" height="110" rx="5"/>

        <rect x="8" y="48" width="18" height="12" rx="4"/>
        <rect x="8" y="42" width="12" height="35" rx="4"/>

        <rect x="44" y="32" width="18" height="12" rx="4"/>
        <rect x="50" y="27" width="12" height="32" rx="4"/>
      </g>
    </svg>
  `;
}

function svgAImagen(svg) {
  return new Promise((resolve) => {
    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });

    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      resolve({ img, url });
    };

    img.src = url;
  });
}

export default function DinoJuego() {
  const canvasRef = useRef(null);
  const juego = useRef(estadoInicial());
  const acciones = useRef({});
  const agachado = useRef(false);
  const sprites = useRef({
    dino: [],
    cactus: null,
  });

  const spriteUrls = useRef([]);

  const [fase, setFase] = useState("idle");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const g = juego.current;

    let raf = 0;
    let ultimo = 0;
    let visible = true;
    let cancelado = false;

    const reducir =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    function obtenerTema() {
      const root = getComputedStyle(
        document.documentElement
      );

      return {
        fondo:
          root
            .getPropertyValue("--fondo")
            .trim() || "#ffffff",

        texto:
          root
            .getPropertyValue("--texto")
            .trim() || "#111111",

        textoSuave:
          root
            .getPropertyValue("--texto-suave")
            .trim() || "#777777",

        acento:
          root
            .getPropertyValue("--acento")
            .trim() || "#2563eb",

        borde:
          root
            .getPropertyValue("--borde")
            .trim() || "#dddddd",

        noche:
          document.documentElement.getAttribute(
            "data-theme"
          ) === "dark",
      };
    }

    async function cargarSprites() {
      const tema = obtenerTema();

      const [dino0, dino1, cactus] =
        await Promise.all([
          svgAImagen(
            crearSvgDino(
              tema.acento,
              0
            )
          ),
          svgAImagen(
            crearSvgDino(
              tema.acento,
              1
            )
          ),
          svgAImagen(
            crearSvgCactus(
              tema.texto
            )
          ),
        ]);

      if (cancelado) {
        URL.revokeObjectURL(dino0.url);
        URL.revokeObjectURL(dino1.url);
        URL.revokeObjectURL(cactus.url);
        return;
      }

      sprites.current.dino = [
        dino0.img,
        dino1.img,
      ];

      sprites.current.cactus = cactus.img;

      spriteUrls.current.push(
        dino0.url,
        dino1.url,
        cactus.url
      );

      dibujar();
    }

    function puntos() {
      return Math.floor(g.dist / 10);
    }

    function moverDecoracion(dt, intensidad) {
      const velocidad = g.vel * intensidad;

      g.nubes.forEach((nube) => {
        nube.x -= velocidad * 0.08 * dt;

        if (nube.x < -180) {
          nube.x =
            ANCHO +
            Math.random() * 350;

          nube.y =
            70 +
            Math.random() * 180;
        }
      });

      g.pajaros.forEach((pajaro) => {
        pajaro.x -=
          velocidad * 0.35 * dt;

        if (pajaro.x < -100) {
          pajaro.x =
            ANCHO +
            250 +
            Math.random() * 500;

          pajaro.y =
            120 +
            Math.random() * 220;
        }
      });
    }

    function actualizar(dt) {
      if (g.fase === "idle") {
        g.dist += 90 * dt;

        moverDecoracion(
          dt,
          0.25
        );

        return;
      }

      if (g.fase !== "jugando") {
        return;
      }

      g.vel = Math.min(
        700,
        320 + g.dist * 0.025
      );

      g.dist += g.vel * dt;

      // =========================
      // SALTO / GRAVEDAD
      // =========================

      if (
        g.alt > 0 ||
        g.vy > 0
      ) {
        const gravedadActual =
          agachado.current && g.alt > 0
            ? GRAVEDAD * 2.5
            : GRAVEDAD;

        g.vy -= gravedadActual * dt;

        g.alt +=
          g.vy * dt;

        if (g.alt <= 0) {
          g.alt = 0;
          g.vy = 0;
        }
      }

      // =========================
      // GENERAR CACTUS
      // =========================

      g.sig -=
        g.vel * dt;

      if (g.sig <= 0) {
        const tipo =
          Math.random();

        let h = 65;
        let ancho = 48;

        if (tipo < 0.25) {
          h = 110;
          ancho = 55;
        } else if (
          tipo < 0.5
        ) {
          h = 75;
          ancho = 42;
        } else if (
          tipo < 0.72
        ) {
          h = 90;
          ancho = 65;
        }

        g.obst.push({
          x: ANCHO + 50,
          h,
          ancho,
        });

        g.sig =
          500 +
          Math.random() * 500;
      }

      // =========================
      // MOVER CACTUS
      // =========================

      g.obst.forEach((o) => {
        o.x -=
          g.vel * dt;
      });

      g.obst =
        g.obst.filter(
          (o) =>
            o.x >
            -120
        );

      moverDecoracion(
        dt,
        1
      );

      // =========================
      // COLISIÓN
      // =========================

      const dinoIzq =
        DINO_X + 22;

      const dinoDer =
        DINO_X +
        ANCHO_DINO -
        15;

      const dinoAbajo =
        SUELO -
        g.alt -
        2;

      const dinoArriba =
        dinoAbajo -
        ALTO_DINO +
        10;

      const choca =
        g.obst.some((o) => {
          const cactusIzq =
            o.x + 5;

          const cactusDer =
            o.x +
            o.ancho -
            5;

          const cactusArriba =
            SUELO -
            o.h +
            8;

          const horizontal =
            dinoDer >
              cactusIzq &&
            dinoIzq <
              cactusDer;

          const vertical =
            dinoAbajo >
              cactusArriba &&
            dinoArriba <
              SUELO;

          return (
            horizontal &&
            vertical
          );
        });

      if (choca) {
        g.fase = "fin";

        g.mejor =
          Math.max(
            g.mejor,
            puntos()
          );

        setFase("fin");
      }
    }

    function dibujarNube(
      x,
      y,
      escala,
      color,
      alpha
    ) {
      ctx.save();

      ctx.translate(
        x,
        y
      );

      ctx.scale(
        escala,
        escala
      );

      ctx.globalAlpha =
        alpha;

      ctx.fillStyle =
        color;

      ctx.beginPath();

      ctx.arc(
        0,
        20,
        25,
        0,
        Math.PI * 2
      );

      ctx.arc(
        30,
        5,
        35,
        0,
        Math.PI * 2
      );

      ctx.arc(
        65,
        20,
        25,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }

    function dibujarSolOLuna(
      tema
    ) {
      ctx.save();

      ctx.globalAlpha =
        0.18;

      ctx.fillStyle =
        tema.noche
          ? tema.texto
          : tema.acento;

      ctx.beginPath();

      ctx.arc(
        1000,
        120,
        55,
        0,
        Math.PI * 2
      );

      ctx.fill();

      if (tema.noche) {
        ctx.globalAlpha =
          0.9;

        ctx.fillStyle =
          tema.fondo;

        ctx.beginPath();

        ctx.arc(
          1020,
          103,
          48,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      ctx.restore();
    }

    function dibujarEstrellas(tema) {
      if (!tema.noche) {
        return;
      }

      ctx.save();

      ctx.fillStyle =
        tema.texto;

      ctx.globalAlpha =
        0.38;

      const estrellas = [
        [110, 80, 3],
        [220, 150, 2],
        [350, 95, 3],
        [540, 125, 2],
        [680, 75, 3],
        [770, 180, 2],
        [900, 70, 3],
        [1080, 180, 2],
        [1160, 100, 3],
      ];

      estrellas.forEach(
        ([x, y, r]) => {
          ctx.beginPath();

          ctx.arc(
            x,
            y,
            r,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }
      );

      ctx.restore();
    }

    function dibujarMontanas(
      tema
    ) {
      ctx.save();

      ctx.globalAlpha =
        tema.noche
          ? 0.1
          : 0.08;

      ctx.fillStyle =
        tema.texto;

      ctx.beginPath();

      ctx.moveTo(
        0,
        SUELO
      );

      ctx.lineTo(
        170,
        390
      );

      ctx.lineTo(
        320,
        SUELO
      );

      ctx.lineTo(
        510,
        350
      );

      ctx.lineTo(
        690,
        SUELO
      );

      ctx.lineTo(
        850,
        410
      );

      ctx.lineTo(
        1010,
        SUELO
      );

      ctx.lineTo(
        1180,
        370
      );

      ctx.lineTo(
        1400,
        SUELO
      );

      ctx.closePath();

      ctx.fill();

      ctx.restore();
    }

    function dibujarPajaro(
      x,
      y,
      escala,
      color
    ) {
      ctx.save();

      ctx.translate(
        x,
        y
      );

      ctx.scale(
        escala,
        escala
      );

      ctx.globalAlpha =
        0.26;

      ctx.strokeStyle =
        color;

      ctx.lineWidth = 4;

      ctx.beginPath();

      ctx.moveTo(
        0,
        10
      );

      ctx.quadraticCurveTo(
        15,
        -5,
        30,
        10
      );

      ctx.quadraticCurveTo(
        45,
        -5,
        60,
        10
      );

      ctx.stroke();

      ctx.restore();
    }

    function dibujarPasto(
      tema
    ) {
      ctx.save();

      ctx.fillStyle =
        tema.textoSuave;

      ctx.globalAlpha =
        0.35;

      for (
        let i = 0;
        i < 65;
        i++
      ) {
        const x =
          ((((i * 61 -
            g.dist * 0.7) %
            ANCHO) +
            ANCHO) %
            ANCHO);

        const alto =
          6 +
          (i % 3) * 3;

        ctx.fillRect(
          x,
          SUELO + 8,
          2,
          alto
        );
      }

      ctx.restore();
    }

    function dibujarPiedras(
      tema
    ) {
      ctx.save();

      ctx.fillStyle =
        tema.textoSuave;

      ctx.globalAlpha =
        0.25;

      for (
        let i = 0;
        i < 18;
        i++
      ) {
        const x =
          ((((i * 113 -
            g.dist * 0.5) %
            ANCHO) +
            ANCHO) %
            ANCHO);

        const y =
          SUELO +
          22 +
          (i % 2) * 12;

        ctx.fillRect(
          x,
          y,
          10 +
            (i % 3) * 6,
          3
        );
      }

      ctx.restore();
    }

    function dibujarDinosaurio(tema) {
      const spritesDino = sprites.current.dino;

      if (!spritesDino || spritesDino.length < 2) {
        return;
      }

      const enAire =
        g.alt > 0 ||
        g.fase === "fin";

      const corriendo =
        Math.floor(g.dist / 18) % 2;

      const sprite =
        spritesDino[
          enAire
            ? 0
            : corriendo
        ];

      // Evita intentar dibujar un sprite
      // que todavía no esté disponible.
      if (
        !(sprite instanceof HTMLImageElement) ||
        !sprite.complete ||
        sprite.naturalWidth === 0
      ) {
        return;
      }

      const x =
        g.fase === "idle"
          ? DINO_X_HERO
          : DINO_X;

      const y =
        SUELO -
        ALTO_DINO -
        g.alt;

      ctx.save();

      ctx.globalAlpha =
        g.fase === "fin"
          ? 0.45
          : 0.95;

      ctx.drawImage(
        sprite,
        x,
        y,
        ANCHO_DINO,
        ALTO_DINO
      );

      ctx.restore();
    }

    function dibujarCactus(
      x,
      h,
      ancho
    ) {
      const cactus =
        sprites.current
          .cactus;

      if (!cactus) {
        return;
      }

      ctx.save();

      ctx.globalAlpha =
        0.78;

      ctx.drawImage(
        cactus,
        x,
        SUELO - h,
        ancho,
        h
      );

      ctx.restore();
    }

    function dibujar() {
      const tema =
        obtenerTema();

      ctx.clearRect(
        0,
        0,
        ANCHO,
        ALTO
      );

      /*
       * IMPORTANTE:
       * El canvas NO pinta el fondo.
       *
       * Así no aparece ningún cuadrado.
       * Se deja ver directamente el fondo
       * que tengas en tu Hero.
       */

      dibujarSolOLuna(
        tema
      );

      dibujarEstrellas(
        tema
      );

      dibujarMontanas(
        tema
      );

      g.nubes.forEach(
        (nube) => {
          dibujarNube(
            nube.x,
            nube.y,
            nube.escala,
            tema.texto,
            tema.noche
              ? 0.12
              : 0.18
          );
        }
      );

      g.pajaros.forEach(
        (pajaro) => {
          dibujarPajaro(
            pajaro.x,
            pajaro.y,
            pajaro.escala,
            tema.texto
          );
        }
      );

      // Suelo
      ctx.save();

      ctx.fillStyle =
        tema.textoSuave;

      ctx.globalAlpha =
        0.32;

      ctx.fillRect(
        0,
        SUELO,
        ANCHO,
        2
      );

      ctx.restore();

      dibujarPasto(
        tema
      );

      dibujarPiedras(
        tema
      );

      g.obst.forEach(
        (o) => {
          dibujarCactus(
            o.x,
            o.h,
            o.ancho
          );
        }
      );

      dibujarDinosaurio(
        tema
      );

      // =========================
      // MARCADOR
      // =========================

      if (
        g.fase !== "idle"
      ) {
        ctx.save();

        ctx.fillStyle =
          tema.textoSuave;

        ctx.globalAlpha =
          0.7;

        ctx.font =
          "24px ui-monospace, Consolas, monospace";

        ctx.textAlign =
          "right";

        const mejor =
          g.mejor > 0
            ? `MEJOR ${g.mejor}   `
            : "";

        ctx.fillText(
          `${mejor}${puntos()}`,
          ANCHO - 40,
          42
        );

        ctx.restore();
      }

      // =========================
      // GAME OVER
      // =========================

      if (
        g.fase === "fin"
      ) {
        ctx.save();

        ctx.textAlign =
          "center";

        ctx.fillStyle =
          tema.texto;

        ctx.globalAlpha =
          0.8;

        ctx.font =
          "42px ui-monospace, Consolas, monospace";

        ctx.fillText(
          "CHOCASTE",
          ANCHO / 2,
          280
        );

        ctx.font =
          "20px ui-monospace, Consolas, monospace";

        ctx.fillText(
          "reintenta para volver a correr",
          ANCHO / 2,
          320
        );

        ctx.restore();
      }
    }

    function frame(t) {
      const dt =
        Math.min(
          (t - ultimo) / 1000,
          0.05
        );

      ultimo = t;

      actualizar(dt);
      dibujar();

      if (
        g.fase !== "fin"
      ) {
        raf =
          requestAnimationFrame(
            frame
          );
      } else {
        raf = 0;
      }
    }

    function sync() {
      const debeCorrer =
        (
          g.fase === "jugando"
        ) ||
        (
          g.fase === "idle" &&
          !reducir &&
          visible
        );

      if (
        debeCorrer &&
        !raf
      ) {
        ultimo =
          performance.now();

        raf =
          requestAnimationFrame(
            frame
          );
      }

      if (
        !debeCorrer &&
        raf
      ) {
        cancelAnimationFrame(
          raf
        );

        raf = 0;
      }

      if (!debeCorrer) {
        dibujar();
      }
    }

    function saltar() {
      if (
        g.fase === "jugando" &&
        g.alt === 0
      ) {
        g.vy = SALTO;
      }
    }

    function iniciar() {
      Object.assign(
        g,
        estadoInicial(
          g.mejor
        ),
        {
          fase: "jugando",
        }
      );

      setFase(
        "jugando"
      );

      sync();
    }

    function cerrar() {
      Object.assign(
        g,
        estadoInicial(
          g.mejor
        )
      );

      setFase("idle");

      sync();
    }

    function reintentar() {
      iniciar();
    }

    acciones.current = {
      iniciar,
      cerrar,
      reintentar,
      saltar,
    };

    function onTecla(e) {
      if (
        g.fase === "jugando" &&
        (
          e.code === "Space" ||
          e.code === "ArrowUp"
        )
      ) {
        e.preventDefault();
        saltar();
      }

      if (
        g.fase === "jugando" &&
        e.code === "ArrowDown"
      ) {
        e.preventDefault();
        agachado.current = true;
      }

      if (
        e.code === "Escape" &&
        g.fase !== "idle"
      ) {
        cerrar();
      }
    }
    function alSoltarTecla(e) {
      if (e.code === "ArrowDown") {
        agachado.current = false;
      }
    }
    function onPointer() {
      saltar();
    }

    window.addEventListener(
      "keydown",
      onTecla
    );
    window.addEventListener(
      "keyup",
      alSoltarTecla
    );
    canvas.addEventListener(
      "pointerdown",
      onPointer
    );

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          visible =
            entry.isIntersecting ||
            g.fase === "jugando";

          sync();
        },
        {
          threshold: 0.01,
        }
      );

    observer.observe(
      canvas
    );

    const mutation =
      new MutationObserver(
        () => {
          cargarSprites();
          dibujar();
        }
      );

    mutation.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: [
          "data-theme",
        ],
      }
      );

    cargarSprites();
    sync();

    return () => {
      cancelado = true;

      cancelAnimationFrame(
        raf
      );

      window.removeEventListener(
        "keydown",
        onTecla
      );

      window.removeEventListener(
        "keyup",
        alSoltarTecla
      );

      canvas.removeEventListener(
        "pointerdown",
        onPointer
      );

      observer.disconnect();
      mutation.disconnect();

      spriteUrls.current.forEach(
        (url) => {
          URL.revokeObjectURL(
            url
          );
        }
      );
    };
  }, []);

  useEffect(() => {
    const bloqueado =
      fase !== "idle";

    const anterior =
      document.body.style.overflow;

    if (bloqueado) {
      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.body.style.overflow =
        anterior;
    };
  }, [fase]);

  function alPulsar() {
    if (
      fase === "fin"
    ) {
      acciones.current.reintentar();
      return;
    }

    acciones.current.iniciar();
  }

  function cerrarJuego() {
    acciones.current.cerrar();
  }

  return (
    <div
      className={`dino ${fase !== "idle" ? "dino--pantalla" : ""}`}
    >
      {/* El canvas es puramente visual, sin información para lectores de pantalla */}
      <canvas
        ref={canvasRef}
        className="dino__lienzo"
        width={ANCHO}
        height={ALTO}
        aria-hidden="true"
      />

      {fase !== "idle" && (
        <button
          className="dino__cerrar"
          onClick={cerrarJuego}
          aria-label="Cerrar juego"
        >
          ← cerrar
        </button>
      )}

      <div className="dino__acciones">
        {fase === "idle" && (
          <button
            className="dino__btn"
            onClick={alPulsar}
            aria-label="Jugar al mini juego"
          >
            jugar
          </button>
        )}

        {fase === "fin" && (
          <button
            className="dino__btn"
            onClick={alPulsar}
          >
            reintentar
          </button>
        )}
      </div>

      {/* Aviso al girar el celular mientras se juega */}
      {fase !== "idle" && (
        <div className="dino__rotar" aria-live="polite">
          <span className="dino__rotar__icono" aria-hidden="true">📱</span>
          <p className="dino__rotar__texto">
            Gira el celular para jugar en vertical
          </p>
          <button className="dino__btn" onClick={cerrarJuego}>
            volver
          </button>
        </div>
      )}
    </div>
  );
}