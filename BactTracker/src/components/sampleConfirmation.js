import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, TouchableOpacity, AsyncStorage, NetInfo } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class ConfirmScreen extends React.Component {
    static navigationOptions = {
        title: 'Confirmation',
    };
    
    onSubmit(myID, info){
        
        Alert.alert(
            'Please be sure to write the sample ID on your sample tube!',
            'Sample ID: '+myID,
            [
                {text: 'OK', onPress: () => this.alertPress(info)},
                {text: 'Cancel', style: 'cancel'},
            ],
        );
    };
            
    // possibly change so that final sample id is sent back from the DB to make sure it is different from any others already saved
    async alertPress(info){
            //send info to DB
            const netInfo = await NetInfo.getConnectionInfo();
            const connection = netInfo.type;
            //check if connected to internet
            if (connection!=="none" && connection!=="unknown"){
                //if connected send sample to DB
                try{
                    const sample = info;
                    const sampleStr = JSON.stringify(sample);
                   
                    let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioDB4.php',{
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: sampleStr,
                    });
                    
                    let rJSON = await response.json();
                    
                }catch(error) {
                    console.log(error);
                }
                let numSaved = await AsyncStorage.getItem('numSavedSamples');
                numsaved = numSaved*1;
                if(numSaved!==null && numSaved>0){
                    for (i = 0; i < numSaved; i++){
                        try{
                            let currSample = await AsyncStorage.getItem('savedSample'+i);
                            let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioDB4.php', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: currSample,
                            });
                            
                            let rJSON = await response.json();
                            
                        } catch(error){
                            console.log(error);
                        }
                    }
                    Alert.alert(numSaved+"Locally stored samples have been submitted successfully!");
                    numSaved = 0;
                    await AsyncStorage.setItem('numSavedSamples', numSaved.toString());
                }
            }
            else{
                //if not connected save locally to be sent later
                
                const sampleStr = JSON.stringify(info);
                
                let numSaved = await AsyncStorage.getItem('numSavedSamples');
                if(numSaved===null){
                    numsaved=0;
                }
                numsaved = numSaved*1;
                await AsyncStorage.setItem('savedSample'+numsaved,sampleStr);
                numSaved+=1;
                await AsyncStorage.setItem('numSavedSamples', numSaved.toString());
                Alert.alert("No Connection! Sample stored locally!", "Connect to internet and open main menu to submit! You will recieve another notification once submitted.");
            }
            this.props.navigation.navigate('Home', {inNetpass: info.User});
        } 
    
  render() {
      
    const { navigation } = this.props;
    const formInfo = navigation.getParam('fInfo', 'NO-ID');
    const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
      
    return (
        
        <View style={styles.containerOuter}>
        
        <View style={styles.Scroll}>
        
        <ScrollView showsVerticalScrollIndicator={false} >
        
            <View style={styles.containerRow}>
                <Text style={styles.title}> Please review the entered information for any errors. </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Sample ID: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.SampleID} </Text>
            </View>
        
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Date: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.SampleDate} </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Location: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.Location} </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Type: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.SampleType} </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Object: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.SampleObject} </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Username: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.User} </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Latitude: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.Latitude} </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Longitude: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.Longitude} </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Notes: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.SampleNotes} </Text>
            </View>
        
            </ScrollView>
        
            </View>
        
            <View style={styles.containerRow}>
                <View style={styles.containerCol}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
        
                <View style={styles.containerCol}>
                    <TouchableOpacity
                        onPress={() => this.onSubmit(formInfo.SampleID, formInfo)}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>        
                </View>
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
    backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    //alignItems: 'center',
    //justifyContent: 'center',
    flexDirection: 'row',
    //padding: 10
  },
  containerCol: {
    backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
      //padding: 20
  },
  button: {
    backgroundColor: '#003b71',
    width: 130,
    height: 40,
    //padding: 30,
    borderRadius: 8,
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
    //textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10
  },
  info: {
    color: '#003b71',
    fontSize: 20,
    //textAlign: 'center',
    paddingLeft: 30,
    paddingBottom: 10,
    paddingRight: 10
  },
  buttonWrapper: {
    padding: 10
  },
  infoLabel :{
    color: '#003b71',
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    fontWeight: 'bold',
  },
  Scroll: {
      //backgroundColor: 'rgba(0,0,0,0)',
    flex:5,
    //alignItems: 'center',
    //justifyContent: 'center',
    flexDirection: 'row',
    //padding: 10
  }
});