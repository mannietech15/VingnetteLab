import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client';

const httpLink = new HttpLink({ 
  uri: (import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql').endsWith('/graphql') 
    ? (import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql')
    : `${import.meta.env.VITE_GRAPHQL_URL}/graphql`
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    }
  });
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});
