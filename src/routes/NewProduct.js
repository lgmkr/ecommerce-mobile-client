import React from 'react'
import { View, TextInput, Button, Text, AsyncStorage, Image} from 'react-native'
import styled from 'styled-components/native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import TextField from '../components/TextField'
import { TOKEN_KEY } from '../constants'
import { ImagePicker, Permissions } from 'expo';

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
    let response;
    try {
      response = await this.props.mutate({
        variables: this.state.values,
      });
    } catch (err) {
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
export default Login
