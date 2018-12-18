import React from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, TextInput, AsyncStorage, ScrollView, NetInfo, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import t from 'tcomb-form-native'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//screen for entering information about sample being taken

const Form = t.form.Form;

const {height, width} = Dimensions.get('window');
   
//types of samples
const type = t.enums({
    Single: 'Single',
    Double: 'Double'
});

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
            textHeight: 36,
        };
    }
    
    //pass form info on to the next page to be reviewed
    onSubmit(inNetpass, sampleLat, sampleLong, sampleLocation, sampleID, sDate){
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
    
    //send to help screen 
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
    
    //keep track of what info is in the text boxes
    onChange(formValue){
        this.setState({formValue: formValue});
    }
    
    
    render () {
        
        var sDate = new Date();
        
        //get data from previous page
        const { navigation } = this.props;
        const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
        const sampleLat = navigation.getParam('sampleLat', 'No-Lat');
        const sampleLong = navigation.getParam('sampleLong', 'No-Long');
        const sampleLocation = navigation.getParam('sampleLocation', 'No-Location');
        //build sample id
        const sampleID = inNetpass+""+sDate.getFullYear()+"-"+(sDate.getMonth()+1)+"-"+sDate.getDate()+"-"+sDate.getHours()+"-"+sDate.getMinutes()+"-"+sDate.getSeconds();
        const object = t.enums( navigation.getParam('options'));
        
        //make sure notes are not too long
        const Notes = t.refinement(t.String, function (s) {
            return s.length<255;
        });
        
        //sample object for form
        const sample = t.struct({
            sampleType: type,
            sampleObject: object, 
            notes: t.maybe(Notes)
        });
        
        //form settings
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
                    error: 'Notes cannot exceed 255 characters',
                    multiline: true,
                    onContentSizeChange: (event) => {
                        if (event && event.nativeEvent && event.nativeEvent.contentSize) {
                            this.setState({
                                textHeight: event.nativeEvent.contentSize.height+13
                            })
                            
                        }
                        this.props.onContentSizeChange && this.props.onContentSizeChange(event)
                    },
                    stylesheet: {
                        ...Form.stylesheet,
                        textbox: {
                            ...Form.stylesheet.textbox,
                            normal: {
                                ...Form.stylesheet.textbox.normal,
                                height: this.state.textHeight,
                                width: width*0.8,

                            },
                            error: {
                                ...Form.stylesheet.textbox.error,
                                height: this.state.textHeight,
                                width: width*0.8,
                            }
                        }
                    },
                    onSubmitEditing: () => this.onSubmit(inNetpass, sampleLat, sampleLong, sampleLocation, sampleID, sDate),
                    blurOnSubmit: true,
                }
            }
        };
 
        return(
            <View style = {{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1,  }}>
            <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false} >
            
            
            <Text style={styles.infoLabel}> Location: {sampleLocation}  </Text>
            <View style={{padding: 20, alignItems: 'center'}}>
            <Form 
                type={sample}
                options= {options}
                ref={c => this._form = c}
                value={this.state.formValue}
                onChange={(formValue) => this.onChange(formValue)}
            /> 
            </View>
        
            <TouchableOpacity onPress ={() => this.onSubmit(inNetpass, sampleLat, sampleLong, sampleLocation, sampleID, sDate)}>
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
        width: width*0.8,
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
          color: 'black',
          fontSize: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 10,
          fontWeight: 'bold',
          width: width*0.8,
      },

});