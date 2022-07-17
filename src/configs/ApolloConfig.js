import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

export const client = new ApolloClient({
  // uri: "https://0004-123-16-146-8.ap.ngrok.io/resource",
  cache: new InMemoryCache(),
  link: createUploadLink({ uri: "https://0004-123-16-146-8.ap.ngrok.io/resource" }),
});

export const ApolloConfig = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
