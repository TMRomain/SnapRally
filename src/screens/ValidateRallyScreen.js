import { StyleSheet, View, Text } from "react-native";
import React, { Component, useState } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import auth from "@react-native-firebase/auth";
import { getUser } from "../api/UserApi";
import { Input } from "../components/Input";
import { CreateRally } from "../api/RallyApi";
import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-picker/picker";

let isAgainstTime = false;

export default class ValidateRallyScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      user: getUser(),
      difficulty: "Facile",
    };
    ValiderRally = ValiderRally.bind(this);
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
          <Text>Nombre d'Étape : {this.props.route.params.Etapes.length}</Text>
          <Input
            placeholder="Nom du rally"
            value={this.state.nomRally}
            onChangeText={(nomRally) => this.setState({ nomRally })}
          />
          <View style={styles.align}>
            <CheckBox
              disabled={false}
              value={isAgainstTime}
              onValueChange={(newValue) => (isAgainstTime = newValue)}
            />
            <Text> Course Contre la montre </Text>
          </View>
          <View style={styles.align}>
          <Picker
            selectedValue={this.state.difficulty}
            style={{ height: 50, width: 120}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ difficulty: itemValue })
            }
          >
            <Picker.Item label="Facile" value="Facile" />
            <Picker.Item label="Moyen" value="Moyen" />
            <Picker.Item label="Difficile" value="Difficile" />
            <Picker.Item label="Expert" value="Expert"/>
          </Picker>
            <Text> Difficultés </Text>
          </View>   
          <FormButton
            title={"Valider le Rally"}
            onPress={() =>ValiderRally(this.state.nomRally)}
          />
        </Form>
      </View>
    );
  }
}

function ValiderRally(nomRally) {
  CreateRally(nomRally,this.props.route.params.Etapes);
  this.props.navigation.push("WelcomeScreen");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  align: {
    position: "relative",
    alignItems: "center",
    flexDirection: "row",
  },
});
