import { StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { FormButton } from "../components/FormButton";
import { TextButton } from "../components/TextButton";
import { Error } from "../components/Error";
import auth from "@react-native-firebase/auth";

export default class WelcomeScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      user: auth().currentUser,
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
        <Text>Bonjour {this.state.user.email}</Text>
        <FormButton title={"Se déconnecter "} onPress={() => this.LogOut()} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
