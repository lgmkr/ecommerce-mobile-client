import React from 'react'
import { View, TextInput, Button, Text, AsyncStorage } from 'react-native'
import styled from 'styled-components/native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import TextField from '../components/TextField'

const SignupView = styled.View`
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

const SignupInputView = styled.View`
  width: 200px;
`

const defaultState = {
  name: '',
  password: '',
  email: '',
  errors: {}
}

class Signup extends React.Component {
  state = defaultState

  submit = async () => {
    const {email, password, name} = this.state
    let response
    try {
    response = await this.props.mutate({
      variables: {email, password, name}
    })
    } catch(err) {
      this.setState(state => ({
        errors: {
          ...state.errors,
          email: 'Already taken'
        }
      }))
      return
    }

    await AsyncStorage.setItem('@ecommerce/token', response.data.signup.token)
    this.setState(defaultState)
    this.props.history.push('/products')
  }

  onChangeText = (key, value) => {
    this.setState(state => ({
      ...state,
      [key]: value
    }))
  }

  goToLogin = () => {
    this.props.history.push('/login')
  }

  render() {
    const {errors, email , password, name} = this.state
    return (
      <SignupView>
        <SignupInputView>

          <TextField
            onChangeText={this.onChangeText}
            value={name}
            name='name'
          />

          {errors.email && <ErrorField>{errors.email}</ErrorField>}
          <TextField
            onChangeText={this.onChangeText}
            value={email}
            name='email'
          />

          <TextField
            onChangeText={this.onChangeText}
            value={password}
            secureTextEntry
            name='password'
          />

          <Button title="Create account" onPress={this.submit}/>
          <OrText>or</OrText>
          <Button title="Login" onPress={this.goToLogin}/>
        </SignupInputView>
      </SignupView>
    )
  }
}

const SignupMutation = gql`
  mutation($name: String!, $email: String!, $password: String!){
  signup(name: $name, password: $password, email: $email, ){
    token
    user {
      id
      name
    }
  }
}
`

export default graphql(SignupMutation)(Signup)
