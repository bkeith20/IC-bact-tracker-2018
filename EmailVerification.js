import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, WebView, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator, TabNavigator} from 'react-navigation';
import {MailComposer} from 'expo';



    export default class emailVerify extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                code: '';
            }
        }
        
        //send email to the email sent in
        async componentDidMount(){
            const { navigation } = this.props;
            const inNetpass = ;
            const email = ;
            var code = this.createOneTimeCode();
            this.setState({code: code});
            var options = {
                recipients: [email],
                subject: 'BactTracker Email Verification',
                body: 'Hello '+inNetpass+", \n Welcome to the BActTracker! Your one time email verification code is: "+code
            };
            console.log(options);
            var promise = await MailComposer.composeAsync(options);
            console.log(promise.status);
        }
        
        createOneTimeCode(){
            var code = '';
            for(var i = 0; i<10; i++){
                let r = Math.floor(Math.random() * 3);
                let x = 0;
                switch(r){
                    //number
                    case 0:
                        x = Math.floor(Math.random()*10)+48;
                        break;
                    //lowercase
                    case 1:
                        x = Math.floor(Math.random()*26)+97;
                        break;
                    //uppercase    
                    default:
                        x = Math.floor(Math.random()*27)+65;
                        break;
                }
                code = code.concat(String.fromCharCode(x));
            }
            return code;
        }
        
        checkCode(){
            
        }

        render() {
            const { navigation } = this.props;
            const inNetpass = ;
            const email = ;
            // will need a resend button for the email a text field for the code to be entered and a button to submit it
        return (
            
            
        );
      }
    }