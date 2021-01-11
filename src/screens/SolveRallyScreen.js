import { StyleSheet, View, Text, TouchableOpacity,Image,Dimensions } from "react-native";
import React, { Component,Fragment } from "react";
import auth from "@react-native-firebase/auth";
import { RNCamera, FaceDetector } from "react-native-camera";

import Sensors from "../logics/PhoneSensors";

import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from "react-native-sensors";

const comparationTreshold = 0.00001;

function cameraStyle(){
    if(this.state.isAlign){
        return(
            {flex: 1,
            alignItems: "center",
            borderColor : "rgba(132,236,100,1)",
            borderWidth : 15,}
            );
    }
    return(
        {flex: 1,
        alignItems: "center",
        borderWidth : 15,}
        );
}

function isInRange(value,comparateValue){
    comparateValue = comparateValue.toFixed(5);
    value = value.toFixed(5);

    if(value == comparateValue || value <= Number(comparateValue) + Number(comparationTreshold) && value >= Number(comparateValue) - Number(comparationTreshold) ){
        return(true);
    }else{
        return(false);
    }
}

function isAlign(){
    if(this != undefined && this.state.currentRally != undefined){
      console.log(this.state.currentRally.getCurrentEtape().latitudeEtape)
      console.log(this.sensors.position.latitude)
      console.log(isInRange(this.sensors.position.latitude,this.state.currentRally.getCurrentEtape().latitudeEtape));
      console.log(this.state.currentRally.getCurrentEtape().longitudeEtape)
      console.log(this.sensors.position.longitude)
      console.log(isInRange(this.sensors.position.longitude,this.state.currentRally.getCurrentEtape().longitudeEtape));
        if(isInRange(this.sensors.position.latitude,this.state.currentRally.getCurrentEtape().latitudeEtape)){
            if(isInRange(this.sensors.position.longitude,this.state.currentRally.getCurrentEtape().longitudeEtape)){
               console.log("Bonne Photo");
               return;
            }
        }
    }
    console.log("Mauvaise Photo");
}

function DebugInfo(){
    if(this!= undefined){
        if(this.state.currentRally != undefined && this.sensors != undefined){
            return(
                <Fragment>
                <View style= {styles.debugInfo}>
                  <Text style= {styles.debugInfoText} >Votre latitude: {this.sensors.position.latitude}</Text>
                  <Text style= {styles.debugInfoText} >Votre longitude: {this.sensors.position.longitude}</Text>
                </View>
                </Fragment>
            )
        }
    }
    return(
        <Fragment>
        </Fragment>
    )
}

export default class SolveRallyScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.sensors = new Sensors();
    this.state = {
      user: auth().currentUser,
      isAlign : false,
      currentImage: null,
    };
    cameraStyle = cameraStyle.bind(this);
    isAlign = isAlign.bind(this);
    DebugInfo = DebugInfo.bind(this);
  }
  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
      this.setState({ x: x, y: y, z: z })
    );
    if(this.props.route.params != null){
        this.setState({currentRally : this.props.route.params.currentRally});
        this.setState({currentImage : this.props.route.params.currentRally.state.image.urlImageEtape});
    }
  }

  render() {
    this.sensors.getAngle();
    this.sensors.getCompass();
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={cameraStyle()}
          type={RNCamera.Constants.Type.back}
          //Disable flash
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          androidRecordAudioPermissionOptions={{
            title: "Permission to use audio recording",
            message: "We need your permission to use your audio",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          // onGoogleVisionBarcodesDetected={({ barcodes }) => {
          //   console.log(barcodes);
          // }}
        />
        <DebugInfo />
        <View
          style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}
        >
        <Image
          style ={styles.imageToReproduce}
          source={{uri: this.state.currentImage}}
        />
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}
          >
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      this.waitForUpdate();
    }
  };
  waitForUpdate= ()=>{
    setTimeout(() => {
      isAlign();
      }, 3000);
  }

  sendData = async (data, addComplete) => {
    if (this.camera) {
        

    //   this.state.etape.nomImage = data.uri;
    //   this.state.etape.latitudeEtape = this.sensors.position.latitude;
    //   this.state.etape.longitudeEtape = this.sensors.position.longitude;
    //   this.state.etape.degreeEtape = this.sensors.Degree;
    //   this.state.etape.angleXEtape = this.sensors.AngleX;
    //   this.state.etape.angleYEtape = this.sensors.AngleY;
    //   this.state.etape.angleZEtape = this.sensors.AngleZ;
    //   //addEtape(this.state.etape);
    //   console.log(this.state.etape);
      //this.props.navigation.push("ValideEtape", {etapeValue: this.state.etape ,estNouveau : false});
    }
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    alignItems: "center",
    borderColor : "rgba(132,236,100,1)",
    borderWidth : 15,
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
  },  
  imageToReproduce: {
    position: "absolute",
    height: 200,
    width: 100,
    bottom: 95, 
    left: 250, 
  },
  debugInfo:{
      position: "absolute",
      bottom : 50,
      zIndex:15,
  },  
  debugInfoText:{
    color: "rgba(132,236,100,1)",
},
});
