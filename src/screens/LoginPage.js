import { StyleSheet, View } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { FormButton } from "../components/FormButton";
import { TextButton } from "../components/TextButton";
import { Error } from "../components/Error";
import auth from "@react-native-firebase/auth";
export default class LoginPage extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  LogInUser = async () => {
    let email = this.state.email;
    let password = this.state.password;

    if (email != null && password != null) {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log("Signed in!");
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            console.log("Email Invalide");
          }
          if (error.code === "auth/user-not-found") {
            console.log("Utilisateur non trouver");
          }
          if (error.code === "auth/wrong-password") {
            console.log("Mauvais mot de passe");
          }

          console.error(error);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Banner />
        <Form>
          <Heading>S'identifier</Heading>
          <Error error={""} />
          <Input
            placeholder="Email"
            keyboardType={"email-address"}
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
          <Input
            placeholder="Mot de passe"
            secureTextEntry
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
          />
          <FormButton
            title={"Se Connecter"}
            onPress={() =>
              this.LogInUser("Test", this.handleEmail, this.handlePassword)
            }
          />
          <TextButton
            title={"Nouvel utilisateur ? Créer votre comptes"}
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
