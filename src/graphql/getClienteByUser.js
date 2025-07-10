import { gql } from '@apollo/client';

export const GET_CLIENTE_BY_USER = gql`
  query GetClienteByUser($documentId: ID!) {
    usersPermissionsUser(documentId: $documentId) {
      cliente {
        descripcion
        id_integracion
        documentId
        num_doc
        listas_de_precio {
          descripcion
          documentId
        }
      }
    }
  }
`;

