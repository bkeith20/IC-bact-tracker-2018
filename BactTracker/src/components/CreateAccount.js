import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableOpacity, Dimensions, Picker, StyleSheet, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import t from 'tcomb-form-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Form = t.form.Form;

const Section = t.enums({
    1: 'MWF 10am',
    2: 'MWF 1pm',
    3: 'TR 10:50am',
    4: 'TR 1:10pm',
});

const Password = t.refinement(t.String, function (s) {
  return s.length >= 2;
});

function samePasswords(x) {
  return x.password === x.confirmPassword;
}

const Student = t.subtype(t.struct({
    firstName: t.String,
    lastName: t.String,
    netpassUsername: t.String,
    password: Password,
    confirmPassword: Password,
    initials: t.String,
    email: t.String,
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
            console.log(val);
            await AsyncStorage.setItem(val.netpassUsername, val.password);
            const inpass = await AsyncStorage.getItem(val.netpassUsername);
            console.log(inpass);
            inNetpass = val.netpassUsername;
            //save to DB here
            this.props.navigation.navigate('Home', {inNetpass});
            
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
    <KeyboardAwareScrollView enableOnAndroid={true}>
      
            <View style={styles.container}>
                <Form
                    ref={c => this._accform = c}
                    type={Student}
                    options={this.state.options}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                />
            <TouchableOpacity style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Save</Text>
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
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});