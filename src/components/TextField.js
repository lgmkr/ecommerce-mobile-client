import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import styled from 'styled-components/native'

const Field = styled.TextInput`
  font-size: 20px;
  border-bottom-width: 0.5px;
  border-bottom-color: #000;
  margin-bottom: 15px;
  height: 35px;
`

export default class TextField extends React.PureComponent {
  onChangeText = (text) => {
    const { onChangeText, name } = this.props;
    onChangeText(name, text);
  };

  render() {
    const { value, secureTextEntry, name } = this.props;

    return (
      <Field
        onChangeText={this.onChangeText}
        value={value}
        placeholder={name}
        autoCapitalize="none"
        secureTextEntry={!!secureTextEntry}
      />
    );
  }
}
