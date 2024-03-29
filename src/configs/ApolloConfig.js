import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { keys } from "../constants";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({ uri: `${keys.SERVER_URI}/resource` }),
});

export const ApolloConfig = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
