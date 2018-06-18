import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class ConfirmScreen extends React.Component {
    static navigationOptions = {
        title: 'Confirmation',
    };
    
    onSubmit(myID){
        console.log(myID);
        Alert.alert(
            'Please be sure to write the sample ID on your sample tube!',
            'Sample ID: '+myID,
            [
                {text: 'OK', onPress: () => this.alertPress()},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
        );
    };
            
    async alertPress(){
            //send info to DB
            this.props.navigation.navigate('Tracker');
        } 
    
  render() {
      
    const { navigation } = this.props;
    const formInfo = navigation.getParam('fInfo', 'NO-ID');
      
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
                <Text style={styles.infoLabel}> User initials: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> {formInfo.User} </Text>
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
                        onPress={() => this.onSubmit(formInfo.SampleID)}
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