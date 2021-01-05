import { StyleSheet, View, Text,Dimensions,Image } from "react-native";
import React, { Component ,Fragment,useState} from "react";
import auth from "@react-native-firebase/auth";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Sensors from '../logics/PhoneSensors';
import {IconButton} from "../components/IconButton";
import { getRally } from "../api/RallyApi";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

setUpdateIntervalForType(SensorTypes.accelerometer, 400);

let lesRallys;
let lockOnUser = false;
let doOnce = false;
let mapView;

const mapProps = {
  scrollEnabled: true,
  zoomEnabled: false,
  region: undefined,

}

function MapRender(){
        return(
            <Fragment>
            <MapView
            ref = {(ref)=>mapView=ref}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            minZoomLevel = {13}
            initialRegion={this.region}
            {...mapProps}
            onRegionChangeComplete={(region) => {
              recuperRally(region);
          }}
            >
            <AfficherRallys />
            <Marker coordinate={{latitude: this.sensors.position.latitude, longitude: this.sensors.position.longitude }} title={"Ma position"} style={{backgroundColor:'#ccc',transform: [{rotate: this.sensors.Degree+"deg"}],}}/>
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
    recuperRally = recuperRally.bind(this)
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
        mapView.animateToRegion(this.region, 500)
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

    //Change map props when changin lock state
    var icon = lockOnUser? require('../../assets/icons/Lock.png'):require('../../assets/icons/Unlock.png');
    mapProps.scrollEnabled = !lockOnUser;
    mapProps.zoomEnabled = !lockOnUser;
    lockOnUser? mapProps.region = this.region :mapProps.region = undefined;
    
    return (
      <View style={styles.container}>
          <View style={styles.border} >
          <MapRender/>
          </View>
        
        <IconButton style = {styles.optionButton} sourceImage={require('../../assets/icons/Option.png')} onPress={() => this.props.navigation.push("WelcomeScreen")}/>

        <IconButton style = {styles.mainButton} sourceImage={require('../../assets/icons/Menu.png')} onPress={() => recuperRally(this.region)}/>
        <Text style={styles.textOver}>Parcours autour de vous {this.state.user.displayName}</Text>
        <View style = {styles.groupRight}>
          <IconButton style = {styles.input} sourceImage={icon} onPress={() => lockOnUser = !lockOnUser} />
          <IconButton style = {styles.input} sourceImage={require('../../assets/icons/Position.png')} onPress={() => mapView.animateToRegion(this.region, 2000)}/>
        </View>
      </View>
    );
  }
}

function recuperRally(region){
  mapView.getCamera().then((cameraValues) => {
    getRally(region,cameraValues.zoom).then((rallys) => {
      if(rallys != undefined && rallys != null){
        lesRallys = rallys;
       }
    });
  });
}

function AfficherRallys(){
  let keyToAdd = 0;
  if(lesRallys != null){
    return(
      <Fragment>
      {lesRallys.map((rally, index) => {
        keyToAdd++;
        return (
          <Marker
          key = {keyToAdd}
            coordinate={{
              latitude: rally.latitudeStartRally,
              longitude: rally.longitudeStartRally,
            }}
            title={rally.nomRally}
            identifier={rally.nomRally}
          >
            <Image
              source={require("../../assets/icons/Rally.png")}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
        );
      })}
      </Fragment>
    )

  }
  return(
    <Fragment></Fragment>
  )
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
  mainButton: {
    position: "absolute",
    alignSelf: "center",
    bottom:10,
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  optionButton: {
    position: "absolute",
    right : -5,
    top:-5,
    borderRadius: 40,
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
