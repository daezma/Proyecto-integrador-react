import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { loginUser } from "../api/strapi";
import { useAuth } from "../services/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import loginStyles from "../theme/loginStyles";
import apolloClient from "../api/strapiApollo";
import { GET_CLIENTE_BY_USER } from "../graphql/getClienteByUser";
import OlvidePassword from '../components/OlvidePassword';
import { useCarrito } from "../services/CartContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { cargarCarrito } = useCarrito();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(identifier, password); // LOGIN
      const token = data.jwt;
      const user = data.user;

      // Guardar token temporalmente para consulta
      localStorage.setItem("auth", JSON.stringify({ token }));

      // Ahora que tenemos el token, consultamos el cliente con Apollo
      const result = await apolloClient.query({
        query: GET_CLIENTE_BY_USER,
        variables: {
          documentId: user.documentId,
        },
      });

      const cliente = result.data.usersPermissionsUser?.cliente;

      // Guardamos todo completo
      login(token, user, cliente);
      await cargarCarrito(user.id);
      navigate("/catalogo");
    } catch (err) {
      console.error("Login error:", err);
      setError("Usuario o contraseña incorrectos");
      localStorage.removeItem("auth"); // limpieza
    }
  };

  return (
    <Box sx={loginStyles.wrapper}>
      <Paper elevation={3} sx={loginStyles.paper}>
        <Typography variant="h5" sx={loginStyles.title}>
          Ingresá tus datos
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            type="email"
            margin="normal"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
            }
            label="Recordarme"
          />
          {error && (
            <Typography variant="body2" sx={loginStyles.errorText}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={loginStyles.submitButton}
          >
            Iniciar Sesión
          </Button>
          <Box sx={loginStyles.forgotPassword}>
            <Link
              component={RouterLink}
              to="/olvide-password"
              underline="hover"
              variant="body2"
            >
              Olvidé mi contraseña
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
