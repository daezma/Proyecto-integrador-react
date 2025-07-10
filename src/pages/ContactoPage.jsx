import {
  Box,
  Container,
  Typography,
  IconButton,
  Grid,
  Link as MuiLink,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  X,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { useEmpresa } from "../services/EmpresaContext";

const redesIconos = {
  facebook: Facebook,
  instagram: Instagram,
  x: X,
  youtube: YouTube,
};

export default function ContactoPage() {
  const { empresa, loading } = useEmpresa();
  if (loading || !empresa) return null;

  const { telefono, email, direccion, redes } = empresa;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Contacto
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
            <Phone sx={{ mr: 1 }} />
            {telefono}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
            <Email sx={{ mr: 1 }} />
            {email}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
            <LocationOn sx={{ mr: 1 }} />
            {direccion.calle} {direccion.numero}, {direccion.localidad}, CP {direccion.cp}, {direccion.provincia}, {direccion.pais}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Nuestras redes
      </Typography>

      <Box>
        {redes?.map((r, i) => {
          const Icon = redesIconos[r.red.toLowerCase()];
          if (!Icon || !r.url) return null;
          return (
            <IconButton
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#000" }}
            >
              <Icon />
            </IconButton>
          );
        })}
      </Box>
    </Container>
  );
}
