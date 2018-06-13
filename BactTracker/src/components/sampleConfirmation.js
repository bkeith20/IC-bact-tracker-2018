import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableHighlight, Dimensions, Picker, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class ConfirmScreen extends React.Component {
    static navigationOptions = {
        title: 'Confirmation',
    };
  render() {
      
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
                <Text style={styles.info}> sampleID </Text>
            </View>
        
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Date: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> sampleDate </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Location: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> location </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Campus Area: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> building </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> User: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> user name </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> User initials: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> UI </Text>
            </View>
        
            <View style={styles.containerRow}>
                <Text style={styles.infoLabel}> Notes: </Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.info}> Here will be the user's notes about the sample. this has to be longer to check that if the user enters a lot of info ion the notes it ill not make the data go off of the page, but i suspect it will. Might have to use a scrollview. </Text>
            </View>
        
            </ScrollView>
        
            </View>
        
            <View style={styles.containerRow}>
                <View style={styles.containerCol}>
                    <TouchableOpacity
                        onPress={() => Alert.alert("You have pressed cancel!")}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
        
                <View style={styles.containerCol}>
                    <TouchableOpacity
                        onPress={() => Alert.alert("You have pressed submit!")}
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
    //padding: 30
    
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