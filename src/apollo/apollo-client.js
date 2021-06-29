import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";

import config from '../config'

const httpLink = new HttpLink({ uri: config.default_api_domain + "/graphql" });

const authMiddleware = () =>
  new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const authToken = config.token
    const domain = config.domain

    operation.setContext({
      headers: {
        Authorization: `Bearer ${authToken}`,
        'hypi-domain': `${domain}`
      },
    });
    return forward(operation);
  });

export const apolloClient = new ApolloClient({
  link: authMiddleware().concat(httpLink),
  cache: new InMemoryCache(),
});

