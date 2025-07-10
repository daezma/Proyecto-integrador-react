import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import UserMenu from "./UserMenu";
import { useAuth } from "../services/AuthContext";
import headerStyles, {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../theme/headerStyles";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEmpresa } from "../services/EmpresaContext";
import { useCarrito } from "../services/CartContext";
import Swal from "sweetalert2";

const Header = ({ setHayBusqueda }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaExpandida, setBusquedaExpandida] = useState(false);
  const [animarCarrito, setAnimarCarrito] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { user } = useAuth();
  const { empresa, loading } = useEmpresa();
  const { cargarCarrito, cantidadTotal } = useCarrito();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleBuscar = () => {
    if (busqueda.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(busqueda.trim())}`);
      setBusqueda("");
      setBusquedaExpandida(false);
      if (typeof setHayBusqueda === "function") {
        setHayBusqueda(true);
      }
    }
  };

  const handleCarritoClick = () => {
    if (cantidadTotal > 0) {
      navigate("/carrito");
    } else {
      Swal.fire({
        icon: "info",
        title: "Tu carrito está vacío",
        text: "Agregá algunos productos antes de continuar.",
        showCancelButton: true,
        confirmButtonText: "Ir al catálogo",
        cancelButtonText: "Cerrar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/catalogo");
        }
      });
    }
  };

  useEffect(() => {
    if (cantidadTotal > 0) {
      setAnimarCarrito(true);
      const timeout = setTimeout(() => setAnimarCarrito(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [cantidadTotal]);

  useEffect(() => {
    if (user?.id) {
      cargarCarrito(user.id);
    }
  }, [user]);

  if (loading || !empresa) return null;

  const logoUrl = empresa?.logo?.formats?.small?.url
    ? import.meta.env.VITE_MEDIA_URL + empresa.logo.formats.small.url
    : null;

  const menuItems = [
    { text: "Inicio", path: "/" },
    { text: "Productos", path: "/catalogo" },
    ...(user ? [{ text: "Órdenes", path: "/ordenes" }] : []),
    { text: "Contacto", path: "/contacto" },
  ];

  const renderSearch = (width) => (
    <Search sx={{ width, display: "flex", alignItems: "center" }}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        autoFocus
        placeholder="Buscar…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        inputProps={{
          "aria-label": "buscar",
          onKeyDown: (e) => {
            if (e.key === "Enter") handleBuscar();
          },
        }}
        onBlur={isMobile ? () => setBusquedaExpandida(false) : undefined}
      />
      <IconButton size="small" onClick={handleBuscar} sx={{ ml: 1 }}>
        <ArrowForwardIcon fontSize="small" />
      </IconButton>
    </Search>
  );

  const drawer = (
    <Box sx={headerStyles.drawerBox} onClick={toggleDrawer(false)}>
      <Box sx={{ px: 2, py: 1 }}>{renderSearch(200)}</Box>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          px: 2,
          gap: 1,
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Link to="/">
            <img
              src={logoUrl}
              alt="Logo empresa"
              style={{ height: isMobile ? "32px" : "50px", margin: "8px 0" }}
            />
          </Link>
        </Box>

        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexGrow: 1,
              flexShrink: 1,
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            {menuItems.map((item) => (
              <Button key={item.text} color="inherit" component={Link} to={item.path}>
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          {isMobile ? (
            busquedaExpandida ? (
              renderSearch(160)
            ) : (
              <IconButton color="inherit" onClick={() => setBusquedaExpandida(true)}>
                <SearchIcon />
              </IconButton>
            )
          ) : (
            renderSearch(200)
          )}

          {user && (
            <Box sx={{ position: "relative" }}>
              <IconButton
                color="inherit"
                onClick={handleCarritoClick}
                sx={{
                  animation: animarCarrito ? `${headerStyles.bounce} 0.5s ease` : "none",
                }}
              >
                <ShoppingCartIcon />
              </IconButton>
              {cantidadTotal > 0 && (
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    bgcolor: "error.main",
                    color: "#fff",
                    borderRadius: "50%",
                    minWidth: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                    px: 0.5,
                    animation: animarCarrito ? `${headerStyles.pulse} 0.5s ease` : "none",
                  }}
                >
                  {cantidadTotal}
                </Box>
              )}
            </Box>
          )}

          <UserMenu />

          {isMobile && (
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
