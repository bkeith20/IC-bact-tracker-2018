import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class ViewerScreen extends React.Component {
    static navigationOptions = {
        title: 'Create Account',
    };
  render() {
      
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        
            <Text>This is the Account screen</Text>
        
      </ScrollView>
    );
  }
}