    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Dimensions } from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';

    import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
    

    var {height, width} = Dimensions.get('window');

    export default class tracker extends React.Component {

        constructor(props) {
        super(props);

        this.state = {
          latitude: 1,
          longitude: 1,
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


        render() {
            const { region } = this.props;

        return (
            
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
                />
            ))}
            
            </MapView>
          </View>
        
        );
      }
    }

    const styles = StyleSheet.create({
        
        container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        margin: 5,
      },
      
        map: {
        ...StyleSheet.absoluteFillObject,
      },
        mapContainer: {
            ...StyleSheet.absoluteFillObject,
        height: height-60,
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
        }

    });