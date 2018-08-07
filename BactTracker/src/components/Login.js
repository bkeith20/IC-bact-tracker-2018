    import React from 'react';
    import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, TextInput, AsyncStorage, Alert, Dimensions, NetInfo} from 'react-native';
    import { createStackNavigator} from 'react-navigation';
    import {SecureStore} from 'expo';
    import t from 'tcomb-form-native'; 

    const Form = t.form.Form;

    const {height, width} = Dimensions.get('window');

    const User = t.struct({
      Netpass: t.String,
      RememberMe: t.Boolean,
    });

    export default class Login extends React.Component {
        constructor(props) {
        super(props);
        this.state = {defaultVal:{
                          Netpass: '',
                          RememberMe: false,
                          seenVideo: null
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
                            RememberMe: savedUser.rememberMe,
                            seenVideo: savedUser.seenVideo
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
                    onSubmitEditing: () => this._onClick(),
                    stylesheet: {
                         ...Form.stylesheet,
                                textbox: {
                                    ...Form.stylesheet.textbox,
                                    normal: {
                                        ...Form.stylesheet.textbox.normal,
                                        width: width*0.8,

                                    },
                                    error: {
                                        ...Form.stylesheet.textbox.error,
                                        width: width*0.8,
                                    }
                        }
                    }
                },
            }
        };


       async _onClick(){

          const Fvalue = this._form.getValue();
            if(Fvalue){
                try{
                    const inNetpass = Fvalue.Netpass;
                   
                    const saved = await SecureStore.getItemAsync('deviceUser');
                    
                    var savedUser = null;
                    var checkName = null;
                    
                    if(saved!=null){
                        savedUser = JSON.parse(saved);
                        checkName = savedUser.userName;
                    }
                    else{
                        checkName = null;
                    }
                        if(inNetpass===checkName){
                                if(Fvalue.RememberMe!=savedUser.rememberMe){
                                    const toSave = {
                                        userName: inNetpass,
                                        rememberMe: Fvalue.RememberMe,
                                        seenVideo: savedUser.seenVideo
                                    };
                                    const toSaveStr = JSON.stringify(toSave);
                                    await SecureStore.setItemAsync('deviceUser', toSaveStr);
                                }
                                this.props.navigation.navigate('Home', {inNetpass: inNetpass});
                        }
                        else{
                            //check database here 
                            //if not in database return "false" and show alert
                            //if in database save to 'deviceUser'
                            const netInfo = await NetInfo.getConnectionInfo();
                            const connection = netInfo.type;
                            //check if connected to internet
                            if (connection!=="none" && connection!=="unknown"){    
                                try{
                                    const finfo = this._form.getValue();
                                    const uname = finfo.Netpass;
                                    const toSendStr = JSON.stringify({uname: uname});
                                    
                                    let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioLogin.php',{
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: toSendStr,
                                    });

                                    let rJSON = await response.json();
                                    
                                    if(rJSON["pass"]!=="false"){
                                        //here
                                        const toSave = {
                                            userName: uname,
                                            rememberMe: finfo.RememberMe,
                                            seenVideo: rJSON["seen"]
                                        };
                                        const inNetpass = finfo.Netpass;
                                        const toSaveStr = JSON.stringify(toSave);
                                        await SecureStore.setItemAsync('deviceUser', toSaveStr);
                                        this.props.navigation.navigate('Home', {inNetpass: inNetpass});
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

        
          <View style={{alignItems: 'center', backgroundColor: 'white', flex: 1, padding: 10}}>
            <View style={{flex: 1,  justifyContent: 'center'}}>
                <Text style={styles.title}> IC Bact-Tracker</Text> 
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Form 
                    type={User} 
                    options = {this.options}
                    value={this.state.defaultVal}
                    ref={c => this._form = c}
                />
            </View>
            <View style={{flex: 1}}>
                <TouchableOpacity onPress ={() => this._onClick()}>
                    <View style = {styles.button}>
                        <Text style={styles.buttonText}>Log in</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </View>

        );
      }
    }
    const styles = StyleSheet.create({

      button: {
    backgroundColor: '#003b71',
    width: width*0.8,
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
     title: {
    //color: 'white',
    color: '#003b71',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 42,
    width: width*0.8,
    padding: 10
  }  

    });
