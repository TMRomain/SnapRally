import { StyleSheet, View, Text,Dimensions } from "react-native";
import React, { Component ,Fragment,useState} from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import auth from "@react-native-firebase/auth";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Sensors from '../logics/PhoneSensors';
import {FormButton} from "../components/FormButton";
import {IconButton} from "../components/IconButton";
import { getEtape } from "../api/EtapeApi";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

setUpdateIntervalForType(SensorTypes.accelerometer, 400);

let etapes;
let lockOnUser = false;
let doOnce = false;
let mapView;
function MapRender(){
    if(lockOnUser){
        return(
            <Fragment>
            <MapView
            ref = {(ref)=>this.mapView=ref}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            initialRegion={this.region}
            region={this.region}
            showsPointsOfInterest = {false}
            scrollEnabled= {false}
            zoomEnabled= {false}
            >
            <Marker coordinate={{latitude: this.sensors.position.latitude, longitude: this.sensors.position.longitude }} title={"Ma postion"} style={{backgroundColor:'#ccc',transform: [{rotate: this.sensors.Degree+"deg"}],}}/>
            </MapView>
           </Fragment>
        )
    }
    return(
        <Fragment>
        <MapView
        ref = {(ref)=>this.mapView=ref}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        initialRegion={this.region}
        showsPointsOfInterest = {false}
        scrollEnabled= {true}
        zoomEnabled= {true}
        onMapReady ={this.remap}
        >
        <Marker coordinate={{latitude: this.sensors.position.latitude, longitude: this.sensors.position.longitude }} title={"Ma test"} style={{backgroundColor:'#ccc',transform: [{rotate: this.sensors.Degree+"deg"}],}}/>
        </MapView>
       </Fragment>
    )
}

export default class MapScreen extends Component {


  constructor(props) {
    super(props);
    this.sensors = new Sensors();
    this.state = {
      user: auth().currentUser,
    };
    MapRender = MapRender.bind(this)
    this.remap = this.remap.bind(this)
  }
  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
      this.setState({ x: x, y: y, z: z }),
    );
  }

  remap(){
    setTimeout(() => {
      this.mapView.animateToRegion(this.region, 500)
      mapView = this.mapView;
      }, 1000)
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
    var icon = lockOnUser? require('../../assets/icons/Lock.png'):require('../../assets/icons/Unlock.png');
    
    return (
      <View style={styles.container}>
        <Form>
          <View style={styles.border} >
          <MapRender/>
          </View>
        <Text style={styles.textOver}>Parcours autour de vous {this.state.user.displayName}</Text>
        <View style = {styles.groupRight}>
          <IconButton style = {styles.input} sourceImage={icon} onPress={() => lockOnUser = !lockOnUser} />
          <IconButton style = {styles.input} sourceImage={require('../../assets/icons/Position.png')} onPress={() => mapView.animateToRegion(this.region, 2000)}/>
        </View>

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
    height: Dimensions.get('window').height,
    width:  Dimensions.get('window').width
  },
  border: {
    borderWidth: 3,
    borderColor: 'black'
  },
  groupRight:{ 
    position: "absolute",
    bottom:5,
    right : 5,
    flexDirection: "row",
    },
  textOver:{
    position: "absolute",
  },
  input:{
      margin:5,
  },
});
