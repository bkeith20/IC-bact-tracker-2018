import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableOpacity, Dimensions, Picker, StyleSheet, BackHandler, AsyncStorage, NetInfo } from 'react-native';
import { createStackNavigator } from 'react-navigation';

var {height, width} = Dimensions.get('window');

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          samples: [
              
          ],
        };
      }    

    async componentDidMount(){
        //set state with any locally stored samples
        //maybe also add in to submit any locally stored samples that need to be submitted
    }

    async fetchSamples(){
        //triggered by refresh button
        this.setState({samples: []})
        //pull down any samples from the database from the current user
        const netInfo = await NetInfo.getConnectionInfo();
        const connection = netInfo.type;
        //check if connected to internet
        if (connection!=="none" && connection!=="unknown"){
            try{
                    const { navigation } = this.props;
                    const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
                    let name = {name: inNetpass};
                    let req = JSON.stringify(name);
                    let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioGetSamples.php',{
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: req
                    });

                    let responsejson = await response.json();
                    console.log(responsejson+" "+responsejson.length);
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
                         //console.log(responsejson[i]);
                         this.setState(prevState => ({ samples: [...prevState.samples, newSample]}));
                    };
                } catch (error){
                    console.error(error);
                }
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
            <Text style={styles.title}> My Samples </Text>
        </View>
                
        <View style={{
                    flex: 10,
                    justifyContent: 'center',
                    flexDirection: 'row'
                  }}>
            
                <View style={styles.containerCol} >
                    <Text style={styles.subtitles}> Sample ID: </Text>
                    <Text style={styles.subtitles}> User: </Text>
                    <Text style={styles.subtitles}> Location: </Text>
                    <Text style={styles.subtitles}> Latitude: </Text>
                    <Text style={styles.subtitles}> Longitude: </Text>
                    <Text style={styles.subtitles}> Type: </Text>
                    <Text style={styles.subtitles}> Object: </Text>
                    <Text style={styles.subtitles}> Date: </Text>
                    <Text style={styles.subtitles}> Notes: </Text>
                </View>
        
                <View style={{
                    flex:4,
                    flexDirection: 'column',
                    borderLeftWidth: 3,
                    borderColor: '#003b71'
                  }} >
                    <ScrollView horizontal={true}>
                        {this.state.samples.map(sample => (
                            <ScrollView key={sample.key}>
                                <View style={{
                                        flex:1,
                                        flexDirection: 'column',
                                        paddingRight: 20
                                      }} 
                                      key={sample.key}>

                                        <View style={{flexDirection: 'row'}}><Text style={styles.regularText}> {sample.id} </Text></View>
                                        <View style={{flexDirection: 'row'}}><Text style={styles.regularText}> {sample.user} </Text></View>
                                        <View style={{flexDirection: 'row'}}><Text style={styles.regularText}> {sample.location} </Text></View>
                                        <View style={{flexDirection: 'row'}}><Text style={styles.regularText}> {sample.latitude} </Text></View>
                                        <View style={{flexDirection: 'row'}}><Text style={styles.regularText}> {sample.longitude} </Text></View>
                                        <View style={{flexDirection: 'row'}}><Text style={styles.regularText}> {sample.type} </Text></View>
                                        <View style={{flexDirection: 'row'}}><Text style={styles.regularText}> {sample.object} </Text></View>
                                        <View style={{flexDirection: 'row'}}><Text style={styles.regularText}> {sample.date} </Text></View>
                                        <View style={{flexDirection: 'row', maxWidth: width}}><Text style={styles.regularText}> {sample.notes} </Text></View>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Edit', {inNetpass: inNetpass, sampleLat: sample.latitude, sampleLong: sample.longitude, sampleLocation: sample.location, sampleDate: sample.date, sampleID: sample.id, sampleObject: sample.object, notes: sample.notes, sampleType: sample.type})}
                                            style={styles.button}
                                            disabled={false}
                                        >
                                            <Text style={styles.buttonText}>Edit</Text>
                                        </TouchableOpacity>

                                </View>
                            </ScrollView>

                        ))}
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
    flex:2,
    //alignItems: 'center',
    //justifyContent: 'center',
    flexDirection: 'column'
  },
  button: {
    backgroundColor: '#003b71',
    width: 130,
    height: 40,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 10,
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