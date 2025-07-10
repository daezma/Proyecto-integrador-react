const catalogoStyles = {
  container: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    px: 2,
    pt: 2,
    gap: 2,
  },
  sidebar: {
    width: { xs: "100%", md: 220 },
    mb: { xs: 2, md: 0 },
  },
  grid: {
    flexGrow: 1,
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(1, 1fr)",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    gap: 2,
    justifyItems: "center",
  },
};

export default catalogoStyles;
