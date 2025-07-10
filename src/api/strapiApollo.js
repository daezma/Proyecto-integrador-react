import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const auth = localStorage.getItem("auth");
  const token = auth ? JSON.parse(auth).token : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const createCollectionPolicy = () => ({
  keyArgs: ["pagination"],
  merge(existing = [], incoming = []) {
    return Array.isArray(incoming) ? [...existing, ...incoming] : existing;
  },
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          productos: createCollectionPolicy(),
        },
      },
    },
  }),
});

export default apolloClient;
