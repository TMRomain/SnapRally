import { StyleSheet, View, Text,ScrollView  } from "react-native";
import React, { Component, Fragment } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import auth from "@react-native-firebase/auth";
import { Input } from "../components/Input";
import { CreateRally } from "../api/RallyApi";

let lesEtapes = [];

function AfficherEtape() {
  if (lesEtapes.length == 0) {
    return (
      <Fragment>
        <FormButton
          title={"Début"}
          style={styles.input}
          onPress={() =>
            this.props.navigation.push("ValideEtape" , {estNouveau : true})
          }
        />
      </Fragment>
    );
  }
  return (
    <Fragment>
      {lesEtapes.map((item, index) => {
        return (
          <FormButton
            title={item.nomEtape}
            style={styles.input}
            onPress={() => this.props.navigation.push("ValideEtape",{
              lesEtapes : lesEtapes,
              estNouveau : false,
              index :index,}
            )}
          />
        );
      })}
      <FormButton
            title={"+"}
            onPress={() =>
              this.props.navigation.push("ValideEtape", {
                lesEtapes: lesEtapes,
                estNouveau: true,
              })
            }
          />
    </Fragment>
  );
}
export default class AdventureScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    AfficherEtape = AfficherEtape.bind(this);
    this.state = {
      user: auth().currentUser,
    };
    ValiderRally = ValiderRally.bind(this)
  }

  componentDidMount() {
    if (this.props.route.params != null) {
      if(this.props.route.params.estFait != null){
        this.setState({ isDone: this.props.route.params.estFait});
      }
      if(this.props.route.params.nouveauxRally == true){
        lesEtapes = [];
      }
    }
    console.log(lesEtapes);
  }

  render() {
    if (this.props.route.params != null && this.state.isDone == false) {
      if(this.props.route.params.index != null){
        lesEtapes[this.props.route.params.index] = this.props.route.params.etapeValide;
      }else{
        lesEtapes.push(this.props.route.params.etapeValide);
      }
      if (lesEtapes.length > 0) {
        this.setState({ isDone: true });
      }
    }

    return (
      <View style={styles.container}>
        <Banner />
        <ScrollView >
        <Form>
          <Input
            placeholder="Nom du rally"
            value={this.state.nomRally}
            onChangeText={(nomRally) => this.setState({ nomRally })}
          />
          <AfficherEtape />
          <FormButton
            title={"Valider Rally"}
            onPress={() => ValiderRally(this.state.nomRally)}
          />
        </Form>
        </ScrollView>
      </View>
    );
  }
}

function ValiderRally(nomRally){
  CreateRally(nomRally,lesEtapes);
  this.props.navigation.push("PlayScreen");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
