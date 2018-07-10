   import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Dimensions } from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';



    export default class tracker extends React.Component {

        render() {

        return (
            <View style={styles.container}>
                <Text style={styles.title}> Welcome to the BACT-Viewer! </Text>
                <Text style={styles.subtitles}> Here you will be able to view data collected and analyzed by your fellow students. Unfortunately, there is currently no data. Please check back once more data has been collected and analyzed. </Text>
            </View>
            
        );
      }
    }

    const styles = StyleSheet.create({
        
        container: {
        //flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#ecf0f1',
        margin: 5,
      },
      
        map: {
        ...StyleSheet.absoluteFillObject,
      },
       title: {
        color: '#003b71',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        //paddingLeft: 10
    },
    regularText: {
         color: '#003b71',
        textAlign: 'center',
        //fontWeight: 'bold',
        fontSize: 16,
        paddingLeft: 30
    },
    subtitles: {
         color: '#003b71',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10
    }

    });