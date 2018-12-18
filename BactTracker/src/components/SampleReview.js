import React from 'react';
import { View, Text, Alert, ScrollView, TextInput, TouchableOpacity, Dimensions, StyleSheet, AsyncStorage, NetInfo, ActivityIndicator } from 'react-native';
import { createStackNavigator } from 'react-navigation';

//review previously entered samples with the option to edit notes

var {height, width} = Dimensions.get('window');

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          samples: [
              
          ],
          loading: false,
          error: null
        };
      }    

    async componentDidMount(){
        //set state with any locally stored samples
        //maybe also add in to submit any locally stored samples that need to be submitted
        this.fetchSamples();
    }

    //get samples taken by current user from db 
    async fetchSamples(){
        //triggered by refresh button
        //pull down any samples from the database from the current user
        const netInfo = await NetInfo.getConnectionInfo();
        const connection = netInfo.type;
        //check if connected to internet
        if (connection!=="none" && connection!=="unknown"){
            this.setState({loading: true, samples: []});
            try{
                    const { navigation } = this.props;
                    const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
                    let name = {name: inNetpass};
                    let req = JSON.stringify(name);
                    //http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioGetSamples.php
                    //http://ic-research.eastus.cloudapp.azure.com/~bkeith/getSamplesv2.php
                    let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioGetSamples.php',{
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: req
                    });

                    let responsejson = await response.json();
                    
                    for (let i =0; i<responsejson.length; i++){
                        let newSample = {
                              id: responsejson[i]["sample_id"],
                              user: responsejson[i]["user_id"],
                              location: responsejson[i]["location"],
                              latitude: responsejson[i]["latitude"],
                              longitude: responsejson[i]["longitude"],
                              type: responsejson[i]["type"],
                              object: responsejson[i]["object"],
                              date: responsejson[i]["sample_date"],
                              notes: responsejson[i]["notes"],
                              key: i,
                          };
                         
                         this.setState(prevState => ({ samples: [...prevState.samples, newSample]}));
                    };
                    this.setState({loading: false});
                } catch (error){
                    console.error(error);
                    this.setState({loading: false, error: error});
                }
        }
        else{
            Alert.alert("No internet connection! Please turn on mobile data or wifi and retry.")
        }
    }

  render() {
      const { navigation } = this.props;
      const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
    if(this.state.loading){
        return (
            <View style={styles.containerOuter}>
        
                <View style={styles.containerRow}>
                    <Text style={styles.title}> My Samples </Text>
                </View>
                <View style={{flex: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#003b71" />
                </View>
                <View style={styles.containerRow}>
                    <TouchableOpacity
                        onPress={() => this.fetchSamples()}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    } else {
    return (
      <View style={styles.containerOuter}>
        
        <View style={styles.containerRow}>
            <Text style={styles.title}> My Samples </Text>
        </View>
                
        <View style={{
                    flex: 8,
                    justifyContent: 'center',
                    flexDirection: 'row'
                  }}>
        
                <View style={{
                    flexDirection: 'column',
                  }} >
                    <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                    <View style={{alignItems: 'center', width: width}}>
                        {this.state.samples.map(sample => (
                            
                                <View style={{
                                        flex:1,
                                        flexDirection: 'column',
                                        paddingBottom: 20
                                        , width:width*0.8
                                      }} 
                                      key={sample.key}>

                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> Sample ID: </Text>
                                            <Text style={styles.regularText}> {sample.id} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> User: </Text>
                                            <Text style={styles.regularText}> {sample.user} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> Location: </Text>
                                            <Text style={styles.regularText}> {sample.location} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> Latitude: </Text>
                                            <Text style={styles.regularText}> {sample.latitude} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> Longitude: </Text>
                                            <Text style={styles.regularText}> {sample.longitude} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> Type: </Text>
                                            <Text style={styles.regularText}> {sample.type} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> Object: </Text>
                                            <Text style={styles.regularText}> {sample.object} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> Date: </Text>
                                            <Text style={styles.regularText}> {sample.date} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitles}> Notes: </Text>
                                            <Text style={styles.regularText}> {sample.notes} </Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Edit', {inNetpass: inNetpass, sampleLat: sample.latitude, sampleLong: sample.longitude, sampleLocation: sample.location, sampleDate: sample.date, sampleID: sample.id, sampleObject: sample.object, notes: sample.notes, sampleType: sample.type})}
                                            style={styles.button}
                                            disabled={false}
                                        >
                                            <Text style={styles.buttonText}>Edit</Text>
                                        </TouchableOpacity>
                                        </View>
                                </View>
                            

                        ))}
                    </View>
                    </ScrollView>
                </View>
            </View>
                    
            <View style={styles.containerRow}>
                <TouchableOpacity
                    onPress={() => this.fetchSamples()}
                    style={styles.button}
                    disabled={false}
                >
                    <Text style={styles.buttonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        
      </View>
    );
}
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
  button: {
    backgroundColor: '#003b71',
    width: width*0.8,
    height: 40,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 10,
      alignSelf: 'center'
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
    fontSize: 30,
    padding: 10
  },
    regularText: {
         color: '#003b71',
        //textAlign: 'center',
        //fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        flexWrap: "wrap",
        flex: 1,
        textAlign: 'right'
    },
    subtitles: {
         color: '#003b71',
        //textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    }
});