import { StyleSheet, View, Text } from "react-native";
import React, { Component ,Fragment,useState} from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import auth from "@react-native-firebase/auth";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Sensors from '../logics/PhoneSensors';
import { FormButton } from "../components/FormButton";
import { getEtape } from "../api/EtapeApi";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

setUpdateIntervalForType(SensorTypes.accelerometer, 400);
let etapes;


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
              <Marker coordinate={{latitude: this.sensors.position.latitude, longitude: this.sensors.position.longitude }} title={"Ma postion"} style={{backgroundColor:'#ccc',transform: [{rotate: this.sensors.Degree+"deg"}],}}/>
              <AfficherEtape />


            </MapView>
          </View>
          <FormButton title={"Afficher Etape"} style = {styles.input} onPress={() => recuperEtape()} />
        </Form>
      </View>
    );
  }
}



function recuperEtape(){
  etapes  = Object.values(getEtape());
}
function AfficherEtape(){
  if(etapes != null){
    return (
     <View>
         {etapes.map((item, key)=>(
          <Marker coordinate={{ latitude: item.etapeData.latitudeEtape, longitude: item.etapeData.longitudeEtape }} title={"Parcours Test"} />
         ))}
 
     </View>
    );
  }
  return(
    <Fragment>

    </Fragment>
  );
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
