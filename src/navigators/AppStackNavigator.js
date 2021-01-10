//Components
import WelcomeScreen from "../screens/WelcomeScreen";
import PlayScreen from "../screens/PlayScreen";
import PositionScreen from "../screens/PositionScreen";
import ParcoursScreen from "../screens/ParcoursScreen";
import CreateRallyScreen from "../screens/CreateRallyScreen";
import CaptureScreen from "../screens/CaptureScreen";
import ValideEtape from "../screens/ValideEtape";
import MapScreen from "../screens/MapScreen";
import ValidateRallyScreen from "../screens/ValidateRallyScreen";
import SolveRallyScreen from "../screens/SolveRallyScreen";
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
      <AppStack.Screen name="CreateRallyScreen" component={CreateRallyScreen} />
      <AppStack.Screen name="CaptureScreen" component={CaptureScreen} />
      <AppStack.Screen name="ValideEtape" component={ValideEtape} />
      <AppStack.Screen name="MapScreen" component={MapScreen} />
      <AppStack.Screen name="ValidateRallyScreen" component={ValidateRallyScreen} />
      <AppStack.Screen name="SolveRallyScreen" component={SolveRallyScreen} />
    </AppStack.Navigator>
  );
}
