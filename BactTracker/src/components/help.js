import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, WebView, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';

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
        <View style={styles.containerOuter}>
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
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{padding: 10}}>
                <Text style={styles.title}>This is the Help Screen</Text>
                <Text style={styles.regularText}>These can be written instructions to accompany the video.</Text>
                <Text style={styles.subtitles}>Step 1</Text>
                <Text style={styles.regularText}>These can be written instructions to accompany the video.</Text>
                <Text style={styles.subtitles}>Step 2</Text>
                <Text style={styles.regularText}>These can be written instructions to accompany the video.</Text>
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