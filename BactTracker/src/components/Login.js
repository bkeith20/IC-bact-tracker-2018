    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Alert, NetInfo} from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';
    import {SecureStore} from 'expo';
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
        this.state = {defaultVal:{
                          Netpass: '',
                          Password: '',
                          RememberMe: false,
                      }
                     }

      }
       
        async componentDidMount() {
            try{
                const saved = await SecureStore.getItemAsync('deviceUser');
                if(saved!=null){
                    const savedUser = JSON.parse(saved);
                    if(savedUser.rememberMe){
                        const vals = {
                            Netpass: savedUser.userName,
                            Password: savedUser.password,
                            RememberMe: savedUser.rememberMe,
                        }
                        this.setState({defaultVal: vals});
                    }
                }
            } catch(error){
                console.log(error);
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
                try{
                    const inNetpass = Fvalue.Netpass;
                    const inPass = Fvalue.Password;
                    //console.log(inNetpass+": "+inPass);
                    const saved = await SecureStore.getItemAsync('deviceUser');
                    if(saved!=null){
                        const savedUser = JSON.parse(saved);
                        if(inNetpass==savedUser.userName){
                            if(inPass==savedUser.password){
                                if(Fvalue.RememberMe!=savedUser.rememberMe){
                                    const toSave = {
                                        userName: inNetpass,
                                        password: inPass,
                                        rememberMe: Fvalue.RememberMe,
                                    };
                                    const toSaveStr = JSON.stringify(toSave);
                                    await SecureStore.setItemAsync('deviceUser', toSaveStr);
                                }
                                this.props.navigation.navigate('Home', {inNetpass: inNetpass});
                            }
                            else{
                               Alert.alert("Your netpass and/or password were incorrect."); 
                            }
                        }
                        else{
                            //check database here
                            //send username entered and if in DB return password 
                            //if not in database return "false" and show alert
                            //if in database and correct save to 'deviceUser'
                            //else show this alert
                            //may want to us the isconnected property instead of get Connection info!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            const netInfo = await NetInfo.getConnectionInfo();
                            const connection = netInfo.type;
                            //check if connected to internet
                            if (connection!=="none" && connection!=="unknown"){    
                                try{
                                    const finfo = this._form.getValue();
                                    const uname = finfo.Netpass;
                                    const toSendStr = JSON.stringify({uname: uname});
                                    console.log(toSendStr);
                                    let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioLogin.php',{
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: toSendStr,
                                    });
                                    //console.log(response);
                                    let rJSON = await response.json();
                                    console.log(rJSON["pass"]);
                                    if(rJSON["pass"]!=="false"){
                                        //here
                                        const toSave = {
                                            userName: uname,
                                            password: rJSON["pass"],
                                            rememberMe: false,
                                        };
                                        const inNetpass = finfo.netpassUsername;
                                        const toSaveStr = JSON.stringify(toSave);
                                        await SecureStore.setItemAsync('deviceUser', toSaveStr);
                                        const retrieved = await SecureStore.getItemAsync('deviceUser');
                                        console.log(retrieved);
                                        if(finfo.Password===toSave.password){
                                            this.props.navigation.navigate('Home', {inNetpass: inNetpass});
                                        }
                                        else{
                                           Alert.alert("Password Incorrect!"); 
                                        }
                                    }
                                    else{
                                        Alert.alert("Account Does not exist!!");
                                    }
                                } catch(error){
                                    console.log(error);
                                }
                            }
                            else{
                                Alert.alert("No internet connection! Please turn on mobile data or wifi and retry.");
                            }
                        }
                    }
                    else{
                        //check database here
                            //send username entered and if in DB return password 
                            //if not in database return "false" and show alert
                            //if in database and correct save to 'deviceUser'
                            //else show this alert
                        const netInfo = await NetInfo.getConnectionInfo();
                        const connection = netInfo.type;
                        //check if connected to internet
                        if (connection!=="none" && connection!=="unknown"){ 
                            try{
                                const finfo = this._form.getValue();
                                const uname = finfo.Netpass;
                                const toSendStr = JSON.stringify({uname: uname});
                                console.log(toSendStr);
                                let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioLogin.php',{
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: toSendStr,
                                });
                                //console.log(response);
                                let rJSON = await response.json();
                                console.log(rJSON["pass"]);
                                if(rJSON["pass"]!=="false"){
                                    //here
                                    const toSave = {
                                        userName: uname,
                                        password: rJSON["pass"],
                                        rememberMe: false,
                                    };
                                    const inNetpass = finfo.netpassUsername;
                                    const toSaveStr = JSON.stringify(toSave);
                                    await SecureStore.setItemAsync('deviceUser', toSaveStr);
                                    const retrieved = await SecureStore.getItemAsync('deviceUser');
                                    console.log(retrieved);
                                    if(finfo.Password===toSave.password){
                                        this.props.navigation.navigate('Home', {inNetpass: inNetpass});
                                    }
                                    else{
                                       Alert.alert("Password Incorrect!"); 
                                    }
                                }
                                else{
                                    Alert.alert("Account Does not exist!!");
                                }
                            } catch(error){
                                console.log(error);
                            } 
                        }
                        else{
                            Alert.alert("No internet connection! Please turn on mobile data or wifi and retry.");
                        }
                    }
                } catch (error){
                    console.log(error);
                }
            }

        };

      render() {

        return (

        
          <View style={{alignItems: 'center',justifyContent: 'center', backgroundColor: 'white', flex: 1 }}>
             
            <View style={{width: 180}}>
            <Form 
                    type={User} 
                    options = {this.options}
                    value={this.state.defaultVal}
                    ref={c => this._form = c}
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
