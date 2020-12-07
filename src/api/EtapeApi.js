import firebase from "react-native-firebase";

export function addEtape(etape,addComplete){
    firebase.firestore()
    .collection('Etape')
    .add({
        nomImage : etape.nomImage,
        latitudeEtape : etape.latitudeEtape,
        longitudeEtape : etape.longitudeEtape,
        degreeEtape : etape.degreeEtape,
        angleXEtape : etape.angleXEtape,
        angleYEtape : etape.angleYEtape,
        angleZEtape : etape.angleZEtape,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then((data) => addComplete(data))
    .catch((error)=> console.log(error));
}
export async function getEtapes(etapesRetreived){
    var etapesList= [];

    var snapshot = await firebase.firestore()
    .collection('Etape')
    .orderBy('createdAt')
    .get()

    snapshot.forEach((doc)=> {
        etapesList.push(doc.data());
    });
    etapesRetreived(etapesList);
}