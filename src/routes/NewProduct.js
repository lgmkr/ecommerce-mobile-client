import React from 'react'
import { View, TextInput, Button, Text, AsyncStorage, Image} from 'react-native'
import styled from 'styled-components/native'
import TextField from '../components/TextField'
import { TOKEN_KEY } from '../constants'
import { ImagePicker, Permissions } from 'expo'
import { productsQuery } from './Products'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { ReactNativeFile } from 'apollo-upload-client'

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

class Login extends React.Component {
  state = defaultState

  componentDidMount = async () => {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // proceed camera/roll premissions management
    console.log('camera: ', camera);
    console.log('roll: ', cameraRoll);
  }

  submit = async () => {
    const { pictureUrl: uri, name, price } = this.state
    const picture = new ReactNativeFile({ uri, type: 'image/png', name: 'picture-name'})

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
      console.log('err : ', err)
    }

    this.props.history.push('/products');
  }

  onChangeText = (key, value) => {
    this.setState(state => ({
      ...state,
      [key]: value
    }))
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ pictureUrl: result.uri });
    }
  };

  render() {
    const { name , pictureUrl: uri, price} = this.state
    return (
      <NewProductView>
        <NewProductInputView>
          <TextField
            onChangeText={this.onChangeText}
            value={name}
            name='name'
          />

          <TextField
            onChangeText={this.onChangeText}
            value={price}
            name='price'
          />
          <Button title="Pick an image from camera roll" onPress={this.pickImage} />
          {uri ? (<Image  source={{ uri }} style={{width: 200, height: 200}} />) : <Text>No image uploaded</Text>}
          <Button title="Create" onPress={this.submit}/>
        </NewProductInputView>
      </NewProductView>
    )
  }
}

const createProductMutation = gql`
   mutation($name: String!, $price: Float!, $picture: Upload!) {
     createProduct(name: $name, price: $price, picture: $picture) {
      id
      name
      price
      pictureUrl
      __typename
     }
   }
 `;

export default graphql(createProductMutation)(Login)
