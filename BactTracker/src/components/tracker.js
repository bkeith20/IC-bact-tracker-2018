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

    var williams = {
            title: "Williams",
            latitude : 42.422691,
            longitude : -76.495041,
            description: "There are three areas that are available for sampling",
            altDescription: "There are three areas that are available for sampling. Get closer to take a sample",
            displayDescription:"",
            pinColor: "yellow",

        }
    var campusCenter = {
            title: "Campus Center",
            latitude : 42.422115,
            longitude : -76.494273,
            description: "There are five areas that are available for sampling",
            altDescription: "There are five areas that are available for sampling. Get closer to take a sample",
            displayDescription:"",
            pinColor: "blue",

        }
    var bookStore = {
        title: "Bookstore",
            latitude : 42.422310,
            longitude : -76.494984,
            description: "There is one area that is available for sampling",
            altDescription: "There is one area that is available for sampling. Get closer to take a sample",
            displayDescription:"",
            pinColor: "green",
    }
    
    var descripton = "";

    export default class tracker extends React.Component {

        constructor(props) {
        super(props);

        this.state = {
          latitude: 1,
          longitude: 1,
          descriptionToDisplay: "",
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
             var lonThres = 8/305775;
             var latThres = 8/77136;
             console.log(latD+" "+latThres)
             console.log(lonD+" "+lonThres)
             if(lonD <= lonThres && latD <= latThres){
                this.setState({descriptionToDisplay : area.description});
                this.menu.open();
             }
             else{
                 this.setState({descriptionToDisplay : area["altDescription"]});
                 
             }
             AsyncStorage.setItem("clickedLocation",area.title);
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

            <MapView.Marker 
                coordinate={{
                    latitude: williams.latitude,
                    longitude: williams.longitude,

                }}
                title="Williams"
                description={this.state.descriptionToDisplay}
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
          description={this.state.descriptionToDisplay}
            pinColor = {campusCenter.pinColor}
            id = {"Marker1"}
            onPress={() => this.openMenu(campusCenter)}  

        />
                
        <MapView.Marker 
          coordinate={{
                latitude: bookStore.latitude,
                longitude: bookStore.longitude,

              }}
          title="Bookstore"
          description={this.state.descriptionToDisplay}
            pinColor = {bookStore.pinColor}
            id = {"Marker3"}
            onPress={() => this.openMenu(bookStore)}  

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