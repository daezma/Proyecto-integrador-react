import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import { AuthProvider } from "./services/AuthContext";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./api/strapiApollo.js";
import { EmpresaProvider } from "./services/EmpresaContext";
import { CartProvider } from "./services/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <EmpresaProvider>
          <CartProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <App />
            </ThemeProvider>
          </CartProvider>
        </EmpresaProvider>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);
