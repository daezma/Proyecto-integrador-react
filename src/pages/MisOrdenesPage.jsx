import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useOrdenesDelUsuario from "../hooks/useOrdenesDelUsuario";

export default function MisOrdenesPage() {
  const { ordenes, page, totalPages, setPage, loading } =
    useOrdenesDelUsuario(10);

  console.log("Órdenes desde API:", ordenes);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Mis Órdenes
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : ordenes.length === 0 ? (
        <Typography>No hay órdenes registradas.</Typography>
      ) : (
        <>
          {ordenes.map((orden) => {
            // Corrección para evitar desfase por timezone
            const [year, month, day] = orden.fecha.split("-");
            const fechaLocal = new Date(year, month - 1, day);

            return (
              <Accordion key={orden.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      alignItems: "center",
                      fontSize: "1rem",
                    }}
                  >
                    <Box component="span" fontWeight="bold">
                      Orden #{orden.id}
                    </Box>

                    <Box component="span" color="text.secondary">
                      | Fecha:{" "}
                      {fechaLocal.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Box>

                    <Box
                      component="span"
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        marginLeft: "auto",
                      }}
                    >
                      | Total: ${orden.total}
                    </Box>
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  {orden.items?.map((item, idx) => {
                    const producto =
                      item.variaciones_de_producto?.producto?.descripcion ||
                      "Producto";
                    const variacion =
                      item.variaciones_de_producto?.descripcion || "";

                    return (
                      <Box key={idx} mb={1}>
                        <Typography>
                          {producto}
                          {variacion ? ` – ${variacion}` : ""} x{item.cantidad} - ${item.precio}
                        </Typography>
                      </Box>
                    );
                  })}
                  <Divider sx={{ mt: 2 }} />
                </AccordionDetails>
              </Accordion>
            );
          })}

          {/* Controles de paginado */}
          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              variant="outlined"
            >
              Anterior
            </Button>
            <Typography>
              Página {page} de {totalPages}
            </Typography>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              variant="outlined"
            >
              Siguiente
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
