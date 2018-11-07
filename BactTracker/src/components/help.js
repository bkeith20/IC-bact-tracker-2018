import React from 'react';
import { View, Text, Alert, ScrollView, TextInput, Dimensions, StyleSheet, WebView, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {SecureStore, ScreenOrientation} from 'expo';

const {height, width} = Dimensions.get('window');

export default class HelpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasVisited: null,
            url: null,
            steps: [],
        }
    }
    
    //just before screen is rendered this function checks if the help screen has been visited before(value stored in async), if it has not: the value is set in async and the value is changed in the database
    async componentDidMount(){
        ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
        try{
            const value = await SecureStore.getItemAsync('deviceUser');
            const user = JSON.parse(value);
            await SecureStore.setItemAsync('videoWatched', 'true');
            const value1 = await SecureStore.getItemAsync('videoWatched');
            const { navigation } = this.props;
            const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
            const toSendStr = JSON.stringify({uname: inNetpass});
            //http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioHelpInfo.php       
            let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/helpInfov2.php',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: toSendStr,
            });
            console.log(response);
            let rJSON = await response.json();
            console.log(rJSON);
            // need to do something with the data
            this.setState(
                {url: rJSON['url'],
                steps:rJSON['steps']}
            );


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
                    source={{uri: this.state.url}}
                />
            </View>
            <ScrollView contentContainerStyle={{alignItems: 'center'}} >
            <View style={{width: width*0.8}}>

            {
                this.state.steps.map(step => (
                        <Text style={styles.subtitles} key={step.key}>Step {step.key}: {step.step}</Text>
                    )
                )
            }
               
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