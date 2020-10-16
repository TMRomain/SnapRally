import React from "react";
import { StyleSheet, Text } from "react-native";

export function Heading({ children, style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]}>
      {children}
    </Text>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "#121212",
    fontSize: 24,
    opacity: 0.47,
    paddingTop: 50,
    paddingVertical: 20,
  },
});
