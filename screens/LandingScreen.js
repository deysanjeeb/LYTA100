// screens/LandingPage.js
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ChatbotIcon from "../components/ChatbotIcon";

const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Landing Page!</Text>
      <Button
        title="Logout"
        onPress={() => {
          // Add any logout logic here if needed
          navigation.navigate("Login");
        }}
      />
      <ChatbotIcon />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default LandingPage;
