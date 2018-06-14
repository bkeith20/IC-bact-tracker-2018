//Imports of functionality
import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker } from 'react-native';
import { createStackNavigator } from 'react-navigation';

//imports of my classes
import HomeScreen from './src/components/home.js';
import HelpScreen from './src/components/help.js';
import EnterSampleScreen from './src/components/enterSample.js';
import LoginScreen from './src/components/Login.js';
import ConfirmScreen from './src/components/sampleConfirmation.js';
import TrackerScreen from './src/components/tracker.js';
import ViewerScreen from './src/components/viewer.js';
import CreateAccountScreen from './src/components/CreateAccount.js';

const RootStack = createStackNavigator({
   Home: HomeScreen,
   Help: HelpScreen,
   BactTracker: EnterSampleScreen,
    Login: LoginScreen,
    Confirmation: ConfirmScreen,
    Tracker: TrackerScreen,
    Viewer: ViewerScreen,
    CreateAccount: CreateAccountScreen,
},
{
    initialRouteName: 'Login',
    //initialRouteName: 'Home',
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#003b71',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
}
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

