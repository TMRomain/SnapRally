import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import React, { Component, Fragment, useState } from "react";
import auth from "@react-native-firebase/auth";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import Sensors from "../logics/PhoneSensors";
import { IconButton } from "../components/IconButton";
import { getRally } from "../api/RallyApi";
import { UpdateUser } from "../api/UserApi";
import CurrentRally from "../logics/CurrentRally";
import Region from "../class/Region";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from "react-native-sensors";
import { FormButton } from "../components/FormButton";

setUpdateIntervalForType(SensorTypes.accelerometer, 400);

let lesRallys;
let lockOnUser = true;
let isMarkerSelected = false;
let mapView;

const mapProps = {
  scrollEnabled: true,
  zoomEnabled: false,
  region: undefined,
  onRegionChangeComplete: (region) => {
    recuperRally(region);
  },
};

function MapRender() {
  return (
    <Fragment>
      <MapView
        ref={(ref) => (mapView = ref)}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        onPress={() => {
          isMarkerSelected = false;
          this.setState({isMenuOpen:false});
        }}
        style={styles.map}
        minZoomLevel={13}
        initialRegion={this.region}
        {...mapProps}
      >
        <AfficherEtape />
        <AfficherRallys />
        <Marker
          onPress={() => {
            isMarkerSelected = false;
            this.setState({isMenuOpen:false});
          }}
          coordinate={{
            latitude: this.sensors.position.latitude,
            longitude: this.sensors.position.longitude,
          }}
          title={"Ma position"}
          style={{
            backgroundColor: "#ccc",
            transform: [{ rotate: this.sensors.Degree + "deg" }],
          }}
        />
      </MapView>
    </Fragment>
  );
}
export default class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.sensors = new Sensors();
    this.state = {
      currentRally : new CurrentRally(),
      user: auth().currentUser,
      isWinScreenOpen : false,
      isMenuOpen : false,
    };
    recuperRally = recuperRally.bind(this);
    bouttonLancerLeRally = bouttonLancerLeRally.bind(this);
    quitterLeRally = quitterLeRally.bind(this);
    MapRender = MapRender.bind(this);
    WinScreen = WinScreen.bind(this);
    MainMenuButtons = MainMenuButtons.bind(this);

    AfficherRallys = AfficherRallys.bind(this);
    AfficherEtape = AfficherEtape.bind(this);

    RallyButton = RallyButton.bind(this);
    Menu = Menu.bind(this);
    this.remap = this.remap.bind(this);
  }
  componentDidMount() {
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
      this.setState({ x: x, y: y, z: z })
    );
    //Listen for Screen Load
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({sensors:null});
      this.setState({isWinScreenOpen:false});
      this.setState({isMenuOpen:false});
      this.setState({sensors:new Sensors()});
      if(this.props.route.params != null){
        if(this.props.route.params.currentRally != null){
          this.setState({currentRally : this.props.route.params.currentRally});
          console.log(this.state.currentRally);
          if(this.state.currentRally.isRallyOver()){
            this.setState({isWinScreenOpen:true});
            console.log("Le Rally et terminer")
            this.state.currentRally.quitterLeRally();
          };
          this.state.currentRally.updateEtape(this.state.currentRally.state.etapeActuel);
        }else{
          this.setState({currentRally : new CurrentRally()});
        } 
    }else{
      this.setState({currentRally : new CurrentRally()});
    } 
    });
  }
  remap() {
    setTimeout(() => {
      if(mapView!= null &&mapView!= undefined){
        mapView.animateToRegion(this.region, 500);
      }
    }, 2000);
  }

  render() {
    //this.sensors.getCurrentPosition();
    this.sensors.getAngle();
    this.sensors.getCompass();
    this.region = {
      latitude: this.sensors.position.latitude,
      longitude: this.sensors.position.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    //console.log("From render Progress : "+this.state.currentRally.isRallyInProgress());
    //console.log("From render Active : "+ this.state.currentRally.state.isRallyActive);
    //Change map props when changin lock state
    this.icon = lockOnUser
      ? require("../../assets/icons/Lock.png")
      : require("../../assets/icons/Unlock.png");
    mapProps.scrollEnabled = !lockOnUser;
    mapProps.zoomEnabled = !lockOnUser;
    lockOnUser
      ? (mapProps.region = this.region)
      : (mapProps.region = undefined);
  
    !this.state.currentRally.isRallyInProgress()
      ? (mapProps.onRegionChangeComplete = (region) => recuperRally(region))
      : (mapProps.onRegionChangeComplete = (region) => null);
    return (
      <View style={styles.container}>
        <View style={styles.border}>
          <MapRender />
        </View>

        <IconButton
          style={styles.optionButton}
          sourceImage={require("../../assets/icons/Option.png")}
          onPress={() => this.props.navigation.push("WelcomeScreen")}
        />
        <Menu />
       <WinScreen />
      </View>
    );
  }
}
function WinScreen(){
  if(this.state.currentRally.getCurrentRally() != null && this.state.isWinScreenOpen){
    return(
      <Fragment>
      <View style={styles.winScreen}>
      <Text>
        Vous avez terminer le Rally {this.state.currentRally.getCurrentRally().nomRally}
      </Text>
      <Text>
        + 150 point Rally
      </Text>
      <FormButton
          style ={styles.confirmButton}
          title={"Confirmer"}
          onPress={() => {
            UpdateUser(150,this.state.currentRally.getCurrentRally());
            this.setState({isWinScreenOpen : false});
            this.setState({currentRally : new CurrentRally()});
          }}
        />
    </View>
    </Fragment>
    )
  }
  return(<Fragment></Fragment>)
}
function AfficherEtape() {
  if (this.state.currentRally.isRallyInProgress() == true && this.state.currentRally.getCurrentEtape() != undefined) {
    return (
      <Fragment>
        <Circle
          key={(
            this.state.currentRally.getCurrentEtapeCoord().latitudeEtape + this.state.currentRally.getCurrentEtapeCoord().longitudeEtape
          ).toString()}
          center={{
            latitude: this.state.currentRally.getCurrentEtapeCoord().latitudeStartEtape,
            longitude: this.state.currentRally.getCurrentEtapeCoord().longitudeStartEtape,
          }}
          radius={500}
          strokeWidth={1}
          strokeColor={"#1a66ff"}
          fillColor={"rgba(230,238,255,0.5)"}
        />
      </Fragment>
    );
  }
  return <Fragment></Fragment>;
}
function MainMenuButtons(){
  if(this.state.isMenuOpen){
    return(
      <Fragment>
        <IconButton
      style={styles.leftMain}
      sourceImage={require("../../assets/icons/Search.png")}
      onPress={() => console.log("Menu")}
      />
      <IconButton
      style={styles.middleMain}
      sourceImage={require("../../assets/icons/Inventory.png")}
      onPress={() => this.getCurrrentLocation()}
      />
      <IconButton
      style={styles.rightMain}
      sourceImage={require("../../assets/icons/Profile.png")}
      onPress={() => this.props.navigation.navigate("ProfileScreen")}
      />
      <IconButton
      style={styles.mainButtonActive}
      sourceImage={require("../../assets/icons/Menu.png")}
      onPress={() => this.setState({isMenuOpen: false})}
      />
      </Fragment>
    )
  }

  return(
    <Fragment>        
      <IconButton
      style={styles.mainButton}
      sourceImage={require("../../assets/icons/Menu.png")}
      onPress={() => this.setState({isMenuOpen: true})}
      />
    </Fragment>
  )
}
function Menu() {
  if (!isMarkerSelected) {
    return (
      <Fragment>
      <MainMenuButtons />
        <Text style={styles.textOver}>
          Parcours autour de vous {this.state.user.displayName}
        </Text>
        <View style={styles.groupLeft}>
          <IconButton
            style={styles.input}
            sourceImage={this.icon}
            onPress={() => (lockOnUser = !lockOnUser)}
          />
          <IconButton
            style={styles.input}
            sourceImage={require("../../assets/icons/Position.png")}
            onPress={() => mapView.animateToRegion(this.region, 2000)}
          />
        </View>
        <RallyButton />
      </Fragment>
    );
  }
  return (
    <Fragment>
      <View style={styles.rallyWindow}>
        <Text>{this.state.currentRally.getCurrentRally().nomRally}</Text>
        <Text>
          Nombre d'etape : {this.state.currentRally.getCurrentRally().lesEtapes.length}
        </Text>
        <Image
          style ={styles.image}
          source={{uri: this.state.currentRally.state.image.urlImageEtape}}
        />
        <FormButton
          title={"Faire se Rally"}
          onPress={() => {
            bouttonLancerLeRally();
          }}
        />
      </View>
    </Fragment>
  );
}
function RallyButton() {
  
  if (this.state.currentRally.isRallyInProgress() == true && this.state.currentRally.getCurrentEtape() != undefined) {
    let currentEtape = this.state.currentRally.getCurrentEtape();
    let regionEtape = new Region();
    regionEtape.latitude = currentEtape.latitudeStartEtape;
    regionEtape.longitude = currentEtape.longitudeStartEtape;
    return (
      <Fragment>
       <Image
          style ={styles.imageToReproduce}
          source={{uri: this.state.currentRally.state.image.urlImageEtape}}
        />
        <View style={styles.groupRight}>
          <IconButton
            style={styles.input}
            sourceImage={require("../../assets/icons/Photo.png")}
            onPress={() => this.props.navigation.navigate("SolveRallyScreen",{currentRally : this.state.currentRally})}
          />
          <IconButton
            style={styles.input}
            sourceImage={require("../../assets/icons/positionMenu.png")}
            onPress={() => mapView.animateToRegion(regionEtape, 2000)}
          />
          <IconButton
            style={styles.input}
            sourceImage={require("../../assets/icons/close.png")}
            onPress={() => quitterLeRally()}
          />
        </View>
      </Fragment>
    );
  }
  return <Fragment></Fragment>;
}

