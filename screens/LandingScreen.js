// LandingScreen.js

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ChatbotIcon from "../components/ChatbotIcon";

const LandingScreen = ({ navigation }) => {
  const [chatbotVisible, setChatbotVisible] = useState(false);

  const handleChatbotPress = () => {
    setChatbotVisible(!chatbotVisible);
  };

  return (
    <View style={styles.container}>
      <Text>Landing Page</Text>
      {/* Your landing page content */}
      {chatbotVisible && <ChatbotUI />}
      <ChatbotIcon onPress={handleChatbotPress} isVisible={chatbotVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default LandingScreen;
