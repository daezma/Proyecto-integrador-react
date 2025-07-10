import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductosConPrecios } from "../api/strapi";

export default function useProductos({ pageSize, categoriaSeleccionada }) {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resetInProgress, setResetInProgress] = useState(false);
  const [searchParams] = useSearchParams();

  const observer = useRef();
  const isFetching = useRef(false);
  const prevCatRef = useRef(null);
  const prevTermRef = useRef("");

  const fetchProductos = async (pageToFetch, term) => {
    if (isFetching.current) return;

    setLoading(true);
    isFetching.current = true;

    try {
      const res = await getProductosConPrecios(
        pageToFetch,
        pageSize,
        categoriaSeleccionada,
        term
      );
      const nuevos = res.data || [];

      if (term) localStorage.removeItem("busquedaCatalogo");
      if (nuevos.length < pageSize) setHasMore(false);

      setProductos((prev) => [
        ...prev,
        ...nuevos.filter(
          (nuevo) => !prev.some((p) => p.documentId === nuevo.documentId)
        ),
      ]);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    if (page === 1) return; // primera carga ya la hace reset
    fetchProductos(page, terminoBusqueda);
  }, [page]);

  const resetProductos = () => {
    if (resetInProgress) return;

    setResetInProgress(true);

    const term = searchParams.get("search") || "";
    setTerminoBusqueda(term);
    setProductos([]);
    setPage(1);
    setHasMore(true);

    fetchProductos(1, term).finally(() => {
      setResetInProgress(false);
    });
  };

  useEffect(() => {
    const term = searchParams.get("search") || "";
    if (
      prevCatRef.current === categoriaSeleccionada &&
      prevTermRef.current === term
    ) {
      return;
    }

    prevCatRef.current = categoriaSeleccionada;
    prevTermRef.current = term;

    resetProductos();
  }, [categoriaSeleccionada, searchParams]);

  return {
    productos,
    loading,
    hasMore,
    resetProductos,
  };
}
