import { useState, useEffect } from "react";

/**
 * Hook minimalista de routing basado en hash.
 * Usa el hash para distinguir páginas, p.ej.: #/servicios
 * De esta forma funciona sin react-router y sin configuración
 * extra en GitHub Pages (todo sigue siendo una SPA en index.html).
 */
export function usePage() {
  const getPage = () => {
    const hash = window.location.hash;
    if (hash.startsWith("/servicios")) return "servicios";
    return "inicio";
  };

  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const handler = () => setPage(getPage());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return page;
}