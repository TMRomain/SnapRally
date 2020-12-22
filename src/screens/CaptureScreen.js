import { StyleSheet, View, Text,TouchableOpacity } from "react-native";
import React, { Component } from "react";
import auth from "@react-native-firebase/auth";
import { RNCamera, FaceDetector } from 'react-native-camera';
import {getEtapes,addEtape} from "../api/EtapeApi";
import Sensors from '../logics/PhoneSensors';


export default class CaptureScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.sensors = new Sensors();

    this.state = {
      user: auth().currentUser,
      etape: {
        nomImage: '',
        latitudeEtape: 0,
        longitudeEtape: 0,
        degreeEtape:0,
        angleXEtape:0,
        angleYEtape:0,
        angleZEtape:0,
      },
    };
  }
  
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          //Disable flash
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
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
      console.log(data.uri);
      this.sendData(data);
    }
  };

  sendData = async (data,addComplete) => {
    if (this.camera) {
     this.state.etape.nomImage = data.uri;
     this.state.etape.latitudeEtape = 5;
     this.state.etape.longitudeEtape = 6;
     this.state.etape.degreeEtape = 7;
     this.state.etape.angleXEtape = 8;
     this.state.etape.angleYEtape = 9;
     this.state.etape.angleZEtape = 10;
     addEtape(this.state.etape);
    }
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
