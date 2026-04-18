import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/graphql`
  : "https://taskmanager-backend-quuh.onrender.com/graphql";

const link = new HttpLink({
  uri: API_URL,
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});