//Components
import WelcomeScreen from "../screens/WelcomeScreen";
import PlayScreen from "../screens/PlayScreen";
import PositionScreen from "../screens/PositionScreen";
import ParcoursScreen from "../screens/ParcoursScreen";
import AdventureScreen from "../screens/AdventureScreen";
import CaptureScreen from "../screens/CaptureScreen";
//Library
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

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
      <AppStack.Screen name="ParcoursScreen" component={ParcoursScreen} />
      <AppStack.Screen name="AdventureScreen" component={AdventureScreen} />
      <AppStack.Screen name="CaptureScreen" component={CaptureScreen} />
    </AppStack.Navigator>
  );
}
