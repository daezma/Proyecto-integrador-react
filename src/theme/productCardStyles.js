const productCardStyles = {
  card: {
    width: 300,
    height: 420,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: 2,
    borderRadius: 2,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: 4,
    },
  },
  image: {
    objectFit: "contain",
    height: 180,
    width: "100%",
    p: 2,
    alignSelf: "center",
  },
  content: {
    flexGrow: 1,
    pt: 0,
    px: 2,
    pb: 2,
  },
  detailsBox: {
    fontSize: "0.85rem",
    lineHeight: 1.5,
  },
  divider: {
    my: 1,
  },
};

export default productCardStyles;
