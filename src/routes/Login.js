import React from 'react'
import { View, TextInput, Button, Text, AsyncStorage } from 'react-native'
import styled from 'styled-components/native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import TextField from '../components/TextField'

const LoginView = styled.View`
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

const LoginInputView = styled.View`
  width: 200px;
`

const defaultState = {
  name: '',
  password: '',
  email: '',
  errors: {}
}

class Login extends React.Component {
  state = defaultState

  submit = async () => {
    const {email, password, name} = this.state
    const response = await this.props.mutate({
      variables: {email, password, name}
    })

    const {payload, error} = response.data.login

    if(payload) {
      await AsyncStorage.setItem('@ecommerce/token', payload.token)
      this.setState(defaultState)
      this.props.history.push('/products')
    } else {
      this.setState({
        errors: {
          [error.field]: error.msg
        }
      })
    }
  }

  onChangeText = (key, value) => {
    this.setState(state => ({
      ...state,
      [key]: value
    }))
  }

  goToSignup = () => {
    this.props.history.push('/signup')
  }

  render() {
    const {errors, email , password} = this.state
    return (
      <LoginView>
        <LoginInputView>

          {errors.email && <ErrorField>{errors.email}</ErrorField>}
          <TextField
            onChangeText={this.onChangeText}
            value={email}
            name='email'
          />

          {errors.password && <ErrorField>{errors.password}</ErrorField>}
          <TextField
            onChangeText={this.onChangeText}
            value={password}
            secureTextEntry
            name='password'
          />

          <Button title="Login" onPress={this.submit}/>
          <OrText>or</OrText>
          <Button title="Create account" onPress={this.goToSignup}/>
        </LoginInputView>
      </LoginView>
    )
  }
}

const LoginMutation = gql`
  mutation($email: String!, $password: String!){
  login(email: $email, password: $password){
    payload {
      token
    }
    error {
      field
      msg
    }
  }
}
`

export default graphql(LoginMutation)(Login)
