// import firebase from "react-native-firebase";
import firebase from "firebase";


var config = {
    databaseURL: "https://snaprally-b1071.firebaseio.com/",
    projectId: "snaprally-b1071",
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export function addEtape(etapeData){
    firebase.database().ref('Etape/').push({
        etapeData,
    }).then((data)=>{
        //success callback
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
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