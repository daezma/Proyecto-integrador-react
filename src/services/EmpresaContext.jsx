import { createContext, useContext, useEffect, useState } from "react";
import { getEmpresa } from "../api/strapi";

const EmpresaContext = createContext(null);

export const EmpresaProvider = ({ children }) => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmpresa()
      .then((data) => {
        //console.log("📦 Datos recibidos de empresa:", data); // 👈 LOG acá
        setEmpresa(data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar datos de empresa:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <EmpresaContext.Provider value={{ empresa, loading }}>
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error("useEmpresa debe usarse dentro de un EmpresaProvider");
  }
  return context;
};
