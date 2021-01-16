import auth from "@react-native-firebase/auth";
import database from '@react-native-firebase/database';

 export function getUser(){
    return auth().currentUser;
} 

export function logOut(){
    auth()
      .signOut()
      .then(() => console.log("Utilisateur deconnecter!"));
  };
export function UpdateUser(xpToAdd,rally){
    let user = getUser()._user;
    getUserFromDatabase(user.uid).then((userData) => {
    let exp = 0;
    if(userData.exp != undefined){
        exp = userData.exp+xpToAdd;

    }else{
        exp+= xpToAdd;
    }
    let lesRally = [];
    if(userData.rallys != undefined){
        userData.rallys.map((item, index) => {
            lesRally[index] = item;
            if(index == userData.rallys.length){
                lesRally[index++] = rally;
            }
        });
    }else{
        lesRally[0] = rally.linkRally;
    }
        let rallyCompleter = lesRally;
        let pseudo =userData.pseudo;
        let isPremium =userData.isPremium;
        let uid =userData.uid;
        console.log(pseudo,uid,isPremium,exp,rallyCompleter);
        database()
        .ref('Users/'+userData.uid)
        .set({
          pseudo,
          uid,
          isPremium,
          exp,
          rallyCompleter
        })
        .then(() => console.log('User Updated'))
        .catch((error) => console.log('Erreur serveur' + error));
    });

}
export async function getUserFromDatabase(){
    let uid = getUser()._user.uid;
    return await database().ref('Users/'+uid).once('value').then(snapshot => {
        let user = snapshot.val();
        return(user);
});


}