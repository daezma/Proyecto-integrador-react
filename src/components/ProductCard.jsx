import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import productCardStyles from "../theme/productCardStyles";

const ProductCard = ({ product }) => {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
  const isLoggedIn = !!token;

  return (
    <Card sx={productCardStyles.card}>
      <Link to={`/producto/${product.documentId}`}>
        <CardMedia
          component="img"
          image={
            product.foto_principal?.formats?.small?.url
              ? `${import.meta.env.VITE_MEDIA_URL}${product.foto_principal.formats.small.url}`
              : "/assets/default-product.png"
          }
          alt={product.descripcion}
          sx={productCardStyles.image}
        />
      </Link>

      <CardContent sx={productCardStyles.content}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {product.descripcion}
        </Typography>

        <Divider sx={productCardStyles.divider} />

        <Box sx={productCardStyles.detailsBox}>
          {product.categoria && (
            <Typography variant="body2">
              <strong>Categoría:</strong> {product.categoria?.descripcion}
            </Typography>
          )}
          {product.marca && (
            <Typography variant="body2">
              <strong>Marca:</strong> {product.marca.descripcion}
            </Typography>
          )}
          {product.modelo && (
            <Typography variant="body2">
              <strong>Modelo:</strong> {product.modelo.descripcion}
            </Typography>
          )}
          {product.presentacion && (
            <Typography variant="body2">
              <strong>Presentación:</strong> {product.presentacion}
            </Typography>
          )}
          {product.precio != null && (
            <Typography variant="body2">
              <strong>Precio:</strong> {product.precio}
            </Typography>
          )}
        </Box>

        {/* 🔴 Mensaje si no hay precio y el usuario está logueado */}
        {isLoggedIn && product.precio == null && (
          <Typography variant="body2" color="error" mt={2}>
            Este producto no tiene precio asignado. Por favor, consulte.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
