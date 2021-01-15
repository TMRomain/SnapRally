//Library
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Component } from "react";

import { View, Text } from "react-native";

import { AuthStackNavigator } from "./src/navigators/AuthStackNavigator";
import { AppStackNavigator } from "./src/navigators/AppStackNavigator";
const RootStack = createStackNavigator();

function LoginApp() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  // Set an initializing state whilst Firebase connects

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  if (!user) {
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

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="RootStack" component={AppStackNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
export default class App extends Component {
  constructor(props) {  
    //constructor to set default state  
    super(props);  
    test = "Salut";
}  
  render() {
    return <LoginApp />;
  }
}
