    import React from 'react';
    import { AppRegistry,StyleSheet, Image, Text, View, Button, TouchableOpacity, TextInput, AsyncStorage, Dimensions, NetInfo, Alert } from 'react-native';
    import { createStackNavigator, TabNavigator} from 'react-navigation';
    import FormData from 'FormData';
    import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
    import {
      MenuProvider,
      Menu,
      MenuOptions,
      MenuOption,
      MenuTrigger,
        withMenuProvider,
        renderers
    } from 'react-native-popup-menu';

var {height, width} = Dimensions.get('window');

const { SlideInMenu } = renderers;
    
    var descripton = "";

    var _ismounted;

    export default class tracker extends React.Component {
        static navigationOptions = ({navigation}) => {
            const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
        return {
            headerRight: (
                <TouchableOpacity
                    onPress={() => navigation.navigate('SampleReview', {inNetpass: inNetpass})}
                    style={{paddingLeft: 10}}
                >
                    <Text style={{fontWeight: 'bold', color: 'white', padding: 10, fontSize: 16, borderColor: 'white', borderRadius: 8, borderWidth: 1 }}>My Samples</Text>
                </TouchableOpacity>
            ),
        };
    };

        constructor(props) {
        super(props);

        this.state = {
          region: {
            latitude: 1,
            longitude: 1,
            latitudeDelta: 1,
            longitudeDelta: 1
          },
          latitude: 1,
          longitude: 1, 
          selLocal: '',
          key: 0,
          markers: [],
          options: [],
        };
      }

async componentDidMount() {
    this.ismounted = true;
    const netInfo = await NetInfo.getConnectionInfo();
    const connection = netInfo.type;
    //check if connected to internet
    if (connection!=="none" && connection!=="unknown"){
                
        if(this.ismounted){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if(this.ismounted){
                        this.setState({
                            region: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                latitudeDelta: 0.015,
                                longitudeDelta:0.0121
                            },
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        
                        });
                    }
                },
            );
        }
        //read sample locations for markers in from DB write them into state  
        try{
            //send in user name to ensure locations sampled by the user no longer show up
            const { navigation } = this.props;
            const inNetpass = navigation.getParam('inNetpass', 'NO-ID');
            let name = {name: inNetpass};
            let req = JSON.stringify(name);
            let response = await fetch('http://ic-research.eastus.cloudapp.azure.com/~bkeith/bioDB.php',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: req
            });
            
            let responsejson = await response.json();
            for (let i =0; i<responsejson.length; i++){
                let newMarker = {title: responsejson[i]["building"],
                                 coordinates: {
                                     latitude: (responsejson[i]["lat"]*1),
                                     longitude: (responsejson[i]["long"]*1),
                                 },
                                 samplesLeft: (responsejson[i]["sleft"]),
                                 pinColor: (responsejson[i]["color"]),
                                 key: i,
                                };
                
                if(this.ismounted) {
                    this.setState(prevState => ({ markers: [...prevState.markers, newMarker]}));
                    this.setState(prevState => ({ options: [...prevState.options, responsejson[i]["options"]]}));
                   
                }
            };
        } catch (error){
            console.error(error);
        }
    }
    else{
        Alert.alert("No internet connection! Please turn on mobile data or wifi and retry.");
    }
}
    
        componentWillUnmount(){
            this.ismounted = false;
        }

        async openMenu(areaCoordinates, area, key) {
            
             navigator.geolocation.getCurrentPosition(
                 (position) => {
            
                     this.setState({
                         latitude: position.coords.latitude,
                         longitude: position.coords.longitude,
                 
                     });
                 },
             );
             var latD = Math.abs(areaCoordinates.latitude - this.state.latitude);
             var lonD = Math.abs(areaCoordinates.longitude - this.state.longitude);
             var lonThres = 0.0002;
             var latThres = 0.0002;

             if(lonD <= lonThres && latD <= latThres){
                this.menu.open();
             }
            this.setState({selLocal: area});
            this.setState({key: key});
        }

            onRef = r => {
                this.menu = r;
            }
            
            onRegionChange(region){
                this.setState({region: region});
            }
            

            render() {
                const { region } = this.props;
                
                const { navigation } = this.props;
                const inNetpass = navigation.getParam('inNetpass', 'NO-ID');

                return (
                    <MenuProvider style={styles.container}>  
                    <View>
                    <Menu
                    name="menu-1" ref={this.onRef}
                    renderer={SlideInMenu}>
                    <MenuTrigger />
                    <MenuOptions>
                    <MenuOption style={styles.menu} onSelect={() => this.props.navigation.navigate('BactTracker',{inNetpass: inNetpass, sampleLat: this.state.latitude, sampleLong: this.state.longitude, sampleLocation: this.state.selLocal, options: this.state.options[this.state.key]})}>
                        <Text style={styles.menuOption}> Click Here to Sample! </Text>
                    </MenuOption>

                    </MenuOptions>
                    </Menu>
                    </View>
                    <View style ={styles.mapContainer}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            region={{
                                    latitude: this.state.region.latitude,
                                    longitude: this.state.region.longitude,
                                    latitudeDelta: this.state.region.latitudeDelta,
                                    longitudeDelta: this.state.region.longitudeDelta,
                                   }}
                            onRegionChangeComplete={(region) => this.onRegionChange(region)}
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
                                        pinColor={marker.pinColor}
                                        description={"This area needs "+ marker.samplesLeft +" more samples!"}
                                        onPress={() => this.openMenu(marker.coordinates, marker.title, marker.key)}
                                    />
                                    ))}
                
                        </MapView>
                    </View>
                    </MenuProvider>
            );
        }
    }

    const styles = StyleSheet.create({
        menu: {
            height: 80,
            backgroundColor: 'red',
            alignItems: 'center',
            
        },
        menuOption: {
            fontWeight: 'bold',
            color: 'white',
            fontSize: 30,
        },
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