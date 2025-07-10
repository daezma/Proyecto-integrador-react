import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
  Fade,
  CircularProgress,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useCarrito } from "../services/CartContext";
import { eliminarItemDelCarrito } from "../api/carrito";
import carritoStyles from "../theme/carritoStyles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../services/AuthContext";
import { crearOrden } from "../api/orden";

export default function CarritoPage() {
  const {
    items,
    setItems,
    cantidadTotal,
    agregarItem,
    loading,
    cargarCarrito,
  } = useCarrito();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animando, setAnimando] = useState(false);
  const [esperandoCarga, setEsperandoCarga] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (user?.id) {
        await cargarCarrito(user.id);
      }

      // Actualiza automáticamente los precios si hay diferencias
      setItems((prev) =>
        prev.map((item) => {
          const precioActual = Number(item.precio_actualizado ?? 0);
          const precioGuardado = Number(item?.attributes?.precio ?? 0);
          if (
            !isNaN(precioActual) &&
            precioActual > 0 &&
            precioActual !== precioGuardado
          ) {
            return {
              ...item,
              attributes: {
                ...item.attributes,
                precio: precioActual,
              },
            };
          }
          return item;
        })
      );

      setEsperandoCarga(false);
    };
    cargar();
  }, [user]);

  useEffect(() => {
    if (!esperandoCarga && items.length === 0 && !animando) {
      setAnimando(true);
      setTimeout(() => {
        navigate("/catalogo");
      }, 500);
    }
  }, [items, animando, navigate, esperandoCarga]);

  const actualizarCantidad = (item, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    agregarItem({
      userId: item?.attributes?.user?.id,
      variacionId: item?.attributes?.variacion_de_producto?.documentId,
      sku: item?.attributes?.sku,
      precio: item?.attributes?.precio,
      cantidad: nuevaCantidad - Number(item?.attributes?.cantidad ?? 0),
      bonificacion: item?.attributes?.bonificacion || 0,
      descripcion: item?.attributes?.descripcion,
      url_imagen: item?.attributes?.url_imagen,
    });
  };

  const eliminarItem = async (id) => {
    try {
      await eliminarItemDelCarrito(id);
      setItems((prev) => prev.filter((i) => i.documentId !== id));
    } catch (error) {
      // console.error("❌ Error al eliminar el item del carrito:", error);
    }
  };

  const confirmarCompra = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Desea generar la orden de compra?",
      text: "Se procederá a confirmar todos los productos actuales.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const cliente = auth?.cliente;
      const id_cliente = cliente?.id_integracion ?? cliente?.num_doc;

      let total = items.reduce(
        (acc, item) =>
          acc +
          Number(item.attributes?.precio ?? 0) *
            Number(item.attributes?.cantidad ?? 0) *
            (1 - Number(item.attributes?.bonificacion ?? 0) / 100),
        0
      );
      total = isNaN(total) || total == null ? 0 : total;

      const itemsNormalizados = items.map((item) => ({
        cantidad: item.attributes.cantidad,
        sku: item.attributes.sku,
        precio: item.attributes.precio,
        bonificacion: item.attributes.bonificacion ?? 0,
        descripcion: item.attributes.descripcion,
        url_imagen: item?.attributes?.url_imagen,
        variaciones_de_producto:
          item.attributes.variacion_de_producto.documentId,
      }));

      const ordenData = {
        cliente: cliente?.documentId,
        fecha: new Date().toISOString(),
        user: auth?.user?.documentId,
        id_cliente,
        total,
        items: itemsNormalizados,
      };

      const response = await crearOrden(ordenData);
      const numeroOrden = response?.data?.id;

      for (const item of items) {
        await eliminarItemDelCarrito(item.documentId);
      }
      setItems([]);

      await Swal.fire({
        title: "¡Orden procesada!",
        text: `Tu compra ha sido confirmada exitosamente. Se creó la orden Nº ${numeroOrden}.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      navigate("/catalogo");
    } catch (error) {
      console.error("❌ Error al confirmar compra:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo procesar la orden. Intentalo nuevamente.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

  const total = items.reduce((acc, item) => {
    const precio = Number(item?.attributes?.precio ?? 0);
    const cantidad = Number(item?.attributes?.cantidad ?? 0);
    return acc + precio * cantidad;
  }, 0);

  if (esperandoCarga) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const vaciarCarrito = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los productos del carrito.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      for (const item of items) {
        await eliminarItemDelCarrito(item.documentId);
      }
      setItems([]);
      await Swal.fire({
        title: "Carrito vaciado",
        text: "Todos los productos fueron eliminados.",
        icon: "success",
      });
    } catch (error) {
      console.error("❌ Error al vaciar el carrito:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo vaciar el carrito. Intentalo nuevamente.",
        icon: "error",
      });
    }
  };

  return (
    <Fade in={!animando} timeout={500}>
      <Box sx={carritoStyles.root}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Productos en el carrito
                </Typography>
                <Divider sx={carritoStyles.separador} />
                {items.map((item) => (
                  <Box key={item.documentId} sx={carritoStyles.itemBox}>
                    {/* Imagen + info */}
                    <Box sx={carritoStyles.infoProducto}>
                      <Box
                        component="img"
                        src={
                          item.attributes?.url_imagen ||
                          "/assets/default-product.png"
                        }
                        alt={item.attributes?.descripcion}
                        sx={carritoStyles.imagenProducto}
                      />
                      <Box>
                        <Typography variant="subtitle1" noWrap>
                          {item.attributes?.descripcion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.attributes?.sku}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          Stock disponible:{" "}
                          {item.variacion_de_producto?.cantidad ?? "?"}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => eliminarItem(item.documentId)}
                            variant="text"
                            sx={carritoStyles.botonEliminar}
                          >
                            Eliminar
                          </Button>
                        </Box>
                      </Box>
                    </Box>

                    {/* Cantidad */}
                    <Box sx={carritoStyles.cantidadBox}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          actualizarCantidad(
                            item,
                            Number(item.attributes?.cantidad ?? 0) - 1
                          )
                        }
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography>{item.attributes?.cantidad}</Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          actualizarCantidad(
                            item,
                            Number(item.attributes?.cantidad ?? 0) + 1
                          )
                        }
                        disabled={
                          Number(item.attributes?.cantidad ?? 0) >=
                          Number(
                            item.variacion_de_producto?.cantidad ?? Infinity
                          )
                        }
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Precio */}
                    <Typography sx={carritoStyles.precioTexto}>
                      ${Number(item.attributes?.precio).toLocaleString("es-AR")}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen de compra
                </Typography>
                <Divider sx={carritoStyles.separador} />
                <Typography>
                  Productos ({cantidadTotal}): ${total.toLocaleString("es-AR")}
                </Typography>
                <Divider sx={carritoStyles.totalDivider} />
                <Typography variant="h6">
                  Total: ${total.toLocaleString("es-AR")}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={carritoStyles.botonComprar}
                  onClick={confirmarCompra}
                >
                  Confirmar compra
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={vaciarCarrito}
                >
                  Vaciar carrito
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
