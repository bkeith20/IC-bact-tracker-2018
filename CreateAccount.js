import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableOpacity, Dimensions, Picker, StyleSheet, AsyncStorage, NetInfo } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import t from 'tcomb-form-native';
import {SecureStore} from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Form = t.form.Form;

//this should be read from DB in the future
const Section = t.enums({
    1: 'MWF 10am',
    2: 'MWF 1pm',
    3: 'TR 10:50am',
    4: 'TR 1:10pm',
});

const Password = t.refinement(t.String, function (s) {
  return (s.length >= 4)&&(s.length<50);
});

const Email = t.refinement(t.String, function (s) {
  return (/@ithaca.edu/.test(s))&&(s.length<100);
});

const Name = t.refinement(t.String, function (s) {
  return (s.length >= 2)&&(s.length<50);
});

const Initials = t.refinement(t.String, function (s) {
  return (s.length >= 2)&&(s.length<10);
});

function samePasswords(x) {
  return x.password === x.confirmPassword;
}

const Student = t.subtype(t.struct({
    firstName: Name,
    lastName: Name,
    netpassUsername: Name,
    password: Password,
    confirmPassword: Password,
    initials: t.String,
    email: Email,
    section: Section,
}), samePasswords);

export default class ViewerScreen extends React.Component {
    static navigationOptions = {
        title: 'Create Account',
    };
    
    constructor(props) {
        super(props);
        this.state = {
            value: {},
            options: this.defaultOptions
        };
    };
    
    defaultOptions = {
    auto: 'placeholders',
    fields: {
        firstName: {
            label: "First Name",
            onSubmitEditing: () => this._accform.getComponent('lastName').refs.input.focus()
        },
        lastName: {
            label: "Last Name",
            onSubmitEditing: () => this._accform.getComponent('netpassUsername').refs.input.focus()
        },
        netpassUsername: {
            label: "Netpass Username",
            help: 'Please be sure to use your Netpass username',
            onSubmitEditing: () => this._accform.getComponent('password').refs.input.focus()
        },
        password: {
            label: "Password",
            help: 'Restrictions on passwords if want any',
            error: 'Password must meet restrictions',
            secureTextEntry: true,
            onSubmitEditing: () => this._accform.getComponent('confirmPassword').refs.input.focus()
        },
        confirmPassword: {
            label: "Confirm Password",
            error: 'Password must meet restrictions',
            secureTextEntry: true,
            onSubmitEditing: () => this._accform.getComponent('initials').refs.input.focus()
        },
        initials: {
            label: "Initials",
            onSubmitEditing: () => this._accform.getComponent('email').refs.input.focus()
        },
        email: {
            label: "Email",
            help: 'Please be sure to use your Ithaca email',
            error: 'Invalid Email',
        },
        section: {
            nullOption: {value: 'null', text: 'Choose your section'}
        },
    }
}; 
    
    async onPress() {
        this.setState({options: this.defaultOptions});
        const val = this._accform.getValue();
        if(val){
            //save to DB here
            //check account does not already exist!!!!!!!
            const netInfo = await NetInfo.getConnectionInfo();
            const connection = netInfo.type;
            //check if connected to internet
            if (connection!=="none" && connection!=="unknown"){
                try{
                    const toSend = this._accform.getValue();
                    const toSendStr = JSON.stringify(toSend);
                    //Send info here but dont add to bd just check if username and email are taken? maybe do put in but add a field for active vs not? or have a whole table just for accounts that still need to be verified
                    let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioDB3.php',{
                       method: 'POST',
                       headers: {
                           Accept: 'application/json',
                           'Content-Type': 'application/json',
                       },
                        body: toSendStr,
                    });
                    console.log(response);
                    let rJSON = await response.json();
                    //move this to verify email + send in email address
                    console.log(rJSON["submitted"]);
                    if(rJSON["submitted"]==="true"){
                        const toSave = {
                            userName: toSend.netpassUsername,
                            password: toSend.password,
                            rememberMe: false,
                        };
                        const inNetpass = toSend.netpassUsername;
                        const toSaveStr = JSON.stringify(toSave);
                        await SecureStore.setItemAsync('deviceUser', toSaveStr);
                        const retrieved = await SecureStore.getItemAsync('deviceUser');
                        console.log(retrieved);
                        this.props.navigation.navigate('Home', {inNetpass: inNetpass});
                    }
                    else{
                        Alert.alert(rJSON["message"]);
                    }
                } catch(error){
                    console.log(error);
                }
            }
            else{
                Alert.alert("No internet connection! Please turn on mobile data or wifi and retry.");
            }
        }
        else{
            if(this.state.value.confirmPassword && !samePasswords(this.state.value)){
                this.setState({
                    options: t.update(this.state.options,{
                        fields: {
                            confirmPassword: {
                                hasError: {$set: true},
                                error: {$set: 'Password must match'}
                            }
                        }
                    })
                })
            }
        }
    };
    
    onChange(val) {
        this.setState({value: val});
      };
    
  render() {
      
    return (
    <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" >
      
            <View style={styles.container}>
                <Form
                    ref={c => this._accform = c}
                    type={Student}
                    options={this.state.options}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                />
            <TouchableOpacity style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#003b71'>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            </View>
        
    </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    //marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
    //flex: 1
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#003b71',
    borderColor: '#003b71',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});