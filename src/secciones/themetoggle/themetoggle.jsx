import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import "./ThemeToggle.css";

function temaInicial() {
  const guardado = localStorage.getItem("tema");
  if (guardado === "light" || guardado === "dark") return guardado;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export default function ThemeToggle() {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  const siguiente = tema === "dark" ? "light" : "dark";

  return (
    <button
      className="tema"
      onClick={() => setTema(siguiente)}
      aria-label={`Cambiar a modo ${siguiente === "light" ? "claro" : "oscuro"}`}
    >
      {/* muestra el icono del modo al que vas a cambiar */}
      {siguiente === "light" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}