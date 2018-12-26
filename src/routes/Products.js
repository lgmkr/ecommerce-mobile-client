import React from 'react';
import { Text, View, Button, FlatList, Image } from 'react-native';
import styled from 'styled-components/native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'

const ProductRow = styled.View`
  display: flex;
  flexDirection: row;
  margin: 10px;
`
const ProductImage = styled.Image`
  width: 100px;
  height: 100px;
`
const ProductSummary = styled.View`
  margin-left: 10px;
  margin-right: 10px;
  flex: 1;
  display: flex;
  align-items: flex-end;
`

const ProductName = styled.Text`
  font-size: 30;
`

const ProductPrice = styled.Text`
  font-size: 20;
`

const EditSection = styled.View`
  display: flex;
  flex-direction: row;
`

const ProductItem = ({item, userId}) => <ProductRow>
    <ProductImage
      source={{ uri: `http://localhost:4000/${item.pictureUrl}` }}
    />
    <ProductSummary>
      <ProductName>{item.name}</ProductName>
      <ProductPrice>${item.price}</ProductPrice>
      <EditSection>
        <Button title="Edit" />
        <Button title="Delete" />
      </EditSection>
    </ProductSummary>
  </ProductRow>

const Products = ({ data: {products}, loading, history, userId }) => {
  if(loading || !products) {
    return null
  }

  return (<View>
    <Button title="Create Product" onPress={() => history.push('/new-product')} />
    <FlatList
      data={products}
      renderItem={({item}) => (<ProductItem item={item} userId={userId}/>)}
      keyExtractor={(item, index) => item.id}
    />
  </View>)
};

export const productsQuery = gql`
  {
    products {
      id
      price
      pictureUrl
      name
    }
  }
`

const ProductsWithGraphQL = graphql(productsQuery)(Products)
const mapStateToProps = (state) => ({
  userId: state.userId
})
export default connect(mapStateToProps)(ProductsWithGraphQL)
