import React from 'react';
import { View, Text, Alert, TouchableOpacity, Dimensions, StyleSheet, AsyncStorage, NetInfo } from 'react-native';
import { createStackNavigator } from 'react-navigation';

const {height, width} = Dimensions.get('window');

export default class HomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{paddingLeft: 10}}
                >
                    <Text style={{fontWeight: 'bold', color: 'white', padding: 10, fontSize: 16, borderColor: 'white', borderRadius: 8, borderWidth: 1 }}>Logout</Text>
                </TouchableOpacity>
            ),
        };
    };

    async componentDidMount(){
        const netInfo = await NetInfo.getConnectionInfo();
        const connection = netInfo.type;
        //check if connected to internet
        if (connection!=="none" && connection!=="unknown"){
            let numSaved = await AsyncStorage.getItem('numSavedSamples');
            numsaved = numSaved*1;
            if(numSaved!==null && numSaved>0){
                try{
                    for (i = (numSaved-1); i > -1; i--){
                    
                        let currSample = await AsyncStorage.getItem('savedSample'+i);
                        await AsyncStorage.removeItem('savedSample'+i);
                        //http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioDB4.php
                        let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/enterSamplev2.php', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: currSample,
                        });
                        
                        let rJSON = await response.json();
                        numSaved--;
                    
                    }
                } catch(error){
                    console.log(error);
                    await AsyncStorage.setItem('numSavedSamples', numSaved.toString());
                    return;
                }
                numsaved = 0;
                await AsyncStorage.setItem('numSavedSamples', numsaved.toString());
                Alert.alert("Locally stored samples have been submitted successfully!");
            }
        }
    }

    async help(){
        const netInfo = await NetInfo.getConnectionInfo();
        const connection = netInfo.type;
        //check if connected to internet
        if (connection!=="none" && connection!=="unknown"){
            const { navigation } = this.props;
            const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
            this.props.navigation.navigate('Help', {inNetpass: inNetpass});
        }
        else{
            Alert.alert("No internet connection! Please turn on mobile data or wifi and retry.")
        }
    }

    async view(){
        const netInfo = await NetInfo.getConnectionInfo();
        const connection = netInfo.type;
        //check if connected to internet
        if (connection!=="none" && connection!=="unknown"){
            this.props.navigation.navigate('Viewer');
        }
        else{
            Alert.alert("No internet connection! Please turn on mobile data or wifi and retry.")
        }
    }

  render() {
      const { navigation } = this.props;
      const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
    return (
      <View style={styles.containerOuter}>
        
            <View style={styles.containerRow}>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.title}> Welcome to the Bact-Tracker!</Text>
            </View>
        
            <View style={styles.containerRow}>
            </View>
        
            <View style={styles.containerRow}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Tracker', {inNetpass: inNetpass})}
                    style={styles.button}
                    disabled={false}
                >
                    <Text style={styles.buttonText}>BACT-TRACKER</Text>
                </TouchableOpacity>        
             </View>    
        
            <View style={styles.containerRow}>
                <TouchableOpacity
                    onPress={() => this.view()}
                    style={styles.button}
                    disabled={false}
                >
                    <Text style={styles.buttonText}>BACT-VIEWER</Text>
                </TouchableOpacity>
            </View>
        
                        
            <View style={styles.containerRow}>
                <TouchableOpacity
                        onPress={() => this.help()}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>HELP</Text>
                    </TouchableOpacity> 
            </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerOuter: {
    backgroundColor: 'white',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  containerRow: {
    //backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  containerCol: {
    //backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
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
    padding: 10
  }
});
