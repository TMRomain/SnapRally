import { StyleSheet, View, Text } from "react-native";
import React, { Component, Fragment } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import auth from "@react-native-firebase/auth";
import {getUser}from "../api/UserApi";
import {getEtapes,addEtape} from "../api/EtapeApi";
import {getUserFromDatabase,logOut} from "../api/UserApi";

export default class WelcomeScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      user: null,
    };
    getUserFromDatabase().then((userData) => {
      this.setState({user:userData});
    });
    CreateAParcour = CreateAParcour.bind(this);
  }
  render() {
    return (
      <View style={styles.container}>
        <Banner />
           <Form>
              <FormButton title={"Jouer"} onPress={() => this.props.navigation.navigate("MapScreen")} />
              <CreateAParcour/>
              <FormButton title={"Se déconnecter "} onPress={() => logOut()} />
           </Form>
      </View>
    );
  }
}
function CreateAParcour(){
  if(this.state.user != null && this.state.user.isPremium == true){
    return(<Fragment>
      <FormButton title={"Créer parcours"} onPress={() => this.props.navigation.push("CreateRallyScreen",{nouveauxRally : true })}/>
    </Fragment>)
  }
  return(<Fragment>
  <Text>Vous devez debloquer le prenium</Text>
  <FormButton style={styles.lockedButton}title={"Créer parcours"} onPress={() => console.log("Pas premium")}/>
  </Fragment>)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },lockedButton:{
    backgroundColor: "rgba(255,71,71,1)",
  },
});
