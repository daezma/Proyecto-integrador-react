import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Collapse,
} from '@mui/material';
import loginStyles from "../theme/loginStyles";

export default function OlvidePassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [paso2, setPaso2] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [cambiando, setCambiando] = useState(false);

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const enviarEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      setMensaje('Te enviamos un código por correo electrónico.');
      setPaso2(true);
    } catch (err) {
      const msj = err.response?.data?.error?.message || 'Ocurrió un error inesperado.';
      setError(msj);
    } finally {
      setEnviando(false);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setCambiando(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        code,
        password,
        passwordConfirmation,
      });
      setMensaje('¡Contraseña actualizada correctamente! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const msj = err.response?.data?.error?.message || 'Error al cambiar la contraseña.';
      setError(msj);
    } finally {
      setCambiando(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6} px={2}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Recuperar contraseña
      </Typography>

      <Collapse in={!!mensaje}>
        <Alert severity="success" onClose={() => setMensaje('')} sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      </Collapse>

      <Collapse in={!!error}>
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>

      {!paso2 ? (
        <form onSubmit={enviarEmail}>
          <TextField
            label="Correo electrónico"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={loginStyles.submitButton} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar instrucciones'}
          </Button>
        </form>
      ) : (
        <form onSubmit={cambiarPassword}>
          <TextField
            label="Código recibido por email"
            variant="outlined"
            fullWidth
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Nueva contraseña"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Confirmar contraseña"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={loginStyles.submitButton} disabled={cambiando}>
            {cambiando ? 'Cambiando...' : 'Cambiar contraseña'}
          </Button>
        </form>
      )}
    </Box>
  );
}
