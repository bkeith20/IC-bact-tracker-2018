//Imports of functionality
import React from 'react';
import {
    View,
    Text,
    Image,
    Button,
    Alert,
    ScrollView,
    TextInput,
    TouchableHighlight,
    Dimensions,
    Picker
} from 'react-native';
import {
    createStackNavigator
} from 'react-navigation';

//imports components i.e. the screens of the app
import HomeScreen from './src/components/home.js';
import HelpScreen from './src/components/help.js';
import EnterSampleScreen from './src/components/enterSample.js';
import LoginScreen from './src/components/Login.js';
import ConfirmScreen from './src/components/sampleConfirmation.js';
import TrackerScreen from './src/components/tracker.js';
import ViewerScreen from './src/components/viewer.js';
//import CreateAccountScreen from './src/components/CreateAccount.js';
//import ForgotPasswordScreen from './src/components/forgotPassword.js';
import SampleReviewScreen from './src/components/SampleReview.js';
import editSamplesScreen from './src/components/editSamples.js';
//import verifyEmailScreen from './src/components/EmailVerification.js';

const RootStack = createStackNavigator({
    Home: HomeScreen,
    Help: HelpScreen,
    BactTracker: EnterSampleScreen,
    Login: LoginScreen,
    Confirmation: ConfirmScreen,
    Tracker: TrackerScreen,
    Viewer: ViewerScreen,
    //CreateAccount: CreateAccountScreen,
    //ForgotPassword: ForgotPasswordScreen,
    SampleReview: SampleReviewScreen,
    Edit: editSamplesScreen,
    //VerifyEmail: verifyEmailScreen,
}, {
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
});

export default class App extends React.Component {
    render() {
        return <RootStack / > ;
    }
}
