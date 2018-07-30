import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, WebView, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator, TabNavigator} from 'react-navigation';
import {MailComposer} from 'expo';



    export default class emailVerify extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                
            }
        }
        
        //send email to the email sent in
        async componentDidMount(){
        
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

        render() {
            const { navigation } = this.props;
            const inNetpass = ;
            const email = ;
        return (
            
            
        );
      }
    }