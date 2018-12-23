import React from 'react'
import { View, TextInput, Button } from 'react-native'
import styled from 'styled-components/native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const SignupView = styled.View`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Field = styled.TextInput`
  font-size: 20px;
  border-bottom-width: 0.5px;
  border-bottom-color: #000;
  margin-bottom: 15px;
  height: 35px;
`

const SignupInputView = styled.View`
  width: 200px;
`

const SignupInput = styled(Field)``
const EmailInput = styled(Field)``
const PasswordInput = styled(Field)``

class Signup extends React.Component {
  state = {
    name: '',
    password: '',
    email: ''
  }

  submit = async () => {
    const {email, password, name} = this.state
    const response = await this.props.mutate({
      variables: {email, password, name}
    })

    console.log('signup response: ', response)
  }

  onChangeText = (key, value) => {
    this.setState(state => ({
      ...state,
      [key]: value
    }))
  }

  render() {
    const {email , password, name} = this.state
    return (
      <SignupView>
        <SignupInputView>

          <SignupInput
            onChangeText={(text)=> this.onChangeText('name', text)}
            value={name}
            placeholder="name"
            textContentType="username"
          />

          <EmailInput
            onChangeText={(text)=> this.onChangeText('email', text)}
            value={email}
            placeholder="email"
            textContentType="emailAddress"
          />

          <PasswordInput
            onChangeText={(text)=> this.onChangeText('password', text)}
            value={password}
            placeholder="password"
            textContentType="password"
            secureTextEntry={true}
          />

          <Button title="Create account" onPress={this.submit}/>
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
