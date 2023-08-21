import { StyleSheet, View, Text } from "react-native";
import React, { Component, Fragment } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import auth from "@react-native-firebase/auth";
import {getUser}from "../api/UserApi";
import {getEtapes,addEtape} from "../api/EtapeApi";
import {getUserFromDatabase,logOut} from "../api/UserApi";
import {IMLocalized, init} from '../logics/IMLocalized';




export default class WelcomeScreen extends Component {
  constructor(props) {
    //constructor to set default state
    init();
    super(props);
    this.interval;
    this.state = {
      user: null,
      isDone: false,
    };
    CreateAParcour = CreateAParcour.bind(this);
    CheckUser = CheckUser.bind(this);
    getUserFromDatabase().then((userData) => {
      this.setState({user:userData});
    });
    CheckUser();
  }
  componentWillUnmount() {
    clearTimeout( this.interval);
  }
  render() {
    return (
      <View style={styles.container}>
          <Banner/>
           <Form style={styles.mainButtons}>
              <FormButton title={IMLocalized('Jouer')} onPress={() => this.props.navigation.navigate("MapScreen")} />
              <CreateAParcour/>
              <FormButton title={IMLocalized('Déconnexion')} onPress={() => logOut()} />
           </Form>
      </View>
    );
  }
}
function CreateAParcour(){
  if(this.state.user != null && this.state.user.isPremium == true){
    return(
    <Fragment>
      <FormButton title={IMLocalized('Menu Création')} onPress={() => this.props.navigation.push("CreateRallyScreen",{nouveauxRally : true })}/>
    </Fragment>
    )
  }
  return(
  <Fragment>
    <Text>{IMLocalized('PremiumBloquer')}</Text>
    <FormButton style={styles.lockedButton}title={IMLocalized('Menu Création')} onPress={() => console.log("Pas premium")}/>
  </Fragment>)
}
function CheckUser(){
  this.interval = setTimeout(() => {
    if(this != undefined ){
        if(this.state.user== null){
        getUserFromDatabase().then((userData) => {
          this.setState({user:userData});
        });
        CheckUser();
      }else{
          clearTimeout(this.interval);
      }
    }
  }, 15000);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },lockedButton:{
    backgroundColor: "rgba(255,71,71,1)",
  },
  mainButtons:{
    // display:"flex",
    // justifyContent:"center",
    // alignItems:"center",
    top: 50,
  }
});
