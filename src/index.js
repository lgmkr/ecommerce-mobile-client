import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import Routes from './routes'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { TOKEN_KEY } from './constants'

const authLink = setContext( async (_, { headers }) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(createUploadLink({ uri: 'http://localhost:4000'})),
  cache: new InMemoryCache()
})

export default () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
)
