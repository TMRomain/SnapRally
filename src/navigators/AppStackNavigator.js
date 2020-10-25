//Components
import WelcomScreen from "../screens/WelcomeScreen";

//Library
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Component } from "react";

const AppStack = createStackNavigator();

export function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <AppStack.Screen name="WelcomScreen" component={WelcomScreen} />
    </AppStack.Navigator>
  );
}
