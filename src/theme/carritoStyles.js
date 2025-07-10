const carritoStyles = {
  root: {
    p: 2,
  },
  separador: {
    mb: 2,
  },
  totalDivider: {
    my: 2,
  },
  itemBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    py: 1,
    mb: 2,
  },
  imagenProducto: {
    width: 64,
    height: 64,
    objectFit: "contain",
    borderRadius: 1,
  },
  infoProducto: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    flex: 1,
  },
  cantidadBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: 1,
    px: 1,
    py: 0.5,
    minWidth: 100,
    justifyContent: "center",
  },
  precioTexto: {
    fontWeight: "bold",
    minWidth: 100,
    textAlign: "right",
  },
  botonEliminar: {
    textTransform: "none",
    px: 0,
    minWidth: 0,
    fontWeight: 500,
  },
  controlesCantidad: {
    display: "flex",
    alignItems: "center",
  },
  botonComprar: {
    mt: 2,
  },
};

export default carritoStyles;
