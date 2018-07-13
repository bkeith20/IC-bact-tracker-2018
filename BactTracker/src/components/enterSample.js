import React from 'react';
import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, ScrollView, NetInfo} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import t from 'tcomb-form-native'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const Form = t.form.Form;
    
const type = t.enums({
    Single: 'Single',
    Double: 'Double'
});

var sDate = new Date();

var options = {
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
        }
    }
};

export default class enterSample extends React.Component{
    //object will be an empty object {} and will be set in componentDidMount()
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            formValue: {
                sampleType: 'Single',
                sampleObject: null,
                notes: ''
            },
            object: {
                
            }
        };
    }
    
    onSubmit(inNetpass, sampleLat, sampleLong, sampleLocation, sampleID){
    
        const Fvalue = this._form.getValue();
        if(Fvalue){
            var formInfo = {
                Location: sampleLocation,
                SampleID: sampleID,
                SampleType : Fvalue.sampleType,
                SampleNotes: Fvalue.notes,
                SampleObject: Fvalue.sampleObject,
                User: inNetpass,
                SampleDate: sDate.getFullYear()+"-"+(sDate.getMonth()+1)+"-"+sDate.getDate()+" "+sDate.getHours()+":"+sDate.getMinutes()+":"+sDate.getSeconds(),
                Latitude: sampleLat,
                Longitude: sampleLong
            }
            this.props.navigation.navigate('Confirmation', {fInfo: formInfo, inNetpass: inNetpass});
        }
    }
    
    async help(){
        const netInfo = await NetInfo.getConnectionInfo();
        const connection = netInfo.type;
        //check if connected to internet
        if (connection!=="none" && connection!=="unknown"){
            this.props.navigation.navigate('Help');
        }
        else{
            Alert.alert("No internet connection! Please turn on mobile data or wifi and retry.")
        }
    }

    
    
    render () {
        
        const { navigation } = this.props;
        const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
        const sampleLat = navigation.getParam('sampleLat', 'No-Lat');
        const sampleLong = navigation.getParam('sampleLong', 'No-Long');
        const sampleLocation = navigation.getParam('sampleLocation', 'No-Location');
        const sampleID = inNetpass+""+sDate.getFullYear()+"-"+(sDate.getMonth()+1)+"-"+sDate.getDate()+"-"+sDate.getHours()+"-"+sDate.getMinutes()+"-"+sDate.getSeconds();
        const object = t.enums( navigation.getParam('options'));
        console.log(object);
        
        const Notes = t.refinement(t.String, function (s) {
            return s.length<255;
        });
        
        const sample = t.struct({
            sampleType: type,
            sampleObject: object, 
            notes: t.maybe(Notes)
        });
 
        return(
            <View style = {{justifyContent: 'center', backgroundColor: 'white', flex: 1,  }}>
            <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false} >
            
            <Text style={styles.infoLabel}> Sample ID: {sampleID}</Text>
            <Text style={styles.infoLabel}> Location: {sampleLocation}  </Text>
            <View style={{padding: 20}}>
            <Form 
                type={sample}
                options= {options}
                ref={c => this._form = c}
                value={this.state.formValue}
                onChange={(formValue) => this.setState({formValue})}
            /> 
            </View>
        
            <TouchableOpacity onPress ={() => this.onSubmit(inNetpass, sampleLat, sampleLong, sampleLocation, sampleID)}>
                <View style = {styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </View>
            </TouchableOpacity>
            
                <TouchableOpacity
                        onPress={() => this.help()}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>HELP</Text>
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