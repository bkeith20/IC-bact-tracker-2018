import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, WebView, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {SecureStore, ScreenOrientation} from 'expo';

const {height, width} = Dimensions.get('window');

export default class HelpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasVisited: null,
        }
    }
    
    //just before screen is rendered this function checks if the help screen has been visited before(value stored in async), if it has not: the value is set in async and the value is changed in the database
    async componentDidMount(){
        ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
        try{
            const value = await SecureStore.getItemAsync('deviceUser');
            const user = JSON.parse(value);
            if(user.seenVideo==null){
                await SecureStore.setItemAsync('videoWatched', 'true');
                const value1 = await SecureStore.getItemAsync('videoWatched');
                const { navigation } = this.props;
                const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
                const toSendStr = JSON.stringify({uname: inNetpass});
                                    
                let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/setHelp.php',{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: toSendStr,
                });
            }
        }catch (error) {
            console.log("Error accessing data " + error);
        }
    } 
    
    componentWillUnmount(){
        ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT_UP);
    }
    
  render() {
      
    return (
        <View style={styles.containerOuter}>
            <View style={styles.videoContainer}>
                <WebView
                    style={styles.view}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{uri: 'https://www.youtube.com/embed/NRqIn1gO1kU'}}
                />
            </View>
            <ScrollView style={{alignItems: 'center'}} >
            <View style={{width: width*0.8}}>
                <Text style={styles.title}>No help information is currently available</Text>
                <Text style={styles.subtitles}>Step 1</Text>
                <Text style={styles.subtitles}>Step 2</Text>
                <Text style={styles.subtitles}>Step 3</Text>
                <Text style={styles.subtitles}>Step 4</Text>
                <Text style={styles.subtitles}>Step 5</Text>
                <Text style={styles.subtitles}>Step 6</Text>
                <Text style={styles.subtitles}>Step 7</Text>
                <Text style={styles.subtitles}>Step 8</Text>
                <Text style={styles.subtitles}>Step 9</Text>
                <Text style={styles.subtitles}>Step 10</Text>
                <Text style={styles.subtitles}>Step 11</Text>
                <Text style={styles.subtitles}>Step 12</Text>
                <Text style={styles.subtitles}>Step 13</Text>
                <Text style={styles.subtitles}>Step 14</Text>
                <Text style={styles.subtitles}>Step 15</Text>
                <Text style={styles.subtitles}>Step 16</Text>
                <Text style={styles.subtitles}>Step 17</Text>
                <Text style={styles.subtitles}>Step 18</Text>
               
            </View>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    containerOuter: {
        backgroundColor: 'white',
        flex:1,
        //alignItems: 'center',
        //justifyContent: 'center',
        //flexDirection: 'column'
    },
    videoContainer: {
        height: (height>width)?width-(width/5.886):height-(height/5.886),
    },
    view: {
        marginTop: (Platform.OS == 'ios')?20:0,
    },
    title: {
        color: '#003b71',
        //textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        //paddingLeft: 10
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