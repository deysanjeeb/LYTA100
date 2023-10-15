// ChatbotUI.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useChat } from "../contexts/ChatContext";

const ChatbotUI = ({ onClose }) => {
  const { chatMessages, addMessage } = useChat();
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() !== "") {
      const newMessage = {
        id: chatMessages.length + 1,
        text: inputText,
        isUser: true,
      };

      addMessage(newMessage);
      setInputText("");

      // Simulate a response from the chatbot after a brief delay
      setTimeout(() => {
        const botResponse = {
          id: chatMessages.length + 2,
          text: "Hello! I am a chatbot. How can I assist you?",
          isUser: false,
        };
        addMessage(botResponse);
      }, 1000);
    }
  };

  const handleAttachDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (result.type === "success") {
        const selectedDocument = {
          id: chatMessages.length + 1,
          text: `File Attached: ${result.name}`,
          isUser: true,
          document: result,
        };

        addMessage(selectedDocument);

        // Simulate a response from the chatbot after a brief delay
        setTimeout(() => {
          const botResponse = {
            id: chatMessages.length + 2,
            text: "Hello! I am a chatbot. How can I assist you?",
            isUser: false,
          };
          addMessage(botResponse);
        }, 1000);
      } else {
        // Handle document picker cancellation
        console.log("Document picker cancelled");
      }
    } catch (err) {
      // Handle other errors
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to pick a document. Please try again.");
    }
  };

  const renderItem = ({ item }) => {
    if (item.document) {
      return (
        <View style={item.isUser ? styles.userMessage : styles.botMessage}>
          <Text>{item.text}</Text>
          <Text>Document Attached: {item.document.name}</Text>
        </View>
      );
    }

    return (
      <View style={item.isUser ? styles.userMessage : styles.botMessage}>
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, styles.windowSize]}>
      <FlatList
        data={chatMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleAttachDocument}
        >
          <Ionicons name="attach" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
  },
  windowSize: {
    height: 300, // Set the desired height
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
  attachButton: {
    padding: 10,
  },
  sendButton: {
    padding: 10,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default ChatbotUI;
