import Hero from "./secciones/Hero/Hero";
import Proyectos from "./secciones/Proyectos/Proyectos";
import Contacto from "./secciones/Contacto/Contacto";
import Navbar from "./secciones/Navbar/Navbar";
import SobreMi from "./secciones/Sobremi/Sobremi";
import './App.css'

function App() {  
  return (
    <>
    <Navbar />
    <main>
      <Hero />
      <SobreMi />
      <Proyectos />
      <Contacto />
    </main>
    </>
  );
}

export default App
