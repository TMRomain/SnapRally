import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export function TextButton({ title, style, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 8,
  },
  text: {
    color: "rgba(132,236,100,1)",
    fontSize: 14,
  },
});
