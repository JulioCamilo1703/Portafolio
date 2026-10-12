import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Hero from "./secciones/Hero/Hero";
import Proyectos from "./secciones/Proyectos/Proyectos";
import Contacto from "./secciones/Contacto/Contacto";
import Navbar from "./secciones/Navbar/Navbar";
import SobreMi from "./secciones/Sobremi/Sobremi";
import Servicios from "./secciones/Servicios/Servicios";
import "./App.css";

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