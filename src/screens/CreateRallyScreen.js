import { StyleSheet, View, Text,ScrollView  } from "react-native";
import React, { Component, Fragment } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import auth from "@react-native-firebase/auth";
import {IconButton} from "../components/IconButton";
import {IMLocalized, init} from '../logics/IMLocalized';

let lesEtapes = [];

const buttonProps = {
  style: null,
  onPress: () => this.props.navigation.push("ValidateRallyScreen",{lesEtapes}),
}


function AfficherEtape() {
  let keyToSet = 0;

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
        keyToSet++;
        if(item != null){
          return (
          <FormButton key = {keyToSet}
            title={item.nomEtape}
            style={styles.input}
            onPress={() => this.props.navigation.push("ValideEtape",{
              lesEtapes : lesEtapes,
              estNouveau : false,
              index :index,}
            )}
          />
        );
        }
      })}
      <FormButton
            key = {keyToSet+1}
            title={IMLocalized('PhotoSuivante')}
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
export default class CreateRallyScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    init();
    AfficherEtape = AfficherEtape.bind(this);
    this.state = {
      user: auth().currentUser,
    };
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
    this.forceUpdate();
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
    if(lesEtapes.length == 0){
      buttonProps.style = styles.button;
      buttonProps.onPress = () => console.log("test");
    }else{
      buttonProps.onPress = () => this.props.navigation.push("ValidateRallyScreen",{Etapes : lesEtapes});
      buttonProps.style = null;
    }
  
    return (
      <View style={styles.container}>
        <Banner />
        
        <Form style={styles.mainButtons}>
        <Text>{IMLocalized('Description')}</Text>
        <ScrollView >


          <AfficherEtape />
          <FormButton
            title={IMLocalized('Valider')}
            {...buttonProps}
          />
           <FormButton
            title={IMLocalized('Retour')} onPress={() =>  this.props.navigation.push("WelcomeScreen")}
          />
        </ScrollView>
        </Form>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button:{
    backgroundColor: "rgba(191, 191, 191,1)",
  },mainButtons:{
    top:50,
  }
});
