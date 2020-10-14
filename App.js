import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

export default function App() {
  const [isFontReady, setFontReady] = useState(false);
  useEffect(() => {
    async function loadFont() {
      return await Font.loadAsync({
        righteous: require("./assets/fonts/Righteous-Regular.ttf"),
      });
    }
    // after the loading set the font status to true
    loadFont().then(() => {
      setFontReady(true);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageStack}>
        <Image
          source={require("./assets/images/SnapRallyImage.jpg")}
          style={styles.imageBanniere}
        ></Image>
      </View>
      <View style={styles.logInContainer}>
        {isFontReady && <Text style={styles.identifier}>S'identifier</Text>}
        <TextInput
          placeholder="Email"
          dataDetector="address"
          style={styles.mailBox}
        ></TextInput>
        <TextInput
          placeholder="Mot de passe"
          dataDetector="address"
          style={styles.passwordBox}
        ></TextInput>

        <TouchableOpacity style={styles.buttonConnection}>
          {isFontReady && <Text style={styles.connection}>Se connecter</Text>}
        </TouchableOpacity>
        <View style={styles.lineSeparation}>
          <View style={styles.lineInformation}>
            <Text style={styles.nouvelUtilisateur}>Nouvel utilisateur?</Text>
          </View>
          <TouchableOpacity style={styles.button1}>
            {isFontReady && (
              <Text style={styles.creeUnCompte}>Créé un compte</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBanniere: {
    width: windowWidth,
  },
  logInContainer: {
    flex: 2,
    position: "relative",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  identifier: {
    fontFamily: "righteous",
    color: "#121212",
    fontSize: 24,
    opacity: 0.47,
  },
  mailBox: {
    color: "#121212",
    height: 38,
    width: 218,
  },
  passwordBox: {
    color: "#121212",
    height: 38,
    width: 218,
  },
  buttonConnection: {
    width: 208,
    height: 55,
    backgroundColor: "rgba(132,236,100,1)",
  },
  connection: {
    fontFamily: "righteous",
    color: "rgba(255,255,255,1)",
    fontSize: 24,
    marginTop: 11,
    marginLeft: 29,
  },
  nouvelUtilisateur: {
    top: 0,
    left: 0,
    position: "absolute",
    color: "#121212",
    opacity: 0.5,
  },
  lineInformation: {
    width: 121,
    height: 16,
    marginTop: 5,
  },
  button1: {
    width: 116,
    height: 27,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "rgba(132,236,100,1)",
    borderStyle: "solid",
    borderRadius: 9,
    marginLeft: 6,
  },
  creeUnCompte: {
    fontFamily: "righteous",
    color: "rgba(132,236,100,1)",
    marginTop: 4,
    marginLeft: 8,
  },
  lineSeparation: {
    height: 27,
    flexDirection: "row",
  },
});
