import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Hero from "./secciones/Hero/Hero";
import Proyectos from "./secciones/Proyectos/Proyectos";
import Contacto from "./secciones/Contacto/Contacto";
import Navbar from "./secciones/Navbar/Navbar";
import SobreMi from "./secciones/Sobremi/Sobremi";
import Servicios from "./secciones/Servicios/Servicios";
import "./App.css";

function ScrollAlTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PaginaInicio() {
  return (
    <>
      <Hero />
      <SobreMi />
      <Proyectos />
      <Contacto />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/Portafolio">
      <ScrollAlTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/servicios" element={<Servicios />} />
          {/* Cualquier ruta desconocida redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;