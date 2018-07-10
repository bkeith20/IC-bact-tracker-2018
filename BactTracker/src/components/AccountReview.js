import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableOpacity, Dimensions, Picker, StyleSheet, BackHandler, AsyncStorage, NetInfo } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class AccountReviewScreen extends React.Component {
    

  render() {
      const { navigation } = this.props;
      const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
    return (
      <View style={styles.containerOuter}>
        
        <View style={styles.containerRow}>
            <Text style={styles.title}> Account information: </Text>
        </View>
        
        <View style={styles.containerRow}>
        
            <View style={styles.containerCol}>
                <Text style={styles.subtitles}> Username: </Text>
            </View>
        
            <View style={styles.containerCol}>
                <Text style={styles.subtitles}> {inNetpass} </Text>
            </View>
        
        </View>
        
        <View style={styles.containerRow}>
        
            <View style={styles.containerCol}>
                <Text style={styles.subtitles}> Email: </Text>
            </View>
        
            <View style={styles.containerCol}>
                <Text style={styles.subtitles}> emailaddress </Text>
            </View>
        
        </View>
        
      </View>
    );
  };
};

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
  button: {
    backgroundColor: '#003b71',
    width: 130,
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
  title: {
    //color: 'white',
    color: '#003b71',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 10
  },
    regularText: {
         color: '#003b71',
        //textAlign: 'center',
        //fontWeight: 'bold',
        fontSize: 16,
        paddingLeft: 30
    },
    subtitles: {
         color: '#003b71',
        //textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10
    }
});