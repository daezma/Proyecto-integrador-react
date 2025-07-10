import { useState, useEffect } from "react";
import { getOrdenesDelUsuario } from "../api/orden";
import { useAuth } from "../services/AuthContext";

export default function useOrdenesDelUsuario(pageSize = 10) {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const cargarOrdenes = async (pagina = page) => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await getOrdenesDelUsuario({
        userId: user.id,
        page: pagina,
        pageSize,
      });

      //console.log("📦 Órdenes recibidas:", res);

      setOrdenes(res.data || []);
      setTotalPages(res.meta?.pagination?.pageCount || 1);
      setPage(pagina);
    } catch (error) {
      //console.error("❌ Error en useOrdenesDelUsuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes(1);
  }, [user]);

  return {
    ordenes,
    page,
    totalPages,
    setPage: cargarOrdenes,
    loading,
  };
}
