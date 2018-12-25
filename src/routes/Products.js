import React from 'react';
import { Text, View, Button, FlatList, Image } from 'react-native';
import styled from 'styled-components/native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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

const ProductItem = ({item}) => <ProductRow>
    <ProductImage
      source={{ uri: `http://localhost:4000/${item.pictureUrl}` }}
    />
    <ProductSummary>
      <ProductName>{item.name}</ProductName>
      <ProductPrice>${item.price}</ProductPrice>
    </ProductSummary>
  </ProductRow>

const Products = ({ data: {products}, loading, history }) => {
  if(loading || !products) {
    return null
  }

  return (<View>
    <Button title="Create Product" onPress={() => history.push('/new-product')} />
    <FlatList
      data={products}
      renderItem={({item}) => (<ProductItem item={item} />)}
      keyExtractor={(item, index) => item.id}
    />
  </View>)
};

const productsQuery = gql`
  {
    products {
      id
      price
      pictureUrl
      name
    }
  }
`

export default graphql(productsQuery)(Products)
