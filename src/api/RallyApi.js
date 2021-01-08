// import firebase from "react-native-firebase";
import firebase from "firebase";
import uuid from 'react-native-uuid';
import { uploadImage } from "../api/EtapeApi";
import Rally from "../class/Rally";
import database from '@react-native-firebase/database';


var config = {
    databaseURL: "https://snaprally-b1071.firebaseio.com/",
    projectId: "snaprally-b1071",
    storageBucket : "snaprally-b1071.appspot.com",
};
let distanceToSpawn = 0.003;
let distanceToVerify = 0.20;

export function AddRally(rallyData){
    database()
    .ref('Rally/')
    .push({
        rallyData
    })
    .then(() => console.log('Rally Upload sur le serveur'))
    .catch((error) => console.log('Erreur serveur' + error));
}

export function CreateRally(nomRally,lesEtapes){
    let randUuid = uuid.v1(); 
    let rally = new Rally();
    let numberOfEtape = 0;
    rally.linkRally = randUuid;
    rally.nomRally = nomRally;
    rally.dateRally = new Date();


    lesEtapes.map((item, index) => {
        if(index == 0){
            rally.latitudeStartRally = getRandomFloat(item.latitudeEtape-distanceToSpawn,item.latitudeEtape+distanceToSpawn);
            rally.longitudeStartRally = getRandomFloat(item.longitudeEtape-distanceToSpawn,item.longitudeEtape+distanceToSpawn);
        }
        let imageName = uploadImage(item.nomImage);
        lesEtapes[index].nomImage = imageName;
        rally.lesEtapes[index] = item;
        //addEtape(item);
        numberOfEtape++;
    });
    rally.numberOfEtape = numberOfEtape;
    AddRally(rally);
    lesEtapes = [];
    rally = null;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  

export async function getRally(region,zoomValue) {
    let rallys;
    let rallysValider = [];
    let rallyArrayPos = 0;
    let distanceMinestZoom = distanceToVerify - (zoomValue/80);
    await database().ref().once('value').then(snapshot => {
        rallys = snapshot.val();
    });
    if(rallys != null &&rallys != undefined){
    rallys = Object.values(Object.values(rallys)[0]);
    rallys.map((rally, index) => {
        rally = Object.values(rally)[0];
        let estimateLatMax = region.latitude + distanceMinestZoom;
        let estimateLatMin = region.latitude - distanceMinestZoom;
        let estimateLongMax = region.longitude + distanceMinestZoom;
        let estimateLongMin = region.longitude - distanceMinestZoom;
        if (estimateLatMin <= rally.latitudeStartRally && rally.latitudeStartRally <= estimateLatMax) {
            if (estimateLongMin <= rally.longitudeStartRally && rally.longitudeStartRally <= estimateLongMax) {
                rallysValider[rallyArrayPos] = rally;
                rallyArrayPos++;
            }
        }
    });}
    return(rallysValider);
    // database().ref().once('value').then(snapshot => {
    //     rallys = snapshot.val();
    // }).then(() => {
    //     //Selectionne les Rally dans un radius
    //     if (rallys != undefined && rallys != null) {
    //         rallys = Object.values(rallys);
    //         let estimateLatMax = region.latitude + 20;
    //         let estimateLatMin = region.latitude - 20;
    //         let estimateLongMax = region.longitude + 20;
    //         let estimateLongMin = region.longitude - 20;
    //         let rallyInRegion = [];
    //         let rallyArrayPos = 0;
    //         rallys.map((rallyParent, index) => {
    //             rallyParent = Object.values(rallyParent);
    //             rallyParent.map((rally, index) => {
    //                 let rallyData = rally.rallyData;
    //                 if (rallyData != undefined) {
    //                     if (estimateLatMin <= rallyData.latitudeStartRally && rallyData.latitudeStartRally <= estimateLatMax) {
                            
    //                         if (estimateLongMin <= rallyData.longitudeStartRally && rallyData.longitudeStartRally <= estimateLongMax) {
    //                             console.log(rallyData);

    //                             rallyInRegion[rallyArrayPos] = rallyData;
    //                             rallyArrayPos++;
    //                         }
    //                     }
    //                 }
    //             });
    //         });
    //         return rallyInRegion;
    //     }
    // });
}
