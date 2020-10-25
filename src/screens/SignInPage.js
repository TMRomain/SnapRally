import { StyleSheet, View } from "react-native";
import React, { Component } from "react";
import { Banner } from "../components/Banner";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { FormButton } from "../components/FormButton";
import { TextButton } from "../components/TextButton";
import { Error } from "../components/Error";

export default class LoginPage extends Component {
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
          />
          <Input placeholder="Pseudo" style={styles.input} />
          <Input
            placeholder="Mot de passe"
            secureTextEntry
            style={styles.input}
          />
          <Input
            placeholder="Confirmation MDP"
            secureTextEntry
            style={styles.input}
          />
          <FormButton title={"Valider"} />
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
