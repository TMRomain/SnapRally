import { StyleSheet, View, Text, TouchableOpacity,Image,Dimensions } from "react-native";
import React, { Component,Fragment } from "react";
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
      console.log(this.sensorsCaptures.position.latitude)
      console.log(isInRange(this.sensorsCaptures.position.latitude,this.state.currentRally.getCurrentEtape().latitudeEtape));
      console.log(this.state.currentRally.getCurrentEtape().longitudeEtape)
      console.log(this.sensorsCaptures.position.longitude)
      console.log(isInRange(this.sensorsCaptures.position.longitude,this.state.currentRally.getCurrentEtape().longitudeEtape));
        if(isInRange(this.sensorsCaptures.position.latitude,this.state.currentRally.getCurrentEtape().latitudeEtape)){
            if(isInRange(this.sensorsCaptures.position.longitude,this.state.currentRally.getCurrentEtape().longitudeEtape)){
               console.log("Bonne Photo");
               return;
            }
        }
    }
    console.log("Mauvaise Photo");
}

function DebugInfo(){
    if(this!= undefined){
        if(this.state.currentRally != undefined && this.sensorsCaptures != undefined){
            return(
                <Fragment>
                <View style= {styles.debugInfo}>
                  <Text style= {styles.debugInfoText} >Votre latitude: {this.sensorsCaptures.position.latitude}</Text>
                  <Text style= {styles.debugInfoText} >Votre longitude: {this.sensorsCaptures.position.longitude}</Text>
                  <Text style= {styles.debugInfoText} >Votre Degree: {this.sensorsCaptures.Degree}</Text>
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
    this.sensorsCaptures = new Sensors();
    this.etapeLogic = new EtapeLogics();
    this.sensorsCaptures.randomNumber = Math.random();
    this.etapeLogic.comparationTresholdPos = 0.00003;
    this.state = {
      user: auth().currentUser,
      isAlign : false,
      currentImage: null,
      warningText:"",
    };
    cameraStyle = cameraStyle.bind(this);
    isAlign = isAlign.bind(this);
    DebugInfo = DebugInfo.bind(this);
  }
  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
      this.setState({ x: x, y: y, z: z })
    );
    getData = getData.bind(this);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if(this.props.route.params != null){
        this.setState({currentRally : this.props.route.params.currentRally});
        this.setState({currentImage : this.props.route.params.currentRally.state.image.urlImageEtape});
    }
    this.setState({sensorsCaptures:null});
    this.setState({sensorsCaptures:new Sensors()});
    this.sensorsCaptures.randomNumber = Math.random();
    });
    
  }

  render() {
    this.sensorsCaptures.getAngle();
    this.sensorsCaptures.getCompass();
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
        <Text style={{opacity: this.state.fadeAnimation},styles.warningText}>{this.state.warningText}</Text>
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
        let etape = getData(data);
        if(this.etapeLogic.compareEtape(etape,this.state.currentRally.getCurrentEtape())){
          //Reussite du Rally
          this.state.currentRally.state.etapeActuel++;
          this.props.navigation.navigate("MapScreen",{currentRally:this.state.currentRally})
        }else{
          console.log("Mauvaise Photo");
        }
      }, 7000);
    
    }
  };
}

function getData(data){
  let etape = new Etape();

  etape.nomImage = data.uri;
  etape.latitudeEtape = this.sensorsCaptures.position.latitude;
  etape.longitudeEtape = this.sensorsCaptures.position.longitude;
  etape.degreeEtape = this.sensorsCaptures.Degree;
  etape.angleXEtape = this.sensorsCaptures.AngleX;
  etape.angleYEtape = this.sensorsCaptures.AngleY;
  etape.angleZEtape = this.sensorsCaptures.AngleZ;

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
 warningText: {
  flex: 0,
  position: "absolute",
  color: "white",
  alignSelf: "center",
  top: 50,
},
});
