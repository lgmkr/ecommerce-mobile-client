import React from 'react'
import { View, TextInput, Button, Text, AsyncStorage, Image} from 'react-native'
import styled from 'styled-components/native'
import TextField from '../components/TextField'
import { TOKEN_KEY } from '../constants'
import { ImagePicker, Permissions } from 'expo'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { ReactNativeFile } from 'apollo-upload-client'
import { productsQuery } from './Products';
import Form from '../components/Form';

const NewProductView = styled.View`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const OrText = styled.Text`
  text-align: center;
`

const ErrorField = styled.Text`
  color: #FF0F0F;
`

const NewProductInputView = styled.View`
  width: 200px;
`

const defaultState = {
  name: '',
  pictureUrl: '',
  price: ''
}

class NewProduct extends React.Component {
  submit = async (values) => {
    const { pictureUrl, name, price } = values;
    const picture = new ReactNativeFile({
      uri: pictureUrl,
      type: 'image/png',
      name: 'i-am-a-name',
    });

    try {
      await this.props.mutate({
        variables: {
          name,
          price: parseFloat(price),
          picture,
        },
        update: (store, { data: { createProduct } }) => {
          const data = store.readQuery({ query: productsQuery });
          data.products.push(createProduct);
          store.writeQuery({ query: productsQuery, data });
        },
      });
    } catch (err) {
      console.log('err happened');
      console.log(err);
      return;
    }

    this.props.history.push('/products');
  };

  render() {
    return <Form submit={this.submit} />;
  }
}

const createProductMutation = gql`
  mutation($name: String!, $price: Float!, $picture: Upload!) {
    createProduct(name: $name, price: $price, picture: $picture) {
      __typename
      id
      name
      price
      pictureUrl
      # seller {
      #   id
      # }
    }
  }
`;

export default graphql(createProductMutation)(NewProduct);
