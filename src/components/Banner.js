import React from "react";
import { StyleSheet, Image, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

export function Banner(...props) {
  return (
    <Image
      {...props}
      style={styles.image}
      source={require("../../assets/images/SnapRallyImage.jpg")}
      alt={"Image Banniere"}
    ></Image>
  );
}
const styles = StyleSheet.create({
  image: {
    width: windowWidth,
    position: "relative",
    maxWidth: 450,
  },
});
