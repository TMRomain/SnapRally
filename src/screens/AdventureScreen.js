import { StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import auth from "@react-native-firebase/auth";

export default class AdventureScreen extends Component {
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
              <FormButton title={"Début"} onPress={() => this.props.navigation.push("CaptureScreen")}/>
              <FormButton title={"+"}/>
              <FormButton title={"Fin"} onPress={() => this.props.navigation.push("CaptureScreen")}/>
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
