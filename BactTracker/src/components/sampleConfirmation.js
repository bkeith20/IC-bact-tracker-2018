import React from 'react';
import { View, Text, Button, Alert, ScrollView, TextInput, Dimensions, StyleSheet, TouchableOpacity, AsyncStorage, NetInfo } from 'react-native';
import { createStackNavigator } from 'react-navigation';

//confrimation screen to check data and submit sample

const {height, width} = Dimensions.get('window');

export default class ConfirmScreen extends React.Component {
    static navigationOptions = {
        title: 'Confirmation',
    };
    
    async onSubmit(myID, info){
        
        //send sample info to DB
            var sID = null;
            const netInfo = await NetInfo.getConnectionInfo();
            const connection = netInfo.type;
            //check if connected to internet
            if (connection!=="none" && connection!=="unknown"){
                //if connected send sample to DB
                try{
                    const sample = info;
                    info.saved = "false";
                    const sampleStr = JSON.stringify(sample);
                    //http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioDB4.php
                    //http://ic-research.eastus.cloudapp.azure.com/~bkeith/enterSamplev2.php
                    let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioDB4.php',{
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: sampleStr,
                    });
                    let rJSON = await response.json();
                    sID = rJSON.id;
                    
                }catch(error) {
                    console.log(error);
                }
                
                //check if any samples are saved locally that need to be submitted and attempt to submit them
                let numSaved = await AsyncStorage.getItem('numSavedSamples');
                numsaved = numSaved*1;
                if(numSaved!==null && numSaved>0){
                    try{
                        for (i = (numSaved-1); i > -1; i--){
                            let currSample = await AsyncStorage.getItem('savedSample'+i);
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
                    Alert.alert(numSaved+"Locally stored samples have been submitted successfully!");
                    numSaved = 0;
                    await AsyncStorage.setItem('numSavedSamples', numSaved.toString());
                }
            }
            else{
                //if not connected save locally to be sent later                
                let numSaved = await AsyncStorage.getItem('numSavedSamples');
                if(numSaved===null){
                    numsaved=0;
                }
                numsaved = numSaved*1;
                sID = myID.concat("saved"+numSaved);
                info.SampleID = sID;
                info.saved = "true";
                const sampleStr = JSON.stringify(info);
                await AsyncStorage.setItem('savedSample'+numsaved,sampleStr);
                numSaved+=1;
                await AsyncStorage.setItem('numSavedSamples', numSaved.toString());
                Alert.alert("No Connection! Sample stored locally!", "Connect to internet and open main menu to submit! You will recieve another notification once submitted.");
            }
        
        Alert.alert(
            'Please be sure to write the sample ID on your sample tube!',
            'Sample ID: '+sID,
            [
                {text: 'OK', onPress: () => this.alertPress(info)},

            ],
        );
    };
            
    async alertPress(info){
            
            this.props.navigation.navigate('Home', {inNetpass: info.User});
        } 
    
  render() {
      
    const { navigation } = this.props;
    const formInfo = navigation.getParam('fInfo', 'NO-ID');
    const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
      
    return (
        
        <View style={styles.containerOuter}>
        
        <View style={styles.Scroll}>
        
        <ScrollView contentContainerStyle={{alignItems: 'center'}} >
        
        <View style={{width: width*0.8}} >
            <View style={styles.containerRow}>
                <Text style={styles.title}> Please review the entered information for any errors. </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Sample ID: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> Submit to view your sample ID! </Text>
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
        </View>
        
        </ScrollView>
        
        </View>
        
                <View style={styles.containerRowB}>
                    <TouchableOpacity
                        onPress={() => this.onSubmit(formInfo.SampleID, formInfo)}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>        
                </View>
        
                <View style={styles.containerRowB}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
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
    flexDirection: 'column',
  },
  containerRow: {
    backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    flexDirection: 'row',
    width: width*0.8
  },
    containerRowB: {
    backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: width*0.8
  },
  containerCol: {
    backgroundColor: 'rgba(0,0,0,0)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  button: {
    backgroundColor: '#003b71',
    width: width*0.8,
    height: 40,
    borderRadius: 8,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
  info: {
    color: 'black',
    fontSize: 20,
    paddingLeft: 30,
    paddingBottom: 10,
    paddingRight: 10,
      width: width*0.8
  },
  buttonWrapper: {
    padding: 10
  },
  infoLabel :{
    color: 'black',
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    fontWeight: 'bold',
  },
  Scroll: {
    flex:5,
    flexDirection: 'row',
      //width: width*0.8
  }
});