function bouttonLancerLeRally() {
  this.state.currentRally.lancerLeRally();
  isMarkerSelected = false;
}

function quitterLeRally() {
  this.state.currentRally.quitterLeRally();
  recuperRally(this.region);
}



function recuperRally(region) {
  mapView.getCamera().then((cameraValues) => {
    getRally(region, cameraValues.zoom).then((rallys) => {
      if (rallys != undefined && rallys != null) {
        lesRallys = rallys;
      }
    });
  });
}

function AfficherRallys() {
  let keyToAdd = 0;
  if (lesRallys != null && !this.state.currentRally.isRallyInProgress()) {
    return (
      <Fragment>
        {lesRallys.map((rally, index) => {
          keyToAdd++;
          return (
            <Marker
              key={keyToAdd}
              onPress={() => {
                this.state.currentRally.updateRally(rally);
                isMarkerSelected = true;
                // this.setState({ selectedRally: rally });
              }}
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
    );
  }
  return <Fragment></Fragment>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  border: {
    borderWidth: 3,
    borderColor: "black",
  },
  mainButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  optionButton: {
    position: "absolute",
    right: -5,
    top: -5,
    borderRadius: 40,
  },
  groupRight: {
    position: "absolute",
    bottom: 5,
    right: 5,
    flexDirection: "row",
  },
  groupLeft: {
    position: "absolute",
    bottom: 5,
    left: 5,
    flexDirection: "row",
  },
  textOver: {
    position: "absolute",
  },
  input: {
    margin: 5,
  },
  rallyWindow: {
    alignSelf: "center",
    alignContent: "center",
    alignItems:"center",
    position: "absolute",
    backgroundColor: "rgba(224, 222, 222,1)",
    height: 300,
    width: 300,
    bottom: 0,
  },
  image: {
    height: 100,
    width: 100,
  },
  imageToReproduce: {
    height: 200,
    width: 100,
    bottom: 300, 
    left: 250, 
  },winScreen:{
    alignSelf: "center",
    alignContent: "center",
    alignItems:"center",
    position: "absolute",
    backgroundColor: "rgba(224, 222, 222,1)",
    height: 300,
    width: 300,
    top :Dimensions.get("window").height/3,
  }, 
  mainButtonActive: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "rgba(224, 222, 222,1)",
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  middleMain:{
    position: "absolute",
    alignSelf: "center",
    bottom: 150,
    width: 45,
    height: 45,
    borderRadius: 40,
  },
  leftMain:{
    position: "absolute",
    alignSelf: "center",
    bottom: 100,
    left:40,
    width: 45,
    height: 45,
    borderRadius: 40,
  },rightMain:{
    position: "absolute",
    alignSelf: "center",
    right:40,
    bottom: 100,
    width: 45,
    height: 45,
    borderRadius: 40,
  },
  confirmButton:{
    bottom: 10,
  },
});
