import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../services/AuthContext";
import { useSearchParams } from "react-router-dom";
import useProductos from "../hooks/useProductos";
import SidebarFilters from "../components/SidebarFilters";
import ProductCard from "../components/ProductCard";
import catalogoStyles from "../theme/catalogoStyles";

const Catalogo = () => {
  const { isAuthLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const busqueda = searchParams.get("search") || "";
  const pageSize = 15;
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [page, setPage] = useState(1);

  const {
    productos,
    loading,
    hasMore,
    resetProductos,
  } = useProductos({ pageSize, categoriaSeleccionada, busqueda, page });

  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => prev + 1);
          }
        },
        { rootMargin: "100px" }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    resetProductos();
    setPage(1); // reset de la paginación también
  }, [categoriaSeleccionada, busqueda]);

  if (isAuthLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={catalogoStyles.container}>
      <Box sx={catalogoStyles.sidebar}>
        <SidebarFilters
          categoriaSeleccionada={categoriaSeleccionada}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
        />
      </Box>

      <Box sx={catalogoStyles.grid}>
        {productos.map((product, index) => (
          <Box
            key={product.documentId}
            sx={{ display: "flex", justifyContent: "center" }}
            ref={index === productos.length - 1 ? lastProductRef : null}
          >
            <ProductCard product={product} />
          </Box>
        ))}

        {loading && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 4,
              gridColumn: "1 / -1",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}

        {!loading && productos.length === 0 && (
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              mt: 4,
              color: "text.secondary",
              fontStyle: "italic",
              gridColumn: "1 / -1",
            }}
          >
            No hay productos disponibles 😥
          </Box>
        )}

        {!hasMore && productos.length > 0 && (
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              mt: 4,
              color: "text.secondary",
              fontStyle: "italic",
              gridColumn: "1 / -1",
            }}
          >
            Ya viste todos los productos disponibles 😎
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Catalogo;
