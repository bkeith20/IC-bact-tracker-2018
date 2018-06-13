    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, ScrollView} from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';
    import t from 'tcomb-form-native'; 

    const Form = t.form.Form;
    
    var type = t.enums({
        Single: 'Single',
        Double: 'Double'
    });
    
    const sample = t.struct({
      sampleType: type,
   

    });

    var options = {
        auto: 'placeholders',
        fields: {
            sampleType: {
                label: "Sample Type"
    }
 }
};

var sDate = new Date();

export default class enterSample extends React.Component{
    
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {location : "", sampleID :this.props.navigation.state.params.inNetpass+""+sDate.getMonth()+""+sDate.getHours()+""+sDate.getSeconds(),}
    }
    componentDidMount(){
         AsyncStorage.getItem("clickedLocation").then((value) => {
                this.setState({"location": value});
            }).done();
    }
    
    
    onSubmit(){
    
        const Fvalue = this._form.getValue();
        if(Fvalue){
            var loc = this.state.location;
            var formInfo = {
                Location: this.state.location,
                SampleID: this.state.sampleID,
                SampleType : Fvalue.sampleType,
            }
            this.props.navigation.navigate('Confirmation', {fInfo: formInfo});
        }
    }

    
    
    render () {
        return(
            <ScrollView>
            <View style = {{alignItems: 'center', backgroundColor: 'powderblue', flex: 1,  }}>
            <Text style={styles.buttonText}> Location: {this.state.location}  </Text>
            <Text style={styles.buttonText}> Sample ID: {this.state.sampleID}</Text>
            <Form 
                type={sample} options= {options}
                ref={c => this._form = c}
                
                
            /> 
            
        
            <TouchableOpacity onPress ={this.onSubmit}>
        <View style = {styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
        </View>
        </TouchableOpacity>
            
        </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
      button: {
        marginBottom: 30,
        width: 250,
        alignItems: 'center',
        backgroundColor: '#191970'
      },

      buttonText: {
        padding: 20,
        color: 'white'
      },

    });