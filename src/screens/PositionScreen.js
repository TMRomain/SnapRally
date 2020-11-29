import { StyleSheet, View, Text } from "react-native";
import React, { Component ,useState} from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import auth from "@react-native-firebase/auth";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Sensors from '../logics/PhoneSensors';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

setUpdateIntervalForType(SensorTypes.accelerometer, 400);


export default class WelcomeScreen extends Component {

  
  constructor(props) {
    super(props);
    this.sensors = new Sensors();
    this.state = {
      user: auth().currentUser,
    };
  }
  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
      this.setState({ x: x, y: y, z: z }),
    );
    
  }
  render() {
    this.sensors.getCurrentPosition();
    this.sensors.getAngle();
    this.sensors.getCompass();
    this.region = {
      latitude: this.sensors.position.latitude,
      longitude: this.sensors.position.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }
    return (
      <View style={styles.container}>
        <Banner />
        <Form>
          <Text>Parcours autour de vous {this.state.user.displayName}</Text>
          <View style={styles.border} >
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              initialRegion={this.region}
              region={this.region}
            >
              <Marker coordinate={{ latitude: 48.846044, longitude: -67.532731 }} title={"Parcours Test"} />
              <Marker coordinate={{latitude: this.sensors.position.latitude, longitude: this.sensors.position.longitude }} title={"Ma postion"} style={{backgroundColor:'#ccc',transform: [{rotate: this.sensors.Degree+"deg"}],}}   />
            </MapView>
          </View>
          <Text>L'angle de votre telephone en X:{this.sensors.AngleX}</Text>
          <Text>L'angle de votre telephone en Y :{this.sensors.AngleY}</Text>
          <Text>L'angle de votre telephone en Z :{this.sensors.AngleZ}</Text>
          <Text>Votre rotation est de  :{this.sensors.Degree+"deg"}</Text>
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
