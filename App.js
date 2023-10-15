// App.js
import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";

import { ChatProvider } from "./contexts/ChatContext";

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
