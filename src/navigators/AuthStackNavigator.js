//Components
import LogIn from "../screens/LoginPage";
import SignIn from "../screens/SignInPage";

//Library
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Component } from "react";

const AuthStack = createStackNavigator();

export function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <AuthStack.Screen name="Connexion" component={LogIn} />
      <AuthStack.Screen name="Inscription" component={SignIn} />
    </AuthStack.Navigator>
  );
}
