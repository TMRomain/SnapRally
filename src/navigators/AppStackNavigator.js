//Components
import WelcomeScreen from "../screens/WelcomeScreen";
import PlayScreen from "../screens/PlayScreen";
import PositionScreen from "../screens/PositionScreen";

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
      <AppStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <AppStack.Screen name="PlayScreen" component={PlayScreen} />
      <AppStack.Screen name="PositionScreen" component={PositionScreen} />
    </AppStack.Navigator>
  );
}
