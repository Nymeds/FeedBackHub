import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./src/navigation/AppStack";
import { ToastProvider } from "./src/context/ToastProvider";

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </ToastProvider>
  );
}
