import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";

export function IconButton({style,sourceImage,onPress}) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
     <Image
        style={styles.tinyLogo}
        source={sourceImage}
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
    borderRadius: 8,
    backgroundColor: "rgba(132,236,100,1)",
  },
  text: {
    color: "rgba(255,255,255,1)",
    fontSize: 24,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
});
