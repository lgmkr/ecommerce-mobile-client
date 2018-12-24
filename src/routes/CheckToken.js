import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { AsyncStorage, Text } from 'react-native'
import { TOKEN_KEY } from '../constants'

class CheckToken extends React.Component {
  componentDidMount = async () => {
    // refresh token here
    // await AsyncStorage.clear()
    const token = await AsyncStorage.getItem(TOKEN_KEY)

    if(!token) {
      this.props.history.push('/signup')
      return
    }

    let response
    try {
      response = await this.props.mutate()
    } catch(err) {
      this.props.history.push('/signup')
      return
    }

    const { refreshToken } = response.data
    await AsyncStorage.setItem(TOKEN_KEY, refreshToken)
    this.props.history.push('/products')
  }

  render() {
    return <Text>loading...</Text>;
  }
}

const CheckTokenMutation = gql`
  mutation{
    refreshToken
  }
`

export default graphql(CheckTokenMutation)(CheckToken)
