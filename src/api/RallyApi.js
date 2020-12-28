// import firebase from "react-native-firebase";
import firebase from "firebase";
import uuid from 'react-native-uuid';
import { addEtape } from "../api/EtapeApi";
import Rally from "../class/Rally";

let etapes;
var config = {
    databaseURL: "https://snaprally-b1071.firebaseio.com/",
    projectId: "snaprally-b1071",
    storageBucket : "snaprally-b1071.appspot.com",
};

export function AddRally(rallyData){
    console.log(rallyData);
    firebase.database().ref('Rally/').push({
        rallyData,
    }).then((data)=>{
        //success callback
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
}

export function CreateRally(nomRally,lesEtapes){
    console.log(nomRally);
    const randUuid = uuid.v1(); 
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
