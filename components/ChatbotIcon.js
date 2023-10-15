// components/ChatbotIcon.js
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Icon } from "react-native-elements";
import ChatWindow from "./ChatWindow";

const ChatbotIcon = () => {
  const [isChatOpen, setChatOpen] = useState(false);

  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.chatbotIconContainer}
        onPress={toggleChat}
      >
        <Icon name="chat" type="material" color="#517fa4" />
      </TouchableOpacity>
      <Modal
        visible={isChatOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChatOpen(false)}
      >
        <ChatWindow onClose={() => setChatOpen(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  chatbotIconContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default ChatbotIcon;
