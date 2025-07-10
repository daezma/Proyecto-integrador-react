import { useQuery } from '@apollo/client';
import { GET_ME } from '../graphql/getMe';
import { GET_CLIENTE_BY_USER } from '../graphql/getClienteByUser';

const useCliente = () => {
  const { data: meData, loading: meLoading, error: meError } = useQuery(GET_ME);

  const userId = meData?.me?.documentId;
  console.log(userId);

  const {
    data: clienteData,
    loading: clienteLoading,
    error: clienteError,
  } = useQuery(GET_CLIENTE_BY_USER, {
    variables: { documentId: userId },
    skip: !userId, // espera a tener el ID
  });

  return {
    cliente: clienteData?.usersPermissionsUser?.cliente,
    loading: meLoading || clienteLoading,
    error: meError || clienteError,
  };
};

export default useCliente;
