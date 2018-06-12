import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableOpacity, Dimensions, Picker, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };
  render() {
      
    return (
      <View style={styles.containerOuter}>
        
            <View style={styles.containerRow}>
                <Text style={styles.title}> Welcome to the Bact-Tracker!</Text>
            </View>
        
            <View style={styles.containerRow}>
            </View>
        
            <View style={styles.containerRow}>
                <View style={styles.containerCol}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Viewer')}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>BACT-VIEWER</Text>
                    </TouchableOpacity>
                </View>
        
                <View style={styles.containerCol}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Tracker')}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>BACT-Tracker</Text>
                    </TouchableOpacity>        
                </View>
            </View>
        
            <View style={styles.containerRow}>
                
            </View>
        
            <View style={styles.containerRow}>
                <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Help')}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>help</Text>
                    </TouchableOpacity> 
            </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerOuter: {
    //backgroundColor: 'darkgrey',
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
    backgroundColor: 'rgb(39, 40, 43)',
    width: 130,
    height: 40,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
  title: {
    //color: 'white',
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 10
  }
});
