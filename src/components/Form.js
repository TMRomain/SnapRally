import React from "react";
import { StyleSheet, View } from "react-native";

export function Form({ children, style, ...props }) {
  return (
    <View {...props} style={[styles.form, style]}>
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  form: {
    flex: 2,
    position: "relative",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
});
