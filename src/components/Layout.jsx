import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      {/* Espacio principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(isHome ? {} : { py: 4 }),
        }}
      >
        {isHome ? children : <Container maxWidth="lg">{children}</Container>}
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;
