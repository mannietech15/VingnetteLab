import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ 
    uri: (import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql').endsWith('/graphql') 
      ? (import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql')
      : `${import.meta.env.VITE_GRAPHQL_URL}/graphql`
  }),
  cache: new InMemoryCache(),
});
