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
import database from '@react-native-firebase/database';
import User from "../class/User";

export default class LoginPage extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmedPassword: "",
      username: "",
      error: "",
    };
  }

  createUser = async () => {
    let email = this.state.email;
    let password = this.state.password;
    let username = this.state.username;
    let codeInscription = this.state.codeInscription;
    let confirmedPassword = this.state.confirmedPassword;
    var user = null;
    console.log();
    //TODO Faire une verification de l'username

    //Verification des champ pour savoir si il sont vide
    if (
      email != null &&
      email != undefined &&
      email != "" &&
      password != null &&
      password != undefined &&
      password != ""
    ) {
      //Verifier si les mot de passe coressponde
      if (password != undefined && password != confirmedPassword) {
        this.Error("Les Mot de Passe ne corresponde pas");
        return;
      }
      if (username == undefined) {
        this.Error("Pseudo incomplet");
        return;
      }
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          //Faire Apres le l'inscription
          console.log("Creation du compte reussi");
          user = auth().currentUser;
          user
            .updateProfile({
              displayName: username,
            })
            .then(() => {
              user.sendEmailVerification();
              createDatabaseUser(user,username,codeInscription);
            });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            this.Error("Cette email deja utiliser");
          }

          if (error.code === "auth/invalid-email") {
            this.Error("Cette email est invalide");
          }

          console.error(error);
        });
    } else {
      this.Error("Email ou Mot de passe Incomplet");
    }
  };
  Error = (a_error) => {
    this.setState({
      error: a_error,
    });
    console.log(a_error);
  };

  render() {
    return (
      <View style={styles.container}>
        <Banner />
        <Form>
          <Heading>Inscription</Heading>
          <Error error={this.state.error} />
          <Input
            placeholder="Email"
            keyboardType={"email-address"}
            style={styles.input}
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
          <Input
            placeholder="Pseudo"
            style={styles.input}
            value={this.state.username}
            onChangeText={(username) => this.setState({ username })}
          />
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
            value={this.state.confirmedPassword}
            onChangeText={(confirmedPassword) =>
              this.setState({ confirmedPassword })
            }
          />
          <Input
            placeholder="Code d'inscription * "
            style={styles.input}
            value={this.state.codeInscription}
            onChangeText={(codeInscription) =>
              this.setState({codeInscription})
            }
          />
          <FormButton title={"Valider"} onPress={() => this.createUser()} />
          <TextButton
            title={"Retourner a la connexion"}
            onPress={() => this.props.navigation.push("Connexion")}
          />
        </Form>
      </View>
    );
  }
}
function createDatabaseUser(user,pseudo,codeInscription){
  let uid = user.uid;
  let isPremium = false;
  if(codeInscription == "BetaTestSnapRally"){
    isPremium= true;
  }
  let exp = 0;
  database()
  .ref('Users/'+uid)
  .set({
    pseudo,
    uid,
    isPremium,
    exp
  })
  .then(() => console.log('User added'))
  .catch((error) => console.log('Erreur serveur' + error));
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    margin: 5,
  },
});
