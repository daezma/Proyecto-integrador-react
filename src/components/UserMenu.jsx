import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogin = () => {
    navigate("/login");
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleMenu}>
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {!user ? (
          <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            Ingresar
          </MenuItem>
        ) : (
          [
            <MenuItem key="email" disabled>
              <Typography variant="body2">{user.email}</Typography>
            </MenuItem>,
            <MenuItem key="ordenes"
              onClick={() => {
                navigate("/ordenes");
                handleClose();
              }}
            >
              <ListItemIcon>
                <ShoppingCartIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Mis Órdenes</Typography>
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>,
          ]
        )}
      </Menu>
    </>
  );
}
