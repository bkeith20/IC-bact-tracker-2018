   import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Dimensions } from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';

    import MapView, {PROVIDER_GOOGLE, Overlay} from 'react-native-maps';
    

    var {height, width} = Dimensions.get('window');

    export default class tracker extends React.Component {

        constructor(props) {
        super(props);

        this.state = {
          latitude: 1,
          longitude: 1,
            opacityM: 1,
            mapImage: 'https://thewhole94.files.wordpress.com/2015/03/russell-westbrook-heatmap.png',
            markers: [
              {title: 'Williams',
               coordinates: {
                   latitude : 42.422691,
                   longitude : -76.495041
               },
               key: 0,
              },
              {title: 'Campus Center',
               coordinates: {
                   latitude : 42.422115,
                   longitude : -76.494273
               },
               key: 1,   
              },
              {title: 'Athletics and Events Center',
               coordinates: {
                   latitude : 42.4238877,
                   longitude : -76.4905826
               },
               key: 2,   
              },
            ],
        };
      }

        componentDidMount() {
        navigator.geolocation.getCurrentPosition(
           (position) => {

             this.setState({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
             });
           },
         );
       }
            
        toggleOpacity(){
            if(this.state.opacityM>0){
                this.setState({opacityM: 0});
            }
            else{
                this.setState({opacityM: 1});
            }
        }
            
        toggleMap(){
            if(this.state.mapImage==='https://thewhole94.files.wordpress.com/2015/03/russell-westbrook-heatmap.png'){
                this.setState({mapImage: 'https://thewhole94.files.wordpress.com/2015/03/steph-curry-heatmap.png'});
            }
            else{
                this.setState({mapImage: 'https://thewhole94.files.wordpress.com/2015/03/russell-westbrook-heatmap.png'});
            }
        }


        render() {
            const { region } = this.props;

        return (
            <View>
                <View style ={styles.mapContainer}>
                    <MapView
                          provider={PROVIDER_GOOGLE}
                          style={styles.map}
                          region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                          }}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        maxZoomLevel = {20}
                        minZoomLevel = {15}
                    >

                        {this.state.markers.map(marker => (
                            <MapView.Marker 
                                coordinate={marker.coordinates}
                                title={marker.title}
                                key={marker.key}
                                opacity={this.state.opacityM}
                            />
                        ))}

                        <Overlay image={{uri: this.state.mapImage}} 
                            bounds={[[42.425691, -76.498041],
                                    [42.419115, -76.491273]]}
                        />

                    </MapView>
              </View>
                <View style={{height: height-(height*0.4), width: width,}}>
                        
                </View>
                        
                <View style={styles.container}>
                        <TouchableOpacity
                        onPress={() => this.toggleOpacity()}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Toggle Markers</Text>
                    </TouchableOpacity> 
                        
                    <TouchableOpacity
                        onPress={() => this.toggleMap()}
                        style={styles.button}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Toggle Map Image</Text>
                    </TouchableOpacity> 
                </View>
            </View>
        );
      }
    }

    const styles = StyleSheet.create({
        
        container: {
        //flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#ecf0f1',
        margin: 5,
      },
      
        map: {
        ...StyleSheet.absoluteFillObject,
      },
        mapContainer: {
            ...StyleSheet.absoluteFillObject,
        height: height-(height*0.4),
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
        },
        button: {
            backgroundColor: '#003b71',
            width: 150,
            height: 40,
            borderRadius: 8,
            marginBottom: 10,
        },
          buttonText: {
            alignSelf: 'center',
            color: 'white',
            fontWeight: 'bold',
            padding: 10,
          },

    });