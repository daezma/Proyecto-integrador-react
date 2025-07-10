const heroBannerStyles = {
  wrapper: {
    width: "100%",
    height: "70vh", // ✅ limitamos a 70% de la altura de la ventana
    position: "relative",
    textAlign: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // ✅ mantiene relación de aspecto, recorta si hace falta
    display: "block",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: "1rem",
  },
  title: {
    textShadow: "2px 2px 4px #000",
    mb: 2,
  },
};

export default heroBannerStyles;
