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
          <Heading>S'identifier</Heading>
          <Error error={""} />
          <Input placeholder="Email" keyboardType={"email-address"} />
          <Input placeholder="Mot de passe" secureTextEntry />
          <FormButton title={"Se Connecter"} />
          <TextButton
            title={"Nouvel utilisateur ? Créer votre compte"}
            onPress={() => this.props.navigation.push("SignIn")}
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
