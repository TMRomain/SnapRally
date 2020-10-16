import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export function FormButton({ title, style, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    width: 208,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "rgba(132,236,100,1)",
  },
  text: {
    color: "rgba(255,255,255,1)",
    fontSize: 24,
  },
});
