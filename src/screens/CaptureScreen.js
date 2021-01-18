import { StyleSheet, View, Text, TouchableOpacity,Animated,BackHandler } from "react-native";
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
import { Fragment } from "react";

export default class CaptureScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.sensors = new Sensors();
    this.etapeLogic = new EtapeLogics();
    this.canClick = true;
    this.state = {
      user: auth().currentUser,
      lastPos: null,
      warningText : "",
      nomEtape: "",
      fadeAnimation: new Animated.Value(0),
    };
    buildEtape = buildEtape.bind(this);
    TakeAPictureButton = TakeAPictureButton.bind(this);
  }

  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
    this.setState({ x: x, y: y, z: z })
  );
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if(this.props.route.params != null){
        this.state.etape = this.props.route.params.etapeValide;
        this.state.nomEtape = this.props.route.params.nomEtape;
      }
      this.setState({canClick: true});
      this.state.lastPos = null;
    });
    //Desactive le retour en arriere
    BackHandler.addEventListener('hardwareBackPress', function() {return true})
  }
  render() {
    //this.sensors.getCurrentPosition();
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
            <TakeAPictureButton />
            
        </View>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      this.setState({warningText : "Ne pas bouger pendant la photo"});
      this.setState({canClick: false});
      this.resetWarning();
      this.sensors.getCurrentPosition(async function (position) {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        let etape = buildEtape(data,position,this.sensors)
        this.props.navigation.push("ValideEtape", {etapeValue: etape ,estNouveau : false,nomEtape:this.state.nomEtape});
      }.bind(this));
    }
  };
  resetWarning(){
    setTimeout(() => {
      this.setState({warningText : ""});
    },8000)
  }
  sendData = async (data, etape) => {
    if (this.camera) {
      

      this.resetWarning();

      // setTimeout(() => {
      //   let lastEtape = getData(data,this.sensors);
      //   setTimeout(() => {
      //     let currentEtape = getData(data,this.sensors);
      //     if(this.etapeLogic.compareEtape(lastEtape,currentEtape)){
      //       this.setState({canClick: true});
      //       this.props.navigation.push("ValideEtape", {etapeValue: currentEtape ,estNouveau : false});
      //     }else{
      //       this.setState({warningText : "Vous avez bouger pendant la photo"});
      //       this.setState({canClick: true});
      //       this.resetWarning();
      //     }
      //   }, 5000);
      // }, 5000);
    
    }
  };
}
function TakeAPictureButton(){
  if(this != undefined &&this.state.canClick == true){
    return(
      <Fragment>
        <TouchableOpacity
          onPress={this.takePicture.bind(this)}
          style={styles.capture}>
          <Text style={{ fontSize: 14 }}> SNAP </Text>
        </TouchableOpacity>
    </Fragment>
    )
  }
  return(
    <Fragment>
    </Fragment>
  )
}
function buildEtape(data,position,sensor){
  let etape = new Etape();

  etape.nomImage = data.uri;
  etape.latitudeEtape = position.coords.latitude;
  etape.longitudeEtape = position.coords.longitude;
  etape.degreeEtape = sensor.Degree;
  etape.angleXEtape = sensor.AngleX;
  etape.angleYEtape = sensor.AngleY;
  etape.angleZEtape = sensor.AngleZ;

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
