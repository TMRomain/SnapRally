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
  },
});
