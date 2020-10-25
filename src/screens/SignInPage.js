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

  createUser = async () => {
    let email = this.state.email;
    let password = this.state.password;

    //TODO Faire une verification du mot de passe

    if (email != null && password != null) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log("User account created & signed in!");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            console.log("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            console.log("That email address is invalid!");
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
          <Heading>Inscription</Heading>
          <Error error={""} />
          <Input
            placeholder="Email"
            keyboardType={"email-address"}
            style={styles.input}
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
          <Input placeholder="Pseudo" style={styles.input} />
          <Input
            placeholder="Mot de passe"
            secureTextEntry
            style={styles.input}
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
          />
          <Input
            placeholder="Confirmation MDP"
            secureTextEntry
            style={styles.input}
          />
          <FormButton
            title={"Valider"}
            onPress={() =>
              this.createUser("Test", this.handleEmail, this.handlePassword)
            }
          />
          <TextButton
            title={"Retourner a l'inscription"}
            onPress={() => this.props.navigation.push("Connexion")}
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
  input: {
    margin: 5,
  },
});
