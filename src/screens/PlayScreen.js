import { StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import auth from "@react-native-firebase/auth";

export default class WelcomeScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      user: auth().currentUser,
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Banner />
           <Form>
              <Text>Bonjour {this.state.user.email}</Text>
              <FormButton title={"Par Utilisateur "}/>
              <FormButton title={"Selon Position"} onPress={() => this.props.navigation.push("PositionScreen")}/>
              <FormButton title={"Retour"} onPress={() => this.props.navigation.push("WelcomeScreen")} />
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
