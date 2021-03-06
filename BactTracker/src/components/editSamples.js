import React from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, TextInput, AsyncStorage, ScrollView, NetInfo, Alert} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import t from 'tcomb-form-native'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//form for editing previously taken samples

const Form = t.form.Form;

export default class enterSample extends React.Component{
    //object will be an empty object {} and will be set in componentDidMount()
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            formValue: {
                notes: ''
            },
            textHeight: 36
        };
    }
    
    //submit new info
    async onSubmit(inNetpass, sampleLat, sampleLong, sampleLocation, sampleID, sampleType, sampleObject, sampleDate, sampleNotes){
        const netInfo = await NetInfo.getConnectionInfo();
        const connection = netInfo.type;
        //check if connected to internet
        if (connection!=="none" && connection!=="unknown"){
            
            try{
                const Fvalue = this._form.getValue();
                if(Fvalue){
                    if(sampleNotes!==Fvalue.notes){
                        var formInfo = {
                            Location: sampleLocation,
                            SampleID: sampleID,
                            SampleType : sampleType,
                            SampleNotes: Fvalue.notes,
                            SampleObject: sampleObject,
                            User: inNetpass,
                            SampleDate: sampleDate,
                            Latitude: sampleLat,
                            Longitude: sampleLong
                        };
                        const tosend = JSON.stringify(formInfo);
                        //http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioSampleEdit.php
                        //http://ic-research.eastus.cloudapp.azure.com/~bkeith/sampleEditv2.php
                        let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioSampleEdit.php', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: tosend,
                        });
                        console.log(response);
                        //let rJSON = await response.json();
                        //console.log(rJSON);
                        Alert.alert("Changes saved!");
                        this.props.navigation.navigate('SampleReview', {inNetpass: inNetpass})
                    }else{
                        Alert.alert("No changes made!")
                    }
                }
            } catch(error){
                console.log(error);
            }
        } else{
            Alert.alert("No internet connection!", "Please check internet connection and try again.");
        }
    }
    
    componentDidMount(){
        const { navigation } = this.props;
        const oldNotes = navigation.getParam('notes', 'NO-ID');
        const defaultVal = {notes: oldNotes}; 
        this.setState({formValue: defaultVal});
    }
    
    //keep track of values in text boxes
    onChange(formValue){
        this.setState({formValue: formValue,
                      //textHeight: (formValue.notes.height+10)
                      })
    }
    
    
    render () {
        
        //get the info from the previous screen
        const { navigation } = this.props;
        const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
        const sampleLat = navigation.getParam('sampleLat', 'No-Lat');
        const sampleLong = navigation.getParam('sampleLong', 'No-Long');
        const sampleLocation = navigation.getParam('sampleLocation', 'No-Location');
        const sampleID = navigation.getParam('sampleID', 'NO-ID');
        const sampleType = navigation.getParam('sampleType', 'NO-ID');
        sampleDate = navigation.getParam('sampleDate', 'NO-ID')
        const sampleObject = navigation.getParam('sampleObject', 'NO-ID');
        const oldNotes = navigation.getParam('notes', 'NO-ID');
        const Notes = t.refinement(t.String, function (s) {
            return s.length<255;
        });
        
        const sample = t.struct({ 
            notes: Notes
        });
        
        var options = {
            auto: 'placeholders',
            fields: {
                notes: {
                    label: "Additional Notes",
                            error: 'Notes cannot exceed 255 characters',
                            multiline: true,
                            onContentSizeChange: (event) => {
                                if (event && event.nativeEvent && event.nativeEvent.contentSize) {
                                    this.setState({
                                        textHeight: event.nativeEvent.contentSize.height+13
                                    })
                                    console.log(event.nativeEvent.contentSize.height);
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

                                    },
                                    error: {
                                        ...Form.stylesheet.textbox.error,
                                        height: this.state.textHeight
                                    }
                                }
                            },
                }
            }
        };
 
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
                onChange={(formValue) => this.onChange(formValue)}
            /> 
            </View>
        
            <TouchableOpacity onPress ={() => this.onSubmit(inNetpass, sampleLat, sampleLong, sampleLocation, sampleID, sampleType, oldNotes)}>
                <View style = {styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
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