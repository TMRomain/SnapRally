import { StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import auth from "@react-native-firebase/auth";
import {getUser}from "../api/UserApi";
import {getEtapes,addEtape} from "../api/EtapeApi";

export default class WelcomeScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      user: getUser(),
    };
  }
  LogOut = () => {
    auth()
      .signOut()
      .then(() => console.log("Utilisateur deconnecter!"));
  };
  render() {
    return (
      <View style={styles.container}>
        <Banner />
           <Form>
              <Text>Bonjour {this.state.user.email}</Text>
              <FormButton title={"Jouer"} onPress={() => this.props.navigation.navigate("MapScreen")} />
              <FormButton title={"Créer parcours"} onPress={() => this.props.navigation.push("CreateRallyScreen",{nouveauxRally : true })}/>
              <FormButton title={"Se déconnecter "} onPress={() => this.LogOut()} />
           </Form>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
