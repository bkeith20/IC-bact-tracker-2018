import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableOpacity, Dimensions, Picker, StyleSheet, BackHandler } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class HomeScreen extends React.Component {
    
    //query db, compose email, should there be a code and a way to reset password or just send the old password by email? 
    
  render() {
    return (
      <View style={styles.containerOuter}>
        
        <Text style={styles.title}> To retrieve your password select the button below to send it to the email listed in your account or see your professor. </Text>
        
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Login')} underlayColor='#003b71'>
                <Text style={styles.buttonText}>Send to Email </Text>
            </TouchableOpacity>
            
      </View> 
    );
  }
}

const styles = StyleSheet.create({
  containerOuter: {
    backgroundColor: 'white',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  containerRow: {
    //backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  containerCol: {
    //backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  title: {
    //color: 'white',
    color: '#003b71',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10
  },
    button: {
    backgroundColor: '#003b71',
    width: 180,
    height: 40,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
});