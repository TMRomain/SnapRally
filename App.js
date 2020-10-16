//Library
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Component } from "react";
import { AuthStackNavigator } from "./src/navigators/AuthStackNavigator";

const RootStack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <RootStack.Screen name="RootStack" component={AuthStackNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}
