import React from "react";
import { StyleSheet, Text } from "react-native";

export function Error({ error, style }) {
  return <Text style={[styles.text, style]}>{error}</Text>;
}
const styles = StyleSheet.create({
  text: {
    color: "red",
    fontWeight: "bold",
  },
});
