import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DetalleProducto from "./components/DetalleProducto";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import OlvidePassword from "./components/OlvidePassword";
import CarritoPage from "./pages/CarritoPage";
import MisOrdenesPage from "./pages/MisOrdenesPage";
import ContactoPage from "./pages/ContactoPage";
import { useEmpresa } from "./services/EmpresaContext";

function App() {
  const { empresa } = useEmpresa();

  useEffect(() => {
    if (empresa?.descripcion) {
      document.title = `${empresa.descripcion}`;
    } else {
      document.title = "Cargando...";
    }
  }, [empresa?.descripcion]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/catalogo" element={<Layout><Catalogo /></Layout>} />
        <Route path="/producto/:productoId" element={<Layout><DetalleProducto /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/olvide-password" element={<Layout><OlvidePassword /></Layout>} />
        <Route path="/carrito" element={<Layout><CarritoPage /></Layout>} />
        <Route path="/ordenes" element={<Layout><MisOrdenesPage /></Layout>} />
        <Route path="/contacto" element={<Layout><ContactoPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
