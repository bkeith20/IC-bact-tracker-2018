import React from 'react';
import { View, Text, Image, Button, Alert, ScrollView, TextInput, TouchableOpacity, Dimensions, Picker, StyleSheet, BackHandler, AsyncStorage, NetInfo } from 'react-native';
import { createStackNavigator } from 'react-navigation';

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
                    flex: 7,
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
                    flex:2,
                    flexDirection: 'column',
                    borderLeftWidth: 3,
                    borderColor: '#003b71'
                  }} >
                    <ScrollView horizontal={true}>
                        {this.state.samples.map(sample => (

                                <View style={{
                                        flex:1,
                                        flexDirection: 'column',
                                        paddingRight: 40
                                      }} 
                                      key={sample.key}>
                                    <Text style={styles.regularText}> {sample.id} </Text>
                                    <Text style={styles.regularText}> {sample.user} </Text>
                                    <Text style={styles.regularText}> {sample.location} </Text>
                                    <Text style={styles.regularText}> {sample.latitude} </Text>
                                    <Text style={styles.regularText}> {sample.longitude} </Text>
                                    <Text style={styles.regularText}> {sample.type} </Text>
                                    <Text style={styles.regularText}> {sample.object} </Text>
                                    <Text style={styles.regularText}> {sample.date} </Text>
                                    <Text style={styles.regularText}> {sample.notes} </Text>
                                    <TouchableOpacity
                                        onPress={() => Alert.alert("This will allow editing")}
                                        style={styles.button}
                                        disabled={false}
                                    >
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>

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
    flex:1,
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
        paddingTop: 12,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    subtitles: {
         color: '#003b71',
        //textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 10
    }
});