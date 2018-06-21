    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Alert} from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';
    import t from 'tcomb-form-native'; 

    const Form = t.form.Form;

    const User = t.struct({
      Netpass: t.String,
      Password: t.String,

    });

    var options = {
      fields: {
        Netpass: {
          label: 'Netpass Username' // <= label for the name field
        }
      }
    };


    export default class Login extends React.Component {
        

         constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.state = {userPass: '', } 

      }
        componentDidMount() {
            AsyncStorage.multiSet([["Esteele","1234"],["Jbarr","5678"]]);

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


        _onClick(){

          const Fvalue = this._form.getValue();
            if(Fvalue){
            inNetpass = Fvalue.Netpass;
            inPass = Fvalue.Password;
            AsyncStorage.getItem(inNetpass).then((value) => {
                this.setState({"userPass": value});
            }).done();
            console.log(this.state.userPass);
            if(this.state.userPass != null){
            if(inPass == this.state.userPass){
                this.props.navigation.navigate('Home', {inNetpass})
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
             

            <Form 
                    type={User} options = {options}
                    ref={c => this._form = c}
                    onChange={this.handleInput}
                />
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

            <TouchableOpacity onPress ={() => this.props.navigation.navigate('Tracker')}>
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
