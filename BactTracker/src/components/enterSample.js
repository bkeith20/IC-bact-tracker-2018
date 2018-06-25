import React from 'react';
import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, ScrollView} from 'react-native';
import { createStackNavigator, TabNavigator} from 'react-navigation';
import t from 'tcomb-form-native'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

    const Form = t.form.Form;
    
    const type = t.enums({
        Single: 'Single',
        Double: 'Double'
    });

const val = {
    sampleType: 'Single',
    
};

var sDate = new Date();

export default class enterSample extends React.Component{
    //object will be an empty object {} and will be set in componentDidMount()
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {location : "", 
                      sampleID :this.props.navigation.state.params.inNetpass+""+sDate.getFullYear()+"-"+(sDate.getMonth()+1)+"-"+sDate.getDate()+"-"+sDate.getHours()+"-"+sDate.getMinutes()+"-"+sDate.getSeconds(),
                      object: {},
                      }
    }
    
    component 
    
   async componentDidMount(){
        await AsyncStorage.getItem("clickedLocation").then((value) => {
                this.setState({"location": value});
            });
       console.log('did mount');
        //read in options for sample object from DB
        console.log(this.state.location);
        if(this.state.location==='Williams 305'){
            this.setState({object: {
                KeyBoard: 'Keyboard',
                DoorHandle: 'Door Handle',
                WhiteBoard: 'White Board'
            }})
        }
       else{
           this.setState({object: {
                HandRail: 'Hand rail',
                DoorHandle: 'Door Handle',
                DoorPushPlate: 'Door Push Plate'
            }})
       }
    }
    
    
    
    
    onSubmit(inNetpass){
    
        const Fvalue = this._form.getValue();
        if(Fvalue){
            var formInfo = {
                Location: this.state.location,
                SampleID: this.state.sampleID,
                SampleType : Fvalue.sampleType,
                SampleNotes: Fvalue.notes,
                SampleObject: Fvalue.sampleObject,
                User: inNetpass,
                SampleDate: (sDate.getMonth()+1)+"/"+sDate.getDate()+"/"+sDate.getFullYear()+" "+sDate.getHours()+":"+sDate.getMinutes()+"."+sDate.getSeconds(),
                Latitude: sampleLat,
                Longitude: sampleLong
            }
            this.props.navigation.navigate('Confirmation', {fInfo: formInfo, inNetpass: inNetpass});
        }
    }

    
    
    render () {
        
        const { navigation } = this.props;
        const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
        const sampleLat = navigation.getParam('samplelat', 'No-Lat');
        const sampleLong = navigation.getParam('sampleLong', 'No-Long');
        
        const options = {
                          auto: 'placeholders',
                          fields: {
                              sampleType: {
                                  label: "Sample Type",
                              },
                              sampleObject: {
                                  label: "Object Sampled"
                              },
                              notes: {
                                  label: "Additional Notes",
                                  onSubmitEditing: () => this.onSubmit(inNetpass),
                              }
                              }
                          };
        
        return(
            <View style = {{justifyContent: 'center', backgroundColor: 'white', flex: 1,  }}>
            <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false} >
            
            <Text style={styles.infoLabel}> Sample ID: {this.state.sampleID}</Text>
            <Text style={styles.infoLabel}> Location: {this.state.location}  </Text>
            <View style={{padding: 20}}>
            <Form 
                type={t.struct({
                    sampleType: type,
                    sampleObject: t.enums(this.state.object), 
                    notes: t.maybe(t.String)
                })}
                options= {options}
                ref={c => this._form = c}
                value={val}
                
                
            /> 
            </View>
        
            <TouchableOpacity onPress ={() => this.onSubmit(inNetpass)}>
                <View style = {styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </View>
            </TouchableOpacity>
            
        
            </KeyboardAwareScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
      button: {
        marginBottom: 30,
        width: 250,
        alignItems: 'center',
        backgroundColor: '#003b71',
        borderRadius: 8,
        height: 40,
        alignSelf: 'center'
      },

      buttonText: {
        padding: 10,
        color: 'white',
        fontWeight: 'bold'
      },
      infoLabel :{
          color: '#003b71',
          fontSize: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 10,
          fontWeight: 'bold',
          alignSelf: 'center'
      },

    });