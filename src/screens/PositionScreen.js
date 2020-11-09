import { StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import auth from "@react-native-firebase/auth";
import MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps';
import { Observable } from 'rxjs';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";

setUpdateIntervalForType(SensorTypes.gyroscope, 400); // defaults to 100ms




export default class WelcomeScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      observable: null,
      user: auth().currentUser,
    }; 
    const subscription = gyroscope.subscribe(({ x, y, z, timestamp }) =>
    this.setState({x:x.toFixed(4),y:y,z,z}),
    );
   
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
     <Text>Votre position en X :{this.state.x}</Text>
     <Text>Votre position en Y :{this.state.y}</Text>
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
