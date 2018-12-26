import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import Routes from './routes'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { TOKEN_KEY } from './constants'
import { Provider } from 'react-redux'
import store from './store'

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
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  </Provider>
)
