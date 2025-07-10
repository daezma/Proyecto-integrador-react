import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import heroBannerStyles from "../theme/heroBannerStyles";
import { useEmpresa } from "../services/EmpresaContext";

const HeroBanner = () => {
  const { empresa, loading } = useEmpresa();
  if (loading || !empresa) return null;
  const portada = empresa?.portada?.url
    ? import.meta.env.VITE_MEDIA_URL + empresa.portada.url
    : null;
  const {slogan} = empresa;
  return (
    <Box sx={heroBannerStyles.wrapper}>
      <img
        src={portada}
        alt="Banner"
        style={heroBannerStyles.image}
      />
      <Box sx={heroBannerStyles.overlay}>
        <Box>
          <Typography variant="h3" sx={heroBannerStyles.title}>
            {slogan}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/catalogo"
          >
            Ver catálogo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroBanner;