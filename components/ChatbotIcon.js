// ChatbotIcon.js

import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatbotUI from "./ChatbotUI";

const ChatbotIcon = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleToggleChat}>
        <Ionicons name="ios-chatbubbles" size={36} color="white" />
      </TouchableOpacity>
      {isChatOpen && <ChatbotUI onClose={handleToggleChat} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});

export default ChatbotIcon;
