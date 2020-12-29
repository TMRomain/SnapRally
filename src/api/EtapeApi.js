//import firebase from "react-native-firebase";
import firebase from "firebase";
import uuid from 'react-native-uuid';
import database from '@react-native-firebase/database';


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
    .then(() => console.log('Etape Upload sur le serveur'));



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

    firebase
      .storage()
      .ref(`etapes/images/${filename}`)
      .put(imageUri)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};
          state = {
            ...state,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          };
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            const allImages = this.state.images;
            allImages.push(snapshot.downloadURL);
            state = {
              ...state,
              uploading : false,
              imgSource: '',
              imageUri: '',
              progress: 0,
              images: allImages
            };
            AsyncStorage.setItem('images', JSON.stringify(allImages));
          }
          //this.setState(state);
        },
        error => {
          unsubscribe();
          alert('Sorry, Try again.');
        }
      );
      return filename;
  };

export function getEtape(){
  firebase.database().ref('Etape/').once('value', function (snapshot) {
    etapes = snapshot.val();
});
return etapes;
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