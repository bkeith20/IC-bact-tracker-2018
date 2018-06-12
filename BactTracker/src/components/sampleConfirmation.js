import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class ConfirmScreen extends React.Component {
    static navigationOptions = {
        title: 'Login',
    };
  render() {
      
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        
            <Text>This is the login Screen</Text>
        
      </ScrollView>
    );
  }
}