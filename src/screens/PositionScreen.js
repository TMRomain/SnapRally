import { StyleSheet, View, Text } from "react-native";
import React, { Component, useState, useEffect } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import auth from "@react-native-firebase/auth";
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import { Observable } from 'rxjs';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import Geolocation from '@react-native-community/geolocation';
import RNSimpleCompass from 'react-native-simple-compass';

setUpdateIntervalForType(SensorTypes.accelerometer, 400);



export default class WelcomeScreen extends Component {


  constructor(props) {
    super(props);
    this.Degree= 0;
    this.state = {
      observable: null,
      user: auth().currentUser,
    };
    this.region = {
      latitude: 48.8345481,
      longitude: -67.5187402,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }
    this.position = {
      latitude: 10,
      longitude: 10,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    }
  }

  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
      this.setState({ x: x, y: y, z: z }),
    );
    
  }
  _getPosition() {
    Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
      this.position.latitude = crd.latitude;
      this.position.longitude = crd.longitude;
      this.position.latitudeDelta = 0.0421;
      this.position.longitudeDelta = 0.0421;
    });
  }
  _getCompass(){
    // defaults to 100ms
const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
RNSimpleCompass.start(degree_update_rate, (degree) => {
  this.Degree = degree;
  RNSimpleCompass.stop();
});
  }
  _getAngle(x, y, z) {
    var normOfG = Math.sqrt(x * x + y * y + z * z);
    var normX = x / normOfG;
    var normY = y / normOfG;
    var normZ = z / normOfG;

    this.AngleX = Math.round(Math.acos(normX) * 180 / Math.PI);
    this.AngleY = Math.round(Math.acos(normY) * 180 / Math.PI);
    this.AngleZ = Math.round(Math.acos(normZ) * 180 / Math.PI);
  }



  
  render() {
    this._getPosition();
    this._getCompass();
    this._getAngle(this.state.x, this.state.y, this.state.z);
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
            >
              <Marker coordinate={{ latitude: 48.846044, longitude: -67.532731 }} title={"Parcours Test"} />
              <Marker coordinate={{latitude: this.position.latitude, longitude: this.position.longitude }} title={"Ma postion"} style={{backgroundColor:'#ccc',transform: [{rotate: this.Degree+"deg"}],}}   />
            </MapView>
          </View>
          <Text>L'angle de votre telephone en X:{this.AngleX}</Text>
          <Text>L'angle de votre telephone en Y :{this.AngleY}</Text>
          <Text>L'angle de votre telephone en Z :{this.AngleZ}</Text>
          <Text>Votre rotation est de  :{this.Degree+"deg"}</Text>
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
