import { StyleSheet, View, Text } from "react-native";
import React, { Component,Fragment } from "react";
import { Banner } from "../components/Banner";
import { Form } from "../components/Form";
import { FormButton } from "../components/FormButton";
import {getUserFromDatabase} from "../api/UserApi"
import {getRallyFromLink} from "../api/RallyApi"

export default class ProfileScreen extends Component {
  constructor(props) {
    //constructor to set default state
    super(props);
    this.state = {
      user: null,
      lesRally : [], 
    };
    getUserFromDatabase().then((userData) => {
      this.setState({user:userData});
      loadRally();
    });
    UserInfo= UserInfo.bind(this);
    LesRally= LesRally.bind(this);
    loadRally= loadRally.bind(this);
  }
  render() {
    return (
      <View style={styles.container}>
        <Banner />
           <Form>
             <UserInfo/>
             <LesRally />
           </Form>
      </View>
    );
  }
}
function UserInfo(){
  if(this != null &&this.state.user != null ){
  return(
    <Fragment>
      <Text>Votre Pseudo {this.state.user.pseudo}</Text> 
      <Text>Votre Experience {this.state.user.exp}</Text>
      <Text>Vos rally completer :</Text>
      
    </Fragment>
  )}
  return(<Fragment><Text>Chargement des infos</Text></Fragment>)
}
function LesRally(){
  if(this != undefined && this.state.lesRally != null){
    return(
      <Fragment>{
        this.state.lesRally.map((rally, index) => { return(<Text key={index}>{index+=1} : {rally}</Text>)} )
    }</Fragment>)
  }
  return(<Fragment><Text>Chargement des rallys</Text></Fragment>)
}
function loadRally(){
  let rally = [];
  this.state.user.rallyCompleter.map((item, index) => {
    getRallyFromLink(item).then((rallyData) => {
      rally[index] = rallyData.nomRally;
      if(rally != null &&rally != undefined){
        let lesRally = Object.values(rally);
        this.setState({lesRally: lesRally});
      }
    });
  })
 
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
