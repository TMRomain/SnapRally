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
      email: auth().currentUser.email,
    };
  }
  LogOut = () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  render() {
    return (
      <View style={styles.container}>
        <Banner />
        <Text>Bonjour : {this.state.email}</Text>
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
