   import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Dimensions, WebView } from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';



    export default class tracker extends React.Component {

        render() {

        return (
            <View style={styles.container}>
                <WebView
                    style={styles.view}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{uri: 'http://ic-research.eastus.cloudapp.azure.com/~bkeith/heatmap/other.html'}}
                />
            </View>
            
        );
      }
    }

    const styles = StyleSheet.create({
        
        container: {
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
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