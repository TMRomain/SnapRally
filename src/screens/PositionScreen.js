import { StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import auth from "@react-native-firebase/auth";
import MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps';

export default class WelcomeScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      user: auth().currentUser,
 
    };
  }
  region = {
    latitude: 48.8345481,
    longitude: -67.5187402,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  }
  render() {
    return (
      <View style={styles.container}>
        <Banner />
           <Form>
              <Text>Parcours autour de vous {this.state.user.displayName}</Text>
              <View style={styles.border} >
              <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={this.region}
     >
           <Marker coordinate={{ latitude: 48.846044, longitude: -67.532731}}title={"Parcours Test"} />
     </MapView>
     </View>
           </Form>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 400,
    width: 400,
  },
  border: {
    borderWidth: 3,
    borderColor: 'black'
  },
});
