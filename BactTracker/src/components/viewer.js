import React from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, WebView, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator} from 'react-navigation';
// view bacteria heat map page hosted on the ic-research server



    export default class viewer extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                myURL: 'http://ic-research.eastus.cloudapp.azure.com/~bkeith/heatmap/viewer.html'
            }
        }

        render() {

        return (
            <View style={styles.container}>
                <WebView
                    ref="map"
                    onLoadStart={() => this.setState({myURL: 'http://ic-research.eastus.cloudapp.azure.com/~bkeith/heatmap/viewer.html'})}
                    style={styles.view}
                    javaScriptEnabled={true}
                    domStorageEnabled={false}
                    thirdPartyCookiesEnabled={false}
                    source={{uri: this.state.myURL, headers: {"cache": "no-cache"}}}
                />
            </View>
            
        );
      }
    }

    const styles = StyleSheet.create({
        
        container: {
        flex: 1,
        margin: 5,
      },
    });