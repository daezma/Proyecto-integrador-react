import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const SidebarFilters = ({
  categoriaSeleccionada,
  setCategoriaSeleccionada,
}) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/categorias?populate=*`
        );
        const todas = res.data.data;

        const construirArbol = (items, padreId = null) => {
          return items
            .filter((cat) => (cat.categoria?.documentId || null) === padreId)
            .map((cat) => {
              const hijos = construirArbol(items, cat.documentId).filter(
                (sub) => sub.documentId !== cat.documentId
              );
              return {
                documentId: cat.documentId,
                descripcion: cat.descripcion || `Categoría ${cat.documentId}`,
                subcategorias: hijos.sort((a, b) =>
                  a.descripcion.localeCompare(b.descripcion)
                ),
              };
            })
            .sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        };

        const arbol = construirArbol(todas);
        setCategorias(arbol);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const renderCategorias = (categorias) => {
    return categorias.map((cat) =>
      cat.subcategorias.length > 0 ? (
        <Accordion key={cat.documentId} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">{cat.descripcion}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List disablePadding>{renderCategorias(cat.subcategorias)}</List>
          </AccordionDetails>
        </Accordion>
      ) : (
        <ListItemButton
          key={cat.documentId}
          selected={categoriaSeleccionada === cat.documentId}
          onClick={() => setCategoriaSeleccionada(cat.documentId)}
        >
          <Typography variant="body2">{cat.descripcion}</Typography>
        </ListItemButton>
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      {categoriaSeleccionada && (
        <Button
          variant="outlined"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          onClick={() => setCategoriaSeleccionada(null)}
        >
          Limpiar filtros
        </Button>
      )}
      {renderCategorias(categorias)}
    </Box>
  );
};

export default SidebarFilters;
