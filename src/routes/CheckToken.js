import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { AsyncStorage, Text } from 'react-native'
import { TOKEN_KEY } from '../constants'
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { addUser } from '../reducers/user'

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
      console.log('err : ', err)
      this.props.history.push('/signup')
      return
    }

    const { refreshToken: { token: newToken, userId } } = response.data
    console.log('newToken : ', newToken)
    await AsyncStorage.setItem(TOKEN_KEY, newToken)
    this.props.addUserAction({ userId })
    this.props.history.push('/products')
  }

  render() {
    return <Text>loading...</Text>;
  }
}

const CheckTokenMutation = gql`
  mutation{
    refreshToken {
      token
      userId
    }
  }
`
const CheckTokenWithGraphQL = graphql(CheckTokenMutation)(CheckToken)
const mapDispatchToProps = (dispatch) => bindActionCreators({
  addUserAction: addUser
}, dispatch)
export default connect(null, mapDispatchToProps)(CheckTokenWithGraphQL)
