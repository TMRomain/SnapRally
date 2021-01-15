import { StyleSheet, View, Text, TouchableOpacity,Animated } from "react-native";
import React, { Component } from "react";
import auth from "@react-native-firebase/auth";
import { RNCamera, FaceDetector } from "react-native-camera";

import Sensors from "../logics/PhoneSensors";
import Etape from "../class/Etape";
import EtapeLogics from "../logics/EtapeLogic";

import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from "react-native-sensors";

export default class CaptureScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.sensors = new Sensors();
    this.etapeLogic = new EtapeLogics();
    this.state = {
      user: auth().currentUser,
      lastPos: null,
      warningText : "",
      fadeAnimation: new Animated.Value(0),
    };
    getData = getData.bind(this);
  }

  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
      this.setState({ x: x, y: y, z: z })
    );
    if(this.props.route.params != null){
      this.state.etape = this.props.route.params.etapeValide;
    }
    this.state.lastPos = null;

  }
  render() {
    this.sensors.getCurrentPosition();
    this.sensors.getAngle();
    this.sensors.getCompass();
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
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
         <Text style={{opacity: this.state.fadeAnimation},styles.warningText}>{this.state.warningText}</Text>
        <View
          style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}
        >
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
      const data = await this.camera.takePictureAsync(options);
      this.sendData(data);
    }
  };
  resetWarning(){
    setTimeout(() => {
      this.setState({warningText : ""});
    },8000)
  }
  sendData = async (data, addComplete) => {
    if (this.camera) {
      this.setState({warningText : "Ne pas bouger pendant la photo"});
      this.resetWarning();
      setTimeout(() => {
        let lastEtape = getData(data);
        setTimeout(() => {
          let currentEtape = getData(data);
          if(this.etapeLogic.compareEtape(lastEtape,currentEtape)){
            this.props.navigation.push("ValideEtape", {etapeValue: currentEtape ,estNouveau : false});
          }else{
            this.setState({warningText : "Vous avez bouger pendant la photo"});
            this.resetWarning();
          }
          
        }, 6000);
      }, 6000);
    
    }
  };
}

function getData(data){
  let etape = new Etape();

  etape.nomImage = data.uri;
  etape.latitudeEtape = this.sensors.position.latitude;
  etape.longitudeEtape = this.sensors.position.longitude;
  etape.degreeEtape = this.sensors.Degree;
  etape.angleXEtape = this.sensors.AngleX;
  etape.angleYEtape = this.sensors.AngleY;
  etape.angleZEtape = this.sensors.AngleZ;

  return(etape);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  capture: {
    flex: 0,
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    bottom: 10,
  },
  warningText: {
    flex: 0,
    position: "absolute",
    color: "white",
    alignSelf: "center",
    top: 50,
  },
});
