import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, WebView, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator, TabNavigator} from 'react-navigation';



    export default class viewer extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                myURL: 'http://ic-research.eastus.cloudapp.azure.com/~bkeith/heatmap'
            }
        }

        render() {

        return (
            <View style={styles.container}>
                <WebView
                    ref="map"
                    onLoadStart={() => this.setState({myURL: 'http://ic-research.eastus.cloudapp.azure.com/~bkeith/heatmap/viewer.html'})}
                    style={styles.view}
                    javaScriptEnabled={true}
                    domStorageEnabled={false}
                    thirdPartyCookiesEnabled={false}
                    source={{uri: this.state.myURL, headers: {"cache": "no-cache"}}}
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
    },
        view: {
        marginTop: (Platform.OS == 'ios')?20:0,
    },

    });