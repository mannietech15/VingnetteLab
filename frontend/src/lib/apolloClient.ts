import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ 
    uri: (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql').endsWith('/graphql') 
      ? (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql')
      : `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/graphql`
  }),
  cache: new InMemoryCache(),
});
