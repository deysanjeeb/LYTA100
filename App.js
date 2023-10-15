// App.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ChatProvider } from "./contexts/ChatContext";
import AppNavigator from "./navigation/AppNavigator";

const App = () => {
  return (
    <NavigationContainer>
      <ChatProvider>
        <AppNavigator />
      </ChatProvider>
    </NavigationContainer>
  );
};
export default App;
