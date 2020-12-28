import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import auth from "@react-native-firebase/auth";
import { RNCamera, FaceDetector } from "react-native-camera";

import Sensors from "../logics/PhoneSensors";

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
    this.state = {
      user: auth().currentUser,
    };
  }
  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
      this.setState({ x: x, y: y, z: z })
    );
    if(this.props.route.params != null){
      this.state.etape = this.props.route.params.etapeValide;
    }
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

  sendData = async (data, addComplete) => {
    if (this.camera) {
      this.state.etape.nomImage = data.uri;
      this.state.etape.latitudeEtape = this.sensors.position.latitude;
      this.state.etape.longitudeEtape = this.sensors.position.longitude;
      this.state.etape.degreeEtape = this.sensors.Degree;
      this.state.etape.angleXEtape = this.sensors.AngleX;
      this.state.etape.angleYEtape = this.sensors.AngleY;
      this.state.etape.angleZEtape = this.sensors.AngleZ;
      //addEtape(this.state.etape);
      console.log(this.state.etape);
      this.props.navigation.push("ValideEtape", {etapeValue: this.state.etape ,estNouveau : false});
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
    justifyContent: "flex-end",
    alignItems: "center",
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
});
