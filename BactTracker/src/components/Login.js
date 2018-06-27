    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Alert} from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';
    import t from 'tcomb-form-native'; 

    const Form = t.form.Form;

    const User = t.struct({
      Netpass: t.String,
      Password: t.String,
      RememberMe: t.Boolean,
    });

    export default class Login extends React.Component {
        

         constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.state = {userPass: '', 
                      defaultVal:{
                          Netpass: '',
                          Password: '',
                          RememberMe: false,
                      }
                     }

      }
       
        async componentDidMount() {
            const remembered = await AsyncStorage.getItem('rememberMe');
            console.log(remembered);
            if(remembered){
                const remPass = await AsyncStorage.getItem(remembered);
                const vals = {
                    Netpass: remembered,
                    Password: remPass,
                    RememberMe: true,
                }
                this.setState({defaultVal: vals});
                this.setState({userPass: remPass})
            }
        }

        handleInput(inValue){
            if(inValue.Netpass!=null){
            AsyncStorage.getItem(inValue.Netpass).then((value) => {
                if(value!=null){
                    this.state.userPass = value;
                }
            }).done();
        }
        }
        
        options = {
            auto: 'placeholders',
            fields: {
                Netpass: {
                    label: 'Netpass Username', // <= label for the name field
                    onSubmitEditing: () => this._form.getComponent('Password').refs.input.focus()
                },
                Password: {
                    label: 'Password',
                    secureTextEntry: true,
                    onSubmitEditing: () => this._onClick()
                }
            }
        };


       async _onClick(){

          const Fvalue = this._form.getValue();
            if(Fvalue){
            const inNetpass = Fvalue.Netpass;
            const inPass = Fvalue.Password;
                console.log(inNetpass+": "+inPass)
            await AsyncStorage.getItem(inNetpass).then((value) => {
                this.setState({"userPass": value});
            }).done();
            console.log(this.state.userPass);
            if(this.state.userPass != null){
                if(inPass === this.state.userPass){
                    if(Fvalue.RememberMe){
                        await AsyncStorage.setItem('rememberMe', inNetpass);
                    }
                    else{
                        await AsyncStorage.removeItem('rememberMe');
                        const vals = {
                            Netpass: '',
                            Password: '',
                            RememberMe: false,
                        }
                    }
                    this.props.navigation.navigate('Home', {inNetpass: inNetpass});
                }
                else{
                    Alert.alert("Your netpass and/or password were incorrect.")
                }
            }

            }

        }

      render() {

        return (

        
          <View style={{alignItems: 'center',justifyContent: 'center', backgroundColor: 'white', flex: 1 }}>
             
            <View style={{width: 180}}>
            <Form 
                    type={User} 
                    options = {this.options}
                    value={this.state.defaultVal}
                    ref={c => this._form = c}
                    onChange={this.handleInput}
                />
            </View>
            <TouchableOpacity onPress ={() => this._onClick()}>
            <View style = {styles.button}>
            <Text style={styles.buttonText}>Log in</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress ={() => this.props.navigation.navigate('CreateAccount')}>
            <View style = {styles.button}>
            <Text style={styles.buttonText}>Create an Account</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress ={() => this.props.navigation.navigate('ForgotPassword')}>
            <View style = {styles.button}>
            <Text style={styles.buttonText}>Forgot Password</Text>
            </View>
            </TouchableOpacity>


          </View>

        );
      }
    }
    const styles = StyleSheet.create({

      button: {
    backgroundColor: '#003b71',
    width: 180,
    height: 40,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
       

    });
