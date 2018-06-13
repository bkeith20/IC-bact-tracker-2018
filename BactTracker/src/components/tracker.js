
    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
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

    const williams = {

            latitude : '42.422691',
            longitude : '-76.495041',
            description: "There are three areas that are available for sampling",
            altDescription: "There are three areas that are available for sampling. Get closer to take a sample",
            displayDescription:"",
            pinColor: "yellow",

        }
    const campusCenter = {

            latitude : '42.422115',
            longitude : '-76.494273',
            description: "There are five areas that are available for sampling",
            altDescription: "There are five areas that are available for sampling. Get closer to take a sample",
            displayDescription:"",
            pinColor: "blue",

        }

    export default class tracker extends React.Component {

        constructor(props) {
        super(props);

        this.state = {
          latitude: "",
          longitude: "",  
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



         openMenu(area) {
             this.componentDidMount();
             var latD = Math.abs(area.latitude - this.state.latitude);
             var lonD = Math.abs(area.longitude - this.state.longitude);
             if(lonD < 3 && latD < 3){
                 area.displayDescription = area.description;
                this.menu.open();
             }
             else{
                 area.displayDescription = area.altDescription;
             }
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
                <MenuTrigger text="Select option"/>
                <MenuOptions>
                  <MenuOption onSelect={() => this.props.navigation.navigate('BactTracker')} text="Sample" />

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

            <MapView.Marker 
                coordinate={{
                    latitude: williams.latitude,
                    longitude: williams.longitude,

                }}
                title="Williams"
                description={williams.description}
                pinColor = {williams.pinColor}
                id = {"Marker2"}
                onPress={() => this.openMenu(williams)}
                />

        <MapView.Marker 
          coordinate={{
                latitude: campusCenter.latitude,
                longitude: campusCenter.longitude,

              }}
          title="Campus Center"
          description={campusCenter.description}
            pinColor = {campusCenter.pinColor}
            id = {"Marker1"}
            onPress={() => this.openMenu(campusCenter)}  

        />
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
        justifyContent: 'top',
        backgroundColor: '#ecf0f1',
        margin: 5,
      },
      
        map: {
        ...StyleSheet.absoluteFillObject,
      },
        mapContainer: {
            ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 370,
        justifyContent: 'flex-end',
        alignItems: 'center',
        }

    });
