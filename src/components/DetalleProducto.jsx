import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductoConPrecioById } from "../api/strapi";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  Box,
  MenuItem,
  Dialog,
  Snackbar,
  Alert,
} from "@mui/material";
import detalleProductoStyles from "../theme/detalleProductoStyles";
import { useCarrito } from "../services/CartContext";

const getMediaUrl = (url) => {
  if (!url) return "/assets/default-product.png";
  return url.startsWith("http") || url.startsWith("/assets")
    ? url
    : `${import.meta.env.VITE_MEDIA_URL}${url}`;
};

const DetalleProducto = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [variacionSeleccionada, setVariacionSeleccionada] = useState(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [snackbarAbierto, setSnackbarAbierto] = useState(false);
  const [galeria, setGaleria] = useState([]);
  const [mediaSeleccionada, setMediaSeleccionada] = useState(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(true);

  const { agregarItem } = useCarrito();
  const auth = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    if (auth) setUsuarioLogueado(true);
  }, []);

  useEffect(() => {
    getProductoConPrecioById(productoId)
      .then((data) => {
        setProducto(data);
        if (data.variaciones?.length > 0) {
          setVariacionSeleccionada(data.variaciones[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [productoId]);

  useEffect(() => {
    if (!producto) return;

    let imagenes = [];

    const fotosVariacion = Array.isArray(variacionSeleccionada?.foto)
      ? variacionSeleccionada.foto
      : [];

    if (fotosVariacion.length > 0) {
      fotosVariacion.forEach((foto) => {
        imagenes.push({
          tipo: "imagen",
          url:
            foto.formats?.medium?.url ||
            foto.formats?.thumbnail?.url ||
            foto.url,
        });
      });
    } else if (producto.foto_principal) {
      imagenes.push({
        tipo: "imagen",
        url:
          producto.foto_principal.formats?.medium?.url ||
          producto.foto_principal.formats?.thumbnail?.url ||
          null,
      });
    }

    if (producto.url_video) {
      const url = producto.url_video.includes("watch?v=")
        ? producto.url_video.replace("watch?v=", "embed/")
        : producto.url_video;
      imagenes.push({ tipo: "video", url });
    }

    if (imagenes.length === 0) {
      imagenes.push({ tipo: "imagen", url: "/assets/default-product.png" });
      setMostrarDialogo(false);
    } else {
      setMostrarDialogo(true);
    }

    setGaleria(imagenes);
    setMediaSeleccionada(imagenes[0]);
  }, [variacionSeleccionada, producto]);

  const agregarAlCarrito = async () => {
    if (!variacionSeleccionada) {
      alert("Por favor seleccioná una variación.");
      return;
    }

    if (!auth?.user?.id) {
      alert("Debés iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      await agregarItem({
        userId: auth.user.id,
        variacionId: variacionSeleccionada.documentId,
        sku: variacionSeleccionada.sku,
        precio: variacionSeleccionada.precio,
        cantidad,
        bonificacion: 0,
        descripcion:
          (producto.descripcion || "") +
          " " +
          (variacionSeleccionada.descripcion || ""),
        url_imagen: getMediaUrl(
          variacionSeleccionada?.foto?.[0]?.formats?.thumbnail?.url ||
            producto?.foto_principal?.formats?.thumbnail?.url ||
            ""
        ),
      });

      setSnackbarAbierto(true);
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      alert("Ocurrió un error al agregar al carrito.");
    }
  };

  if (!producto || !mediaSeleccionada) return <Typography>Cargando...</Typography>;

  const { descripcion, sku, descripcion_larga } = producto;

  return (
    <Box sx={detalleProductoStyles.container}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {galeria.map((item, index) => (
                <Box
                  key={index}
                  component="button"
                  onClick={() => {
                    setMediaSeleccionada(item);
                    if (item.tipo === "imagen" && mostrarDialogo) {
                      setDialogoAbierto(false);
                    }
                  }}
                  style={{
                    border:
                      item.url === mediaSeleccionada?.url &&
                      item.tipo === mediaSeleccionada?.tipo
                        ? "2px solid red"
                        : "1px solid #ccc",
                    background: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  {item.tipo === "imagen" ? (
                    <img
                      src={getMediaUrl(item.url)}
                      alt="Miniatura"
                      width={60}
                      height={60}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src="/assets/icono-video.png"
                      alt="Video"
                      width={60}
                      height={60}
                    />
                  )}
                </Box>
              ))}
            </Box>

            <Card sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {mediaSeleccionada?.tipo === "imagen" ? (
                  <Box
                    component="img"
                    src={getMediaUrl(mediaSeleccionada.url)}
                    alt={producto.descripcion}
                    onClick={() =>
                      mostrarDialogo ? setDialogoAbierto(true) : null
                    }
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      cursor: mostrarDialogo ? "pointer" : "default",
                    }}
                  />
                ) : (
                  <iframe
                    src={mediaSeleccionada.url}
                    title="Video del producto"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                    allowFullScreen
                  />
                )}
              </Box>
            </Card>
          </Box>

          {descripcion_larga && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Descripción del producto</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {descripcion_larga}
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4">{descripcion}</Typography>

          {usuarioLogueado && variacionSeleccionada?.precio != null && (
            <Typography variant="h6" sx={detalleProductoStyles.precio}>
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              }).format(variacionSeleccionada.precio || 0)}
            </Typography>
          )}

          <Typography sx={detalleProductoStyles.descripcion}>
            {variacionSeleccionada?.sku || sku}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Elegí una variación:</Typography>
            <TextField
              select
              label="Variación"
              value={variacionSeleccionada?.sku || ""}
              onChange={(e) => {
                const sku = e.target.value;
                const seleccionada = producto.variaciones.find(
                  (v) => v.sku === sku
                );
                setVariacionSeleccionada(seleccionada);
                setCantidad(1);
              }}
              fullWidth
              sx={{ mt: 1, mb: 2 }}
            >
              {producto.variaciones.map((v) => (
                <MenuItem key={v.sku} value={v.sku}>
                  {v.descripcion}
                  {usuarioLogueado && ` (${v.cantidad} disponibles)`}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {usuarioLogueado && (
            <>
              <Box sx={detalleProductoStyles.acciones}>
                <TextField
                  type="number"
                  label="Cantidad"
                  value={cantidad}
                  onChange={(e) => {
                    const valor = Number(e.target.value);
                    const stockMaximo =
                      variacionSeleccionada?.cantidad || Infinity;

                    if (valor < 1) {
                      setCantidad(1);
                    } else if (valor > stockMaximo) {
                      setCantidad(stockMaximo);
                    } else {
                      setCantidad(valor);
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: variacionSeleccionada?.cantidad || undefined,
                  }}
                  size="small"
                  disabled={
                    variacionSeleccionada?.cantidad < 1 ||
                    variacionSeleccionada?.precio == null
                  }
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={agregarAlCarrito}
                  sx={{ ml: 2 }}
                  disabled={
                    variacionSeleccionada?.cantidad < 1 ||
                    variacionSeleccionada?.precio == null
                  }
                >
                  Agregar al carrito
                </Button>
              </Box>

              {usuarioLogueado && variacionSeleccionada?.precio == null && (
                <Typography sx={{ mt: 2, color: "error.main" }}>
                  Este producto no tiene precio asignado. Por favor, consulte.
                </Typography>
              )}

              {variacionSeleccionada?.cantidad > 0 && (
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Stock disponible: {variacionSeleccionada.cantidad}
                </Typography>
              )}

              {variacionSeleccionada?.cantidad === 0 && (
                <Typography sx={{ mt: 1, color: "error.main" }}>
                  No hay stock disponible para esta variación.
                </Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={dialogoAbierto}
        onClose={() => setDialogoAbierto(false)}
        maxWidth="lg"
      >
        {mediaSeleccionada?.tipo === "imagen" && (
          <Box
            component="img"
            src={getMediaUrl(mediaSeleccionada.url)}
            alt="Vista ampliada"
            sx={{ width: "100%", maxWidth: "900px", objectFit: "contain" }}
          />
        )}
      </Dialog>

      <Snackbar
        open={snackbarAbierto}
        autoHideDuration={3000}
        onClose={() => setSnackbarAbierto(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarAbierto(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Producto agregado al carrito
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetalleProducto;
