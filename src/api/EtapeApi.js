//import firebase from "react-native-firebase";
import firebase from "firebase";
//use import firebase from '@react-native-firebase/storage'; later
import uuid from 'react-native-uuid';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';


let etapes;
var config = {
    databaseURL: "https://snaprally-b1071.firebaseio.com/",
    projectId: "snaprally-b1071",
    storageBucket : "snaprally-b1071.appspot.com",
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export function addEtape(etapeData){
    let imageName = uploadImage(etapeData.nomImage);
    etapeData.nomImage = imageName;

    database()
    .ref('Etape/')
    .push({
      etapeData
    })
    .then(() => console.log('Etape Upload sur le serveur'))
    .catch((error) => console.log('Erreur serveur :'+error))
    ;



    // firebase.database().ref('Etape/').push({
    //     etapeData,
    // }).then((data)=>{
    //     //success callback
    //     console.log('Succes ')
    //     console.log('data ' , data)
    // }).catch((error)=>{
    //     //error callback
    //     console.log('Error ');
    //     console.log('error ' , error)
    // })
}

export function uploadImage(imageUri){
    const ext = imageUri.split('.').pop(); // Extract image extension
    const filename = `${uuid.v1()}.${ext}`; // Generate unique name
    let uploading = true

    console.log(imageUri);
    let reference = storage().ref("/etapes/images/"+filename);         // 2
    let task = reference.putFile(imageUri);          // 3
    task.then(() => {                                 // 4
        console.log('Image uploaded to the bucket!');
    }).catch((e) => console.log('uploading image error => ', e));
      return filename;
  };

export async function getImage(imageName){
  var ref = firebase.storage().ref("/etapes/images/"+imageName);
  return(await ref.getDownloadURL());
}

// export function addEtape(etape,addComplete){
//     firebase.firestore()
//     .collection('Etape')
//     .add({
//         nomImage : etape.nomImage,
//         latitudeEtape : etape.latitudeEtape,
//         longitudeEtape : etape.longitudeEtape,
//         degreeEtape : etape.degreeEtape,
//         angleXEtape : etape.angleXEtape,
//         angleYEtape : etape.angleYEtape,
//         angleZEtape : etape.angleZEtape,
//         createdAt: firebase.firestore.FieldValue.serverTimestamp()
//     }).then((data) => addComplete(data))
//     .catch((error)=> console.log(error));
// }
// export async function getEtapes(etapesRetreived){
//     var etapesList= [];

//     var snapshot = await firebase.firestore()
//     .collection('Etape')
//     .orderBy('createdAt')
//     .get()

//     snapshot.forEach((doc)=> {
//         etapesList.push(doc.data());
//     });
//     etapesRetreived(etapesList);
// }