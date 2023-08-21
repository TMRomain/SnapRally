import { StyleSheet, View } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { FormButton } from "../components/FormButton";
import { TextButton } from "../components/TextButton";
import { Error } from "../components/Error";
import {IMLocalized, init} from '../logics/IMLocalized';
import auth from "@react-native-firebase/auth";
export default class LoginPage extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      email: "",
      password: "",
      error:"",
    };
  }
  LogInUser = async () => {
    let email = this.state.email;
    let password = this.state.password;

    if (email != null && password != null && email != "" && password != "" ) {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log("Connecter!");
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            this.Error("Cette email est invalide");
          }
          if (error.code === "auth/user-not-found") {
            this.Error("Utilisateur non trouver");
          }
          if (error.code === "auth/wrong-password") {
            this.Error("Mauvais mot de passe");
          }
          console.error(error);
        });
    }else{
      this.Error("Mot de passe ou email vide");
    }
  };
  Error = (a_error) => {
    this.setState({
      error: a_error,
    });
    console.log(a_error);
  };

  render() {
    init();
    return (
      <View style={styles.container}>
        <Banner />
        <Form>
          <Heading>{IMLocalized('identifier')}</Heading>
          <Error error={this.state.error} />
          <Input
            placeholder={IMLocalized('courriel')}
            keyboardType={"email-address"}
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
          <Input
            placeholder={IMLocalized('Mot de passe')}
            secureTextEntry
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
          />
          <FormButton
            title={IMLocalized('Se Connecter')}
            onPress={() =>
              this.LogInUser("Test", this.handleEmail, this.handlePassword)
            }
          />
          <TextButton
            title={IMLocalized('Créer un compte')}
            onPress={() => this.props.navigation.push("Inscription")}
          />
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
