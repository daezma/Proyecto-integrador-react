import { gql } from '@apollo/client';

export const GET_PRODUCTOS_C_PRECIOS = gql`
  query GetProductosPaginados($pagination: PaginationArg, $filters_productos: ProductoFiltersInput, $filters_lista_precios: PrecioFiltersInput) {
    productos(pagination: $pagination, filters: $filters_productos) {
      descripcion
      descripcion_larga
      documentId
      cod_barra
      presentacion
      admin_stock
      publishedAt
      updatedAt
      createdAt
      categoria {
        descripcion
        documentId
        id_integracion
      }
      marca {
        descripcion
        documentId
        id_integracion
      }
      modelo {
        descripcion
        documentId
        id_integracion
      }
      foto_principal {
        url
        alternativeText
        formats
      }
      precios(filters: $filters_lista_precios) {
        precio
        moneda
        listas_de_precio {
          documentId
        }
      }
    }
  }
`;
