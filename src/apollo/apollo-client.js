import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: "https://api.hypi.app/graphql" });

const authMiddleware = () =>
  new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const authToken = 'eyJhbGciOiJSUzI1NiJ9.eyJoeXBpLmxvZ2luIjp0cnVlLCJoeXBpLnVzZXJuYW1lIjoiZW1hbi5jc2UyMDA4QGdtYWlsLmNvbSIsImh5cGkuZW1haWwiOiJlbWFuLmNzZTIwMDhAZ21haWwuY29tIiwiYXVkIjoiMDFGMkdaQkpLSDZSM1RDNkVKRFJFNU5IRzQiLCJpYXQiOjE2MjEzMzc5MzUsImV4cCI6MTYyMzkyOTkzNSwic3ViIjoiMDFGMkdaQkpLQUgxSkNDQlZaUzI0TVQ3VlIiLCJuYmYiOjE2MjEzMzc5MzV9.SrcdPxDD7YIB-S7BpBYE1tYeu08uSassvbT9ZFRffDXcYM6kda7J8EjX1YYxaXJplTtyF-4juqqkcIu_f4vrrrNVYURuPzyvhLnJj17WG2sO_vOLa0f-yMgXrA_LAxhr_OuSS6CJirzRSesP0oJ1txdVsnfMzlREPCj1dzQTHpa5n43lqcYzVx1pj59LOVQfR6WC1HRmqlbZ6VK-uCUt7lI3xKIne089wlqqUxUFDTEBWyv7ZH9JOeyf8eehQtQSIMQvQtjWf83Lz5a_1anRMfmB-S6aFVmt-qFiUmVLkKHRpIUAqbryEGnuqadZzQLb_IH4Kp7bKWgg7X1dtf4nqQ'
    const domain = 'teething.apps.hypi.app'

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

