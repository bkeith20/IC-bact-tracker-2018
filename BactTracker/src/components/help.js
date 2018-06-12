import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, WebView, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class HelpScreen extends React.Component {
    static navigationOptions = {
        title: 'Help',
    };
    
    constructor(props) {
        super(props);
        this.state = {
            hasVisited: null,
        }
    }
    
    //just before screen is rendered this function checks if the help screen has been visited before(value stored in async), if it has not: the value is set in async and the value is changed in the database
    async componentDidMount(){
         //console.log("function running");
        try{
        const value = await AsyncStorage.getItem('@MySuperStore:helpScreenSeen');
        this.setState({hasVisited: value});
        console.log('1 '+this.state.hasVisited);
        if(this.state.hasVisited==null){
            console.log("got here");
            //save that this screen has been visited
            await AsyncStorage.setItem('@MySuperStore:helpScreenSeen', 'true');
            const value1 = await AsyncStorage.getItem('@MySuperStore:helpScreenSeen');
            this.setState({hasVisited: value1});
            console.log('2 '+this.state.hasVisited);
            //set value in database
            //TODO 
        }
        console.log('3 '+this.state.hasVisited);
        //Alert.alert("Help screen has been visited "+this.state.hasVisited);
        }catch (error) {
            console.log("Error accessing data " + error);
        }
    } 
    
  render() {
      
    return (
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={styles.videoContainer}>
                <WebView
                    style={styles.view}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{uri: 'https://www.youtube.com/embed/D86RtevtfrA'}}
                    //this is where variable telling video has been watched is set
                    //onLoadStart={() => this.toggleHelpSeen.bind(this)}
                />
            </View>
        
            <View style={styles.containerOuter}>
        
                <Text>This is the Help Screen</Text>
                <Text>These can be written instructions to accompany the video.</Text>
                <Text>Step 1</Text>
                <Text>Step 2</Text>
                <Text>Step 3</Text>
                <Text>Step 4</Text>
                <Text>Step 5</Text>
                <Text>Step 6</Text>
                <Text>Step 7</Text>
                <Text>Step 8</Text>
                <Text>Step 9</Text>
                <Text>Step 10</Text>
                <Text>Step 11</Text>
                <Text>Step 12</Text>
                <Text>Step 13</Text>
                <Text>Step 14</Text>
                <Text>Step 15</Text>
                <Text>Step 16</Text>
                <Text>Step 17</Text>
                <Text>Step 18</Text>
                <Text>Step 19</Text>
        
            </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    containerOuter: {
        backgroundColor: 'white',
        //flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        //flexDirection: 'column'
    },
    videoContainer: {
        height: 300,
    },
    view: {
        marginTop: (Platform.OS == 'ios')?20:0,
    },
});