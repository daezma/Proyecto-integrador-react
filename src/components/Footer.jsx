import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  X,
  YouTube,
  Email,
  Phone,
} from "@mui/icons-material";
import footerStyles from "../theme/footerStyles";
import { useEmpresa } from "../services/EmpresaContext";

const Footer = () => {
  /**Datos de la empresa */
  const { empresa, loading } = useEmpresa();
  if (loading || !empresa) return null;
  const { slogan, descripcion, telefono, email, direccion, redes } = empresa;
  const logoUrl = empresa?.logo?.formats?.small?.url
    ? import.meta.env.VITE_MEDIA_URL + empresa.logo.formats.small.url
    : null;
  const redesIconos = {
    facebook: Facebook,
    instagram: Instagram,
    x: X,
    youtube: YouTube,
  };

  return (
    <Box component="footer">
      {/* Parte superior gris */}
      <Box sx={footerStyles.topSection}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {/* Izquierda */}
            <Grid size={{ xs: 12, md: 6 }}>
              {empresa.logo && (
                <img
                  src={logoUrl}
                  alt="Logo empresa"
                  style={{ maxWidth: "200px", marginBottom: "1rem" }}
                />
              )}
              <Typography variant="body2" sx={footerStyles.brandText}>
                {slogan}
              </Typography>

              <Box sx={footerStyles.socialIcons}>
                {empresa.redes?.map((r, i) => {
                  const Icon = redesIconos[r.red.toLowerCase()];
                  if (!Icon || !r.url) return null;

                  return (
                    <IconButton
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "white" }}
                      size="large"
                    >
                      <Icon fontSize="inherit" />
                    </IconButton>
                  );
                })}
              </Box>
            </Grid>

            {/* Derecha */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="body2" sx={footerStyles.addressLine}>
                {descripcion}
              </Typography>
              <Typography variant="body2" sx={footerStyles.addressLine}>
                {direccion.calle} {direccion.numero}, {direccion.localidad}
              </Typography>
              <Typography variant="body2" sx={footerStyles.brandText}>
                CP {direccion.cp} – {direccion.provincia}, {direccion.pais}
              </Typography>

              <Typography variant="body2" sx={footerStyles.contactInfo}>
                <Phone fontSize="small" /> {telefono}
              </Typography>
              <Typography variant="body2" sx={footerStyles.contactInfo}>
                <Email fontSize="small" /> {email}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Parte inferior negra */}
      <Box sx={footerStyles.bottomSection}>
        <Container maxWidth="lg">
          <Box sx={footerStyles.bottomBar}>
            <Typography variant="body2">
              © {new Date().getFullYear()} TGMax. Tgroup Sistemas S.A.S. Todos
              los derechos reservados.
            </Typography>
            <Typography variant="body2">
              Diseñado por{" "}
              <MuiLink href="#" color="inherit" underline="hover">
                S+D
              </MuiLink>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
