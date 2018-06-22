    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, ScrollView} from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';
    import t from 'tcomb-form-native'; 

    const Form = t.form.Form;
    
    const type = t.enums({
        Single: 'Single',
        Double: 'Double'
    });

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
                label: "Additional Notes"
            }
        }
};

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
                      sampleID :this.props.navigation.state.params.inNetpass+""+sDate.getFullYear()+""+(sDate.getMonth()+1)+""+sDate.getDate()+""+sDate.getHours()+""+sDate.getMinutes()+""+sDate.getSeconds(),
                      object: {
                          Handrail: 'Handrail',
                          DoorHandle: 'Door Handle',
                          DoorPushPlate: 'Door Push Plate',
                      },
                     }
    }
    componentDidMount(){
         AsyncStorage.getItem("clickedLocation").then((value) => {
                this.setState({"location": value});
            }).done();
        //read in options for sample object from DB
    }
    
    
    onSubmit(){
    
        const Fvalue = this._form.getValue();
        if(Fvalue){
            var loc = this.state.location;
            var formInfo = {
                Location: this.state.location,
                SampleID: this.state.sampleID,
                SampleType : Fvalue.sampleType,
                SampleNotes: Fvalue.notes,
                SampleObject: Fvalue.sampleObject,
                User: inNetpass,
                SampleDate: (sDate.getMonth()+1)+"/"+sDate.getDate()+"/"+sDate.getFullYear()+" "+sDate.getHours+":"+sDate.getMinutes+"."+sDate.getSeconds,
            }
            this.props.navigation.navigate('Confirmation', {fInfo: formInfo});
        }
    }

    
    
    render () {
        return(
            <View style = {{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', flex: 1,  }}>
            <ScrollView>
            
            <Text style={styles.infoLabel}> Sample ID: {this.state.sampleID}</Text>
            <Text style={styles.infoLabel}> Location: {this.state.location}  </Text>
            <View style={{ height: 30, backgroundColor: 'white'}} />
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
            
        
            <TouchableOpacity onPress ={this.onSubmit}>
                <View style = {styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </View>
            </TouchableOpacity>
            
        
            </ScrollView>
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
        height: 40
      },

      buttonText: {
        padding: 10,
        color: 'white',
        fontWeight: 'bold'
      },
      infoLabel :{
          color: '#003b71',
          fontSize: 20,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          fontWeight: 'bold',
      },

    });