    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Dimensions } from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';

    import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
    import {
      MenuProvider,
      Menu,
      MenuOptions,
      MenuOption,
      MenuTrigger,
        withMenuProvider,
    } from 'react-native-popup-menu';

var {height, width} = Dimensions.get('window');
    
    var descripton = "";

    export default class tracker extends React.Component {

        constructor(props) {
        super(props);

        this.state = {
          latitude: 1,
          longitude: 1,
          descriptionToDisplay: "",
          markers: [
              {title: 'Williams',
               coordinates: {
                   latitude : 42.422691,
                   longitude : -76.495041
               },
               samplesLeft: 1,
               pinColor: "rgb(249, 31, 2)",
               key: 0,
              },
              {title: 'Campus Center',
               coordinates: {
                   latitude : 42.422115,
                   longitude : -76.494273,
               },
               samplesLeft: 5,
               pinColor: "rgb(249, 166, 1)",
               key: 1,
              },
              {title: 'Bookstore',
               coordinates: {
                   latitude : 42.422310,
                   longitude : -76.494984
               },
               samplesLeft: 1,
               pinColor: "rgb(0, 0, 0)",
               key: 2,
              },
              {title: 'Williams 305',
               coordinates: {
                   latitude : 42.422545,
                   longitude : -76.495117,
               },
               samplesLeft: 2,
               pinColor: "rgb(249, 166, 1)",
               key: 3,
              },
          ],
        };
      }

        async componentDidMount() {
        navigator.geolocation.getCurrentPosition(
           (position) => {
            
             this.setState({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
                
             });
           },
            

         );
            //read sample locations for markers in from DB write them into state
       }



         openMenu(areaCoordinates, numSamples, area) {
             this.componentDidMount();
             var latD = Math.abs(areaCoordinates.latitude - this.state.latitude);
             var lonD = Math.abs(areaCoordinates.longitude - this.state.longitude);
             var lonThres = 8/305775;
             var latThres = 8/77136;
             console.log(latD+" "+latThres)
             console.log(lonD+" "+lonThres)
             if(lonD <= lonThres && latD <= latThres){
                this.setState({descriptionToDisplay : "This area needs "+ numSamples +" more samples!"});
                this.menu.open();
             }
             else{
                 this.setState({descriptionToDisplay : "This area needs "+ numSamples +" more samples! Get closer to take a sample!"});
                 
             }
             AsyncStorage.setItem("clickedLocation",area);
      }

      onRef = r => {
        this.menu = r;
      }


        render() {
        const { region } = this.props;

        return (
            <MenuProvider style={styles.container}>  
            <View>
              <Menu
                name="menu-1" ref={this.onRef}>
                <MenuTrigger />
                <MenuOptions>
                  <MenuOption onSelect={() => this.props.navigation.navigate('BactTracker',{inNetpass})} text="Sample" />

                </MenuOptions>
              </Menu>
            </View>
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
            minZoomLevel = {16}
            >

                {this.state.markers.map(marker => (
                            <MapView.Marker 
                                coordinate={marker.coordinates}
                                title={marker.title}
                                key={marker.key}
                                pinColor={marker.pinColor}
                                description={this.state.descriptionToDisplay}
                                onPress={() => this.openMenu(marker.coordinates, marker.samplesLeft, marker.title)}
                            />
                        ))}
                
            </MapView>
          </View>
        </MenuProvider>
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