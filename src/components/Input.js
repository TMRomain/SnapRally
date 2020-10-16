import React from "react";
import { StyleSheet, TextInput } from "react-native";

export function Input({ style, ...props }) {
  return <TextInput {...props} style={[styles.input, style]} />;
}
const styles = StyleSheet.create({
  input: {
    color: "#121212",
    height: 38,
    width: 218,
    margin: 20,
    borderColor: "rgba(158, 150, 150, 0.5)",
    borderWidth: 2,
    borderRadius: 20,
    paddingStart: 5,
  },
});
