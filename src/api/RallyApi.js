// import firebase from "react-native-firebase";
import firebase from "firebase";
import uuid from 'react-native-uuid';
import { addEtape } from "../api/EtapeApi";
import Rally from "../class/Rally";
import database from '@react-native-firebase/database';

let etapes;
var config = {
    databaseURL: "https://snaprally-b1071.firebaseio.com/",
    projectId: "snaprally-b1071",
    storageBucket : "snaprally-b1071.appspot.com",
};

export function AddRally(rallyData){
    database()
    .ref('Rally/')
    .push({
        rallyData
    })
    .then(() => console.log('Rally Upload sur le serveur'));
}

export function CreateRally(nomRally,lesEtapes){
    let randUuid = uuid.v1(); 
    let rally = new Rally();
    let numberOfEtape = 0;
    
    rally.nomRally = nomRally;
    rally.linkRally = randUuid;

    lesEtapes.map((item, index) => {
        item.linkRally = randUuid;
        addEtape(item);
        numberOfEtape++;
    });
    rally.numberOfEtape = numberOfEtape;
    AddRally(rally);
}


export function getRally(){
  firebase.database().ref('rallyData/').once('value', function (snapshot) {
    rallys = snapshot.val();
});
return rallys;
}
