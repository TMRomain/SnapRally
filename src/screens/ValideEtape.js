import { StyleSheet, View, Text, Image } from "react-native";
import React, { Component,Fragment,useState } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import { SmallButton } from "../components/SmallButton";
import { getUser } from "../api/UserApi";
import { Input } from "../components/Input";
import { addEtape } from "../api/EtapeApi";
import { Error } from "../components/Error";
import Etape from "../class/Etape";

let etapeValide;
let props;
let nomEtape = "";
let isModify = false;
let index = -1;
function CheckForImage(){
  if(etapeValide != null && etapeValide.nomImage != ""){
    const source = { uri: etapeValide.nomImage };
    return(
      <Fragment>
        <Image source={source} style={styles.image} />
        <FormButton title={"Valider"} style = {styles.input} onPress={() => Valider()}/>
        <FormButton title={"Prendre une autre photo"} style = {styles.input} onPress={() => PrendreUnePhoto()}/>
      </Fragment>
    )
  }else{
    return(
      <Fragment>
        <FormButton title={"Prendre une photo"} style = {styles.input} onPress={() => PrendreUnePhoto()}/>
      </Fragment>
    )
  }
}

export default class ValideEtape extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      user: getUser(),
      error:"",
      nomEtape: ""
      
    };
    Valider = Valider.bind(this)
    CheckForImage = CheckForImage.bind(this)
    PrendreUnePhoto = PrendreUnePhoto.bind(this)
  }

  Error = (a_error) => {
    this.setState({
      error: a_error,
    });
    console.log(a_error);
  };

  componentDidMount(){
    if(this.props.route.params != null){
      //console.log("Creation de l'etape");
      if(this.props.route.params.estNouveau == true){
        //console.log("Nouvelle Etape");
        etapeValide = new Etape();
        isModify = false;
        this.forceUpdate();
      }else{
        if(this.props.route.params.lesEtapes != null){
          //console.log("Etape Modfier");
          isModify = true;
          index = this.props.route.params.index;
          etapeValide = this.props.route.params.lesEtapes[this.props.route.params.index];
          this.setState({nomEtape : this.props.route.params.lesEtapes[this.props.route.params.index].nomEtape});
        }else{
          //console.log("Etape depuis la cameras");
          etapeValide = this.props.route.params.etapeValue;
          this.setState({nomEtape : this.props.route.params.etapeValue.nomEtape});
        }
      }
    }
  }

  render() {
    nomEtape = this.state.nomEtape;
    props = this.props;
    return (
      <View style={styles.container}>
        <Banner />
        <Form>
        <Error error ={this.state.error}/>
          <Input
            placeholder="Nom de l'etape"
            value={this.state.nomEtape}
            onChangeText={(nomEtape) => this.setState({nomEtape})}
          />
          <CheckForImage />
          <FormButton
            title={"Retour"}
            style = {styles.input}
            onPress={() => this.props.navigation.push("CreateRallyScreen")}
          />
        </Form>
      </View>
    );
  }
}

function Valider() {
  if (etapeValide.nomEtape != null) {
    etapeValide.nomEtape = nomEtape;
    if (etapeValide.nomEtape != "") {
      if (isModify == true) {
        return props.navigation.push("CreateRallyScreen", {
          etapeValide: etapeValide,
          estFait: false,
          index: index,
        });
      }
      return props.navigation.push("CreateRallyScreen", {
        etapeValide: etapeValide,
        estFait: false,
      });
    } else {
      this.Error("test");
    }
  }
}

function PrendreUnePhoto(){
  etapeValide.nomEtape = nomEtape;
  props.navigation.push("CaptureScreen",{etapeValide:etapeValide});
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    marginTop: 20,
    minWidth: 200,
    height: 200,
  },
  input: {
    margin: 5,
  }
});